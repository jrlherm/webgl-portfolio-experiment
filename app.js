import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import testTexture from "./texture.jpg";
import * as dat from "dat.gui";

// Define the Sketch class
export default class Sketch {
  constructor(options) {
    // The DOM container where the scene will be rendered
    this.container = options.domElement;
    this.width = this.container.offsetWidth; // Container width
    this.height = this.container.offsetHeight; // Container height

    // Create a perspective camera
    this.camera = new THREE.PerspectiveCamera(
      80, // Field of view in degrees
      this.width / this.height, // Aspect ratio
      10, // Near clipping plane
      1000 // Far clipping plane
    );
    this.camera.position.z = 600; // Camera position in depth

    this.camera.fov =
      (2 * Math.atan(this.height / 2 / this.camera.position.z) * 180) / Math.PI;
    // Create a Three.js scene
    this.scene = new THREE.Scene();

    // Create a WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio
    this.renderer.setSize(this.width, this.height); // Render size

    // Add the renderer to the DOM container
    this.container.appendChild(this.renderer.domElement);

    // Orbit controls for interacting with the scene
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0; // Time for animation
    this.setupSettings();
    this.resize();
    this.addObjects(); // Add objects to the scene
    this.render(); // Start rendering

    this.setupResize(); // Set up window resize handling
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.001);
  }

  // Function to handle window resizing
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  // Set up window resize event listener
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  // Function to add objects to the scene
  addObjects() {
    // this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Cube geometry
    this.geometry = new THREE.PlaneGeometry(300, 300, 100, 100); //Plane geometry

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        uProgress: { value: 1.0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        uResolution: {
          value: new THREE.Vector2(this.width, this.height),
        },
        uQuadSize: {
          value: new THREE.Vector2(300, 300),
        },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material); // Create mesh with geometry and material
    this.mesh.position.x = 300;
    this.mesh.rotation.z = 0.5;
    // this.mesh.scale.set(2, 1, 1);
    this.scene.add(this.mesh); // Add the mesh to the scene
  }

  // Function to continuously render the scene
  render() {
    this.time += 0.05; // Update time for animation
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.uProgress.value = this.settings.progress;

    this.mesh.rotation.x = this.time / 2000; // Rotate on the x-axis
    this.mesh.rotation.y = this.time / 1000; // Rotate on the y-axis

    this.renderer.render(this.scene, this.camera); // Render the scene

    requestAnimationFrame(this.render.bind(this)); // Request the next frame
  }
}

// Create an instance of the Sketch class with the DOM container "container"
new Sketch({
  domElement: document.getElementById("container"),
});
