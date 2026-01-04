
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const { machineIdSync } = require("node-machine-id");

let db;

// Disable GPU to remove EGL errors on macOS
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");

function getDeviceId() {
  return machineIdSync(true); // true = hashed & stable
}
function normalizeProductKey(raw) {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .match(/.{1,5}/g)
    .join("-");
} 
/* =========================
   CREATE WINDOW
========================= */

app.setName("EdSofta App"); // 👈 APP DISPLAY NAME

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
      icon: __dirname + "/assets/edlogo.jpg",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000"); // React dev server

}

/* =========================
   DATABASE INIT
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

  db.prepare(`
  CREATE TABLE IF NOT EXISTS activation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT,
    is_active INTEGER DEFAULT 0,
    activated_at DATETIME
  )
`).run();


}


/* =========================
   IPC: AUTH
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

// IPC: LOGIN
ipcMain.handle("auth:login", async (_event, payload) => {
  const { email, password } = payload;

  try {
    // Fetch user from DB
    const userRow = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!userRow) {
      return { status: false, message: "User not found" };
    }

    // Check password using bcrypt
    const isValid = bcrypt.compareSync(password, userRow.password);
    if (!isValid) {
      return { status: false, message: "Incorrect password" };
    }

    // Return user info (without password)
    const user = {
      fullname: userRow.fullname,
      username: userRow.username,
      email: userRow.email,
      phone: userRow.phone,
    };

    return { status: true, user };
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return { status: false, message: "Login failed" };
  }
});

/* =========================
   IPC: EXAM SUBJECTS
========================= */
const SUBJECT_DIR = path.join(__dirname, "subject");

ipcMain.handle("get-subjects", async () => {
  if (!fs.existsSync(SUBJECT_DIR)) return [];
  return fs
    .readdirSync(SUBJECT_DIR)
    .filter((name) => fs.statSync(path.join(SUBJECT_DIR, name)).isDirectory());
});

ipcMain.handle("get-subject-topics", async (_event, subject) => {
  const topicsPath = path.join(SUBJECT_DIR, subject, "Topics.json");
  if (!fs.existsSync(topicsPath)) return [];
  const data = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
  return data.map((topic) => topic.Name);
});

ipcMain.handle("get-questions-for-subject", async (_event, subject, selectedTopics = [], limit = 50) => {
  const topicsPath = path.join(SUBJECT_DIR, subject, "Topics.json");
  if (!fs.existsSync(topicsPath)) return [];

  const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
  let allQuestions = [];

  for (const topic of topicsData) {
    if (selectedTopics.length && !selectedTopics.includes(topic.Name)) continue;

    for (const qRef of topic.Questions) {
      const yearFile = path.join(SUBJECT_DIR, subject, `${qRef.Year}.json`);
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

  allQuestions.sort(() => Math.random() - 0.5);
  return allQuestions.slice(0, limit);
});
// ipcMain.handle("api:activate", async (_event, { licenseKey }) => {
//   if (!licenseKey) {
//     return { status: 400, message: "License key is required" };
//   }

//   try {
//     const res = await fetch("https://www.edsofta.com/api/usr", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         activationKey: licenseKey,
//         deviceId: getDeviceId(), // very important
//         platform: "desktop",
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return { status: res.status, message: data.message };
//     }

//     // Save locally AFTER server approves
//     saveActivationLocally(data);

//     return { status: 200, message: "Activated successfully" };
//   } catch (err) {
//     return { status: 500, message: "Network error" };
//   }
// });

// function getOrCreateProductKey() {
//   const filePath = path.join(app.getPath("userData"), "activation.json");

//   try {
//     if (fs.existsSync(filePath)) {
//       const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//       if (data.productKey) return data.productKey;
//     }

//     // If no productKey exists, generate one
//     const deviceId = getDeviceId();
//     const productKey = normalizeProductKey(deviceId.replaceAll("-", ""));

//     // Save it to activation.json
//     const fileData = fs.existsSync(filePath)
//       ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
//       : {};
//     fileData.productKey = productKey;
//     fs.writeFileSync(filePath, JSON.stringify(fileData));

//     console.log("[getOrCreateProductKey] Generated productKey:", productKey);
//     return productKey;
//   } catch (err) {
//     console.error("[getOrCreateProductKey] Error:", err);
//     return null;
//   }
// }
function getOrCreateProductKey() {
  try {
    const filePath = path.join(app.getPath("userData"), "activation.json");

    console.log("[ProductKey] userData path:", app.getPath("userData"));

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      console.log("[ProductKey] Existing file:", data);

      if (data.productKey) {
        console.log("[ProductKey] Using saved productKey");
        return data.productKey;
      }
    }

    const deviceId = getDeviceId();
    console.log("[ProductKey] Device ID:", deviceId);

    const productKey = normalizeProductKey(deviceId);
    console.log("[ProductKey] Generated productKey:", productKey);

    fs.writeFileSync(
      filePath,
      JSON.stringify({ productKey }, null, 2)
    );

    return productKey;
  } catch (err) {
    console.error("[getOrCreateProductKey] Fatal error:", err);
    return null;
  }
}

// function getProductKey() {
//   try {
//     const filePath = path.join(app.getPath("userData"), "activation.json");
//     if (!fs.existsSync(filePath)) return null;

//     const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     return data.productKey || null;
//   } catch (err) {
//     console.error("[getProductKey] Error reading productKey:", err);
//     return null;
//   }
// }


// ipcMain.handle("api:activate", async (_event, { licenseKey }) => {
//   const deviceId = getDeviceId();
//   const productKey = normalizeProductKey(deviceId.replaceAll("-", ""));

//   const res = await fetch("https://edsofta.com/api/user/activate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       activationKey: licenseKey,
//       productKey,
//       platform: "desktop",
//     }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     return { status: false, message: data.message };
//   }

//   saveActivationLocally(data);
//   return { status: true };
// });
// ipcMain.handle("api:activate", async (_event, { licenseKey }) => {
//   try {
//     const deviceId = getDeviceId();
//     const productKey = normalizeProductKey(deviceId.replaceAll("-", ""));
//     const client = process.platform === "darwin" ? "macOs" :
//                    process.platform === "win32" ? "windows" :
//                    process.platform === "linux" ? "linux" : "desktop";

//     const res = await fetch("https://edsofta.com/api/user/activate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         activationKey: licenseKey,
//         productKey,
//         client,
//       }),
//     });

//     const text = await res.text();
//     if (!text || text.trim() === "") {
//       return { status: false, message: "Activation server returned empty response" };
//     }

//     const data = JSON.parse(text);

//     if (!res.ok) {
//       return { status: false, message: data.message || "Activation failed" };
//     }

//     saveActivationLocally(data);
//     return data;

//   } catch (err) {
//     console.error("[Activate] Error:", err);
//     return { status: false, message: "Network error: " + err.message };
//   }
// });

ipcMain.handle("api:activate", async (_event, { licenseKey }) => {
  try {
    const deviceId = getDeviceId();
    const productKey = normalizeProductKey(deviceId.replaceAll("-", ""));
    const client = process.platform === "darwin" ? "macOs" :
                   process.platform === "win32" ? "windows" :
                   process.platform === "linux" ? "linux" : "desktop";

    const res = await fetch("https://edsofta.com/api/user/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activationKey: licenseKey, productKey, client }),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("[Activate] Failed to parse JSON:", text);
      return { status: false, message: "Server returned invalid response" };
    }

    if (!res.ok) {
      return { status: false, message: data.message || "Activation failed" };
    }

    saveActivationLocally(data);
    return data;

  } catch (err) {
    console.error("[Activate] Network error:", err);
    return { status: false, message: "Network error: " + err.message };
  }
});

function saveActivationLocally(data) {
  const filePath = path.join(app.getPath("userData"), "activation.json");

  let existing = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  const file = {
    ...existing,
    token: data.token,
    activatedAt: Date.now(),
    expiresAt: data.expiresAt,
    deviceId: data.deviceId,
  };

  fs.writeFileSync(filePath, JSON.stringify(file));
}


ipcMain.handle("api:activate-with-pin", async (_event, payload) => {
  try {
    console.log("[ActivateWithPin] Payload:", payload);

    const productKey = getOrCreateProductKey();
    console.log("[ActivateWithPin] Product Key:", productKey);

    if (!productKey) {
      return { status: false, message: "Product key not found" };
    }

    // Detect platform dynamically
    const client = process.platform === "darwin" ? "macOs" :
                   process.platform === "win32" ? "windows" :
                   process.platform === "linux" ? "linux" : "desktop";

    const res = await fetch("https://edsofta.com/api/user/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin: payload.pin,
        phoneNumber: payload.phoneNumber,
        type: "pin",
        client,
        productCode: process.env.PRODUCT_CODE || "EDS1500",
        productKey,
      }),
    });

    console.log("[ActivateWithPin] HTTP status:", res.status);

    const text = await res.text();
    console.log("[ActivateWithPin] Raw response:", text);

    if (!text || text.trim() === "") {
      return { status: false, message: "Activation server returned empty response" };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("[ActivateWithPin] JSON parse error:", err);
      return { status: false, message: "Invalid response from activation server" };
    }

    if (!res.ok) {
      return { status: false, message: data.message || "Activation failed" };
    }

    console.log("[ActivateWithPin] Parsed response:", data);
    return data;

  } catch (err) {
    console.error("[ActivateWithPin] Network error:", err);
    return { status: false, message: "Network error: " + err.message };
  }
});


// ipcMain.handle("api:activate-with-pin", async (_e, payload) => {
//   try {
//     console.log("[ActivateWithPin] Payload:", payload);

//     const productKey = getOrCreateProductKey();
//     console.log("[ActivateWithPin] Product Key:", productKey);

//     if (!productKey) {
//       return { status: false, message: "Product key not found" };
//     }

//     const res = await fetch("https://edsofta.com/api/user/activate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         pin: payload.pin,
//         phoneNumber: payload.phoneNumber,
//         type: "pin",
//         client: "desktop",
//         productCode: process.env.PRODUCT_CODE || "DEFAULT_CODE",
//         productKey,
//       }),
//     });

//     console.log("[ActivateWithPin] HTTP status:", res.status);

//     const text = await res.text();
//     console.log("[ActivateWithPin] Raw response:", text);

//     // 🔒 Server returned nothing (500 with empty body)
//     if (!text || text.trim() === "") {
//       return {
//         status: false,
//         message: "Activation server returned empty response",
//       };
//     }

//     // 🔒 Server returned something, but not JSON
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch (err) {
//       console.error("[ActivateWithPin] JSON parse error:", err);
//       return {
//         status: false,
//         message: "Invalid response from activation server",
//       };
//     }

//     // Optional: handle non-200 explicitly
//     if (!res.ok) {
//       return {
//         status: false,
//         message: data.message || "Activation failed",
//       };
//     }

//     console.log("[ActivateWithPin] Parsed response:", data);
//     return data;

//   } catch (err) {
//     console.error("[ActivateWithPin] Network error:", err);
//     return {
//       status: false,
//       message: "Network error: " + err.message,
//     };
//   }
// });




/* =========================
   IPC: STUDY MATERIAL
========================= */
const STUDY_DIR = path.join(__dirname, "study");

ipcMain.handle("study:get-subjects", async () => {
  if (!fs.existsSync(STUDY_DIR)) return [];
  return fs
    .readdirSync(STUDY_DIR)
    .filter((name) => fs.statSync(path.join(STUDY_DIR, name)).isDirectory());
});

ipcMain.handle("study:get-topics", async (_event, subject) => {
  const subjectPath = path.join(STUDY_DIR, subject);
  if (!fs.existsSync(subjectPath)) return [];
  return fs.readdirSync(subjectPath).filter((file) => file.endsWith(".html"));
});

ipcMain.handle("study:get-content", async (_event, { subject, topic }) => {
  const filePath = path.join(STUDY_DIR, subject, topic);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
});

/* =========================
   APP LIFECYCLE
========================= */
app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
