"use strict";

let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl2");

let container2_tex = IMG("assets/container2.png", gl.RGBA);
let container2_spec = IMG("assets/container2_specular.png", gl.RGBA);

let base_shader = shaders.program("base_vert", "base_frag");
let light_source_shader = shaders.program("light_source_vert", "light_source_frag");

let projection = mat4.create();

let VAO;
let light_source_vao;

let light_pos = vec3.fromValues(0.0, 0.0, 1.0);

let cube_pos = 0.0;

function resize_callback()
{
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    gl.viewport(0, 0, width, height);
    mat4.perspective(projection, rad(45.0), gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1, 100.0);
}

function render()
{    
    requestAnimationFrame(render);
    update();

    let dt = Util.dt();

    camera.update(dt);

    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(VAO);

    gl.useProgram(base_shader);
    let model = mat4.create();
    let view = camera.calc_view();

    mat4.translate(model, model, [ cube_pos, 0.0, 0.0 ]);

    shaders.set_mat4(base_shader, "model", model);
    shaders.set_mat4(base_shader, "view", view);
    shaders.set_mat4(base_shader, "projection", projection);
    shaders.set_vec3(base_shader, "view_pos", camera.get_pos());

    shaders.set_int(base_shader, "material.diffuse", 0);
    shaders.set_int(base_shader, "material.specular", 1);
    shaders.set_float(base_shader, "material.shininess", 32.0);

    shaders.set_vec3f(base_shader, "light.ambient", 0.2, 0.2, 0.2);
    shaders.set_vec3f(base_shader, "light.diffuse", 0.5, 0.5, 0.5);
    shaders.set_vec3f(base_shader, "light.specular", 1.0, 1.0, 1.0);

    shaders.set_float(base_shader, "light.constant", 1.0);
    shaders.set_float(base_shader, "light.linear", 0.09);
    shaders.set_float(base_shader, "light.quadratic", 0.032);

    shaders.set_vec3(base_shader, "light.position", light_pos);
    shaders.set_vec3(base_shader, "light.direction", camera.get_front());
    shaders.set_float(base_shader, "light.cutOff", Math.cos(rad(12.5)));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, container2_tex);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, container2_spec);

    gl.drawElements(gl.TRIANGLE_STRIP, 34, gl.UNSIGNED_INT, 0);

    // Light source cube
    gl.bindVertexArray(light_source_vao);

    gl.useProgram(light_source_shader);

    model = mat4.create();
    mat4.translate(model, model, light_pos);
    mat4.scale(model, model, [ 0.2, 0.2, 0.2 ]);

    shaders.set_mat4(light_source_shader, "model", model);
    shaders.set_mat4(light_source_shader, "view", view);
    shaders.set_mat4(light_source_shader, "projection", projection);

    gl.drawElements(gl.TRIANGLE_STRIP, 34, gl.UNSIGNED_INT, 0);

    // Calculate and set fps display
    let fps = Math.round(1 / dt);
    document.getElementById("fps_disp").innerHTML = "FPS: " + fps;
}

function update()
{
    camera.set_yaw(camera.get_yaw() + mcontroller.x_delta());
    camera.set_pitch(camera.get_pitch() - mcontroller.y_delta());

    if (document.pointerLockElement !== canvas)
    {
        document.getElementById("info_disp").style.display = "block";
    }
    else
    {
        document.getElementById("info_disp").style.display = "none";
    }

    cube_pos = (Math.sin(Util.time_elapsed()) * 1);
}

function init()
{
    gl.enable(gl.DEPTH_TEST);

    document.getElementById("info_disp").innerHTML = "Press any key to hide cursor";

    mat4.perspective(projection, rad(45.0), gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1, 100.0);

    var buf = [
        // +Z
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,

        // -Z
        -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0,
        -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0,
        0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, -1.0,

        // +X
        0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

        // -X
        -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0,
        -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

        // +Y
        0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,

        // -Y
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0
    ];

    var idx = [
        0, 1, 2, 3, 3,
        4, 4, 5, 6, 7, 7,
        8, 8, 9, 10, 11, 11,
        12, 12, 13, 14, 15, 15,
        16, 16, 17, 18, 19, 19,
        20, 20, 21, 22, 23
    ]

    VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);

    let VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buf), gl.STATIC_DRAW);

    let EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 44, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 44, 12);
    gl.enableVertexAttribArray(1);

    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 44, 24);
    gl.enableVertexAttribArray(2);

    gl.vertexAttribPointer(3, 3, gl.FLOAT, gl.FALSE, 44, 32);
    gl.enableVertexAttribArray(3);

    buf = [
        // +Z
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        // -Z
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,

        // +X
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,

        // -X
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        // +Y
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,

        // -Y
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5
    ];

    light_source_vao = gl.createVertexArray();
    gl.bindVertexArray(light_source_vao);

    let light_source_vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, light_source_vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buf), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 12, 0);
    gl.enableVertexAttribArray(0);

    render();
}
