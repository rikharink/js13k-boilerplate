#version 300 es
precision highp float;                        // Set default float precision
in vec4 pos, col, uv, normal;                 // Vertex attributes: position, color, texture coordinates, normal (if any)
uniform mat4 pv, eye, m, im;                  // Uniform transformation matrices: projection * view, eye, model, inverse model
uniform vec4 bb;                              // If the current shape is a billboard: bb = [w, h, 1.0, 0.0]
out vec4 v_pos, v_col, v_uv, v_normal;        // Varyings sent to the fragment shader: position, color, texture coordinates, normal (if any)
void main() {
    gl_Position = pv * (                        // Set vertex position: p * v * v_pos
    v_pos = bb.z > 0.                         // Set v_pos varying:
    ? m[3] + eye * (pos * bb)                 // Billboards always face the camera:  p * v * distance + eye * (position * [w, h, 1.0, 0.0])
    : m * pos                                 // Other objects rotate normally:      p * v * m * position
    );
    v_col = col;                                // Set varyings 
    v_uv = uv;
    v_normal = transpose(inverse(m)) * normal;  // recompute normals to match model thansformation
}