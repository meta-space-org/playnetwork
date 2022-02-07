INTERPOLATION_STATES_LIMIT = 8;

class InterpolateValue {
    constructor(value, object, key, setter) {
        this.type = typeof (value) === 'object' ? value.constructor : null;
        this.pool = [];
        this.states = [];
        this.current = 0;
        this.time = 0;
        this.speed = 1;

        this.from = this.type ? value.clone() : value;
        this.value = this.type ? value.clone() : value;

        this.object = object;
        this.key = key;
        this.setter = setter;
    }

    set(value) {
        if (this.type) {
            this.from.copy(value);
            this.value.copy(value);
        } else {
            this.from = value;
            this.value = value;
        }
    }

    add(value) {
        if (this.type) {
            let vec;

            if (this.states.length > INTERPOLATION_STATES_LIMIT) {
                vec = this.states.shift();
            } else if (this.pool.length) {
                vec = this.pool.pop();
            } else {
                vec = new this.type();
            }

            vec.copy(value);
            this.states.push(vec);
        } else {
            this.states.push(value);
        }
    }

    update(dt) {
        if (!this.states.length)
            return;

        const duration = 1.0 / pn.ups;
        let speed = 1 + (Math.max(0, Math.min(10, this.states.length - 2)) * 0.01);
        this.speed += (speed - this.speed) * 0.1;

        this.time += dt * this.speed;
        if (this.time >= duration) {
            this.time -= duration;
            this.current++;

            if (this.type) {
                this.from.copy(this.value);
            } else {
                this.from = this.value;
            }

            while (this.current > 0) {
                let vec = this.states.shift();
                this.pool.push(vec);
                this.current--;
            }
        }

        if (!this.states.length)
            return;

        const to = this.states[this.current];
        const lerp = Math.min(1.0, this.time / duration);

        if (this.type) {
            if (this.value.slerp) {
                this.value.slerp(this.from, to, lerp);
            } else {
                this.value.lerp(this.from, to, lerp);
            }
        } else {
            this.value = (this.from * lerp) + (this.value * (1 - lerp));
        }

        if (this.setter) {
            this.setter(this.value);
        } else if (this.object) {
            if (this.type) {
                this.object[this.key] = this.object[this.key].copy(this.value);
            } else {
                this.object[this.key] = this.value;
            }
        }
    }
}