package main

import (
	"bytes"
	"net/http"

	"github.com/gin-gonic/gin"
)

var recordsLoaded = make([]DataRecord048, 0)

type recordsRequest struct {
	Start int `json:"start"`
	Count int `json:"count"`
}
func recordsHandler(c *gin.Context) {
	req := recordsRequest{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	if req.Start < 0 || req.Count < 0 || req.Start >= len(recordsLoaded) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	} 

	var end int
	if (req.Start + req.Count) >= len(recordsLoaded) {
		end = len(recordsLoaded)-1
	} else {
		end = req.Start + req.Count
	}

	var csvData bytes.Buffer
	writeCSV(&csvData, recordsLoaded[req.Start:end])

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=data.csv")
	c.Header("Content-Type", "text/csv")
	c.Data(http.StatusOK, "text/csv", csvData.Bytes())
}