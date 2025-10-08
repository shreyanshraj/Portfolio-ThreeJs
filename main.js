// TO DO tasks
// 1. Customize project details and ref links in modalContent object
// 2. Add animations to modal (GSAP?)
// 3. Improve mobile responsiveness
// 4. Optimize 3D model for better performance
// 5. Add loading screen while model loads



import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const manager = new THREE.LoadingManager();

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.5;


// console.log(THREE.REVISION);

const modalContent = {
    "Plane061_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Text004_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Plane063_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Text002_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Plane065_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Text001_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Plane067_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Text003_Baked":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "wallpaper_r001":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "wallpaper_l001":{
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
    },
    "Legal_Note_Pad_White_Baked": {
        title: 'this is placeholder title',
        content: 'this is project 1, hello world', 
    },
    "github_logo_Baked": {
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
        link: 'www.github.com'

    },
    "linkedin_Baked": {
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
        link: 'www.linkedin.com'

    },
    "mail_logo_Baked": {
        title: 'this is placeholder title',
        content: 'this is project 1, hello world',
        link: 'www.gmail.com'

    },
}

const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalProjectDescription = document.querySelector('.modal-proj-desc');
const modalExitBtn = document.querySelector('.modal-exit-button');
const modalVisitBtn = document.querySelector('.modal-visit-btn');


function showModal(id) {
    const content = modalContent[id];
    if (content) {
        modalTitle.textContent = content.title;
        modalProjectDescription.textContent = content.content;
        modal.classList.toggle('hidden');
    }

    if (content.link) {
        modalVisitBtn.classList.remove('hidden');
        modalVisitBtn.href = content.link;
    }
    else {
        modalVisitBtn.classList.add('hidden');
    }
}

function hideModal() {
    modal.classList.toggle('hidden');
}


let intersectObject = "";
const intersectObjectsNames = [
    "Plane061_Baked",
    "Text004_Baked",
    "Plane063_Baked",
    "Text002_Baked",
    "Plane065_Baked",
    "Text001_Baked",
    "Plane067_Baked",
    "Text003_Baked",
    "wallpaper_r001",
    "wallpaper_l001",
    "Legal_Note_Pad_White_Baked",
    "github_logo_Baked",
    "linkedin_Baked",
    "mail_logo_Baked"
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


// const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
// scene.add( shadowHelper );


// const helper = new THREE.DirectionalLightHelper( sun, 5 );
// scene.add( helper );

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
// console.log(axesHelper);;

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




// OrbitControls
const controls = new OrbitControls( camera, canvas );
controls.update();

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

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

modalExitBtn.addEventListener('click', hideModal);
window.addEventListener('resize', handleResize);
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('click', handleClick);

function handleClick() {
    console.log(intersectObject);
    if (intersectObject !== "") {
        showModal(intersectObject);
    }
    
    
};

// Animation Loop
function animate() {    
    // console.log('====================================');
    // console.log(camera);
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
