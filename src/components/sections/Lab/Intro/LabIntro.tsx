import "./LabIntro.css";

/** Section heading — top-left; "stack" gets the whiteboard-style coral script
 *  accent (Sacramento in coral), over a curvy underline. */
export default function LabHeading() {
  return (
    <div className="lab-heading">
      <h2 className="lab-heading-title">
        My Tech <em>stack</em>
      </h2>
      <p className="lab-heading-sub">Explore the technologies I build with.</p>
    </div>
  );
}
