import { LinkedList } from './list/LinkedList';
import { Loader } from './loader/Loader';
import { Layer } from './layer/Layer';
import { Renderer } from './Renderer';

// TODO: Write comments above the lines they are describing
export class Script
{
    protected _loader: Loader;
    protected _renderer: Renderer;

    constructor(path: string)
    {
        this._renderer = new Renderer();

        this._loader = new Loader(path, () => this.onLoad());
    }

    protected onLoad(): void
    {
        this.start();
    }
    
    public start(): void
    {
        setInterval(() => this.update(), Layer.FPS);
    }
    
    public update(): void
    {
        this._renderer.render();
    }
}