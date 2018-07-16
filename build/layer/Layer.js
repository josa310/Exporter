define(["require", "exports", "./Transform", "./Vector2", "../MathUtils", "../animation/Animation"], function (require, exports, Transform_1, Vector2_1, MathUtils_1, Animation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(data, asset) {
            this.updated = false;
            this._asset = asset;
            this._localTransform = new Transform_1.Transform();
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
            this._globalTransform.dot(this._localTransform, this._globalTransform);
        }
        init(data) {
            this._next = null;
            this._prev = null;
            this._parent = null;
            this._child = null;
            this._id = data.ind;
            this._parentId = data.parent;
            this._animations = new Array();
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
            this.startAnimations();
        }
        startAnimations() {
            for (let animation of this._animations) {
                animation.start();
            }
        }
        updateAnimations() {
            for (let animation of this._animations) {
                if (!animation.update()) {
                    animation.start();
                }
                switch (animation.type) {
                    case Animation_1.AnimType.OPACITY:
                        {
                            this._opacity = animation.getValue(Animation_1.Transitions.OPCT) / 100;
                        }
                }
            }
        }
        processTranslation(data) {
            if (data.a) {
                this._localTransform.translate(0, 0);
            }
            else {
                this._localTransform.translate(data.k[0], data.k[1]);
            }
        }
        processRotation(data) {
            if (data.a) {
                this._localTransform.rotate(0);
            }
            else {
                this._localTransform.rotate(data.k * MathUtils_1.MathUtils.DEG_TO_RAD);
            }
        }
        processScale(data) {
            if (data.a) {
                this._localTransform.scale(1);
            }
            else {
                this._localTransform.scale(data.k[0] / 100);
            }
        }
        processAnchor(data) {
            if (data.a) {
                this._localTransform.translate(0, 0);
            }
            else {
                this._anchorPoint = new Vector2_1.Vector2(-data.k[0], -data.k[1]);
                this._localTransform.translate(this._anchorPoint.x, this._anchorPoint.y);
            }
        }
        processOpacity(data) {
            if (data.a) {
                const frameCnt = data.k[1].t - data.k[0].t;
                let animation = new Animation_1.Animation(frameCnt, data.k[0].s, data.k[0].e, Animation_1.AnimType.OPACITY);
                this._animations.push(animation);
            }
            else {
                this._opacity = data.k / 100;
            }
        }
    }
    Layer.FPS = 1000 / 30;
    exports.Layer = Layer;
});
//# sourceMappingURL=Layer.js.map