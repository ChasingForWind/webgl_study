//相机 场景 渲染器 物体
var camera,scene,render,mesh;


//灯光  地板  自然光
var meshFloor,ambientLight,light;

//键盘
var keyboard = {};
var  player = {height:1.8,speed:0.2,turnSpeed:Math.PI*0.02};

//小屏幕
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0x4444ff })
    )
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
    //小屏幕
    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);


    //载入中
    loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item,loaded,total){
        console.log(item,loaded,total);
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
    animate();

}




//帧函数
function animate(){
    requestAnimationFrame(animate);

    //小屏幕部分
    if( RESOURCES_LOADED == false ) {
        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

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

