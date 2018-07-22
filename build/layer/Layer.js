define(["require", "exports", "./Transform2D", "./Vector2", "../MathUtils", "../animation/Animation", "../animation/AnimParams", "../animation/AnimationHandler", "../list/LinkedList"], function (require, exports, Transform2D_1, Vector2_1, MathUtils_1, Animation_1, AnimParams_1, AnimationHandler_1, LinkedList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(data, asset) {
            this._asset = asset;
            this._updated = false;
            this._globalTransform = new Transform2D_1.Transform2D();
            this._params = new AnimParams_1.AnimParams();
            if (data == null) {
                return;
            }
            this.init(data);
        }
        get updated() {
            return this._updated;
        }
        set updated(value) {
            this._updated = value;
        }
        get animParams() {
            return this._params;
        }
        get children() {
            return this._children;
        }
        get parentId() {
            return this._parentId;
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
            if (!this._children) {
                this._children = new LinkedList_1.LinkedList();
            }
            this._children.pushToEnd(child);
            child._parent = this;
        }
        updateTransform() {
            if (this._parent) {
                this._globalTransform.copy(this._parent._globalTransform);
            }
            else {
                this._globalTransform.identity();
            }
            this._globalTransform.dot(this._params.transform, this._globalTransform);
            this._updated = true;
        }
        init(data) {
            this._parent = null;
            this._children = null;
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
            this._animation.params = this._params;
            this._params.copy(this._animation.params);
        }
        startAnim() {
            this._animation.start();
        }
        updateAnimation() {
            let retVal = this._animation.update();
            this._params.copy(this._animation.params);
            return retVal;
        }
        processTranslation(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.TRANSLATION);
                this._params.translation = new Vector2_1.Vector2(data.k[0].s[0], data.k[0].s[1]);
            }
            else {
                this._params.translation = new Vector2_1.Vector2(data.k[0], data.k[1]);
            }
        }
        processRotation(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.ROTATION);
                this._params.rotation = data.k[0].s[0] * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
            else {
                this.animParams.rotation = data.k * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
        }
        processScale(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.SCALE);
                this._params.scale = new Vector2_1.Vector2(data.k[0].s[0] / 100, data.k[0].s[1] / 100);
            }
            else {
                this._params.scale = new Vector2_1.Vector2(data.k[0] / 100, data.k[1] / 100);
            }
        }
        processAnchor(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.ANCHOR);
                this._params.anchor = new Vector2_1.Vector2(-data.k[0].s[0], -data.k[0].s[1]);
            }
            else {
                this._params.anchor = new Vector2_1.Vector2(-data.k[0], -data.k[1]);
            }
        }
        processOpacity(data) {
            if (data.a) {
                this.extractAnim(data, Animation_1.AnimType.OPACITY);
                this._params.opacity = data.k[0].s[0];
            }
            else {
                this._params.opacity = data.k / 100;
            }
        }
        extractAnim(data, type) {
            let cnt = data.k.length;
            for (let idx = 0; idx < cnt - 1; idx++) {
                let animation = new Animation_1.Animation(data.k[idx].t, data.k[idx + 1].t, data.k[idx].s, data.k[idx].e, type);
                this._animation.add(animation);
            }
        }
    }
    Layer.FPS = 1000 / 30;
    exports.Layer = Layer;
});
//# sourceMappingURL=Layer.js.map