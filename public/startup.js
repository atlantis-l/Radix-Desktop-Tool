!(() => {
  "use strict";

  var canvas = document.querySelector("#webgl");

  // Scroll variables
  var count = Math.random();
  var flag = false;

  // initialize REGL from a canvas element
  var regl = createREGL({
    canvas: canvas,
  });

  // Create a REGL draw command
  var draw = regl({
    frag: document.querySelector("#fragmentShader").textContent,
    vert: "attribute vec2 position; void main() { gl_Position = vec4(3.0 * position, 0.0, 1.0); }",
    attributes: { position: [-1, 0, 0, -1, 1, 1] },
    count: 3,
    uniforms: {
      globaltime: regl.prop("globaltime"),
      resolution: regl.prop("resolution"),
      aspect: regl.prop("aspect"),
      scroll: regl.prop("scroll"),
      velocity: regl.prop("velocity"),
    },
  });

  // Hook a callback to execute each frame
  regl.frame((ctx) => {
    // Resize a canvas element with the aspect ratio (100vw, 100vh)
    var aspect = canvas.scrollWidth / canvas.scrollHeight;
    canvas.width = 1200;
    canvas.height = 772;

    // Clear the draw buffer
    regl.clear({ color: [0, 0, 0, 0] });

    if (flag) {
      count = count - 0.0005;
    } else {
      count = count + 0.0005;
    }

    if (count >= 1) {
      count = 1;
      flag = true;
    } else if (count <= 0) {
      count = 0;
      flag = false;
    }

    // Execute a REGL draw command
    draw({
      globaltime: ctx.time,
      resolution: [ctx.viewportWidth, ctx.viewportHeight],
      aspect: aspect,
      scroll: count,
      velocity: 0,
    });
  });
})();
