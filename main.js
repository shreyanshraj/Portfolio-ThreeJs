import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Scene Setup
const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let intersectObject = "";

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.5;


// console.log(THREE.REVISION);


const intersectObjectsNames = [
    "Cube006_Baked",
    "Cube017_Baked",
    "Cube003_Baked",
    "Cube002_Baked",
    "mattress_Baked",
    "window_Baked",
    "lower_window_Baked",
    "shade_Baked",
    "window_shade1_Baked",
    "window_shade2_Baked",
    "floor_Baked",
    "wall_Baked",
    "ceiling_Baked",
    "desk_top",
    "left_left_top",
    "left_leg_bottom",
    "left_left_supp",
    "right_left_top",
    "right_left_bottom",
    "right_left_supp",
    "system_Baked",
    "system_top_Baked",
    "Plane079_Baked",
    "Plane080_Baked",
    "Plane081_Baked",
    "Plane082_Baked",
    "Cube007_Baked",
    "Plane101",
    "Plane101_1",
    "Plane060_Baked",
    "Plane062_Baked",
    "Plane064_Baked",
    "Plane066_Baked",
    "Plane059_Baked",
    "Plane061_Baked",
    "Plane063_Baked",
    "Plane065_Baked",
    "Plane067_Baked",
    "Text003_Baked",
    "Text002_Baked",
    "Text004_Baked",
    "Text001_Baked",
    "Carpet_Baked",
    "clock_Baked",
    "fl_base_Baked",
    "fl_base_up_Baked",
    "fl_lamp_stand_Baked",
    "fl_lamp_arm_Baked",
    "lamp_Baked",
    "fl_lamp_hang_Baked",
    "fl_arm_conn_Baked",
    "Plane071_Baked",
    "wall_light_conn_Baked",
    "wall_light_Baked",
    "wl_left1_Baked",
    "wl_left2_Baked",
    "wl_3_Baked",
    "wl_4_Baked",
    "Plane057_Baked",
    "House_Plant_Dracaena_Lemon_Lime_Baked",
    "Plane_A1_Plant_A_0001_Baked",
    "Plane_A1001_Plant_A_0001_Baked",
    "Plane_A1002_Plant_A_0001_Baked",
    "Plane_A1003_Plant_A_0001_Baked",
    "Plane_A1001_Plant_A_0002_Baked",
    "Plane058_Baked",
    "Plane072_Baked",
    "Plane073_Baked",
    "Plane074_Baked",
    "Plane075_Baked",
    "Plane076_Baked",
    "Plane077_Baked",
    "Plane078_Baked",
    "medal_3_Baked",
    "medal_4_Baked",
    "medal_hm_Baked",
    "social_media_shelf_supp001_Baked",
    "Chair_Chair_0_Baked",
    "Cylinder001_Baked",
    "Chair_Chair_0001_Baked",
    "Plane052_Baked",
    "Plane053_Baked",
    "Plane054_Baked",
    "Plane055_Baked",
    "Plane056_Baked",
    "f1_shelf_supp_Baked",
    "social_media_shelf_supp_Baked",
    "mail_logo_Baked",
    "github_logo_Baked",
    "linkedin_Baked",
    "Plane001_Baked",
    "Plane002_Baked",
    "Plane003_Baked",
    "Plane005_Baked",
    "Object_2_Baked",
    "monitor_base_l_Baked",
    "monitor_base_r_Baked",
    "keyboard_Baked",
    "mouse_Baked",
    "pen_stand_Baked",
    "mug_Baked",
    "pen_Baked",
    "Legal_Note_Pad_White_Baked",
    "base_Baked",
    "lamp_conn_Baked",
    "lamp_top_Baked",
    "monitor_base_r001",
    "wallpaper_r001",
    "monitor_base_l001",
    "wallpaper_l001",
    "Cylinder007_Baked",
    "Cylinder008_Baked",
    "Cylinder009_Baked",
    "Cylinder012_Baked",
    "Cylinder013_Baked",
    "Cylinder014_Baked",
    "BézierCurve003_Baked",
    "BézierCurve004_Baked",
    "BézierCurve005_Baked",
    "backstand_l_Baked",
    "screen_l_Baked",
    "back_stand_R_Baked",
    "screen_r_Baked",
    "bulb_Baked",
    "legs001_Baked",
    "legs_Baked",
    "plafon_Baked",
    "screen_r_Baked",
    "bulb_Baked",
    "legs001_Baked",
    "legs_Baked",
    "plafon_Baked"
];

const intersectObjects = [];

// Loadng Blender Model
const loader = new GLTFLoader();

loader.load( './rc_final_export.glb', function ( glb ) {
    // console.log( glb.scene.children[0].name );

    glb.scene.traverse( ( child ) => {
        if(intersectObjectsNames.includes(child.name)){
            intersectObjects.push(child);
        }
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
            // console.log(child.name);
            // child.material.metalness = 0;
        }
    } );

    scene.add( glb.scene );
    // Compute bounding box and center
    const box = new THREE.Box3().setFromObject(glb.scene);
    const center = new THREE.Vector3();
    box.getCenter(center); // exact center of model
    const size = new THREE.Vector3();
    box.getSize(size);

    // Set camera position relative to center (slightly above & back)
    const offset = 2; 
    camera.position.set(
        center.x + size.x * offset,
        center.y + size.y * offset,
        center.z + size.z * offset
    );

    // Make camera look at model center
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    // // Update OrbitControls target
    // controls.target.copy(center);
    // controls.update();

}, undefined, function ( error ) {

  console.error( error );

} );


const sun = new THREE.DirectionalLight( 0xfbc08d);
sun.castShadow = true;  
sun.position.set( 150, 180, 0 );
sun.intensity = 1;
sun.shadow.camera.left = -4;
sun.shadow.camera.right = 4;
sun.shadow.camera.top = 4;
sun.shadow.camera.bottom = -4;
sun.shadow.normalBias = 0.05;

scene.add( sun );

// console.log(sun.position);


const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
scene.add( shadowHelper );


const helper = new THREE.DirectionalLightHelper( sun, 5 );
scene.add( helper );

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

camera.position.x = 8.046614195439764;
camera.position.y = 8.471611203550893;
camera.position.z = 9.374897474480889;
camera.zoom = 9.8;

camera.updateProjectionMatrix();

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
// console.log(axesHelper);;


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

function handlePointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


window.addEventListener('resize', handleResize);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('click', handleClick);

function handleClick() {
    console.log(intersectObject);
    
};

// Animation Loop
function animate() {    
    // console.log('====================================');
    console.log(camera);
    // console.log('====================================');
    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( intersectObjects );

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
        intersectObject= "";
    }   

	for ( let i = 0; i < intersects.length; i ++ ) {
        // console.log(intersects[0].object.name);
        intersectObject=  intersects[0].object.name;

	}

    renderer.render( scene, camera );


}
renderer.setAnimationLoop( animate );
