import "./BuildCard.css";

/**
 * "Building fast…" preview card — a little browser/app mockup (the "figma card"
 * style from the reference collage): mac window chrome, a gradient preview with
 * a wave + sun, and a one-line pitch. A lined sheet peeks out behind it for the
 * stacked-paper look. Sits at the bottom-left of the contact copy.
 */
export default function BuildCard() {
  return (
    <div className="build-wrap">
      <span className="build-stack" aria-hidden="true" />
      <div className="build-card">
        <div className="build-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="build-preview" aria-hidden="true">
          <span className="build-sun" />
          <svg className="build-wave" viewBox="0 0 260 92" preserveAspectRatio="none">
            <path
              d="M0 66C40 46 82 76 130 60c48-16 88 12 130-6v72H0z"
              fill="#c3b4ef"
            />
            <path
              d="M0 78C52 64 92 86 142 74c46-11 76 8 118-2v52H0z"
              fill="#9d88e0"
            />
          </svg>
        </div>
        <p className="build-text">
          Building fast, accessible and delightful experiences for web &amp;
          mobile.
        </p>
      </div>
    </div>
  );
}
