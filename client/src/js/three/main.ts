import * as THREE from "three";

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
camera.position.z = 5;

const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
scene.add(new THREE.Mesh(cubeGeometry, cubeMaterial));

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#background-canvas")!,
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);

function animate(t: number) {
  cubeGeometry.rotateX(0.05);
  cubeGeometry.rotateZ(0.05);
  renderer.render(scene, camera);
}
