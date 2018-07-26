define(["require", "exports", "../transform/Vector2", "../transform/Transform2D"], function (require, exports, Vector2_1, Transform2D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AnimationData {
        get scale() {
            return this._scale;
        }
        get translation() {
            return this._translation;
        }
        get anchor() {
            return this._anchorPoint;
        }
        get opacity() {
            return this._opacity;
        }
        get rotation() {
            return this._rotation;
        }
        get transform() {
            return this._transform;
        }
        get timeRemap() {
            return this._timeRemap;
        }
        set scale(value) {
            this._scale.copy(value);
        }
        set translation(value) {
            this._translation.copy(value);
        }
        set anchor(value) {
            this._anchorPoint.copy(value);
        }
        set opacity(value) {
            this._opacity = value;
        }
        set rotation(value) {
            this._rotation = value;
        }
        set transform(value) {
            this._transform.copy(value);
        }
        set timeRemap(value) {
            this._timeRemap = value;
        }
        constructor(translation, scale, anchor, rotation, opacity, transform, timeRemap) {
            this._scale = new Vector2_1.Vector2(1, 1);
            this._anchorPoint = new Vector2_1.Vector2();
            this._translation = new Vector2_1.Vector2();
            this._transform = new Transform2D_1.Transform2D();
            this._opacity = opacity | 0;
            this._rotation = rotation | 0;
            this._timeRemap = timeRemap | 0;
            this._scale.copy(scale);
            this._anchorPoint.copy(anchor);
            this._translation.copy(translation);
            this._transform.copy(transform);
        }
        copy(params) {
            this._opacity = params._opacity;
            this._rotation = params._rotation;
            this._timeRemap = params._timeRemap;
            this._scale.copy(params._scale);
            this._anchorPoint.copy(params._anchorPoint);
            this._translation.copy(params._translation);
            this.transform.copy(params.transform);
        }
    }
    exports.AnimationData = AnimationData;
});
//# sourceMappingURL=AnimationData.js.map