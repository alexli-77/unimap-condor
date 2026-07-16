import { useEffect, useState } from "react";
import { api } from "../api";
import type { RankingFeature, SchoolDecisionFacts } from "../types";

export function useSchoolDecisionFacts(feature: RankingFeature) {
  const p = feature.properties;
  const [facts, setFacts] = useState<SchoolDecisionFacts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api
      .getSchoolDecisionFacts(p.universityName, controller.signal)
      .then(setFacts)
      .catch((err) => {
        if (err.name !== "AbortError") setFacts(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [p.universityName]);

  return { facts, loading };
}
