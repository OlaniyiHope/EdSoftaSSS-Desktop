
// import { useState } from "react";
// import {
//   FaBell,
//   FaCog,
//   FaHome,
//   FaNewspaper,
//   FaStickyNote,
//   FaPlus
// } from "react-icons/fa";
// import "./admin.css";
// import { useNavigate } from "react-router-dom";

// const StudyMat = () => {
//   const [withTimer, setWithTimer] = useState(false);
//   const [hours, setHours] = useState(30);
//   const [minutes, setMinutes] = useState(0);
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-top">
//           <div className="avatar" />
//           <div className="bell">
//             <FaBell />
//             <span className="badge">23</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <button className="active"><FaHome /> Home</button>
//           <button><FaStickyNote /> Notes</button>
//           <button><FaNewspaper /> News</button>
//           <button><FaCog /> Settings</button>
//         </nav>

//         <button className="add-user">
//           <FaPlus /> Add User
//           <small>4 users added</small>
//         </button>
//       </aside>

//       {/* MAIN BODY */}
//       <main className="body">
//         <h1 className="page-title">Practice Exam</h1>

//         <div className="practice-layout">
//           {/* LEFT */}
//           <section className="practice-left">
//             <div className="intro-box">
//               <div className="intro-icon">📄✏️</div>
//               <p>
//                 Take tests from a very robust repository of contents,
//                 with preferred settings and filters.
//               </p>
//             </div>

//             <div className="timer-section">
//               <h4>Set practice mode</h4>

//               <label className="checkbox">
//                 <input
//                   type="checkbox"
//                   checked={withTimer}
//                   onChange={() => setWithTimer(!withTimer)}
//                 />
//                 With Timer
//               </label>

//               {withTimer && (
//                 <div className="timer-box">
//                   <div className="time-group">
//                     <label>Hours</label>
//                     <div className="time-control">
//                       <button onClick={() => setHours(h => h + 1)}>▲</button>
//                       <span>{hours}</span>
//                       <button onClick={() => setHours(h => Math.max(h - 1, 0))}>▼</button>
//                     </div>
//                   </div>

//                   <span className="colon">:</span>

//                   <div className="time-group">
//                     <label>Minutes</label>
//                     <div className="time-control">
//                       <button onClick={() => setMinutes(m => (m + 1) % 60)}>▲</button>
//                       <span>{minutes.toString().padStart(2, "0")}</span>
//                       <button onClick={() => setMinutes(m => (m - 1 + 60) % 60)}>▼</button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* RIGHT */}
//           <aside className="practice-right">
//             <h4>💡 Select practice type</h4>

//             <label className="select-label">Select exam type</label>
//             <select className="select-box">
//               <option>Objectives</option>
//             </select>

//             <p className="desc">
//               1. Select subjects, number of questions and topics of your choice
//               to properly revise areas in a particular subject.
//             </p>

//         <button
//       className="primary-btn"
//       onClick={() => navigate("/topic")}
//     >
//       Practice by Subject
//     </button>

//             <p className="desc">
//               2. Select subjects, number and year of previous questions of your choice.
//             </p>

//             <button className="primary-btn outline">Practice by Year</button>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default StudyMat;
import { useState } from "react";
import {
  FaChevronDown,
  FaBook,
  FaPlay,
  FaPause,
  FaStop,
  FaHeadphones,
} from "react-icons/fa";
import "./admin.css";

const StudyMat = () => {
  const [subject, setSubject] = useState("Mathematics");
  const [playing, setPlaying] = useState(false);

  const topics = [
    { name: "Surds", lastRead: "Today" },
    { name: "Vector Algebra & Applications", lastRead: "Yesterday" },
    { name: "Vector Algebra", lastRead: "2 September, 2020" },
    { name: "Vector Algebra", lastRead: "2 September, 2020" },
  ];

  return (
    <div className="study-layout">
      {/* LEFT SIDEBAR */}
      <aside className="study-sidebar">
        <div className="subject-dropdown">
          <span>{subject}</span>
          <FaChevronDown />
        </div>

        <div className="topic-list">
          {topics.map((t, i) => (
            <div key={i} className={`topic-item ${i === 0 ? "active" : ""}`}>
              <FaBook />
              <div>
                <strong>{t.name}</strong>
                <small>Last read: {t.lastRead}</small>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="study-content">
        {/* HEADER */}
        <header className="study-header">
          <h2>Mathematics | Surds</h2>
          <button className="practice-btn">Practice on this theme</button>
        </header>

        {/* CONTENT CARD */}
        <section className="content-card">
          <div className="content-banner">
            <h1>Mathematics</h1>
            <p>Surds</p>
          </div>

          <article className="content-body">
            <h1>This is a Plain Header</h1>
            <p>
              It is possible for us to find the value of √36, this gives us 6.
              However, √3, √5, √7 are not possible to estimate.
            </p>

            <h2>Laws of Surd Operations</h2>
            <ol>
              <li>√a + √b ≠ √(a + b)</li>
              <li>√a × √b = √(ab)</li>
              <li>√a ÷ √b = √(a/b)</li>
            </ol>
          </article>
        </section>

        {/* AUDIO PLAYER */}
        <div className="audio-player">
          <FaHeadphones className="audio-icon" />

          <button onClick={() => setPlaying(!playing)}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <button>
            <FaStop />
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudyMat;
