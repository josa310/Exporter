define(["require", "exports", "./MathUtils", "./Sprite"], function (require, exports, MathUtils_1, Sprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Script {
        constructor(path) {
            this._canvas = document.getElementById('canvas');
            this._ctx = this._canvas.getContext('2d');
            this._jsonImg = new Array();
            this.loadJSON(path);
            this._isCanvasDraw = true;
            this._translatePointWithParent = [0, 0, 0];
        }
        loadJSON(path) {
            this._httpRequest = new XMLHttpRequest();
            this._httpRequest.onreadystatechange = () => this.httpRequest();
            this._httpRequest.open("GET", path, true);
            this._httpRequest.send();
        }
        httpRequest() {
            if (this._httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this._httpRequest.status === 200) {
                    this.processData(JSON.parse(this._httpRequest.responseText));
                }
            }
        }
        processData(data) {
            let idx = 0;
            this._data = data;
            this._canvas.width = data.w;
            this._canvas.height = data.h;
            for (let asset of data.assets) {
                this._jsonImg.push(new Sprite_1.Sprite(data, idx));
                let img = document.createElement("img");
                this._jsonImg[idx].img = img;
                img.src = asset.u + asset.p;
                img.onload = this.onImgLoad.bind(this, this._jsonImg[idx]);
                idx++;
            }
        }
        onImgLoad(sprite) {
            sprite.loaded = true;
            this.render();
        }
        render() {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            for (let idx = this._jsonImg.length - 1; idx >= 0; idx--) {
                let sprite = this._jsonImg[idx];
                if (sprite.loaded) {
                    this.drawImage(sprite);
                }
            }
        }
        drawImage(sprite) {
            this._ctx.save();
            this.setDrawParams(sprite);
            this._ctx.drawImage(sprite.img, -sprite.ap[0], -sprite.ap[1]);
            this.drawCanvas(this._isCanvasDraw);
            this._ctx.restore();
        }
        setDrawParams(sprite) {
            this._ctx.globalAlpha = sprite.opacity / 100;
            if (sprite.parent) {
                this._translatePointWithParent = this.imgParentingSetup(sprite);
                this._ctx.translate(this._translatePointWithParent[0], this._translatePointWithParent[1]);
                this._rotationWithParent = sprite.rotation + sprite.parent.rotation;
                let sinA = MathUtils_1.MathUtils.sinDeg(sprite.parent.rotation);
                let cosA = MathUtils_1.MathUtils.cosDeg(sprite.parent.rotation);
                let X = (sprite.pos[0] * (sprite.parent.scale[0] / 100)) - (sprite.parent.ap[0] * (sprite.parent.scale[0] / 100));
                let Y = (sprite.pos[1] * (sprite.parent.scale[1] / 100)) - (sprite.parent.ap[1] * (sprite.parent.scale[1] / 100));
                this._ctx.translate(-this._translatePointWithParent[0] + sprite.parent.pos[0], -this._translatePointWithParent[1] + sprite.parent.pos[1]);
                this._ctx.translate((X * cosA) - (Y * sinA), (Y * cosA) + (X * sinA));
                this._ctx.rotate((this._rotationWithParent) * MathUtils_1.MathUtils.DEG_TO_RAD);
                let scaleX = (sprite.parent.scale[0] * sprite.scale[0]) / 100;
                let scaleY = (sprite.parent.scale[1] * sprite.scale[1]) / 100;
                this._ctx.scale(scaleX / 100, scaleY / 100);
            }
            else {
                this._ctx.translate(sprite.pos[0], sprite.pos[1]);
                this._ctx.rotate(sprite.rotation * MathUtils_1.MathUtils.DEG_TO_RAD);
                this._ctx.scale(sprite.scale[0] / 100, sprite.scale[1] / 100);
            }
            if (sprite.skew) {
                this._ctx.transform(1, sprite.skew / 70 * Math.abs(Math.cos(sprite.skewAxis * Math.PI / 180)), sprite.skew / 70 * Math.abs(Math.sin(sprite.skewAxis * Math.PI / 180)), 1, 0, 0);
            }
        }
        drawCanvas(isDrawn) {
            if (isDrawn) {
                this._ctx.strokeStyle = "#FF0000";
                this._ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
            }
        }
        imgParentingSetup(sprite) {
            let _posWithParentX = sprite.parent.pos[0] - ((sprite.parent.ap[0] * (sprite.parent.scale[0] / 100))) + (sprite.pos[0] * (sprite.parent.scale[0] / 100));
            let _posWithParentY = sprite.parent.pos[1] - ((sprite.parent.ap[1] * (sprite.parent.scale[1] / 100))) + (sprite.pos[1] * (sprite.parent.scale[1] / 100));
            return [_posWithParentX, _posWithParentY];
        }
    }
    exports.Script = Script;
});
//# sourceMappingURL=Script.js.map