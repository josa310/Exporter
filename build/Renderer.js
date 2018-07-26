define(["require", "exports", "./loader/Loader"], function (require, exports, Loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Renderer {
        constructor() {
            this._canvas = document.getElementById("canvas");
            this._context = this._canvas.getContext("2d");
        }
        render(layers, root) {
            this._canvas.width = Loader_1.Loader.canvasWidth;
            this._canvas.height = Loader_1.Loader.canvasHeight;
            root.update();
            this.clear();
            let animating = false;
            for (let idx = layers.length - 1; idx >= 0; idx--) {
                this._context.save();
                let layer = layers[idx];
                animating = (layer.animating || animating);
                this.setParams(layer);
                if (layer.asset) {
                    this._context.drawImage(layer.asset.img, 0, 0);
                }
                this._context.restore();
            }
            if (!animating) {
                for (let layer of layers) {
                    layer.startAnim();
                }
            }
        }
        setParams(layer) {
            const t = layer.transform;
            this._context.translate(t.position.x, t.position.y);
            this._context.rotate(t.rotation);
            this._context.scale(t.scaling, t.scaling);
            if (layer.skew) {
                this._context.transform(1, layer.skew / 26 * Math.abs(Math.cos(layer.skewAxis * Math.PI / 180)), layer.skew / 26 * Math.abs(Math.sin(layer.skewAxis * Math.PI / 180)), 1, 0, 0);
            }
            this._context.globalAlpha = layer.animParams.opacity;
        }
        clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.fillStyle = "#BBBBBB";
        }
    }
    exports.Renderer = Renderer;
});
//# sourceMappingURL=Renderer.js.map