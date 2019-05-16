//渲染器
var renderer;
function initThree(){
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
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
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 5;
    camera.lookAt({
        x : 0,
        y : 0,
        z : 0
    });
}

//场景
var scene;
function initScene() {
    scene = new THREE.Scene();
}

//灯光
var light;
function initLight(){
    light = new THREE.AmbientLight(0xffffff);
    light.position.set(1000, 1000, 2000);
    scene.add(light);
}
//对象
var geometry;
var object;
function initObject() {
    var geometry = new THREE.CubeGeometry(1,1,1);
    var material = new THREE.MeshLambertMaterial({color:0xff0000, side: THREE.BackSide});
    var mesh = new THREE.Mesh(geometry,material);
    mesh.position = new THREE.Vector3(0,0,0);
    scene.add(mesh);

    // var manager = new THREE.LoadingManager();
    // manager.onProgress = function ( item, loaded, total ) {
    //
    //     console.log( item, loaded, total );
    //
    // };
    //
    //
    // var texture = new THREE.Texture();
    // var loader = new THREE.ImageLoader( manager );
    // loader.load( 'model/UV_Grid_Sm.jpg', function ( image ) {
    //
    //     texture.image = image;
    //     texture.needsUpdate = true;
    //
    // } );
    //
    // var loader = new THREE.OBJLoader( manager );
    // loader.load( 'model/guangkeji.obj', function ( object ) {
    //     object.traverse( function ( child ) {
    //
    //         if ( child instanceof THREE.Mesh ) {
    //             child.material.map = texture;
    //         }
    //     } );
    //
    //     object.position.y = - 8;
    //     scene.add( object );
    // })
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
