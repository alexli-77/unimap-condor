import { UserRoundSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api";
import {
  defaultRecommendationPolicy,
  normalizeSignal,
  textMatchesTerm,
  type RecommendationResult
} from "../../../recommendationPolicy";
import type {
  AdvisorCard,
  FacultyDepartmentSummary,
  FacultyDirectorySummary,
  PreferenceProfile,
  RankingFeature
} from "../../../types";
import { useWorkspace } from "../../../state/workspaceContext";
import { createFavoriteItem } from "../../../workspace/helpers";
import { ExternalChip, Fact, FavoriteButton, InlineLoading } from "../../ui";

type DepartmentRecommendation = {
  id: string;
  department: FacultyDepartmentSummary;
  score: number;
  fit: RecommendationResult;
  advisorCount: number;
};

type AdvisorRecommendation = {
  advisor: AdvisorCard;
  fit: RecommendationResult;
};

function buildDepartmentRecommendations(
  departments: FacultyDepartmentSummary[],
  advisors: AdvisorCard[],
  preferenceProfile: PreferenceProfile
): DepartmentRecommendation[] {
  const advisorTextByDepartment = new Map<string, string[]>();

  advisors.forEach((advisor) => {
    const departmentKey = normalizeSignal(advisor.department ?? advisor.institutionName);
    const values = advisorTextByDepartment.get(departmentKey) ?? [];
    values.push(
      [
        advisor.fullName,
        advisor.department,
        advisor.fitSummary,
        advisor.contactAngle,
        ...advisor.researchAreas,
        ...advisor.targetPrograms
      ]
        .filter(Boolean)
        .join(" ")
    );
    advisorTextByDepartment.set(departmentKey, values);
  });

  return departments
    .map((department) => {
      const matchingAdvisorTexts = [...advisorTextByDepartment.entries()].filter(
        ([key, texts]) =>
          normalizeSignal(department.name).includes(key) ||
          key.includes(normalizeSignal(department.name)) ||
          texts.some((text) => textMatchesTerm(text, department.name))
      );
      const advisorCount = matchingAdvisorTexts.reduce(
        (sum, [, texts]) => sum + texts.length,
        0
      );
      const fit = defaultRecommendationPolicy.scoreDepartment(
        department,
        preferenceProfile,
        {
          advisors
        }
      );

      return {
        id: `${department.facultyName}:${department.name}`,
        department,
        score: fit.score,
        fit,
        advisorCount
      };
    })
    .filter((item) => item.score > 0 || item.fit.matched.length > 0)
    .sort((a, b) => b.score - a.score || b.department.count - a.department.count)
    .slice(0, 5);
}

function buildAdvisorRecommendations(
  advisors: AdvisorCard[],
  preferenceProfile: PreferenceProfile
): AdvisorRecommendation[] {
  return advisors
    .map((advisor) => ({
      advisor,
      fit: defaultRecommendationPolicy.scoreAdvisor(advisor, preferenceProfile)
    }))
    .sort((a, b) => {
      const priorityA = a.advisor.priorityScore ?? 0;
      const priorityB = b.advisor.priorityScore ?? 0;
      return (
        b.fit.score - a.fit.score ||
        priorityB - priorityA ||
        a.advisor.fullName.localeCompare(b.advisor.fullName)
      );
    });
}

export function RecommendationsPanel({ feature }: { feature: RankingFeature }) {
  const { preferenceProfile } = useWorkspace();
  const p = feature.properties;
  const [advisors, setAdvisors] = useState<AdvisorCard[]>([]);
  const [summary, setSummary] = useState<FacultyDirectorySummary | null>(null);
  const [loadingAdvisors, setLoadingAdvisors] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoadingAdvisors(true);
    api
      .getAdvisorCards(p.universityName)
      .then((items) => {
        if (isActive) setAdvisors(items);
      })
      .catch((err) => {
        if (isActive && err.name !== "AbortError") setAdvisors([]);
      })
      .finally(() => {
        if (isActive) setLoadingAdvisors(false);
      });

    return () => {
      isActive = false;
    };
  }, [p.universityName]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingDepartments(true);
    api
      .getFacultyDirectorySummary(p.universityName, controller.signal)
      .then(setSummary)
      .catch((err) => {
        if (err.name !== "AbortError") setSummary(null);
      })
      .finally(() => setLoadingDepartments(false));

    return () => controller.abort();
  }, [p.universityName]);

  const departmentRecommendations = useMemo(
    () =>
      buildDepartmentRecommendations(
        summary?.departments ?? [],
        advisors,
        preferenceProfile
      ),
    [advisors, preferenceProfile, summary]
  );
  const advisorRecommendations = useMemo(
    () => buildAdvisorRecommendations(advisors, preferenceProfile),
    [advisors, preferenceProfile]
  );
  const loading = loadingAdvisors || loadingDepartments;

  return (
    <div className="tab-panel">
      {loading && <InlineLoading label="Loading recommendations" />}
      <RecommendationSection
        title="Recommended departments"
        count={departmentRecommendations.length}
      >
        {departmentRecommendations.length ? (
          <div className="recommended-department-list">
            {departmentRecommendations.map((recommendation) => (
              <RecommendedDepartmentCard
                key={recommendation.id}
                recommendation={recommendation}
                feature={feature}
              />
            ))}
          </div>
        ) : (
          <div className="advisor-empty">
            <UserRoundSearch size={20} />
            <p>
              No department recommendation yet. Add subject or research keywords in Prefs.
            </p>
          </div>
        )}
      </RecommendationSection>

      <RecommendationSection
        title="Recommended advisors"
        count={advisorRecommendations.length}
      >
        {!loading && advisors.length === 0 ? (
          <div className="advisor-empty">
            <UserRoundSearch size={20} />
            <p>No advisor recommendations linked to this university yet.</p>
          </div>
        ) : null}
        <div className="advisor-list">
          {advisorRecommendations.map(({ advisor, fit }) => (
            <AdvisorItem key={advisor.id} advisor={advisor} fit={fit} feature={feature} />
          ))}
        </div>
      </RecommendationSection>
    </div>
  );
}

function RecommendationSection({
  title,
  count,
  children
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="recommendation-section">
      <div className="recommendation-section-head">
        <strong>{title}</strong>
        <span>{count}</span>
      </div>
      {children}
    </section>
  );
}

function RecommendedDepartmentCard({
  recommendation,
  feature
}: {
  recommendation: DepartmentRecommendation;
  feature: RankingFeature;
}) {
  const { isFavorite, toggleFavorite } = useWorkspace();
  const p = feature.properties;
  const department = recommendation.department;
  const favoriteKey = recommendation.id;
  const favorite = createFavoriteItem(feature, "subject", department.name, favoriteKey);
  const fit = recommendation.fit;

  return (
    <details className="recommended-department-card">
      <summary>
        <div>
          <strong>{department.name}</strong>
          <span>{department.facultyName}</span>
        </div>
        <em className={`recommendation-badge recommendation-${fit.level}`}>
          {fit.label}
        </em>
        <FavoriteButton
          active={isFavorite("subject", p.universityId, favoriteKey)}
          label="部门"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(favorite);
          }}
        />
      </summary>
      <div className="collapsible-body">
        <div className="recommendation-metrics">
          <Fact label="People" value={department.count} />
          <Fact label="Advisors" value={recommendation.advisorCount} />
        </div>
        <p className="recommendation-summary">{fit.summary}</p>
        <RecommendationEvidence
          title="Why it fits"
          items={fit.matched}
          empty="No direct fit signal yet."
        />
        <RecommendationEvidence
          title="Concerns"
          items={fit.concerns}
          empty="No major concern from connected data."
        />
        <RecommendationEvidence
          title="Missing info"
          items={fit.missing}
          empty="No blocking missing info."
        />
        <div className="recommendation-next">
          <strong>Next</strong>
          <span>{fit.nextAction}</span>
        </div>
        {department.expertise.length ? (
          <div className="tag-cloud compact-tags">
            {department.expertise.slice(0, 5).map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function RecommendationEvidence({
  title,
  items,
  empty
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="recommendation-evidence">
      <h4>{title}</h4>
      {items.length ? (
        <ul className="recommendation-reasons">
          {items.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </div>
  );
}

function AdvisorItem({
  advisor,
  fit,
  feature
}: {
  advisor: AdvisorCard;
  fit: RecommendationResult;
  feature: RankingFeature;
}) {
  const { isFavorite, toggleFavorite } = useWorkspace();
  const p = feature.properties;
  const advisorFavorite = createFavoriteItem(
    feature,
    "advisor",
    advisor.fullName,
    advisor.id
  );
  return (
    <details className="advisor-card">
      <summary className="advisor-card-header">
        <div>
          <strong>{advisor.fullName}</strong>
          <span>
            {[advisor.department, advisor.lab].filter(Boolean).join(" · ") ||
              advisor.institutionName}
          </span>
        </div>
        <em className={`recommendation-badge recommendation-${fit.level}`}>
          {fit.label}
        </em>
      </summary>

      <div className="collapsible-body">
        <p>{fit.summary}</p>
        <RecommendationEvidence
          title="Why it fits"
          items={fit.matched}
          empty={advisor.fitSummary}
        />
        <RecommendationEvidence
          title="Concerns"
          items={fit.concerns}
          empty="No major concern from connected data."
        />
        <RecommendationEvidence
          title="Missing info"
          items={fit.missing}
          empty="No blocking missing info."
        />
        <div className="recommendation-next">
          <strong>Next</strong>
          <span>{fit.nextAction}</span>
        </div>

        {advisor.researchAreas.length ? (
          <div className="tag-cloud compact-tags">
            {advisor.researchAreas.slice(0, 5).map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        ) : null}

        <div className="advisor-section">
          {advisor.contactAngle && (
            <div>
              <h4>Angle</h4>
              <p>{advisor.contactAngle}</p>
            </div>
          )}
          {advisor.targetPrograms.length ? (
            <div>
              <h4>Programs</h4>
              <p>{advisor.targetPrograms.join(" / ")}</p>
            </div>
          ) : null}
        </div>

        <div className="advisor-meta">
          {advisor.outreachStatus && <span>{advisor.outreachStatus}</span>}
          {advisor.recruitingSignal && <span>{advisor.recruitingSignal}</span>}
          {advisor.politicalSensitivity && (
            <span className="advisor-warning">
              Sensitivity: {advisor.politicalSensitivity}
            </span>
          )}
        </div>

        <div className="advisor-footer">
          <FavoriteButton
            active={isFavorite("advisor", p.universityId, advisor.id)}
            label="导师"
            onClick={() => toggleFavorite(advisorFavorite)}
          />
          {advisor.profileUrl && (
            <ExternalChip href={advisor.profileUrl} label="Profile" />
          )}
        </div>
      </div>
    </details>
  );
}
