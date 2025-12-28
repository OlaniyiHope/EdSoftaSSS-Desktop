// const { app, BrowserWindow, ipcMain } = require("electron");

// const path = require("path");

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js")
//     }
//   });

//   win.loadURL("http://localhost:3000"); // React dev server
// }
// /* IPC ENDPOINT */
// ipcMain.handle("api/auth/register", async (_, payload) => {
//   return registerUser(payload);
// });


// app.whenReady().then(createWindow);

// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const Database = require("better-sqlite3");
// const bcrypt = require("bcryptjs");

// let db;

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   win.loadURL("http://localhost:3000"); // dev
// }

// // Initialize DB
// function initDatabase() {
//   const dbPath = path.join(app.getPath("userData"), "app.db");
//   db = new Database(dbPath);

//   db.prepare(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       fullname TEXT,
//       username TEXT,
//       email TEXT UNIQUE,
//       phone TEXT,
//       password TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `).run();
// }

// /* =========================
//    IPC: REGISTER USER
// ========================= */
// ipcMain.handle("auth:register", async (_event, payload) => {
//   const { fullname, phone, username, email, password } = payload;

//   try {
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     db.prepare(`
//       INSERT INTO users (fullname, phone, username, email, password)
//       VALUES (?, ?, ?, ?, ?)
//     `).run(fullname, phone, username, email, hashedPassword);

//     return { status: 201 };
//   } catch (err) {
//     if (err.message.includes("UNIQUE")) {
//       return { status: 409, message: "Email already exists" };
//     }

//     console.error("Register error:", err);
//     return { status: 500, message: "Registration failed" };
//   }
// });

// app.whenReady().then(() => {
//   initDatabase();
//   createWindow();
// });

// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const Database = require("better-sqlite3");
// const bcrypt = require("bcryptjs");

// let db;

// // Disable GPU to remove EGL errors in macOS
// app.commandLine.appendSwitch("disable-gpu");
// app.commandLine.appendSwitch("disable-software-rasterizer");

// // // Create the main Electron window
// // function createWindow() {
// //   const win = new BrowserWindow({
// //     width: 1200,
// //     height: 800,
// //     webPreferences: {
// //       preload: path.join(__dirname, "preload.js"), // IPC bridge
// //       nodeIntegration: false, // keep security best practices
// //       contextIsolation: true,
// //     },
// //   });

// //   win.loadURL("http://localhost:3000"); // dev React server
// // }
// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   win.loadURL("http://localhost:3000"); // React dev server

//   // Open DevTools automatically
//   win.webContents.openDevTools();
// }

// // Initialize SQLite DB
// function initDatabase() {
//   // const dbPath = path.join(app.getPath("userData"), "app.db");
//   const dbPath = path.join(__dirname, "app.db"); // __dirname = current folder of main.js

//   db = new Database(dbPath);

//   // Create users table if it doesn't exist
//   db.prepare(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       fullname TEXT,
//       username TEXT,
//       email TEXT UNIQUE,
//       phone TEXT,
//       password TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `).run();
// }

// /* =========================
//    IPC: REGISTER USER
// ========================= */
// ipcMain.handle("auth:register", async (_event, payload) => {
//   console.log("Main process received register payload:", payload);

//   const { fullname, phone, username, email, password } = payload;

//   try {
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     db.prepare(`
//       INSERT INTO users (fullname, phone, username, email, password)
//       VALUES (?, ?, ?, ?, ?)
//     `).run(fullname, phone, username, email, hashedPassword);

//     console.log("User successfully registered:", email);

//     return { status: 201, user: { fullname, username, email, phone } };
//   } catch (err) {
//     if (err.message.includes("UNIQUE")) {
//       console.warn("Email already exists:", email);
//       return { status: 409, message: "Email already exists" };
//     }

//     console.error("Register error:", err);
//     return { status: 500, message: "Registration failed" };
//   }
// });


// // Initialize DB and create window when Electron is ready
// app.whenReady().then(() => {
//   initDatabase();
//   createWindow();

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// // Quit app when all windows are closed (except macOS)
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

// ipcMain.handle("get-subjects", async () => {
//   const subjectDir = path.join(__dirname, "subject");

//   const subjects = fs
//     .readdirSync(subjectDir)
//     .filter((name) =>
//       fs.statSync(path.join(subjectDir, name)).isDirectory()
//     );

//   return subjects;
// });

// ipcMain.handle("get-subject-topics", async (_, subject) => {
//   const topicsPath = path.join(
//     __dirname,
//     "subject",
//     subject,
//     "Topics.json"
//   );

//   if (!fs.existsSync(topicsPath)) return [];

//   const data = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));

//   // Extract unique topics from questions
//   const topics = [
//     ...new Set(
//       Object.values(data).map((q) => q.Topic)
//     )
//   ];

//   return topics;
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

let db;

// Disable GPU to remove EGL errors in macOS
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");

/* =========================
   CREATE WINDOW
========================= */
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();
}

/* =========================
   DATABASE
========================= */
function initDatabase() {
  const dbPath = path.join(__dirname, "app.db");
  db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT,
      username TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

/* =========================
   IPC: AUTH REGISTER
========================= */
ipcMain.handle("auth:register", async (_event, payload) => {
  const { fullname, phone, username, email, password } = payload;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO users (fullname, phone, username, email, password)
      VALUES (?, ?, ?, ?, ?)
    `).run(fullname, phone, username, email, hashedPassword);

    return { status: 201, user: { fullname, username, email, phone } };
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return { status: 409, message: "Email already exists" };
    }
    return { status: 500, message: "Registration failed" };
  }
});

/* =========================
   IPC: SUBJECTS
========================= */
ipcMain.handle("get-subjects", async () => {
  const subjectDir = path.join(__dirname, "subject");

  if (!fs.existsSync(subjectDir)) return [];

  return fs
    .readdirSync(subjectDir)
    .filter((name) =>
      fs.statSync(path.join(subjectDir, name)).isDirectory()
    );
});

ipcMain.handle("get-subject-topics", async (_event, subject) => {
  const topicsPath = path.join(__dirname, "subject", subject, "Topics.json");

  if (!fs.existsSync(topicsPath)) return [];

  const data = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));

  // Extract all topic names
  const topicNames = data.map(topic => topic.Name);

  console.log(`Topics fetched for ${subject}:`, topicNames); // <-- debug

  return topicNames;
});
ipcMain.handle(
  "get-questions-for-subject",
  async (_event, subject, selectedTopics = [], limit = 50) => {
    const topicsPath = path.join(__dirname, "subject", subject, "Topics.json");

    if (!fs.existsSync(topicsPath)) return [];

    const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));

    let allQuestions = [];

    for (const topic of topicsData) {
      if (selectedTopics.length && !selectedTopics.includes(topic.Name)) {
        continue; // skip if topic not selected
      }

      // Each topic has a Questions array with Year + Number
      for (const qRef of topic.Questions) {
        const yearFile = path.join(
          __dirname,
          "subject",
          subject,
          `${qRef.Year}.json`
        );

        if (!fs.existsSync(yearFile)) continue;

        const yearData = JSON.parse(fs.readFileSync(yearFile, "utf-8"));

        const questionKey = `Question ${qRef.Number}`;
        const question = yearData[questionKey];

        if (question) {
          allQuestions.push({
            ...question,
            Topic: topic.Name,
            Year: qRef.Year,
          });
        }
      }
    }

    // Shuffle all questions
    allQuestions.sort(() => Math.random() - 0.5);

    // Limit to 50 questions
    return allQuestions.slice(0, limit);
  }
);



/* =========================
   APP LIFECYCLE
========================= */
app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
