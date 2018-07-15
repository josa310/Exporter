import { Loader } from './Loader';
import { Layer } from './layer/Layer';
import { Renderer } from './Renderer';

// TODO: Write comments above the lines they are describing
export class Script
{
    protected _loader: Loader;
    protected _renderer: Renderer;
    protected _layers: Layer[];

    constructor(path: string)
    {
        this._renderer = new Renderer();

        this._layers = new Array<Layer>();
        this._loader = new Loader(path, this._layers, () => this.onLoad());
    }

    protected onLoad(): void
    {
        this._renderer.render(this._layers);
    }
}