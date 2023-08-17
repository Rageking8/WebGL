"use strict";

shaders.add(
    "base_vert",
    "vert",

`\
#version 300 es

layout(location = 0) in vec3 Pos;
layout(location = 1) in vec3 Color;
layout(location = 2) in vec2 Tex;
layout(location = 3) in vec3 Normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 outColor;
out vec2 outTex;
out vec3 outNormal;
out vec3 fragPos;

void main()
{
    gl_Position = projection * view * model * vec4(Pos, 1.0);

    fragPos = vec3(model * vec4(Pos, 1.0));
    outColor = Color;
    outTex = Tex;

    outNormal = mat3(transpose(inverse(model))) * Normal;
}
`
);
