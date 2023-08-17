"use strict";

class MouseController
{
    hide_cursor()
    {
        if (!document.pointerLockElement) {
            canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        }
    }

    update(event)
    {
        this.#x += event.movementX * this.#sensitivity;
        this.#y += event.movementY * this.#sensitivity;
    }

    x_delta()
    {
        let ret = this.#x;
        this.#x = 0;
        return ret;
    }

    y_delta()
    {
        let ret = this.#y;
        this.#y = 0;
        return ret;
    }

    set_sensitivity(new_sensitivity)
    {
        if (new_sensitivity > 0.01)
        {
            this.#sensitivity = new_sensitivity;
        }
    }

    #sensitivity = 0.15;
    #x = 0;
    #y = 0;
}

let mcontroller = new MouseController;

// Init all mouse event listeners
document.addEventListener("mousemove", event => {
    mcontroller.update(event);
});
