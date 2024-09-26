import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const linePoints: BABYLON.Vector3[] = [
  new BABYLON.Vector3(-1, 1, -1),
  new BABYLON.Vector3(2, 1, 1),
];

const createScene = () => {
  const scene = initScene();

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.5 },
    scene
  );
  sphere.position.y = 1; // Raise the sphere slightly above the ground to make it visible

  const line = BABYLON.MeshBuilder.CreateLines("line", { points: linePoints }, scene);
  line.color = new BABYLON.Color3(1, 0, 0);

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERMOVE:
        const pickResult = scene.pick(
          pointerInfo.event.clientX,
          pointerInfo.event.clientY
        );
        if (pickResult?.pickedPoint) {
          // Update the sphere's position to follow the mouse
          sphere.position.x = pickResult.pickedPoint.x;
          sphere.position.z = pickResult.pickedPoint.z;
        }
        break;
    }
  });

  return scene;
};

function initScene() {
  const scene = new BABYLON.Scene(engine);
  // Create an orthographic camera to simulate 2D view (top-down)
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());

  // Adjust the orthographic size based on canvas dimensions
  const aspectRatio = canvas.width / canvas.height;
  const size = 5;
  camera.orthoLeft = -size * aspectRatio;
  camera.orthoRight = size * aspectRatio;
  camera.orthoTop = size;
  camera.orthoBottom = -size;

  // Create a simple light (even though we don't need it for a 2D top-down view)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
