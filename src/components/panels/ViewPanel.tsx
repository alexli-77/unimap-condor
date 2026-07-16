import { ChevronDown, Layers3 } from "lucide-react";
import { mapStyles } from "../../workspace/constants";
import type { MapStyleId, PointSize } from "../../workspace/types";

export function ViewPanel({
  mapStyle,
  onMapStyleChange,
  pointSize,
  onPointSizeChange,
  showFavoritesLayer,
  onShowFavoritesLayerChange,
  showUniversityLabels,
  onShowUniversityLabelsChange
}: {
  mapStyle: MapStyleId;
  onMapStyleChange: (value: MapStyleId) => void;
  pointSize: PointSize;
  onPointSizeChange: (value: PointSize) => void;
  showFavoritesLayer: boolean;
  onShowFavoritesLayerChange: (value: boolean) => void;
  showUniversityLabels: boolean;
  onShowUniversityLabelsChange: (value: boolean) => void;
}) {
  return (
    <section className="panel controls view-panel">
      <div className="panel-title">
        <Layers3 size={18} />
        <h2>View</h2>
      </div>

      <label>
        Map style
        <div className="select-wrap">
          <select
            value={mapStyle}
            onChange={(event) => onMapStyleChange(event.target.value as MapStyleId)}
          >
            {mapStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </label>

      <label>
        Point size
        <div className="segmented-control">
          {(["small", "normal", "large"] as PointSize[]).map((value) => (
            <button
              key={value}
              className={pointSize === value ? "active" : ""}
              type="button"
              onClick={() => onPointSizeChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </label>

      <label className="switch-row">
        <span>
          <strong>Saved stars</strong>
          <em>Show followed schools on the map.</em>
        </span>
        <input
          type="checkbox"
          checked={showFavoritesLayer}
          onChange={(event) => onShowFavoritesLayerChange(event.target.checked)}
        />
      </label>

      <label className="switch-row">
        <span>
          <strong>School labels</strong>
          <em>Display university names near points.</em>
        </span>
        <input
          type="checkbox"
          checked={showUniversityLabels}
          onChange={(event) => onShowUniversityLabelsChange(event.target.checked)}
        />
      </label>
    </section>
  );
}
