import { Asset } from './Asset';
import { Transform } from './Transform';
import { Vector2 } from './Vector2';
import { MathUtils } from '../MathUtils';

export class Layer
{
    public updated: boolean = false;
    
    protected _id: number;
    protected _next: Layer;
    protected _prev: Layer;
    protected _parent: Layer;
    protected _child: Layer;
    
    protected _parentId: number;
    
    protected _localTransoform: Transform;
    protected _globalTransform: Transform;
    
    protected _asset: Asset;
    protected _opacity: number;
    public _anchorPoint: Vector2;

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
        this._localTransoform = new Transform();
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

        this._globalTransform.dot(this._localTransoform, this._globalTransform);
    }

    protected init(data: any): void
    {
        this._next = null;
        this._prev = null;
        this._parent = null;
        this._child = null;

        this._id = data.ind;

        this._parentId = data.parent;

        this._opacity = data.ks.o.k / 100;
        this._anchorPoint = new Vector2(-data.ks.a.k[0], -data.ks.a.k[1])
        
        // TODO better condition
        if (data.ef)        
        {
            this.skew = data.ef[0].ef[5].v.k;
            this.skewAxis = data.ef[0].ef[6].v.k;
        }

        this._localTransoform.translate(data.ks.p.k[0], data.ks.p.k[1]);
        this._localTransoform.rotate(data.ks.r.k * MathUtils.DEG_TO_RAD);
        this._localTransoform.scale(data.ks.s.k[0] / 100);
        this._localTransoform.translate(this._anchorPoint.x, this._anchorPoint.y);
    }
}