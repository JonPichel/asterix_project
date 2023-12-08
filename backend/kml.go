package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func KMLHandler(c *gin.Context) {
	filename := c.Param("filename")

	if !strings.HasSuffix(filename, ".ast") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file extension. Only .ast files are allowed."})
		return
	}

	if isFileSaved(filename) == -1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not loaded"})
		return
	}

	aircrafts := parseAircrafts(recordsLoaded)
	kmlData := saveKML(aircrafts)

	kmlPath := filepath.Join(KML_DIR, strings.TrimSuffix(filename, ".ast")) + ".kml"
	file, err := os.Create(kmlPath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	_, err = file.WriteString(kmlData)
	if err != nil {
		fmt.Println("Error al escribir en el archivo KML:", err)
		return
	}
}

func saveKML(aircrafts []Aircraft) string {
	kml := `
		<Folder> 
			<name>rutas</name> 
			<open>1</open>`
			
	for _, aircraft := range aircrafts {
		kml += fmt.Sprintf(`
			<Style id="yellowLineGreenPoly">
				<LineStyle>
					<color>7f00ff00</color> 
					<width>4</width>
				</LineStyle>
			</Style>
			<Placemark>
				<name>%s</name>
				<styleUrl>#yellowLineGreenPoly</styleUrl>
				<LineString>
					<tessellate>1</tessellate>
					<altitudeMode>absolute</altitudeMode>
					<coordinates>`, aircraft.ID)
	
		for _, point := range aircraft.Route {
			// Agrega las coordenadas al documento KML
			kml += fmt.Sprintf("%f,%f,%f ", point.Lon, point.Lat, point.Alt)
		}
		kml += `
				</coordinates>
			</LineString>
		</Placemark>`
	}
	
	// Finaliza el documento KML
	kml += `
		</Folder>`

	return kml
}