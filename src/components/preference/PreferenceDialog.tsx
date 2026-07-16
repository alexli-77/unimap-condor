import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { PreferenceProfile, PriorityLevel } from "../../types";
import type { BooleanPreferenceKey, StringPreferenceKey } from "../../workspace/types";

export function PreferenceDialog({
  profile,
  onSave,
  onClose
}: {
  profile: PreferenceProfile;
  onSave: (profile: PreferenceProfile) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<PreferenceProfile>(profile);

  const updateProfile = (key: StringPreferenceKey, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updatePriority = (key: StringPreferenceKey, value: PriorityLevel) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateToggle = (key: BooleanPreferenceKey, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="preference-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Preference profile"
      >
        <div className="dialog-head">
          <div>
            <h2>Preference profile</h2>
            <p>Keep the decision context that rankings alone cannot answer.</p>
          </div>
          <button
            className="icon-button"
            aria-label="Close preference profile"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <div className="preference-grid">
          <label>
            Degree level
            <div className="select-wrap">
              <select
                value={draft.degreeLevel}
                onChange={(event) => updateProfile("degreeLevel", event.target.value)}
              >
                <option value="">Not sure yet</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Exchange">Exchange</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </label>
          <label>
            Target countries
            <input
              value={draft.targetCountries}
              onChange={(event) => updateProfile("targetCountries", event.target.value)}
              placeholder="Canada, US, Netherlands"
            />
          </label>
          <label>
            Target cities
            <input
              value={draft.targetCities}
              onChange={(event) => updateProfile("targetCities", event.target.value)}
              placeholder="Montreal, Toronto, Vancouver"
            />
          </label>
          <label>
            Budget currency
            <div className="select-wrap">
              <select
                value={draft.budgetCurrency}
                onChange={(event) => updateProfile("budgetCurrency", event.target.value)}
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </label>
          <label>
            Max tuition / year
            <input
              value={draft.maxTuition}
              onChange={(event) => updateProfile("maxTuition", event.target.value)}
              placeholder="30000"
            />
          </label>
          <label>
            Funding
            <div className="select-wrap">
              <select
                value={draft.fundingRequirement}
                onChange={(event) =>
                  updateProfile("fundingRequirement", event.target.value)
                }
              >
                <option value="flexible">Flexible</option>
                <option value="preferred">Preferred</option>
                <option value="required">Required</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </label>
          <label>
            Subject areas
            <input
              value={draft.subjectAreas}
              onChange={(event) => updateProfile("subjectAreas", event.target.value)}
              placeholder="CS, SE, HCI, AI"
            />
          </label>
          <label>
            Research keywords
            <input
              value={draft.researchKeywords}
              onChange={(event) => updateProfile("researchKeywords", event.target.value)}
              placeholder="LLM evaluation, AI for SE"
            />
          </label>
          <label>
            GPA / grades
            <input
              value={draft.gpa}
              onChange={(event) => updateProfile("gpa", event.target.value)}
              placeholder="3.7/4.0, 88/100"
            />
          </label>
          <label>
            Language scores
            <input
              value={draft.languageScores}
              onChange={(event) => updateProfile("languageScores", event.target.value)}
              placeholder="IELTS 7.0, TOEFL 100"
            />
          </label>
          <label className="preference-wide">
            Background
            <textarea
              value={draft.background}
              onChange={(event) => updateProfile("background", event.target.value)}
              placeholder="Research, internship, publications, work experience"
            />
          </label>
        </div>

        <div className="preference-section">
          <h3>Decision priorities</h3>
          <div className="preference-grid">
            <PrioritySelect
              label="Employment"
              value={draft.employmentPriority}
              onChange={(value) => updatePriority("employmentPriority", value)}
            />
            <PrioritySelect
              label="Research"
              value={draft.researchPriority}
              onChange={(value) => updatePriority("researchPriority", value)}
            />
            <PrioritySelect
              label="Immigration"
              value={draft.immigrationPriority}
              onChange={(value) => updatePriority("immigrationPriority", value)}
            />
          </div>
        </div>

        <div className="preference-section">
          <h3>Flexibility</h3>
          <div className="preference-toggles">
            <label className="switch-row">
              <span>
                <strong>Small cities</strong>
                <em>Accept schools outside major metro areas.</em>
              </span>
              <input
                type="checkbox"
                checked={draft.acceptsSmallCities}
                onChange={(event) =>
                  updateToggle("acceptsSmallCities", event.target.checked)
                }
              />
            </label>
            <label className="switch-row">
              <span>
                <strong>Course-based programs</strong>
                <em>Consider programs without a thesis track.</em>
              </span>
              <input
                type="checkbox"
                checked={draft.acceptsCourseBased}
                onChange={(event) =>
                  updateToggle("acceptsCourseBased", event.target.checked)
                }
              />
            </label>
            <label className="switch-row">
              <span>
                <strong>Niche programs</strong>
                <em>Accept less famous programs if fit is strong.</em>
              </span>
              <input
                type="checkbox"
                checked={draft.acceptsNichePrograms}
                onChange={(event) =>
                  updateToggle("acceptsNichePrograms", event.target.checked)
                }
              />
            </label>
          </div>
        </div>

        <label className="preference-wide">
          Notes
          <textarea
            value={draft.notes}
            onChange={(event) => updateProfile("notes", event.target.value)}
            placeholder="Non-negotiables, open questions, deadline notes"
          />
        </label>

        <div className="dialog-actions">
          <span className="save-state">
            {profile.updatedAt
              ? `Saved ${new Date(profile.updatedAt).toLocaleDateString()}`
              : "Not saved yet"}
          </span>
          <button className="ghost-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={saveProfile}>
            Save profile
          </button>
        </div>
      </section>
    </div>
  );
}

function PrioritySelect({
  label,
  value,
  onChange
}: {
  label: string;
  value: PriorityLevel;
  onChange: (value: PriorityLevel) => void;
}) {
  return (
    <label>
      {label}
      <div className="select-wrap">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as PriorityLevel)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <ChevronDown size={16} />
      </div>
    </label>
  );
}
