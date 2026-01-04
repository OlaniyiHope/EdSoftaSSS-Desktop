
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // =====================
  // AUTH
  // =====================
  register: (userData) =>
    ipcRenderer.invoke("auth:register", userData),
  login: (userData) => ipcRenderer.invoke("auth:login", userData),

activateApp: (licenseKey) =>
  ipcRenderer.invoke("api:activate", { licenseKey }),
 activateWithPin: (data) =>
    ipcRenderer.invoke("api:activate-with-pin", data),

   getPlatform: () => {
    const platform = process.platform;
    if (platform === "darwin") return "macOs";
    if (platform === "win32") return "windows";
    if (platform === "linux") return "linux";
    return "desktop"; // fallback
  },

  // =====================
  // EXAM SUBJECTS
  // =====================
  getSubjects: () =>
    ipcRenderer.invoke("get-subjects"),                  // Exam subjects

  getSubjectTopics: (subject) =>
    ipcRenderer.invoke("get-subject-topics", subject),   // Exam topics

  // =====================
  // QUESTIONS
  // =====================
  getQuestionsForSubject: (subject, topics, limit) =>
    ipcRenderer.invoke(
      "get-questions-for-subject",
      subject,
      topics,
      limit
    ),

  // =====================
  // 📘 STUDY MATERIAL
  // =====================
  getStudySubjects: () =>
    ipcRenderer.invoke("study:get-subjects"),           // Study subjects (folders)

  getStudyTopics: (subject) =>
    ipcRenderer.invoke("study:get-topics", subject),    // Study topics (HTML files)

  getStudyContent: (subject, topic) =>
    ipcRenderer.invoke("study:get-content", { subject, topic }) // Study content (HTML)
  
});
