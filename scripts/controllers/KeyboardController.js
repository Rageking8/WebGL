"use strict";

class KeyboardController
{
    keydown(event)
    {
        if (!(event.code in this.#cur_state))
        {
            this.#cur_state[event.code] = true;
        }

        // Needs user gesture to request pointer lock
        // hence hook the call to the keyboardcontroller
        // when a keypress is detected
        mcontroller.hide_cursor();
    }

    keyup(event)
    {
        if (event.code in this.#cur_state)
        {
            delete this.#cur_state[event.code];
        }

        // Needs user gesture to request pointer lock
        // hence hook the call to the keyboardcontroller
        // when a keypress is detected
        mcontroller.hide_cursor();
    }

    is_down(code)
    {
        return code in this.#cur_state;
    }

    is_clicked(code)
    {
        let ret = code in this.#cur_state && this.#cur_state[code];
        if (ret)
        {
            this.#cur_state[code] = false;
        }

        return ret;
    }

    #cur_state = {};
}

let kbcontroller = new KeyboardController;

// Init all keyboard event listeners
document.addEventListener("keydown", event => {
    kbcontroller.keydown(event);
});

document.addEventListener("keyup", event => {
    kbcontroller.keyup(event);
});
