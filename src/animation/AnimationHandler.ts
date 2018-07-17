import { AnimType } from "./Animation";
import { Animation } from "./Animation";
import { AnimParams } from "./AnimParams";
import { Transitions } from "./Animation";
import { MathUtils } from "../MathUtils";

export class AnimationHandler
{
    protected _params: AnimParams;
    protected _animations: Animation[];

    public get params(): AnimParams
    {
        return this._params;
    }

    public set params(value: AnimParams)
    {
        this._params.copy(value);
    }

    constructor()
    {
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
                    this._params.translation.x = animation.getValue(Transitions.TRANS_X);
                    this._params.translation.y = animation.getValue(Transitions.TRANS_Y);
                    break;

                case AnimType.ROTATION:
                    this._params.rotation = animation.getValue(Transitions.ROT) * MathUtils.DEG_TO_RAD;
                    break;

                case AnimType.SCALE:
                    this._params.scale.x = animation.getValue(Transitions.SCL_X) / 100;
                    this._params.scale.y = animation.getValue(Transitions.SCL_Y) / 100;
                    break;

                case AnimType.ANCHOR:
                    this._params.scale.x = animation.getValue(Transitions.ANC_X);
                    this._params.scale.y = animation.getValue(Transitions.ANC_Y);
                    break;
                
            }
        }
    }
}