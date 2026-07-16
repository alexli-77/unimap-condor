import { ExternalLink, Layers3, Loader2, Star } from "lucide-react";

export function Metric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function InlineLoading({ label }: { label: string }) {
  return (
    <p className="muted inline-loading">
      <Loader2 className="spin" size={15} />
      {label}
    </p>
  );
}

export function ExternalChip({ href, label }: { href: string; label: string }) {
  return (
    <a className="external-chip" href={href} target="_blank" rel="noreferrer">
      {label}
      <ExternalLink size={13} />
    </a>
  );
}

export function FavoriteButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={`favorite-chip ${active ? "active" : ""}`}
      type="button"
      aria-label={active ? `取消关注${label}` : `关注${label}`}
      aria-pressed={active}
      title={active ? `取消关注${label}` : `关注${label}`}
      onClick={onClick}
    >
      <Star size={14} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

export function EmptySelection() {
  return (
    <section className="panel empty">
      <Layers3 size={42} />
      <h2>Select a university</h2>
      <p className="muted">
        Click an individual point on the map to inspect rank, subject, source, and
        location details.
      </p>
    </section>
  );
}
