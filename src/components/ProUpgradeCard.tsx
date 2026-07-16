import { Check, ExternalLink, Settings, Sparkles, X } from "lucide-react";
import { PRO_PRICE_LABEL, proBenefits } from "../entitlements";
import { buildCheckoutUrl } from "../subscription";
import { useAuth } from "../state/authContext";

// Lightweight Pro intro card. When VITE_LEMONSQUEEZY_CHECKOUT_URL is set the
// subscribe button becomes a live Lemon Squeezy checkout hand-off (prefilling
// the buyer email and round-tripping the Supabase user id so the webhook can
// link the subscription). Without that env it stays the disabled "coming soon"
// placeholder, so the unconfigured experience is unchanged. An optional
// VITE_LEMONSQUEEZY_PORTAL_URL adds a "Manage subscription" link.
const checkoutBaseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL as
  string | undefined;
const portalUrl = import.meta.env.VITE_LEMONSQUEEZY_PORTAL_URL as string | undefined;

export function ProUpgradeCard({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const checkoutEnabled = Boolean(checkoutBaseUrl);

  const startCheckout = () => {
    if (!checkoutBaseUrl) return;
    const url = buildCheckoutUrl(checkoutBaseUrl, {
      email: user?.email,
      userId: user?.id
    });
    window.open(url, "_blank", "noopener,noreferrer");
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
          {checkoutEnabled ? (
            <button className="primary-button" type="button" onClick={startCheckout}>
              Subscribe
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
