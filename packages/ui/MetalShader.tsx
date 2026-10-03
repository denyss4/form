// The liquid metal shader itself (D5, the user: "download the WebGL and implement the liquid metal button"). Paper Shaders' fragment
// shader (@paper-design/shaders, Apache 2.0) drawn with expo-gl, which gives React Native a WebGL 2 context on iOS, Android and the web.
// The uniforms are the user's original component's, unchanged: repetition 4, softness 0.5, red and blue shift 0.3, no distortion or
// contour, angle 45, scale 8, the circle shape, offset (0.1, -0.1), no image. Time runs at `speed` (0.6 at rest, 2.4 for a moment on
// press, as the original), counted in milliseconds like Paper's ShaderMount.
// Reduce Motion (`still`): one frame, then nothing moves. If the context or a shader fails, `onFail` lets the button fall back.
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import { liquidMetalFragmentShader } from '@paper-design/shaders';

import { metalVertexShader } from './metalVertex';

const ORIGINAL_RATIO = 142 / 46;
const uniforms: Record<string, number> = {
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_scale: 8,
  u_shape: 1,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
  u_imageAspectRatio: 1,
};

export function MetalShader({ speed, still, onFail }: { speed: RefObject<number>; still: boolean; onFail: () => void }) {
  const frame = useRef<number | null>(null);
  // The GL surface takes its size when it is created, so it is created only once the layout is known, and again if the size changes
  // (found on the web: created mid-layout, it covered half the button).
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Liquid metal shader did not compile:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, metalVertexShader);
    const fragment = compile(gl.FRAGMENT_SHADER, liquidMetalFragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return onFail();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Liquid metal shader did not link:', gl.getProgramInfoLog(program));
      return onFail();
    }
    gl.useProgram(program);

    // Two triangles covering the canvas, at attribute location 0 (the vertex shader's layout).
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    gl.viewport(0, 0, width, height);
    const at = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform2f(at('u_resolution'), width, height);
    gl.uniform1f(at('u_pixelRatio'), PixelRatio.get());
    for (const [name, value] of Object.entries(uniforms)) gl.uniform1f(at(name), value);
    // The circle is sized from the canvas height. The original button is 142 x 46 (about 3:1); a full-width phone button is about 7:1,
    // so the shape grows by the same ratio, or the metal covers only part of the rim (found on the web).
    gl.uniform1f(at('u_scale'), uniforms.u_scale * Math.max(1, width / height / ORIGINAL_RATIO));
    gl.uniform1i(at('u_isImage'), 0);
    gl.uniform4f(at('u_colorBack'), 0, 0, 0, 0); // transparent: the pill behind shows through outside the shape
    gl.uniform4f(at('u_colorTint'), 1, 1, 1, 0); // no tint
    const time = at('u_time');

    let elapsed = 0;
    let last: number | null = null;
    const draw = (now: number) => {
      if (last !== null) elapsed += (now - last) * (speed.current ?? 0);
      last = now;
      gl.uniform1f(time, elapsed * 1e-3);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.flush();
      gl.endFrameEXP?.();
      if (!still) frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
  };

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!box || Math.round(box.w) !== Math.round(width) || Math.round(box.h) !== Math.round(height)) setBox({ w: width, h: height });
      }}
    >
      {box ? <GLView key={`${Math.round(box.w)}x${Math.round(box.h)}`} style={{ width: box.w, height: box.h }} onContextCreate={onContextCreate} /> : null}
    </View>
  );
}
