export enum Transitions
{
    ROT = 0,
    OPCT = 0,
    SCL_X = 0,
    SCL_Y = 1,
    ANC_X = 0,
    ANC_Y = 1,
    TRANS_X = 0,
    TRANS_Y = 1,
    TIME_RM = 0,
}

export enum AnimType
{
    TRANSLATION,
    ROTATION,
    SCALE,
    OPACITY,
    ANCHOR,
    COMPOSIT
}

export class Animation
{
    protected _alpha: number;
    protected _frameCnt: number;
    protected _frameIdx: number;
    protected _startFrame: number;
    protected _isPlaying: boolean;
    protected _endValues: number[];
    protected _startValues: number[];
    protected _currentValues: number[];
    protected _type: AnimType;

    public get type(): AnimType
    {
        return this._type;
    }

    public get startFrame(): number
    {
        return this._startFrame
    }

    public get endFrame(): number
    {
        return this._startFrame + this._frameCnt;
    }

    public get frameCount(): number
    {
        return this._frameCnt;
    }

    public get isPalying(): boolean
    {
        return this._isPlaying;
    }

    constructor(startFrame: number, endFrame: number, startValues: number[], endValues: number[], type: AnimType)
    {
        this._type = type;

        this._endValues = endValues;
        this._startValues = startValues;

        this._startFrame = startFrame;
        this._frameCnt = endFrame - startFrame;

        this._currentValues = new Array<number>(this._startValues.length);

        for (let idx: number = 0; idx < this._startValues.length; idx++)
        {
            this._currentValues[idx] = 0;
        }
    }

    public getValue(idx: number): number
    {
        if (this._currentValues[idx])
        {
            return this._currentValues[idx];
        }

        return 0;
    }

    public start(): void
    {
        this._isPlaying = true;
        this._frameIdx = 0;
    }

    public startAt(idx: number): void
    {
        idx = Math.min(this._frameCnt - 1, Math.max(0, idx));

        this.start();
        this._frameIdx = idx;
    }
    
    public stop(): void
    {
        this._isPlaying = false;
    }

    public update(): boolean
    {
        if (this._frameIdx >= this._frameCnt)
        {
            this.stop();
        }
        
        if (!this._isPlaying)
        {
            return false;
        }
        
        this._frameIdx++;
        this._alpha = this._frameIdx / this._frameCnt;

        this.updateValues();

        return this._isPlaying;
    }

    protected updateValues(): void
    {
        for (let idx: number = 0; idx < this._startValues.length; idx++)
        {
            this._currentValues[idx] = this.lerp(this._startValues[idx], this._endValues[idx]);
        }
    }

    protected lerp(a: number, b: number): number
    {
        return (a * (1 - this._alpha)) + (this._alpha * b);
    }
}