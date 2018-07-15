
export class Asset
{
    protected _id: string;
    protected _src: string;
    protected _width: number;
    protected _height: number; 
    protected _img: HTMLImageElement;

    public get img(): HTMLImageElement
    {
        return this._img;
    }

    constructor(data: any, cb: () => void)
    {
        this._id = data.id;
        this._src = data.u + data.p;
        this._width = data.w;
        this._height = data.h;

        this._img = document.createElement("img");
        this._img.src = data.u + data.p;
        this._img.onload = cb;
    }
}