import { AnimType } from "./Animation";
import { Animation } from "./Animation";
import { AnimParams } from "./AnimParams";
import { Transitions } from "./Animation";
import { MathUtils } from "../MathUtils";
import { Transform2D } from "../layer/Transform2D";

export class AnimationHandler
{
    protected _params: AnimParams;
    protected _animations: Animation[];
    protected _transformChanged: boolean;

    public get params(): AnimParams
    {
        return this._params;
    }

    public set params(value: AnimParams)
    {
        this._params.copy(value);
        this.updateTransform();
    }

    constructor()
    {
        this._transformChanged;
        this._params = new AnimParams();
        this._animations = new Array<Animation>();
    }

    public add(animation: Animation): void
    {
        this._animations.push(animation);
    }

    public start(): void
    {
        for (let animation of this._animations)
        {
            animation.start();
        }
    }

    public update(): void
    {
        this._transformChanged = false;
        
        this.updateValues();

        if (this._transformChanged)
        {
            this.updateTransform();
        }
    }

    protected updateValues(): void
    {
        for (let animation of this._animations)
        {
            if (!animation.update())
            {
                animation.start();
            }

            switch (animation.type)
            {
                case AnimType.OPACITY:
                    this._params.opacity = animation.getValue(Transitions.OPCT) / 100;
                    break;

                case AnimType.TRANSLATION:
                    this._transformChanged = true;
                    this._params.translation.x = animation.getValue(Transitions.TRANS_X);
                    this._params.translation.y = animation.getValue(Transitions.TRANS_Y);
                    break;

                case AnimType.ROTATION:
                    this._transformChanged = true;
                    this._params.rotation = animation.getValue(Transitions.ROT) * MathUtils.DEG_TO_RAD;
                    break;
                    
                case AnimType.SCALE:
                    this._transformChanged = true;
                    this._params.scale.x = animation.getValue(Transitions.SCL_X) / 100;
                    this._params.scale.y = animation.getValue(Transitions.SCL_Y) / 100;
                    break;
                    
                case AnimType.ANCHOR:
                    this._transformChanged = true;
                    this._params.anchor.x = -animation.getValue(Transitions.ANC_X);
                    this._params.anchor.y = -animation.getValue(Transitions.ANC_Y);
                    break;
                
            }
        }
    }
    
    protected updateTransform(): void
    {
        let transform: Transform2D = this._params.transform;
        transform.identity();
        transform.translate(this._params.translation.x, this._params.translation.y);
        transform.rotate(this._params.rotation);
        // TODO: alter scale to enable non uniform scaling
        transform.scale(this._params.scale.x);
        transform.translate(this._params.anchor.x, this._params.anchor.y);
    }
}