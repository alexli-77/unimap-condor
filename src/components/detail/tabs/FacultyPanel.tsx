import { useEffect, useState } from "react";
import { api } from "../../../api";
import type {
  FacultyDepartmentSummary,
  FacultyDirectoryEntry,
  FacultyDirectoryPage,
  FacultyDirectorySummary,
  RankingFeature
} from "../../../types";
import { useWorkspace } from "../../../state/workspaceContext";
import { facultyPageSize } from "../../../workspace/constants";
import { createFavoriteItem } from "../../../workspace/helpers";
import { SchoolDataFallback } from "../../SchoolDataFallback";
import { ExternalChip, FavoriteButton, InlineLoading } from "../../ui";

export function FacultyPanel({ feature }: { feature: RankingFeature }) {
  const p = feature.properties;
  const [summary, setSummary] = useState<FacultyDirectorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api
      .getFacultyDirectorySummary(p.universityName, controller.signal)
      .then(setSummary)
      .catch((err) => {
        if (err.name !== "AbortError") setSummary(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [p.universityName]);

  const departments = summary?.departments ?? [];

  return (
    <div className="tab-panel">
      {loading && <InlineLoading label="Loading faculty index" />}

      {!loading && departments.length === 0 ? (
        <SchoolDataFallback universityName={p.universityName} context="faculty" />
      ) : null}

      {departments.length ? (
        <div className="department-list">
          {departments.map((department) => (
            <DepartmentFacultyCard
              key={`${department.facultyName}-${department.name}`}
              feature={feature}
              department={department}
              defaultOpen={departments.length === 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DepartmentFacultyCard({
  feature,
  department,
  defaultOpen = false
}: {
  feature: RankingFeature;
  department: FacultyDepartmentSummary;
  defaultOpen?: boolean;
}) {
  const p = feature.properties;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [page, setPage] = useState<FacultyDirectoryPage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || page) return;
    const controller = new AbortController();
    setLoading(true);
    api
      .getFacultyDirectoryPage(
        p.universityName,
        department.name,
        0,
        facultyPageSize,
        controller.signal
      )
      .then(setPage)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [department.name, isOpen, p.universityName, page]);

  const loadMore = () => {
    if (!page || loading) return;
    setLoading(true);
    api
      .getFacultyDirectoryPage(
        p.universityName,
        department.name,
        page.entries.length,
        facultyPageSize
      )
      .then((nextPage) => {
        setPage({
          ...nextPage,
          entries: [...page.entries, ...nextPage.entries],
          offset: 0,
          hasMore: nextPage.hasMore
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <details
      open={isOpen}
      className="department-card"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        <div>
          <strong>{department.name}</strong>
          <span>{department.count} people listed</span>
        </div>
      </summary>
      <div className="collapsible-body">
        <p>
          {department.roles.slice(0, 4).join(" / ") ||
            "Administrative and academic roles can be expanded in Supabase."}
        </p>
        <div className="tag-cloud compact-tags">
          {department.expertise.slice(0, 4).map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
        {loading && !page && <InlineLoading label="Loading people" />}
        {page && (
          <FacultyDirectoryList
            feature={feature}
            entries={page.entries}
            total={page.total}
            hasMore={page.hasMore}
            loading={loading}
            onLoadMore={loadMore}
            compact
          />
        )}
      </div>
    </details>
  );
}

function FacultyDirectoryList({
  feature,
  entries,
  total = entries.length,
  hasMore = false,
  loading = false,
  onLoadMore,
  compact = false
}: {
  feature: RankingFeature;
  entries: FacultyDirectoryEntry[];
  total?: number;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  compact?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useWorkspace();
  const p = feature.properties;
  return (
    <div
      className={compact ? "faculty-directory compact-directory" : "faculty-directory"}
    >
      {!compact && (
        <div className="faculty-directory-head">
          <div>
            <strong>{entries[0]?.departmentName ?? "Faculty directory"}</strong>
            <span>{total} entries from the official directory</span>
          </div>
          <ExternalChip href={entries[0].sourceUrl} label="Faculty source" />
        </div>
      )}
      <div className="faculty-person-list">
        {entries.map((entry) => {
          const facultyFavorite = createFavoriteItem(
            feature,
            "advisor",
            entry.fullName,
            entry.id
          );
          return (
            <details key={entry.id} className="faculty-person">
              <summary>
                <div>
                  <strong>{entry.fullName}</strong>
                  <span>{entry.role ?? "Faculty member"}</span>
                </div>
                <FavoriteButton
                  active={isFavorite("advisor", p.universityId, entry.id)}
                  label="导师"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleFavorite(facultyFavorite);
                  }}
                />
              </summary>
              <div className="collapsible-body">
                {entry.expertise.length ? (
                  <p>{entry.expertise.slice(0, 3).join(" / ")}</p>
                ) : (
                  <p>Expertise not listed on the directory card.</p>
                )}
                <div className="faculty-person-actions">
                  {entry.email && <a href={`mailto:${entry.email}`}>{entry.email}</a>}
                  {entry.profileUrl && (
                    <ExternalChip href={entry.profileUrl} label="Profile" />
                  )}
                </div>
              </div>
            </details>
          );
        })}
      </div>
      {hasMore && (
        <button
          className="load-more-button"
          type="button"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : `Load more (${entries.length}/${total})`}
        </button>
      )}
    </div>
  );
}
