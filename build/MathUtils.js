define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MathUtils {
        static sinDeg(degree) {
            return Math.sin(degree * this.DEG_TO_RAD);
        }
        static cosDeg(degree) {
            return Math.cos(degree * this.DEG_TO_RAD);
        }
    }
    MathUtils.DEG_TO_RAD = Math.PI / 180;
    MathUtils.RAD_TO_DEG = 180 / Math.PI;
    exports.MathUtils = MathUtils;
});
//# sourceMappingURL=MathUtils.js.map