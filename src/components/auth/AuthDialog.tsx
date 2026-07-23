import { useState } from "react";
import { KeyRound, LogOut, Mail, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../../state/authContext";

// The stylesheet's segmented control is 3-up; this toggle only has two modes.
const twoUpSegmented: React.CSSProperties = {
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
};

// Reuse the link styling on <button> elements (forgot password, sign in/up switch).
const linkButton: React.CSSProperties = {
  background: "none",
  border: 0,
  padding: 0,
  cursor: "pointer"
};

// Account panel. Password sign-in is the default; magic-link (passwordless)
// stays available as an alternate mode. When Supabase is unconfigured the
// dialog degrades to a clear "not configured" note so the logged-out
// experience never changes.
export function AuthDialog({ onClose }: { onClose: () => void }) {
  const {
    isConfigured,
    user,
    signInWithOtp,
    signUpWithPassword,
    signInWithPassword,
    resetPassword,
    signOut
  } = useAuth();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [view, setView] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentKind, setSentKind] = useState<"otp" | "confirm" | "reset">("otp");
  const [message, setMessage] = useState("");

  const resetFeedback = () => {
    setStatus("idle");
    setMessage("");
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setMessage("");
    const { error } = await signInWithOtp(email.trim());
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }
    setSentKind("otp");
    setStatus("sent");
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    if (view === "signup" && password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    setStatus("sending");
    setMessage("");
    if (view === "signup") {
      const { error, needsConfirmation } = await signUpWithPassword(
        email.trim(),
        password,
        displayName.trim() || undefined
      );
      if (error) {
        setStatus("error");
        setMessage(error);
        return;
      }
      if (needsConfirmation) {
        setSentKind("confirm");
        setStatus("sent");
        return;
      }
      // A session was returned; the signed-in view takes over via auth state.
      setStatus("idle");
      return;
    }
    const { error } = await signInWithPassword(email.trim(), password);
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }
    setStatus("idle");
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter your email above first, then use the reset link.");
      return;
    }
    setStatus("sending");
    setMessage("");
    const { error } = await resetPassword(email.trim());
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }
    setSentKind("reset");
    setStatus("sent");
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="pro-card auth-card"
        role="dialog"
        aria-modal="true"
        aria-label="Account and cloud sync"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="pro-card-head">
          <span className="pro-card-badge">
            <ShieldCheck size={15} />
            Account
          </span>
          <h2>Cloud sync</h2>
        </div>

        {!isConfigured && (
          <p className="auth-note" role="status">
            Cloud sync not configured. Your workspace is saved locally on this device.
          </p>
        )}

        {isConfigured && user && (
          <div className="auth-signed-in">
            <p className="auth-note">
              Signed in as <strong>{user.email}</strong>. Your saved schools, decisions,
              and preferences sync to your account.
            </p>
            <button
              className="ghost-button"
              type="button"
              onClick={async () => {
                await signOut();
                onClose();
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        )}

        {isConfigured && !user && (
          <div className="segmented-control" style={twoUpSegmented} role="tablist">
            <button
              type="button"
              className={mode === "password" ? "active" : undefined}
              onClick={() => {
                setMode("password");
                resetFeedback();
              }}
            >
              Password
            </button>
            <button
              type="button"
              className={mode === "otp" ? "active" : undefined}
              onClick={() => {
                setMode("otp");
                resetFeedback();
              }}
            >
              Email code
            </button>
          </div>
        )}

        {isConfigured && !user && mode === "password" && status !== "sent" && (
          <form className="auth-form" onSubmit={handlePasswordSubmit}>
            <p className="auth-note">
              {view === "signin"
                ? "Sign in with your email and password."
                : "Create an account to sync your workspace across devices."}
            </p>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {view === "signup" && (
              <label className="auth-field">
                <span>Display name (optional)</span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </label>
            )}
            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={view === "signup" ? 8 : undefined}
                autoComplete={view === "signup" ? "new-password" : "current-password"}
                placeholder={view === "signup" ? "At least 8 characters" : "Your password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {status === "error" && (
              <p className="auth-error" role="alert">
                {message}
              </p>
            )}
            <button
              className="primary-button"
              type="submit"
              disabled={status === "sending"}
            >
              <KeyRound size={15} />
              {view === "signin"
                ? status === "sending"
                  ? "Signing in…"
                  : "Sign in"
                : status === "sending"
                  ? "Creating account…"
                  : "Create account"}
            </button>
            {view === "signin" && (
              <button
                type="button"
                className="pro-manage-link"
                style={linkButton}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            )}
            <button
              type="button"
              className="pro-manage-link"
              style={linkButton}
              onClick={() => {
                setView(view === "signin" ? "signup" : "signin");
                resetFeedback();
              }}
            >
              {view === "signin"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </form>
        )}

        {isConfigured && !user && mode === "otp" && status !== "sent" && (
          <form className="auth-form" onSubmit={handleOtpSubmit}>
            <p className="auth-note">
              Enter your email and we&apos;ll send a magic link to sign in — no password
              needed.
            </p>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {status === "error" && (
              <p className="auth-error" role="alert">
                {message}
              </p>
            )}
            <button
              className="primary-button"
              type="submit"
              disabled={status === "sending"}
            >
              <Mail size={15} />
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}

        {isConfigured && !user && status === "sent" && (
          <p className="auth-note" role="status">
            {sentKind === "otp" && (
              <>
                Check <strong>{email}</strong> for a sign-in link. You can close this
                dialog.
              </>
            )}
            {sentKind === "confirm" && (
              <>
                Check <strong>{email}</strong> to confirm your account, then come back
                and sign in.
              </>
            )}
            {sentKind === "reset" && (
              <>
                Check <strong>{email}</strong> for a password reset link. You can close
                this dialog.
              </>
            )}
          </p>
        )}
      </section>
    </div>
  );
}
