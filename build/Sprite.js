define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Sprite {
        constructor(data, idx) {
            this.id = data.assets[idx].id;
            this.path = data.assets[idx].u + data.assets[idx].p;
            this.width = data.assets[idx].w;
            this.height = data.assets[idx].h;
            this.opacity = data.layers[idx].ks.o.k;
            this.rotation = data.layers[idx].ks.r.k;
            this.pos = data.layers[idx].ks.p.k;
            this.ap = data.layers[idx].ks.a.k;
            this.scale = data.layers[idx].ks.s.k;
            this.parent = data.layers[idx].parent - 1;
            if (this.parent >= 0) {
                this.hasParent = true;
                this.parentOpacity = data.layers[this.parent].ks.o.k;
                this.parentRotation = data.layers[this.parent].ks.r.k;
                this.parentPos = data.layers[this.parent].ks.p.k;
                this.parentAP = data.layers[this.parent].ks.a.k;
                this.parentScale = data.layers[this.parent].ks.s.k;
            }
            if (data.layers[idx].ef) {
                this.skew = data.layers[idx].ef[0].ef[5].v.k;
                this.skewAxis = data.layers[idx].ef[0].ef[6].v.k;
            }
            else {
                this.skew = null;
                this.skewAxis = null;
            }
            this.img = null;
            this.loaded = false;
        }
        getRotation(data, idx) {
            return data.layers[idx].ks.r.k;
        }
        getPosition(data, idx) {
            return data.layers[idx].ks.p.k;
        }
        getAnchorPoints(data, idx) {
            return data.layers[idx].ks.a.k;
        }
        getScales(data, idx) {
            return data.layers[idx].ks.s.k;
        }
    }
    exports.Sprite = Sprite;
});
//# sourceMappingURL=Sprite.js.map