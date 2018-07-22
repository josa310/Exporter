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
            this.processTranslation(transitions.p);
            this.processRotation(transitions.r);
            this.processScale(transitions.s);
            this.processAnchor(transitions.a);
            this.processOpacity(transitions.o);
            this._animHandler.updateParams();
        }
        processTranslation(data) {
            if (data.a) {
                this.createAnimation(data, Animation_1.AnimType.TRANSLATION);
                this._animHandler.params.translation = new Vector2_1.Vector2(data.k[0].s[0], data.k[0].s[1]);
            }
            else {
                this._animHandler.params.translation = new Vector2_1.Vector2(data.k[0], data.k[1]);
            }
        }
        processRotation(data) {
            if (data.a) {
                this.createAnimation(data, Animation_1.AnimType.ROTATION);
                this._animHandler.params.rotation = data.k[0].s[0] * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
            else {
                this._animHandler.params.rotation = data.k * MathUtils_1.MathUtils.DEG_TO_RAD;
            }
        }
        processScale(data) {
            if (data.a) {
                this.createAnimation(data, Animation_1.AnimType.SCALE);
                this._animHandler.params.scale = new Vector2_1.Vector2(data.k[0].s[0] / 100, data.k[0].s[1] / 100);
            }
            else {
                this._animHandler.params.scale = new Vector2_1.Vector2(data.k[0] / 100, data.k[1] / 100);
            }
        }
        processAnchor(data) {
            if (data.a) {
                this.createAnimation(data, Animation_1.AnimType.ANCHOR);
                this._animHandler.params.anchor = new Vector2_1.Vector2(-data.k[0].s[0], -data.k[0].s[1]);
            }
            else {
                this._animHandler.params.anchor = new Vector2_1.Vector2(-data.k[0], -data.k[1]);
            }
        }
        processOpacity(data) {
            if (data.a) {
                this.createAnimation(data, Animation_1.AnimType.OPACITY);
                this._animHandler.params.opacity = data.k[0].s[0];
            }
            else {
                this._animHandler.params.opacity = data.k / 100;
            }
        }
        createAnimation(data, type) {
            let cnt = data.k.length;
            for (let idx = 0; idx < cnt - 1; idx++) {
                let animation = new Animation_1.Animation(data.k[idx].t, data.k[idx + 1].t, data.k[idx].s, data.k[idx].e, type);
                this._animHandler.add(animation);
            }
        }
    }
    exports.LayerFactory = LayerFactory;
});
//# sourceMappingURL=LayerFactory.js.map