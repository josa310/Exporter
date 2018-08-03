define(["require", "exports", "./Layer", "./../list/LinkedList"], function (require, exports, Layer_1, LinkedList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Asset {
        get isPrecomp() {
            return this._isPreComp;
        }
        get img() {
            return this._img;
        }
        get layers() {
            return this._layers;
        }
        constructor(data, cb, layers = null) {
            this._isPreComp = layers != null;
            if (this._isPreComp) {
                this._layers = layers;
                return;
            }
            this._id = data.id;
            this._src = data.u + data.p;
            this._width = data.w;
            this._height = data.h;
            this._img = document.createElement("img");
            this._img.src = data.u + data.p;
            this._img.onload = cb;
        }
        duplicate() {
            if (!this._isPreComp) {
                return null;
            }
            let retVal = new Asset(null, null, new LinkedList_1.LinkedList());
            this._layers.first;
            while (this._layers.current) {
                retVal._layers.pushToEnd(Layer_1.Layer.copy(this._layers.current));
                this._layers.next;
            }
            return retVal;
        }
    }
    exports.Asset = Asset;
});
//# sourceMappingURL=Asset.js.map