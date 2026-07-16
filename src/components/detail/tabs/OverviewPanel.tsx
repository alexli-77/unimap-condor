import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import type { OpenDataProfile, PreferenceProfile, RankingFeature } from "../../../types";
import { useOpenDataProfile } from "../../../hooks/useOpenDataProfile";
import { useWorkspace } from "../../../state/workspaceContext";
import {
  buildFitSignals,
  formatPriority,
  formatSourceBadge,
  getPreferenceSignals,
  hasPreferenceProfile
} from "../../../workspace/helpers";
import { ExternalChip, Fact, InlineLoading } from "../../ui";

export function OverviewPanel({ feature }: { feature: RankingFeature }) {
  const { preferenceProfile } = useWorkspace();
  const p = feature.properties;
  const { profile: openProfile, loading } = useOpenDataProfile(feature);

  return (
    <div className="tab-panel">
      <div className="fact-grid">
        <Fact label="City" value={p.city} />
        <Fact label="Country" value={p.country} />
        <Fact label="Established" value={openProfile?.established ?? "n/a"} />
        <Fact
          label="Research registry"
          value={openProfile?.rorId ? "Verified in ROR" : "n/a"}
        />
      </div>

      <FitSignalPanel
        feature={feature}
        preferenceProfile={preferenceProfile}
        openDataProfile={openProfile}
      />
      <PreferenceSignalPanel profile={preferenceProfile} />

      {loading && <InlineLoading label="Loading open data" />}
      {!loading && openProfile?.aliases.length ? (
        <div className="tag-cloud">
          {openProfile.aliases.map((alias) => (
            <span key={alias}>{alias}</span>
          ))}
        </div>
      ) : null}

      <div className="link-grid">
        {openProfile?.homepageUrl && (
          <ExternalChip href={openProfile.homepageUrl} label="Official site" />
        )}
        {openProfile?.wikipediaUrl && (
          <ExternalChip href={openProfile.wikipediaUrl} label="Wikipedia" />
        )}
        {openProfile?.wikidataId && (
          <ExternalChip
            href={`https://www.wikidata.org/wiki/${openProfile.wikidataId}`}
            label="Wikidata"
          />
        )}
        {openProfile?.rorId && (
          <ExternalChip href={openProfile.rorId} label="ROR profile" />
        )}
      </div>
    </div>
  );
}

function FitSignalPanel({
  feature,
  preferenceProfile,
  openDataProfile
}: {
  feature: RankingFeature;
  preferenceProfile: PreferenceProfile;
  openDataProfile?: OpenDataProfile | null;
}) {
  const hasProfile = hasPreferenceProfile(preferenceProfile);
  const sourceBadge = formatSourceBadge(feature.properties.sourceName);
  const signals = useMemo(
    () => buildFitSignals(feature, preferenceProfile, openDataProfile),
    [feature, preferenceProfile, openDataProfile]
  );

  if (!hasProfile) {
    return (
      <details className="fit-card fit-empty">
        <summary className="fit-head">
          <div>
            <strong>Fit signals</strong>
          </div>
          <div className="fit-summary-actions">
            <span>No profile</span>
            <ChevronDown className="fit-chevron" size={16} />
          </div>
        </summary>
        <p className="muted">
          Open Prefs first. Fit signals need your location, subject, budget, and
          priorities.
        </p>
      </details>
    );
  }

  return (
    <details className={`fit-card fit-${signals.level}`}>
      <summary className="fit-head">
        <div>
          <strong>{signals.label}</strong>
        </div>
        <div className="fit-summary-actions">
          <span>{sourceBadge}</span>
          <ChevronDown className="fit-chevron" size={16} />
        </div>
      </summary>

      <div className="fit-body">
        <p className="fit-summary">{signals.summary}</p>

        <div className="fit-section">
          <h4>Matched</h4>
          {signals.matched.length ? (
            <ul>
              {signals.matched.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No strong match found yet.</p>
          )}
        </div>

        <div className="fit-section">
          <h4>Risks</h4>
          {signals.risks.length ? (
            <ul>
              {signals.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No obvious risk from connected data.</p>
          )}
        </div>

        <div className="fit-section">
          <h4>Missing info</h4>
          <ul>
            {signals.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="fit-next">
          <strong>Next</strong>
          <span>{signals.nextAction}</span>
        </div>
      </div>
    </details>
  );
}

function PreferenceSignalPanel({ profile }: { profile: PreferenceProfile }) {
  const signals = getPreferenceSignals(profile);
  const hasProfile = hasPreferenceProfile(profile);
  const flexibility = [
    profile.acceptsSmallCities && "small cities",
    profile.acceptsCourseBased && "course-based",
    profile.acceptsNichePrograms && "niche programs"
  ].filter(Boolean);

  return (
    <div className="preference-signal-card">
      <div className="preference-signal-head">
        <strong>Profile signals</strong>
        <span>{hasProfile ? "Ready for fit scoring" : "No profile yet"}</span>
      </div>
      {hasProfile ? (
        <>
          <div className="signal-list">
            {signals.slice(0, 7).map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
          <div className="priority-grid">
            <Fact label="Employment" value={formatPriority(profile.employmentPriority)} />
            <Fact label="Research" value={formatPriority(profile.researchPriority)} />
            <Fact
              label="Immigration"
              value={formatPriority(profile.immigrationPriority)}
            />
          </div>
          {flexibility.length ? (
            <p className="muted">Open to {flexibility.join(", ")}.</p>
          ) : null}
        </>
      ) : (
        <p className="muted">
          Open Prefs to add your location, budget, background, and priorities.
        </p>
      )}
    </div>
  );
}
