import { LinkedList } from './../list/LinkedList';
import { Layer } from "../layer/Layer";
import { Asset } from "../layer/Asset";
import { LayerFactory } from "./LayerFactory";

export class Loader
{
    public static canvasWidth: number;
    public static canvasHeight: number;

    protected _data: any;
    protected _path: string;
    protected _cb: () => void;
    protected _waitFor: number;
    protected _rootLayer: Layer;
    protected _layers: LinkedList<Layer>;
    protected _tmpLayers: LinkedList<Layer>;
    protected _layerFactory: LayerFactory;
    protected _httpRequest: XMLHttpRequest;
    protected _assets: {[key: string]: Asset};

    public get rootLayer(): Layer
    {
        return this._rootLayer;
    }

    constructor(path: string, layers: LinkedList<Layer>, cb: () => void)
    {
        this._cb = cb;
        this._assets = {};
        this._path = path;
        this._layers = layers;
        this._layerFactory = new LayerFactory();
        this._tmpLayers = new LinkedList<Layer>();

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
        Loader.canvasHeight = data.h;
        Loader.canvasWidth = data.w;
        Layer.FPS = 1000 / data.fr;
        this.loadAssets(data);
        this.loadLayers(data);
    }
    
    protected loadAssets(data: any): void
    {
        this._waitFor = 0;
        for (let assetData of data.assets)
        {
            // TODO: Handle this
            if (!assetData.w)
            {
                continue;
            }
            let asset: Asset = new Asset(assetData, () => this.onLoad());
            this._assets[assetData.id] = asset;

            ++this._waitFor;
        }
    }

    protected loadLayers(data: any): void
    {
        for (let ld of data.layers)
        {
            let layer : Layer = this._layerFactory.createLayer(ld, this._assets);
            this._layers.pushToStart(layer);
            this._tmpLayers.pushToStart(layer);
        }
    }

    protected setParents(root: Layer)
    {
        let layer: Layer = this._layers.first;

        while (layer)
        {
            if (layer.parentId)
            {
                this.getLayerById(layer.parentId).addChild(layer);
            }
            else
            {
                root.addChild(layer);
            }

            layer = this._layers.next;
        }
    }

    protected getLayerById(id: string): Layer
    {
        let layer: Layer = this._tmpLayers.first;

        while (layer)
        {
            if (layer.id == id)
            {
                return layer;
            }

            layer = this._tmpLayers.next;
        }

        return layer;
    }

    protected onLoad(): void
    {
        this._waitFor--;
        if (this._waitFor == 0)
        {
            let root: Layer = this._layerFactory.createEmpty("root");
            this.setParents(root);
            this._rootLayer = root;
            this._cb();
        }
    }
}