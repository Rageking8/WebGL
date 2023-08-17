const init_time = performance.now();
let last_time = performance.now();

const { vec2, vec3, mat3, mat4 } = glMatrix;

let Util = {
    time_elapsed: function()
    {
        return (performance.now() - init_time) / 1000;
    },

    dt: function()
    {
        let now_time = performance.now();
        let diff = (now_time - last_time) / 1000;

        last_time = now_time;

        return diff;
    }
}

function deg(rad) {
    return rad * 180 / Math.PI;
}

function rad(deg) {
    return deg * Math.PI / 180;
}
