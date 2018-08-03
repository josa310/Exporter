import { Layer } from "../layer/Layer";
import { Asset } from "../layer/Asset";
import { LayerFactory } from "./LayerFactory";
import { LinkedList } from './../list/LinkedList';
import { ResourceHandler } from './../layer/ResourceHandler';

export class Loader
{
    protected _path: string;
    protected _cb: () => void;
    protected _waitFor: number;
    protected _tmpLayers: LinkedList<Layer>;
    protected _layerFactory: LayerFactory;
    protected _httpRequest: XMLHttpRequest;

    constructor(path: string, cb: () => void)
    {
        this._cb = cb;
        this._path = path;
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
        ResourceHandler.CANVAS_WIDTH = data.w;
        ResourceHandler.CANVAS_HEIGHT = data.h;

        Layer.FPS = 1000 / data.fr;

        this.loadAssets(data);
        
        let layers: LinkedList<Layer> = new LinkedList<Layer>();
        this.loadLayers(data.layers, layers);

        this.setPrecomposits(layers);

        let root: Layer = this._layerFactory.createEmpty("root");
        this.setParents(root, layers);
        
        let rh: ResourceHandler = ResourceHandler.instance;
        rh.root = root;
        rh.layers = layers;
    }
    
    protected setPrecomposits(layers: LinkedList<Layer>): void
    {
        let layer: Layer = layers.first;
        while (layer)
        {
            if (layer.asset && layer.asset.isPrecomp)
            {
                let assetLayers: LinkedList<Layer> = layer.asset.layers;
                let al: Layer = assetLayers.first;
                while (al)
                {
                    layers.linkBefore(al);
                    
                    al = assetLayers.next;
                }
                // this.setParents(layer, assetLayers);
            }

            layer = layers.next;
        }
    }

    protected loadAssets(data: any): void
    {
        let assets: {[key: string]: Asset} = ResourceHandler.instance.assets;
        this._waitFor = 0;
        for (let assetData of data.assets)
        {
            let asset: Asset;

            if (assetData.layers)
            {
                let layers: LinkedList<Layer> = new LinkedList<Layer>();
                this.loadLayers(data.layers, layers);
                asset = new Asset(null, null, layers);
            }
            else
            {
                asset = new Asset(assetData, () => this.onLoad());
                ++this._waitFor;
            }

            assets[assetData.id] = asset;
        }
    }

    protected loadLayers(data: any, layers: LinkedList<Layer>): void
    {
        layers.clear();
        let assets: {[key: string]: Asset} = ResourceHandler.instance.assets;

        for (let ld of data)
        {
            let layer : Layer = this._layerFactory.createLayer(ld, assets);
            layers.pushToStart(layer);
            this._tmpLayers.pushToStart(layer);
        }
    }

    protected setParents(root: Layer, layers: LinkedList<Layer>): void
    {
        this._tmpLayers.copy(layers);
        let layer: Layer = layers.first;

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

            layer = layers.next;
        }

        this._tmpLayers.clear();
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
            this._cb();
        }
    }
}