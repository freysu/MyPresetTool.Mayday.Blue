// // // import * as THREE from 'three';
// // // import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// // // import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// // // // Scene, Camera, Renderer
// // // const scene = new THREE.Scene();
// // // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// // // const renderer = new THREE.WebGLRenderer({ antialias: true });
// // // renderer.setSize(window.innerWidth, window.innerHeight);
// // // document.body.appendChild(renderer.domElement);

// // // // Camera position
// // // camera.position.z = 5;

// // // // Handle: White Cylinder
// // // const handleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
// // // const handleMaterial = new THREE.MeshStandardMaterial({
// // //   color: 0xffffff,
// // //   metalness: 0.3,
// // //   roughness: 0.7,
// // // });
// // // const handle = new THREE.Mesh(handleGeometry, handleMaterial);
// // // scene.add(handle);

// // // // Metal Ring
// // // const ringGeometry = new THREE.CylinderGeometry(0.31, 0.31, 0.1, 32);
// // // const ringMaterial = new THREE.MeshStandardMaterial({
// // //   color: 0xd4af37, // Gold color
// // //   metalness: 0.8,
// // //   roughness: 0.3,
// // // });
// // // const ring = new THREE.Mesh(ringGeometry, ringMaterial);
// // // ring.position.y = 1.05;
// // // scene.add(ring);

// // // // Light Column: Long Tube
// // // const lightColumnGeometry = new THREE.CylinderGeometry(0.25, 0.25, 3, 32);
// // // const lightColumnMaterial = new THREE.MeshPhysicalMaterial({
// // //   color: 0xffffff,
// // //   emissive: 0x88ccff,
// // //   roughness: 0.2,
// // //   transmission: 0.9, // Transparent effect
// // //   thickness: 1,
// // // });
// // // const lightColumn = new THREE.Mesh(lightColumnGeometry, lightColumnMaterial);
// // // lightColumn.position.y = 2.5; // Positioned above handle
// // // scene.add(lightColumn);

// // // // Logo on Handle
// // // const fontLoader = new FontLoader();
// // // fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
// // //   const textGeometry = new TextGeometry('MAYDAY', {
// // //     font: font,
// // //     size: 0.15,
// // //     height: 0.02,
// // //   });
// // //   const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
// // //   const text = new THREE.Mesh(textGeometry, textMaterial);
// // //   text.position.set(-0.6, -0.5, 0.3);
// // //   text.rotation.y = Math.PI / 2;
// // //   handle.add(text);
// // // });

// // // // Lights and Environment
// // // const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// // // scene.add(ambientLight);

// // // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// // // directionalLight.position.set(5, 5, 5);
// // // scene.add(directionalLight);

// // // // Background
// // // scene.background = new THREE.Color(0xf0f0f0);

// // // // Animation Loop
// // // function animate() {
// // //   lightColumn.material.emissiveIntensity = 1 + 0.5 * Math.sin(Date.now() * 0.005); // Breathing light effect
// // //   renderer.render(scene, camera);
// // //   requestAnimationFrame(animate);
// // // }
// // // animate();

// // // // Responsive Canvas
// // // window.addEventListener('resize', () => {
// // //   camera.aspect = window.innerWidth / window.innerHeight;
// // //   camera.updateProjectionMatrix();
// // //   renderer.setSize(window.innerWidth, window.innerHeight);
// // // });

// // import * as THREE from 'three';
// // import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// // import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// // // Scene, Camera, Renderer
// // const scene = new THREE.Scene();
// // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// // const renderer = new THREE.WebGLRenderer({ antialias: true });
// // renderer.setSize(window.innerWidth, window.innerHeight);
// // document.body.appendChild(renderer.domElement);

// // // Camera position
// // camera.position.z = 5;

// // // Handle: White Cylinder with groove texture
// // const handleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
// // const handleMaterial = new THREE.MeshStandardMaterial({
// //   color: 0xffffff,
// //   metalness: 0.3,
// //   roughness: 0.7,
// //   bumpMap: createGrooveTexture(),
// //   bumpScale: 0.05,
// // });
// // const handle = new THREE.Mesh(handleGeometry, handleMaterial);
// // scene.add(handle);

// // // Silver Ring
// // const ringGeometry = new THREE.CylinderGeometry(0.31, 0.31, 0.1, 32);
// // const ringMaterial = new THREE.MeshStandardMaterial({
// //   color: 0xc0c0c0, // Silver color
// //   metalness: 0.8,
// //   roughness: 0.3,
// // });
// // const ring = new THREE.Mesh(ringGeometry, ringMaterial);
// // ring.position.y = 1.05;
// // scene.add(ring);

// // // Light Column: Transparent Tube
// // const lightColumnGeometry = new THREE.CylinderGeometry(0.25, 0.25, 3, 32);
// // const lightColumnMaterial = new THREE.MeshPhysicalMaterial({
// //   color: 0x0000ff, // Blue color
// //   emissive: 0x0000ff,
// //   roughness: 0.2,
// //   transmission: 0.9, // Transparent effect
// //   thickness: 1,
// // });
// // const lightColumn = new THREE.Mesh(lightColumnGeometry, lightColumnMaterial);
// // lightColumn.position.y = 2.5; // Positioned above handle
// // scene.add(lightColumn);

// // // Logo on Handle
// // const fontLoader = new FontLoader();
// // fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
// //   const textGeometry = new TextGeometry('M', {
// //     font: font,
// //     size: 0.15,
// //     height: 0.02,
// //   });
// //   const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 0.5 });
// //   const text = new THREE.Mesh(textGeometry, textMaterial);
// //   text.position.set(-0.6, -0.5, 0.3);
// //   text.rotation.y = Math.PI / 2;
// //   handle.add(text);
// // });

// // // Lights and Environment
// // const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// // scene.add(ambientLight);

// // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// // directionalLight.position.set(5, 5, 5);
// // scene.add(directionalLight);

// // // Background
// // scene.background = new THREE.Color(0xf0f0f0);

// // // Animation Loop
// // function animate() {
// //   lightColumn.material.emissiveIntensity = 1 + 0.5 * Math.sin(Date.now() * 0.005); // Breathing light effect
// //   renderer.render(scene, camera);
// //   requestAnimationFrame(animate);
// // }
// // animate();

// // // Responsive Canvas
// // window.addEventListener('resize', () => {
// //   camera.aspect = window.innerWidth / window.innerHeight;
// //   camera.updateProjectionMatrix();
// //   renderer.setSize(window.innerWidth, window.innerHeight);
// // });

// // // Function to create groove texture
// // function createGrooveTexture() {
// //   const canvas = document.createElement('canvas');
// //   const size = 128;
// //   canvas.width = size;
// //   canvas.height = size;
// //   const context = canvas.getContext('2d');
// //   context.fillStyle = '#ffffff';
// //   context.fillRect(0, 0, size, size);
// //   context.fillStyle = '#000000';
// //   for (let i = 0; i < size; i += 16) {
// //     context.fillRect(i, 0, 8, size);
// //   }
// //   const texture = new THREE.Texture(canvas);
// //   texture.needsUpdate = true;
// //   return texture;
// // }

// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// // Scene, Camera, Renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Camera position
// camera.position.z = 5;

// // Load the model
// const loader = new GLTFLoader();
// loader.load(
//   './assets/base_basic_shaded.glb',
//   function (gltf) {
//     const model = gltf.scene;
//     model.position.set(0, 0, 0); // 设置位置
//     model.rotation.y = Math.PI / 4; // 设置旋转
//     model.scale.set(1, 1, 1); // 设置缩放
//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error('An error happened', error);
//   },
// );

// // Lights and Environment
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight);

// // Background
// scene.background = new THREE.Color(0xf0f0f0);

// // Animation Loop
// function animate() {
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }
// animate();

// // Responsive Canvas
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });



import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加环境光
const ambientLight = new THREE.AmbientLight(0x404040); // 环境光
scene.add(ambientLight);

// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 加载模型
const loader = new GLTFLoader();
loader.load(
    './assets/base_basic_shaded.glb', // 替换为你的模型路径
    (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // 设置位置
        model.rotation.y = Math.PI / 4; // 设置旋转
        model.scale.set(2, 2, 2); // 设置缩放
        scene.add(model);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error happened', error);
    }
);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// 处理窗口大小变化
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
