import { Layer } from "../layer/Layer";
import { Asset } from "../layer/Asset";
import { AnimationHandler } from "../animation/AnimationHandler";
import { Animation, AnimType } from "../animation/Animation";
import { Vector2 } from "../transform/Vector2";
import { MathUtils } from "../transform/MathUtils";

export class LayerFactory
{
    protected _animHandler: AnimationHandler;

    public createLayer(data: any, assets: {[key: string]: Asset}): Layer
    {
        this.createAnimations(data);

        let id: number = data.ind;
        let parentId: number = data.parent;
        let asset: Asset = assets[data.refId];

        return new Layer(id, parentId, asset, this._animHandler);  
    }

    public createEmpty(): Layer
    {
        return new Layer(-1, null, null, new AnimationHandler());
    }

    protected createAnimations(data: any): void
    {
        this._animHandler = new AnimationHandler();

        const transitions = data.ks;
        this.processTranslation(transitions.p);
        this.processRotation(transitions.r);
        this.processScale(transitions.s);
        this.processAnchor(transitions.a);
        this.processOpacity(transitions.o);

        this._animHandler.updateParams();
    }

    protected processTranslation(data: any): void
    {
        if (data.a)
        {
            this.createAnimation(data, AnimType.TRANSLATION);
            this._animHandler.params.translation = new Vector2(data.k[0].s[0], data.k[0].s[1]);
        }
        else
        {
            this._animHandler.params.translation = new Vector2(data.k[0], data.k[1]);
        }
    }

    protected processRotation(data: any): void
    {
        if (data.a)
        {
            this.createAnimation(data, AnimType.ROTATION);
            this._animHandler.params.rotation = data.k[0].s[0] * MathUtils.DEG_TO_RAD;
        }
        else
        {
            this._animHandler.params.rotation = data.k * MathUtils.DEG_TO_RAD;
        }
    }

    protected processScale(data: any): void
    {
        if (data.a)
        {
            this.createAnimation(data, AnimType.SCALE);
            this._animHandler.params.scale = new Vector2(data.k[0].s[0] / 100, data.k[0].s[1] / 100);
        }
        else
        {
            this._animHandler.params.scale = new Vector2(data.k[0] / 100, data.k[1] / 100);
        }
    }

    protected processAnchor(data: any): void
    {
        if (data.a)
        {
            this.createAnimation(data, AnimType.ANCHOR);
            this._animHandler.params.anchor = new Vector2(-data.k[0].s[0], -data.k[0].s[1]);

        }
        else
        {
            this._animHandler.params.anchor = new Vector2(-data.k[0], -data.k[1]);
        }
    }

    protected processOpacity(data: any): void
    {
        if (data.a)
        {
            this.createAnimation(data, AnimType.OPACITY);
            this._animHandler.params.opacity = data.k[0].s[0];

        }
        else
        {
            this._animHandler.params.opacity = data.k / 100;
        }
    }

    protected createAnimation(data: any, type: AnimType): void
    {
        let cnt: number = data.k.length;
        for (let idx: number = 0; idx < cnt - 1; idx++)
        {
            let animation: Animation = new Animation(data.k[idx].t, data.k[idx+1].t, data.k[idx].s, data.k[idx].e, type);
            this._animHandler.add(animation);
        }
    }
}