import React, { useRef, useMemo, useState, useCallback, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cn } from '../../lib/utils';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uElapsed;
uniform vec2 uViewport;
uniform float uTempo;
uniform float uFlicker;
uniform float uBeamTotal;
uniform float uBeamGap;
uniform float uBeamWidth;
uniform float uSoftness;
uniform float uWidthPulse;
uniform float uWidthFloor;
uniform float uScaleX;
uniform float uShiftY;
uniform float uOriginX;
uniform float uChromaR;
uniform float uChromaG;
uniform float uChromaB;
uniform float uMaskTop;
uniform float uMaskBottom;
uniform float uMaskLeft;
uniform float uMaskRight;
uniform float uBloom;
uniform float uLuminance;
uniform vec3 uBgColor;
uniform float uAlpha;
uniform vec2 uPointer;
uniform float uCursorActive;

float prng(vec2 s) {
  s = fract(s * vec2(198.75, 743.26));
  s += dot(s, s + 67.41);
  return fract(s.x * s.y);
}

float pulse(float id, float t, float rate) {
  float e = prng(vec2(id * 341.7, id * 527.3));
  return clamp(sin(t * id * rate * e) * 0.5 + 0.5, 0.0, 1.0);
}

void main() {
  float ar = uViewport.x / uViewport.y;
  vec2 p = (vUv - 0.5) * vec2(ar, 1.0);

  p.x *= uScaleX;
  p.y += uShiftY;

  float t = uElapsed * uTempo;
  vec3 rays = vec3(0.0);

  for (float n = 0.0; n < 128.0; n += 1.0) {
    if (n >= uBeamTotal) break;

    float idx = n * 2.0;
    float rng = prng(vec2(idx, 382.91));
    float thickness = uBeamWidth * (sin(t * rng) * uWidthPulse + uWidthFloor);
    float blur = uSoftness * (sin(t * rng) * uWidthPulse + uWidthFloor);

    float midPoint = uBeamTotal * 0.5;
    float pointerShift = (uPointer.x - 0.5) * 4.0 * uCursorActive;
    float xPos = (n - midPoint) * uBeamGap + uOriginX + pointerShift;
    float beam = smoothstep(thickness + blur, thickness, abs(p.x - xPos));

    rays += beam * pulse(2.0 + idx * 0.02, t, uFlicker);
  }

  rays.r -= pulse(4.0, t, uFlicker) * uChromaR;
  rays.g -= pulse(5.0, t, uFlicker) * uChromaG;
  rays.b -= pulse(6.0, t, uFlicker) * uChromaB;

  rays *= smoothstep(-uMaskBottom, 0.0, p.y);
  rays *= smoothstep(0.0, -uMaskTop, p.y);
  rays *= smoothstep(-uMaskLeft, 1.0, p.x);
  rays *= smoothstep(uMaskRight, -1.0, p.x);

  rays += rays * uBloom;
  rays *= uLuminance;

  vec3 result = uBgColor + rays;
  gl_FragColor = vec4(result, uAlpha);
}
`;

interface AuroraBeamMeshProps {
  speed: number;
  flickerRate: number;
  rayCount: number;
  raySpacing: number;
  rayThickness: number;
  edgeSoftness: number;
  widthPulse: number;
  widthBase: number;
  horizontalScale: number;
  verticalOffset: number;
  originX: number;
  colorShiftR: number;
  colorShiftG: number;
  colorShiftB: number;
  vignetteTop: number;
  vignetteBottom: number;
  vignetteLeft: number;
  vignetteRight: number;
  bloom: number;
  brightness: number;
  backgroundColor: string;
  opacity: number;
  pointer: [number, number];
  cursorInteraction: boolean;
}

const AuroraBeamMesh: React.FC<AuroraBeamMeshProps> = ({
  speed,
  flickerRate,
  rayCount,
  raySpacing,
  rayThickness,
  edgeSoftness,
  widthPulse,
  widthBase,
  horizontalScale,
  verticalOffset,
  originX,
  colorShiftR,
  colorShiftG,
  colorShiftB,
  vignetteTop,
  vignetteBottom,
  vignetteLeft,
  vignetteRight,
  bloom,
  brightness,
  backgroundColor,
  opacity,
  pointer,
  cursorInteraction
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const currentPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uElapsed: { value: 0 },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uTempo: { value: 1 },
      uFlicker: { value: 1.4 },
      uBeamTotal: { value: 32 },
      uBeamGap: { value: 0.2 },
      uBeamWidth: { value: 0.1 },
      uSoftness: { value: 0.3 },
      uWidthPulse: { value: 0.5 },
      uWidthFloor: { value: 0.6 },
      uScaleX: { value: 4.5 },
      uShiftY: { value: -0.5 },
      uOriginX: { value: 0.0 },
      uChromaR: { value: 1 },
      uChromaG: { value: 1 },
      uChromaB: { value: 1 },
      uMaskTop: { value: 0.95 },
      uMaskBottom: { value: 0.95 },
      uMaskLeft: { value: 5 },
      uMaskRight: { value: 5 },
      uBloom: { value: 2 },
      uLuminance: { value: 1 },
      uBgColor: { value: new THREE.Color(0, 0, 0) },
      uAlpha: { value: 1 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uCursorActive: { value: 0 }
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    const u = material.uniforms;

    u.uElapsed.value = state.clock.elapsedTime;
    u.uViewport.value.set(size.width, size.height);
    u.uTempo.value = speed;
    u.uFlicker.value = flickerRate;
    u.uBeamTotal.value = rayCount;
    u.uBeamGap.value = raySpacing;
    u.uBeamWidth.value = rayThickness;
    u.uSoftness.value = edgeSoftness;
    u.uWidthPulse.value = widthPulse;
    u.uWidthFloor.value = widthBase;
    u.uScaleX.value = horizontalScale;
    u.uShiftY.value = verticalOffset;
    u.uOriginX.value = originX;
    u.uChromaR.value = colorShiftR;
    u.uChromaG.value = colorShiftG;
    u.uChromaB.value = colorShiftB;
    u.uMaskTop.value = vignetteTop;
    u.uMaskBottom.value = vignetteBottom;
    u.uMaskLeft.value = vignetteLeft;
    u.uMaskRight.value = vignetteRight;
    u.uBloom.value = bloom;
    u.uLuminance.value = brightness;

    const parsedColor = new THREE.Color(backgroundColor);
    u.uBgColor.value.copy(parsedColor);
    u.uAlpha.value = opacity;
    u.uCursorActive.value = cursorInteraction ? 1.0 : 0.0;

    // Smooth pointer dampening
    const factor = 1 - Math.exp(-delta / 0.15);
    currentPointer.current.x += (pointer[0] - currentPointer.current.x) * factor;
    currentPointer.current.y += (pointer[1] - currentPointer.current.y) * factor;
    u.uPointer.value.set(currentPointer.current.x, currentPointer.current.y);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

export interface AuroraBeamProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: ReactNode;
  speed?: number;
  flickerRate?: number;
  rayCount?: number;
  raySpacing?: number;
  rayThickness?: number;
  edgeSoftness?: number;
  widthPulse?: number;
  widthBase?: number;
  horizontalScale?: number;
  verticalOffset?: number;
  originX?: number;
  colorShiftR?: number;
  colorShiftG?: number;
  colorShiftB?: number;
  vignetteTop?: number;
  vignetteBottom?: number;
  vignetteLeft?: number;
  vignetteRight?: number;
  bloom?: number;
  brightness?: number;
  backgroundColor?: string;
  opacity?: number;
  cursorInteraction?: boolean;
}

export const AuroraBeam: React.FC<AuroraBeamProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  children,
  speed = 0.5,
  flickerRate = 1.0,
  rayCount = 28,
  raySpacing = 0.25,
  rayThickness = 0.32,
  edgeSoftness = 0.65,
  widthPulse = 0.12,
  widthBase = 0.3,
  horizontalScale = 4.6,
  verticalOffset = -0.45,
  originX = 0.0,
  colorShiftR = 0.85,
  colorShiftG = 0.9,
  colorShiftB = 1.0,
  vignetteTop = 1.2,
  vignetteBottom = 0.95,
  vignetteLeft = 3.0,
  vignetteRight = 3.0,
  bloom = 3.5,
  brightness = 1.8,
  backgroundColor = '#07080A',
  opacity = 0.85,
  cursorInteraction = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<[number, number]>([0.5, 0.5]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!cursorInteraction || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPointer([
          (e.clientX - rect.left) / rect.width,
          1 - (e.clientY - rect.top) / rect.height
        ]);
      }
    },
    [cursorInteraction]
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        className="absolute inset-0 pointer-events-none"
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1 }}
      >
        <AuroraBeamMesh
          speed={speed}
          flickerRate={flickerRate}
          rayCount={rayCount}
          raySpacing={raySpacing}
          rayThickness={rayThickness}
          edgeSoftness={edgeSoftness}
          widthPulse={widthPulse}
          widthBase={widthBase}
          horizontalScale={horizontalScale}
          verticalOffset={verticalOffset}
          originX={originX}
          colorShiftR={colorShiftR}
          colorShiftG={colorShiftG}
          colorShiftB={colorShiftB}
          vignetteTop={vignetteTop}
          vignetteBottom={vignetteBottom}
          vignetteLeft={vignetteLeft}
          vignetteRight={vignetteRight}
          bloom={bloom}
          brightness={brightness}
          backgroundColor={backgroundColor}
          opacity={opacity}
          pointer={pointer}
          cursorInteraction={cursorInteraction}
        />
      </Canvas>

      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default AuroraBeam;
