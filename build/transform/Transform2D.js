define(["require", "exports", "../transform/Matrix", "./Vector2"], function (require, exports, Matrix_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Transform2D extends Matrix_1.Matrix {
        get rotation() {
            return this._rotation;
        }
        get scaling() {
            return this._scale;
        }
        get position() {
            return this._translation;
        }
        constructor() {
            super(3, 3);
            this._dirty = true;
            this._matrix = new Matrix_1.Matrix(3, 3);
            this._matrix.identity();
            this.identity();
        }
        init() {
            this._translation = new Vector2_1.Vector2();
            this._rotation = 0;
            this._scale = new Vector2_1.Vector2(1, 1);
            this.update();
        }
        identity() {
            super.identity();
            this.init();
        }
        copy(m) {
            super.copy(m);
            this.update();
        }
        dot(m, retVal) {
            super.dot(m, retVal);
            if (retVal instanceof Transform2D) {
                retVal.update();
            }
        }
        rotate(a) {
            this._matrix.identity();
            this._matrix.data[0][0] = Math.cos(a);
            this._matrix.data[0][1] = -Math.sin(a);
            this._matrix.data[1][0] = Math.sin(a);
            this._matrix.data[1][1] = Math.cos(a);
            this.dot(this._matrix, this);
        }
        scale(sx, sy) {
            this._matrix.identity();
            this._matrix.data[0][0] = sx;
            this._matrix.data[1][1] = sy;
            this.dot(this._matrix, this);
        }
        translate(x, y) {
            this._matrix.identity();
            this._matrix.data[0][2] = x;
            this._matrix.data[1][2] = y;
            this.dot(this._matrix, this);
        }
        update() {
            this._dirty = true;
            this.updateScale();
            this.updateRotation();
            this.updateTranslation();
        }
        updateTranslation() {
            this._translation.x = this.data[0][2];
            this._translation.y = this.data[1][2];
        }
        updateScale() {
            this._scale.x = Math.sign(this._data[0][0]) * Math.sqrt(this._data[0][0] * this._data[0][0] + this._data[0][1] * this._data[0][1]);
            this._scale.y = Math.sign(this._data[1][1]) * Math.sqrt(this._data[1][0] * this._data[1][0] + this._data[1][1] * this._data[1][1]);
        }
        updateRotation() {
            this._rotation = Math.atan2(this._data[1][0], this._data[1][1]);
        }
    }
    exports.Transform2D = Transform2D;
});
//# sourceMappingURL=Transform2D.js.map