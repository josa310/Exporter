import { AnimType } from "./Animation";
import { Animation } from "./Animation";
import { AnimParams } from "./AnimParams";
import { Transitions } from "./Animation";
import { MathUtils } from "../MathUtils";
import { Transform2D } from "../layer/Transform2D";

export class AnimationHandler
{
    protected _frameCnt: number;
    protected _frameIdx: number;
    protected _isPlaying: boolean;
    protected _params: AnimParams;
    protected _startParams: AnimParams;
    protected _animList: Animation;
    protected _nextAnim: Animation;
    protected _animations: Animation[];
    protected _transformChanged: boolean;

    public get params(): AnimParams
    {
        return this._params;
    }

    public set params(value: AnimParams)
    {
        this._params.copy(value);
        this._startParams.copy(value);
        this.updateTransform();
    }

    constructor()
    {
        this._frameCnt = 0;
        this._frameIdx = 0;
        this._isPlaying = false;
        this._transformChanged;
        this._params = new AnimParams();
        this._startParams = new AnimParams();
        this._animations = new Array<Animation>();
    }

    public add(newAnim: Animation): void
    {
        this._animations.push(newAnim);

        if (this._frameCnt < newAnim.endFrame)
        {
            this._frameCnt = newAnim.endFrame;
        }

        if (this._animList)
        {
            let anim: Animation = this._animList;
            while (true)
            {
                if (newAnim.startFrame < anim.startFrame)
                {
                    newAnim.next = anim;
                    anim.prev = newAnim;
                    this._animList = newAnim;

                    return;
                }
                else if (newAnim.startFrame == anim.startFrame)
                {
                    anim.sibling = newAnim;
                    newAnim.next = anim.next;
                    newAnim.prev = anim.prev;
                    if (newAnim.next)
                    {
                        newAnim.next.prev = newAnim;
                    }
                    if (newAnim.prev)
                    {
                        newAnim.prev.next = newAnim;
                    }

                    return;
                }
                else if (!anim.next)
                {
                    anim.next = newAnim;
                    newAnim.prev = anim;

                    return;
                }

                anim = anim.next;
            }
        }
        else
        {
            this._animList = newAnim;
        }
    }

    public start(): void
    {
        this._frameIdx = 0;
        this._isPlaying = true;
        this._nextAnim = this._animList;
        this._params.copy(this._startParams);
    }

    public update(): boolean
    {
        if (!this._isPlaying)
        {
            return false;
        }

        this.startAnimsOfFrame();
        
        this._transformChanged = false;
        this.updateValues();

        if (this._transformChanged)
        {
            this.updateTransform();
        }

        this._frameIdx++;

        this._isPlaying = this._frameIdx < this._frameCnt;

        return true;
    }

    protected startAnimsOfFrame(): void
    {
        if (!this._nextAnim || this._nextAnim.startFrame != this._frameIdx)
        {
            return;
        }

        let animation: Animation = this._nextAnim;
        while (animation)
        {
            animation.start();
            animation = animation.sibling;
        }

        this._nextAnim = this._nextAnim.next;
    }

    protected updateValues(): void
    {
        for  (let animation of this._animations)
        {
            if (!animation.update())
            {
                continue;
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
    
    public updateTransform(): void
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