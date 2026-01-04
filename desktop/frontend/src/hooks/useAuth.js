// const useAuth = () => {
//   // Register a new user
//   const register = async (fullname, phone, username, email, password) => {
//     console.log("useAuth.register called with:", { fullname, phone, username, email, password });

//     if (!window.api?.register) {
//       console.error("Electron API not available");
//       throw new Error("Electron API not available");
//     }

//     const response = await window.api.register({ fullname, phone, username, email, password });
//     console.log("useAuth.register response:", response);

//     // Save user info locally if registration is successful
//     if ((response.status === 201 || response.status === true) && response.user) {
//       // Save to localStorage
//       let users = JSON.parse(localStorage.getItem("users")) || [];
//       users.push({ ...response.user, password }); // store password for local login
//       localStorage.setItem("users", JSON.stringify(users));
//       console.log("User info saved to localStorage:", response.user);
//     }

//     return response;
//   };

//   // Login an existing user
//   const login = async (email, password) => {
//     console.log("useAuth.login called with:", { email, password });

//     // First, check Electron API if available
//     if (window.api?.login) {
//       const response = await window.api.login({ email, password });
//       if (response.status !== true) throw new Error(response.message || "Login failed");

//       // Save logged-in user locally
//       localStorage.setItem("loggedInUser", JSON.stringify(response.user));
//       console.log("Logged in via Electron API:", response.user);
//       return response.user;
//     }

//     // Fallback: Check localStorage
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const user = users.find((u) => u.email === email);
//     if (!user) {
//       console.error("User not found in localStorage");
//       throw new Error("User not found");
//     }

//     if (user.password !== password) {
//       console.error("Incorrect password");
//       throw new Error("Incorrect password");
//     }

//     // Save logged-in user
//     localStorage.setItem("loggedInUser", JSON.stringify(user));
//     console.log("Logged in via localStorage:", user);
//     return user;
//   };

//   return { register, login };
// };

// export default useAuth;
const useAuth = () => {
  // Register user
  const register = async (fullname, phone, username, email, password) => {
    if (!window.api?.register) throw new Error("Electron API not available");

    const response = await window.api.register({ fullname, phone, username, email, password });

    if ((response.status === 201 || response.status === true) && response.user) {
      // Save locally for fallback
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ ...response.user, password });
      localStorage.setItem("users", JSON.stringify(users));
    }

    return response;
  };

  // Login user
  const login = async (email, password) => {
    console.log("Logging in with:", { email, password });

    // Use Electron API first
    if (window.api?.login) {
      try {
        const response = await window.api.login({ email, password });
        console.log("Electron API login response:", response);

        if (!response.status) throw new Error(response.message || "Login failed");

        localStorage.setItem("loggedInUser", JSON.stringify(response.user));
        return response.user;
      } catch (err) {
        console.error("Electron login failed:", err);
        // Fallback to localStorage
      }
    }

    // Fallback: localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Incorrect password");

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return user;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("loggedInUser");
  };

  return { register, login, logout };
};

export default useAuth;
