define(["require", "exports", "./Loader"], function (require, exports, Loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Renderer {
        constructor() {
            this._canvas = document.getElementById("canvas");
            this._context = this._canvas.getContext("2d");
        }
        render(layers) {
            this._canvas.width = Loader_1.Loader.canvasWidth;
            this._canvas.height = Loader_1.Loader.canvasHeight;
            this.clear();
            for (let idx = layers.length - 1; idx >= 0; idx--) {
                this._context.save();
                const layer = layers[idx];
                layer.updateAnimations();
                const p = layer.animParams;
                this.setParams(layer);
                this._context.drawImage(layer.asset.img, p.anchor.x, p.anchor.y);
                this._context.restore();
            }
        }
        setParams(layer) {
            const p = layer.animParams;
            this._context.translate(p.translation.x, p.translation.y);
            this._context.rotate(p.rotation);
            this._context.scale(p.scale.x, p.scale.y);
            if (layer.skew) {
                this._context.transform(1, layer.skew / 26 * Math.abs(Math.cos(layer.skewAxis * Math.PI / 180)), layer.skew / 26 * Math.abs(Math.sin(layer.skewAxis * Math.PI / 180)), 1, 0, 0);
            }
            this._context.globalAlpha = p.opacity;
        }
        clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.fillStyle = "#BBBBBB";
        }
        drawCanvas() {
            this._context.strokeStyle = "#FF0000";
            this._context.strokeRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
    exports.Renderer = Renderer;
});
//# sourceMappingURL=Renderer.js.map