import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import "../../style/main/main.scss"
import earth1 from "../../img/earthtex.jpg";
import earth2 from "../../img/earthtex2.jpg";

const Cube = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    // 씬, 카메라, 렌더러 생성
    const cubeSize = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(cubeSize, cubeSize);

    if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
    }

    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load(earth1);
    const texture2 = textureLoader.load(earth2);
    
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform sampler2D baseTexture;
        uniform sampler2D topTexture;
        varying vec2 vUv;

        void main() {
            vec4 baseColor = texture2D(baseTexture, vUv);
            vec4 topColor = texture2D(topTexture, vUv);
            gl_FragColor = mix(baseColor, topColor, 0.5);
            gl_FragColor.rgb *= 0.5;
        }
    `;

    const uniforms = {
        baseTexture: { value: texture1 },
        topTexture: { value: texture2 }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // 큐브 생성
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;

    // 애니메이션 루프
    const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;

        renderer.render(scene, camera);
    };

    animate();

    // 컴포넌트 언마운트 시 렌더러와 HTML 요소 제거
    return () => {
        if(mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
    };
}, []);

return <div ref={mountRef} className='cube-container'></div>;
};

export default Cube;
