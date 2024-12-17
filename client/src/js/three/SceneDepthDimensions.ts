import * as THREE from "three";

// Source: https://codepen.io/discoverthreejs/pen/VbWLeM?editors=0010

class ViewportCorners {
  public depth: number;
  public visibleHeight: number;
  public visibleWidth: number;

  constructor(
    depth: number,
    readonly camera: THREE.PerspectiveCamera,
    readonly scene?: THREE.Scene
  ) {
    this.depth = depth;
    this.visibleHeight = 0;
    this.visibleWidth = 0;

    this.update();
  }

  update() {
    const cameraOffset = this.camera.position.z;
    const depth =
      this.depth < cameraOffset
        ? this.depth - cameraOffset
        : this.depth + cameraOffset;

    const vFOV = (this.camera.fov * Math.PI) / 180;

    this.visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    this.visibleWidth = this.visibleHeight * this.camera.aspect;
  }

  getPoint(x: number, y: number, z: number) {
    const cameraOffset = this.camera.position.z;
    const depth = z < cameraOffset ? z - cameraOffset : z + cameraOffset;

    const vFOV = (this.camera.fov * Math.PI) / 180;

    const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    const visibleWidth = visibleHeight * this.camera.aspect;

    return new THREE.Vector3(
      (x / window.innerWidth) * visibleWidth,
      (y / window.innerHeight) * visibleHeight,
      z
    );
  }
}

export default ViewportCorners;
