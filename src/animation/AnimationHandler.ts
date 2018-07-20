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
    protected _animList: LinkedList<LinkedList<Animation>>;
    protected _animations: LinkedList<Animation>;
    protected _runningAnimations: Animation[];
    protected _transformChanged: boolean;

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
        this._runningAnimations = new Array<Animation>();
        this._animList = new LinkedList<LinkedList<Animation>>();

        this._id = AnimationHandler.OBJ_CNT++;
    }

    public add(newAnim: Animation): void
    {
        this._runningAnimations.push(newAnim);

        if (this._frameCnt < newAnim.endFrame)
        {
            this._frameCnt = newAnim.endFrame;
        }

        if (this._animList.length == 0)
        {
            let newList: LinkedList<Animation> = new LinkedList<Animation>();
            newList.linkAfter(newAnim);
            this._animList.linkAfter(newList);

            return;
        }
        
        let anims: LinkedList<Animation> = this._animList.first;
        while (anims)
        {
            let anim: Animation = anims.current;

            if (newAnim.startFrame < anim.startFrame)
            {
                let newList: LinkedList<Animation> = new LinkedList<Animation>();
                newList.linkAfter(newAnim);
                this._animList.linkBefore(newList);

                return;
            }
            else if (newAnim.startFrame == anim.startFrame)
            {
                anims.linkAfter(newAnim);
                
                return;
            }

            anims = this._animList.next;
        }

        let newList: LinkedList<Animation> = new LinkedList<Animation>();
        newList.linkAfter(newAnim);
        this._animList.linkAfter(newList);
    }

    public start(): void
    {
        this._frameIdx = 0;
        this._isPlaying = true;
        this._animations = this._animList.first;
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

        return this._isPlaying;
    }

    protected startAnimsOfFrame(): void
    {
        if (!this._animations || this._animations.first.startFrame != this._frameIdx)
        {
            return;
        }

        let animation: Animation = this._animations.first;
        while (animation)
        {
            animation.start();
            animation = this._animations.next;
        }

        this._animations = this._animList.next;
    }

    protected updateValues(): void
    {
        for  (let animation of this._runningAnimations)
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