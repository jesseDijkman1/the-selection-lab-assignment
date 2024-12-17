import * as THREE from "three";
import { createNoise4D } from "simplex-noise";
import Book from "./models/Book";
import Fridge from "./models/Fridge";
import ModelsLoader from "./ModelsLoader";
import SceneDepthDimensions from "./SceneDepthDimensions";
import TimeTransitioner from "./TimeTransitioner";
import CurvePath from "./CurvePath";

const noise4d = createNoise4D();

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
camera.position.z = 15;
camera.position.y = 1;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#background-canvas")!,
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(width, height);

const modelsLoader = new ModelsLoader();
const viewportCorners = new SceneDepthDimensions(-5, camera, scene);
const timeTransitioner = new TimeTransitioner(2000);

const curvePath = new CurvePath(
  [
    viewportCorners.getPoint(width / 2 + 300, height, -1),
    viewportCorners.getPoint(width / 2 - 250, height / 2, 3),
    viewportCorners.getPoint(width / 2 - 200, 20, 9),
  ],
  10,
  timeTransitioner
);

curvePath.addPointsTransformer("applyNoiseX", (point, { state }) => {
  const noiseX = noise4d(point.x / 100, 0, 0, state.timeElapsed / 10);
  const noiseY = noise4d(0, point.y / 100, 0, state.timeElapsed / 10);
  const noiseZ = noise4d(0, 0, point.z / 100, state.timeElapsed / 10);

  return point.set(
    point.x + (noiseX - 0.5) * 0.5,
    point.y + (noiseY - 0.5) * 0.5,
    point.z + (noiseZ - 0.5) * 0.5
  );
});

curvePath.definePipeline("noise", ["applyNoiseX"], true);

let book: Book;
let fridge: Fridge;

async function init() {
  const models = await modelsLoader.load();

  if (models.fridge) {
    fridge = new Fridge(models.fridge, camera, curvePath);
    fridge.render(scene);
  }

  if (models.book) {
    book = new Book(models.book, camera, curvePath);
    book.render(scene);
  }

  // await book.load();
  // book.render(scene);

  const light1 = new THREE.AmbientLight(0xffffff, 2);
  const light = new THREE.PointLight(0xffffff, 500);
  light.position.set(-3, -2, 15);
  scene.add(light1, light);

  renderer.setAnimationLoop(animate);
}

init();

function animate(time: number) {
  timeTransitioner.update(time);
  curvePath.update();
  // book.update(t);
  fridge.update(time);
  // controls.update();

  renderer.render(scene, camera);
}
