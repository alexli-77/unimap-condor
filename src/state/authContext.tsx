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
  /**
   * Create an account with email + password. `needsConfirmation` is true when
   * Supabase requires the user to confirm their email before a session exists.
   */
  signUpWithPassword: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  /** Sign in with email + password. */
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  /** Send a password reset email. */
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  /**
   * True after Supabase fires PASSWORD_RECOVERY (the user arrived via a reset
   * link) until the flow is completed or dismissed. The app shell surfaces the
   * "set a new password" form while this is set.
   */
  passwordRecovery: boolean;
  /** Set a new password for the current (recovery) session. */
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  /** Complete or dismiss the password recovery flow. */
  completePasswordRecovery: () => void;
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
  signUpWithPassword: async () => ({
    error: "Cloud sync is not configured.",
    needsConfirmation: false
  }),
  signInWithPassword: async () => ({
    error: "Cloud sync is not configured."
  }),
  resetPassword: async () => ({
    error: "Cloud sync is not configured."
  }),
  passwordRecovery: false,
  updatePassword: async () => ({
    error: "Cloud sync is not configured."
  }),
  completePasswordRecovery: () => {},
  signOut: async () => {}
};

const AuthContext = createContext<AuthContextValue>(loggedOutDefault);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = supabase !== null;
  const [loading, setLoading] = useState<boolean>(isConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [subscriptionPro, setSubscriptionPro] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

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

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      // The user landed from a reset-password email link; keep the flag up
      // until they set a new password (or dismiss the form).
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
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

  const signUpWithPassword = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!supabase) {
        return { error: "Cloud sync is not configured.", needsConfirmation: false };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          ...(displayName ? { data: { display_name: displayName } } : {})
        }
      });
      if (error) return { error: error.message, needsConfirmation: false };
      // No session means the project requires email confirmation first.
      return { error: null, needsConfirmation: data.session === null };
    },
    []
  );

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Cloud sync is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) return { error: "Cloud sync is not configured." };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    return { error: error ? error.message : null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return { error: "Cloud sync is not configured." };
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error ? error.message : null };
  }, []);

  const completePasswordRecovery = useCallback(() => setPasswordRecovery(false), []);

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
      signUpWithPassword,
      signInWithPassword,
      resetPassword,
      passwordRecovery,
      updatePassword,
      completePasswordRecovery,
      signOut
    }),
    [
      isConfigured,
      loading,
      user,
      session,
      subscriptionPro,
      signInWithOtp,
      signUpWithPassword,
      signInWithPassword,
      resetPassword,
      passwordRecovery,
      updatePassword,
      completePasswordRecovery,
      signOut
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
