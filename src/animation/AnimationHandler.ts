import { Link } from './../list/Link';
import { AnimType } from "./Animation";
import { Animation } from "./Animation";
import { AnimParams } from "./AnimParams";
import { Transitions } from "./Animation";
import { MathUtils } from "../MathUtils";
import { Transform2D } from "../layer/Transform2D";
import { LinkedList } from '../list/LinkedList';

export class AnimationHandler
{
    protected _frameCnt: number;
    protected _frameIdx: number;
    protected _isPlaying: boolean;
    protected _params: AnimParams;
    protected _startParams: AnimParams;
    protected _transformChanged: boolean;
    
    protected _runningAnimations: LinkedList<Animation>;
    protected _scheduledAnimations: LinkedList<Animation>;
    protected _animations: LinkedList<LinkedList<Animation>>;

    protected static OBJ_CNT: number = 0;
    public _id: number;

    public get params(): AnimParams
    {
        return this._params;
    }

    public set params(value: AnimParams)
    {
        this._params.copy(value);
        this.updateTransform();
        this._startParams.copy(this.params)
    }

    constructor()
    {
        this._frameCnt = 0;
        this._frameIdx = 0;
        this._isPlaying = false;
        this._transformChanged;
        this._params = new AnimParams();
        this._startParams = new AnimParams();
        this._runningAnimations = new LinkedList<Animation>();
        this._animations = new LinkedList<LinkedList<Animation>>();

        this._id = AnimationHandler.OBJ_CNT++;
    }

    public add(newAnimation: Animation): void
    {
        if (this._frameCnt < newAnimation.endFrame)
        {
            this._frameCnt = newAnimation.endFrame;
        }

        // console.log(newAnimation.type);
        if (this._animations.first)
        {
            do
            {
                let animation: Animation = this._animations.current.first;
                if (newAnimation.startFrame < animation.startFrame)
                {
                    this._animations.linkBefore(this.createAnimList(newAnimation));
                    return;
                }
                else if (newAnimation.startFrame == animation.startFrame)
                {
                    this._animations.current.pushToEnd(newAnimation);
                    return;
                }
            }
            while (this._animations.next)
        }
        this._animations.pushToEnd(this.createAnimList(newAnimation));
    }

    protected createAnimList(anim: Animation): LinkedList<Animation>
    {
        let list: LinkedList<Animation> = new LinkedList<Animation>();
        list.pushToEnd(anim);

        return list;
    }

    public start(): void
    {
        this._frameIdx = 0;
        this._isPlaying = true;
        this._scheduledAnimations = this._animations.first;
        this._params.copy(this._startParams);
    }

    public update(): boolean
    {
        if (!this._isPlaying)
        {
            return false;
        }

        this.startScheduledAnimation();
        
        this._transformChanged = false;
        this.updateValues();

        if (this._transformChanged)
        {
            this.updateTransform();
        }

        this._frameIdx++;

        this._isPlaying = this._frameIdx < this._frameCnt;

        return this._isPlaying;
    }

    protected startScheduledAnimation(): void
    {
        if (!this._scheduledAnimations || this._scheduledAnimations.first.startFrame != this._frameIdx)
        {
            return;
        }

        do
        {
            this._scheduledAnimations.current.start();
            this._runningAnimations.pushToEnd(this._scheduledAnimations.current);
        }
        while (this._scheduledAnimations.next)

        this._scheduledAnimations = this._animations.next;
    }

    protected updateValues(): void
    {
        let animation: Animation = this._runningAnimations.first;
        while  (animation)
        {
            while (!animation.update())
            {
                this._runningAnimations.removeCurrent();
                animation = this._runningAnimations.current;
                if (!animation)
                {
                    return;
                }
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

            animation = this._runningAnimations.next;
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