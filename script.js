// Three.js en GSAP zijn al ingeladen in index.html (met <script>-tags).
// Daardoor kunnen we hier meteen THREE, gsap en ScrollTrigger gebruiken.

// Vertel GSAP dat we ScrollTrigger willen gebruiken
gsap.registerPlugin(ScrollTrigger);


// ===== 1. DE 3D-WERELD =====

// De scene: de "wereld" waarin we de sfinx zetten
const scene = new THREE.Scene();
scene.background = new THREE.Color('#1b1410');   // dezelfde kleur als de achtergrond in style.css

// De camera: waar we vandaan kijken
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 11);   // x, y, z: iets hoger en verder weg

// De renderer: tekent de wereld op het <canvas>
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;   // zorgt dat de kleuren kloppen

// Licht: zonder licht is alles zwart
const sun = new THREE.DirectionalLight('white', 1.2);
sun.position.set(2, 3, 4);
scene.add(sun);

const softLight = new THREE.AmbientLight('white', 0.4);
scene.add(softLight);


// ===== 2. DE TEKST ANIMEREN =====

// Een gewone animatie: de titel komt binnen zodra de pagina laadt
gsap.from('h1', {
    opacity: 0,
    y: 50,
    duration: 1.5
});

// Per scherm: de tekst schuift omhoog zodra het scherm in beeld komt
gsap.utils.toArray('.content').forEach((section) => {

    gsap.from(section.querySelectorAll('p'), {
        y: 30,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            toggleActions: 'play none none none'
        }
    });

});


// ===== 3. DE SFINX INLADEN EN ANIMEREN =====

const loader = new THREE.GLTFLoader();

loader.load('sphinx.glb', (gltf) => {

    // Alles hieronder gebeurt pas als het model klaar is met laden.
    // Daarom staan de sfinx-animaties híér: eerder bestaat de sfinx nog niet.

    const sphinx = gltf.scene;
    scene.add(sphinx);

    // --- Naar scherm 2: de sfinx draait en schuift naar rechts ---

    gsap.to(sphinx.rotation, {
        y: Math.PI,               // Math.PI = een halve draai (180 graden)
        scrollTrigger: {
            trigger: '.second',   // let op scherm 2...
            start: 'top bottom',  // begin: scherm 2 komt onderin beeld
            end: 'top top',       // einde: scherm 2 staat helemaal in beeld
            scrub: true           // de animatie loopt mee met je scroll
        }
    });

    gsap.to(sphinx.position, {
        x: 2.5,                   // naar rechts, zodat de tekst links ruimte heeft
        scrollTrigger: {
            trigger: '.second',
            start: 'top bottom',
            end: 'top top',
            scrub: true
        }
    });

    // --- Naar scherm 3: de sfinx draait verder en schuift naar links ---

    gsap.to(sphinx.rotation, {
        y: Math.PI * 2,           // Math.PI * 2 = een hele draai (360 graden)
        scrollTrigger: {
            trigger: '.third',    // nu letten we op scherm 3
            start: 'top bottom',
            end: 'top top',
            scrub: true
        }
    });

    gsap.to(sphinx.position, {
        x: -2.5,                  // naar links, zodat de tekst rechts ruimte heeft
        scrollTrigger: {
            trigger: '.third',
            start: 'top bottom',
            end: 'top top',
            scrub: true
        }
    });
});


// ===== 4. ELK FRAME OPNIEUW TEKENEN =====

// gsap.ticker roept deze functie ongeveer 60 keer per seconde aan
gsap.ticker.add(() => {
    renderer.render(scene, camera);
});


// ===== 5. ALS HET VENSTER VAN GROOTTE VERANDERT =====

// Maak het canvas en de camera weer passend bij het nieuwe venster
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
