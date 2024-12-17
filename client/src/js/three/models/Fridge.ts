import * as THREE from "three";
import { easeInOutCubic } from "../utils";
import CurvePath from "../CurvePath";

class Fridge {
  private readonly group: THREE.Object3D;
  private componentsMap: Record<string, THREE.Object3D | THREE.Mesh>;
  private initialTimestamp: number;

  constructor(
    private readonly components: Array<THREE.Object3D | THREE.Mesh>,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly curvePath: CurvePath
  ) {
    this.group = new THREE.Object3D();
    this.componentsMap = {};
    this.initialTimestamp = null!;
  }

  resetMaterials() {
    for (let component of this.components) {
      if ("isMesh" in component && component.isMesh) {
        component.material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0x000000,
          specular: 0x000000,
        });
      }
    }
  }

  render(scene: THREE.Scene) {
    this.resetMaterials();

    for (let component of this.components) {
      this.componentsMap[component.name] = component;
    }
    this.group.add(...this.components);
    scene.add(this.group);
  }

  transition(deltaT: number) {
    const door = this.componentsMap.fridge_door;
    const n = easeInOutCubic(Math.min(1, deltaT / 3000));

    const points = this.curvePath.getPoints();
    const curve = new THREE.CatmullRomCurve3(points);

    const point = curve.getPointAt(n);
    const tangent = curve.getTangentAt(n);

    this.group.position.copy(point);

    const lookAtVector = point
      .clone()
      .add(tangent.normalize())
      .lerp(this.camera.position, n);
    this.group.lookAt(lookAtVector);

    const openAngle = Math.PI;
    const initialQuaternion = door.quaternion.clone();
    const targetQuaternion = new THREE.Quaternion();

    targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), openAngle);

    const rotationN = easeInOutCubic(Math.min(1, deltaT / 10000));

    door.quaternion.copy(initialQuaternion).slerp(targetQuaternion, rotationN);
  }

  update(t: number) {
    if (this.initialTimestamp === null) {
      this.initialTimestamp = t;
    }

    this.transition(t - this.initialTimestamp);
  }
}

export default Fridge;