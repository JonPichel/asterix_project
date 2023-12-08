package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func main() {
	//test()
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

func test() {
	file, err := os.Open("230502-est-080001_BCN_60MN_08_09.ast")

	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	buf, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	records := DecodeFile(buf)

	csvFile, err := os.Create("test.csv")
	if err != nil {
		panic(err)
	}
	defer csvFile.Close()

	if err := writeCSV(csvFile, records); err != nil {
		panic(err)
	}
}