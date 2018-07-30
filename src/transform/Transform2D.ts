import { Matrix } from "../transform/Matrix";
import { Vector2 } from "./Vector2";

export class Transform2D extends Matrix
{
    protected _dirty: boolean;
    protected _matrix: Matrix;

    protected _scale: Vector2;
    protected _rotation: number;
    protected _translation: Vector2;

    public get rotation(): number
    {
        return this._rotation;
    }

    public get scaling(): Vector2
    {
        return this._scale;
    }

    public get position(): Vector2
    {
        return this._translation;
    }

    constructor()
    {
        super(3, 3);

        this._dirty = true;
        this._matrix = new Matrix(3, 3);
        this._matrix.identity();
        this.identity();
    }
    
    protected init(): void
    {
        this._translation = new Vector2();
        this._rotation = 0;
        this._scale = new Vector2(1,1);
        this.update();
    }

    public identity(): void
    {
        super.identity();
        this.init();
    }

    public copy(m: Matrix): void
    {
        super.copy(m);

        this.update();
    }

    public dot(m: Matrix, retVal: Matrix): void
    {
        super.dot(m, retVal);

        if (retVal instanceof Transform2D)
        {
            (retVal as Transform2D).update();
        }
    }

    public rotate(a: number): void
    {
        this._matrix.identity();

        this._matrix.data[0][0] = Math.cos(a);
        this._matrix.data[0][1] = -Math.sin(a);
        this._matrix.data[1][0] = Math.sin(a);
        this._matrix.data[1][1] = Math.cos(a);

        this.dot(this._matrix, this);
    }

    public scale(sx: number, sy: number): void
    {
        this._matrix.identity();

        this._matrix.data[0][0] = sx;
        this._matrix.data[1][1] = sy;

        this.dot(this._matrix, this);
    }

    public translate(x: number, y: number): void
    {
        this._matrix.identity();

        this._matrix.data[0][2] = x;
        this._matrix.data[1][2] = y;

        this.dot(this._matrix, this);
    }

    protected update(): void
    {
        this._dirty = true;
        this.updateScale();
        this.updateRotation();
        this.updateTranslation();
    }

    protected updateTranslation(): void
    {
        this._translation.x = this.data[0][2];
        this._translation.y = this.data[1][2];
    }

    protected updateScale(): void
    {
        this._scale.x = Math.sign(this._data[0][0]) * Math.sqrt(this._data[0][0] * this._data[0][0] + this._data[0][1] * this._data[0][1]);
        this._scale.y = Math.sign(this._data[1][1]) * Math.sqrt(this._data[1][0] * this._data[1][0] + this._data[1][1] * this._data[1][1]);
    }

    protected updateRotation(): void
    {
        this._rotation = Math.atan2(this._data[1][0] , this._data[1][1]);
    }
}