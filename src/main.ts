import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

// Get the canvas element from the DOM
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Generate the Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = () => {
  // Create a basic Babylon.js scene
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

  // Add a sphere to the scene to represent the object that follows the mouse
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.5 },
    scene
  );
  sphere.position.y = 1; // Raise the sphere slightly above the ground to make it visible

  // Create a ground plane for reference (optional)
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  // Create a line mesh to draw on the scene
  let line: BABYLON.LinesMesh | null = null;

  const points: BABYLON.Vector3[] = [
    new BABYLON.Vector3(-1, 1, -1),
    new BABYLON.Vector3(2, 1, 1),
  ];

  line = BABYLON.MeshBuilder.CreateLines("line", { points: points }, scene);

  line.color = new BABYLON.Color3(1, 0, 0);

  // Handle pointer movement to draw the line and move the sphere
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
      case BABYLON.PointerEventTypes.POINTERDOWN:
        // const pick = scene.pick(
        //   pointerInfo.event.clientX,
        //   pointerInfo.event.clientY
        // );
        // if (pick?.pickedPoint) {
        //   // Add points to the line
        //   points.push(
        //     new BABYLON.Vector3(pick.pickedPoint.x, 0, pick.pickedPoint.z)
        //   );
        //
        //   // Create or update the line
        //   if (line) {
        //     line = BABYLON.MeshBuilder.CreateLines("line", {
        //       points: points,
        //       updatable: true,
        //       instance: line,
        //     });
        //   } else {
        //     line = BABYLON.MeshBuilder.CreateLines(
        //       "line",
        //       { points: points },
        //       scene
        //     );
        //   }
        // }
        break;
    }
  });

  return scene;
};

// Create the scene
const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(() => {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", () => {
  engine.resize();
});
