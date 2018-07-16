define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Matrix {
        get data() {
            return this._data;
        }
        constructor(m, n) {
            this._m = m;
            this._n = n;
            this.allocate();
        }
        dot(m, retVal) {
            if (m._m != this._n) {
                return null;
            }
            for (let i = 0; i < this._m; i++) {
                for (let j = 0; j < m._n; j++) {
                    let val = 0;
                    for (let k = 0; k < m._m; k++) {
                        val += (this._data[i][k] * m._data[k][j]);
                    }
                    this._tmpData[i][j] = val;
                }
            }
            for (let i = 0; i < this._m; i++) {
                for (let j = 0; j < m._n; j++) {
                    retVal._data[i][j] = this._tmpData[i][j];
                }
            }
        }
        mult(val) {
            for (let i = 0; i < this._m; i++) {
                for (let j = 0; j < this._n; j++) {
                    this._data[i][j] *= val;
                }
            }
            return this;
        }
        copy(m) {
            if (m._m != this._m || m._n != this._n) {
                this._m = m._m;
                this._n = m._n;
                this.allocate();
            }
            for (let i = 0; i < this._m; i++) {
                for (let j = 0; j < this._n; j++) {
                    this._data[i][j] = m._data[i][j];
                }
            }
        }
        identity() {
            for (let i = 0; i < this._m; i++) {
                for (let j = 0; j < this._n; j++) {
                    this._data[i][j] = (i == j) ? 1 : 0;
                }
            }
        }
        allocate() {
            this._data = new Array();
            this._tmpData = new Array();
            for (let i = 0; i < this._m; i++) {
                this._data[i] = new Array();
                this._tmpData[i] = new Array();
                for (let j = 0; j < this._n; j++) {
                    this._data[i].push(0);
                    this._tmpData[i].push(0);
                }
            }
        }
    }
    exports.Matrix = Matrix;
});
//# sourceMappingURL=Matrix.js.map