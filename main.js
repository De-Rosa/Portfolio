//tuck on a veil
//j
import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls} from "/node_modules/three/examples/jsm/controls/OrbitControls";
import { DRACOLoader} from "/node_modules/three/examples/jsm/loaders/DRACOLoader.js";

let activeFloor = 0;
let isLoadingActive = true;
let isHelpActive = false;

let mixer;
let clock = new THREE.Clock();

const modelLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/portfolio/draco/")
dracoLoader.preload();
modelLoader.setDRACOLoader(dracoLoader);

//middle of room for origin (control) pos and +220 origin for camera pos
const floorCameraCoordinates = [[220,120,220],
                                 [70, 410, -80],
                                 [-250, 710, -80]]
const floorControlCoordinates = [[0,-100,0], [-150,190,-300],[-470,490,-300]]

const text = [
    [" About Me",
        "I have experience coding in numerous programming languages, including C#, Python, Java, HTML, and JavaScript.",
        "I enjoy studying about programming languages, especially lower level languages like C, because it allows me to explore more complex solutions to coding problems. I find the intricate details of programming languages fascinating.",
        "I have always had an ambition to code as the process of solving a problem and decomposing it into it's several parts has always intrigued me.",
        "In my daily life, I am fully absorbed in Computing and I aim to teach myself something new about it every day. I have currently been enjoying studying and listening to podcasts about machine learning.",
        "I am currently studying Maths, Further Maths, and Computer Science for A Levels."
    ],
    [" Books",
        "In order to further my knowledge on subjects relating to coding I stay up to date with papers or books relating to Computer Science.",
        "<div style='font-weight: bold; font-size: 125%'>Some books I have read include:</div>",
        "Clean Code by Robert C. Martin, Data-Oriented Design by Richard Fabian",
        "How to think like a Mathematician by Kevin Houston, and I have started to read Fundamentals of Machine Learning by John Kelleher",
        "And other books relating to learning Visual Basic, C++, and C#."
    ],
    [" Projects",
        "I have created many web (and console) applications in order to refine my coding skills but also for specific purposes. Many of these applications are based on Javascript, HTML, Python, and C#. Click on the previews to open them.",
        "",
        "<img src='/portfolio/matrix.png' style='max-height: 10vh; max-width: 10vw; vertical-align: middle' onclick=\"window.open('https://squaregithub.gitlab.io/matrix', '_blank')\"</img>  A 3D transformation matrix website.",
        "<img src='/portfolio/prism.png' style='max-height: 10vh; max-width: 10vw; vertical-align: middle' onclick=\"window.open('https://squaregithub.gitlab.io/prism', '_blank')\"</img>  A web game made for GCSE french revision.",
        "I have also enjoyed developing programs that use machine learning and neural networks: an evolutionary simulator using a neural network so that the creatures adapt, a program where a user can draw a machine made out of pistons and motors and the AI tries to learn how to walk (using rendering/physics engines made from scratch), and other mini-projects using TensorFlow (such as a Discord bot learning words).\nBefore sixth form, I created a physics engine that emulates buoyancy of drawn objects in order to learn C#. I am always looking for new challenging ideas to start coding."
    ]
]
const delay = ms => new Promise(res => setTimeout(res, ms));
let isSceneActive = false;
let items = document.getElementsByClassName("tower-griditem");
let animationActive = false;
let isTextActive = false;
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xEEEEEE);

let pixelRatio = window.devicePixelRatio
let AA = true
if (pixelRatio > 1) {
    AA = false
}

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    alpha:true,
})

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(2, -1.5  );
renderer.setSize(window.innerWidth/1.5, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.float = "right";
renderer.domElement.style.right = "0%";
renderer.domElement.style.cursor = "pointer";
renderer.setClearColor(0x000000, 0.15);

const camera = new THREE.PerspectiveCamera(90,(window.innerWidth /1.5) / window.innerHeight, 0.1, 1100);
camera.position.set(floorCameraCoordinates[activeFloor][0],floorCameraCoordinates[activeFloor][1],floorCameraCoordinates[activeFloor][2]);
camera.lookAt(floorControlCoordinates[activeFloor][0], floorControlCoordinates[activeFloor][1], floorControlCoordinates[activeFloor][2])

// pre addition
camera.position.y = camera.position.y - 100;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(floorControlCoordinates[activeFloor][0], floorControlCoordinates[activeFloor][1], floorControlCoordinates[activeFloor][2]);

controls.update();
controls.enablePan = false;
controls.enableDamping = true;
controls.maxDistance = 600;
controls.minDistance = 150;
controls.maxAzimuthAngle =  Math.PI * 0.6;
controls.minAzimuthAngle = -(Math.PI * 0.2);
controls.maxPolarAngle =  Math.PI * 0.5;
controls.minPolarAngle =  -(Math.PI * 0.5);
let globalLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
scene.add(globalLight);
controls.zoomSpeed = 0.3;
controls.rotateSpeed = 0.3;
controls.enabled = false ;

const light1  = new THREE.AmbientLight(0xffffff, 0.5);
light1.name = 'ambient_light';
scene.add( light1 );

const light2  = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(0.5, 0, 0.866); // ~60º
light2.name = 'main_light';
scene.add( light2 );

// loading cube
var geometry = new THREE.BoxGeometry(50,50,50);
var material = new THREE.MeshBasicMaterial({color: 0xffffff});
var cube = new THREE.Mesh(geometry, material);
cube.position.set(0,-75,0)
scene.add(cube)


modelLoader.load("/portfolio/compressed2Tower.glb", function(gltf) {
    gltf.scene.scale.set(100,100,100);
    gltf.scene.position.set(0,-150,0);

    scene.add(gltf.scene);
    isLoadingActive = false;
    scene.remove(cube);
    mixer = new THREE.AnimationMixer( gltf.scene );
    gltf.animations.forEach(( clip ) => {
        mixer.clipAction(clip).play();
    });
    
    let fromScale = new THREE.Vector3(0,0,0)
    let toScale = new THREE.Vector3(100, 100, 100)
    var tween = new TWEEN.Tween(fromScale)
        .to(toScale,1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function (object) {
            gltf.scene.scale.set(object.x, object.y, object.z)
        })
        .start();
    moveElementsOnLeft();
})

async function moveElementsOnLeft() {
    await raiseName();
    await showLowerText()
}

async function showLowerText() {
    if (animationActive) return;
    animationActive = true;
    let lowerTextElements = document.getElementsByClassName("lowertext");
    for (let i=0; i<lowerTextElements.length; i++) {
        await lowerTextElements[i].animate([
            {opacity: "0%"},
            {opacity: "100%"},
        ], {
            duration: 500,
            iterations: 1,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        })
    }
    animationActive = false;
}

async function hideName() {
    let wrapper = document.getElementById("intro-text-wrapper");
    await wrapper.animate([
        {opacity: "100%"},
        {opacity: "0%"},
    ], {
        duration: 500,
        iterations: 1,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
    })
}
async function raiseName() {
    if (animationActive) return;
    animationActive = true;
    let wrapper = document.getElementById("intro-text-wrapper");
    await wrapper.animate([
        {paddingTop: "45vh"},
        {paddingTop: "41vh"},
    ], {
        duration: 500,
        iterations: 1,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
    })

    animationActive = false;
}

function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    controls.update();
    TWEEN.update();
    if (isLoadingActive) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

render();

async function lerpCameraMovementBounce(coordinates, timingInMs) {
    var camPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    var tween = new TWEEN.Tween(camPos)
        .to(coordinates,timingInMs)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function (object) {
            camera.position.set(object.x, object.y, object.z);
            controls.update();
        })
        .start();
}

async function lerpBetweenFloors(timingInMs) {
    var camPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    var controlPos = new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z);
    let coordinates = new THREE.Vector3(floorCameraCoordinates[activeFloor][0], floorCameraCoordinates[activeFloor][1], floorCameraCoordinates[activeFloor][2]);
    let controlCoordinates = new THREE.Vector3(floorControlCoordinates[activeFloor][0], floorControlCoordinates[activeFloor][1], floorControlCoordinates[activeFloor][2]);

    var tween = new TWEEN.Tween(camPos)
        .to(coordinates,timingInMs)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function (object) {
            camera.position.set(object.x, object.y, object.z);
        })
        .start();

    var tween2 = new TWEEN.Tween(controlPos)
        .to(controlCoordinates,timingInMs)
        .easing(TWEEN.Easing.Quintic.Out)
        .onUpdate(function (object) {
            controls.target.set(object.x, object.y, object.z);
            controls.update();
        })
        .start();
}

async function hideInfo() {
    await document.getElementsByClassName("inner-circle")[0].animate([
        {opacity: "20%"},
        {opacity: "0%"},
    ], {
        duration: 500,
        iterations: 1,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
    })
}
async function openWebsite() {
    renderer.domElement.style.cursor = "grabbing";
    await hideName();
    await hideInfo();
    await animateMovementModel();
    animationActive = true;

    await lerpCameraMovementBounce(new THREE.Vector3(camera.position.x, camera.position.y + 100, camera.position.z), 1000);

    animationActive = false;
    await delay(100);
    await showTowerTextElements();
    controls.enabled = true;
}

async function animateMovementModel() {
    isSceneActive = true;
    if (animationActive) return;
    animationActive = true;
    renderer.domElement.style.float = "none";
    await renderer.domElement.animate([
            {right: "0%"},
            {right: "40%"},
        ], {
            duration: 2000,
            iterations: 1,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"

        })
        renderer.domElement.style.right = "40%";
        renderer.domElement.style.float = "left";
    animationActive = false;
}

async function moveCameraUp() {
    if (animationActive) return;
    animationActive = true;
    activeFloor += 1;
    await lerpBetweenFloors( 2000);
    animationActive = false;
}

async function moveCameraDown() {
    if (animationActive) return;
    animationActive = true;
    activeFloor -= 1;
    await lerpBetweenFloors( 2000);
    animationActive = false;
}
async function getText () {
    let colours = ["url(#green-gradient)", "url(#blue-gradient)", "url(#red-gradient)"]
    let title = text[activeFloor][0];
    document.getElementById("title").innerHTML = title;
    document.getElementById("polygonTitle").style.fill = colours[activeFloor]

    let textItems = document.getElementsByClassName("text");
    for (let i = 0; i < text[activeFloor].length-1; i++) {
        textItems[i].innerHTML = text[activeFloor][i+1];
    }
}

async function showTowerTextElements() {
    if (animationActive) return;
    animationActive = true;
    if (isTextActive) {
        return;
    }
    await delay(500);
    await getText();
    if (activeFloor == 0) {
        document.getElementById("tower-text-wrapper").style.paddingTop = "20vh";
    } else if (activeFloor == 1) {
        document.getElementById("tower-text-wrapper").style.paddingTop = "25vh";

    } else {
        document.getElementById("tower-text-wrapper").style.paddingTop = "10vh";
    }
    for (let i=0; i<items.length; i++) {
        await items[i].animate([
            {paddingLeft: "10vw", opacity: "0%"},
            {paddingLeft: "0vw", opacity: "100%"},
        ], {
            duration: 2000,
            iterations: 1,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        })
        items[i].style.opacity = "100%";
        items[i].style.paddingLeft = "0vw";
        // await delay(100);
    }
    isTextActive = true;
    animationActive = false;
}

async function hideTowerTextElements() {
    if (animationActive) return;
    animationActive = true;
    if (!isTextActive) {
        return;
    }
    for (let i=0; i<items.length; i++) {
        await items[i].animate([
            {opacity: "100%"},
            {opacity: "0%"},
        ], {
            duration: 500,
            iterations: 1,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        })
    }
    animationActive = false;
    isTextActive = false;
}

async function increaseTowerFloor() {
    if (activeFloor + 1 > 2) {
        return;
    }
    await hideTowerTextElements();
    await moveCameraUp();
    await showTowerTextElements();
}

async function decreaseTowerFloor() {
    if (activeFloor - 1 < 0) {
        return;
    }
    await hideTowerTextElements();
    await moveCameraDown();
    await showTowerTextElements();
}

renderer.domElement.onclick = function () {
    let mouseY = event.clientY;
    if (isLoadingActive) {
        let randColor = new THREE.Color( 0xffffff );
        randColor.setHex( Math.random() * 0xffffff );
        cube.material.color = randColor;

        return;
    }
    if (!isSceneActive) {
        openWebsite();
    } else {
        let mousePosition = mouseY/window.innerHeight;
        if (mousePosition < 0.2) {
            increaseTowerFloor();

        } else if (mousePosition > 0.8) {
            decreaseTowerFloor();
        }

    }
}

window.onresize = function () {
    camera.aspect = (window.innerWidth / 1.5) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize((window.innerWidth / 1.5), window.innerHeight);
};
