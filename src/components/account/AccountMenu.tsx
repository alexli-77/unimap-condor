import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Globe,
  LogOut,
  Settings,
  Sparkles,
  UserCircle2
} from "lucide-react";
import { useAuth } from "../../state/authContext";
import { useWorkspace } from "../../state/workspaceContext";
import { PixelAvatar } from "./PixelAvatar";

// Claude-style account entry for the bottom of the map nav. Signed out it is a
// plain "Sign in" nav button (opens the existing AuthDialog); signed in it is a
// chip (pixel avatar + name + plan) that toggles a dropdown menu anchored to
// the chip. The menu — not a modal — is the primary account surface: upgrade /
// manage subscription, language (placeholder) and sign out.
const portalUrl = import.meta.env.VITE_LEMONSQUEEZY_PORTAL_URL as string | undefined;

/** Menu is fixed-position so the nav's overflow never clips it. */
type MenuPlacement = React.CSSProperties;

function resolveDisplayName(user: {
  email?: string;
  user_metadata: Record<string, unknown>;
}): string {
  const metaName = user.user_metadata["display_name"];
  if (typeof metaName === "string" && metaName.trim()) return metaName.trim();
  return user.email?.split("@")[0] ?? "Account";
}

export function AccountMenu({ onSignIn }: { onSignIn: () => void }) {
  const { isConfigured, user, signOut } = useAuth();
  const { isPro, openProCard } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<MenuPlacement>({});
  const chipRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const rect = chipRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 252;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
      // Anchored to the chip: open upward from the bottom nav slot, downward
      // when the chip sits in the top half (the mobile horizontal nav).
      if (rect.top > window.innerHeight / 2) {
        setPlacement({ left, bottom: window.innerHeight - rect.top + 8 });
      } else {
        setPlacement({ left, top: rect.bottom + 8 });
      }
    }
    setIsOpen(true);
  };

  // Outside click + Escape dismissal while open.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (chipRef.current?.contains(target)) return;
      closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeMenu();
      chipRef.current?.focus();
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  // Signing out (or session loss) removes the anchor; drop the menu with it.
  useEffect(() => {
    if (!user) setIsOpen(false);
  }, [user]);

  if (!user) {
    return (
      <button
        className="map-nav-item"
        type="button"
        onClick={onSignIn}
        title={
          isConfigured ? "Sign in to sync your workspace" : "Cloud sync not configured"
        }
      >
        <span className="map-nav-icon">
          <UserCircle2 size={25} />
        </span>
        <span>Sign in</span>
      </button>
    );
  }

  const displayName = resolveDisplayName(user);
  const planLabel = isPro ? "Pro" : "Free";

  return (
    <>
      <button
        ref={chipRef}
        className={`map-nav-item account-chip ${isOpen ? "active" : ""}`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleMenu}
        title={`${displayName} · ${planLabel}`}
      >
        <span className="map-nav-icon">
          <PixelAvatar seed={user.id} isPro={isPro} size={30} />
        </span>
        <span className="account-chip-name">{displayName}</span>
        <span className={`account-chip-plan ${isPro ? "pro" : ""}`}>{planLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="account-menu"
          role="menu"
          aria-label="Account menu"
          style={placement}
        >
          <div className="account-menu-header">
            <PixelAvatar seed={user.id} isPro={isPro} size={38} />
            <div className="account-menu-identity">
              <strong>{displayName}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          {isPro ? (
            portalUrl ? (
              <button
                className="account-menu-item"
                type="button"
                role="menuitem"
                onClick={() => {
                  closeMenu();
                  window.open(portalUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <Settings size={15} />
                <span>Manage subscription</span>
                <ExternalLink size={13} className="account-menu-trailing" />
              </button>
            ) : (
              <div className="account-menu-status" role="menuitem" aria-disabled="true">
                <Sparkles size={15} />
                <span>Pro plan — active</span>
              </div>
            )
          ) : (
            <button
              className="account-menu-item account-menu-upgrade"
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                openProCard();
              }}
            >
              <Sparkles size={15} />
              <span>Upgrade plan</span>
            </button>
          )}

          <button
            className="account-menu-item"
            type="button"
            role="menuitem"
            disabled
            title="Language options are coming soon"
          >
            <Globe size={15} />
            <span>Language</span>
            <span className="account-menu-hint">Coming soon</span>
          </button>

          <div className="account-menu-divider" role="separator" />

          <button
            className="account-menu-item"
            type="button"
            role="menuitem"
            onClick={async () => {
              closeMenu();
              await signOut();
            }}
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </>
  );
}
