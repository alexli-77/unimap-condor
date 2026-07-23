import {
  ArrowLeftRight,
  ChevronDown,
  ExternalLink,
  Lock,
  MapPin,
  Sparkles,
  X
} from "lucide-react";
import { useState } from "react";
import type { RankingFeature } from "../../types";
import {
  canUseCompare,
  gateCopy,
  isDetailTabLocked,
  requiresAuthForDetails,
  upgradeCopy
} from "../../entitlements";
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
  onCompare,
  onSignIn
}: {
  feature: RankingFeature;
  mode: Mode;
  onClose: () => void;
  onCompare: () => void;
  onSignIn: () => void;
}) {
  const {
    isFavorite,
    toggleFavorite,
    schoolDecisions,
    saveSchoolDecision,
    accessTier,
    openProCard
  } = useWorkspace();
  const p = feature.properties;
  const [tab, setTab] = useState<DetailTab>("overview");
  const schoolFavorite = createFavoriteItem(feature, "school", p.universityName);
  const decision =
    schoolDecisions[p.universityId] ?? getDefaultSchoolDecision(p.universityId);
  const onDecisionChange = (patch: SchoolDecisionPatch) =>
    saveSchoolDecision(feature, patch);
  const compareUnlocked = canUseCompare(accessTier);

  // Tier 0 (signed out): the panel opens, but instead of the tab UI it shows a
  // sign-in prompt so visitors only get map + pins + search.
  if (requiresAuthForDetails(accessTier)) {
    return (
      <section className="panel selected-card">
        <button
          className="icon-button close"
          aria-label="Close details"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="eyebrow">
          <MapPin size={15} />
          {p.city}, {p.country}
        </div>
        <div className="selected-title-row">
          <h2>{p.universityName}</h2>
        </div>
        <div className="gate-signin-card">
          <Lock size={26} />
          <p>{gateCopy.signInForDetails}</p>
          <button className="primary-button" type="button" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </section>
    );
  }

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
        <button
          className={`title-compare-button ${compareUnlocked ? "" : "locked"}`}
          type="button"
          title={compareUnlocked ? "Add to compare" : gateCopy.compareLocked}
          aria-label={
            compareUnlocked
              ? `Add ${p.universityName} to compare`
              : gateCopy.compareLocked
          }
          onClick={onCompare}
        >
          {compareUnlocked ? <ArrowLeftRight size={13} /> : <Lock size={13} />}
          Compare
        </button>
      </div>
      <p className="muted">{p.rankingGroundTruthUniversityName ?? p.universityName}</p>

      <SchoolDecisionPanel decision={decision} onChange={onDecisionChange} />

      <div className="detail-tabs" role="tablist" aria-label="University detail sections">
        {detailTabs.map((item) => {
          const locked = isDetailTabLocked(accessTier, item.id);
          return (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              title={locked ? gateCopy.lockedTabTitle : undefined}
              onClick={() => setTab(item.id)}
            >
              {locked && <Lock className="tab-lock" size={11} />}
              {item.label}
            </button>
          );
        })}
      </div>

      {isDetailTabLocked(accessTier, tab) ? (
        <LockedTabCard onOpenPro={openProCard} />
      ) : (
        <>
          {tab === "overview" && <OverviewPanel feature={feature} />}
          {tab === "decision" && <DecisionPanel feature={feature} decision={decision} />}
          {tab === "rankings" && <RankingsPanel feature={feature} mode={mode} />}
          {tab === "research" && <ResearchPanel feature={feature} />}
          {tab === "faculty" && <FacultyPanel feature={feature} />}
          {tab === "recommendations" && <RecommendationsPanel feature={feature} />}
          {tab === "community" && <CommunityPanel feature={feature} />}
        </>
      )}

      <div className="button-row single">
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

// Compact inline variant of the Pro upsell, shown in place of a locked tab's
// content. Styling mirrors ProUpgradeCard / .pro-upsell-row so the pitch stays
// visually consistent.
function LockedTabCard({ onOpenPro }: { onOpenPro: () => void }) {
  return (
    <div className="pro-locked-card">
      <span className="pro-card-badge">
        <Sparkles size={15} />
        Pro
      </span>
      <strong>{gateCopy.lockedTabTitle}</strong>
      <p>{gateCopy.lockedTabBody}</p>
      <button className="primary-button" type="button" onClick={onOpenPro}>
        {upgradeCopy.proCta}
      </button>
    </div>
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
