import { useState } from "react";
import { LogOut, Mail, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../../state/authContext";

// Account panel. Magic-link (passwordless) sign-in keeps us out of password
// management; when Supabase is unconfigured the dialog degrades to a clear
// "not configured" note so the logged-out experience never changes.
export function AuthDialog({ onClose }: { onClose: () => void }) {
  const { isConfigured, user, signInWithOtp, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
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

        {isConfigured && !user && status !== "sent" && (
          <form className="auth-form" onSubmit={handleSubmit}>
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
            Check <strong>{email}</strong> for a sign-in link. You can close this dialog.
          </p>
        )}
      </section>
    </div>
  );
}
