var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

var fireTexture = new THREE.TextureLoader().load("./texture/Fire.png");

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
    console.log(gltf.scene);
    gltf.scene.rotation.set(Math.PI / 2, 0, 0);
    gltf.scene.position.set(0, 4, 0);
    gltf.scene.scale.set(0.02, 0.02, 0.02);
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
var enemies = [];
var fires = [];

var health = 100;
var score = 0;

var clock = new Date();
var lastTime = clock.getTime();


var animate = async function () {
  document.getElementById("health").innerHTML = "&nbsp&nbsp" + health;
  document.getElementById("score").innerHTML = "&nbsp&nbsp" + score;
  requestAnimationFrame(animate);
  for(var i = 0; i < missiles.length; i++) {
    missiles[i].position.y += 0.1;
    missiles[i].rotation.z += 0.2;
    if(missiles[i].position.y > 5) {
      scene.remove(missiles[i]);
      missiles = missiles.filter((m) => m != missiles[i]);
    }
  }
  var clock = new Date();
  var curTime = clock.getTime();
  if(curTime - lastTime > 2000) {
    var enemy = enemy_plane.clone();
    var dx = 1;
    if (curTime % 2) {
      dx = -1;
    }
    enemy.position.x = -3 * dx;
    enemies.push({
      "enemy": enemy,
      "x": 0,
      "diffx": dx * 0.0001
    });
    lastTime = curTime;
    scene.add(enemy);
  }
  for(var i = 0; i < enemies.length; i++) {
    enemies[i]["enemy"].position.y -= 0.02;
    enemies[i]["enemy"].children[1].rotation.y += 0.5;
    enemies[i]["enemy"].position.x += Math.sin(enemies[i]["x"]);
    enemies[i]["enemy"].rotation.y += 20*enemies[i]["diffx"];
    enemies[i]["x"] += enemies[i]["diffx"]
  }
  checkCollisions();
  renderer.render(scene, camera);
};

animate();

var ySpeed = 0.08;
var xSpeed = 0.08;
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

function checkCollisions() {
  for(var i = 0; i < missiles.length; i++)
  {
    for(var j = 0; j < enemies.length; j++)
    {
    }
  }
}