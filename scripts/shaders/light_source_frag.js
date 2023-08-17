"use strict";

shaders.add(
    "light_source_frag",
    "frag",

`\
#version 300 es

precision highp float;

out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0);
}
`
);
