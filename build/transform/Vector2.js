define(["require", "exports", "./Matrix"], function (require, exports, Matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector2 extends Matrix_1.Matrix {
        get x() {
            return this._data[0][0];
        }
        set x(value) {
            this._data[0][0] = value;
        }
        get y() {
            return this._data[1][0];
        }
        set y(value) {
            this._data[1][0] = value;
        }
        get normalX() {
            return this._nX;
        }
        get normalY() {
            return this._nY;
        }
        constructor(x = 0, y = 0) {
            super(3, 1);
            this.x = x;
            this.y = y;
        }
        get magnitude() {
            return this._magnitude;
        }
        update() {
            this.calcMagnitude();
            this.calcNormal();
        }
        calcMagnitude() {
            this._magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        }
        calcNormal() {
            this._nX = this.x / this._magnitude;
            this._nY = this.y / this._magnitude;
        }
        copy(v) {
            super.copy(v);
            this.update();
        }
    }
    exports.Vector2 = Vector2;
});
//# sourceMappingURL=Vector2.js.map