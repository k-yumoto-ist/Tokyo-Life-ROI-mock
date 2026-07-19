import { useEffect, useRef } from "react";
import L from "leaflet";
import { questCategoryLabels, type QuestSpot, type QuestSpotCategory } from "../../data/questMapData";

type MapLocation = { latitude: number; longitude: number };

type QuestMapCanvasProps = {
  location: MapLocation;
  focusKey: number;
  spots: QuestSpot[];
  questSpotIds: string[];
  lockedSpotIds: string[];
  visitedSpotIds: string[];
  selectedSpotId?: string;
  activeSpotId?: string;
  onSpotSelect: (spot: QuestSpot) => void;
};

const categoryMarks: Record<QuestSpotCategory, string> = {
  learning: "学",
  family: "家",
  nature: "自",
  culture: "文",
  health: "健",
  public: "公",
  food: "食",
};

export function QuestMapCanvas({
  location,
  focusKey,
  spots,
  questSpotIds,
  lockedSpotIds,
  visitedSpotIds,
  selectedSpotId,
  activeSpotId,
  onSpotSelect,
}: QuestMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const onSpotSelectRef = useRef(onSpotSelect);

  onSpotSelectRef.current = onSpotSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView([location.latitude, location.longitude], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 0);
    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([location.latitude, location.longitude], Math.max(map.getZoom(), 12), { animate: true });
  }, [focusKey, location.latitude, location.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const locationIcon = L.divIcon({
      className: "quest-map-div-icon",
      html: '<span class="quest-map-current-dot"><i></i></span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    L.marker([location.latitude, location.longitude], { icon: locationIcon, zIndexOffset: 1000 }).addTo(layer).bindTooltip("現在地", { direction: "top" });

    spots.forEach((spot) => {
      const isQuest = questSpotIds.includes(spot.id);
      const isLocked = lockedSpotIds.includes(spot.id);
      const isVisited = visitedSpotIds.includes(spot.id);
      const isSelected = selectedSpotId === spot.id;
      const isActive = activeSpotId === spot.id;
      const stateClass = isActive ? "is-active" : isSelected ? "is-selected" : isLocked ? "is-locked" : isQuest ? "is-quest" : isVisited ? "is-visited" : "";
      const officialClass = spot.officialRecommended ? "is-official" : "";
      const markerIcon = L.divIcon({
        className: "quest-map-div-icon",
        html: `<button class="quest-map-marker category-${spot.category} ${stateClass} ${officialClass}" aria-label="${spot.name}・${questCategoryLabels[spot.category]}"><span>${isLocked ? "?" : categoryMarks[spot.category]}</span>${isQuest ? "<i>Q</i>" : ""}</button>`,
        iconSize: [42, 48],
        iconAnchor: [21, 42],
      });
      const marker = L.marker([spot.latitude, spot.longitude], { icon: markerIcon, zIndexOffset: isQuest || isSelected ? 600 : 0 }).addTo(layer);
      marker.bindTooltip(spot.name, { direction: "top", offset: [0, -30] });
      marker.on("click", () => onSpotSelectRef.current(spot));
    });

    if (routeLayerRef.current) {
      routeLayerRef.current.removeFrom(map);
      routeLayerRef.current = null;
    }
    const activeSpot = spots.find((spot) => spot.id === activeSpotId);
    if (activeSpot) {
      routeLayerRef.current = L.polyline(
        [[location.latitude, location.longitude], [activeSpot.latitude, activeSpot.longitude]],
        { color: "#1685c8", weight: 5, opacity: 0.82, dashArray: "8 9" },
      ).addTo(map);
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 90], maxZoom: 13 });
    }
  }, [activeSpotId, location.latitude, location.longitude, lockedSpotIds, questSpotIds, selectedSpotId, spots, visitedSpotIds]);

  return <div ref={containerRef} className="quest-map-canvas" role="application" aria-label="東京都内のクエスト地図" />;
}
