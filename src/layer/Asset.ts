import { Layer } from './Layer';
import { LinkedList } from './../list/LinkedList';

export class Asset
{
    protected _id: string;
    protected _src: string;
    protected _width: number;
    protected _height: number; 
    protected _isPreComp: boolean;
    protected _img: HTMLImageElement;
    protected _layers: LinkedList<Layer>;

    public get isPrecomp(): boolean
    {
        return this._isPreComp;
    }

    public get img(): HTMLImageElement
    {
        return this._img;
    }

    constructor(data: any, cb: () => void, layers: LinkedList<Layer> = null)
    {
        this._isPreComp = layers != null;
        if (this._isPreComp)
        {
            this._layers = layers;
            return;
        }

        this._id = data.id;
        this._src = data.u + data.p;
        this._width = data.w;
        this._height = data.h;

        this._img = document.createElement("img");
        this._img.src = data.u + data.p;
        this._img.onload = cb;
    }
}