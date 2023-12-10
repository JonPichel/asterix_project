package main

import (
	"bytes"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
)

var recordsLoaded = make([]DataRecord048, 0)

var sortedBy = "none"
var desc = false

type recordsRequest struct {
	Start int `json:"start"`
	Count int `json:"count"`
	SortBy string `json:"sortBy"`
	Desc bool `json:"desc"`
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

	if sortedBy == req.SortBy && desc != req.Desc {
		length := len(recordsLoaded)
		for i := 0; i < length/2; i++ {
			recordsLoaded[i], recordsLoaded[length-i-1] = recordsLoaded[length-i-1], recordsLoaded[i]
		}
		desc = req.Desc
	} else if sortedBy != req.SortBy {
		switch req.SortBy {
		case "none":
			sort.Sort(ByNone(recordsLoaded))
		case "Timestamp":
			if req.Desc {
				sort.Sort(BySSMDesc(recordsLoaded))
			} else {
				sort.Sort(BySSM(recordsLoaded))
			}
		case "AircraftID":
			if req.Desc {
				sort.Sort(ByIDDesc(recordsLoaded))
			} else {
				sort.Sort(ByID(recordsLoaded))
			}
		case "AircraftAddress":
			if req.Desc {
				sort.Sort(ByAddressDesc(recordsLoaded))
			} else {
				sort.Sort(ByAddress(recordsLoaded))
			}
		}
		sortedBy = req.SortBy
		desc = req.Desc
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