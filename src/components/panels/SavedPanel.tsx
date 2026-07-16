import { ArrowLeftRight, Download, FileText, Star, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWorkspace } from "../../state/workspaceContext";
import { applicationStatuses } from "../../workspace/constants";
import type { ApplicationStatus, FavoriteItem } from "../../workspace/types";

export function SavedPanel({
  onSelect,
  onCompare,
  onExportWorkspace,
  onExportShortlist,
  onImportWorkspace,
  workspaceMessage
}: {
  onSelect: (favorite: FavoriteItem) => void;
  onCompare: (universityId: number) => void;
  onExportWorkspace: () => void;
  onExportShortlist: () => void;
  onImportWorkspace: (file: File) => void;
  workspaceMessage: string;
}) {
  const { favorites, schoolDecisions } = useWorkspace();
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

  return (
    <section className="panel saved-panel">
      <div className="panel-title">
        <Star size={18} />
        <h2>Saved</h2>
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
          <button className="ghost-button" type="button" onClick={onExportWorkspace}>
            <Download size={15} />
            Export
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => importInputRef.current?.click()}
          >
            <Upload size={15} />
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
                        className="saved-compare-button"
                        type="button"
                        title="Add to compare"
                        aria-label={`Add ${favorite.universityName} to compare`}
                        onClick={() => onCompare(favorite.universityId)}
                      >
                        <ArrowLeftRight size={15} />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
