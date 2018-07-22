import { Vector2 } from "../transform/Vector2";
import { Transform2D } from "../transform/Transform2D";

export class AnimationData
{
    protected _scale: Vector2;
    protected _opacity: number;
    protected _rotation: number;
    protected _transform: Transform2D;
    protected _translation: Vector2;
    protected _anchorPoint: Vector2;

    // GETTERS
    public get scale(): Vector2
    {
        return this._scale;    
    }

    public get translation(): Vector2
    {
        return this._translation;
    }

    public get anchor(): Vector2
    {
        return this._anchorPoint;
    }

    public get opacity(): number
    {
        return this._opacity;
    }

    public get rotation(): number
    {
        return this._rotation;
    }

    public get transform(): Transform2D
    {
        return this._transform;
    }

    // SETTERS
    public set scale(value: Vector2)
    {
        this._scale.copy(value);    
    }

    public set translation(value: Vector2)
    {
        this._translation.copy(value);
    }

    public set anchor(value: Vector2)
    {
        this._anchorPoint.copy(value);
    }

    public set opacity(value: number)
    {
        this._opacity = value;
    }

    public set rotation(value: number)
    {
        this._rotation = value;
    }

    public set transform(value: Transform2D)
    {
        this._transform.copy(value);
    }

    constructor(translation?: Vector2, scale?: Vector2, anchor?: Vector2, rotation?: number, opacity?: number, transform?: Transform2D)
    {
        this._scale = new Vector2(1, 1);
        this._anchorPoint = new Vector2();
        this._translation = new Vector2();
        this._transform = new Transform2D();

        this._opacity = opacity | 0;
        this._rotation = rotation | 0;

        this._scale.copy(scale);
        this._anchorPoint.copy(anchor);
        this._translation.copy(translation);
        this._transform.copy(transform);
    }

    public copy(params: AnimationData): void
    {
        this._opacity = params._opacity;
        this._rotation = params._rotation;

        this._scale.copy(params._scale);
        this._anchorPoint.copy(params._anchorPoint);
        this._translation.copy(params._translation);
        this.transform.copy(params.transform);
    }

}