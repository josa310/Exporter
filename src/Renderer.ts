import { LinkedList } from './list/LinkedList';
import { Loader } from './loader/Loader';
import { Layer } from "./layer/Layer";
import { Transform2D } from "./transform/Transform2D";
import { AnimationData } from './animation/AnimationData';

export class Renderer
{
    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    constructor()
    {
        this._canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
    }

    public render(layers: LinkedList<Layer>, root: Layer): void
    {
        this._canvas.width = Loader.canvasWidth;
        this._canvas.height = Loader.canvasHeight;

        root.update();
        
        this.clear();
        
        let animating: boolean = false;
        let layer: Layer = layers.first;

        while (layer)
        {
            this._context.save();

            animating = (layer.animating || animating);
            this.setParams(layer);

            if (layer.asset)
            {
                this._context.drawImage(layer.asset.img, 0, 0);
            }
            
            this._context.restore();

            layer = layers.next;
        }

        if (!animating)
        {
            layer = layers.first;
            while (layer)
            {
                layer.startAnim();
                layer = layers.next;
            }
        }
    }
    
    protected setParams(layer: Layer): void
    {
        const t: Transform2D = layer.transform;

        this._context.translate(t.position.x, t.position.y);
        this._context.rotate(t.rotation);
        this._context.scale(t.scaling.x, t.scaling.y);

        if (layer.skew)
        {
            this._context.transform(1, 
                layer.skew / 26 * Math.abs(Math.cos(layer.skewAxis * Math.PI / 180)),       // "Horizontal skewing"
                layer.skew / 26 * Math.abs(Math.sin(layer.skewAxis * Math.PI / 180)),       // "Vertical skewing"
                1, 0, 0);
        }
        
        this._context.globalAlpha = layer.animParams.opacity;
    }

    protected clear(): void
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.fillStyle = "#BBBBBB";
    }
}