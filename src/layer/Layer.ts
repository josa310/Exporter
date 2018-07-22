import { Asset } from './Asset';
import { Transform2D } from '../transform/Transform2D';
import { Vector2 } from '../transform/Vector2';
import { MathUtils } from '../transform/MathUtils';
import { Animation, AnimType, Transitions } from '../animation/Animation';
import { AnimationData } from '../animation/AnimationData';
import { AnimationHandler } from '../animation/AnimationHandler';
import { LinkedList } from '../list/LinkedList';

export class Layer
{
    public static FPS: number = 1000 / 30;
    
    protected _updated: boolean;
    
    protected _asset: Asset;
    protected _animation: AnimationHandler;
    protected _globalTransform: Transform2D;

    protected _id: number;
    protected _parent: Layer;
    protected _parentId: number;
    protected _children: LinkedList<Layer>;

    public get updated(): boolean
    {
        return this._updated
    }

    public set updated(value: boolean)
    {
        this._updated = value;
    }

    public get animParams(): AnimationData
    {
        return this._animation.params;
    }

    public get children(): LinkedList<Layer>
    {
        return this._children;
    }

    public get parentId(): number
    {
        return this._parentId;
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

    constructor(id: number, parentId: number, asset: Asset, animation: AnimationHandler)
    {
        this._parent = null;
        this._children = null;
        this._updated = false;
        this._globalTransform = new Transform2D();
        
        this._id = id;
        this._asset = asset;
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
        
        this._globalTransform.dot(this._animation.params.transform, this._globalTransform);
        this._updated = true;
    }
    
    public startAnim(): void
    {
        this._animation.start();
    }

    public updateAnimation(): boolean
    {
        return this._animation.update();
    }
}