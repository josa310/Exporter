define(["require", "exports", "../layer/Layer", "../animation/AnimationHandler", "../animation/Animation", "../transform/Vector2", "../transform/MathUtils"], function (require, exports, Layer_1, AnimationHandler_1, Animation_1, Vector2_1, MathUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LayerFactory {
        createLayer(data, assets) {
            this.createAnimations(data);
            let id = data.ind;
            let parentId = data.parent;
            let asset = assets[data.refId];
            return new Layer_1.Layer(id, parentId, asset, this._animHandler);
        }
        createEmpty() {
            return new Layer_1.Layer(-1, null, null, new AnimationHandler_1.AnimationHandler());
        }
        createAnimations(data) {
            this._animHandler = new AnimationHandler_1.AnimationHandler();
            const transitions = data.ks;
            this.processScale(transitions.s.k, transitions.s.a);
            this.processAnchor(transitions.a.k, transitions.a.a);
            this.processOpacity(transitions.o.k, transitions.o.a);
            this.processRotation(transitions.r.k, transitions.r.a);
            this.processTranslation(transitions.p.k, transitions.p.a);
            this._animHandler.updateParams();
        }
        processTranslation(data, animated) {
            if (animated) {
                this.createAnimation(data, Animation_1.AnimType.TRANSLATION);
                this._animHandler.params.translation = new Vector2_1.Vector2(data[0].s[0], data[0].s[1]);
            }
            else {
                this._animHandler.params.translation = new Vector2_1.Vector2(data[0], data[1]);
            }
        }
        processRotation(data, animated) {
            if (animated) {
                this.createAnimation(data, Animation_1.AnimType.ROTATION);
                this._animHandler.params.rotation = data[0].s[0] * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
            else {
                this._animHandler.params.rotation = data * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
        }
        processScale(data, animated) {
            if (animated) {
                this.createAnimation(data, Animation_1.AnimType.SCALE);
                this._animHandler.params.scale = new Vector2_1.Vector2(data[0].s[0] / 100, data[0].s[1] / 100);
            }
            else {
                this._animHandler.params.scale = new Vector2_1.Vector2(data[0] / 100, data[1] / 100);
            }
        }
        processAnchor(data, animated) {
            if (animated) {
                this.createAnimation(data, Animation_1.AnimType.ANCHOR);
                this._animHandler.params.anchor = new Vector2_1.Vector2(-data[0].s[0], -data[0].s[1]);
            }
            else {
                this._animHandler.params.anchor = new Vector2_1.Vector2(-data[0], -data[1]);
            }
        }
        processOpacity(data, animated) {
            if (animated) {
                this.createAnimation(data, Animation_1.AnimType.OPACITY);
                this._animHandler.params.opacity = data[0].s[0];
            }
            else {
                this._animHandler.params.opacity = data / 100;
            }
        }
        createAnimation(data, type) {
            let cnt = data.length;
            for (let idx = 0; idx < cnt - 1; idx++) {
                let startFrame = data[idx].t;
                let endFrame = data[idx + 1].t;
                let startValues = data[idx].s;
                let endValues = data[idx].e ? data[idx].e : startValues;
                let animation = new Animation_1.Animation(startFrame, endFrame, startValues, endValues, type);
                this._animHandler.add(animation);
            }
        }
    }
    exports.LayerFactory = LayerFactory;
});
//# sourceMappingURL=LayerFactory.js.map