// TO DO tasks
// 1. Customize project details and ref links in modalContent object--done
// 2. Add animations to modal (GSAP?)
// 3. Improve mobile responsiveness
// 4. Optimize 3D model for better performance
// 5. Add loading screen while model loads



import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

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

// Glass Material
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,   
    metalness: 0,      
    roughness: 0,      
    transmission: 1,   
    transparent: true, 
    opacity: 0.5,      
    clearcoat: 1,
    clearcoatRoughness: 0,
});

glassMaterial.ior = 1.5; 
glassMaterial.emissive = new THREE.Color(0xffffff);
glassMaterial.emissiveIntensity = 1; 

const modalContent = {

    // Home - redirect to home page (redesign to make it more intuitive)
    "Text004_Baked":{
        
        action: () => { window.location.href = '/'; }
    },
    
    // About Me
    "Text002_Baked":{
        title: 'About Me',
        content: 'I am Shreyansh Raj, an AWS Certified Developer – Associate and Computer Science graduate from Arizona State University (Class of 2025) with over five years of professional IT experience in software development and cloud-based solutions. <br> <br> My technical expertise includes Python, JavaScript, and SQL, along with hands-on experience in AWS, D3.js, React, and Node.js. I specialize in designing scalable, efficient, and secure backend systems, developing RESTful APIs, and implementing data integration pipelines and automation workflows using cloud-native tools and DevOps practices.<br>At ASU’s MIX Center, I have also led operational and technical initiatives—streamlining digital workflows, inventory management, and data reporting through automation and cloud-native architecture. <br><br>I’m constantly learning new technologies to expand my skill set — most recently exploring Three.js and Blender to create interactive 3D experiences for my personal portfolio.',
    },

    //  "Plane063_Baked":{
    //      }
    // },

    // Projects- need to update (open new windows showing few projects details or maybe redirect to github page)
    "Text001_Baked":{
        title: 'View Projects',
        content: 'This is project page',
    },

    // Resume
    "Text003_Baked":{
        title: 'View my Resume',
        content: 'Opening Resume PDF...',

        action: () => { 
            showModal("Text003_Baked");

            setTimeout(() => {
                window.open('./SHREYANSH RAJ_Software Developer.pdf','_blank').focus();
            }, 1000);
        }
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
        title: 'GitHub Profile',
        content: 'Explore my projects and repositories on GitHub.',
        link: 'https://github.com/shreyanshraj'

    },
    "linkedin_Baked": {
        title: 'LinkedIn',
        content: 'Connect with me on LinkedIn to see my professional experience and network.',
        link: 'https://www.linkedin.com/in/shreyanshraj/'

    },
    "mail_logo_Baked": {
        title: 'Email',
        content: 'Feel free to reach out to me via email at shreyanshraj@gmail.com <br> I look forward to connecting with you!',
        // action: () => { 
        //     showModal("mail_logo_Baked");

        //     setTimeout(() => {
        //         window.open('mailto:shreyanshraj@gmail.com','_blank').focus();
        //     }, 400);
            
        // }

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
        // modalProjectDescription.textContent = content.content;

        modalProjectDescription.innerHTML = content.content;
        modal.classList.toggle('hidden');
    }

    if (content.link) {
        modalVisitBtn.classList.remove('hidden');
        modalVisitBtn.href = content.link;
        modalVisitBtn.textContent = `Visit ${content.title}`;
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
    // "Plane061_Baked", // home board
    "Text004_Baked",
    // "Plane063_Baked", // about me board
    "Text002_Baked",
    // "Plane065_Baked", // projects board
    "Text001_Baked",
    // "Plane067_Baked", //Resume board
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
            if (child.name === "Plane101_1" || child.name === "lower_window_Baked") {
                child.material = glassMaterial;
                child.castShadow = true;
                child.receiveShadow = true;
            }
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



// sun light
const sun = new THREE.DirectionalLight( 0xfbc08d);
sun.castShadow = true;  
sun.position.set( 150, 180, 0 );
sun.intensity = 0.5;
sun.shadow.camera.left = -4;
sun.shadow.camera.right = 4;
sun.shadow.camera.top = 4;
sun.shadow.camera.bottom = -4;
sun.shadow.normalBias = 0.05;

scene.add( sun );


// social logos light
const logoLight = new THREE.SpotLight( 0xffffff);

logoLight.position.set( -2, 4.5, 10 );
const distance = 5;
const newTargetPos = new THREE.Vector3(
    logoLight.position.x,
    logoLight.position.y,
    logoLight.position.z - distance 
);
logoLight.target.position.copy(newTargetPos);
logoLight.intensity = 1.5;
logoLight.angle = Math.PI / 24;
logoLight.penumbra = 1;
scene.add( logoLight );
const helper2 = new THREE.SpotLightHelper( logoLight );
helper2.visible = false;
scene.add( helper2 );


// // window light
const rectwidth = 3;
const rectheight = 2.5;
const rectintensity = 3.5;
const rectLight = new THREE.RectAreaLight(0xffffff, rectintensity, rectwidth, rectheight);
rectLight.position.set(1, 3, -3.5);
const rectAngle = Math.PI; // 180 degrees
rectLight.rotation.y = rectAngle;
scene.add(rectLight);
const rectLightHelper = new RectAreaLightHelper(rectLight);
rectLightHelper.visible = false;
scene.add(rectLightHelper);


// Contact board light
const contactLight = new THREE.RectAreaLight(0xfffaeb, 2, 1.5, 3);
contactLight.position.set(-2, 4.5, 3.8);
contactLight.rotation.y = Math.PI/2; // 90 degrees
scene.add(contactLight);

const contactLightHelper = new RectAreaLightHelper(contactLight);
contactLightHelper.visible = false;
scene.add(contactLightHelper);

// table light-rect
const tableLight = new THREE.RectAreaLight(0xf7ee97, 1.5, 2, 1);
tableLight.position.set(1, 2.2, -2.2);
tableLight.rotation.x = -Math.PI / 2;
scene.add(tableLight);
const tableLightHelper = new RectAreaLightHelper(tableLight);
tableLightHelper.visible = false;
scene.add(tableLightHelper);


// wall light
const ceilingLight = new THREE.SpotLight(0xfff1a8, 2); // warm light
ceilingLight.position.set(-2.7, 5.7, -3); // ceiling height

// Target: point below where the light should hit (floor/bed)
const targetPos = new THREE.Vector3(-2.7, 0, 0); // adjust Y for bed height
ceilingLight.target.position.copy(targetPos);
scene.add(ceilingLight.target);

// Spotlight properties
ceilingLight.angle = Math.PI / 12;   // cone spread ~30 degrees
ceilingLight.penumbra = 0.6;        // soft edges
ceilingLight.decay = 2;             // realistic falloff

scene.add(ceilingLight);

const ceilingLightHelper = new THREE.SpotLightHelper(ceilingLight);
ceilingLightHelper.visible = false;
scene.add(ceilingLightHelper);


// console.log(sun.position);


// const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
// scene.add( shadowHelper );


// const helper = new THREE.DirectionalLightHelper( sun, 5 );
// scene.add( helper );


// const axesHelper = new THREE.AxesHelper( 5 );
// // axesHelper.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff), new THREE.Color(0x0000ff) );
// scene.add( axesHelper );
// // console.log(axesHelper);;

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

        const content = modalContent[intersectObject];

        if (!content) return;
        if (typeof content.action === 'function') {
            content.action();
            return;
        }

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
	// const intersects = raycaster.intersectObjects(scene.children, true);

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
    // if (intersectObject) console.log("Hovered object:", intersectObject);

    renderer.render( scene, camera );


}
renderer.setAnimationLoop( animate );
