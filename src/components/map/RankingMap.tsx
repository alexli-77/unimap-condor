import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef } from "react";
import type { RankingFeature } from "../../types";
import { mapStyles } from "../../workspace/constants";
import { getPointSizeScale } from "../../workspace/helpers";
import type { MapStyleId, Mode, PointSize } from "../../workspace/types";

export function RankingMap({
  features,
  favoriteFeatures,
  showFavoritesLayer,
  showUniversityLabels,
  pointSize,
  mode,
  mapStyle,
  selectedId,
  onSelect
}: {
  features: RankingFeature[];
  favoriteFeatures: RankingFeature[];
  showFavoritesLayer: boolean;
  showUniversityLabels: boolean;
  pointSize: PointSize;
  mode: Mode;
  mapStyle: MapStyleId;
  selectedId?: number;
  onSelect: (feature: RankingFeature) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const featureRef = useRef<RankingFeature[]>([]);
  const favoriteFeatureRef = useRef<RankingFeature[]>([]);
  const modeRef = useRef<Mode>(mode);
  const mapStyleRef = useRef<MapStyleId>(mapStyle);
  const showFavoritesLayerRef = useRef(showFavoritesLayer);
  const showUniversityLabelsRef = useRef(showUniversityLabels);
  const pointSizeRef = useRef<PointSize>(pointSize);

  useEffect(() => {
    featureRef.current = features;
  }, [features]);

  useEffect(() => {
    favoriteFeatureRef.current = favoriteFeatures;
  }, [favoriteFeatures]);

  useEffect(() => {
    showFavoritesLayerRef.current = showFavoritesLayer;
  }, [showFavoritesLayer]);

  useEffect(() => {
    showUniversityLabelsRef.current = showUniversityLabels;
  }, [showUniversityLabels]);

  useEffect(() => {
    pointSizeRef.current = pointSize;
  }, [pointSize]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyles.find((style) => style.id === mapStyle)?.url ?? mapStyles[0].url,
      center: [10, 25],
      zoom: 1.15,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    function paintColorExpression() {
      return [
        "case",
        ["==", ["get", "universityId"], -1],
        "#111827",
        modeRef.current === "strength" ? "#059669" : "#2563eb"
      ] as maplibregl.ExpressionSpecification;
    }

    function pointRadiusExpression() {
      const scale = getPointSizeScale(pointSizeRef.current);
      return [
        "interpolate",
        ["linear"],
        ["coalesce", ["get", "rankValue"], ["get", "topSubjectRankValue"], 500],
        1,
        9 * scale,
        100,
        7 * scale,
        500,
        5 * scale,
        1000,
        4 * scale
      ] as maplibregl.ExpressionSpecification;
    }

    function clusterRadiusExpression() {
      const scale = getPointSizeScale(pointSizeRef.current);
      return [
        "step",
        ["get", "point_count"],
        18 * scale,
        50,
        24 * scale,
        150,
        32 * scale
      ] as maplibregl.ExpressionSpecification;
    }

    function ensureRankingLayers() {
      if (!map.getSource("rankings")) {
        map.addSource("rankings", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          cluster: true,
          clusterRadius: 44,
          clusterMaxZoom: 5
        });
      }

      if (!map.getSource("favorites")) {
        map.addSource("favorites", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }

      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "rankings",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#0f172a",
            "circle-radius": clusterRadiusExpression(),
            "circle-opacity": 0.86
          }
        });
      }

      if (!map.getLayer("cluster-count")) {
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "rankings",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-size": 12
          },
          paint: { "text-color": "#fff" }
        });
      }

      if (!map.getLayer("points")) {
        map.addLayer({
          id: "points",
          type: "circle",
          source: "rankings",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": paintColorExpression(),
            "circle-radius": pointRadiusExpression(),
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.92
          }
        });
      }

      if (!map.getLayer("university-labels")) {
        map.addLayer({
          id: "university-labels",
          type: "symbol",
          source: "rankings",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "text-field": ["get", "universityName"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 6, 12],
            "text-offset": [0, 1.05],
            "text-anchor": "top",
            "text-max-width": 12,
            visibility: showUniversityLabelsRef.current ? "visible" : "none"
          },
          paint: {
            "text-color": "#172033",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.4
          }
        });
      }

      if (!map.getLayer("favorite-stars")) {
        map.addLayer({
          id: "favorite-stars",
          type: "symbol",
          source: "favorites",
          layout: {
            "text-allow-overlap": true,
            "text-field": "★",
            "text-ignore-placement": true,
            "text-offset": [0, -0.9],
            "text-size": ["interpolate", ["linear"], ["zoom"], 1, 18, 6, 26],
            visibility: showFavoritesLayerRef.current ? "visible" : "none"
          },
          paint: {
            "text-color": "#f59e0b",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2
          }
        });
      }

      const rankingsSource = map.getSource("rankings") as maplibregl.GeoJSONSource;
      rankingsSource.setData({
        type: "FeatureCollection",
        features: featureRef.current
      });
      const favoritesSource = map.getSource("favorites") as maplibregl.GeoJSONSource;
      favoritesSource.setData({
        type: "FeatureCollection",
        features: favoriteFeatureRef.current
      });
    }

    map.on("load", () => {
      ensureRankingLayers();
    });

    map.on("style.load", () => {
      ensureRankingLayers();
    });

    map.on("click", "points", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find(
        (item) => item.properties.universityId === id
      );
      if (feature) onSelect(feature);
    });

    map.on("click", "favorite-stars", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find(
        (item) => item.properties.universityId === id
      );
      if (feature) onSelect(feature);
    });

    map.on("click", "university-labels", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find(
        (item) => item.properties.universityId === id
      );
      if (feature) onSelect(feature);
    });

    map.on("click", "clusters", async (event) => {
      const featuresAtPoint = map.queryRenderedFeatures(event.point, {
        layers: ["clusters"]
      });
      const clusterId = featuresAtPoint[0]?.properties?.cluster_id;
      const source = map.getSource("rankings") as maplibregl.GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(clusterId);
      map.easeTo({ center: event.lngLat, zoom });
    });

    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "favorite-stars", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "favorite-stars", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "university-labels", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "university-labels", () => {
      map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const styleUrl =
      mapStyles.find((style) => style.id === mapStyle)?.url ?? mapStyles[0].url;
    if (!map || mapStyleRef.current === mapStyle) return;
    mapStyleRef.current = mapStyle;
    map.setStyle(styleUrl, { diff: false });
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const source = map.getSource("rankings") as maplibregl.GeoJSONSource | undefined;
      source?.setData({ type: "FeatureCollection", features });
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const source = map.getSource("favorites") as maplibregl.GeoJSONSource | undefined;
      source?.setData({ type: "FeatureCollection", features: favoriteFeatures });
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [favoriteFeatures]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      if (map.getLayer("favorite-stars")) {
        map.setLayoutProperty(
          "favorite-stars",
          "visibility",
          showFavoritesLayer ? "visible" : "none"
        );
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [showFavoritesLayer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      if (map.getLayer("university-labels")) {
        map.setLayoutProperty(
          "university-labels",
          "visibility",
          showUniversityLabels ? "visible" : "none"
        );
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [showUniversityLabels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const scale = getPointSizeScale(pointSize);
    const pointRadius = [
      "interpolate",
      ["linear"],
      ["coalesce", ["get", "rankValue"], ["get", "topSubjectRankValue"], 500],
      1,
      9 * scale,
      100,
      7 * scale,
      500,
      5 * scale,
      1000,
      4 * scale
    ] as maplibregl.ExpressionSpecification;
    const clusterRadius = [
      "step",
      ["get", "point_count"],
      18 * scale,
      50,
      24 * scale,
      150,
      32 * scale
    ] as maplibregl.ExpressionSpecification;
    const update = () => {
      if (map.getLayer("points")) {
        map.setPaintProperty("points", "circle-radius", pointRadius);
      }
      if (map.getLayer("clusters")) {
        map.setPaintProperty("clusters", "circle-radius", clusterRadius);
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [pointSize]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("points")) return;
    map.setPaintProperty("points", "circle-color", [
      "case",
      ["==", ["get", "universityId"], -1],
      "#111827",
      mode === "strength" ? "#059669" : "#2563eb"
    ]);
  }, [mode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const feature = features.find((item) => item.properties.universityId === selectedId);
    if (!feature) return;
    const [longitude, latitude] = feature.geometry.coordinates;
    map.easeTo({ center: [longitude, latitude], zoom: Math.max(map.getZoom(), 4) });
  }, [features, selectedId]);

  return <div ref={containerRef} className="map" />;
}
