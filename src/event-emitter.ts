interface IEvent {
    key: string;
    funcs: any[];
    count: number;
}

export abstract class EventEmitter {
    private events: IEvent[] = [];

    constructor() {
    }

    public on(key: string, func: (data?: any) => void) {
        this.addEvent(key, func, 0);
    }

    public once(key: string, func: (data?: any) => void) {
        this.addEvent(key, func, 1)
    }

    public many(key: string, func: (data?: any) => void, count: number) {
        this.addEvent(key, func, count)
    }

    public emit(key: string, data?: any) {
        let evt = this.findEvent(key);

        if (evt) {
            let args = null;
            if (arguments.length > 1) {
                args = [].splice.call(arguments, 0);
                args = (<any>args).splice(1);
            }

            for (let i = 0; i < evt.funcs.length; i++) {
                evt.funcs[i].apply(this, args);
            }

            if (evt.count > 0 && --evt.count === 0) {
                // remove event
                this.removeEvents(key);
            }
        }
    }

    public off(key: string, func?: (data?: any) => void): void {
        this.removeEvents(key, func);
    };

    public offAll(): void {
        this.removeEvents();
    };

    public offKey(key) {
        this.removeEvents(key);
    };

    private findEvent(key: string): IEvent | null {
        let foundItem: IEvent = {key: '', funcs: [], count: 0};

        this.events.forEach(function (itm) {
            if (itm.key === key) {
                foundItem = itm;
            }
        });

        return foundItem.key ? foundItem : null;
    }

    private removeEvents(key?: string, func?: any): void {
        let evts = this.events;
        if (!key) {
            // remove all the events
            evts.splice(0, evts.length);
        } else {
            if (!func) {
                // remove all items associated with key
                for (let i = evts.length; i > -1; i--) {
                    if (evts[i].key === key) {
                        evts.splice(i, 1);
                    }
                }
            }

            let evt = this.findEvent(key);
            if (evt) {
                for (let i = evts.length - 1; i > -1; i--) {
                    if (evts[i].funcs === func) {
                        evts.splice(i, 1);
                    }
                }
            }
        }
    };

    private addEvent(key: string, func: () => void, count: number) {
        let evt = this.findEvent(key);
        if (!evt) {
            evt = {key: key, funcs: [], count: count};
            this.events.push(evt);
        } else {
            for (let i = 0; i < evt.funcs.length; i++) {
                if (evt.funcs[i].func === func) {
                    return;
                }
            }
        }

        evt.funcs.push(func);
    };
}
