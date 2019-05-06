//相机 场景 渲染器 物体
var camera,scene,render,mesh;


//灯光  地板  自然光
var meshFloor,ambientLight,light;

//键盘
var keyboard = {};
var  player = {height:1.8,speed:0.2,turnSpeed:Math.PI*0.02,canShoot:5};

//子弹数轴
bullets = [];

//载入中的一些常数
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0x4444ff })
    )
};

//模型的地址
var meshes = {};
var models = {
    tent: {
        obj: "models/Tent_Poles_01.obj",
        mtl: "models/Tent_Poles_01.mtl",
        mesh: null
    },
    campfire: {
        obj:"models/Campfire_01.obj",
        mtl:"models/Campfire_01.mtl",
        mesh: null
    },
    pirateship: {
        obj:"models/Pirateship.obj",
        mtl:"models/Pirateship.mtl",
        mesh: null
    },
    uzi: {
        obj:"models/uziGold.obj",
        mtl:"models/uziGold.mtl",
        mesh: null,
        castShadow:false
    }

};

//其他常数
USE_WIREFRAME = false;
var loadingManager = null;
var RESOURCES_LOADED = false;


//主函数
function init() {

    //场景
    scene =new THREE.Scene();
    //相机
    camera =new THREE.PerspectiveCamera(90,1280/720,0.1,1000);
    camera.position.set(0,player.height,-5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));
    //载入中的小方块
    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);


    //载入中。。。。。
    loadingManager = new THREE.LoadingManager();

    /*载入*/
    loadingManager.onProgress = function(item,loaded,total){
        console.log(item,loaded,total);
    };
    /*载入完成*/
    loadingManager.onLoad = function(){
        console.log('模型载入完成！');
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    };

    //光线
    ambientLight = new THREE.AmbientLight(0xffffff,0.2);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff,0.8);
    pointLight.position.set(-3,6,-3);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 25;
    scene.add(pointLight);
    //物体
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({
            color:0xff4444,
            wireframe:USE_WIREFRAME,
        })
    );
    mesh.position.y += 1;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20,20,10,10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: USE_WIREFRAME
        })
    );
    meshFloor.rotation.x -= Math.PI/2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    //渲染器
    renderer = new THREE.WebGLRenderer();


    renderer.setSize(1280,720);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    //加载模型
    for( var _key in models ){
        (function(key){

            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials){
                materials.preload();

                var objLoader = new THREE.OBJLoader(loadingManager);

                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh){

                    mesh.traverse(function(node){
                        if( node instanceof THREE.Mesh ){
                            if('castShadow' in models[key])
                                node.castShadow = models[key].castShadow;
                            else
                                node.castShadow = true;

                            if('receiveShadow' in models[key])
                                node.receiveShadow = models[key].receiveShadow;
                            else
                                node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;

                });
            });

        })(_key);
    }
    animate();

}

//载入模型函数
function onResourcesLoaded(){
    //复制所有的模型到meshes里
    meshes['tent1'] = models.tent.mesh.clone();
    meshes['tent2'] = models.tent.mesh.clone();
    meshes["campfire1"] = models.campfire.mesh.clone();
    meshes["campfire2"] = models.campfire.mesh.clone();
    meshes["pirateship"] = models.pirateship.mesh.clone();

    //设置模型位置并添加到场景里
    meshes['tent1'].position.set(-5,0,4);
    meshes["tent2"].position.set(-8, 0, 4);
    scene.add(meshes['tent1']);
    scene.add(meshes["tent2"]);

    meshes["campfire1"].position.set(-5, 0, 1);
    meshes["campfire2"].position.set(-8, 0, 1);
    scene.add(meshes["campfire1"]);
    scene.add(meshes["campfire2"]);

    meshes["pirateship"].position.set(-11, -1, 1);
    meshes["pirateship"].rotation.set(0, Math.PI, 0); // Rotate it to face the other way.
    scene.add(meshes["pirateship"]);

    meshes["playerweapon"] = models.uzi.mesh.clone();
    meshes["playerweapon"].position.set(0,2,0);
    meshes["playerweapon"].scale.set(10,10,10);
    scene.add(meshes["playerweapon"]);

}


//帧函数
function animate(){
    requestAnimationFrame(animate);

    //载入部分
    if( RESOURCES_LOADED == false ) {
        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }
    //时间变量
    var time = Date.now()*0.0005;


    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    //子弹
    for (var index=0;index<bullets.length;index+=1){
        if(bullets[index] === undefined) continue;
        if(bullets[index].alive === false) {
            bullets.splice(index,1);
            continue;
        }
        bullets[index].position.add(bullets[index].velocity);
    }

    //键盘部分

    if(keyboard[87]){   //按下w键时
        camera.position.x -= Math.sin(camera.rotation.y)*player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y)*player.speed;
    }
    if(keyboard[83]){   //按下S键时
        camera.position.x += Math.sin(camera.rotation.y)*player.speed;
        camera.position.z += -Math.cos(camera.rotation.y)*player.speed;
    }
    if(keyboard[65]){   //按下A键时
        camera.position.x += Math.sin(camera.rotation.y+Math.PI/2)*player.speed;
        camera.position.z += -Math.cos(camera.rotation.y+Math.PI/2)*player.speed;
    }
    if(keyboard[68]){   //按下B键时
        camera.position.x += Math.sin(camera.rotation.y-Math.PI/2)*player.speed;
        camera.position.z += -Math.cos(camera.rotation.y-Math.PI/2)*player.speed;
    }
    if(keyboard[37]){ //按下左键
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){//按下右键
        camera.rotation.y += player.turnSpeed;
    }

    if(keyboard[32] && player.canShoot<=0){//按下空格键
        console.log("子弹！");
        var bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.05,8,8),
            new THREE.MeshBasicMaterial({color:0xffffff})
        );

        bullet.position.set(
            meshes["playerweapon"].position.x,
            meshes["playerweapon"].position.y+0.05,
            meshes["playerweapon"].position.z,
        )

        bullet.velocity = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );
        bullet.alive = true;
        setTimeout(function(){
            bullet.alive = false;
            scene.remove(bullet);
        },1000);
        bullets.push(bullet);
        scene.add(bullet);
        player.canShoot = 10;
    }
    if(player.canShoot > 0) player.canShoot -=1;

    meshes["playerweapon"].position.set(
      camera.position.x - Math.sin(camera.rotation.y + Math.PI/6)*0.75,
        camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
    );
    meshes["playerweapon"].rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );

    renderer.render(scene,camera);
}


//鼠标按下时
function keyDown(event){
    keyboard[event.keyCode] = true;
}

//鼠标松开时
function keyUp(event){
    keyboard[event.keyCode] = false;
}
//事件监听函数
window.addEventListener('keydown',keyDown);
window.addEventListener('keyup',keyUp);

//启动init函数
window.onload = init;

