package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type simulationDataResponse struct {
	Aircrafts []Aircraft `json:"aircrafts"`
}
func simulationDataHandler(c *gin.Context) {
	aircrafts := parseAircrafts(recordsLoaded)

	c.JSON(http.StatusOK, simulationDataResponse{
		Aircrafts: aircrafts,
	})


}