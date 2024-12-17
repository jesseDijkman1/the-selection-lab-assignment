import * as THREE from "three";
import { easeInOutCubic } from "../utils";
import CurvePath from "../CurvePath";
import state from "../../lib/StateManager";

class Fridge {
  private readonly group: THREE.Object3D;
  private componentsMap: Record<string, THREE.Object3D | THREE.Mesh>;
  private initialTimestamp: number | null;
  private isVisible: boolean;

  constructor(
    private readonly components: Array<THREE.Object3D | THREE.Mesh>,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly curvePath: CurvePath
  ) {
    this.group = new THREE.Object3D();
    this.componentsMap = {};
    this.initialTimestamp = null;
    this.isVisible = state.getState().formFocussedByUser;

    state.on("ingredients-form:focus", () => {
      if (this.isVisible) return;
      this.isVisible = true;
      this.group.visible = true;
    });
  }

  resetMaterials() {
    for (let component of this.components) {
      if ("isMesh" in component && component.isMesh) {
        let color = 0xffffff;

        if (component.name.includes("apple")) {
          color = 0xff0000;
        }

        if (component.name.includes("milk")) {
          color = 0xc0dee5;
        }

        component.material = new THREE.MeshPhongMaterial({
          color,
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
    this.group.visible = this.isVisible;
    this.group.add(...this.components);
    scene.add(this.group);
  }

  transition(deltaT: number) {
    const door = this.componentsMap.fridge_door;
    const progress = Math.min(1, deltaT / 3000);
    const n = easeInOutCubic(this.isVisible ? progress : 1 - progress);

    const points = this.curvePath.getPoints();
    const curve = new THREE.CatmullRomCurve3(points);

    const point = curve.getPointAt(n);
    const tangent = curve.getTangentAt(n);

    this.group.position.copy(point);

    const rotationN = easeInOutCubic(Math.min(1, deltaT / 10000));
    const lookAtVector = point
      .clone()
      .add(tangent.normalize())
      .lerp(this.camera.position, rotationN);
    this.group.lookAt(lookAtVector);

    const openAngle = Math.PI;
    const initialQuaternion = door.quaternion.clone();
    const targetQuaternion = new THREE.Quaternion();

    targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), openAngle);

    door.quaternion.copy(initialQuaternion).slerp(targetQuaternion, rotationN);
  }

  update(t: number) {
    if (this.initialTimestamp === null) {
      if (!this.isVisible) return;

      this.initialTimestamp = t;
    }

    this.transition(t - this.initialTimestamp);
  }
}

export default Fridge;
