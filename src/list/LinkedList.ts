import { Link } from './Link';

export class LinkedList<T>
{
    protected _length: number;

    protected _pool: Link<T>;
    protected _last: Link<T>;
    protected _first: Link<T>;
    protected _current: Link<T>;

    public get current(): T
    {
        if (this._current)
        {
            return this._current.data;
        }

        return null;
    }

    public get first(): T
    {
        this._current = this._first;

        return this.current;
    }

    public get last(): T
    {
        this._current = this._last;

        return this.current;
    }

    public get next(): T
    {
        if (this._current)
        {
            this._current = this._current.next;
        }        
        return this.current;
    }

    public get prev(): T
    {
        if (this._current)
        {
            this._current = this._current.prev;
        }        
        return this.current;
    }

    public get length(): number
    {
        return this._length;
    }

    constructor()
    {
        this._pool = null;
        this._last = null;
        this._first = null;
        this._current = null;
        this._length = 0;
    }

    public linkBefore(item: T): void
    {
        if (!this._current || this._current == this._first)
        {
            this.pushToStart(item);
            return;
        }
        
        let link: Link<T> = this.createLink(item);
        
        this._current.prev.next = link;
        link.prev = this._current.prev;
        link.next = this._current;
        this._current.prev = link;
        
        this._length++;
    }

    public linkAfter(item: T): void
    {
        if (!this._current || this._current == this._last)
        {
            this.pushToEnd(item);
            return;
        }
        
        let link: Link<T> = this.createLink(item);

        this._current.next.prev = link;
        link.next = this._current.next;
        link.prev = this._current;
        this._current.next = link;

        this._length++;
    }

    public pushToStart(item: T): void
    {
        let link: Link<T> = this.createLink(item);

        if (!this._first)
        {
            this._current = link;
            this._last = link;
        }
        else
        {
            this._first.prev = link;
        }

        link.next = this._first;
        this._first = link;

        this._length++;
    }

    public pushToEnd(item: T): void
    {
        let link: Link<T> = this.createLink(item);

        if (!this._last)
        {
            this._current = link;
            this._first = link;
        }
        else
        {
            this._last.next = link;
        }

        link.prev = this._last;
        this._last = link;

        this._length++;
    }

    public removeCurrent(): void
    {
        if (!this._current)
        {
            return;
        }

        let next: Link<T> = this._current.next;

        if (this._current.next)
        {
            this._current.next.prev = this._current.prev;
        }
        if (this._current.prev)
        {
            this._current.prev.next = this._current.next;
        }

        if (this._current == this._first)
        {
            this._first = this._current.next;
        }
        if (this._current == this._last)
        {
            this._last = this._current.prev;
        }

        let tmp = this._current;
        this._current = this._current.next;

        if (this._pool)
        {
            this._pool.prev = tmp;
        }

        tmp.next = this._pool;
        this._pool = tmp;

        this._length--;
    }

    protected createLink(item: T): Link<T>
    {
        let link: Link<T>;
        if (this._pool)
        {
            link = this._pool;
            this._pool = this._pool.next;

            link.next = null;
            link.prev = null;
        }
        else
        {
            link = new Link<T>();
        }
        link.data = item;

        return link;
    }
}