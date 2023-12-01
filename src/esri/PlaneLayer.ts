import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable"
import { Point, Polyline } from "@arcgis/core/geometry"

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import Graphic from "@arcgis/core/Graphic"
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol"
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D"
import LineSymbol3DLayer from "@arcgis/core/symbols/LineSymbol3DLayer"
import { ArcgisMap, SPATIAL_REFERENCE } from "./map"
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol"
import { DataRecord } from "src/asterix"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer"
import TimeExtent from "@arcgis/core/TimeExtent"

const PLANE_SYMBOL_2D = new PictureMarkerSymbol({
  url: "assets/plane-black.svg",
  width: 20,
  height: 20,
  angle: 270,
})

// eslint-disable-next-line
const PATH_SYMBOL_2D = new SimpleLineSymbol({
  color: [0, 152, 255],
  width: 3,
})

const PATH_SYMBOL_3D = new LineSymbol3D({
  symbolLayers: [
    new LineSymbol3DLayer({
      material: {
        color: [0, 152, 255],
      },
      size: 2,
    }),
  ],
})

function getVisibleRecords(records: DataRecord[], timestamp: number) {
  const index = records.findIndex((record) => record.timestamp! > timestamp)
  if (index === 0) {
    // First record of the aircraft hasn't arrived yet
    return []
  }

  if (index === -1) {
    return records
  } else {
    return records.slice(0, index)
  }
}

export type Aircraft = {
  aircraftID: string
  records: DataRecord[]
  added: boolean
}

export default class PlaneLayer {
  map: ArcgisMap
  timestamp = -1

  aircrafts: Aircraft[] = []
  aircraftIndex: Map<string, number> = new Map()

  modelLayer!: FeatureLayer
  pathLayer!: FeatureLayer

  constructor(map: ArcgisMap) {
    this.map = map

    this.initModels()
    this.initPaths()
  }

  loadData(records: DataRecord[]): TimeExtent {
    // Classify the records by aircraftID
    let currentTimestamp = this.timestamp
    const useMaxTimestamp = currentTimestamp === -1

    for (const record of records) {
      const aircraftID = record.aircraftID
      const timestamp = record.timestamp
      const coords = record.gpsCoords
      if (
        aircraftID === undefined ||
        timestamp === undefined ||
        coords === undefined
      ) {
        continue
      }

      if (!this.aircraftIndex.has(aircraftID)) {
        this.aircraftIndex.set(aircraftID, this.aircrafts.length)
        this.aircrafts.push({
          aircraftID,
          records: [],
          added: false,
        })
      }

      // Compute maximum timestamp
      if (useMaxTimestamp && timestamp > currentTimestamp) {
        currentTimestamp = timestamp
      }

      const index = this.aircraftIndex.get(aircraftID)!
      this.aircrafts[index].records.push(record)
    }

    let start = this.aircrafts[0].records[0].timestamp!
    let end = start
    for (let i = 0; i < this.aircrafts.length; i++) {
      const aircraft = this.aircrafts[i]
      // Sort each plane's records by timestamp
      aircraft.records.sort((a, b) => a.timestamp! - b.timestamp!)

      if (aircraft.records[0].timestamp! < start) {
        start = aircraft.records[0].timestamp!
      }
      if (aircraft.records[aircraft.records.length - 1].timestamp! > end) {
        end = aircraft.records[aircraft.records.length - 1].timestamp!
      }
    }

    //this.update(currentTimestamp)

    return new TimeExtent({
      start,
      end,
    })
  }

  initModels() {
    this.modelLayer = new FeatureLayer({
      title: "Planes",
      spatialReference: SPATIAL_REFERENCE,
      hasZ: true,
      source: [],
      geometryType: "point",
      renderer: new SimpleRenderer({
        symbol: PLANE_SYMBOL_2D,
        visualVariables: [
          new RotationVariable({
            field: "heading",
            rotationType: "geographic",
          }),
        ],
      }),
      objectIdField: "objectID",
      fields: [
        {
          name: "objectID",
          alias: "ObjectID",
          type: "oid",
        },
        {
          name: "aircraftID",
          type: "string",
        },
        {
          name: "heading",
          type: "double",
        },
        {
          name: "timestamp",
          type: "date",
        },
      ],
      popupTemplate: {
        title: "{aircraftID}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "heading",
                label: "Heading",
                visible: true,
                format: {
                  places: 2,
                },
              },
              {
                fieldName: "aircraftID",
                label: "Aircraft ID",
                visible: true,
              },
              {
                fieldName: "timestamp",
                label: "timestamp",
                visible: true,
              },
            ],
          },
        ],
      },
    })

    this.map.addLayer(this.modelLayer)
  }

  initPaths() {
    this.pathLayer = new FeatureLayer({
      title: "Paths",
      spatialReference: SPATIAL_REFERENCE,
      hasZ: true,
      source: [],
      geometryType: "polyline",
      renderer: new SimpleRenderer({
        symbol: PATH_SYMBOL_3D,
      }),
      objectIdField: "objectID",
      fields: [
        {
          name: "objectID",
          alias: "ObjectID",
          type: "oid",
        },
      ],
    })

    this.map.addLayer(this.pathLayer)
  }

  update(timestamp: number) {
    this.timestamp = timestamp

    const addedModels: Graphic[] = []
    const deletedModels: { objectId: number }[] = []
    const updatedModels: Graphic[] = []
    const addedPaths: Graphic[] = []
    const deletedPaths: { objectId: number }[] = []
    const updatedPaths: Graphic[] = []
    for (let i = 0; i < this.aircrafts.length; i++) {
      const aircraft = this.aircrafts[i]
      const visible = getVisibleRecords(aircraft.records, timestamp)
      if (!visible.length) {
        if (aircraft.added) {
          // Delete aircraft graphics
          deletedModels.push({
            objectId: i,
          })
          deletedPaths.push({
            objectId: i,
          })
        }
        continue
      }

      // Model graphic
      const current = visible[visible.length - 1]
      const modelGraphic = new Graphic({
        geometry: new Point({
          latitude: current.gpsCoords!.lat,
          longitude: current.gpsCoords!.lon,
          z: current.gpsCoords!.alt,
          hasZ: true,
        }),
        attributes: {
          objectID: i,
          aircraftID: aircraft.aircraftID,
          heading: 0,
          timestamp: current.timestamp!,
        },
      })
      // Path graphic
      const path = visible.map(
        (record) =>
          new Point({
            spatialReference: SPATIAL_REFERENCE,
            latitude: record.gpsCoords!.lat,
            longitude: record.gpsCoords!.lon,
            z: record.gpsCoords!.alt,
            hasZ: true,
          })
      )
      const polyline = new Polyline({
        spatialReference: SPATIAL_REFERENCE,
        hasZ: true,
      })
      polyline.addPath(path)
      const pathGraphic = new Graphic({
        geometry: polyline,
        attributes: {
          objectID: i,
        },
      })

      if (!aircraft.added) {
        // Add aircraft graphics
        addedModels.push(modelGraphic)
        addedPaths.push(pathGraphic)
        aircraft.added = true
      } else {
        // Update aircraft graphics
        updatedModels.push(modelGraphic)
        updatedPaths.push(pathGraphic)
      }
    }

    this.modelLayer.applyEdits({
      addFeatures: addedModels,
      deleteFeatures: deletedModels,
      updateFeatures: updatedModels,
    })

    this.pathLayer.applyEdits({
      addFeatures: addedPaths,
      deleteFeatures: deletedPaths,
      updateFeatures: updatedPaths,
    })
  }
}
