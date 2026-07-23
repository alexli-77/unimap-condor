import { Check, ExternalLink, Settings, Sparkles, X } from "lucide-react";
import { PRO_PRICE_LABEL, proBenefits } from "../entitlements";
import { startCheckout } from "../subscription";
import { useAuth } from "../state/authContext";

// Lightweight Pro intro card. When VITE_LEMONSQUEEZY_CHECKOUT_URL is set the
// subscribe button becomes a live Lemon Squeezy checkout hand-off (prefilling
// the buyer email and round-tripping the Supabase user id so the webhook can
// link the subscription). Without that env it stays the disabled "coming soon"
// placeholder, so the unconfigured experience is unchanged. An optional
// VITE_LEMONSQUEEZY_PORTAL_URL adds a "Manage subscription" link.
//
// LEO-238: checkout must never be handed off without a signed-in user. Anonymous
// checkouts carry no user_id, so the webhook drops the subscription ("missing
// user_id") — the buyer pays but never unlocks Pro. So we gate the button on the
// auth state: local/unconfigured stays "coming soon", configured-but-logged-out
// becomes a "Sign in to subscribe" prompt, and only a signed-in user sees
// "Subscribe" and can start checkout.
const checkoutBaseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL as
  string | undefined;
const portalUrl = import.meta.env.VITE_LEMONSQUEEZY_PORTAL_URL as string | undefined;

export function ProUpgradeCard({
  onClose,
  onRequireSignIn
}: {
  onClose: () => void;
  onRequireSignIn?: () => void;
}) {
  const { isConfigured, user } = useAuth();
  // Checkout is only reachable when Lemon Squeezy is wired up AND Supabase auth is
  // configured (otherwise there can never be a user_id to link the sale to).
  const checkoutConfigured = Boolean(checkoutBaseUrl) && isConfigured;
  const canSubscribe = checkoutConfigured && Boolean(user?.id);
  const needsSignIn = checkoutConfigured && !user;
  // Fineprint/marketing copy switches to the live variant as soon as checkout is
  // reachable (even before sign-in), matching the pre-LEO-238 wording.
  const checkoutEnabled = canSubscribe || needsSignIn;

  const handleSubscribe = () => {
    // Defensive: startCheckout refuses to open without a userId, so an anonymous
    // click can never reach Lemon Squeezy even if this button is somehow shown.
    startCheckout(checkoutBaseUrl, { email: user?.email, userId: user?.id });
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="pro-card"
        role="dialog"
        aria-modal="true"
        aria-label="UniMap Condor Pro"
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
            <Sparkles size={15} />
            Pro
          </span>
          <h2>Go further with UniMap Condor Pro</h2>
          <p>
            Keep the whole search in one place, compare more, and share clean exports.
          </p>
        </div>
        <ul className="pro-benefits">
          {proBenefits.map((benefit) => (
            <li key={benefit}>
              <Check size={15} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="pro-card-foot">
          <div className="pro-price">
            <strong>{PRO_PRICE_LABEL}</strong>
            <span>billed monthly</span>
          </div>
          {canSubscribe ? (
            <button className="primary-button" type="button" onClick={handleSubscribe}>
              Subscribe
            </button>
          ) : needsSignIn ? (
            <button
              className="primary-button"
              type="button"
              onClick={() => onRequireSignIn?.()}
            >
              Sign in to subscribe
            </button>
          ) : (
            <button className="primary-button" type="button" disabled>
              Coming soon: subscribe
            </button>
          )}
        </div>
        {portalUrl && (
          <a
            className="pro-manage-link"
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Settings size={14} />
            Manage subscription
            <ExternalLink size={13} />
          </a>
        )}
        <p className="pro-card-fineprint">
          {checkoutEnabled
            ? "Your saved schools stay free to keep and export. Cancel anytime."
            : "Your saved schools stay free to keep and export. Subscriptions arrive in a later update."}
        </p>
      </section>
    </div>
  );
}
