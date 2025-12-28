import { useState, useEffect } from "react";
import {
  FaBell,
  FaCog,
  FaHome,
  FaNewspaper,
  FaStickyNote
} from "react-icons/fa";
import AddUser from "./AddUser";
import "./admin.css";
import TopicModal from "./TopicModal";

const Start = () => {
  const [activeTab, setActiveTab] = useState("key");
  const [showModal, setShowModal] = useState(false);


const [examConfig, setExamConfig] = useState(null);
const [activeSubject, setActiveSubject] = useState("");

useEffect(() => {
  const stored = localStorage.getItem("examConfig");
  if (stored) {
    const parsed = JSON.parse(stored);
    setExamConfig(parsed);

    const firstSubject = Object.keys(parsed.subjects)[0];
    setActiveSubject(firstSubject);
  }
}, []);


  return (
   <div className="dashboard exam-dashboard">
      {/* LEFT EXAM SIDEBAR */}
      <aside className="exam-sidebar">
        <div className="user-box">
          <span className="label">Current user</span>
          <div className="user-info">
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="user-avatar"
            />
            <span>Boluwaite O.</span>
          </div>
          <button className="logout-btn">Log out</button>
        </div>

        <div className="timer-box">
          <span className="label">Time left</span>
          <div className="timer">00:29:13</div>
        </div>

        <div className="tools">
          <button>＋ Save Question</button>
          <button>🧮 Calculator</button>
          <button>⚠️ Report Error</button>
        </div>

        <button className="submit-test-btn">Submit test</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="exam-main exam-content">
        {/* SUBJECT TABS */}
        <div className="exam-tabs">
        <div className="exam-tabs">
  {examConfig &&
    Object.keys(examConfig.subjects).map((subject) => (
      <button
        key={subject}
        className={`exam-tab ${
          subject === activeSubject ? "active" : ""
        }`}
        onClick={() => setActiveSubject(subject)}
      >
        {subject}
      </button>
    ))}
</div>

        </div>

        {/* QUESTION PANEL */}
        <section className="question-panel">
          <p className="question-count">Question 1 of 30</p>

          <div className="question-box">
            Sunt adipisicing incididunt veniam anim mollit pariatur ex
            nostrud consequat ad eiusmod mollit ea. Irure qui commodo est
            Lorem nulla sit irure. Culpa cillum occaecat cupidatat mollit
            sit cillum deserunt officia ad occaecat occaecat.
          </div>

          <div className="options">
            {[
              "Nisi minim esse nulla laboris elit occaecat id anim tempor fugiat do.",
              "Labore excepteur nostrud occaecat sint aliquip consectetur non minim ullamco.",
              "Deserunt ullamco commodo quis et duis ullamco enim cupidatat ipsum excepteur id eu duis.",
              "Dolor ullamco irure ea qui minim esse."
            ].map((opt, i) => (
              <label key={i} className="option">
                <input type="radio" name="answer" />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {/* NAVIGATION */}
          <div className="question-nav">
            <button className="nav-btn">← Previous</button>
            <button className="nav-btn primary">Next →</button>
          </div>

          {/* QUESTION NUMBERS */}
          <div className="question-grid">
            {[...Array(30)].map((_, i) => (
              <button
                key={i}
                className={`grid-btn ${
                  i === 0 ? "active" : i === 4 ? "answered" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Start;
