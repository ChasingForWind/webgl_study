//渲染器
console.log('没进来？');
var renderer;
function initThree(){
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new WebGLRenderer({
        antialias:true
    });
    renderer.setSize(width,height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF,1.0);
}

//相机
var camera;
function initCamera(){
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 1000;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.lookAt(0,0,0);
}

//场景
var scene;
function initScene() {
    scene = new THREE.Scene();
}

//灯光
var light;
function initLight(){
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}
//对象
var cube;
function initObject() {

}



function init() {

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}