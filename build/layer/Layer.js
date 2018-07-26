define(["require", "exports", "../transform/Transform2D", "../list/LinkedList"], function (require, exports, Transform2D_1, LinkedList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Layer {
        constructor(id, parentId, asset, animation) {
            this._parent = null;
            this._children = null;
            this._globalTransform = new Transform2D_1.Transform2D();
            this._id = id;
            this._asset = asset;
            this._animatig = false;
            this._parentId = parentId;
            this._animation = animation;
        }
        get animParams() {
            return this._animation.params;
        }
        get children() {
            return this._children;
        }
        get parentId() {
            return this._parentId;
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
        get animating() {
            return this._animatig;
        }
        addChild(child) {
            if (!this._children) {
                this._children = new LinkedList_1.LinkedList();
            }
            this._children.pushToEnd(child);
            child._parent = this;
        }
        startAnim() {
            this._animation.start();
            this._animatig = true;
        }
        update() {
            this.updateTransform();
            this.updateChildren();
            this._animatig = this._animation.update();
        }
        updateTransform() {
            if (this._parent) {
                this._globalTransform.copy(this._parent._globalTransform);
            }
            else {
                this._globalTransform.identity();
            }
            this._globalTransform.dot(this._animation.params.transform, this._globalTransform);
        }
        updateChildren() {
            if (!this._children) {
                return;
            }
            let child = this._children.first;
            while (child) {
                child.update();
                child = this._children.next;
            }
        }
    }
    Layer.FPS = 1000 / 30;
    exports.Layer = Layer;
});
//# sourceMappingURL=Layer.js.map