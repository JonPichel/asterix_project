import EsriMap from "@arcgis/core/Map"
import SceneView from "@arcgis/core/views/SceneView"
import SpatialReference from "@arcgis/core/geometry/SpatialReference"
import Track from "@arcgis/core/widgets/Track"
import TimeSlider from "@arcgis/core/widgets/TimeSlider"
import TimeInterval from "@arcgis/core/TimeInterval"
import type Layer from "@arcgis/core/layers/Layer"

import { RADAR_BCN } from "./locations"

// Load style
import "@arcgis/core/assets/esri/themes/dark/main.css"

import { DataRecord } from "src/asterix"
import PlaneLayer from "./PlaneLayer"

export const SPATIAL_REFERENCE = new SpatialReference({
  wkid: 102100,
})

export class ArcgisMap {
  map: EsriMap
  view: SceneView
  planeLayer: PlaneLayer
  timeSlider: TimeSlider | null

  constructor(container: string) {
    this.map = new EsriMap({
      basemap: "satellite",
      ground: "world-elevation",
    })

    this.view = new SceneView({
      container,
      map: this.map,
      spatialReference: SPATIAL_REFERENCE,
      camera: RADAR_BCN,
    })

    this.planeLayer = new PlaneLayer(this)

    const track = new Track({
      view: this.view,
    })
    this.view.ui.add(track, "top-left")

    this.timeSlider = null
  }

  addLayer(layer: Layer) {
    this.map.add(layer)
  }

  async addDataRecords(records: DataRecord[]) {
    if (this.timeSlider !== null) {
      this.timeSlider.stop()
    } else {
      this.timeSlider = new TimeSlider({
        container: "sliderDiv",
        mode: "instant",
        timeVisible: true,
        stops: {
          interval: new TimeInterval({
            value: 10,
            unit: "seconds",
          }),
        },
        playRate: 1000,
      })
      this.view.ui.add(this.timeSlider, "manual")
      this.timeSlider.watch("timeExtent", () => {
        requestAnimationFrame(() =>
          this.planeLayer.update(this.timeSlider!.timeExtent.start.getTime())
        )
      })
    }

    const timeExtent = this.planeLayer.loadData(records)
    this.timeSlider.fullTimeExtent = timeExtent
  }

  destroy() {
    this.view.destroy()
  }
}
