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
// });
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  register: async (userData) => {
    console.log("Renderer sending register request:", userData); // will appear in DevTools
    const result = await ipcRenderer.invoke("auth:register", userData);
    console.log("Renderer received response:", result);
    return result;
  },
});
