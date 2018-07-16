
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
}

export enum AnimType
{
    TRANSLATION,
    ROTATION,
    SCALE,
    OPACITY,
    ANCHOR
}

export class Animation
{
    // TODO: Loop

    protected _alpha: number;
    protected _frameCnt: number;
    protected _frameIdx: number;
    protected _isPlaying: boolean;
    protected _endValues: number[];
    protected _startValues: number[];
    protected _currentValues: number[];
    protected _type: AnimType;
    protected _next: Animation;

    public get type(): AnimType
    {
        return this._type;
    }

    public get next(): Animation
    {
        return this._next;
    }

    constructor(frameCnt: number, startValues: number[], endValues: number[], type: AnimType)
    {
        this._type = type;
        this._frameCnt = frameCnt;
        this._endValues = endValues;
        this._startValues = startValues;
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
    
    public stop(): void
    {
        this._isPlaying = false;
    }

    public update(): boolean
    {
        if (!this._isPlaying)
        {
            return false;
        }

        this._frameIdx++;
        this._alpha = this._frameIdx / this._frameCnt;

        this.updateValues();

        // Goes to the end (preferably)
        if (this._frameIdx >= this._frameCnt)
        {
            this.stop();
        }
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