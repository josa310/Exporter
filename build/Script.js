define(["require", "exports", "./loader/Loader", "./layer/Layer", "./Renderer"], function (require, exports, Loader_1, Layer_1, Renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Script {
        constructor(path) {
            this._renderer = new Renderer_1.Renderer();
            this._layers = new Array();
            this._loader = new Loader_1.Loader(path, this._layers, () => this.onLoad());
        }
        onLoad() {
            this._root = this._loader.rootLayer;
            this.start();
        }
        start() {
            this._timerId = setInterval(() => this.update(), Layer_1.Layer.FPS);
        }
        update() {
            this._renderer.render(this._layers, this._root);
        }
    }
    exports.Script = Script;
});
//# sourceMappingURL=Script.js.map