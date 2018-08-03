define(["require", "exports", "../layer/Layer", "../layer/Asset", "./LayerFactory", "./../list/LinkedList", "./../layer/ResourceHandler"], function (require, exports, Layer_1, Asset_1, LayerFactory_1, LinkedList_1, ResourceHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Loader {
        constructor(path, cb) {
            this._cb = cb;
            this._path = path;
            this._layerFactory = new LayerFactory_1.LayerFactory();
            this._tmpLayers = new LinkedList_1.LinkedList();
            this.loadJSON();
        }
        loadJSON() {
            this._httpRequest = new XMLHttpRequest();
            this._httpRequest.onreadystatechange = () => this.httpRequest();
            this._httpRequest.open("GET", this._path, true);
            this._httpRequest.send();
        }
        httpRequest() {
            if (this._httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this._httpRequest.status === 200) {
                    this.load(JSON.parse(this._httpRequest.responseText));
                }
            }
        }
        load(data) {
            ResourceHandler_1.ResourceHandler.CANVAS_WIDTH = data.w;
            ResourceHandler_1.ResourceHandler.CANVAS_HEIGHT = data.h;
            Layer_1.Layer.FPS = 1000 / data.fr;
            this.loadAssets(data);
            let layers = new LinkedList_1.LinkedList();
            this.loadLayers(data.layers, layers);
            this.setPrecomposits(layers);
            let root = this._layerFactory.createEmpty("root");
            this.setParents(root, layers);
            let rh = ResourceHandler_1.ResourceHandler.instance;
            rh.root = root;
            rh.layers = layers;
        }
        setPrecomposits(layers) {
            let layer = layers.first;
            while (layer) {
                if (layer.asset && layer.asset.isPrecomp) {
                    let assetLayers = layer.asset.layers;
                    let al = assetLayers.first;
                    while (al) {
                        layers.linkBefore(al);
                        al = assetLayers.next;
                    }
                }
                layer = layers.next;
            }
        }
        loadAssets(data) {
            let assets = ResourceHandler_1.ResourceHandler.instance.assets;
            this._waitFor = 0;
            for (let assetData of data.assets) {
                let asset;
                if (assetData.layers) {
                    let layers = new LinkedList_1.LinkedList();
                    this.loadLayers(data.layers, layers);
                    asset = new Asset_1.Asset(null, null, layers);
                }
                else {
                    asset = new Asset_1.Asset(assetData, () => this.onLoad());
                    ++this._waitFor;
                }
                assets[assetData.id] = asset;
            }
        }
        loadLayers(data, layers) {
            layers.clear();
            let assets = ResourceHandler_1.ResourceHandler.instance.assets;
            for (let ld of data) {
                let layer = this._layerFactory.createLayer(ld, assets);
                layers.pushToStart(layer);
                this._tmpLayers.pushToStart(layer);
            }
        }
        setParents(root, layers) {
            this._tmpLayers.copy(layers);
            let layer = layers.first;
            while (layer) {
                if (layer.parentId) {
                    this.getLayerById(layer.parentId).addChild(layer);
                }
                else {
                    root.addChild(layer);
                }
                layer = layers.next;
            }
            this._tmpLayers.clear();
        }
        getLayerById(id) {
            let layer = this._tmpLayers.first;
            while (layer) {
                if (layer.id == id) {
                    return layer;
                }
                layer = this._tmpLayers.next;
            }
            return layer;
        }
        onLoad() {
            this._waitFor--;
            if (this._waitFor == 0) {
                this._cb();
            }
        }
    }
    exports.Loader = Loader;
});
//# sourceMappingURL=Loader.js.map