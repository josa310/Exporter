import { Loader } from './Loader';
import { Layer } from "./layer/Layer";
import { Transform } from "./layer/Transform";

export class Renderer
{
    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    constructor()
    {
        this._canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
    }

    public render(layers: Layer[]): void
    {
        this._canvas.width = Loader.canvasWidth;
        this._canvas.height = Loader.canvasHeight;

        this.clear();

        // Drawing the images in reverse order
        for (let idx: number = layers.length - 1; idx >= 0; idx--)       
        {
            this._context.save();

            const layer: Layer = layers[idx];

            this.setParams(layer);

            this._context.drawImage(layer.asset.img, 0, 0);
            
            this._context.restore();
        }
    }
    
    protected setParams(layer: Layer): void
    {
        const t: Transform = layer.transform;
    
        this._context.translate(t.position.x, t.position.y);
        this._context.rotate(t.rotation);
        this._context.scale(t.scaling, t.scaling);

        if (layer.skew)
        {
            this._context.transform(1, 
                layer.skew / 26 * Math.abs(Math.cos(layer.skewAxis * Math.PI / 180)),       // "Horizontal skewing"
                layer.skew / 26 * Math.abs(Math.sin(layer.skewAxis * Math.PI / 180)),       // "Vertical skewing"
                1, 0, 0);
        }
        
        this._context.globalAlpha = layer.opacity;
    }

    protected clear(): void
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.fillStyle = "#BBBBBB";
    }

    protected drawCanvas(): void
    {
        this._context.strokeStyle = "#FF0000";
        this._context.strokeRect(0, 0, this._canvas.width, this._canvas.height);
    }
}