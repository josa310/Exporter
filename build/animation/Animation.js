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
    })(Transitions = exports.Transitions || (exports.Transitions = {}));
    var AnimType;
    (function (AnimType) {
        AnimType[AnimType["TRANSLATION"] = 0] = "TRANSLATION";
        AnimType[AnimType["ROTATION"] = 1] = "ROTATION";
        AnimType[AnimType["SCALE"] = 2] = "SCALE";
        AnimType[AnimType["OPACITY"] = 3] = "OPACITY";
        AnimType[AnimType["ANCHOR"] = 4] = "ANCHOR";
    })(AnimType = exports.AnimType || (exports.AnimType = {}));
    class Animation {
        get type() {
            return this._type;
        }
        get next() {
            return this._next;
        }
        constructor(frameCnt, startValues, endValues, type) {
            this._type = type;
            this._frameCnt = frameCnt;
            this._endValues = endValues;
            this._startValues = startValues;
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
        stop() {
            this._isPlaying = false;
        }
        update() {
            if (!this._isPlaying) {
                return false;
            }
            this._frameIdx++;
            this._alpha = this._frameIdx / this._frameCnt;
            this.updateValues();
            if (this._frameIdx >= this._frameCnt) {
                this.stop();
            }
            return this._isPlaying;
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