class MapViewer {
    constructor() {
        this.map = null;
        this.layers = {};
        this.configuration = null;
        
        this.init();
    }
    
    init() {
        this.initializeMap();
        this.setupLayerControls();
        this.setupCoordinateDisplay();
    }
    
    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([49.1951, 8.1849], 18); // Herxheim coordinates
        
        // Add base layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.loadDataLayers();
    }
    
    async loadDataLayers() {
        try {
            // Load orthophoto layer
            await this.loadOrthophoto();
            
            // Load DEM layer
            await this.loadDEM();
            
            // Load vector data
            await this.loadVectorData();
            
        } catch (error) {
            console.error('Error loading data layers:', error);
        }
    }
    
    async loadOrthophoto() {
        try {
            // For now, we'll simulate loading the orthophoto
            // In a real implementation, you'd need a tile server or convert TIFF to tiles
            const bounds = [[49.190, 8.180], [49.200, 8.190]]; // Approximate bounds
            
            this.layers.orthophoto = L.imageOverlay(
                './odm_orthophoto/odm_orthophoto.tif', // You'll need to convert this to a web-compatible format
                bounds,
                { opacity: 1.0 }
            );
            
            // For demo purposes, add a placeholder rectangle
            this.layers.orthophotoPlaceholder = L.rectangle(bounds, {
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.3
            }).addTo(this.map);
            
        } catch (error) {
            console.warn('Orthophoto not available:', error);
        }
    }
    
    async loadDEM() {
        try {
            // Load DEM as contour lines or elevation visualization
            // This would require processing the TIFF file
            const bounds = [[49.190, 8.180], [49.200, 8.190]];
            
            this.layers.demPlaceholder = L.rectangle(bounds, {
                color: 'brown',
                fillColor: 'tan',
                fillOpacity: 0.0
            });
            
        } catch (error) {
            console.warn('DEM not available:', error);
        }
    }
    
    async loadVectorData() {
        try {
            // Load GeoJSON data
            const response = await fetch('./odm_georeferencing/ground_control_points.geojson');
            if (response.ok) {
                const geojsonData = await response.json();
                
                this.layers.vector = L.geoJSON(geojsonData, {
                    style: {
                        color: 'red',
                        weight: 2,
                        fillOpacity: 0.7
                    },
                    onEachFeature: (feature, layer) => {
                        if (feature.properties) {
                            layer.bindPopup(Object.keys(feature.properties).map(key => 
                                `<b>${key}:</b> ${feature.properties[key]}`
                            ).join('<br>'));
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('Vector data not available:', error);
        }
    }
    
    setupLayerControls() {
        // Orthophoto controls
        const orthophotoCheckbox = document.getElementById('orthophotoLayer');
        const orthophotoOpacity = document.getElementById('orthophotoOpacity');
        
        orthophotoCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (this.layers.orthophoto) {
                    this.layers.orthophoto.addTo(this.map);
                }
                if (this.layers.orthophotoPlaceholder) {
                    this.layers.orthophotoPlaceholder.addTo(this.map);
                }
            } else {
                if (this.layers.orthophoto) {
                    this.map.removeLayer(this.layers.orthophoto);
                }
                if (this.layers.orthophotoPlaceholder) {
                    this.map.removeLayer(this.layers.orthophotoPlaceholder);
                }
            }
        });
        
        orthophotoOpacity.addEventListener('input', (e) => {
            const opacity = e.target.value / 100;
            if (this.layers.orthophoto) {
                this.layers.orthophoto.setOpacity(opacity);
            }
            if (this.layers.orthophotoPlaceholder) {
                this.layers.orthophotoPlaceholder.setStyle({ fillOpacity: opacity * 0.3 });
            }
        });
        
        // DEM controls
        const demCheckbox = document.getElementById('demLayer');
        const demOpacity = document.getElementById('demOpacity');
        
        demCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (this.layers.demPlaceholder) {
                    this.layers.demPlaceholder.addTo(this.map);
                }
            } else {
                if (this.layers.demPlaceholder) {
                    this.map.removeLayer(this.layers.demPlaceholder);
                }
            }
        });
        
        demOpacity.addEventListener('input', (e) => {
            const opacity = e.target.value / 100;
            if (this.layers.demPlaceholder) {
                this.layers.demPlaceholder.setStyle({ fillOpacity: opacity * 0.5 });
            }
        });
        
        // Vector controls
        const vectorCheckbox = document.getElementById('vectorLayer');
        const vectorOpacity = document.getElementById('vectorOpacity');
        
        vectorCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (this.layers.vector) {
                    this.layers.vector.addTo(this.map);
                }
            } else {
                if (this.layers.vector) {
                    this.map.removeLayer(this.layers.vector);
                }
            }
        });
        
        vectorOpacity.addEventListener('input', (e) => {
            const opacity = e.target.value / 100;
            if (this.layers.vector) {
                this.layers.vector.setStyle({ fillOpacity: opacity });
            }
        });
    }
    
    setupCoordinateDisplay() {
        const coordinatesDisplay = document.getElementById('coordinates');
        
        this.map.on('mousemove', (e) => {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            coordinatesDisplay.textContent = `Lat: ${lat}, Lng: ${lng}`;
        });
    }
    
    setConfiguration(config) {
        this.configuration = config;
        // Use configuration data to enhance map display
    }
    
    resize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }
}