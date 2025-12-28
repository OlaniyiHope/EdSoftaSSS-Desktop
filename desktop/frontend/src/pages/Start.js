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
import { useNavigate } from "react-router-dom";

const Start = () => {
  const [activeTab, setActiveTab] = useState("key");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examConfig, setExamConfig] = useState(null);
  const [activeSubject, setActiveSubject] = useState("");
  const [questionsBySubject, setQuestionsBySubject] = useState({}); // ✅ top-level

  // Load exam config
  useEffect(() => {
    const stored = localStorage.getItem("examConfig");
    if (stored) {
      const parsed = JSON.parse(stored);
      setExamConfig(parsed);

      const firstSubject = Object.keys(parsed.subjects)[0];
      setActiveSubject(firstSubject);
    }
  }, []);

  // Fetch all subjects' questions
  useEffect(() => {
    if (!examConfig) return;

    const allSubjects = Object.keys(examConfig.subjects);
    allSubjects.forEach((subject) => {
      const config = examConfig.subjects[subject];
      window.api
        .getQuestionsForSubject(subject, config.selectedTopics, 50)
        .then((data) => {
          setQuestionsBySubject((prev) => ({
            ...prev,
            [subject]: data
          }));

          // Set first subject questions
          if (!questions.length && subject === allSubjects[0]) {
            setQuestions(data);
            setCurrentIndex(0);
            setActiveSubject(subject);
          }
        });
    });
  }, [examConfig]);

  // Switch subject tab
const switchSubject = (subject) => {
  setActiveSubject(subject);
  setQuestions(questionsBySubject[subject] || []);
  setCurrentIndex(0);
};


  // Current question
  const currentQuestion = questions[currentIndex];

  // Answer selection
  const handleSelectOption = (key) => {
    setAnswers((prev) => ({
      ...prev,
      [`${activeSubject}-${currentIndex}`]: key, // track per subject
    }));
  };

  // Navigation
  const goNext = () => currentIndex < questions.length - 1 && setCurrentIndex(i => i + 1);
  const goPrev = () => currentIndex > 0 && setCurrentIndex(i => i - 1);

  // Submit
  const handleSubmit = () => {
    // Flatten all subjects questions
    const allQuestions = Object.keys(questionsBySubject)
      .map(sub => questionsBySubject[sub].map((q, i) => ({ ...q, globalIndex: `${sub}-${i}`, subject: sub })))
      .flat();

    let correct = 0;
    allQuestions.forEach((q) => {
      const userAnswer = answers[q.globalIndex];
      const correctAnswer = q.Answer?.replace(/<[^>]+>/g, "");
      if (userAnswer === correctAnswer) correct++;
    });

    const total = allQuestions.length;
    const scoredMarks = correct * 2;
    const totalMarks = total * 2;
    const scorePercent = Math.round((scoredMarks / totalMarks) * 100);

    navigate("/performance-history", {
      state: {
        totalQuestions: total,
        correctAnswers: correct,
        scorePercent,
        answers,
        questions: allQuestions,
      },
    });
  };

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

       <button className="submit-test-btn" onClick={handleSubmit}>
        Submit test
      </button>
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
      className={`exam-tab ${subject === activeSubject ? "active" : ""}`}
      onClick={() => switchSubject(subject)}
    >
      {subject}
    </button>
))}

</div>

        </div>
{/* QUESTION PANEL */}
<section className="question-panel">
  <p className="question-count">
    Question {currentIndex + 1} of {questions.length}
  </p>

  {/* QUESTION */}
  <div
    className="question-box"
    dangerouslySetInnerHTML={{
      __html: currentQuestion?.Question || "",
    }}
  />

  {/* OPTIONS */}

 <div className="options">
  {currentQuestion?.Options?.map((opt) => (
    <label key={opt.Key} className="option">
      <input
        type="radio"
        name={`question-${currentIndex}`}
        checked={answers[`${activeSubject}-${currentIndex}`] === opt.Key}
        onChange={() => handleSelectOption(opt.Key)}
      />
      <span dangerouslySetInnerHTML={{ __html: opt.Value }} />
    </label>
  ))}
</div>


  {/* NAVIGATION */}
  <div className="question-nav">
    <button
      className="nav-btn"
      onClick={goPrev}
      disabled={currentIndex === 0}
    >
      ← Previous
    </button>

    <button
      className="nav-btn primary"
      onClick={goNext}
      disabled={currentIndex === questions.length - 1}
    >
      Next →
    </button>
  </div>

  {/* QUESTION GRID */}
 
    <div className="question-grid">
  {questions.map((_, i) => (
    <button
      key={i}
      className={`grid-btn ${
        i === currentIndex
          ? "active"
          : answers[`${activeSubject}-${i}`]
          ? "answered"
          : ""
      }`}
      onClick={() => setCurrentIndex(i)}
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
