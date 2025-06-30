\# Mapping \& 3D Viewer



Eine interaktive Web-Anwendung zur Visualisierung von Geodaten und 3D-Modellen, speziell entwickelt für die Darstellung von Orthophotos, Höhenmodellen und 3D-Rekonstruktionen.



\## Features



\### 2D Kartenviewer

\- 📷 Orthophoto-Darstellung

\- 🏔️ Digitales Höhenmodell (DEM)

\- 📍 Vektor-Daten (GeoJSON)

\- 🎛️ Layer-Kontrollen mit Transparenz-Reglern

\- 📍 Koordinaten-Anzeige



\### 3D Modell-Viewer

\- 🎨 GLB/OBJ 3D-Modell-Darstellung

\- 📏 Mess-Werkzeuge (Distanz, Fläche, Höhe)

\- ✂️ Clipping-Funktionen

\- 🎮 Kamera-Navigation (Perspektive/Orthografisch)

\- 📷 Vordefinierte Kamera-Ansichten

\- ✨ Erscheinungsbild-Kontrollen



\## Datenstruktur



```

├── odm\_orthophoto/          # Orthophoto-Dateien (.tif, .tfw, .dxf)

├── odm\_georeferencing/      # Georeferenzierung (.laz, .geojson)

├── odm\_dem/                 # Digitales Höhenmodell (.tif)

├── odm\_texturing/           # 3D-Modelle (.glb, .obj, .png)

├── entwine\_pointcloud/      # Punktwolken-Daten

├── odm\_report/              # Verarbeitungsberichte

├── cameras.json             # Kamera-Konfiguration

├── images.json              # Bild-Metadaten

└── log.json                 # Verarbeitungs-Log

```



\## Technische Details



\### Frontend-Technologien

\- \*\*HTML5/CSS3/JavaScript\*\*: Basis-Webtechnologien

\- \*\*Leaflet\*\*: 2D-Kartenvisualisierung

\- \*\*Three.js\*\*: 3D-Rendering und -Interaktion

\- \*\*Responsive Design\*\*: Optimiert für Desktop und Mobile



\### Unterstützte Dateiformate

\- \*\*Raster\*\*: TIFF, PNG

\- \*\*Vektor\*\*: GeoJSON, DXF

\- \*\*3D-Modelle\*\*: GLB, OBJ

\- \*\*Punktwolken\*\*: LAZ

\- \*\*Georeferenzierung\*\*: TFW, World Files



\## Deployment



Die Anwendung ist für GitHub Pages optimiert und wird automatisch bereitgestellt.



\### Lokale Entwicklung



1\. Repository klonen

2\. Lokalen Webserver starten:

&nbsp;  ```bash

&nbsp;  python -m http.server 8000

&nbsp;  ```

3\. Browser öffnen: `http://localhost:8000`



\### GitHub Pages Setup



1\. Repository Settings → Pages

2\. Source: "Deploy from a branch"

3\. Branch: `main` / `master`

4\. Folder: `/ (root)`



\## Verwendung



\### 2D-Kartenansicht

1\. Verschiedene Layer über die Checkboxen ein-/ausblenden

2\. Transparenz mit den Schiebereglern anpassen

3\. Koordinaten werden bei Mausbewegung angezeigt



\### 3D-Modellansicht

1\. Navigation mit Maus (Drehen, Zoomen, Schwenken)

2\. Mess-Werkzeuge aus dem Tool-Panel auswählen

3\. Kamera-Ansichten über die Navigation-Kontrollen ändern

4\. Appearance-Einstellungen für bessere Visualisierung anpassen



\## Browser-Kompatibilität



\- ✅ Chrome/Chromium 90+

\- ✅ Firefox 88+

\- ✅ Safari 14+

\- ✅ Edge 90+



\## Lizenz



MIT License - siehe LICENSE-Datei für Details.

