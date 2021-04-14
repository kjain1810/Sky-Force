var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.scale.set(100000, 100000, 5);
cube.position.set(0, 0, -100);
// scene.add(cube);


camera.position.z = 5;
camera.position.y = 0;
camera.lookAt(0, 0, 0);
var enemy_plane, star, player_plane, missile;
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
  'mesh/enemy_plane.glb',
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.material) child.material.metalness = 0.1;
    });
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    enemy_plane = gltf.scene;
  },
  null,
  function (error) { console.log("Error: " + error); }
);
loader.load(
  "mesh/star.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.material) child.material.metalness = 0.1;
    });
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    star = gltf.scene;
  },
  null,
  function (error) {
    console.log("Error: " + error);
  }
);
loader.load(
  "mesh/player_plane_self.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.material) child.material.metalness = 0.1;
    });
    console.log(gltf.scene);
    gltf.scene.position.set(0, -3, 0);
    gltf.scene.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
    gltf.scene.scale.set(0.04, 0.04, 0.04);
    scene.add(gltf.scene);
    player_plane = gltf.scene;
  },
  null,
  function (error) {
    console.log("Error: " + error);
  }
)
loader.load(
  "mesh/missile.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.material) child.material.metalness = 0.1;
    });
    console.log(gltf.scene);
    gltf.scene.position.set(0, -3, 0);
    gltf.scene.rotation.set(Math.PI / 2, Math.PI, 0);
    gltf.scene.scale.set(0.05, 0.05, 0.04);
    missile = gltf.scene;
  },
  null,
  function (error) {
    console.log("Error: " + error);
  }
)

var missiles = [];

var animate = async function () {
  requestAnimationFrame(animate);
  for(var i = 0; i < missiles.length; i++) {
    missiles[i].position.y += 0.1;
    missiles[i].rotation.z += 0.2;
    if(missiles[i].position.y > 5) {
      scene.remove(missiles[i]);
      missiles = missiles.filter((m) => m != missiles[i]);
    }
  }
  renderer.render(scene, camera);
};

animate();

var ySpeed = 0.05;
var xSpeed = 0.05;
document.addEventListener("keydown", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
  var keyCode = event.which;
  if (keyCode == 37) {
    player_plane.position.x -= xSpeed;
  } else if (keyCode == 38) {
    player_plane.position.y += ySpeed;
  } else if (keyCode == 39) {
    player_plane.position.x += xSpeed;
  } else if (keyCode == 40) {
    player_plane.position.y -= ySpeed;
  } else if (keyCode == 32) {
    var missilecopy = missile.clone();
    missilecopy.position.set(player_plane.position.x, player_plane.position.y, player_plane.position.z);
    scene.add(missilecopy);
    missiles.push(missilecopy);
  }
}