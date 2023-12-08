package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	//test()
	handleSignals()
	retrieveData()

	r := gin.Default()

	// CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	r.Use(cors.New(config))

	r.POST("/upload", uploadHandler)
	r.GET("/list", listHandler)
	r.POST("/change/:filename", changeHandler)
	r.DELETE("/delete/:filename", deleteHandler)
	r.GET("/simData", simulationDataHandler)

	r.POST("/csv/:filename", csvHandler)
	r.POST("/kml/:filename", KMLHandler)

	r.POST("/records", recordsHandler)
	r.Run(":5757")
}

func handleSignals() {
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		<-signalCh
		fmt.Println("PERSISTING DATA")
		if err := persistData(); err != nil {
			os.Exit(1)
		} else {
			os.Exit(0)
		}
	}()
}
