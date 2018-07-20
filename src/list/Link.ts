
export class Link<T>
{
    protected _prev: Link<T>;
    protected _next: Link<T>;
    protected _data: T;

    public get next(): Link<T>
    {
        return this._next;
    }

    public get prev(): Link<T>
    {
        return this._prev;
    }

    public get data(): T
    {
        return this._data;
    }

    public set next(value: Link<T>)
    {
        this._next = value;
    }

    public set prev(value: Link<T>)
    {
        this._prev = value;
    }

    public set data(value: T)
    {
        this._data = value;
    }

    constructor()
    {
        this._data = null;
        this._prev = null;
        this._next = null;
    }
}