// Clean Three.js Cloud Infrastructure Scene
class CloudScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createCloudNodes();
        this.setupEventListeners();
        this.animate();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 15);
    }
    
    createRenderer() {
        const container = document.getElementById('three-container');
        if (!container) return;
        
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        container.appendChild(this.renderer.domElement);
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Point lights
        const light1 = new THREE.PointLight(0x00d9ff, 0.8, 100);
        light1.position.set(10, 10, 10);
        this.scene.add(light1);
        
        const light2 = new THREE.PointLight(0x64ffda, 0.6, 100);
        light2.position.set(-10, -10, -10);
        this.scene.add(light2);
    }
    
    createCloudNodes() {
        const nodeConfigs = [
            { name: 'AWS', position: [-4, 2, 0], color: 0xff9900 },
            { name: 'Kubernetes', position: [0, 0, 0], color: 0x326ce5 },
            { name: 'Docker', position: [4, -2, 2], color: 0x2496ed },
            { name: 'Database', position: [-2, -3, -1], color: 0xff6b6b },
            { name: 'Monitoring', position: [2, 3, -2], color: 0x6bcf7f }
        ];
        
        nodeConfigs.forEach(config => {
            this.createNode(config);
        });
        
        this.createConnections();
    }
    
    createNode(config) {
        const group = new THREE.Group();
        
        // Main sphere
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.8,
            emissive: config.color,
            emissiveIntensity: 0.1
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);
        
        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
        
        // Position
        group.position.set(...config.position);
        group.userData = { name: config.name, originalPosition: config.position };
        
        this.scene.add(group);
        this.nodes.push(group);
    }
    
    createConnections() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d9ff,
            transparent: true,
            opacity: 0.3
        });
        
        // Connect some nodes
        const connections = [
            [0, 1], // AWS to Kubernetes
            [1, 2], // Kubernetes to Docker
            [1, 3], // Kubernetes to Database
            [1, 4]  // Kubernetes to Monitoring
        ];
        
        connections.forEach(([startIdx, endIdx]) => {
            const start = this.nodes[startIdx].position;
            const end = this.nodes[endIdx].position;
            
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            ]);
            
            const line = new THREE.Line(geometry, lineMaterial);
            this.scene.add(line);
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse interaction
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.nodes, true);
            
            // Reset all nodes
            this.nodes.forEach(node => {
                node.scale.setScalar(1);
                node.children[0].material.emissiveIntensity = 0.1;
            });
            
            // Highlight hovered node
            if (intersects.length > 0) {
                const hoveredNode = intersects[0].object.parent;
                hoveredNode.scale.setScalar(1.2);
                hoveredNode.children[0].material.emissiveIntensity = 0.3;
            }
        });
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotate the entire scene slowly
        if (this.scene) {
            this.scene.rotation.y += 0.002;
            this.scene.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
        }
        
        // Animate individual nodes
        this.nodes.forEach((node, index) => {
            const time = Date.now() * 0.001;
            node.position.y = node.userData.originalPosition[1] + Math.sin(time + index) * 0.2;
            node.rotation.y += 0.01;
        });
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof THREE !== 'undefined') {
        new CloudScene();
        console.log('Three.js scene initialized successfully');
    } else {
        console.log('Three.js not loaded');
    }
});
