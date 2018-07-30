define(["require", "exports", "../layer/Layer", "../layer/Asset", "./LayerFactory"], function (require, exports, Layer_1, Asset_1, LayerFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Loader {
        get rootLayer() {
            return this._rootLayer;
        }
        constructor(path, layers, cb) {
            this._cb = cb;
            this._assets = {};
            this._path = path;
            this._layers = layers;
            this._layerFactory = new LayerFactory_1.LayerFactory();
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
            Loader.canvasHeight = data.h;
            Loader.canvasWidth = data.w;
            Layer_1.Layer.FPS = 1000 / data.fr;
            this.loadAssets(data);
            this.loadLayers(data);
        }
        loadAssets(data) {
            this._waitFor = 0;
            for (let assetData of data.assets) {
                if (!assetData.w) {
                    continue;
                }
                let asset = new Asset_1.Asset(assetData, () => this.onLoad());
                this._assets[assetData.id] = asset;
                ++this._waitFor;
            }
        }
        loadLayers(data) {
            for (let ld of data.layers) {
                this._layers.push(this._layerFactory.createLayer(ld, this._assets));
            }
        }
        setParents(root) {
            for (let layer of this._layers) {
                if (layer.parentId) {
                    this._layers[layer.parentId - 1].addChild(layer);
                }
                else {
                    root.addChild(layer);
                }
            }
        }
        onLoad() {
            this._waitFor--;
            if (this._waitFor == 0) {
                let root = this._layerFactory.createEmpty();
                this.setParents(root);
                this._rootLayer = root;
                this._cb();
            }
        }
    }
    exports.Loader = Loader;
});
//# sourceMappingURL=Loader.js.map