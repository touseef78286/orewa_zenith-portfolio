import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// PascalCase aliases for Three.js intrinsic elements to avoid TS errors with JSX.IntrinsicElements
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const ShaderMaterial = 'shaderMaterial' as any;
const Points = 'points' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const TorusKnotGeometry = 'torusKnotGeometry' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const LiquidBackground = ({ isZeroGravity }: { isZeroGravity: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color('#00FFA3') },
    uMode: { value: 0.0 }
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(isZeroGravity ? '#BD00FF' : '#00FFA3');
    uniforms.uMode.value = isZeroGravity ? 1.0 : 0.0;
  }, [isZeroGravity]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uMouse.value.lerp(new THREE.Vector2(state.mouse.x, state.mouse.y), 0.05);
    }
  });

  return (
    <Mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <PlaneGeometry args={[1, 1, 32, 32]} />
      <ShaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uMode;
          uniform vec3 uColor;
          varying vec2 vUv;

          float text(vec2 st) {
              vec2 grid = floor(st * 40.0);
              float t = uTime * 2.0;
              float char = fract(sin(grid.x * 123.45 + grid.y * 678.90 + t) * 43758.54);
              return step(0.98, char);
          }

          void main() {
            vec2 st = vUv;
            float speed = mix(1.0, 5.0, uMode);
            float dist = distance(st, uMouse * 0.5 + 0.5);
            float ripple = sin(dist * 15.0 - uTime * 1.5 * speed) * 0.04;
            float alpha = smoothstep(1.5, 0.0, dist + ripple);
            vec2 matrixSt = st;
            matrixSt.y += uTime * 0.5;
            float matrixCode = text(matrixSt);
            vec3 liquidColor = mix(vec3(0.002), uColor, alpha * (uMode > 0.5 ? 0.15 : 0.06));
            vec3 matrixColor = uColor * matrixCode * uMode * 0.4;
            gl_FragColor = vec4(liquidColor + matrixColor, 1.0);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </Mesh>
  );
};

const FlowParticles = ({ isZeroGravity }: { isZeroGravity: boolean }) => {
    const count = 10000;
    const meshRef = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color('#00FFA3') },
        uViewport: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uMode: { value: 0.0 }
    }), [viewport.width, viewport.height]);

    useEffect(() => {
        uniforms.uColor.value.set(isZeroGravity ? '#BD00FF' : '#00FFA3');
        uniforms.uMode.value = isZeroGravity ? 1.0 : 0.0;
    }, [isZeroGravity]);

    const [positions, data] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const dat = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60.0;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40.0;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20.0;
            dat[i * 3] = 0.04 + Math.random() * 0.12; 
            dat[i * 3 + 1] = Math.random() * Math.PI * 2.0; 
            dat[i * 3 + 2] = 0.1 + Math.random() * 0.9; 
        }
        return [pos, dat];
    }, [count]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();
            material.uniforms.uMouse.value.lerp(new THREE.Vector2(state.mouse.x, state.mouse.y), 0.05);
        }
    });

    return (
        <Points ref={meshRef}>
            <BufferGeometry>
                <BufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                <BufferAttribute attach="attributes-aData" count={count} array={data} itemSize={3} />
            </BufferGeometry>
            <ShaderMaterial
                vertexShader={`
                    uniform float uTime;
                    uniform vec2 uMouse;
                    uniform vec2 uViewport;
                    uniform float uMode;
                    attribute vec3 aData;
                    varying float vOpacity;
                    void main() {
                        vec3 pos = position;
                        float speedMult = mix(1.0, 8.0, uMode);
                        float slowTime = uTime * aData.x * speedMult;
                        pos.x += sin(slowTime + aData.y) * mix(2.5, 15.0, uMode);
                        pos.y += cos(slowTime * 0.7 + aData.y) * mix(2.5, 15.0, uMode);
                        vec3 worldMouse = vec3(uMouse.x * uViewport.x * 0.8, uMouse.y * uViewport.y * 0.8, 0.0);
                        float force = smoothstep(10.0, 0.0, distance(pos, worldMouse));
                        pos += normalize(pos - worldMouse + 0.001) * force * mix(3.0, 10.0, uMode);
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = (mix(28.0, 50.0, uMode) * aData.z / -mvPosition.z);
                        vOpacity = smoothstep(50.0, 5.0, length(pos.xy)) * (0.05 + 0.4 * aData.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                fragmentShader={`
                    uniform vec3 uColor;
                    varying float vOpacity;
                    void main() {
                        float d = distance(gl_PointCoord, vec2(0.5));
                        if (d > 0.5) discard;
                        gl_FragColor = vec4(uColor, vOpacity * pow(1.0 - d * 2.0, 2.5));
                    }
                `}
                uniforms={uniforms}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </Points>
    );
}

const FloatingObject = ({ isZeroGravity }: { isZeroGravity: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const springOffset = useRef(0);
    const springVelocity = useRef(0);
    const stiffness = 220;
    const damping = 12;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00FFA3') }
    }), []);

    useEffect(() => {
        uniforms.uColor.value.set(isZeroGravity ? '#BD00FF' : '#00FFA3');
    }, [isZeroGravity]);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            const delta = Math.min(state.delta, 0.1);
            const force = -stiffness * springOffset.current;
            const acceleration = force - damping * springVelocity.current;
            springVelocity.current += acceleration * delta;
            springOffset.current += springVelocity.current * delta;

            const speed = isZeroGravity ? 4.0 : 1.0;
            meshRef.current.rotation.x += 0.01 * speed;
            meshRef.current.rotation.y += 0.015 * speed;

            if (isZeroGravity) {
                meshRef.current.position.y = Math.sin(time * 2.0) * 2.0 + springOffset.current;
                meshRef.current.position.x = Math.cos(time * 1.5) * 4.0;
            } else {
                meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 2.8, 0.05);
                meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05) + springOffset.current;
            }
            const scaleOffset = 1.0 + Math.abs(springOffset.current) * 0.05;
            meshRef.current.scale.set(scaleOffset, scaleOffset, scaleOffset);
        }
    });

    return (
        <Mesh ref={meshRef} position={[2.8, 0, -2.5]} onPointerDown={(e: any) => { e.stopPropagation(); springVelocity.current = 18; }}>
            <TorusKnotGeometry args={[1.0, 0.35, 200, 40]} />
            <ShaderMaterial 
                vertexShader={`varying vec3 vNormal; void main() { vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`uniform vec3 uColor; varying vec3 vNormal; void main() { float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0); gl_FragColor = vec4(uColor * pow(rim, 3.0), 0.8); }`}
                uniforms={uniforms}
                transparent
                wireframe
                depthWrite={false}
            />
        </Mesh>
    );
}

export const Scene: React.FC<{ isZeroGravity: boolean }> = ({ isZeroGravity }) => {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 35 }} dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}>
      <AmbientLight intensity={0.3} />
      <PointLight position={[10, 10, 10]} intensity={2.0} color={isZeroGravity ? "#BD00FF" : "#00FFA3"} />
      <LiquidBackground isZeroGravity={isZeroGravity} />
      <FlowParticles isZeroGravity={isZeroGravity} />
      <FloatingObject isZeroGravity={isZeroGravity} />
    </Canvas>
  );
};
