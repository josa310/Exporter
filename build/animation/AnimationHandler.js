define(["require", "exports", "./Animation", "./AnimParams", "./Animation", "../MathUtils"], function (require, exports, Animation_1, AnimParams_1, Animation_2, MathUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AnimationHandler {
        get params() {
            return this._params;
        }
        set params(value) {
            this._params.copy(value);
            this.updateTransform();
        }
        constructor() {
            this._transformChanged;
            this._params = new AnimParams_1.AnimParams();
            this._animations = new Array();
        }
        add(animation) {
            this._animations.push(animation);
        }
        start() {
            for (let animation of this._animations) {
                animation.start();
            }
        }
        update() {
            this._transformChanged = false;
            this.updateValues();
            if (this._transformChanged) {
                this.updateTransform();
            }
        }
        updateValues() {
            for (let animation of this._animations) {
                if (!animation.update()) {
                    animation.start();
                }
                switch (animation.type) {
                    case Animation_1.AnimType.OPACITY:
                        this._params.opacity = animation.getValue(Animation_2.Transitions.OPCT) / 100;
                        break;
                    case Animation_1.AnimType.TRANSLATION:
                        this._transformChanged = true;
                        this._params.translation.x = animation.getValue(Animation_2.Transitions.TRANS_X);
                        this._params.translation.y = animation.getValue(Animation_2.Transitions.TRANS_Y);
                        break;
                    case Animation_1.AnimType.ROTATION:
                        this._transformChanged = true;
                        this._params.rotation = animation.getValue(Animation_2.Transitions.ROT) * MathUtils_1.MathUtils.DEG_TO_RAD;
                        break;
                    case Animation_1.AnimType.SCALE:
                        this._transformChanged = true;
                        this._params.scale.x = animation.getValue(Animation_2.Transitions.SCL_X) / 100;
                        this._params.scale.y = animation.getValue(Animation_2.Transitions.SCL_Y) / 100;
                        break;
                    case Animation_1.AnimType.ANCHOR:
                        this._transformChanged = true;
                        this._params.anchor.x = -animation.getValue(Animation_2.Transitions.ANC_X);
                        this._params.anchor.y = -animation.getValue(Animation_2.Transitions.ANC_Y);
                        break;
                }
            }
        }
        updateTransform() {
            let transform = this._params.transform;
            transform.identity();
            transform.translate(this._params.translation.x, this._params.translation.y);
            transform.rotate(this._params.rotation);
            transform.scale(this._params.scale.x);
            transform.translate(this._params.anchor.x, this._params.anchor.y);
        }
    }
    exports.AnimationHandler = AnimationHandler;
});
//# sourceMappingURL=AnimationHandler.js.map