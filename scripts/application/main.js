"use strict";

function main()
{
    window.addEventListener("resize", resize_callback);
    resize_callback();

    if (!gl)
    {
        alert("WebGL2 is not supported");
        return;
    }

    init();
}

main();
