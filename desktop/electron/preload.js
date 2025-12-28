// const { contextBridge } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//   // we’ll add db functions here later
// });



// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   register: (data) => ipcRenderer.invoke("api/auth/register", data),
// });

// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   register: async (userData) => {
//     return await ipcRenderer.invoke("auth:register", userData);
//   },
// // });
// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   /* ======================
//      AUTH
//   ====================== */
//   register: async (userData) => {
//     console.log("Renderer sending register request:", userData);
//     return ipcRenderer.invoke("auth:register", userData);
//   },

//   /* ======================
//      SUBJECTS
//   ====================== */
//   getSubjects: () => ipcRenderer.invoke("get-subjects"),

//   getSubjectTopics: (subject) =>
//     ipcRenderer.invoke("get-subject-topics", subject),

//   /* ======================
//      QUESTIONS (NEW)
//   ====================== */
//   getQuestionsForSubject: (subject, selectedTopics, limit) =>
//     ipcRenderer.invoke(
//       "get-questions-for-subject",
//       subject,
//       selectedTopics,
//       limit
//     ),
// });
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // AUTH
  register: (userData) =>
    ipcRenderer.invoke("auth:register", userData),

  // SUBJECTS
  getSubjects: () =>
    ipcRenderer.invoke("get-subjects"),

  getSubjectTopics: (subject) =>
    ipcRenderer.invoke("get-subject-topics", subject),

  // ✅ QUESTIONS (MISSING!)
  getQuestionsForSubject: (subject, topics, limit) =>
    ipcRenderer.invoke(
      "get-questions-for-subject",
      subject,
      topics,
      limit
    ),
});
