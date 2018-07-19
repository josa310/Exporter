import { Asset } from './Asset';
import { Transform2D } from './Transform2D';
import { Vector2 } from './Vector2';
import { MathUtils } from '../MathUtils';
import { Animation, AnimType, Transitions } from '../animation/Animation';
import { AnimParams } from '../animation/AnimParams';
import { AnimationHandler } from '../animation/AnimationHandler';

export class Layer
{
    public static FPS: number = 1000 / 30;

    public updated: boolean = false;
    
    protected _id: number;
    protected _next: Layer;
    protected _prev: Layer;
    protected _parent: Layer;
    protected _child: Layer;
    
    protected _parentId: number;
    
    protected _globalTransform: Transform2D;
    
    protected _asset: Asset;

    protected _params: AnimParams;
    protected _animation: AnimationHandler;

    public get animParams(): AnimParams
    {
        return this._params;
    }

    public get firstChild(): Layer
    {
        return this._child;
    }

    public get parentId(): number
    {
        return this._parentId;
    }

    public get next(): Layer
    {
        return this._next;
    }

    public get parent(): Layer
    {
        return this._parent;
    }

    public get transform(): Transform2D
    {
        return this._globalTransform;
    }

    public get asset(): Asset
    {
        return this._asset;
    }

    public skew: number;
    public skewAxis: number;

    constructor(data: any, asset: Asset)
    {
        this._asset = asset;
        this._globalTransform = new Transform2D();
        this._params = new AnimParams();
        
        if (data == null)
        {
            return;
        }
        
        this.init(data);
    }
    
    public addChild(child: Layer): void
    {
        if (this._child)
        {
            this._child._prev = child;
            child._next = this._child;
        }
        
        this._child = child;
        this._child._parent = this;
    }
    
    public updateTransform(): void
    {
        if (this._parent)
        {
            this._globalTransform.copy(this._parent._globalTransform);
        }
        else
        {
            this._globalTransform.identity();
        }
        
        this._globalTransform.dot(this._params.transform, this._globalTransform);
    }
    
    protected init(data: any): void
    {
        this._next = null;
        this._prev = null;
        this._parent = null;
        this._child = null;
        
        this._id = data.ind;
        
        this._parentId = data.parent;
        this._animation = new AnimationHandler();
        
        // TODO better condition
        if (data.ef)        
        {
            this.skew = data.ef[0].ef[5].v.k;
            this.skewAxis = data.ef[0].ef[6].v.k;
        }
        
        const transitions = data.ks;
        this.processTranslation(transitions.p);
        this.processRotation(transitions.r);
        this.processScale(transitions.s);
        this.processAnchor(transitions.a);
        this.processOpacity(transitions.o);

        this._animation.params = this._params;
        this._params.copy(this._animation.params);
    }
    
    public startAnim(): void
    {
        this._animation.start();
    }

    public updateAnimation(): boolean
    {
        let retVal: boolean = this._animation.update();
        this._params.copy(this._animation.params);

        return retVal;
    }
        
    protected processTranslation(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.TRANSLATION);
            this._params.translation = new Vector2(data.k[0].s[0], data.k[0].s[1]);
        }
        else
        {
            // this._localTransform.translate(data.k[0], data.k[1]);
            this._params.translation = new Vector2(data.k[0], data.k[1]);
        }
    }

    protected processRotation(data: any): void
    {
        if (data.a)
        {
            this.extractAnim(data, AnimType.ROTATION);
            this._params.rotation = data.k[0].s[0] * MathUtils.DEG_TO_RAD;

        }
        else
        {
            this.animParams.rotation = data.k * MathUtils.DEG_TO_RAD;
        }
    }

    protected processScale(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.SCALE);
            this._params.scale = new Vector2(data.k[0].s[0] / 100, data.k[0].s[1] / 100);

        }
        else
        {
            // this._localTransform.scale(data.k[0] / 100);
            this._params.scale = new Vector2(data.k[0] / 100, data.k[1] / 100);
        }
    }

    protected processAnchor(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.ANCHOR);
            this._params.anchor = new Vector2(-data.k[0].s[0], -data.k[0].s[1]);

        }
        else
        {
            this._params.anchor = new Vector2(-data.k[0], -data.k[1]);
        }
    }

    protected processOpacity(data: any): void
    {
        if (data.a)
        {
            this.extractAnim(data, AnimType.OPACITY);
            this._params.opacity = data.k[0].s[0];

        }
        else
        {
            this._params.opacity = data.k / 100;
        }
    }

    protected extractAnim(data: any, type: AnimType): void
    {
        let cnt: number = data.k.length;
        for (let idx: number = 0; idx < cnt - 1; idx++)
        {
            let animation: Animation = new Animation(data.k[idx].t, data.k[idx+1].t, data.k[idx].s, data.k[idx].e, type);
            this._animation.add(animation);
        }
    }

}