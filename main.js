import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );


// Loadng Blender Model
const loader = new GLTFLoader();

loader.load( './rc_final_export.glb', function ( glb ) {
    // console.log( glb.scene.children[0].name );
    
  scene.add( glb.scene );

}, undefined, function ( error ) {

  console.error( error );

} );


// ambient Light
const light = new THREE.AmbientLight( 0x404040, 3 );
scene.add( light );

const aspect = sizes.width / sizes.height;


const camera = new THREE.OrthographicCamera( 
    -aspect * 50, 
    aspect * 50, 
    50, 
    -50, 
    1, 
    1000 );

camera.position.x = 7.151;
camera.position.y = 5.536;
camera.position.z = 7.462;


// OrbitControls
const controls = new OrbitControls( camera, canvas );
controls.update();


// Window Resize Handler
function handleResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    const aspect = sizes.width / sizes.height;
    camera.left = -aspect * 50;
    camera.right = aspect * 50;
    camera.top = 50;
    camera.bottom = -50;

    camera.updateProjectionMatrix();
    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );

    // console.log('size updated');
    
}

window.addEventListener('resize', handleResize);

// Animation Loop
function animate() {    
    console.log('====================================');
    console.log(camera.position);
    console.log('====================================');

    renderer.render( scene, camera );


}
renderer.setAnimationLoop( animate );
