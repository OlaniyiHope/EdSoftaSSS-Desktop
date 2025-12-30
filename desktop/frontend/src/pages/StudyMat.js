import { useState, useEffect } from "react";
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
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState("");
  const [content, setContent] = useState("");
  const [playing, setPlaying] = useState(false);

  /* =======================
     LOAD SUBJECTS
  ======================= */
  useEffect(() => {
    console.log("🚀 StudyMat mounted");
    console.log("window.api =", window.api);

    if (!window.api?.getSubjects) {
      console.error("❌ getSubjects not found in preload");
      return;
    }

    window.api.getSubjects()
      .then((data) => {
        console.log("✅ Subjects loaded:", data);
        setSubjects(data);
        if (data.length) setSubject(data[0]);
      })
      .catch((err) => {
        console.error("❌ Failed to load subjects:", err);
      });
  }, []);

  /* =======================
     LOAD TOPICS
  ======================= */
  useEffect(() => {
    if (!subject) return;

    console.log("📘 Selected subject:", subject);

    if (!window.api?.getSubjectTopics) {
      console.error("❌ getSubjectTopics not found in preload");
      return;
    }

    window.api.getSubjectTopics(subject)
      .then((files) => {
        console.log("📂 Topics loaded:", files);
        setTopics(files);
        if (files.length) setActiveTopic(files[0]);
      })
      .catch((err) => {
        console.error("❌ Failed to load topics:", err);
      });
  }, [subject]);

  /* =======================
     LOAD CONTENT (HTML)
  ======================= */
  useEffect(() => {
    if (!subject || !activeTopic) return;

    console.log("📄 Loading content:", subject, activeTopic);

    if (!window.api?.getStudyContent) {
      console.error("❌ getStudyContent not found in preload");
      return;
    }

    window.api.getStudyContent(subject, activeTopic)
      .then((html) => {
        console.log("✅ Content loaded (length):", html?.length);
        setContent(html);
      })
      .catch((err) => {
        console.error("❌ Failed to load content:", err);
      });
  }, [subject, activeTopic]);

  return (
    <div className="study-layout">
      {/* LEFT */}
      <aside className="study-sidebar">
        <div className="subject-dropdown">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FaChevronDown />
        </div>

        <div className="topic-list">
          {topics.map((file) => (
            <div
              key={file}
              className={`topic-item ${
                activeTopic === file ? "active" : ""
              }`}
              onClick={() => setActiveTopic(file)}
            >
              <FaBook />
              <div>
                <strong>{file}</strong>
                <small>Study material</small>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="study-content">
        <header className="study-header">
          <h2>
            {subject} {activeTopic && `| ${activeTopic}`}
          </h2>
          <button className="practice-btn">
            Practice on this theme
          </button>
        </header>

        <section className="content-card">
          {content ? (
            <article
              className="content-body"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p style={{ padding: 20 }}>📄 No content loaded</p>
          )}
        </section>

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
