"use client";

/* eslint-disable react-hooks/immutability -- Three.js owns mutable GPU resources; frame updates intentionally mutate them outside React rendering. */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type SceneProps = {
  progress: number;
  pointer: [number, number];
  reduced: boolean;
  onReady?: () => void;
};
function fold(x: number, y: number) {
  const body = 0.22 * (1 - Math.min(1, (x / 1.5) ** 2));
  return (
    body +
    0.13 * Math.sin(x * 3.1 + y * 0.45) +
    0.045 * Math.sin(y * 4.8 + x * 2.5) +
    0.026 * Math.sin(x * 10.5 - y * 2.2) +
    0.045 * x * x
  );
}
function fabricGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0.68, 1.89);
  shape.lineTo(1.05, 1.93);
  shape.quadraticCurveTo(1.1, 1.94, 1.17, 1.88);
  shape.lineTo(2.08, 1.2);
  shape.quadraticCurveTo(2.14, 1.16, 2.09, 1.09);
  shape.lineTo(1.73, 0.51);
  shape.quadraticCurveTo(1.67, 0.43, 1.59, 0.49);
  shape.lineTo(1.035, 0.82);
  shape.lineTo(0.98, -1.88);
  shape.quadraticCurveTo(0.97, -2.04, 0.81, -2.06);
  shape.quadraticCurveTo(0, -2.17, -0.81, -2.06);
  shape.quadraticCurveTo(-0.97, -2.04, -0.98, -1.88);
  shape.lineTo(-1.035, 0.82);
  shape.lineTo(-1.59, 0.49);
  shape.quadraticCurveTo(-1.67, 0.43, -1.73, 0.51);
  shape.lineTo(-2.09, 1.09);
  shape.quadraticCurveTo(-2.14, 1.16, -2.08, 1.2);
  shape.lineTo(-1.17, 1.88);
  shape.quadraticCurveTo(-1.1, 1.94, -1.05, 1.93);
  shape.lineTo(-0.68, 1.89);
  shape.bezierCurveTo(-0.59, 1.14, 0.59, 1.14, 0.68, 1.89);
  shape.closePath();
  const base = new THREE.ShapeGeometry(shape, 16);
  const vertices = Array.from(base.attributes.position.array);
  let indices = Array.from(base.index!.array);
  // Subdivide exact contour triangles, retaining a smooth silhouette instead of a masked grid.
  for (let pass = 0; pass < 4; pass++) {
    const midpoint = new Map<string, number>(),
      next: number[] = [];
    const mid = (a: number, b: number) => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const found = midpoint.get(key);
      if (found !== undefined) return found;
      const index = vertices.length / 3;
      vertices.push(
        (vertices[a * 3] + vertices[b * 3]) / 2,
        (vertices[a * 3 + 1] + vertices[b * 3 + 1]) / 2,
        0,
      );
      midpoint.set(key, index);
      return index;
    };
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i],
        b = indices[i + 1],
        c = indices[i + 2],
        ab = mid(a, b),
        bc = mid(b, c),
        ca = mid(c, a);
      next.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
    }
    indices = next;
  }
  const uv: number[] = [];
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = fold(vertices[i], vertices[i + 1]);
    uv.push((vertices[i] + 2.2) / 4.4, (vertices[i + 1] + 2.2) / 4.4);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  const normals: number[] = [];
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i],
      y = vertices[i + 1],
      epsilon = 0.001;
    const normal = new THREE.Vector3(
      -(fold(x + epsilon, y) - fold(x - epsilon, y)) / (epsilon * 2),
      -(fold(x, y + epsilon) - fold(x, y - epsilon)) / (epsilon * 2),
      1,
    ).normalize();
    normals.push(normal.x, normal.y, normal.z);
  }
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  base.dispose();
  return geometry;
}
function collarGeometry() {
  const positions: number[] = [],
    uv: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= 90; i++) {
    const angle = Math.PI + (i / 90) * Math.PI;
    for (let j = 0; j < 2; j++) {
      const x = Math.cos(angle) * (0.68 + j * 0.115),
        y = 1.94 + Math.sin(angle) * (0.59 + j * 0.105);
      positions.push(x, y, fold(x, y) + 0.022);
      uv.push(i / 90, j);
    }
    if (i < 90) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
const textileGLSL = `
  float fabricHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
  float fabricNoise(vec2 p) { vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(fabricHash(i),fabricHash(i+vec2(1.,0.)),f.x),mix(fabricHash(i+vec2(0.,1.)),fabricHash(i+vec2(1.,1.)),f.x),f.y); }
  float fabricFbm(vec2 p) { float value=0.,amp=.5; for(int i=0;i<4;i++){value+=amp*fabricNoise(p);p=p*2.13+vec2(3.4,1.7);amp*=.5;} return value; }
`;
function GarmentLabel() {
  const texture = useLoader(
    THREE.TextureLoader,
    "/images/yikat-logo-white.png",
  );
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.59, 0.26, 18, 8);
    const positions = g.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) + 0.4,
        y = positions.getY(i) + 0.65;
      positions.setXYZ(i, x, y, fold(x, y) + 0.007);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.88}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
        toneMapped={false}
      />
    </mesh>
  );
}
function Garment({ progress, pointer, reduced }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const bubbleGroup = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const current = useRef(progress);
  const uniforms = useMemo(() => ({ uWash: { value: 0 } }), []);
  const geometry = useMemo(() => fabricGeometry(), []);
  const collar = useMemo(() => collarGeometry(), []);
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: "#0876d5",
      roughness: 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
      sheen: 0.22,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color("#c2e7ff"),
      envMapIntensity: 0.2,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uWash = uniforms.uWash;
      shader.vertexShader = "varying vec3 vFabric;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvFabric = position;",
      );
      shader.fragmentShader =
        "varying vec3 vFabric;\nuniform float uWash;\n" +
        textileGLSL +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float edge = mix(-2.65,2.65,uWash);
        float dirtSide = smoothstep(edge-.24,edge+.08,vFabric.x);
        float n = fabricFbm(vFabric.xy*3.2);
        float patchA = exp(-length((vFabric.xy-vec2(-.35,-.2))*vec2(1.6,1.25))*2.2);
        float patchB = exp(-length((vFabric.xy-vec2(.7,-1.2))*vec2(1.8,2.2))*2.1);
        float patchC = exp(-length((vFabric.xy-vec2(-1.4,1.05))*vec2(2.2,2.0))*1.6);
        float stain = clamp((patchA*1.5+patchB*1.6+patchC)*(.35+n*1.2),0.,.72)*dirtSide;
        float weave = sin(vFabric.x*280.)*sin(vFabric.y*280.)*.024;
        diffuseColor.rgb *= 1.0-weave;
        diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.19,.18,.16),stain*.8);
        float washLine = exp(-pow((vFabric.x-edge)*8.,2.))*sin(uWash*3.14159)*.22;
        diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.37,.72,.96),washLine);
      `,
      );
    };
    return m;
  }, [uniforms]);
  const seam = useMemo(() => {
    const points = Array.from({ length: 91 }, (_, i) => {
      const x = -0.8 + (i / 90) * 1.6,
        y = -1.935;
      return new THREE.Vector3(x, y, fold(x, y) + 0.025);
    });
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      90,
      0.006,
      4,
      false,
    );
  }, []);
  const bubbles = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        y: -1.75 + (i / 71) * 3.45,
        r: 0.026 + ((i * 17) % 13) / 190,
        z: 0.17 + ((i * 7) % 9) / 36,
        x: Math.sin(i * 3.71) * 0.28,
      })),
    [],
  );
  useEffect(() => {
    invalidate();
  }, [progress, pointer, invalidate]);
  useEffect(
    () => () => {
      geometry.dispose();
      collar.dispose();
      material.dispose();
      seam.dispose();
    },
    [geometry, collar, material, seam],
  );
  useFrame((_, delta) => {
    const targetX = reduced ? -0.09 : -0.09 + pointer[1] * 0.12;
    const targetY = reduced ? 0.13 : 0.13 + pointer[0] * 0.24;
    const amount = 1 - Math.exp(-delta * 8);
    current.current = THREE.MathUtils.lerp(
      current.current,
      progress,
      reduced ? 1 : amount,
    );
    uniforms.uWash.value = current.current;
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX,
        amount,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY,
        amount,
      );
      if (
        Math.abs(group.current.rotation.x - targetX) > 0.0001 ||
        Math.abs(group.current.rotation.y - targetY) > 0.0001 ||
        Math.abs(current.current - progress) > 0.0001
      )
        invalidate();
    }
    if (bubbleGroup.current) {
      bubbleGroup.current.position.x = -2.65 + current.current * 5.3;
      bubbleGroup.current.visible =
        current.current > 0.03 && current.current < 0.97;
    }
  });
  return (
    <group ref={group} rotation={[-0.09, 0.13, -0.1]} position={[0, 0.16, 0]}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      <GarmentLabel />
      <mesh geometry={collar} castShadow>
        <meshPhysicalMaterial
          color="#0c69bc"
          roughness={0.94}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={seam}>
        <meshStandardMaterial color="#4eaff7" roughness={1} />
      </mesh>
      <group ref={bubbleGroup}>
        {bubbles.map((b, i) => (
          <mesh key={i} position={[b.x, b.y, b.z + fold(0, b.y)]} scale={b.r}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshPhysicalMaterial
              color="#d6f1ff"
              metalness={0.08}
              roughness={0.07}
              transmission={0.58}
              thickness={0.1}
              ior={1.28}
              transparent
              opacity={0.78}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Studio({ progress, pointer, reduced }: SceneProps) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04).texture;
    scene.environment = environment;
    room.dispose();
    return () => {
      scene.environment = null;
      environment.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[-4, 4, 5]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[4, 0, 3]} intensity={0.35} color="#c9e8ff" />
      <Garment progress={progress} pointer={pointer} reduced={reduced} />
    </>
  );
}
export default function GarmentScene(props: SceneProps) {
  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 9.3], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0xffffff, 0);
        props.onReady?.();
      }}
    >
      <Studio {...props} />
    </Canvas>
  );
}
