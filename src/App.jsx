import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";

import IconClusterLayer from "../icon-cluster-layer";

// Source data CSV
const DATA_URL = "/src/data/new_dataset_DSNS.json"; // eslint-disable-line

const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE = {
  longitude: 37.5434,
  latitude: 47.0971,
  zoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: 0,
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

function renderTooltip(info) {
  const { object, x, y } = info;

  if (info.objects) {
    return (
      <div className="tooltip interactive" style={{ left: x, top: y }}>
        {info.objects.map(({ name, year, mass, class: verificationClass, imageUrl }) => (
          <div key={name}>
            <h5>{name}</h5>
            {imageUrl && <img src={imageUrl} alt={`Image of ${name}`} style={{ maxWidth: "75px", height: "65px" }} />}
            <div>Year: {year || "unknown"}</div>
            <div>Verification: {verificationClass}</div>
            <div>Priority: {mass}</div>
          </div>
        ))}
      </div>
    );
  }

  if (!object) {
    return null;
  }

  return object.cluster ? (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.point_count} records
    </div>
  ) : (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.name} {object.year ? `(${object.year})` : ""}
    </div>
  );
}

/* eslint-disable react/no-deprecated */
export default function App({ data = DATA_URL, iconMapping = "/src/data/location-icon-mapping.json", iconAtlas = "/src/data/location-icon-atlas.png", showCluster = true, mapStyle = MAP_STYLE }) {
  const [hoverInfo, setHoverInfo] = useState({});

  const hideTooltip = () => {
    setHoverInfo({});
  };
  const expandTooltip = (info) => {
    if (info.picked && showCluster) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const layerProps = {
    data,
    pickable: true,
    getPosition: (d) => d.coordinates,
    iconAtlas,
    iconMapping,
    onHover: !hoverInfo.objects && setHoverInfo,
  };

  const layer = showCluster
    ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    : new IconLayer({
        ...layerProps,
        id: "icon",
        getIcon: (d) => "marker",
        sizeUnits: "meters",
        sizeScale: 2000,
        sizeMinPixels: 6,
      });

  return (
    <DeckGL layers={[layer]} views={MAP_VIEW} initialViewState={INITIAL_VIEW_STATE} controller={{ dragRotate: false }} onViewStateChange={hideTooltip} onClick={expandTooltip}>
      <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />

      {renderTooltip(hoverInfo)}
    </DeckGL>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
