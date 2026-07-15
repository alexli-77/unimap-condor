import { ArrowLeftRight, MapPin, SlidersHorizontal, Star, X } from "lucide-react";

const steps = [
  {
    icon: <SlidersHorizontal size={18} />,
    title: "Set preferences",
    body: "Tell UniMap your degree, target countries, subject, budget, and priorities."
  },
  {
    icon: <Star size={18} />,
    title: "Explore & save",
    body: "Browse schools on the map, read fit signals, and star the ones worth tracking."
  },
  {
    icon: <ArrowLeftRight size={18} />,
    title: "Compare & export shortlist",
    body: "Weigh candidates side by side, then export a human-readable shortlist to share."
  }
];

/**
 * First-run guidance layer that frames the product and offers a North America
 * CS master's template. Shown only to brand-new users; dismissable and
 * re-openable from the Guide navigation button.
 */
export function WelcomeOverlay({
  onStartTemplate,
  onSkip
}: {
  onStartTemplate: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="dialog-backdrop welcome-backdrop" role="presentation">
      <section
        className="welcome-card"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to UniMap Condor"
      >
        <button
          className="icon-button welcome-close"
          aria-label="Skip guide"
          onClick={onSkip}
        >
          <X size={17} />
        </button>

        <div className="welcome-head">
          <div className="welcome-eyebrow">
            <MapPin size={15} />
            North America CS master's shortlist workbench
          </div>
          <h2>
            Turn a messy pile of schools into an executable shortlist in ~30 minutes.
          </h2>
          <p>
            UniMap Condor helps you compare, track, and decide — so scattered admissions
            notes become a longlist and shortlist you can actually act on.
          </p>
        </div>

        <ol className="welcome-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="welcome-step-index">{index + 1}</span>
              <div className="welcome-step-body">
                <strong>
                  {step.icon}
                  {step.title}
                </strong>
                <span>{step.body}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="welcome-actions">
          <button className="primary-button" type="button" onClick={onStartTemplate}>
            Start with North America CS template
          </button>
          <button className="ghost-button" type="button" onClick={onSkip}>
            Skip for now
          </button>
        </div>
      </section>
    </div>
  );
}
