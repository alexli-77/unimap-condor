import { useState } from "react";
import { KeyRound, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../../state/authContext";

// Minimal "set a new password" form shown when the user arrives from a
// Supabase password-recovery link (PASSWORD_RECOVERY auth event, see
// authContext). Reuses the AuthDialog card styling.
export function ResetPasswordDialog({ onClose }: { onClose: () => void }) {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("saving");
    setMessage("");
    const { error } = await updatePassword(password);
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }
    setStatus("saved");
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="pro-card auth-card"
        role="dialog"
        aria-modal="true"
        aria-label="Set a new password"
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
          <h2>Set a new password</h2>
        </div>

        {status === "saved" ? (
          <div className="auth-signed-in">
            <p className="auth-note" role="status">
              Password updated. You are signed in with your new password.
            </p>
            <button className="primary-button" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <p className="auth-note">
              You followed a password reset link. Choose a new password for your
              account.
            </p>
            <label className="auth-field">
              <span>New password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>Confirm new password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat the new password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
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
              disabled={status === "saving"}
            >
              <KeyRound size={15} />
              {status === "saving" ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
