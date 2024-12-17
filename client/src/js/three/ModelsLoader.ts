import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class ModelsLoader {
  static loader = new GLTFLoader();
  static src = "assets/models/models.gltf";

  static async load(): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      const models: Record<string, any> = {};

      this.loader.load(this.src, (gltf) => {
        gltf.scene.traverse((obj) => {
          const [namespace] = obj.name.split("_");
          if (!models[namespace]) models[namespace] = [];
          models[namespace].push(obj.clone());
        });

        resolve(models);
      });
    });
  }
}

export default ModelsLoader;
