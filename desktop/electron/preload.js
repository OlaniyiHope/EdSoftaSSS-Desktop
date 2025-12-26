const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // we’ll add db functions here later
});
