/**
 * @class InterpolateValue
 * @classdesc Helper class to interpolate values between states. It has mechanics
 * to smoothen unreliable intervals of state and can interpolate simple values
 * such as `number`, as well as complex: {@link pc.Vec2}, {@link pc.Vec3}, {@link pc.Vec4}, {@link pc.Quat}, {@link pc.Color}.
 * @property {number|pc.Vec2|pc.Vec3|pc.Vec4|pc.Quat|pc.Color} value Current Value,
 * that it interpolated between states on every update.
 */

class InterpolateValue {
    INTERPOLATION_STATES_LIMIT = 8;

    /**
     * @constructor
     * @param {number|pc.Vec2|pc.Vec3|pc.Vec4|pc.Quat|pc.Color} value Value to interpolate.
     * Can be a simple `number`, as well as complex: {@link pc.Vec2}, {@link pc.Vec3}, {@link pc.Vec4}, {@link pc.Quat}, {@link pc.Color} object with `lerp` or `slerp`, `copy` and `clone` method.
     */
    constructor(value, object, key, setter, tickrate) {
        // TODO
        // challenge object,key,setter, as it becomes too large of a constructor
        // maybe `attach` method can simplify it
        this.type = typeof (value) === 'object' ? value.constructor : null;
        this.pool = [];
        this.states = [];
        this.current = 0;
        this.time = 0;
        this.speed = 1;
        this.tickrate = tickrate;

        this.from = this.type ? value.clone() : value;
        this.value = this.type ? value.clone() : value;

        this.object = object;
        this.key = key;
        this.setter = setter;
    }

    /**
     * @method set
     * @description Force a value set, ignoring an interpolation.
     * @param {number|pc.Vec2|pc.Vec3|pc.Vec4|pc.Quat|pc.Color} value
     */
    set(value) {
        if (this.type) {
            this.from.copy(value);
            this.value.copy(value);
        } else {
            this.from = value;
            this.value = value;
        }
    }

    /**
     * @method add
     * @description Add a value to list of interpolation states.
     * @param {number|pc.Vec2|pc.Vec3|pc.Vec4|pc.Quat|pc.Color} value
     */
    add(value) {
        if (this.type) {
            let vec;

            if (this.states.length > this.INTERPOLATION_STATES_LIMIT) {
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

    /**
     * @method update
     * @description Call an update, with should be called at the application
     * update interval. This will progress interpolation through states based on Delta Time.
     * @param {number} dt Delta Time of an application update frequency.
     */
    update(dt) {
        if (!this.states.length)
            return;

        const duration = 1.0 / this.tickrate;
        let to, lerp;

        // TODO
        // interpolator should always work before the last state
        // to ensure there is extra state available,
        // so it should not run out of states while they come regularly

        let speed = 1;
        if (this.states.length <= 2) {
            speed = 0.9;
        } else {
            speed = 1 + Math.max(0, Math.min(10, this.states.length - 2)) * 0.01;
        }
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
                let state = this.states.shift();
                if (this.type)
                    this.pool.push(state);
                to = state;
                this.current--;
            }
        }

        if (!this.states.length) {
            lerp = 1;
        } else {
            to = this.states[this.current];
            lerp = Math.min(1.0, this.time / duration);
        }

        if (this.type) {
            if (lerp === 1) {
                this.value.copy(to);
            } else {
                if (this.value.slerp) {
                    this.value.slerp(this.from, to, lerp);
                } else {
                    this.value.lerp(this.from, to, lerp);
                }
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
