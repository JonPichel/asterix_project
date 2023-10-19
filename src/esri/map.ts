import EsriMap from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import Track from '@arcgis/core/widgets/Track'
import type Layer from '@arcgis/core/layers/Layer'

import { RADAR_BCN } from './locations'

// Load style
import '@arcgis/core/assets/esri/themes/dark/main.css'

export let map: EsriMap
export let view: SceneView

export const SPATIAL_REFERENCE = new SpatialReference({
  wkid: 102100
})

export function createMap() {
  map = new EsriMap({
    basemap: 'satellite',
    ground: 'world-elevation'
  })

  view = new SceneView({
    container: 'viewDiv',
    map: map,
    spatialReference: SPATIAL_REFERENCE,
    camera: RADAR_BCN,
  })
}

function initializeWidgets() {
  const track = new Track({
    view: view,
  })

  view.ui.add(track, "top-left")
}

export function destroyMap() {
  // This destroys any elements attached to the view (map, ui, popups...)
  // Likewise, map destroys its layers, graphics, etc.
  view.destroy()
}

export function addLayer(layer: Layer) {
  map.add(layer)
}