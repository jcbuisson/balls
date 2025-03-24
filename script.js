
import * as THREE from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Parameters
const ballCount = 100;
const ballRadius = 0.2;
const boxSize = 10;
const balls = [];

// Create Balls
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
// const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000, 
    metalness: 0.3, // Add some reflection
    roughness: 0.2  // Make it shinier
});

for (let i = 0; i < ballCount; i++) {
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(
        (Math.random() - 0.5) * boxSize * 0.8,
        (Math.random() - 0.5) * boxSize * 0.8,
        (Math.random() - 0.5) * boxSize * 0.8
    );
    ball.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
    );
    balls.push(ball);
    scene.add(ball);
}

// Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Lights (Increase intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Increase intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Wals
const wallGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const edges = new THREE.EdgesGeometry(wallGeometry);
const wallLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
scene.add(wallLines);

// Camera Position
camera.position.z = 10;

// Collision Detection
function handleCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ballA = balls[i];
            const ballB = balls[j];

            const distance = ballA.position.distanceTo(ballB.position);
            if (distance < 2 * ballRadius) {
                // Elastic Collision Response
                const normal = ballA.position.clone().sub(ballB.position).normalize();
                const relativeVelocity = ballA.velocity.clone().sub(ballB.velocity);
                const speed = relativeVelocity.dot(normal);

                if (speed < 0) { // Only resolve if they are moving toward each other
                    const impulse = normal.multiplyScalar(speed);
                    ballA.velocity.sub(impulse);
                    ballB.velocity.add(impulse);
                }
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move Balls
    balls.forEach(ball => {
        ball.position.add(ball.velocity);

        // Wall Collisions
        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(ball.position[axis]) > boxSize / 2) {
                ball.position[axis] = Math.sign(ball.position[axis]) * boxSize / 2;
                ball.velocity[axis] *= -1;
            }
        });
    });

    handleCollisions();
    renderer.render(scene, camera);
}

animate();
