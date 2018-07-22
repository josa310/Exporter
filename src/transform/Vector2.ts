import { Matrix } from "./Matrix";

export class Vector2 extends Matrix
{
    protected _nX: number;
    protected _nY: number;

    protected _magnitude: number;

    public get x(): number
    {
        return this._data[0][0];
    }

    public set x(value: number)
    {
        this._data[0][0] = value;
    }

    public get y(): number
    {
        return this._data[1][0];
    }

    public set y(value: number)
    {
        this._data[1][0] = value;
    }

    public get normalX(): number
    {
        return this._nX;
    }

    public get normalY(): number
    {
        return this._nY;
    }

    constructor(x: number = 0, y: number = 0)
    {
        super(3, 1);
        this.x = x;
        this.y = y;
    }

    public get magnitude(): number
    {
        return this._magnitude;
    }

    // public get 

    protected update(): void
    {
        this.calcMagnitude();
        this.calcNormal();
    }

    protected calcMagnitude(): void
    {
        this._magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    protected calcNormal(): void
    {
        this._nX = this.x / this._magnitude;
        this._nY = this.y / this._magnitude;
    }

    public copy(v: Vector2): void
    {
        super.copy(v);        
        this.update();
    }
}