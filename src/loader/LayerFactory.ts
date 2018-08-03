import { Layer } from "../layer/Layer";
import { Asset } from "../layer/Asset";
import { Vector2 } from "../transform/Vector2";
import { MathUtils } from "../transform/MathUtils";
import { Animation, AnimType } from "../animation/Animation";
import { AnimationHandler } from "../animation/AnimationHandler";

export class LayerFactory
{
    protected _animHandler: AnimationHandler;

    public createLayer(data: any, assets: {[key: string]: Asset}): Layer
    {
        this.createAnimations(data);

        let id: string = data.ind;
        let parentId: string = data.parent;
        let asset: Asset = assets[data.refId];

        if (asset && asset.isPrecomp)
        {
            asset = asset.duplicate();
        }

        return new Layer(id, parentId, asset, this._animHandler);  
    }

    public createEmpty(id: string): Layer
    {
        return new Layer(id, null, null, new AnimationHandler());
    }

    protected createAnimations(data: any): void
    {
        this._animHandler = new AnimationHandler();

        const transitions = data.ks;
        this.processScale(transitions.s.k, transitions.s.a);
        this.processAnchor(transitions.a.k, transitions.a.a);
        this.processOpacity(transitions.o.k, transitions.o.a);
        this.processRotation(transitions.r.k, transitions.r.a);
        this.processTranslation(transitions.p.k, transitions.p.a);

        this._animHandler.updateParams();
    }

    protected processTranslation(data: any, animated: boolean): void
    {
        if (animated)
        {
            this.createAnimation(data, AnimType.TRANSLATION);
            this._animHandler.params.translation = new Vector2(data[0].s[0], data[0].s[1]);
        }
        else
        {
            this._animHandler.params.translation = new Vector2(data[0], data[1]);
        }
    }

    protected processRotation(data: any, animated: boolean): void
    {
        if (animated)
        {
            this.createAnimation(data, AnimType.ROTATION);
            this._animHandler.params.rotation = data[0].s[0] * MathUtils.DEG_TO_RAD;
        }
        else
        {
            this._animHandler.params.rotation = data * MathUtils.DEG_TO_RAD;
        }
    }

    protected processScale(data: any, animated: boolean): void
    {
        if (animated)
        {
            this.createAnimation(data, AnimType.SCALE);
            this._animHandler.params.scale = new Vector2(data[0].s[0] / 100, data[0].s[1] / 100);
        }
        else
        {
            this._animHandler.params.scale = new Vector2(data[0] / 100, data[1] / 100);
        }
    }

    protected processAnchor(data: any, animated: boolean): void
    {
        if (animated)
        {
            this.createAnimation(data, AnimType.ANCHOR);
            this._animHandler.params.anchor = new Vector2(-data[0].s[0], -data[0].s[1]);

        }
        else
        {
            this._animHandler.params.anchor = new Vector2(-data[0], -data[1]);
        }
    }

    protected processOpacity(data: any, animated: boolean): void
    {
        if (animated)
        {
            this.createAnimation(data, AnimType.OPACITY);
            this._animHandler.params.opacity = data[0].s[0];

        }
        else
        {
            this._animHandler.params.opacity = data / 100;
        }
    }

    protected createAnimation(data: any, type: AnimType): void
    {
        let cnt: number = data.length;
        for (let idx: number = 0; idx < cnt - 1; idx++)
        {
            let startFrame: number = data[idx].t;
            let endFrame: number = data[idx + 1].t;
            let startValues: number[] = data[idx].s;
            let endValues: number[] = data[idx].e ? data[idx].e : startValues;
            
            let animation: Animation = new Animation(startFrame, endFrame, startValues, endValues, type);
            this._animHandler.add(animation);
        }
    }
}