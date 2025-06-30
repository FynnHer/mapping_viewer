class ThreeDViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.configuration = null;
        this.measurements = [];
        
        this.init();
    }
    
    init() {
        this.initializeThreeJS();
        this.setupControls();
        this.loadModel();
        this.animate();
    }
    
    initializeThreeJS() {
        const container = document.getElementById('threeDContainer');
        const canvas = document.getElementById('threeDCanvas');
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 20);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Grid
        const gridHelper = new THREE.GridHelper(50, 50);
        this.scene.add(gridHelper);
    }
    
    async loadModel() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';
        
        try {
            // Try to load GLB model first
            await this.loadGLBModel('./odm_texturing/odm_textured_model.glb');
        } catch (error) {
            console.warn('GLB model not found, trying OBJ:', error);
            try {
                await this.loadOBJModel('./odm_texturing/odm_textured_model.obj');
            } catch (objError) {
                console.error('Could not load any 3D model:', objError);
                this.createPlaceholderModel();
            }
        }
        
        loadingOverlay.style.display = 'none';
    }
    
    loadGLBModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    this.model = gltf.scene;
                    this.scene.add(this.model);
                    
                    // Center the model
                    const box = new THREE.Box3().setFromObject(this.model);
                    const center = box.getCenter(new THREE.Vector3());
                    this.model.position.sub(center);
                    
                    // Adjust camera to fit model
                    const size = box.getSize(new THREE.Vector3());
                    const maxDimension = Math.max(size.x, size.y, size.z);
                    this.camera.position.set(maxDimension, maxDimension, maxDimension);
                    this.controls.target.set(0, 0, 0);
                    this.controls.update();
                    
                    resolve(gltf);
                },
                (progress) => {
                    console.log('Loading progress:', progress.loaded / progress.total * 100 + '%');
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    loadOBJModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.OBJLoader();
            loader.load(
                path,
                (obj) => {
                    this.model = obj;
                    this.scene.add(this.model);
                    
                    // Apply default material
                    this.model.traverse((child) => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
                        }
                    });
                    
                    // Center the model
                    const box = new THREE.Box3().setFromObject(this.model);
                    const center = box.getCenter(new THREE.Vector3());
                    this.model.position.sub(center);
                    
                    resolve(obj);
                },
                (progress) => {
                    console.log('Loading progress:', progress.loaded / progress.total * 100 + '%');
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    createPlaceholderModel() {
        // Create a placeholder building-like structure
        const group = new THREE.Group();
        
        // Main building
        const buildingGeometry = new THREE.BoxGeometry(10, 5, 8);
        const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = 2.5;
        group.add(building);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(7, 3, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 6.5;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
        
        // Add some trees
        for (let i = 0; i < 5; i++) {
            const treeGeometry = new THREE.ConeGeometry(1, 4, 8);
            const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const tree = new THREE.Mesh(treeGeometry, treeMaterial);
            tree.position.set(
                (Math.random() - 0.5) * 30,
                2,
                (Math.random() - 0.5) * 30
            );
            group.add(tree);
        }
        
        this.model = group;
        this.scene.add(this.model);
    }
    
    setupControls() {
        // Camera selection
        this.setupCameraControls();
        
        // Texture controls
        this.setupTextureControls();
        
        // Appearance controls
        this.setupAppearanceControls();
        
        // Tool controls
        this.setupToolControls();
        
        // Navigation controls
        this.setupNavigationControls();
    }
    
    setupCameraControls() {
        const cameraSelect = document.getElementById('cameraSelect');
        // Populate with available cameras from configuration
    }
    
    setupTextureControls() {
        const showTextures = document.getElementById('showTextures');
        showTextures.addEventListener('change', (e) => {
            if (this.model) {
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.visible = e.target.checked;
                    }
                });
            }
        });
    }
    
    setupAppearanceControls() {
        const brightness = document.getElementById('brightness');
        const contrast = document.getElementById('contrast');
        
        brightness.addEventListener('input', (e) => {
            // Adjust scene lighting based on brightness
            const value = e.target.value / 100;
            this.scene.traverse((child) => {
                if (child.isLight && child.type === 'AmbientLight') {
                    child.intensity = value * 0.6;
                }
            });
        });
        
        contrast.addEventListener('input', (e) => {
            // Adjust material properties for contrast
            const value = e.target.value / 100;
            if (this.model) {
                this.model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        // This is a simplified contrast adjustment
                        child.material.needsUpdate = true;
                    }
                });
            }
        });
    }
    
    setupToolControls() {
        // Measurement tools
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.dataset.tool;
                this.activateMeasurementTool(tool);
                
                // Update button states
                toolButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Label controls
        document.getElementById('showLabels').addEventListener('click', () => {
            this.showMeasurementLabels(true);
        });
        
        document.getElementById('hideLabels').addEventListener('click', () => {
            this.showMeasurementLabels(false);
        });
        
        // Clipping controls
        const clipButtons = document.querySelectorAll('.clip-btn');
        clipButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.target.dataset.method;
                this.setClippingMethod(method);
                
                clipButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    setupNavigationControls() {
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetCamera();
        });
        
        document.getElementById('topView').addEventListener('click', () => {
            this.setCameraView('top');
        });
        
        document.getElementById('sideView').addEventListener('click', () => {
            this.setCameraView('side');
        });
        
        const projectionMode = document.getElementById('projectionMode');
        projectionMode.addEventListener('change', (e) => {
            this.setCameraProjection(e.target.value);
        });
        
        const navigationSpeed = document.getElementById('navigationSpeed');
        const speedValue = document.getElementById('speedValue');
        navigationSpeed.addEventListener('input', (e) => {
            const speed = e.target.value;
            speedValue.textContent = speed;
            this.controls.movementSpeed = speed / 100;
        });
    }
    
    activateMeasurementTool(tool) {
        console.log('Activated measurement tool:', tool);
        // Implement measurement functionality
    }
    
    showMeasurementLabels(show) {
        // Toggle measurement label visibility
        this.measurements.forEach(measurement => {
            if (measurement.label) {
                measurement.label.visible = show;
            }
        });
    }
    
    setClippingMethod(method) {
        console.log('Set clipping method:', method);
        // Implement clipping functionality
    }
    
    resetCamera() {
        if (this.model) {
            const box = new THREE.Box3().setFromObject(this.model);
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            this.camera.position.set(maxDimension, maxDimension, maxDimension);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
    }
    
    setCameraView(view) {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        
        switch (view) {
            case 'top':
                this.camera.position.set(0, maxDimension * 2, 0);
                break;
            case 'side':
                this.camera.position.set(maxDimension * 2, 0, 0);
                break;
        }
        
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    
    setCameraProjection(mode) {
        const container = document.getElementById('threeDContainer');
        const aspect = container.clientWidth / container.clientHeight;
        
        if (mode === 'orthographic') {
            const frustumSize = 20;
            this.camera = new THREE.OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                0.1,
                1000
            );
        } else {
            this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        }
        
        this.camera.position.set(0, 10, 20);
        this.controls.object = this.camera;
        this.controls.update();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    setConfiguration(config) {
        this.configuration = config;
        
        // Populate camera dropdown with available cameras
        if (config.cameras) {
            const cameraSelect = document.getElementById('cameraSelect');
            config.cameras.forEach((camera, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
        }
    }
    
    resize() {
        const container = document.getElementById('threeDContainer');
        if (container && this.renderer && this.camera) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }
}