class MappingViewer {
    constructor() {
        this.mapViewer = null;
        this.threeDViewer = null;
        this.currentView = 'map';
        
        this.init();
    }
    
    init() {
        this.setupViewToggle();
        this.initializeViewers();
        this.loadConfigurationFiles();
    }
    
    setupViewToggle() {
        const mapViewBtn = document.getElementById('mapViewBtn');
        const threeDViewBtn = document.getElementById('threeDViewBtn');
        const mapView = document.getElementById('mapView');
        const threeDView = document.getElementById('threeDView');
        
        mapViewBtn.addEventListener('click', () => {
            this.switchView('map');
            mapViewBtn.classList.add('active');
            threeDViewBtn.classList.remove('active');
            mapView.classList.add('active');
            threeDView.classList.remove('active');
            
            if (this.mapViewer) {
                this.mapViewer.resize();
            }
        });
        
        threeDViewBtn.addEventListener('click', () => {
            this.switchView('3d');
            threeDViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
            threeDView.classList.add('active');
            mapView.classList.remove('active');
            
            if (this.threeDViewer) {
                this.threeDViewer.resize();
            }
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        if (view === 'map' && !this.mapViewer) {
            this.mapViewer = new MapViewer();
        } else if (view === '3d' && !this.threeDViewer) {
            this.threeDViewer = new ThreeDViewer();
        }
    }
    
    initializeViewers() {
        // Initialize map viewer by default
        this.mapViewer = new MapViewer();
    }
    
    async loadConfigurationFiles() {
        try {
            // Load camera configuration
            const camerasResponse = await fetch('./cameras.json');
            const cameras = await camerasResponse.json();
            
            // Load images configuration
            const imagesResponse = await fetch('./images.json');
            const images = await imagesResponse.json();
            
            // Load log information
            const logResponse = await fetch('./log.json');
            const log = await logResponse.json();
            
            // Pass configuration to viewers
            if (this.mapViewer) {
                this.mapViewer.setConfiguration({ cameras, images, log });
            }
            
            if (this.threeDViewer) {
                this.threeDViewer.setConfiguration({ cameras, images, log });
            }
            
        } catch (error) {
            console.warn('Could not load configuration files:', error);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mappingViewer = new MappingViewer();
});