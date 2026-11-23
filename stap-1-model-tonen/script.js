// STAP 1 · EEN 3D-MODEL TONEN
// Nog geen GSAP, nog geen scroll: alleen de sfinx in beeld.


// 1. De scene: de "wereld" waarin we de sfinx zetten
const scene = new THREE.Scene();
scene.background = new THREE.Color('#1b1410');


// 2. De camera: waar we vandaan kijken
//    35 = hoe breed de lens is, de rest zorgt dat het beeld niet uitrekt
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 11);   // x = links/rechts, y = omhoog/omlaag, z = naar voren/achteren


// 3. Licht: zonder licht is alles zwart
const sun = new THREE.DirectionalLight('white', 1.2);   // een lamp die van één kant schijnt
sun.position.set(2, 3, 4);                              // rechts, boven, voor de sfinx
scene.add(sun);

const softLight = new THREE.AmbientLight('white', 0.4); // zacht licht van alle kanten
scene.add(softLight);


// 4. Het model inladen en in de scene zetten
const loader = new THREE.GLTFLoader();

loader.load('../sphinx.glb', (gltf) => {
    scene.add(gltf.scene);
});


// 5. De renderer: tekent de scene, gezien door de camera, op het <canvas>
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;   // zorgt dat de kleuren kloppen

// Teken het beeld elk frame opnieuw (ongeveer 60 keer per seconde)
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});
