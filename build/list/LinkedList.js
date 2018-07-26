define(["require", "exports", "./Link"], function (require, exports, Link_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LinkedList {
        constructor() {
            this._pool = null;
            this._last = null;
            this._first = null;
            this._current = null;
            this._length = 0;
        }
        get current() {
            if (this._current) {
                return this._current.data;
            }
            return null;
        }
        get first() {
            this._current = this._first;
            return this.current;
        }
        get last() {
            this._current = this._last;
            return this.current;
        }
        get next() {
            if (this._current) {
                this._current = this._current.next;
            }
            return this.current;
        }
        get prev() {
            if (this._current) {
                this._current = this._current.prev;
            }
            return this.current;
        }
        get length() {
            return this._length;
        }
        linkBefore(item) {
            if (!this._current || this._current == this._first) {
                this.pushToStart(item);
                return;
            }
            let link = this.createLink(item);
            this._current.prev.next = link;
            link.prev = this._current.prev;
            link.next = this._current;
            this._current.prev = link;
            this._length++;
        }
        linkAfter(item) {
            if (!this._current || this._current == this._last) {
                this.pushToEnd(item);
                return;
            }
            let link = this.createLink(item);
            this._current.next.prev = link;
            link.next = this._current.next;
            link.prev = this._current;
            this._current.next = link;
            this._length++;
        }
        pushToStart(item) {
            let link = this.createLink(item);
            if (!this._first) {
                this._current = link;
                this._last = link;
            }
            else {
                this._first.prev = link;
            }
            link.next = this._first;
            this._first = link;
            this._length++;
        }
        pushToEnd(item) {
            let link = this.createLink(item);
            if (!this._last) {
                this._current = link;
                this._first = link;
            }
            else {
                this._last.next = link;
            }
            link.prev = this._last;
            this._last = link;
            this._length++;
        }
        clear() {
            this.first;
            while (this.current) {
                this.removeCurrent();
            }
        }
        removeCurrent() {
            if (!this._current) {
                return;
            }
            if (this._current.next) {
                this._current.next.prev = this._current.prev;
            }
            if (this._current.prev) {
                this._current.prev.next = this._current.next;
            }
            if (this._current == this._first) {
                this._first = this._current.next;
            }
            if (this._current == this._last) {
                this._last = this._current.prev;
            }
            let tmp = this._current;
            this._current = this._current.next;
            if (this._pool) {
                this._pool.prev = tmp;
            }
            tmp.next = this._pool;
            this._pool = tmp;
            this._length--;
        }
        createLink(item) {
            let link;
            if (this._pool) {
                link = this._pool;
                this._pool = this._pool.next;
                link.next = null;
                link.prev = null;
            }
            else {
                link = new Link_1.Link();
            }
            link.data = item;
            return link;
        }
    }
    exports.LinkedList = LinkedList;
});
//# sourceMappingURL=LinkedList.js.map