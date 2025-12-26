import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import All from "./pages/All";
import Ask from "./pages/Ask";
import Cbt from "./pages/Cbt";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Download from "./pages/Download";
import Exam from "./pages/Exam";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Practice from "./pages/Practice";
import PracticeExam from "./pages/PracticeExam";
import Pricing from "./pages/Pricing";
import Question from "./pages/Question";
import Recommend from "./pages/Recommend";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Study from "./pages/Study";
import Notification from "./pages/Notification";
import AllNoti from "./pages/AllNoti";
import History from "./pages/History";
import ResultHistory from "./pages/ResultHistory";
import BreakHistory from "./pages/BreakHistory";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/cbt" element={<Cbt />} />
          <Route path="/" element={<Practice />} />
          <Route path="/recommendation" element={<Recommend />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/practice-exam" element={<PracticeExam />} />
          <Route path="/dashboards" element={<AdminDashboard />} />
          <Route path="/practice-for-utme" element={<All />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/all-notification" element={<AllNoti />} />
          <Route path="/result-history" element={<ResultHistory />} />
          <Route path="/result-history-breakdown" element={<BreakHistory />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Services />} />
          <Route path="/download" element={<Download />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/start-exam" element={<Exam />} />
          <Route path="/cbt" element={<Cbt />} />
          <Route path="/question" element={<Question />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
