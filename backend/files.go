package main

import (
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func uploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !strings.HasSuffix(file.Filename, ".ast") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file extension. Only .ast files are allowed."})
		return
	}

	if isFileSaved(file.Filename) != -1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File already loaded. Remove it first."})
		return
	}


	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	buf, err := ioutil.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		src.Close()
		return
	}
	src.Close()
	records := DecodeFile(buf)

	src, err = file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer src.Close()
	if err := saveAsterix(file.Filename, len(records), src); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	recordsLoaded = records
	c.JSON(http.StatusOK, gin.H{"count": len(records)})

	go persistData()
}

type listResponse struct {
	SavedFiles []SavedFile `json:"savedFiles"`
}

func listHandler(c *gin.Context) {
	c.JSON(http.StatusOK, listResponse{
		SavedFiles: programData.SavedFiles,
	})
}

func deleteHandler(c *gin.Context) {
	filename := c.Param("filename")

	if !strings.HasSuffix(filename, ".ast") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file extension. Only .ast files are allowed."})
		return
	}

	removeSavedFile(filename)
}

func changeHandler(c *gin.Context) {
	filename := c.Param("filename")

	if !strings.HasSuffix(filename, ".ast") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file extension. Only .ast files are allowed."})
		return
	}

	if isFileSaved(filename) == -1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not loaded"})
		return
	}

	asterixPath := filepath.Join(ASTERIX_DIR, filename)
	buf, err := ioutil.ReadFile(asterixPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error reading file"})
		return
	}
	records := DecodeFile(buf)

	recordsLoaded = records
	c.JSON(http.StatusOK, gin.H{"count": len(records)})
}