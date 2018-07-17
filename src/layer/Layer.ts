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
    
    protected _localTransform: Transform2D;
    protected _globalTransform: Transform2D;
    
    protected _asset: Asset;

    protected _animParams: AnimParams;
    protected _animation: AnimationHandler;

    public get animParams(): AnimParams
    {
        return this._animParams;
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
        this._localTransform = new Transform2D();
        this._globalTransform = new Transform2D();
        
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
        
        this._globalTransform.dot(this._localTransform, this._globalTransform);
    }
    
    protected init(data: any): void
    {
        this._next = null;
        this._prev = null;
        this._parent = null;
        this._child = null;
        
        this._id = data.ind;
        
        this._parentId = data.parent;
        this._animParams = new AnimParams();
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

        this._animParams.transform = this._localTransform;
        this._animation.params = this._animParams;
        this._animation.start();
    }

    public updateAnimations(): void
    {
        this._animation.update();
        this._animParams.copy(this._animation.params);
    }
        
    protected processTranslation(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.TRANSLATION);
            this._localTransform.translate(0, 0);
        }
        else
        {
            this._localTransform.translate(data.k[0], data.k[1]);
        }
    }

    protected processRotation(data: any): void
    {
        if (data.a)
        {
            this.extractAnim(data, AnimType.ROTATION);
            this._localTransform.rotate(0);
        }
        else
        {
            this._localTransform.rotate(data.k * MathUtils.DEG_TO_RAD);
        }
    }

    protected processScale(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.SCALE);
            this._localTransform.scale(1);
        }
        else
        {
            this._localTransform.scale(data.k[0] / 100);
        }
    }

    protected processAnchor(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
            this.extractAnim(data, AnimType.ANCHOR);
            this._localTransform.translate(0, 0);
        }
        else
        {
            this._animParams.anchor = new Vector2(-data.k[0], -data.k[1]);
            this._localTransform.translate(this._animParams.anchor.x, this._animParams.anchor.y);
        }
    }

    protected processOpacity(data: any): void
    {
        if (data.a)
        {
            this.extractAnim(data, AnimType.OPACITY);
        }
        else
        {
            this._animParams.opacity = data.k / 100;
        }
    }

    protected extractAnim(data: any, type: AnimType): void
    {
        let cnt: number = data.k.length;
        for (let idx: number = 0; idx < cnt - 1; idx++)
        {
            let frameCnt: number = data.k[idx+1].t - data.k[idx].t;
            let animation: Animation = new Animation(frameCnt, data.k[idx].s, data.k[idx].e, type);
            this._animation.add(animation);
        }
    }

}