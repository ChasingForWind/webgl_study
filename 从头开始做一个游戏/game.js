console.log('简单场景');

//场景，相机，材质，渲染器
 var scene,camera,renderer,mesh;

 //地板，自然光，光
var meshFloor,ambientLight,light;
var texture,normalMap;

var USE_WIREFRAME = false;  //定义物体结构样式
var keyboard = {};          //定义键盘
var player = {speed:0.2,turnSpeed: Math.PI*0.02};  //定义一些常数

 function init(){
     //创建场景
     scene = new THREE.Scene();




     //创建相机
     camera = new THREE.PerspectiveCamera(90,
         1280.0/720.0,0.1,1000);
     camera.position.set(0,1.8,-5);
     camera.lookAt(new THREE.Vector3(0,1.8,0));


     //物体和材质

     /*物体*/
     texture = new THREE.TextureLoader().load(
         'crate0/crate0_diffuse.jpg'
     );
     normalMap = new THREE.TextureLoader().load(
       'crate0/crate0_normal.jpg'
     );
     mesh = new THREE.Mesh(
         new THREE.BoxGeometry(1,1,1),new THREE.MeshPhongMaterial({
             color:0xff4444,
             map:texture,
             wireframe: USE_WIREFRAME,
             normalMap:normalMap
         })
     );
     mesh.position.y += 1;
     mesh.castShadow = true;
     scene.add(mesh);

     /*地板*/
     meshFloor = new THREE.Mesh(
         new THREE.PlaneGeometry(10,10,10,10),
         new  THREE.MeshPhongMaterial({
             color: 0xFFFFFF,
             wireframe: USE_WIREFRAME
         })
     );
     meshFloor.rotation.x -= Math.PI / 2;
     meshFloor.receiveShadow = true;
     scene.add(meshFloor);
     scene.add(mesh);

     /*灯光*/
     ambientLight = new THREE.AmbientLight(0xffffff,0.3);
     light = new THREE.PointLight(0xffffff,0.8,18);
     light.position.set(-3,6,-3);
     light.castShadow = true;

     light.shadow.camera.near = 0.1;
     light.shadow.camera.far = 25;
     scene.add(light);
     scene.add(ambientLight);



     //渲染器

     renderer = new THREE.WebGLRenderer();
     renderer.setSize(1280,720);
     renderer.shadowMap.enabled = true;
     renderer.shadowMap.type = THREE.PCFShadowMap;

     document.body.appendChild(renderer.domElement);

     animate();
 }
 //循环函数
function animate(){
     requestAnimationFrame(animate);
     mesh.rotation.x += 0.01;
     mesh.rotation.y += 0.01;

     if(keyboard[87]){  //按下w建时
         camera.position.x += Math.sin(camera.rotation.y)*player.speed;
         camera.position.z += Math.cos(camera.rotation.y)*player.speed;
     }
    if(keyboard[83]){  //按下s建时
        camera.position.x -= Math.sin(camera.rotation.y)*player.speed;
        camera.position.z -= Math.cos(camera.rotation.y)*player.speed;
    }
    if(keyboard[65]){  //按下a建时
        camera.position.x += Math.sin(camera.rotation.y+Math.PI/2)*player.speed;
        camera.position.z += -Math.cos(camera.rotation.y+Math.PI/2)*player.speed;
    }
    if(keyboard[68]){  //按下d建时
        camera.position.x += Math.sin(camera.rotation.y-Math.PI/2)*player.speed;
        camera.position.z += -Math.cos(camera.rotation.y-Math.PI/2)*player.speed;
    }

    if(keyboard[37]){  //按下d建时
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){  //按下d建时
        camera.rotation.y += player.turnSpeed;
    }





     renderer.render(scene,camera);
}

function keyDown(event){
     keyboard[event.keyCode] = true;
}

function keyUp(event){
     keyboard[event.keyCode] = false;
}

window.addEventListener('keydown',keyDown);
 window.addEventListener('keyup',keyUp);

window.onload = init;
