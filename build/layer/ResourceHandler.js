define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ResourceHandler {
        get instance() {
            if (!ResourceHandler._instance) {
                ResourceHandler._instance = new ResourceHandler();
            }
            return ResourceHandler._instance;
        }
        get root() {
            return this._root;
        }
        get layers() {
            return this._layers;
        }
        get assets() {
            return this._assets;
        }
        set root(value) {
            this._root = value;
        }
        set layers(value) {
            this._layers = value;
        }
        set assets(value) {
            this._assets = value;
        }
        constructor() {
        }
    }
    exports.ResourceHandler = ResourceHandler;
});
//# sourceMappingURL=ResourceHandler.js.map