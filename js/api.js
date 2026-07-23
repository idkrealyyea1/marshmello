/* ===== Google Apps Script API Layer ===== */

const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

const API = {
  async get(action, params = {}) {
    const query = new URLSearchParams({ action, ...params }).toString();
    const url = `${SCRIPT_URL}?${query}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async post(action, data = {}) {
    const body = JSON.stringify({ action, ...data });
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: body
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  login(username, password) {
    return this.post("login", { username, password });
  },

  getAvailability(type, year, month) {
    return this.get("getAvailability", { type, year, month });
  },

  getDayDetails(type, date) {
    return this.get("getDayDetails", { type, date });
  },

  submitChaletBooking(data) {
    return this.post("submitChaletBooking", data);
  },

  submitPhotographyBooking(data) {
    return this.post("submitPhotographyBooking", data);
  },

  getAdminStats(year, month) {
    return this.get("getAdminStats", { year, month });
  },

  getAllBookings(type, status, year, month) {
    const params = { type, year, month };
    if (status) params.status = status;
    return this.get("getAllBookings", params);
  },

  updateBookingStatus(bookingId, type, newStatus) {
    return this.post("updateBookingStatus", { bookingId, type, newStatus });
  },

  deleteBooking(bookingId, type) {
    return this.post("deleteBooking", { bookingId, type });
  },

  createPhotographer(data) {
    return this.post("createPhotographer", data);
  },

  getPhotographers() {
    return this.get("getPhotographers");
  },

  getPhotographerBookings(username, year, month) {
    return this.get("getPhotographerBookings", { username, year, month });
  },

  getMyBookings(username) {
    return this.get("getMyBookings", { username });
  }
};
