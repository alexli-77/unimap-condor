import { ArrowLeftRight, ChevronDown, ExternalLink, MapPin, X } from "lucide-react";
import { useState } from "react";
import type { RankingFeature } from "../../types";
import { useWorkspace } from "../../state/workspaceContext";
import { applicationStatuses, detailTabs } from "../../workspace/constants";
import {
  createFavoriteItem,
  getDefaultSchoolDecision,
  getGoogleMapsUrl,
  getStatusMeta
} from "../../workspace/helpers";
import type {
  DetailTab,
  Mode,
  SchoolDecision,
  SchoolDecisionPatch
} from "../../workspace/types";
import { FavoriteButton } from "../ui";
import { CommunityPanel } from "./tabs/CommunityPanel";
import { DecisionPanel } from "./tabs/DecisionPanel";
import { FacultyPanel } from "./tabs/FacultyPanel";
import { OverviewPanel } from "./tabs/OverviewPanel";
import { RankingsPanel } from "./tabs/RankingsPanel";
import { RecommendationsPanel } from "./tabs/RecommendationsPanel";
import { ResearchPanel } from "./tabs/ResearchPanel";

export function UniversityCard({
  feature,
  mode,
  onClose,
  onCompare
}: {
  feature: RankingFeature;
  mode: Mode;
  onClose: () => void;
  onCompare: () => void;
}) {
  const { isFavorite, toggleFavorite, schoolDecisions, saveSchoolDecision } =
    useWorkspace();
  const p = feature.properties;
  const [tab, setTab] = useState<DetailTab>("overview");
  const schoolFavorite = createFavoriteItem(feature, "school", p.universityName);
  const decision =
    schoolDecisions[p.universityId] ?? getDefaultSchoolDecision(p.universityId);
  const onDecisionChange = (patch: SchoolDecisionPatch) =>
    saveSchoolDecision(feature, patch);

  return (
    <section className="panel selected-card">
      <button className="icon-button close" aria-label="Close details" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="eyebrow">
        <MapPin size={15} />
        {p.city}, {p.country}
      </div>
      <div className="selected-title-row">
        <h2>{p.universityName}</h2>
        <FavoriteButton
          active={isFavorite("school", p.universityId, p.universityName)}
          label="学校"
          onClick={() => toggleFavorite(schoolFavorite)}
        />
      </div>
      <p className="muted">{p.rankingGroundTruthUniversityName ?? p.universityName}</p>

      <SchoolDecisionPanel decision={decision} onChange={onDecisionChange} />

      <div className="detail-tabs" role="tablist" aria-label="University detail sections">
        {detailTabs.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewPanel feature={feature} />}
      {tab === "decision" && <DecisionPanel feature={feature} decision={decision} />}
      {tab === "rankings" && <RankingsPanel feature={feature} mode={mode} />}
      {tab === "research" && <ResearchPanel feature={feature} />}
      {tab === "faculty" && <FacultyPanel feature={feature} />}
      {tab === "recommendations" && <RecommendationsPanel feature={feature} />}
      {tab === "community" && <CommunityPanel feature={feature} />}

      <div className="button-row">
        <button className="primary-button" onClick={onCompare}>
          <ArrowLeftRight size={16} />
          Add to compare
        </button>
        <a
          className="ghost-button"
          href={getGoogleMapsUrl(feature)}
          target="_blank"
          rel="noreferrer"
        >
          Maps
          <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
}

function SchoolDecisionPanel({
  decision,
  onChange
}: {
  decision: SchoolDecision;
  onChange: (patch: SchoolDecisionPatch) => void;
}) {
  const status = getStatusMeta(decision.status);

  return (
    <details className={`application-workflow status-${decision.status}`}>
      <summary className="workflow-head">
        <div>
          <strong>Application workflow</strong>
          <span>{status.description}</span>
        </div>
        <div className="workflow-summary-actions">
          <div className="status-pill">{status.label}</div>
          <ChevronDown className="workflow-chevron" size={16} />
        </div>
      </summary>

      <div className="workflow-body">
        <label>
          Status
          <div className="select-wrap">
            <select
              value={decision.status}
              onChange={(event) =>
                onChange({ status: event.target.value as SchoolDecision["status"] })
              }
            >
              {applicationStatuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </label>

        <div className="workflow-fields">
          <label>
            Why keep
            <textarea
              value={decision.keepReason}
              onChange={(event) => onChange({ keepReason: event.target.value })}
              placeholder="Strong CS ranking, Montreal, possible supervisor fit"
            />
          </label>
          <label>
            Why exclude
            <textarea
              value={decision.rejectReason}
              onChange={(event) => onChange({ rejectReason: event.target.value })}
              placeholder="Funding unclear, city mismatch, weak program fit"
            />
          </label>
          <label>
            Next action
            <input
              value={decision.nextAction}
              onChange={(event) => onChange({ nextAction: event.target.value })}
              placeholder="Check tuition, read lab pages, email professor"
            />
          </label>
        </div>
      </div>
    </details>
  );
}
