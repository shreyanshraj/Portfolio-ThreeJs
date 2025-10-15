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
    opacity: 0.35,      
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
        content: 'Hey there! Looks like you’ve stumbled onto my little to-do corner 😄. <br> Right now, I’m juggling a few things—mainly this Three.js portfolio you’re checking out, making sure it not only works smoothly but also looks and feels just right. At the same time, I’m building a React Native app, experimenting with new features, and keeping my coding muscles busy. <br>Outside of the digital world, I’m training for my next marathon, planning my runs carefully, and squeezing in some hiking whenever I can to clear my head and soak up some fresh air. <br>Basically, trying to keep life balanced, productive, and a little adventurous, while having fun with all the projects I’m diving into! 🏃‍♂️', 
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
        content: 'Feel free to reach out to me via email at <a href="mailto:shreyanshraj@gmail.com">shreyanshraj@gmail.com</a> <br> I look forward to connecting with you!',
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

// Loading Manager Events
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    console.log( 'Loading complete!');
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Optional fade-out with GSAP
            gsap.to(loadingScreen, { duration: 1, opacity: 0, onComplete: () => {
                loadingScreen.style.display = 'none';
            }});
            
        }
    });
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
};



// Loadng Blender Model
const loader = new GLTFLoader(manager);

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
    const offset = 1; 
    camera.position.set(
        center.x + size.x ,
        center.y + size.y,
        center.z + size.z 
    );


    camera.lookAt(-0.2125, 1.4974 , -0.3514);

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
const tableLight = new THREE.RectAreaLight(0xffffff, 4, 2, 1);
tableLight.position.set(1, 2.5, -2.2);
tableLight.rotation.x = -Math.PI / 2- 0.3; // slight tilt
scene.add(tableLight);
const tableLightHelper = new RectAreaLightHelper(tableLight);
tableLightHelper.visible = false;
scene.add(tableLightHelper);


// wall light
const ceilingLight = new THREE.SpotLight(0xfff1a8, 1); 
ceilingLight.position.set(-2.7, 5.7, -3); 

const targetPos = new THREE.Vector3(-2.7, 0, 0); 
ceilingLight.target.position.copy(targetPos);
scene.add(ceilingLight.target);

ceilingLight.angle = Math.PI / 12;   
ceilingLight.penumbra = 0.6;        
ceilingLight.decay = 2;             

scene.add(ceilingLight);

const ceilingLightHelper = new THREE.SpotLightHelper(ceilingLight);
ceilingLightHelper.visible = false;
scene.add(ceilingLightHelper);


// Floor lamp
const floorLamp = new THREE.SpotLight(0xfff1a8, 1.5);
floorLamp.position.set(-0.5, 3, 2); 

const floorLampTargetPos = new THREE.Vector3(-0.5, 0, 2);
floorLamp.target.position.copy(floorLampTargetPos);
scene.add(floorLamp.target);

floorLamp.angle = Math.PI / 12;
floorLamp.penumbra = 0.6;
floorLamp.decay = 2;
scene.add(floorLamp);

const floorLampHelper = new THREE.SpotLightHelper(floorLamp);
floorLampHelper.visible = false;
scene.add(floorLampHelper);


// ambient Light
const light = new THREE.AmbientLight( 0x404040, 3 );
scene.add( light );

const aspect = sizes.width / sizes.height;


const camera = new THREE.PerspectiveCamera( 
   72,              // field of view (degrees)
    aspect,          // aspect ratio (width / height)
    0.1,             // near clipping plane
    200             // far clipping plane
);

camera.position.x = 5.407913724032045;
camera.position.y = 8.243812537350799;
camera.position.z = 6.813952297442121;

camera.updateProjectionMatrix();




// OrbitControls
const controls = new OrbitControls( camera, canvas );

controls.target.set(-0.2125, 1.4974 , -0.3514);
camera.zoom = 1.5;

controls.update();

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.minPolarAngle = -Math.PI / 12; // vertical rotation
controls.maxPolarAngle = Math.PI / 3 + Math.PI / 12; 
controls.minAzimuthAngle = -Math.PI / 20; // horizontal rotation
controls.maxAzimuthAngle = Math.PI / 2.5 ;  
controls.minDistance = 3;
controls.maxDistance = 20;  
controls.enablePan = false; // disable panning

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
// window.addEventListener('click', handleClick);

// Use pointerdown only (works for mobile & desktop)
window.addEventListener('pointerdown', handleInteraction);

function handleInteraction(event) {
    event.preventDefault();

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(intersectObjects, true);

    if (intersects.length > 0) {
        const clicked = intersects[0].object;
        const content = modalContent[clicked.name];
        if (!content) return;

        if (typeof content.action === 'function') {
            content.action();
            return;
        }

        showModal(clicked.name);
    }
}

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


// animate social buttons
const socialButtons = ['github_logo_Baked', 'linkedin_Baked', 'mail_logo_Baked'];
let currentHovered = null;



// Animation Loop
const animation_array = ["Text004_Baked","Text002_Baked","Text001_Baked","Text003_Baked","Legal_Note_Pad_White_Baked",
                        "github_logo_Baked","linkedin_Baked","mail_logo_Baked"];
function animate() { 
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(intersectObjects);

    if (intersects.length > 0) {
        const hovered = intersects[0].object;
        document.body.style.cursor = 'pointer';
        intersectObject = hovered.name;

        if (animation_array.includes(hovered.name)) {
            if (currentHovered !== hovered) {
                // Reset previous hovered object if different
                if (currentHovered && currentHovered !== hovered) {
                    gsap.to(currentHovered.scale, { x: 1, y: 1, z: 1, duration: 0.01, ease: "linear" });
                }

                // Animate LinkedIn logo
                gsap.to(hovered.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.01, ease: "linear" });
                currentHovered = hovered;
            }
        } else {
            // Reset LinkedIn scale if hovering something else
            if (currentHovered && currentHovered.name.includes(animation_array)) {
                gsap.to(currentHovered.scale, { x: 1, y: 1, z: 1, duration: 0.01, ease: "linear" });
                currentHovered = null;
            }
        }
    } else {
        document.body.style.cursor = 'default';
        intersectObject = "";

        // Reset LinkedIn scale when nothing hovered
        if (currentHovered && currentHovered.name === 'linkedin_Baked') {
            gsap.to(currentHovered.scale, { x: 1, y: 1, z: 1, duration: 0.1, ease: "linear" });
            currentHovered = null;
        }
    }

    // console.log(camera.position);
    // console.log('====================================');
    // console.log(controls.target);
    // console.log('====================================');
    // console.log('====================================');
    // console.log('zoom',camera.zoom);
    // console.log('====================================');

    renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );
