import { Check, Compass, Plus } from "lucide-react";
import { useState } from "react";

const schoolRequestsStorageKey = "unimap.schoolRequests";

type SchoolRequest = {
  school: string;
  requestedAt: string;
};

function readSchoolRequests(): SchoolRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(schoolRequestsStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SchoolRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hasRequested(school: string): boolean {
  const needle = school.trim().toLowerCase();
  return readSchoolRequests().some(
    (request) => request.school.trim().toLowerCase() === needle
  );
}

/**
 * Records an interest signal for a school we do not have deep data for yet.
 * Idempotent: a school is stored at most once (keyed case-insensitively).
 */
function recordSchoolRequest(school: string) {
  const existing = readSchoolRequests();
  const needle = school.trim().toLowerCase();
  if (existing.some((request) => request.school.trim().toLowerCase() === needle)) {
    return;
  }
  const next: SchoolRequest[] = [
    ...existing,
    { school, requestedAt: new Date().toISOString() }
  ];
  try {
    localStorage.setItem(schoolRequestsStorageKey, JSON.stringify(next));
  } catch {
    // Ignore quota/private-mode failures; the honest prompt still applies.
  }
}

/**
 * Honest downgrade shown on Decision/Faculty tabs for schools without verified
 * decision facts or a linked faculty index yet. Instead of a wall of "not found"
 * rows, it states the current coverage focus and lets the user register demand.
 * Coverage is judged dynamically by the caller, so new regions light up
 * automatically once their data lands.
 */
export function SchoolDataFallback({
  universityName,
  context
}: {
  universityName: string;
  context: "decision" | "faculty";
}) {
  const [requested, setRequested] = useState(() => hasRequested(universityName));

  const dataLabel = context === "decision" ? "decision" : "faculty";

  return (
    <div className="school-fallback">
      <div className="school-fallback-icon">
        <Compass size={20} />
      </div>
      <div className="school-fallback-body">
        <strong>Deep {dataLabel} data not yet available for this school</strong>
        <p>
          We currently focus on North America CS programs, so verified {dataLabel} facts
          for {universityName} are not connected yet. General ranking and profile
          information stays available on the other tabs.
        </p>
        <button
          className="primary-button school-fallback-button"
          type="button"
          disabled={requested}
          onClick={() => {
            recordSchoolRequest(universityName);
            setRequested(true);
          }}
        >
          {requested ? (
            <>
              <Check size={15} />
              Requested
            </>
          ) : (
            <>
              <Plus size={15} />
              Request this school
            </>
          )}
        </button>
      </div>
    </div>
  );
}
