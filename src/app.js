import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 
const gui = new GUI();

// -----------
// Scene
// -----------
const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// -----------
// Aspect Ratio and Camera
// -----------
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

// FOV, aspect, (clipping): near, far:
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// -----------
// Renderer
// -----------
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// -----------
// Window Resize
// -----------
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// -----------
// Animation
// -----------
const clock = new THREE.Clock();
const tick = () => {

// For animation (e.g. position.x * elapsedTime):
const elapsedTime = clock.getElapsedTime();

// Update controls
controls.update();

// Render frame
renderer.render(scene, camera);

// Call tick on next frame
window.requestAnimationFrame(tick);
}

// Start
tick();