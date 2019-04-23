console.log('简单场景');

//场景，相机，材质，渲染器
 var scene,camera,renderer,mesh;

 //地板，自然光，光
var meshFloor,ambientLight,light;

var USE_WIREFRAME = false;

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
     mesh = new THREE.Mesh(
         new THREE.BoxGeometry(1,1,1),new THREE.MeshPhongMaterial({
             color:0xff4444,
             wireframe: USE_WIREFRAME
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
     ambientLight = new THREE.AmbientLight(0xffffff,0,2);

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
     renderer.render(scene,camera);
}

window.onload = init;
