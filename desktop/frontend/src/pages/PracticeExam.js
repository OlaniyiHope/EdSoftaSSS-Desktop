
import { useState } from "react";

import {
    FaBell,
    FaCog,
    FaHome,
    FaNewspaper,
    FaStickyNote
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useAuth from "../hooks/useAuth";
import AddUser from "./AddUser";
import "./admin.css";
import { useSidebar } from "./SidebarProvider";
const PracticeExam = () => {
  const { user } = useAuth(); // Access the authenticated user
  const [points, setPoints] = useState([]);
  const { isSidebarOpen } = useSidebar(); // use context to get sidebar state
  const [showModal, setShowModal] = useState(false);
const [openTerm, setOpenTerm] = useState(null);
const [practiceMode, setPracticeMode] = useState("topic");
const [hours, setHours] = useState(1);
const [minutes, setMinutes] = useState(0);

const toggleTerm = (term) => {
  setOpenTerm(openTerm === term ? null : term);
};
  const [selected, setSelected] = useState("");

  const handleClick = (type) => {
    setSelected(type);
    console.log("Selected practice type:", type);
  };

 return (
  <div className="dashboard">
    {/* SIDEBAR — 20% */}
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar" />
        <div className="bell">
          <FaBell />
          <span className="badge">23</span>
        </div>
      </div>

      <nav>
        <button className="active">
          <FaHome /> Home
        </button>
        <button>
          <FaStickyNote /> Notes
        </button>
        <button>
          <FaNewspaper /> News
        </button>
        <button>
          <FaCog /> Settings
        </button>
      </nav>


<AddUser
  open={showModal}
  onClose={() => setShowModal(false)}
/>

    </aside>
<main className="bodys">
  <header className="headers">
    <div>
      <h1>Practice Exam</h1>
    </div>
  </header>

  {/* FLEX CONTAINER */}
  <div className="practice-layout">

    {/* LEFT — 60% */}
{/* LEFT — 60% */}
<section className="practice-left">
  <div className="study-intro">
    <div className="study-icon">📘</div>

    <p className="study-text">
      Take tests from a very robust repository of contents, with preferred
      settings and filters.
    </p>
  </div>

  {/* PRACTICE MODE */}
  <div className="practice-mode">
    <h4>Select Practice Mode</h4>

    <div className="mode-options">
      <button
        className={practiceMode === "topic" ? "active" : ""}
        onClick={() => setPracticeMode("topic")}
      >
        Practice by Topic
      </button>

      <button
        className={practiceMode === "year" ? "active" : ""}
        onClick={() => setPracticeMode("year")}
      >
        Practice by Year
      </button>

      <button
        className={practiceMode === "mixed" ? "active" : ""}
        onClick={() => setPracticeMode("mixed")}
      >
        Mixed Practice
      </button>
    </div>
  </div>

  {/* TIMER SETUP */}
  <div className="timer-setup">
    <h4>Set Exam Duration</h4>

    <div className="timer-box">
      {/* HOURS */}
      <div className="time-unit">
        <button onClick={() => setHours((h) => Math.min(h + 1, 5))}>▲</button>
        <span>{String(hours).padStart(2, "0")}</span>
        <button onClick={() => setHours((h) => Math.max(h - 1, 0))}>▼</button>
        <small>Hours</small>
      </div>

      <span className="colon">:</span>

      {/* MINUTES */}
      <div className="time-unit">
        <button
          onClick={() =>
            setMinutes((m) => (m + 5) % 60)
          }
        >
          ▲
        </button>
        <span>{String(minutes).padStart(2, "0")}</span>
        <button
          onClick={() =>
            setMinutes((m) => (m - 5 + 60) % 60)
          }
        >
          ▼
        </button>
        <small>Minutes</small>
      </div>
    </div>
  </div>
</section>


    {/* RIGHT — 20% */}
    <aside className="practice-right">
      <div className="practice-filter">
        <h4> Select Practice Type</h4>
<div>

     <h5> Select Exam Type</h5>
    <select>
       
          <option value="">Objectives</option>
          <option value="topic">Theory</option>
          <option value="year">Fill in the gap</option>
          <option value="mixed">Blank</option>
        </select>
</div>
    
 <div>
      <p>
        1. Select subjects, number of questions and topics of your choice to properly revise areas in a particular subject.
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => handleClick("Practice by Topic")}
          className={selected === "Practice by Topic" ? "active-btn" : ""}
        >
          Practice by Topic
        </button>
        <button
          onClick={() => handleClick("Theory")}
          className={selected === "Theory" ? "active-btn" : ""}
        >
          Theory
        </button>
        <button
          onClick={() => handleClick("Fill in the gap")}
          className={selected === "Fill in the gap" ? "active-btn" : ""}
        >
          Fill in the gap
        </button>
        <button
          onClick={() => handleClick("Blank")}
          className={selected === "Blank" ? "active-btn" : ""}
        >
          Blank
        </button>
      </div>


<p>2. Select subjects, number and year of previous questions of your choice. </p>
    <select>
       
          <option value="">Practice by Topic</option>
          <option value="topic">Theory</option>
          <option value="year">Fill in the gap</option>
          <option value="mixed">Blank</option>
        </select>
</div>
    
      </div>
    </aside>

  </div>
</main>


    
  </div>
);

};

export default PracticeExam;
