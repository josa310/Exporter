import { LinkedList } from './../list/LinkedList';
import { Asset } from './Asset';
import { Layer } from './Layer';

export class ResourceHandler
{
    public static CANVAS_WIDTH: number;
    public static CANVAS_HEIGHT: number;

    protected static _instance: ResourceHandler;

    protected _root: Layer;
    protected _layers: LinkedList<Layer>;
    protected _assets: {[key: string]: Asset};

    public static get instance(): ResourceHandler
    {
        if (!ResourceHandler._instance)
        {
            ResourceHandler._instance = new ResourceHandler();
        }

        return ResourceHandler._instance;
    }

    public get root(): Layer
    {
        return this._root;
    }

    public get layers(): LinkedList<Layer>
    {
        return this._layers;
    }

    public get assets(): {[key: string]: Asset}
    {
        return this._assets;
    }

    public set root(value: Layer)
    {
        this._root = value;
    }

    public set layers(value: LinkedList<Layer>)
    {
        this._layers = value;
    }

    public set assets(value: {[key: string]: Asset})
    {
        this._assets = value;
    }

    protected constructor()
    {
        this._assets = {};
        this._layers = new LinkedList<Layer>();
    }
}