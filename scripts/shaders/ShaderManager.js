"use strict";

class ShaderManager
{
    add(shader_name, shader_type, shader_source)
    {
        if (!(shader_name in this.#all_shaders) &&
            (shader_type == "vert" || shader_type == "frag"))
        {
            this.#all_shaders[shader_name] =
                { type: shader_type, source: shader_source };
        }
    }

    program(vert_name, frag_name)
    {
        if (!(vert_name in this.#all_shaders) ||
            !(frag_name in this.#all_shaders)) return -1;            

        let program = gl.createProgram();

        let vert = this.#compile(vert_name);
        let frag = this.#compile(frag_name);

        // FIXME: add proper cleanup if 1 shader failed to compile
        if (vert == -1 || frag == -1) return -1;

        gl.attachShader(program, vert);
        gl.attachShader(program, frag);

        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success)
        {
            console.log("program link err:\n" +
                gl.getProgramInfoLog(program));
            return -1;
        }

        gl.deleteShader(vert);
        gl.deleteShader(frag);

        return program;
    }

    #compile(name)
    {
        if (!(name in this.#all_shaders)) return -1;

        let type;
        if (this.#all_shaders[name].type == "vert")
        {
            type = gl.VERTEX_SHADER;
        }
        else if (this.#all_shaders[name].type == "frag")
        {
            type = gl.FRAGMENT_SHADER;
        }

        let shader = gl.createShader(type);

        gl.shaderSource(shader, this.#all_shaders[name].source);
        gl.compileShader(shader);

        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success)
        {
            console.log(this.#all_shaders[name].type + " shader compilation err:\n" +
                gl.getShaderInfoLog(shader));
            return -1;
        }
        
        return shader;
    }

    set_mat4(id, location, mat)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(id, location), gl.FALSE, mat);
    }

    set_vec3(id, location, vec)
    {
        gl.uniform3fv(gl.getUniformLocation(id, location), vec);
    }

    set_vec3f(id, location, x, y, z)
    {
        gl.uniform3f(gl.getUniformLocation(id, location), x, y, z);
    }

    set_float(id, location, val)
    {
        gl.uniform1f(gl.getUniformLocation(id, location), val);
    }

    set_int(id, location, val)
    {
        gl.uniform1i(gl.getUniformLocation(id, location), val);
    }

    #all_shaders = {};
}

let shaders = new ShaderManager;
