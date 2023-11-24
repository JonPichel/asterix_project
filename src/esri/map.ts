import EsriMap from "@arcgis/core/Map"
import SceneView from "@arcgis/core/views/SceneView"
import SpatialReference from "@arcgis/core/geometry/SpatialReference"
import Track from "@arcgis/core/widgets/Track"
import TimeSlider from "@arcgis/core/widgets/TimeSlider"
import TimeExtent from "@arcgis/core/TimeExtent"
import TimeInterval from "@arcgis/core/TimeInterval"
import type Layer from "@arcgis/core/layers/Layer"

import { RADAR_BCN } from "./locations"

// Load style
import "@arcgis/core/assets/esri/themes/dark/main.css"

import { DataRecord } from "src/asterix"
import { createPlaneLayer, getPlaneFeatures } from "./plane"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"

export const SPATIAL_REFERENCE = new SpatialReference({
  wkid: 102100,
})

export class ArcgisMap {
  map: EsriMap
  view: SceneView
  layer: FeatureLayer | null
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

    const track = new Track({
      view: this.view,
    })

    this.view.ui.add(track, "top-left")

    this.layer = null
    this.timeSlider = null
  }

  addLayer(layer: Layer) {
    this.map.add(layer)
  }

  async addDataRecords(records: DataRecord[]) {
    if (this.layer !== null) {
      this.map.remove(this.layer)
      this.layer.destroy()
    }
    if (this.timeSlider !== null) {
      this.view.ui.remove(this.timeSlider)
      this.timeSlider.destroy()
    }

    console.log(records[0])
    const features = getPlaneFeatures(records)
    console.log(features.slice(0, 10))
    this.layer = createPlaneLayer(features)
    this.map.add(this.layer)
    await this.view.whenLayerView(this.layer)

    this.timeSlider = new TimeSlider({
      container: "sliderDiv",
      view: this.view,
      mode: "time-window",
      timeVisible: true,
      stops: {
        interval: new TimeInterval({
          value: 1,
          unit: "seconds",
        }),
      },
      fullTimeExtent: this.layer.timeInfo.fullTimeExtent,
      timeExtent: new TimeExtent({
        start: this.layer.timeInfo.fullTimeExtent.start,
        end: this.layer.timeInfo.fullTimeExtent.start.getTime() + 10_000,
      }),
      playRate: 10,
    })
  }

  destroy() {
    this.view.destroy()
  }
}
