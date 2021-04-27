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
var enemy_plane,
    star,
    player_plane,
    missile;
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load('mesh/enemy_plane.glb', function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.material) 
            child.material.metalness = 0.1;
        


    });
    console.log(gltf.scene);
    gltf.scene.rotation.set(Math.PI / 2, 0, 0);
    gltf.scene.position.set(0, 4, 0);
    gltf.scene.scale.set(0.02, 0.02, 0.02);
    enemy_plane = gltf.scene;
}, null, function (error) {
    console.log("Error: " + error);
});
loader.load("mesh/star.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.material) 
            child.material.metalness = 0.1;
        


    });
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    star = gltf.scene;
}, null, function (error) {
    console.log("Error: " + error);
});
loader.load("mesh/player_plane_self.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.material) 
            child.material.metalness = 0.1;
        


    });
    gltf.scene.position.set(0, -3, 0);
    gltf.scene.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
    gltf.scene.scale.set(0.04, 0.04, 0.04);
    scene.add(gltf.scene);
    player_plane = gltf.scene;
}, null, function (error) {
    console.log("Error: " + error);
})
loader.load("mesh/missile.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.material) 
            child.material.metalness = 0.1;
        


    });
    gltf.scene.position.set(0, -3, 0);
    gltf.scene.rotation.set(Math.PI / 2, Math.PI, 0);
    gltf.scene.scale.set(0.05, 0.05, 0.04);
    missile = gltf.scene;
}, null, function (error) {
    console.log("Error: " + error);
})

var missiles = [];
var enemies = [];
var stars = [];

var health = 100;
var score = 0;

var clock = new Date();
var lastTime = clock.getTime();


var animate = async function () {
    document.getElementById("health").innerHTML = "&nbsp&nbsp" + health;
    document.getElementById("score").innerHTML = "&nbsp&nbsp" + score;
    requestAnimationFrame(animate);
    for (var i = 0; i < missiles.length; i++) {
        missiles[i].position.y += 0.1;
        missiles[i].rotation.z += 0.2;
        if (missiles[i].position.y > 5) {
            scene.remove(missiles[i]);
            missiles = missiles.filter((m) => m != missiles[i]);
        }
    }
    var clock = new Date();
    var curTime = clock.getTime();
    if (curTime - lastTime > 2000) {
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
    for (var i = 0; i < enemies.length; i++) {
        enemies[i]["enemy"].position.y -= 0.02;
        enemies[i]["enemy"].children[1].rotation.y += 0.5;
        enemies[i]["enemy"].position.x += Math.sin(enemies[i]["x"]);
        enemies[i]["enemy"].rotation.y += 20 * enemies[i]["diffx"];
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
    var missiles_to_rem = [];
    var enemies_to_rem = [];
    for (var i = 0; i < missiles.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            var distance = (missiles[i].position.x - enemies[j]["enemy"].position.x) * (missiles[i].position.x - enemies[j]["enemy"].position.x);
            distance += (missiles[i].position.y - enemies[j]["enemy"].position.y) * (missiles[i].position.y - enemies[j]["enemy"].position.y);
            if (distance < 0.8) {
                missiles_to_rem.push(i);
                enemies_to_rem.push(j);
                break;
            }
        }
    }
    var new_missiles = [];
    var new_enemies = [];
    for (var i = 0; i < missiles.length; i++) {
        var torem = false;
        for (var j = 0; j < missiles_to_rem.length; j++) {
            if (missiles_to_rem[j] == i) {
                torem = true;
            }
        }
        if (torem) {
            scene.remove(missiles[i]);
        } else {
            new_missiles.push(missiles[i])
        }
    }
    missiles = new_missiles;
    for (var i = 0; i < enemies.length; i++) {
        var torem = false;
        for (var j = 0; j < enemies_to_rem.length; j++) {
            if (enemies_to_rem[j] == i) {
                torem = true;
            }
        }
        if (torem) {
            scene.remove(enemies[i]["enemy"]);
            score += 10;
            var starcopy = star.clone();
            starcopy.position.set(enemies[i]["enemy"].position.x, enemies[i]["enemy"].position.y, enemies[i]["enemy"].position.z);
            scene.add(starcopy);
            stars.push(starcopy);
        } else {
            new_enemies.push(enemies[i]);
        }
    }
    enemies = new_enemies;

    var new_stars = [];
    for (var i = 0; i < stars.length; i++) {
        var distance = (stars[i].position.x - player_plane.position.x) * (stars[i].position.x - player_plane.position.x);
        distance += (stars[i].position.y - player_plane.position.y) * (stars[i].position.y - player_plane.position.y);
        if (distance < 0.6) {
            score += 100;
            scene.remove(stars[i]);
        } else {
            new_stars.push(stars[i]);
        }
    }
    stars = new_stars;
}
