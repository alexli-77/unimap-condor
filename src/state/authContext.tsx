import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { isSubscriptionActive, type SubscriptionRecord } from "../subscription";

export type AuthContextValue = {
  /** True when Supabase env is present, i.e. cloud sync / accounts are usable. */
  isConfigured: boolean;
  /** Still resolving the initial session (only meaningful when configured). */
  loading: boolean;
  user: User | null;
  session: Session | null;
  /** Pro derived from the user's subscription row (false when logged out). */
  subscriptionPro: boolean;
  /** Send a passwordless magic-link sign-in email. */
  signInWithOtp: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

// Default value doubles as the graceful-degradation fallback for consumers
// rendered outside an <AuthProvider> (and for the Supabase-unconfigured case):
// logged out, not configured, no-op actions.
const loggedOutDefault: AuthContextValue = {
  isConfigured: false,
  loading: false,
  user: null,
  session: null,
  subscriptionPro: false,
  signInWithOtp: async () => ({
    error: "Cloud sync is not configured."
  }),
  signOut: async () => {}
};

const AuthContext = createContext<AuthContextValue>(loggedOutDefault);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = supabase !== null;
  const [loading, setLoading] = useState<boolean>(isConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [subscriptionPro, setSubscriptionPro] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  // Whenever the signed-in user changes, resolve their Pro entitlement from the
  // `subscriptions` table. Logged out -> not Pro. Failures degrade to not Pro.
  useEffect(() => {
    if (!supabase || !user) {
      setSubscriptionPro(false);
      return;
    }
    let active = true;
    supabase
      .from("subscriptions")
      .select("status, plan, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setSubscriptionPro(false);
          return;
        }
        setSubscriptionPro(isSubscriptionActive(data as SubscriptionRecord | null));
      });
    return () => {
      active = false;
    };
  }, [user]);

  const signInWithOtp = useCallback(async (email: string) => {
    if (!supabase) return { error: "Cloud sync is not configured." };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured,
      loading,
      user,
      session,
      subscriptionPro,
      signInWithOtp,
      signOut
    }),
    [isConfigured, loading, user, session, subscriptionPro, signInWithOtp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
