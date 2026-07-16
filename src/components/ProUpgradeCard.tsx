import { Check, Sparkles, X } from "lucide-react";
import { PRO_PRICE_LABEL, proBenefits } from "../entitlements";

// Lightweight Pro intro card (not a checkout). Lists the entitlements a Pro plan
// unlocks and shows a disabled "coming soon" subscribe button. LEO-196 replaces
// that placeholder with the real Lemon Squeezy checkout hand-off.
export function ProUpgradeCard({ onClose }: { onClose: () => void }) {
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
          <button className="primary-button" type="button" disabled>
            Coming soon: subscribe
          </button>
        </div>
        <p className="pro-card-fineprint">
          Your saved schools stay free to keep and export. Subscriptions arrive in a later
          update.
        </p>
      </section>
    </div>
  );
}
