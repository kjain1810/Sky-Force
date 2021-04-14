const loadMesh = function (loader, scene) {
    var enemy_plane, star, player_plane;
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
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            scene.add(gltf.scene);
            player_plane = gltf.scene;
        },
        null,
        function (error) {
            console.log("Error: " + error);
        }
    )
    return {"ep": enemy_plane, "star": star, "pp": player_plane};
}

export default loadMesh;