define(["require", "exports", "./Transform2D", "./Vector2", "../MathUtils", "../animation/Animation", "../animation/AnimParams", "../animation/AnimationHandler"], function (require, exports, Transform2D_1, Vector2_1, MathUtils_1, Animation_1, AnimParams_1, AnimationHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(data, asset) {
            this.updated = false;
            this._asset = asset;
            this._globalTransform = new Transform2D_1.Transform2D();
            this._animParams = new AnimParams_1.AnimParams();
            if (data == null) {
                return;
            }
            this.init(data);
        }
        get animParams() {
            return this._animParams;
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
            this._globalTransform.dot(this._animParams.transform, this._globalTransform);
        }
        init(data) {
            this._next = null;
            this._prev = null;
            this._parent = null;
            this._child = null;
            this._id = data.ind;
            this._parentId = data.parent;
            this._animation = new AnimationHandler_1.AnimationHandler();
            if (data.ef) {
                this.skew = data.ef[0].ef[5].v.k;
                this.skewAxis = data.ef[0].ef[6].v.k;
            }
            const transitions = data.ks;
            this.processTranslation(transitions.p);
            this.processRotation(transitions.r);
            this.processScale(transitions.s);
            this.processAnchor(transitions.a);
            this.processOpacity(transitions.o);
            this._animation.params = this._animParams;
            this._animation.start();
        }
        updateAnimations() {
            this._animation.update();
            this._animParams.copy(this._animation.params);
        }
        processTranslation(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.TRANSLATION);
            }
            else {
                this._animParams.translation = new Vector2_1.Vector2(data.k[0], data.k[1]);
            }
        }
        processRotation(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.ROTATION);
            }
            else {
                this.animParams.rotation = data.k * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
        }
        processScale(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.SCALE);
            }
            else {
                this._animParams.scale = new Vector2_1.Vector2(data.k[0] / 100, data.k[1] / 100);
            }
        }
        processAnchor(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.ANCHOR);
            }
            else {
                this._animParams.anchor = new Vector2_1.Vector2(-data.k[0], -data.k[1]);
            }
        }
        processOpacity(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.OPACITY);
            }
            else {
                this._animParams.opacity = data.k / 100;
            }
        }
        extractAnim(data, type) {
            let cnt = data.k.length;
            for (let idx = 0; idx < cnt - 1; idx++) {
                let frameCnt = data.k[idx + 1].t - data.k[idx].t;
                let animation = new Animation_1.Animation(frameCnt, data.k[idx].s, data.k[idx].e, type);
                this._animation.add(animation);
            }
        }
    }
    Layer.FPS = 1000 / 30;
    exports.Layer = Layer;
});
//# sourceMappingURL=Layer.js.map