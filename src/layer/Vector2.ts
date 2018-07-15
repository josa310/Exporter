export class Vector2
{
    protected _x: number;
    protected _y: number;

    protected _nX: number;
    protected _nY: number;

    protected _magnitude: number;

    public get x(): number
    {
        return this._x;
    }

    public set x(value: number)
    {
        this._x = value;
    }

    public get y(): number
    {
        return this._y;
    }

    public set y(value: number)
    {
        this._y = value;
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
        this._x = x;
        this._y = y;
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
        this._magnitude = Math.sqrt(this._x * this._x + this._y * this._y);
    }

    protected calcNormal(): void
    {
        this._nX = this._x / this._magnitude;
        this._nY = this._y / this._magnitude;
    }
}