import { useState } from "react";
import {
  FaBell,
  FaCog,
  FaHome,
  FaNewspaper,
  FaStickyNote
} from "react-icons/fa";
import AddUser from "./AddUser";
import "./admin.css";

const Topic = () => {
  const [activeTab, setActiveTab] = useState("key");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar" />
          <div className="bell">
            <FaBell />
            <span className="badge">23</span>
          </div>
        </div>

        <nav>
          <button className="active"><FaHome /> Home</button>
          <button><FaStickyNote /> Notes</button>
          <button><FaNewspaper /> News</button>
          <button><FaCog /> Settings</button>
        </nav>

        <AddUser open={showModal} onClose={() => setShowModal(false)} />
      </aside>

{/* MAIN */}
<main className="bodys">
  <header className="headers">
    <h1>Practice by Topic</h1>
  </header>

  <section className="topic-container">

    {/* ADD SUBJECT BUTTON */}
    <button className="add-subject-btn">
      + Add Practice Subjects
    </button>

    {/* SUBJECT LIST */}
    <div className="subject-list">

      {[
        "Mathematics",
        "English Language",
        "Physics",
        "Chemistry",
        "Biology",
        "Economics",
        "Government",
        "Literature"
      ].map((subject, index) => (
        <label key={index} className="subject-item">
          <input type="checkbox" />
          <span>{subject}</span>
        </label>
      ))}

    </div>

    {/* START TEST */}
    <button className="start-test-btn">
      Start Test
    </button>

  </section>
</main>


    </div>
  );
};

export default Topic;
