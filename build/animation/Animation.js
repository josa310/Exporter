define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transitions;
    (function (Transitions) {
        Transitions[Transitions["ROT"] = 0] = "ROT";
        Transitions[Transitions["OPCT"] = 0] = "OPCT";
        Transitions[Transitions["SCL_X"] = 0] = "SCL_X";
        Transitions[Transitions["SCL_Y"] = 1] = "SCL_Y";
        Transitions[Transitions["ANC_X"] = 0] = "ANC_X";
        Transitions[Transitions["ANC_Y"] = 1] = "ANC_Y";
        Transitions[Transitions["TRANS_X"] = 0] = "TRANS_X";
        Transitions[Transitions["TRANS_Y"] = 1] = "TRANS_Y";
        Transitions[Transitions["TIME_RM"] = 0] = "TIME_RM";
    })(Transitions = exports.Transitions || (exports.Transitions = {}));
    var AnimType;
    (function (AnimType) {
        AnimType[AnimType["TRANSLATION"] = 0] = "TRANSLATION";
        AnimType[AnimType["ROTATION"] = 1] = "ROTATION";
        AnimType[AnimType["SCALE"] = 2] = "SCALE";
        AnimType[AnimType["OPACITY"] = 3] = "OPACITY";
        AnimType[AnimType["ANCHOR"] = 4] = "ANCHOR";
        AnimType[AnimType["COMPOSIT"] = 5] = "COMPOSIT";
    })(AnimType = exports.AnimType || (exports.AnimType = {}));
    class Animation {
        get type() {
            return this._type;
        }
        get startFrame() {
            return this._startFrame;
        }
        get endFrame() {
            return this._startFrame + this._frameCnt;
        }
        get frameCount() {
            return this._frameCnt;
        }
        get isPalying() {
            return this._isPlaying;
        }
        constructor(startFrame, endFrame, startValues, endValues, type) {
            this._type = type;
            this._endValues = endValues;
            this._startValues = startValues;
            this._startFrame = startFrame;
            this._frameCnt = endFrame - startFrame;
            this._currentValues = new Array(this._startValues.length);
            for (let idx = 0; idx < this._startValues.length; idx++) {
                this._currentValues[idx] = 0;
            }
        }
        getValue(idx) {
            if (this._currentValues[idx]) {
                return this._currentValues[idx];
            }
            return 0;
        }
        start() {
            this._isPlaying = true;
            this._frameIdx = 0;
        }
        startAt(idx) {
            idx = Math.min(this._frameCnt - 1, Math.max(0, idx));
            this.start();
            this._frameIdx = idx;
        }
        stop() {
            this._isPlaying = false;
        }
        update() {
            if (this._frameIdx >= this._frameCnt) {
                this.stop();
            }
            if (!this._isPlaying) {
                return false;
            }
            this._frameIdx++;
            this._alpha = this._frameIdx / this._frameCnt;
            this.updateValues();
            return this._isPlaying;
        }
        duplicate() {
            return new Animation(this._startFrame, this.endFrame, this._startValues, this._endValues, this._type);
        }
        updateValues() {
            for (let idx = 0; idx < this._startValues.length; idx++) {
                this._currentValues[idx] = this.lerp(this._startValues[idx], this._endValues[idx]);
            }
        }
        lerp(a, b) {
            return (a * (1 - this._alpha)) + (this._alpha * b);
        }
    }
    exports.Animation = Animation;
});
//# sourceMappingURL=Animation.js.map