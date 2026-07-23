/**
 * Marshmallow — Photo Chalet & Events
 * Google Apps Script Backend
 *
 * Deploy as: Web App → Execute as Me → Anyone can access
 *
 * Sheets:
 *   Users, ChaletBookings, PhotographyBookings, Settings,
 *   Pricing, Testimonials, Backups
 *
 * PhotographyBookings columns:
 *   A:id B:customerName C:date D:hour E:status F:notes G:price H:createdAt I:customerName J:phone
 */

const SPREADSHEET_ID = "1Wl7cx_1RyWl8AFw9iwrNtI2iReVKCYsONlGfszSLJkg";

function doGet(e) {
  const action = e.parameter.action;
  switch (action) {
    case "getAvailability":     return jsonResponse(getAvailability(e.parameter));
    case "getDayDetails":       return jsonResponse(getDayDetails(e.parameter));
    case "getPrice":            return jsonResponse(getPrice(e.parameter));
    case "getAdminStats":       return jsonResponse(getAdminStats(e.parameter));
    case "getAllBookings":       return jsonResponse(getAllBookings(e.parameter));
    case "getPhotographers":    return jsonResponse(getPhotographers());
    case "getPhotographerBookings": return jsonResponse(getPhotographerBookings(e.parameter));
    case "getMyBookings":       return jsonResponse(getMyBookings(e.parameter));
    case "getTestimonials":     return jsonResponse(getTestimonials());
    case "exportBookings":      return jsonResponse(exportBookings(e.parameter));
    case "exportAllData":       return jsonResponse(exportAllData());
    case "getBackupHistory":    return jsonResponse(getBackupHistory());
    default: return jsonResponse({ success: false, message: "Unknown action" });
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  switch (action) {
    case "login":                   return jsonResponse(handleLogin(data));
    case "submitChaletBooking":     return jsonResponse(submitChaletBooking(data));
    case "submitPhotographyBooking": return jsonResponse(submitPhotographyBooking(data));
    case "updateBookingStatus":     return jsonResponse(updateBookingStatus(data));
    case "deleteBooking":           return jsonResponse(deleteBooking(data));
    case "createPhotographer":      return jsonResponse(createPhotographer(data));
    case "updateTestimonialStatus": return jsonResponse(updateTestimonialStatus(data));
    case "deleteTestimonial":       return jsonResponse(deleteTestimonial(data));
    case "createBackup":            return jsonResponse(createBackup());
    default: return jsonResponse({ success: false, message: "Unknown action" });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(name);
}

function getSettings() {
  const sheet = getSheet("Settings");
  if (!sheet) return { openingHour: 9, closingHour: 24, slotDurationMinutes: 60 };
  const data = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < data.length; i++) settings[data[i][0]] = data[i][1];
  return {
    openingHour: parseInt(settings.openingHour) || 9,
    closingHour: parseInt(settings.closingHour) || 24,
    slotDurationMinutes: parseInt(settings.slotDurationMinutes) || 60
  };
}

function computeHash(password) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

// ===================== AUTH =====================
function handleLogin(data) {
  const { username, password } = data;
  const sheet = getSheet("Users");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username && rows[i][6] !== false) {
      if (rows[i][1] === computeHash(password)) {
        return { success: true, username: rows[i][0], role: rows[i][2], fullName: rows[i][3] };
      }
    }
  }
  return { success: false, message: "Invalid credentials" };
}

// ===================== PRICING =====================
function getPrice(params) {
  const { service, bookingType, dayOfWeek } = params;
  const sheet = getSheet("Pricing");
  if (!sheet) return { success: true, price: 0 };

  const rows = sheet.getDataRange().getValues();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayName = dayNames[parseInt(dayOfWeek)] || dayNames[0];

  for (let i = 1; i < rows.length; i++) {
    const sService = String(rows[i][0]);
    const sType = String(rows[i][1]);
    const sDay = String(rows[i][2]);
    if (sService === service && sType === bookingType && (sDay === "*" || sDay === dayName)) {
      return { success: true, price: parseFloat(rows[i][3]) || 0 };
    }
  }
  return { success: true, price: 0 };
}

// ===================== AVAILABILITY =====================
function getAvailability(params) {
  const { type, year, month } = params;
  const sheetName = type === "chalet" ? "ChaletBookings" : "PhotographyBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, data: {} };

  const prefix = `${parseInt(year)}-${String(parseInt(month)).padStart(2, "0")}`;
  const rows = sheet.getDataRange().getValues();
  const dayStatus = {};
  const statusCol = type === "chalet" ? 7 : 4;

  for (let i = 1; i < rows.length; i++) {
    const date = String(rows[i][2]);
    const status = String(rows[i][statusCol]);
    if (date.startsWith(prefix) && status !== "cancelled") {
      if (!dayStatus[date]) dayStatus[date] = { count: 0 };
      dayStatus[date].count++;
    }
  }

  const settings = getSettings();
  const totalSlots = Math.ceil((settings.closingHour - settings.openingHour) * 60 / settings.slotDurationMinutes);
  const result = {};
  Object.keys(dayStatus).forEach(date => {
    result[date] = dayStatus[date].count >= totalSlots ? "booked" : "partial";
  });
  return { success: true, data: result };
}

// ===================== DAY DETAILS =====================
function getDayDetails(params) {
  const { type, date } = params;
  const sheetName = type === "chalet" ? "ChaletBookings" : "PhotographyBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, bookedSlots: [] };
  const rows = sheet.getDataRange().getValues();
  const bookedSlots = [];
  const statusCol = type === "chalet" ? 7 : 4;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === date && String(rows[i][statusCol]) !== "cancelled") {
      bookedSlots.push(String(rows[i][3]));
    }
  }
  return { success: true, bookedSlots };
}

// ===================== SUBMIT BOOKINGS =====================
function submitChaletBooking(data) {
  const sheet = getSheet("ChaletBookings");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === data.date && String(rows[i][3]) === data.hour && String(rows[i][7]) !== "cancelled") {
      return { success: false, message: "Slot already booked" };
    }
  }
  const id = "CB" + new Date().getTime();
  sheet.appendRow([id, data.type || "day", data.date, data.hour, data.customerName,
    data.phone, data.guests || 1, "pending", data.notes || "", data.price || 0, new Date().toISOString()]);
  return { success: true, id };
}

function submitPhotographyBooking(data) {
  const sheet = getSheet("PhotographyBookings");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === data.date && String(rows[i][3]) === data.hour && String(rows[i][4]) !== "cancelled") {
      return { success: false, message: "Slot already booked" };
    }
  }
  const id = "PB" + new Date().getTime();
  sheet.appendRow([id, data.customerName || "", data.date, data.hour, "pending",
    data.notes || "", data.price || 0, new Date().toISOString(), data.customerName || "", data.phone || ""]);
  return { success: true, id };
}

// ===================== ADMIN ACTIONS =====================
function updateBookingStatus(data) {
  const { bookingId, type, newStatus } = data;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  const statusCol = sheetName === "PhotographyBookings" ? 4 : 7;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === bookingId) {
      sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);
      return { success: true };
    }
  }
  return { success: false, message: "Not found" };
}

function deleteBooking(data) {
  const { bookingId, type } = data;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === bookingId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: "Not found" };
}

// ===================== STATS =====================
function getAdminStats(params) {
  const { year, month } = params;
  const useFilter = parseInt(year) > 0 && parseInt(month) > 0;
  const prefix = useFilter ? `${parseInt(year)}-${String(parseInt(month)).padStart(2, "0")}` : "";
  let chaletTotal = 0, photoTotal = 0, confirmed = 0, pending = 0;
  const dailyBookings = {};
  const photographerCounts = {};

  const chaletSheet = getSheet("ChaletBookings");
  if (chaletSheet) {
    const rows = chaletSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const date = String(rows[i][2]);
      const status = String(rows[i][7]);
      if (!useFilter || date.startsWith(prefix)) {
        chaletTotal++;
        if (status === "confirmed") confirmed++;
        if (status === "pending") pending++;
        const day = parseInt(date.split("-")[2]);
        dailyBookings[day] = (dailyBookings[day] || 0) + 1;
      }
    }
  }

  const photoSheet = getSheet("PhotographyBookings");
  if (photoSheet) {
    const rows = photoSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const date = String(rows[i][2]);
      const status = String(rows[i][4]);
      const username = String(rows[i][1]);
      if (!useFilter || date.startsWith(prefix)) {
        photoTotal++;
        if (status === "confirmed") confirmed++;
        if (status === "pending") pending++;
        const day = parseInt(date.split("-")[2]);
        dailyBookings[day] = (dailyBookings[day] || 0) + 1;
        photographerCounts[username] = (photographerCounts[username] || 0) + 1;
      }
    }
  }

  const topPhotographers = Object.entries(photographerCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([username, count]) => ({ username, name: username, count }));

  return { success: true, chaletTotal, photoTotal, confirmed, pending, dailyBookings, topPhotographers };
}

function getAllBookings(params) {
  const { type, status, year, month } = params;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, bookings: [] };
  const useFilter = parseInt(year) > 0 && parseInt(month) > 0;
  const prefix = useFilter ? `${parseInt(year)}-${String(parseInt(month)).padStart(2, "0")}` : "";
  const rows = sheet.getDataRange().getValues();
  const bookings = [];

  for (let i = 1; i < rows.length; i++) {
    const date = String(rows[i][2]);
    if (useFilter && !date.startsWith(prefix)) continue;
    if (type === "photography") {
      const bStatus = String(rows[i][4]);
      if (status && bStatus !== status) continue;
      bookings.push({
        id: rows[i][0], customerName: rows[i][1] || rows[i][8] || "", date,
        hour: String(rows[i][3]), status: bStatus,
        notes: rows[i][5] || "", price: rows[i][6] || 0,
        phone: rows[i][9] || ""
      });
    } else {
      const bStatus = String(rows[i][7]);
      if (status && bStatus !== status) continue;
      bookings.push({
        id: rows[i][0], type: rows[i][1], date, hour: String(rows[i][3]),
        customerName: rows[i][4], phone: rows[i][5], guests: rows[i][6],
        status: bStatus, notes: rows[i][8] || "", price: rows[i][9] || 0
      });
    }
  }
  return { success: true, bookings };
}

// ===================== PHOTOGRAPHERS =====================
function getPhotographers() {
  const sheet = getSheet("Users");
  if (!sheet) return { success: true, photographers: [] };
  const rows = sheet.getDataRange().getValues();
  const photographers = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] === "photographer") {
      photographers.push({ username: rows[i][0], fullName: rows[i][3], phone: rows[i][4], active: rows[i][6] });
    }
  }
  return { success: true, photographers };
}

function getPhotographerBookings(params) {
  const { username, year, month } = params;
  const sheet = getSheet("PhotographyBookings");
  if (!sheet) return { success: true, bookings: [] };
  const prefix = `${parseInt(year)}-${String(parseInt(month)).padStart(2, "0")}`;
  const rows = sheet.getDataRange().getValues();
  const bookings = [];
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === username && String(rows[i][2]).startsWith(prefix)) {
      bookings.push({ id: rows[i][0], date: String(rows[i][2]), hour: String(rows[i][3]),
        status: String(rows[i][4]), notes: rows[i][5] || "", price: rows[i][6] || 0 });
    }
  }
  return { success: true, bookings };
}

function getMyBookings(params) {
  const { username } = params;
  const sheet = getSheet("PhotographyBookings");
  if (!sheet) return { success: true, bookings: [] };
  const rows = sheet.getDataRange().getValues();
  const bookings = [];
  const today = new Date().toISOString().slice(0, 10);
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === username && String(rows[i][2]) >= today) {
      bookings.push({ id: rows[i][0], date: String(rows[i][2]), hour: String(rows[i][3]),
        status: String(rows[i][4]), notes: rows[i][5] || "", price: rows[i][6] || 0 });
    }
  }
  bookings.sort((a, b) => a.date.localeCompare(b.date) || a.hour.localeCompare(b.hour));
  return { success: true, bookings };
}

function createPhotographer(data) {
  const sheet = getSheet("Users");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.username) return { success: false, message: "Username exists" };
  }
  sheet.appendRow([data.username, computeHash(data.password), "photographer", data.fullName, data.phone || "", "", true]);
  return { success: true };
}

// ===================== TESTIMONIALS =====================
function getTestimonials() {
  const sheet = getSheet("Testimonials");
  if (!sheet) return { success: true, testimonials: [] };
  const rows = sheet.getDataRange().getValues();
  const testimonials = [];
  for (let i = 1; i < rows.length; i++) {
    testimonials.push({
      id: String(rows[i][0] || i), name: rows[i][1], rating: parseInt(rows[i][2]) || 5,
      comment: rows[i][3] || "", image: rows[i][4] || "", date: rows[i][5] || "",
      approved: rows[i][6] === true || rows[i][6] === "TRUE" || rows[i][6] === "true"
    });
  }
  return { success: true, testimonials };
}

function updateTestimonialStatus(data) {
  const { id, approved } = data;
  const sheet = getSheet("Testimonials");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0] || (i)) === String(id)) {
      sheet.getRange(i + 1, 7).setValue(approved);
      return { success: true };
    }
  }
  return { success: false, message: "Not found" };
}

function deleteTestimonial(data) {
  const { id } = data;
  const sheet = getSheet("Testimonials");
  if (!sheet) return { success: false, message: "System error" };
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0] || i) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: "Not found" };
}

// ===================== EXPORT =====================
function exportBookings(params) {
  const { type } = params;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, data: [] };
  const rows = sheet.getDataRange().getValues();
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    if (type === "photography") {
      data.push({ id: rows[i][0], customerName: rows[i][1], date: rows[i][2],
        hour: rows[i][3], status: rows[i][4], notes: rows[i][5], price: rows[i][6] || 0,
        phone: rows[i][9] || "" });
    } else {
      data.push({ id: rows[i][0], type: rows[i][1], date: rows[i][2], hour: rows[i][3],
        customer: rows[i][4], phone: rows[i][5], guests: rows[i][6],
        status: rows[i][7], notes: rows[i][8], price: rows[i][9] || 0 });
    }
  }
  return { success: true, data };
}

function exportAllData() {
  const sheets = {};
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const allSheets = ss.getSheets();

  allSheets.forEach(sheet => {
    const name = sheet.getName();
    if (name === "Backups") return;
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return;
    const headers = rows[0];
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const obj = {};
      headers.forEach((h, j) => { obj[h] = rows[i][j]; });
      data.push(obj);
    }
    sheets[name] = data;
  });

  return { success: true, sheets };
}

// ===================== BACKUP =====================
function createBackup() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const now = new Date();
    const name = `Backup - ${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}-${String(now.getMinutes()).padStart(2,"0")}`;

    const copy = SpreadsheetApp.copy(ss);
    copy.setName(name);

    const driveFile = DriveApp.getFileById(copy.getId());
    const link = `https://docs.google.com/spreadsheets/d/${copy.getId()}`;

    /* Log backup */
    const backupSheet = getSheet("Backups");
    if (backupSheet) {
      backupSheet.appendRow([name, now.toISOString(), link]);
    }

    return { success: true, name, link };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function getBackupHistory() {
  const sheet = getSheet("Backups");
  if (!sheet) return { success: true, backups: [] };
  const rows = sheet.getDataRange().getValues();
  const backups = [];
  for (let i = 1; i < rows.length; i++) {
    backups.push({ name: rows[i][0], date: rows[i][1], link: rows[i][2] || "" });
  }
  backups.reverse();
  return { success: true, backups };
}
