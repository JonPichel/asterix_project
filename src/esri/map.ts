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

import PlaneLayer, { Aircraft } from "./PlaneLayer"
import TimeExtent from "@arcgis/core/TimeExtent"

export const SPATIAL_REFERENCE = new SpatialReference({
  wkid: 102100,
})

export class ArcgisMap {
  map: EsriMap
  view: SceneView
  planeLayer: PlaneLayer
  timeSlider: TimeSlider
  timeSliderWatchHandle: __esri.WatchHandle | null

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

    //this.timeSlider = null
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
    this.timeSliderWatchHandle = null
  }

  addLayer(layer: Layer) {
    this.map.add(layer)
  }

  async addAircrafts(aircrafts: Aircraft[]) {
    this.timeSlider.stop()
    this.timeSliderWatchHandle = this.timeSlider.watch("timeExtent", () => {
      requestAnimationFrame(() =>
        this.planeLayer.update(this.timeSlider!.timeExtent.start.getTime())
      )
    })

    const timeExtent = this.planeLayer.loadData(aircrafts)
    this.timeSlider.fullTimeExtent = timeExtent
    this.timeSlider.timeExtent = new TimeExtent({
      start: timeExtent.start,
    })
  }

  clear() {
    if (this.timeSlider !== null) {
      this.timeSlider.stop()
      this.timeSliderWatchHandle?.remove()
    }
    this.planeLayer.clear()
  }

  destroy() {
    this.view.destroy()
  }

  setSpeed(speedFactor: number) {
    if (this.timeSlider !== null) {
      this.timeSlider.stops = {
        interval: new TimeInterval({
          value: 10 * speedFactor,
          unit: "seconds",
        }),
      }
    }
  }

  togglePath() {
    this.planeLayer.togglePaths()
  }
}
