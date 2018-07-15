
export class Matrix
{
    protected _m: number;
    protected _n : number;
    protected _data: number[][];
    protected _tmpData: number[][];

    public get data(): number[][]
    {
        return this._data;
    }

    constructor(m: number, n: number)
    {
        this._m = m;
        this._n = n;

        this.allocate();
    }

    public dot(m: Matrix, retVal: Matrix): void
    {
        if (m._m != this._n)
        {
            return null;
        }

        for (let i: number = 0; i < this._m; i++)
        {
            for (let j: number = 0; j < m._n; j++)
            {
                let val: number = 0;
                for (let k: number = 0; k < m._m; k++)
                {
                    val += (this._data[i][k] * m._data[k][j]);
                }
                this._tmpData[i][j] = val;
            }
        }

        for (let i: number = 0; i < this._m; i++)
        {
            for (let j: number = 0; j < m._n; j++)
            {
                retVal._data[i][j] = this._tmpData[i][j];
            }
        }
    }

    public mult(val: number): Matrix
    {
        for (let i: number = 0; i < this._m; i++)
        {
            for (let j: number = 0; j < this._n; j++)
            {
                this._data[i][j] *= val;
            }
        }

        return this;
    }

    public copy(m: Matrix): void
    {
        if (m._m != this._m || m._n != this._n)
        {
            this._m = m._m;
            this._n = m._n;
            this.allocate();
        }
        
        for (let i: number = 0; i < this._m; i++)
        {
            for (let j: number = 0; j < this._n; j++)
            {
                this._data[i][j] = m._data[i][j];
            }
        }
    }
    
    public identity(): void
    {
        for (let i: number = 0; i < this._m; i++)
        {
            for (let j: number = 0; j < this._n; j++)
            {
                this._data[i][j] = (i == j) ? 1 : 0;
            }
        }
    }

    protected allocate(): void
    {
        this._data = new Array<Array<number>>();
        this._tmpData = new Array<Array<number>>();
        for (let i: number = 0; i < this._m; i++)
        {
            this._data[i] = new Array<number>();
            this._tmpData[i] = new Array<number>();
            for (let j: number = 0; j < this._n; j++)
            {
                this._data[i].push(0);
                this._tmpData[i].push(0);
            }
        }
    }
}
