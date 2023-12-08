package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

const (
	ASTERIX_DIR = "./asterix"
	KML_DIR = "./kml"
	CSV_DIR = "./csv"
)

type SavedFile struct {
	Filename string `json:"filename"`
	RecordCount int `json:"count"`
}

type ProgramData struct {
	SavedFiles []SavedFile `json:"saved_files"`
}

var programData ProgramData = ProgramData{
	SavedFiles: make([]SavedFile, 0),
}

func retrieveData() {
	if _, err := os.Stat(ASTERIX_DIR); os.IsNotExist(err) {
		os.Mkdir(ASTERIX_DIR, os.ModePerm)
	}
	if _, err := os.Stat(CSV_DIR); os.IsNotExist(err) {
		os.Mkdir(CSV_DIR, os.ModePerm)
	}
	if _, err := os.Stat(KML_DIR); os.IsNotExist(err) {
		os.Mkdir(KML_DIR, os.ModePerm)
	}

	jsonData, err := ioutil.ReadFile("asterix.json")
	if err != nil {
		return
	}

	err = json.Unmarshal(jsonData, &programData)
	if err != nil {
		return
	}

	// Check if all files are present
	filesToRemove := make([]SavedFile, 0)
	for _, file := range programData.SavedFiles {
		if !fileOK(file) {
			filesToRemove = append(filesToRemove, file)
		}
	}

	for _, file := range filesToRemove {
		removeSavedFile(file.Filename)
	}
}

func persistData() error {
	jsonData, err := json.MarshalIndent(programData, "", "  ")
	if err != nil {
		return err
	}

	if err := ioutil.WriteFile("asterix.json", jsonData, 0644); err != nil {
		return err
	}

	return nil
}

func isFileSaved(filename string) int {
	for i, file := range programData.SavedFiles {
		if file.Filename == filename {
			return i
		}
	}
	return -1
}

func removeSavedFile(filename string) {
	asterixPath := filepath.Join(ASTERIX_DIR, filename)
	csvPath := filepath.Join(CSV_DIR, strings.TrimSuffix(filename, ".ast")) + ".csv"
	kmlPath := filepath.Join(KML_DIR, strings.TrimSuffix(filename, ".ast")) + ".kml"

	os.Remove(asterixPath)
	os.Remove(csvPath)
	os.Remove(kmlPath)

	index := isFileSaved(filename)
	if index != -1 {
		programData.SavedFiles = append(programData.SavedFiles[:index], programData.SavedFiles[index+1:]...)
	}
}

func saveAsterix(filename string, count int, src io.Reader) error {
	dstPath := filepath.Join(ASTERIX_DIR, filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		return err
	}

	programData.SavedFiles = append(programData.SavedFiles, SavedFile{
		Filename: filename,
		RecordCount: count,
	})

	return nil
}

func fileOK(file SavedFile) bool {
	asterixPath := filepath.Join(ASTERIX_DIR, file.Filename)
	csvPath := filepath.Join(CSV_DIR, strings.TrimSuffix(file.Filename, ".ast")) + ".csv"
	kmlPath := filepath.Join(KML_DIR, strings.TrimSuffix(file.Filename, ".ast")) + ".kml"

	if _, err := os.Stat(asterixPath); os.IsNotExist(err) {
		return false
	}
	if _, err := os.Stat(csvPath); os.IsNotExist(err) {
		return false
	}
	if _, err := os.Stat(kmlPath); os.IsNotExist(err) {
		return false
	}
	return true
}