//tuck on a veil
//j
import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls} from "/node_modules/three/examples/jsm/controls/OrbitControls";

let activeFloor = 0;

//middle of room for origin (control) pos and +220 origin for camera pos
const floorCameraCoordinates = [[220,120,220],
                                 [70, 410, -80],
                                 [-250, 710, -80]]
const floorControlCoordinates = [[0,-100,0], [-150,190,-300],[-470,490,-300]]

const text = [
    ["About Me",
        "I have experience coding in numerous programming languages, such as C#, Python, Java, HTML, Javascript, and C++.",
        "I enjoy coding in programming languages mainly because I get to understand more complex solutions to coding problems and more intricate details of these languages.",
        "As I have been using computers since I was young, I have always had ambition to code - initially creating Java plugins for Minecraft.",
        "Nowadays, I am always surrounded with topics related to computing (media relating to programming) and so I always try to learn something new every day.",
        "I am currently studying Maths, Further Maths, and Computer Science for A Levels."
    ],
    ["Books",
        "In order to further my knowledge on subjects relating to coding I read books on how I can try to problem solve differently.",
        "Some books I have read include:",
        "Clean Code by Robert C. Martin",
        "Data-Oriented Design by Richard Fabian",
        "And other books relating to learning Visual Basic, C++, and C#."
    ],
    ["Projects",
        "I have created many web (and console) applications in order to refine my coding skills but also for specific purposes. Many of these applications are based on Javascript, HTML, Python, and C#.",
        "I have created a Python AI using Tensorflow to take in Discord (a messaging service) messages and try to learn speech by using it as a training resource. It would then try to use this to act as a chat bot.",
        "In order to learn C# before A levels I have created a physics engine that emulates buoyancy of drawn objects.",
        "I made a 3D matrix transformation graphing website that tells you the type of transformation it is and calculates the inverse of the input matrix so that me and my Mathematics teacher can utilize it for revision. (https://squaregithub.gitlab.io/matrix/)",
        "Before GCSEs, I created a web game so that I, and a few friends, could revise in other forms. (https://squaregithub.gitlab.io/prism/)"
    ]
]
const delay = ms => new Promise(res => setTimeout(res, ms));
let isSceneActive = false;
let items = document.getElementsByClassName("tower-griditem");
let animationActive = false;
let isTextActive = false;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);

const renderer = new THREE.WebGLRenderer({antialias: true});
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

const camera = new THREE.PerspectiveCamera(90,(window.innerWidth /1.5) / window.innerHeight, 0.1, 10000);
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
let globalLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(globalLight);
controls.zoomSpeed = 0.3;
controls.rotateSpeed = 0.3;
controls.enabled = false ;

const light1  = new THREE.AmbientLight(0xffffff, 1);
light1.name = 'ambient_light';
scene.add( light1 );

const light2  = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(0.5, 0, 0.866); // ~60º
light2.name = 'main_light';
scene.add( light2 );

const modelLoader = new GLTFLoader();
modelLoader.load("/portfolio/lucarenderz.glb", function(gltf) {
    gltf.scene.scale.set(100,100,100);
    gltf.scene.position.set(0,-150,0);

    scene.add(gltf.scene);
})

function render() {
    requestAnimationFrame(render);
    controls.update();
    TWEEN.update();
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

async function openWebsite() {
    renderer.domElement.style.cursor = "grabbing";

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
    let colours = ["mediumseagreen", "lightskyblue", "firebrick"]
    let title = text[activeFloor][0];
    document.getElementById("title").innerHTML = title;
    document.getElementById("title").style.color = colours[activeFloor];

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
        await delay(100);
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
    if (!isSceneActive) {
        openWebsite();
    } else {
        if (mouseY < 100) {
            //move up
            increaseTowerFloor();

        } else if (mouseY > 200) {
            //move down
            decreaseTowerFloor();
        }

    }
}

window.onresize = function () {
    camera.aspect = (window.innerWidth / 1.5) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize((window.innerWidth / 1.5), window.innerHeight);
};
