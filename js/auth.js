/* ===== Authentication & Session Management ===== */

const Auth = {
  SESSION_KEY: "marshmallow_session",

  getSession() {
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(data) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  },

  clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  isLoggedIn() {
    const s = this.getSession();
    return s && s.username && s.role;
  },

  getRole() {
    const s = this.getSession();
    return s ? s.role : null;
  },

  getUsername() {
    const s = this.getSession();
    return s ? s.username : null;
  },

  isAdmin() {
    return this.getRole() === "admin";
  },

  isPhotographer() {
    return this.getRole() === "photographer";
  },

  requireAuth(role) {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    if (role && this.getRole() !== role) {
      if (this.isAdmin()) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "photography.html";
      }
      return false;
    }
    return true;
  },

  /* === TEMP TEST USERS (remove before production) === */
  TEST_USERS: {
    "admin":    { password: "admin123",    role: "admin",        fullName: "Admin User" },
    "photographer": { password: "photo123", role: "photographer", fullName: "Test Photographer" }
  },

  async login(username, password) {
    /* TEMP: check local test users first (remove when GAS is live) */
    if (this.TEST_USERS[username] && this.TEST_USERS[username].password === password) {
      const user = this.TEST_USERS[username];
      this.setSession({ username, role: user.role, fullName: user.fullName });
      return { success: true, username, role: user.role, fullName: user.fullName };
    }

    const result = await API.login(username, password);
    if (result.success) {
      this.setSession({
        username: result.username,
        role: result.role,
        fullName: result.fullName || ""
      });
    }
    return result;
  },

  logout() {
    this.clearSession();
    window.location.href = "login.html";
  }
};
