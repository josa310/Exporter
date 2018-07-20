import { Link } from './Link';

export class LinkedList<T>
{
    protected _last: Link<T>;
    protected _first: Link<T>
    protected _current: Link<T>;

    protected _length: number;
    protected _lastIdx: number;

    protected _pool: Link<T>;

    public get prev(): T
    {
        if (this._current.prev)
        {
            this._current = this._current.prev;
            this._lastIdx--;
            return this._current.data;
        }
        return null;
    }

    public get next(): T
    {
        if (this._current.next)
        {
            this._current = this._current.next;
            this._lastIdx++;
            return this._current.data;
        }
        return null;
    }

    public get current(): T
    {
        return this._current.data;
    }

    public get first(): T
    {
        if (this._first)
        {
            this._current = this._first;
            return this._current.data;
        }

        return null;
    }

    public get length(): number
    {
        return this._length;
    }

    constructor()
    {
        this._last = null;
        this._first = null;
        this._current = null;

        this._length = 0;
        this._lastIdx = 0;
    }

    public getByIdx(idx: number): T
    {
        if (idx == (this._lastIdx + 1))
        {
            return this.next;
        }
        else if (idx == (this._lastIdx - 1))
        {
            return this.prev;
        }

        if (this.checkIdx(idx))
        {
            return this._current.data;
        }

        return null;
    }

    public add(item: T): void
    {
        let idx: number = Math.max(0, this._length - 1);
        this.linkAfter(item, idx);
    }

    public linkAfter(item: T, idx: number = this._lastIdx): void
    {
        if (!this.checkIdx(idx))
        {
            return;
        }

        let link: Link<T> = this.prepLink(item);

        if (this._current)
        {
            if (this._current.next)
            {
                this._current.next.prev = link;
            }
            else
            {
                this._last = link;
            }

            link.prev = this._current;
            link.next = this._current.next;

            this._current.next = link;
        }
        else
        {
            this._first = link;
            this._last = link;
        }

        this._current = link;
        this._length++;
    }

    public linkBefore(item: T, idx: number = this._lastIdx): void
    {
        if (this.checkIdx(idx))
        {
            return;
        }

        let link: Link<T> = this.prepLink(item);

        if (this._current)
        {
            if (this._current.prev)
            {
                this._current.prev.next = link;
            }
            else
            {
                this._first = link;
            }

            link.prev = this._current.prev;
            link.next = this._current;
            
            this._current.prev = link;
        }
        else
        {
            this._first = link;
            this._last = link;
        }

        this._current = link;
        this._length++;
    }

    protected checkIdx(idx: number): boolean
    {
        if (idx < 0 || idx > this._length)
        {
            return false;
        }
        while (this._lastIdx < idx)
        {
            this.next;
        }
        while (idx > this._lastIdx)
        {
            this.prev;
        }        

        return true;
    }

    protected prepLink(item: T): Link<T>
    {
        let link: Link<T> = this.getLink();
        link.data = item;

        return link;
    }

    protected getLink(): Link<T>
    {
        let retVal: Link<T>;
        if (this._pool)
        {
            retVal = this._pool;
            this._pool = this._pool.next;
        }
        else
        {
            retVal = new Link<T>();
        }

        return retVal;
    }

    // TODO: IMPLEMENT THIS
    // public remove(idx: number = this._lastIdx): void
    // {
    //     if (!this._current)
    //     {
    //         return;
    //     }

    //     if (this._current == this._last)
    //     {
    //         this._last = this._current.prev;
    //     }
    //     else if (this._current == this._first)
    //     {
    //         this._first = this._current.next;
    //     }

    //     this._current.prev = null;
    //     if (this._pool)
    //     {
    //         this._pool.prev = this._current;
    //         this._current.next = this._pool;
    //     }
    //     this._pool = this._current;
    // }
}