import { Asset } from './layer/Asset';
import { Layer } from './layer/Layer';

export class Loader
{
    protected _data: any;
    protected _path: string;
    protected _cb: () => void;
    protected _waitFor: number;
    protected _layers: Layer[];
    protected _httpRequest: XMLHttpRequest;
    protected _assets: {[key: string]: Asset};

    constructor(path: string, layers: Layer[], cb: () => void)
    {
        this._cb = cb;
        this._assets = {};
        this._path = path;
        this._layers = layers;

        this.loadJSON();
    }
    
    protected loadJSON(): void
    {
        this._httpRequest = new XMLHttpRequest();
        this._httpRequest.onreadystatechange = () => this.httpRequest();
        
        this._httpRequest.open("GET", this._path, true);
        this._httpRequest.send();
    }
    
    protected httpRequest(): void
    {
        if (this._httpRequest.readyState === XMLHttpRequest.DONE) 
        {
            if (this._httpRequest.status === 200)
            {
                this.load(JSON.parse(this._httpRequest.responseText));
            }
        }
    }
    
    protected load(data: any): void
    {
        this.loadAssets(data);
        this.loadLayers(data);
    }
    
    protected loadAssets(data: any): void
    {
        this._waitFor = 0;
        for (let assetData of data.assets)
        {
            let asset: Asset = new Asset(assetData, () => this.onLoad());
            this._assets[assetData.id] = asset;

            ++this._waitFor;
        }
    }

    protected loadLayers(data: any): void
    {
        for (let layerData of data.layers)
        {
            this._layers.push(new Layer(layerData, this._assets[layerData.refId]));
        }
    }

    protected orderLayers(root: Layer)
    {
        for (let layer of this._layers)
        {
            (layer.parentId ? this._layers[layer.parentId - 1] : root).addChild(layer);
        }
    }

    protected updateLayerTransforms(layer: Layer): void
    {
        while (layer)
        {
            layer.updateTransform();
            
            if (!layer.updated && layer.firstChild)
            {
                layer.updated = true;
                layer = layer.firstChild;
            }
            else if (layer.next)
            {
                layer = layer.next;
            }
            else
            {
                layer = layer.parent;
            }
        }
    }

    protected onLoad(): void
    {
        this._waitFor--;
        if (this._waitFor == 0)
        {
            let root: Layer = new Layer(null, null);
            this.orderLayers(root);
            this.updateLayerTransforms(root);
            this._cb();
        }
    }
}