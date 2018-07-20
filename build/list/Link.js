define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Link {
        constructor() {
            this._data = null;
            this._prev = null;
            this._next = null;
        }
        get next() {
            return this._next;
        }
        get prev() {
            return this._prev;
        }
        get data() {
            return this._data;
        }
        set next(value) {
            this._next = value;
        }
        set prev(value) {
            this._prev = value;
        }
        set data(value) {
            this._data = value;
        }
    }
    exports.Link = Link;
});
//# sourceMappingURL=Link.js.map