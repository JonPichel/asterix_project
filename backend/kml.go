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

	kmlPath := filepath.Join(KML_DIR, strings.TrimSuffix(filename, ".ast")) + ".kml"
	file, err := os.Create(kmlPath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	aircrafts := parseAircrafts(recordsLoaded)
	saveKML(file, aircrafts)
}

func saveKML(f *os.File, aircrafts []Aircraft) {
	f.WriteString(`<Folder> 
	<name>rutas</name> 
	<open>1</open>
	<Style id="yellowLineGreenPoly">
		<LineStyle>
			<color>7f00ff00</color> 
			<width>4</width>
		</LineStyle>
	</Style>`)
			
	for _, aircraft := range aircrafts {
		f.WriteString(fmt.Sprintf(`
	<Placemark>
		<name>%s</name>
		<styleUrl>#yellowLineGreenPoly</styleUrl>
		<LineString>
			<tessellate>1</tessellate>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>`, aircraft.ID))
	
		for _, point := range aircraft.Route {
			// Agrega las coordenadas al documento KML
			f.WriteString(fmt.Sprintf("%f,%f,%f ", point.Lon, point.Lat, point.Alt))
		}
		f.WriteString(`</coordinates>
		</LineString>
	</Placemark>`)
	}
	
	// Finaliza el documento KML
	f.WriteString(`
</Folder>
`)
}