define(["require", "exports", "./Animation", "./AnimParams", "./Animation", "../MathUtils"], function (require, exports, Animation_1, AnimParams_1, Animation_2, MathUtils_1) {
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
            this._animations = new Array();
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
        add(newAnim) {
            this._animations.push(newAnim);
            if (this._frameCnt < newAnim.endFrame) {
                this._frameCnt = newAnim.endFrame;
            }
            if (this._animList) {
                let anim = this._animList;
                while (true) {
                    if (newAnim.startFrame < anim.startFrame) {
                        if (anim.prev) {
                            newAnim.prev = anim.prev;
                            newAnim.prev.next = newAnim;
                        }
                        else {
                            this._animList = newAnim;
                        }
                        newAnim.next = anim;
                        anim.prev = newAnim;
                        return;
                    }
                    else if (newAnim.startFrame == anim.startFrame) {
                        newAnim.sibling = anim;
                        newAnim.next = anim.next;
                        newAnim.prev = anim.prev;
                        if (newAnim.next) {
                            newAnim.next.prev = newAnim;
                        }
                        if (newAnim.prev) {
                            newAnim.prev.next = newAnim;
                        }
                        else {
                            this._animList = newAnim;
                        }
                        return;
                    }
                    else if (!anim.next) {
                        anim.next = newAnim;
                        newAnim.prev = anim;
                        return;
                    }
                    anim = anim.next;
                }
            }
            else {
                this._animList = newAnim;
            }
        }
        start() {
            this._frameIdx = 0;
            this._isPlaying = true;
            this._nextAnim = this._animList;
            this._params.copy(this._startParams);
        }
        update() {
            if (!this._isPlaying) {
                return false;
            }
            this.startAnimsOfFrame();
            this._transformChanged = false;
            this.updateValues();
            if (this._transformChanged) {
                this.updateTransform();
            }
            this._frameIdx++;
            this._isPlaying = this._frameIdx < this._frameCnt;
            return this._isPlaying;
        }
        startAnimsOfFrame() {
            if (!this._nextAnim || this._nextAnim.startFrame != this._frameIdx) {
                return;
            }
            let animation = this._nextAnim;
            while (animation) {
                animation.start();
                animation = animation.sibling;
            }
            this._nextAnim = this._nextAnim.next;
        }
        updateValues() {
            for (let animation of this._animations) {
                if (!animation.update()) {
                    continue;
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
    AnimationHandler.OBJ_CNT = 0;
    exports.AnimationHandler = AnimationHandler;
});
//# sourceMappingURL=AnimationHandler.js.map