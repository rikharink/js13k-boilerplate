#version 300 es
precision highp float;                  // Set default float precision
in vec4 v_pos, v_col, v_uv, v_normal;   // Varyings received from the vertex shader: position, color, texture coordinates, normal (if any)
uniform vec3 light;                     // Uniform: light direction, smooth normals enabled
uniform vec4 o;                         // options [smooth, shading enabled, ambient, mix]
uniform sampler2D sampler;              // Uniform: 2D texture
out vec4 c;                             // Output: final fragment color
      // The code below displays colored / textured / shaded fragments
void main() {
    c = mix(texture(sampler, v_uv.xy), v_col, o[3]);  // base color (mix of texture and rgba)
    if(o[1] > 0.) {                                    // if lighting/shading is enabled:
        c = vec4(                                       // output = vec4(base color RGB * (directional shading + ambient light)), base color Alpha
        c.rgb * (max(0., dot(light, -normalize(       // Directional shading: compute dot product of light direction and normal (0 if negative)
        o[0] > 0.                                   // if smooth shading is enabled:
        ? vec3(v_normal.xyz)                        // use smooth normals passed as varying
        : cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz))   // else, compute flat normal by making a cross-product with the current fragment and its x/y neighbours
        ))) + o[2]),                                      // add ambient light passed as uniform
        c.a                                           // use base color's alpha
        );
    }
}