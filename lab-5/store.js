import { uid } from './helpers.js';

class Store {
    constructor() {
        const raw = localStorage.getItem('shapes_app_v1');
        this.state = raw ? JSON.parse(raw) : { shapes: [] };
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
        fn(this.state);
        return () => {
            this.subscribers = this.subscribers.filter((s) => s !== fn);
        };
    }

    _saveAndNotify() {
        localStorage.setItem('shapes_app_v1', JSON.stringify(this.state));
        for (const s of [...this.subscribers]) s(this.state);
    }

    addShape(type, color) {
        const id = uid();
        this.state.shapes.push({ id, type, color });
        this._saveAndNotify();
        return id;
    }

    removeShape(id) {
        const prevLen = this.state.shapes.length;
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        if (this.state.shapes.length !== prevLen) {
            this._saveAndNotify();
        }
    }

    recolor(type, colorGen) {
        this.state.shapes = this.state.shapes.map((s) =>
            s.type === type ? { ...s, color: colorGen() } : s
        );
        this._saveAndNotify();
    }

    count(type) {
        return this.state.shapes.filter((s) => s.type === type).length;
    }
}

export const store = new Store();
