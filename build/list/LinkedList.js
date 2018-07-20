define(["require", "exports", "./Link"], function (require, exports, Link_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LinkedList {
        constructor() {
            this._last = null;
            this._first = null;
            this._current = null;
            this._length = 0;
            this._lastIdx = 0;
        }
        get prev() {
            if (this._current.prev) {
                this._current = this._current.prev;
                this._lastIdx--;
                return this._current.data;
            }
            return null;
        }
        get next() {
            if (this._current.next) {
                this._current = this._current.next;
                this._lastIdx++;
                return this._current.data;
            }
            return null;
        }
        get current() {
            return this._current.data;
        }
        get first() {
            if (this._first) {
                this._current = this._first;
                return this._current.data;
            }
            return null;
        }
        get length() {
            return this._length;
        }
        getByIdx(idx) {
            if (idx == (this._lastIdx + 1)) {
                return this.next;
            }
            else if (idx == (this._lastIdx - 1)) {
                return this.prev;
            }
            if (this.checkIdx(idx)) {
                return this._current.data;
            }
            return null;
        }
        add(item) {
            let idx = Math.max(0, this._length - 1);
            this.linkAfter(item, idx);
        }
        linkAfter(item, idx = this._lastIdx) {
            if (!this.checkIdx(idx)) {
                return;
            }
            let link = this.prepLink(item);
            if (this._current) {
                if (this._current.next) {
                    this._current.next.prev = link;
                }
                else {
                    this._last = link;
                }
                link.prev = this._current;
                link.next = this._current.next;
                this._current.next = link;
            }
            else {
                this._first = link;
                this._last = link;
            }
            this._current = link;
            this._length++;
        }
        linkBefore(item, idx = this._lastIdx) {
            if (this.checkIdx(idx)) {
                return;
            }
            let link = this.prepLink(item);
            if (this._current) {
                if (this._current.prev) {
                    this._current.prev.next = link;
                }
                else {
                    this._first = link;
                }
                link.prev = this._current.prev;
                link.next = this._current;
                this._current.prev = link;
            }
            else {
                this._first = link;
                this._last = link;
            }
            this._current = link;
            this._length++;
        }
        checkIdx(idx) {
            if (idx < 0 || idx > this._length) {
                return false;
            }
            while (this._lastIdx < idx) {
                this.next;
            }
            while (idx > this._lastIdx) {
                this.prev;
            }
            return true;
        }
        prepLink(item) {
            let link = this.getLink();
            link.data = item;
            return link;
        }
        getLink() {
            let retVal;
            if (this._pool) {
                retVal = this._pool;
                this._pool = this._pool.next;
            }
            else {
                retVal = new Link_1.Link();
            }
            return retVal;
        }
    }
    exports.LinkedList = LinkedList;
});
//# sourceMappingURL=LinkedList.js.map