"use strict";

class Camera
{
    update(dt)
    {
        let front_back_mag = vec3.clone(this.#front);
        vec3.multiply(front_back_mag, front_back_mag, [ this.#MOVEMENT_SPEED,
            this.#MOVEMENT_SPEED, this.#MOVEMENT_SPEED ]);
        vec3.multiply(front_back_mag, front_back_mag, [ dt, dt, dt ]);

        let left_right_mag = vec3.clone(this.#front);
        vec3.cross(left_right_mag, this.#front, this.#up);
        vec3.normalize(left_right_mag, left_right_mag);
        vec3.multiply(left_right_mag, left_right_mag, [ this.#MOVEMENT_SPEED,
            this.#MOVEMENT_SPEED, this.#MOVEMENT_SPEED ]);
        vec3.multiply(left_right_mag, left_right_mag, [ dt, dt, dt ]);

        if (kbcontroller.is_down("KeyW"))
        {
            vec3.add(this.#pos, this.#pos, front_back_mag);
        }

        if (kbcontroller.is_down("KeyS"))
        {
            vec3.subtract(this.#pos, this.#pos, front_back_mag);
        }

        if (kbcontroller.is_down("KeyA"))
        {
            vec3.subtract(this.#pos, this.#pos, left_right_mag);
        }

        if (kbcontroller.is_down("KeyD"))
        {
            vec3.add(this.#pos, this.#pos, left_right_mag);
        }

        let direction = vec3.create();
        direction[0] = Math.cos(rad(this.#yaw)) * Math.cos(rad(this.#pitch));
        direction[1] = Math.sin(rad(this.#pitch));
        direction[2] = Math.sin(rad(this.#yaw)) * Math.cos(rad(this.#pitch));

        vec3.normalize(direction, direction);

        this.#front = direction;
    }

    calc_view()
    {
        let lookat = mat4.create();

        let center = [];
        vec3.add(center, this.#pos, this.#front);

        mat4.lookAt(lookat, this.#pos, center, this.#up);

        return lookat;
    }

    set_yaw(new_yaw)
    {
        this.#yaw = new_yaw;
    }

    get_yaw()
    {
        return this.#yaw;
    }

    set_pitch(new_pitch)
    {
        if (new_pitch > 89.0)
        {
            new_pitch = 89.0;
        }
        else if (new_pitch < -89.0)
        {
            new_pitch = -89.0;
        }

        this.#pitch = new_pitch;
    }

    get_pitch()
    {
        return this.#pitch;
    }

    get_pos()
    {
        return this.#pos;
    }

    get_front()
    {
        return this.#front;
    }

    #up = vec3.fromValues(0.0, 1.0, 0.0);
    #pos = vec3.fromValues(0.0, 0.0, 2.0);
    #front = vec3.fromValues(0.0, 0.0, -1.0);
    #yaw = -90.0;
    #pitch = 0.0;

    #MOVEMENT_SPEED = 3.0;
}

let camera = new Camera;
