import Graphic from "@arcgis/core/Graphic"
import Point from "@arcgis/core/geometry/Point"

import { DataRecord } from "src/asterix"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { SPATIAL_REFERENCE } from "./map"
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer"
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol"
import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable"

export function createPlaneLayer(features: Graphic[]): FeatureLayer {
  const layer = new FeatureLayer({
    id: "planes",
    title: "Planes",
    spatialReference: SPATIAL_REFERENCE,
    renderer: new SimpleRenderer({
      symbol: new PictureMarkerSymbol({
        url: "assets/plane-black.svg",
        width: 20,
        height: 20,
        angle: 270,
      }),
      visualVariables: [
        new RotationVariable({
          field: "heading",
          rotationType: "geographic",
        }),
      ],
    }),
    objectIdField: "ObjectID",
    source: features,
    fields: [
      {
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid",
      },
      {
        name: "targetID",
        type: "string",
      },
      {
        name: "heading",
        type: "double",
      },
      {
        name: "timestamp1",
        type: "date",
      },
      {
        name: "timestamp2",
        type: "date",
      },
    ],
    timeInfo: {
      startField: "timestamp1",
      endField: "timestamp2",
      interval: {
        value: 1,
        unit: "seconds",
      },
    },
    popupTemplate: {
      title: "{targetID}",
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
              fieldName: "targetID",
              label: "Target ID",
              visible: true,
            },
            {
              fieldName: "timestamp1",
              label: "timestamp",
              visible: true,
            },
          ],
        },
      ],
    },
  })

  return layer
}

export function getPlaneFeatures(dataRecords: DataRecord[]): Graphic[] {
  const features: Graphic[] = []

  for (const record of dataRecords) {
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

    features.push(
      new Graphic({
        geometry: new Point({
          latitude: coords.lat,
          longitude: coords.lon,
          z: coords.alt,
          hasZ: true,
        }),
        attributes: {
          targetID: aircraftID,
          heading: 0,
          timestamp1: record.timestamp!,
          timestamp2: record.timestamp!,
        },
      })
    )
  }

  return features
}
