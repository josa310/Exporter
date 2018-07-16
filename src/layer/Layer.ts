import { Asset } from './Asset';
import { Transform } from './Transform';
import { Vector2 } from './Vector2';
import { MathUtils } from '../MathUtils';
import { Animation, AnimType, Transitions } from '../animation/Animation';

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
    
    protected _localTransform: Transform;
    protected _globalTransform: Transform;
    
    protected _asset: Asset;
    protected _opacity: number;
    public _anchorPoint: Vector2;

    protected _animations: Animation[];

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

    public get transform(): Transform
    {
        return this._globalTransform;
    }

    public get asset(): Asset
    {
        return this._asset;
    }

    public get anchor(): Vector2
    {
        return this._anchorPoint;
    }

    public get opacity(): number
    {
        return this._opacity;
    }

    public skew: number;
    public skewAxis: number;

    constructor(data: any, asset: Asset)
    {
        this._asset = asset;
        this._localTransform = new Transform();
        this._globalTransform = new Transform();

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
        this._animations = new Array<Animation>();
        
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

        this.startAnimations();
    }

    protected startAnimations(): void
    {
        for (let animation of this._animations)
        {
            animation.start();
        }
    }

    public updateAnimations(): void
    {
        for (let animation of this._animations)
        {
            if (!animation.update())
            {
                animation.start();
            }

            switch (animation.type)
            {
                case AnimType.OPACITY:
                {
                    this._opacity = animation.getValue(Transitions.OPCT) / 100;
                    // console.log(this._opacity);
                }
            }
        }
    }
        
    protected processTranslation(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement animation handling
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
            // TODO: Implement animation handling
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
            this._localTransform.translate(0, 0);
        }
        else
        {
            this._anchorPoint = new Vector2(-data.k[0], -data.k[1]);
            this._localTransform.translate(this._anchorPoint.x, this._anchorPoint.y);
        }
    }

    protected processOpacity(data: any): void
    {
        if (data.a)
        {
            // TODO: Implement better animation handling
            const frameCnt: number = data.k[1].t - data.k[0].t;
            let animation: Animation = new Animation(frameCnt, data.k[0].s, data.k[0].e, AnimType.OPACITY);
            this._animations.push(animation);
        }
        else
        {
            this._opacity = data.k / 100;
        }
    }


}