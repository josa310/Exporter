define(["require", "exports", "./Animation", "./AnimParams", "./Animation", "../MathUtils", "../list/LinkedList"], function (require, exports, Animation_1, AnimParams_1, Animation_2, MathUtils_1, LinkedList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AnimationHandler {
        constructor() {
            this._frameCnt = 0;
            this._frameIdx = 0;
            this._isPlaying = false;
            this._transformChanged;
            this._params = new AnimParams_1.AnimParams();
            this._startParams = new AnimParams_1.AnimParams();
            this._runningAnimations = new LinkedList_1.LinkedList();
            this._animations = new LinkedList_1.LinkedList();
            this._id = AnimationHandler.OBJ_CNT++;
        }
        get params() {
            return this._params;
        }
        set params(value) {
            this._params.copy(value);
            this.updateTransform();
            this._startParams.copy(this.params);
        }
        add(newAnimation) {
            if (this._frameCnt < newAnimation.endFrame) {
                this._frameCnt = newAnimation.endFrame;
            }
            if (this._animations.first) {
                do {
                    let animation = this._animations.current.first;
                    if (newAnimation.startFrame < animation.startFrame) {
                        this._animations.linkBefore(this.createAnimList(newAnimation));
                        return;
                    }
                    else if (newAnimation.startFrame == animation.startFrame) {
                        this._animations.current.pushToEnd(newAnimation);
                        return;
                    }
                } while (this._animations.next);
            }
            this._animations.pushToEnd(this.createAnimList(newAnimation));
        }
        createAnimList(anim) {
            let list = new LinkedList_1.LinkedList();
            list.pushToEnd(anim);
            return list;
        }
        start() {
            this._frameIdx = 0;
            this._isPlaying = true;
            this._scheduledAnimations = this._animations.first;
            this._params.copy(this._startParams);
        }
        update() {
            if (!this._isPlaying) {
                return false;
            }
            this.startScheduledAnimation();
            this._transformChanged = false;
            this.updateValues();
            if (this._transformChanged) {
                this.updateTransform();
            }
            this._frameIdx++;
            this._isPlaying = this._frameIdx < this._frameCnt;
            return this._isPlaying;
        }
        startScheduledAnimation() {
            if (!this._scheduledAnimations || this._scheduledAnimations.first.startFrame != this._frameIdx) {
                return;
            }
            do {
                this._scheduledAnimations.current.start();
                this._runningAnimations.pushToEnd(this._scheduledAnimations.current);
            } while (this._scheduledAnimations.next);
            this._scheduledAnimations = this._animations.next;
        }
        updateValues() {
            let animation = this._runningAnimations.first;
            while (animation) {
                while (!animation.update()) {
                    this._runningAnimations.removeCurrent();
                    animation = this._runningAnimations.current;
                    if (!animation) {
                        return;
                    }
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
                animation = this._runningAnimations.next;
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
    AnimationHandler.OBJ_CNT = 0;
    exports.AnimationHandler = AnimationHandler;
});
//# sourceMappingURL=AnimationHandler.js.map