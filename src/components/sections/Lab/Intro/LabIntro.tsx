import "./LabIntro.css";

/**
 * Section heading — matches the Experience label: top-left, Courier Prime
 * typewriter face, uppercase, with the same hand-drawn wavy underline.
 */
export default function LabHeading() {
  return (
    <div className="lab-heading">
      <span className="lab-heading-title">Experiment Lab</span>
      <p className="lab-heading-sub">
        Hover, pin &amp; explore the tech I build with.
      </p>
    </div>
  );
}
