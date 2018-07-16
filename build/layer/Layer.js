define(["require", "exports", "./Transform", "./Vector2", "../MathUtils"], function (require, exports, Transform_1, Vector2_1, MathUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(data, asset) {
            this.updated = false;
            this._asset = asset;
            this._localTransoform = new Transform_1.Transform();
            this._globalTransform = new Transform_1.Transform();
            if (data == null) {
                return;
            }
            this.init(data);
        }
        get firstChild() {
            return this._child;
        }
        get parentId() {
            return this._parentId;
        }
        get next() {
            return this._next;
        }
        get parent() {
            return this._parent;
        }
        get transform() {
            return this._globalTransform;
        }
        get asset() {
            return this._asset;
        }
        get anchor() {
            return this._anchorPoint;
        }
        get opacity() {
            return this._opacity;
        }
        addChild(child) {
            if (this._child) {
                this._child._prev = child;
                child._next = this._child;
            }
            this._child = child;
            this._child._parent = this;
        }
        updateTransform() {
            if (this._parent) {
                this._globalTransform.copy(this._parent._globalTransform);
            }
            else {
                this._globalTransform.identity();
            }
            this._globalTransform.dot(this._localTransoform, this._globalTransform);
        }
        init(data) {
            this._next = null;
            this._prev = null;
            this._parent = null;
            this._child = null;
            this._id = data.ind;
            this._parentId = data.parent;
            this._opacity = data.ks.o.k / 100;
            this._anchorPoint = new Vector2_1.Vector2(-data.ks.a.k[0], -data.ks.a.k[1]);
            if (data.ef) {
                this.skew = data.ef[0].ef[5].v.k;
                this.skewAxis = data.ef[0].ef[6].v.k;
            }
            this._localTransoform.translate(data.ks.p.k[0], data.ks.p.k[1]);
            this._localTransoform.rotate(data.ks.r.k * MathUtils_1.MathUtils.DEG_TO_RAD);
            this._localTransoform.scale(data.ks.s.k[0] / 100);
            this._localTransoform.translate(this._anchorPoint.x, this._anchorPoint.y);
        }
    }
    exports.Layer = Layer;
});
//# sourceMappingURL=Layer.js.map