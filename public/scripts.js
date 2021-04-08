var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

var ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.scale.set(100000, 100000, 5);
cube.position.set(0, 0, -100);
scene.add(cube);


camera.position.z = 5;

var plane, star;
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

loader.load(
	'mesh/enemy_plane.glb',
	function ( gltf ) {
        gltf.scene.traverse(function (child) {
    	  if(child.material) child.material.metalness = 0.1;
        });
	gltf.scene.position.set(-0.5, -1.2, 0);
  gltf.scene.scale.set(0.1, 0.1, 0.1);
    scene.add(gltf.scene);
    gltf.animations;
    gltf.scene;
    gltf.scenes;
    gltf.cameras;
    gltf.asset;
    plane = gltf.scene;
  },
	null,
	function ( error ) {console.log( "Error: " + error );}
);
loader.load(
  "mesh/star.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.material) child.material.metalness = 0.1;
	});
	console.log(gltf.scene)
	gltf.scene.position.set(1.7, 1.7, 1);
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    scene.add(gltf.scene);
    gltf.animations;
    gltf.scene;
    gltf.scenes;
    gltf.cameras;
    gltf.asset;
    star = gltf.scene;
  },
  null,
  function (error) {
    console.log("Error: " + error);
  }
);

var animate = async function () {
	requestAnimationFrame( animate );
	plane.rotation.x += 0.01;
	plane.rotation.y += 0.01;
	star.rotation.x -= 0.01;
	star.rotation.y -= 0.01;
	// console.log(plane.rotation);
	renderer.render(scene, camera);
};

animate();