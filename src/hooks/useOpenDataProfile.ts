import { useEffect, useState } from "react";
import { api } from "../api";
import type { OpenDataProfile, RankingFeature } from "../types";

export function useOpenDataProfile(feature: RankingFeature) {
  const p = feature.properties;
  const [profile, setProfile] = useState<OpenDataProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    api
      .getOpenDataProfile(p.universityName)
      .then((nextProfile) => {
        if (isActive) setProfile(nextProfile);
      })
      .catch((err) => {
        if (isActive && err.name !== "AbortError") {
          setProfile({
            status: "error",
            aliases: [],
            topics: [],
            relatedInstitutions: [],
            message: err.message
          });
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [p.universityName]);

  return { profile, loading };
}
