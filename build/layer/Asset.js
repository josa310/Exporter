define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Asset {
        get img() {
            return this._img;
        }
        constructor(data, cb) {
            this._id = data.id;
            this._src = data.u + data.p;
            this._width = data.w;
            this._height = data.h;
            this._img = document.createElement("img");
            this._img.src = data.u + data.p;
            this._img.onload = cb;
        }
    }
    exports.Asset = Asset;
});
//# sourceMappingURL=Asset.js.map