import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable"
import { Point, Polyline } from "@arcgis/core/geometry"

import Graphic from "@arcgis/core/Graphic"
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D"
import LineSymbol3DLayer from "@arcgis/core/symbols/LineSymbol3DLayer"
import { ArcgisMap, SPATIAL_REFERENCE } from "./map"
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer"
import TimeExtent from "@arcgis/core/TimeExtent"

export interface RoutePoint {
  timestamp: number
  lat: number
  lon: number
  alt: number
}

export interface Aircraft {
  id: string
  route: RoutePoint[]
  added: boolean
}

const PLANE_SYMBOL_2D = new PictureMarkerSymbol({
  url: "assets/plane-black.svg",
  width: 20,
  height: 20,
  angle: 270,
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

function getVisibleRoute(route: RoutePoint[], timestamp: number) {
  if (
    route[0].timestamp > timestamp ||
    route[route.length - 1].timestamp + 10_000 < timestamp
  )
    return []
  if (route[route.length - 1].timestamp <= timestamp) return route

  let low = 0
  let high = route.length - 1
  let index = 0
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (route[mid].timestamp <= timestamp) {
      index = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return route.slice(0, index)
}

export default class PlaneLayer {
  map: ArcgisMap

  aircrafts: Aircraft[] = []
  aircraftIndex: Map<string, number> = new Map()

  modelLayer: FeatureLayer | null = null
  pathLayer: FeatureLayer | null = null

  showPaths = false
  hidePaths = false

  constructor(map: ArcgisMap) {
    this.map = map

    //this.initModels()
    //this.initPaths()
  }

  togglePaths() {
    this.showPaths = !this.showPaths
    if (!this.showPaths) {
      this.hidePaths = true
    }
  }

  clear() {
    this.modelLayer?.destroy()
    this.modelLayer = null
    this.pathLayer?.destroy()
    this.pathLayer = null
  }

  loadData(aircrafts: Aircraft[]): TimeExtent {
    if (this.modelLayer === null) {
      this.initModels()
    }
    if (this.pathLayer === null) {
      this.initPaths()
    }

    this.aircrafts = aircrafts

    let start = this.aircrafts[0].route[0].timestamp
    let end = start
    for (let i = 0; i < this.aircrafts.length; i++) {
      const aircraft = this.aircrafts[i]

      if (aircraft.route[0].timestamp! < start) {
        start = aircraft.route[0].timestamp!
      }
      if (aircraft.route[aircraft.route.length - 1].timestamp! > end) {
        end = aircraft.route[aircraft.route.length - 1].timestamp!
      }

      aircraft.added = false
    }

    const addedModels: Graphic[] = []
    const addedPaths: Graphic[] = []
    for (let i = 0; i < aircrafts.length; i++) {
      const aircraft = aircrafts[i]
      const current = aircraft.route[aircraft.route.length - 1]

      const modelGraphic = new Graphic({
        geometry: new Point({
          latitude: current.lat,
          longitude: current.lon,
          z: current.alt,
          hasZ: true,
        }),
        attributes: {
          OBJECTID: i,
          aircraftID: aircraft.id,
          heading: 0,
          timestamp: current.timestamp,
          lat: current.lat,
          lon: current.lon,
          alt: current.alt,
          added: 0,
        },
      })

      // Path graphic
      const path = aircraft.route.map(
        (routePoint) =>
          new Point({
            spatialReference: SPATIAL_REFERENCE,
            latitude: routePoint.lat,
            longitude: routePoint.lon,
            z: routePoint.alt,
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
          OBJECTID: i,
          added: 0,
        },
      })

      addedModels.push(modelGraphic)
      addedPaths.push(pathGraphic)
    }

    this.modelLayer!.applyEdits({
      addFeatures: addedModels,
    })
    this.pathLayer!.applyEdits({
      addFeatures: addedPaths,
    })

    return new TimeExtent({
      start,
      end,
    })
  }

  initModels() {
    this.modelLayer = new FeatureLayer({
      definitionExpression: "added = 1",
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
      objectIdField: "OBJECTID",
      fields: [
        {
          name: "OBJECTID",
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
        {
          name: "lat",
          type: "double",
        },
        {
          name: "lon",
          type: "double",
        },
        {
          name: "alt",
          type: "double",
        },
        {
          name: "added",
          type: "integer",
        },
      ],
      popupTemplate: {
        title: "{aircraftID} {OBJECTID}",
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
                label: "Aircraft Address",
                visible: true,
              },
              {
                fieldName: "timestamp",
                label: "timestamp",
                visible: true,
              },
              {
                fieldName: "lat",
                label: "latitude",
                visible: true,
              },
              {
                fieldName: "lon",
                label: "longitude",
                visible: true,
              },
              {
                fieldName: "alt",
                label: "altitude",
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
      definitionExpression: "added = 1",
      spatialReference: SPATIAL_REFERENCE,
      hasZ: true,
      source: [],
      geometryType: "polyline",
      renderer: new SimpleRenderer({
        symbol: PATH_SYMBOL_3D,
      }),
      objectIdField: "OBJECTID",
      fields: [
        {
          name: "OBJECTID",
          type: "oid",
        },
        {
          name: "added",
          type: "integer",
        },
      ],
    })

    this.map.addLayer(this.pathLayer)
  }

  update(timestamp: number) {
    if (this.modelLayer === null || this.pathLayer === null) return

    const updatedModels: Graphic[] = []
    const updatedPaths: Graphic[] = []
    for (let i = 0; i < this.aircrafts.length; i++) {
      const aircraft = this.aircrafts[i]
      const visible = getVisibleRoute(aircraft.route, timestamp)

      if (this.hidePaths && !this.showPaths) {
        updatedPaths.push(
          new Graphic({
            attributes: {
              OBJECTID: i,
              added: 0,
            },
          })
        )
      }

      if (!visible.length) {
        if (aircraft.added) {
          updatedModels.push(
            new Graphic({
              attributes: {
                OBJECTID: i,
                added: 0,
              },
            })
          )

          if (this.showPaths) {
            updatedPaths.push(
              new Graphic({
                attributes: {
                  OBJECTID: i,
                  added: 0,
                },
              })
            )
          }
          aircraft.added = false
        }
        continue
      }

      // Model graphic
      const current = visible[visible.length - 1]
      const modelGraphic = new Graphic({
        geometry: new Point({
          latitude: current.lat,
          longitude: current.lon,
          z: current.alt,
          hasZ: true,
        }),
        attributes: {
          OBJECTID: i,
          aircraftID: aircraft.id,
          heading: 0,
          timestamp: current.timestamp,
          lat: current.lat,
          lon: current.lon,
          alt: current.alt,
          added: 1,
        },
      })

      // Path graphic
      let pathGraphic: Graphic
      if (this.showPaths) {
        const path = visible.map(
          (routePoint) =>
            new Point({
              spatialReference: SPATIAL_REFERENCE,
              latitude: routePoint.lat,
              longitude: routePoint.lon,
              z: routePoint.alt,
              hasZ: true,
            })
        )
        const polyline = new Polyline({
          spatialReference: SPATIAL_REFERENCE,
          hasZ: true,
        })
        polyline.addPath(path)
        pathGraphic = new Graphic({
          geometry: polyline,
          attributes: {
            OBJECTID: i,
            added: 1,
          },
        })
      }

      // Add aircraft graphics
      updatedModels.push(modelGraphic)
      if (this.showPaths) {
        updatedPaths.push(pathGraphic!)
      }
    }

    this.modelLayer!.applyEdits({
      updateFeatures: updatedModels,
    })

    if (this.showPaths || this.hidePaths) {
      this.pathLayer!.applyEdits({
        updateFeatures: updatedPaths,
      })
      this.hidePaths = false
    }
  }
}
