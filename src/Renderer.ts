import { Loader } from './Loader';
import { Layer } from "./layer/Layer";
import { Transform2D } from "./layer/Transform2D";
import { AnimParams } from './animation/AnimParams';

export class Renderer
{
    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    constructor()
    {
        this._canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this._context = this._canvas.getContext("2d");
    }

    public render(layers: Layer[], root: Layer): void
    {
        this._canvas.width = Loader.canvasWidth;
        this._canvas.height = Loader.canvasHeight;

        this.updateLayerTransforms(root);
        root.updated = false;
        
        this.clear();
        
        let alive: boolean = false;
        // Drawing the images in reverse order
        for (let idx: number = layers.length - 1; idx >= 0; idx--)       
        {
            this._context.save();
            let layer: Layer = layers[idx];

            layer.updated = false;
            alive = (layer.updateAnimation() || alive);
            this.setParams(layer);

            if (layer.asset)
                this._context.drawImage(layer.asset.img, 0, 0);
            
            this._context.restore();
        }

        if (!alive)
        {
            for (let layer of layers)
            {
                layer.startAnim();
            }
        }
    }
    
    protected setParams(layer: Layer): void
    {
        const t: Transform2D = layer.transform;

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
        
        this._context.globalAlpha = layer.animParams.opacity;
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

    protected updateLayerTransforms(layer: Layer): void
    {
        while (layer)
        {
            layer.updateTransform();
            
            if (!layer.updated && layer.firstChild)
            {
                layer.updated = true;
                layer = layer.firstChild;
            }
            else if (layer.next)
            {
                layer = layer.next;
            }
            else
            {
                layer = layer.parent;
            }
        }
    }
}