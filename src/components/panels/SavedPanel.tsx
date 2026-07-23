import {
  ArrowLeftRight,
  Download,
  FileText,
  Lock,
  Sparkles,
  Star,
  Upload
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  canImportExport,
  canUseCompare,
  FREE_MAX_SAVED_SCHOOLS,
  gateCopy,
  requiresAuthForSaved,
  upgradeCopy,
  WATERMARK_LABEL
} from "../../entitlements";
import { useWorkspace } from "../../state/workspaceContext";
import { applicationStatuses } from "../../workspace/constants";
import type { ApplicationStatus, FavoriteItem } from "../../workspace/types";

export function SavedPanel({
  onSelect,
  onCompare,
  onExportWorkspace,
  onExportShortlist,
  onImportWorkspace,
  onSignIn,
  workspaceMessage
}: {
  onSelect: (favorite: FavoriteItem) => void;
  onCompare: (universityId: number) => void;
  onExportWorkspace: () => void;
  onExportShortlist: () => void;
  onImportWorkspace: (file: File) => void;
  onSignIn: () => void;
  workspaceMessage: string;
}) {
  const { favorites, schoolDecisions, isPro, entitlements, accessTier, openProCard } =
    useWorkspace();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const schoolCount = favorites.filter((favorite) => favorite.kind === "school").length;
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus>("interested");
  const favoritesByStatus = useMemo(
    () =>
      applicationStatuses.map((status) => ({
        status,
        items: favorites.filter(
          (favorite) =>
            (schoolDecisions[favorite.universityId]?.status ?? "interested") === status.id
        )
      })),
    [favorites, schoolDecisions]
  );
  const populatedStatuses = favoritesByStatus.filter((group) => group.items.length);
  const fallbackStatus = populatedStatuses[0]?.status.id;
  const selectedGroup =
    populatedStatuses.find((group) => group.status.id === activeStatus) ??
    populatedStatuses[0];

  useEffect(() => {
    if (
      fallbackStatus &&
      !populatedStatuses.some((group) => group.status.id === activeStatus)
    ) {
      setActiveStatus(fallbackStatus);
    }
  }, [activeStatus, fallbackStatus, populatedStatuses]);

  // Tier 0 (signed out): the Saved panel shows a sign-in prompt instead of
  // content. Placed after the hooks so the hook order stays stable across
  // sign-in/out. Tier gates: import/export and Compare are Pro-only — kept
  // visible but locked so the value stays discoverable.
  const importExportUnlocked = canImportExport(accessTier);
  const compareUnlocked = canUseCompare(accessTier);

  if (requiresAuthForSaved(accessTier)) {
    return (
      <section className="panel saved-panel">
        <div className="panel-title">
          <Star size={18} />
          <h2>Saved</h2>
        </div>
        <div className="gate-signin-card">
          <Lock size={26} />
          <p>{gateCopy.signInForSaved}</p>
          <button className="primary-button" type="button" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel saved-panel">
      <div className="panel-title">
        <Star size={18} />
        <h2>Saved</h2>
        {!isPro && entitlements.maxSavedSchools !== null ? (
          <span
            className={`saved-count-pill ${
              schoolCount >= entitlements.maxSavedSchools ? "at-cap" : ""
            }`}
            title="Free plan saved-school limit"
          >
            {schoolCount}/{entitlements.maxSavedSchools} schools
          </span>
        ) : null}
      </div>
      <div className="workspace-backup-card">
        <div>
          <strong>Local workspace</strong>
          <span>
            Saved only in this browser. Export a backup before switching address or
            device.
          </span>
        </div>
        <div className="workspace-backup-actions">
          <button
            className={`ghost-button ${importExportUnlocked ? "" : "locked"}`}
            type="button"
            title={importExportUnlocked ? undefined : gateCopy.importExportLocked}
            onClick={importExportUnlocked ? onExportWorkspace : openProCard}
          >
            {importExportUnlocked ? <Download size={15} /> : <Lock size={15} />}
            Export
          </button>
          <button
            className={`ghost-button ${importExportUnlocked ? "" : "locked"}`}
            type="button"
            title={importExportUnlocked ? undefined : gateCopy.importExportLocked}
            onClick={
              importExportUnlocked ? () => importInputRef.current?.click() : openProCard
            }
          >
            {importExportUnlocked ? <Upload size={15} /> : <Lock size={15} />}
            Import
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportWorkspace(file);
              event.currentTarget.value = "";
            }}
          />
        </div>
        {workspaceMessage ? <p>{workspaceMessage}</p> : null}
      </div>
      <div className="workspace-backup-card shortlist-export-card">
        <div>
          <strong>Shareable shortlist</strong>
          <span>
            Export a printable HTML shortlist grouped by decision status, with fit grades
            and your next actions.
          </span>
        </div>
        <div className="workspace-backup-actions">
          <button
            className="primary-button"
            type="button"
            onClick={onExportShortlist}
            disabled={!schoolCount}
          >
            <FileText size={15} />
            Export shortlist (HTML)
          </button>
        </div>
        {!schoolCount ? <p>Save at least one school to export a shortlist.</p> : null}
        {entitlements.shortlistWatermark ? (
          <p className="export-watermark-note">
            Free exports carry a small &ldquo;{WATERMARK_LABEL}&rdquo; mark.{" "}
            {upgradeCopy.shortlistWatermark}
          </p>
        ) : null}
      </div>
      {!favorites.length ? (
        <p className="muted">Star a university, subject, or advisor to show it here.</p>
      ) : (
        <>
          <div
            className="saved-tabs"
            role="tablist"
            aria-label="Saved application status"
          >
            {populatedStatuses.map((group) => (
              <button
                key={group.status.id}
                className={selectedGroup?.status.id === group.status.id ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={selectedGroup?.status.id === group.status.id}
                onClick={() => setActiveStatus(group.status.id)}
              >
                <span>{group.status.label}</span>
                <em>{group.items.length}</em>
              </button>
            ))}
          </div>
          {selectedGroup && (
            <div className="saved-list" role="tabpanel">
              {selectedGroup.items.map((favorite) => {
                const decision = schoolDecisions[favorite.universityId];
                return (
                  <div key={favorite.id} className="saved-item-row">
                    <button
                      className="saved-item"
                      type="button"
                      onClick={() => onSelect(favorite)}
                    >
                      <Star size={17} fill="currentColor" />
                      <span>
                        <strong>{favorite.label}</strong>
                        <em>
                          {favorite.kind} · {favorite.universityName}
                        </em>
                        {decision?.nextAction ? (
                          <small>Next: {decision.nextAction}</small>
                        ) : null}
                      </span>
                    </button>
                    {favorite.kind === "school" ? (
                      <button
                        className={`saved-compare-button ${
                          compareUnlocked ? "" : "locked"
                        }`}
                        type="button"
                        title={
                          compareUnlocked ? "Add to compare" : gateCopy.compareLocked
                        }
                        aria-label={
                          compareUnlocked
                            ? `Add ${favorite.universityName} to compare`
                            : gateCopy.compareLocked
                        }
                        onClick={() =>
                          compareUnlocked
                            ? onCompare(favorite.universityId)
                            : openProCard()
                        }
                      >
                        {compareUnlocked ? (
                          <ArrowLeftRight size={15} />
                        ) : (
                          <Lock size={15} />
                        )}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {!isPro ? (
        <button
          type="button"
          className="pro-upsell-row"
          onClick={openProCard}
          title={`Free plan tracks up to ${FREE_MAX_SAVED_SCHOOLS} schools`}
        >
          <Sparkles size={15} />
          <span>
            <strong>{upgradeCopy.proCta}</strong>
            <em>Unlimited saves · compare 6 · watermark-free exports</em>
          </span>
        </button>
      ) : null}
    </section>
  );
}
