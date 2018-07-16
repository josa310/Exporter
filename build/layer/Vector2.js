define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector2 {
        get x() {
            return this._x;
        }
        set x(value) {
            this._x = value;
        }
        get y() {
            return this._y;
        }
        set y(value) {
            this._y = value;
        }
        get normalX() {
            return this._nX;
        }
        get normalY() {
            return this._nY;
        }
        constructor(x = 0, y = 0) {
            this._x = x;
            this._y = y;
        }
        get magnitude() {
            return this._magnitude;
        }
        update() {
            this.calcMagnitude();
            this.calcNormal();
        }
        calcMagnitude() {
            this._magnitude = Math.sqrt(this._x * this._x + this._y * this._y);
        }
        calcNormal() {
            this._nX = this._x / this._magnitude;
            this._nY = this._y / this._magnitude;
        }
    }
    exports.Vector2 = Vector2;
});
//# sourceMappingURL=Vector2.js.map