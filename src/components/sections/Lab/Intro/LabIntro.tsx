import "./LabIntro.css";

/** Section heading — top-left, Courier Prime, all-black with a curvy underline. */
export default function LabHeading() {
  return (
    <div className="lab-heading">
      <h2 className="lab-heading-title">
        Experiment <span>Lab</span>
      </h2>
      <p className="lab-heading-sub">Explore the technologies I build with.</p>
    </div>
  );
}
