import { MathUtils } from './MathUtils';
import { Sprite } from "./Sprite";



export class Script
{
    protected _httpRequest: XMLHttpRequest;
    protected _ctx: CanvasRenderingContext2D;
    protected _canvas: HTMLCanvasElement;
    protected _jsonImg: Sprite[];

    protected _isCanvasDraw: Boolean;
    protected _translatePointWithParent : number[];
    protected _rotationWithParent : number;
    protected _data: any;
    
    constructor(path: string)
    {
        this._canvas = <HTMLCanvasElement> document.getElementById('canvas');
        this._ctx = this._canvas.getContext('2d');
        this._jsonImg = new Array<Sprite>();
        this.loadJSON(path);

        this._isCanvasDraw = true;
        this._translatePointWithParent = [0,0,0];
    }

    protected loadJSON(path: string): void
    {
        this._httpRequest = new XMLHttpRequest();
        this._httpRequest.onreadystatechange = () => this.httpRequest();
       
        this._httpRequest.open("GET", path, true);
        this._httpRequest.send();
    }

    protected httpRequest(): void
    {
        if (this._httpRequest.readyState === XMLHttpRequest.DONE) 
        {
            if (this._httpRequest.status === 200)
            {
                this.processData(JSON.parse(this._httpRequest.responseText));
            }
        }
    }

    protected processData(data: any): void
    {
        let idx: number = 0;
        this._data = data;

        this._canvas.width = data.w;
        this._canvas.height = data.h;

        for(let asset of data.assets)
        {
            this._jsonImg.push(new Sprite(data, idx));
            let img = document.createElement("img");
            this._jsonImg[idx].img = img;

            img.src = asset.u + asset.p;
            img.onload = this.onImgLoad.bind(this, this._jsonImg[idx]);

            idx++;
        }
    }

    protected onImgLoad(sprite: Sprite): void
    {
        /* Render every image on every new image load */
        sprite.loaded = true;
        this.render();
    }

    protected render(): void
    {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);     // Clearing the canvas

        for (let idx: number = this._jsonImg.length - 1; idx >= 0; idx--)       // Drawing the images in reverse order
        {
            let sprite = this._jsonImg[idx];

            if (sprite.loaded)
            {
                this.drawImage(sprite);
            }
        }
    }

    protected drawImage(sprite: Sprite): void
    {   
        this._ctx.save();                                                   // Save the default state of the canvas
        this.setDrawParams(sprite);                                         // Setting up the transform parameters
        this._ctx.drawImage(sprite.img, -sprite.ap[0], -sprite.ap[1]);      // Drawing the image on the canvas according to the anchor point
        this.drawCanvas(this._isCanvasDraw);
        this._ctx.restore();                                                // Restore canvas to its starting state
    }

    protected setDrawParams(sprite: Sprite): void
    {
        /* Opacity */
        this._ctx.globalAlpha = sprite.opacity / 100;

        /* if sprite has parent */
        if (sprite.hasParent)
        {
                /* Positionning */
                this._translatePointWithParent = this.imgParentingSetup(sprite);
                this._ctx.translate(this._translatePointWithParent[0], this._translatePointWithParent[1]);    

                /* Rotate */
                this._rotationWithParent = sprite.rotation + sprite.parentRotation;
                let sinA = MathUtils.sinDeg(sprite.parentRotation);
                let cosA = MathUtils.cosDeg(sprite.parentRotation);
                let X = (sprite.pos[0] * (sprite.parentScale[0] / 100)) - (sprite.parentAP[0] * (sprite.parentScale[0] /100));
                let Y = (sprite.pos[1] * (sprite.parentScale[1] / 100)) - (sprite.parentAP[1] * (sprite.parentScale[1] /100));
               
                this._ctx.translate(-this._translatePointWithParent[0] + sprite.parentPos[0], -this._translatePointWithParent[1] + sprite.parentPos[1]);
                this._ctx.translate((X*cosA) - (Y*sinA), (Y*cosA) + (X*sinA));
                this._ctx.rotate((this._rotationWithParent) * MathUtils.DEG_TO_RAD);
                
                /* Scale  */
                let scaleX = (sprite.parentScale[0] * sprite.scale[0]) / 100;
                let scaleY = (sprite.parentScale[1] * sprite.scale[1]) / 100;
                this._ctx.scale(scaleX / 100, scaleY / 100);
        }
        else
        {
            /* Positionning */
            this._ctx.translate(sprite.pos[0], sprite.pos[1]);              // Positioning the canvas before setting up the transform parameters

            /* Rotate */
            this._ctx.rotate(sprite.rotation * MathUtils.DEG_TO_RAD);

            /* Scale  */
            this._ctx.scale(sprite.scale[0] / 100, sprite.scale[1] / 100);
        }

        /* Skew */
        if (sprite.skew)                                                    // Skew
        {
            this._ctx.transform(1, sprite.skew / 70 * Math.abs(Math.cos(sprite.skewAxis * Math.PI / 180)), sprite.skew / 70 * Math.abs(Math.sin(sprite.skewAxis * Math.PI / 180)), 1, 0, 0);
        }
    }

    /* Draw the canvas for debugging */
    protected drawCanvas(isDrawn : Boolean): void
    {
        if (isDrawn)
        {
            this._ctx.strokeStyle = "#FF0000";
            this._ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    /* Getting the child coordinates from relative to the parent to relative to the canvas anchor point */
    protected imgParentingSetup(sprite: Sprite): number[]
    {
        let _posWithParentX = sprite.parentPos[0] - ((sprite.parentAP[0] * (sprite.parentScale[0] /100))) + (sprite.pos[0] * (sprite.parentScale[0] / 100));
        let _posWithParentY = sprite.parentPos[1] - ((sprite.parentAP[1] * (sprite.parentScale[1] /100))) + (sprite.pos[1] * (sprite.parentScale[1] / 100));
        return [_posWithParentX, _posWithParentY];
    }
}