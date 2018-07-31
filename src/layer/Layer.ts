import { Asset } from './Asset';
import { LinkedList } from '../list/LinkedList';
import { Transform2D } from '../transform/Transform2D';
import { AnimationData } from '../animation/AnimationData';
import { AnimationHandler } from '../animation/AnimationHandler';

export class Layer
{
    public static FPS: number = 1000 / 30;
    
    protected _asset: Asset;
    protected _animation: AnimationHandler;
    protected _globalTransform: Transform2D;

    protected _id: string;
    protected _parent: Layer;
    protected _parentId: string;
    protected _animatig: boolean;
    protected _children: LinkedList<Layer>;

    public get animParams(): AnimationData
    {
        return this._animation.params;
    }

    public get children(): LinkedList<Layer>
    {
        return this._children;
    }

    public get parentId(): string
    {
        return this._parentId;
    }

    public get id(): string
    {
        return this._id;
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

    public get animating(): boolean
    {
        return this._animatig;
    }

    public skew: number;
    public skewAxis: number;

    constructor(id: string, parentId: string, asset: Asset, animation: AnimationHandler)
    {
        this._parent = null;
        this._children = null;
        this._globalTransform = new Transform2D();
        
        this._id = id;
        this._asset = asset;
        this._animatig = false;
        this._parentId = parentId;
        this._animation = animation;
    }
    
    public addChild(child: Layer): void
    {
        if (!this._children)
        {
            this._children = new LinkedList<Layer>();
        }   

        this._children.pushToEnd(child);
        child._parent = this;
    }
    
    public startAnim(): void
    {
        this._animation.start();
        this._animatig = true;
    }

    public update(): void
    {
        this.updateTransform();
        this.updateChildren();
        this._animatig = this._animation.update();
    }
    
    protected updateTransform(): void
    {
        if (this._parent)
        {
            this._globalTransform.copy(this._parent._globalTransform);
        }
        else
        {
            this._globalTransform.identity();
        }
        
        this._globalTransform.dot(this._animation.params.transform, this._globalTransform);
    }

    protected updateChildren(): void
    {
        if (!this._children)
        {
            return;
        }

        let child: Layer = this._children.first;
        while (child)
        {
            child.update();
            child = this._children.next;
        }
    }
}