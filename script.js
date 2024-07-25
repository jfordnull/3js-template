import * as THREE from 'three';

const canvas = document.querySelector('canvas.webgl')

const area = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, area.width/area.height);
camera.position.z = 3;
scene.add(camera);

// Default Cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 'red'});
const mesh = new THREE.Mesh(geometry,material);

scene.add(mesh);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(area.width,area.height);
renderer.render(scene,camera);