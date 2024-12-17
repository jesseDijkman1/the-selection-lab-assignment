import * as THREE from "three";
import CurvePath from "../CurvePath";

class Book {
  private readonly group: THREE.Object3D;
  private initialTimestamp: number;

  constructor(
    private readonly components: Array<THREE.Object3D | THREE.Mesh>,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly curvePath: CurvePath
  ) {
    this.group = new THREE.Object3D();
    this.initialTimestamp = null!;
  }

  render(scene: THREE.Scene) {
    this.group.add(...this.components);
    scene.add(this.group);
  }

  public update(t: number) {
    if (this.initialTimestamp === null) {
      this.initialTimestamp = t;
    }
  }
}

export default Book;
