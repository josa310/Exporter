import { Loader } from './loader/Loader';
import { Layer } from './layer/Layer';
import { Renderer } from './Renderer';

// TODO: Write comments above the lines they are describing
export class Script
{
    protected _root: Layer;
    protected _layers: Layer[];

    protected _loader: Loader;
    protected _renderer: Renderer;

    constructor(path: string)
    {
        this._renderer = new Renderer();

        this._layers = new Array<Layer>();
        this._loader = new Loader(path, this._layers, () => this.onLoad());
    }

    protected onLoad(): void
    {
        this._root = this._loader.rootLayer;
        this.start();
    }
    
    protected _timerId: number;
    public start(): void
    {
        this._timerId = setInterval(() => this.update(), Layer.FPS);
    }
    
    public update(): void
    {
        this._renderer.render(this._layers, this._root);
    }
}