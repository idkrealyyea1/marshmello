/**
 * Marshmallow — Photo Chalet & Events
 * Google Apps Script Backend
 * 
 * Deploy as: Web App → Execute as Me → Anyone can access
 */

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

function doGet(e) {
  const action = e.parameter.action;
  
  switch (action) {
    case "getAvailability":
      return jsonResponse(getAvailability(e.parameter));
    case "getDayDetails":
      return jsonResponse(getDayDetails(e.parameter));
    case "getAdminStats":
      return jsonResponse(getAdminStats(e.parameter));
    case "getAllBookings":
      return jsonResponse(getAllBookings(e.parameter));
    case "getPhotographers":
      return jsonResponse(getPhotographers());
    case "getPhotographerBookings":
      return jsonResponse(getPhotographerBookings(e.parameter));
    case "getMyBookings":
      return jsonResponse(getMyBookings(e.parameter));
    default:
      return jsonResponse({ success: false, message: "Unknown action" });
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case "login":
      return jsonResponse(handleLogin(data));
    case "submitChaletBooking":
      return jsonResponse(submitChaletBooking(data));
    case "submitPhotographyBooking":
      return jsonResponse(submitPhotographyBooking(data));
    case "updateBookingStatus":
      return jsonResponse(updateBookingStatus(data));
    case "deleteBooking":
      return jsonResponse(deleteBooking(data));
    case "createPhotographer":
      return jsonResponse(createPhotographer(data));
    default:
      return jsonResponse({ success: false, message: "Unknown action" });
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
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  return {
    openingHour: parseInt(settings.openingHour) || 9,
    closingHour: parseInt(settings.closingHour) || 24,
    slotDurationMinutes: parseInt(settings.slotDurationMinutes) || 60
  };
}

// === AUTH ===
function handleLogin(data) {
  const { username, password } = data;
  const sheet = getSheet("Users");
  if (!sheet) return { success: false, message: "System error" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username && rows[i][6] !== false) {
      const storedHash = rows[i][1];
      const inputHash = computeHash(password);
      if (storedHash === inputHash) {
        return {
          success: true,
          username: rows[i][0],
          role: rows[i][2],
          fullName: rows[i][3]
        };
      }
    }
  }
  return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
}

function computeHash(password) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return raw.map(function(b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join('');
}

// === AVAILABILITY ===
function getAvailability(params) {
  const { type, year, month } = params;
  const sheetName = type === "chalet" ? "ChaletBookings" : "PhotographyBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, data: {} };

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const prefix = `${yearNum}-${String(monthNum).padStart(2, "0")}`;

  const rows = sheet.getDataRange().getValues();
  const dayStatus = {};

  for (let i = 1; i < rows.length; i++) {
    const date = String(rows[i][2]);
    const status = String(rows[i][type === "chalet" ? 7 : 5]);
    
    if (date.startsWith(prefix) && status !== "cancelled") {
      if (!dayStatus[date]) {
        dayStatus[date] = { count: 0, totalSlots: 0 };
      }
      dayStatus[date].count++;
    }
  }

  const settings = getSettings();
  const totalSlotsPerDay = Math.ceil((settings.closingHour - settings.openingHour) * 60 / settings.slotDurationMinutes);

  const result = {};
  Object.keys(dayStatus).forEach(date => {
    if (dayStatus[date].count >= totalSlotsPerDay) {
      result[date] = "booked";
    } else {
      result[date] = "partial";
    }
  });

  return { success: true, data: result };
}

// === DAY DETAILS ===
function getDayDetails(params) {
  const { type, date } = params;
  const sheetName = type === "chalet" ? "ChaletBookings" : "PhotographyBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, bookedSlots: [] };

  const rows = sheet.getDataRange().getValues();
  const bookedSlots = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === date && String(rows[i][type === "chalet" ? 7 : 5]) !== "cancelled") {
      bookedSlots.push(String(rows[i][3]));
    }
  }

  return { success: true, bookedSlots };
}

// === SUBMIT BOOKINGS ===
function submitChaletBooking(data) {
  const sheet = getSheet("ChaletBookings");
  if (!sheet) return { success: false, message: "System error" };

  // Double booking check
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === data.date &&
        String(rows[i][3]) === data.hour &&
        String(rows[i][7]) !== "cancelled") {
      return { success: false, message: "هذه الساعة محجوزة بالفعل" };
    }
  }

  const id = "CB" + new Date().getTime();
  sheet.appendRow([
    id,
    data.type || "day",
    data.date,
    data.hour,
    data.customerName,
    data.phone,
    data.guests || 1,
    "pending",
    data.notes || "",
    new Date().toISOString()
  ]);

  return { success: true, id: id };
}

function submitPhotographyBooking(data) {
  const sheet = getSheet("PhotographyBookings");
  if (!sheet) return { success: false, message: "System error" };

  // Double booking check
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === data.date &&
        String(rows[i][3]) === data.hour &&
        String(rows[i][5]) !== "cancelled") {
      return { success: false, message: "هذه الساعة محجوزة بالفعل" };
    }
  }

  const id = "PB" + new Date().getTime();
  sheet.appendRow([
    id,
    data.photographerUsername,
    data.date,
    data.hour,
    "pending",
    data.notes || "",
    new Date().toISOString()
  ]);

  return { success: true, id: id };
}

// === ADMIN ACTIONS ===
function updateBookingStatus(data) {
  const { bookingId, type, newStatus } = data;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: false, message: "System error" };

  const rows = sheet.getDataRange().getValues();
  const statusCol = sheetName === "PhotographyBookings" ? 5 : 7;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === bookingId) {
      sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);
      return { success: true };
    }
  }
  return { success: false, message: "Booking not found" };
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
  return { success: false, message: "Booking not found" };
}

// === ADMIN STATS ===
function getAdminStats(params) {
  const { year, month } = params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const prefix = `${yearNum}-${String(monthNum).padStart(2, "0")}`;

  const chaletSheet = getSheet("ChaletBookings");
  const photoSheet = getSheet("PhotographyBookings");

  let chaletTotal = 0, photoTotal = 0, confirmed = 0, pending = 0;
  const dailyBookings = {};
  const photographerCounts = {};

  if (chaletSheet) {
    const rows = chaletSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const date = String(rows[i][2]);
      const status = String(rows[i][7]);
      if (date.startsWith(prefix)) {
        chaletTotal++;
        if (status === "confirmed") confirmed++;
        if (status === "pending") pending++;
        const day = parseInt(date.split("-")[2]);
        dailyBookings[day] = (dailyBookings[day] || 0) + 1;
      }
    }
  }

  if (photoSheet) {
    const rows = photoSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const date = String(rows[i][2]);
      const status = String(rows[i][5]);
      const username = String(rows[i][1]);
      if (date.startsWith(prefix)) {
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
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([username, count]) => ({ username, name: username, count }));

  return {
    success: true,
    chaletTotal,
    photoTotal,
    confirmed,
    pending,
    dailyBookings,
    topPhotographers
  };
}

function getAllBookings(params) {
  const { type, status, year, month } = params;
  const sheetName = type === "photography" ? "PhotographyBookings" : "ChaletBookings";
  const sheet = getSheet(sheetName);
  if (!sheet) return { success: true, bookings: [] };

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const prefix = `${yearNum}-${String(monthNum).padStart(2, "0")}`;
  const rows = sheet.getDataRange().getValues();
  const bookings = [];

  for (let i = 1; i < rows.length; i++) {
    const date = String(rows[i][2]);
    if (!date.startsWith(prefix)) continue;

    if (type === "photography") {
      const bStatus = String(rows[i][5]);
      if (status && bStatus !== status) continue;
      bookings.push({
        id: rows[i][0],
        photographerUsername: rows[i][1],
        date: date,
        hour: String(rows[i][3]),
        status: bStatus,
        notes: rows[i][6] || ""
      });
    } else {
      const bStatus = String(rows[i][7]);
      if (status && bStatus !== status) continue;
      bookings.push({
        id: rows[i][0],
        type: rows[i][1],
        date: date,
        hour: String(rows[i][3]),
        customerName: rows[i][4],
        phone: rows[i][5],
        guests: rows[i][6],
        status: bStatus,
        notes: rows[i][8] || ""
      });
    }
  }

  return { success: true, bookings };
}

// === PHOTOGRAPHERS ===
function getPhotographers() {
  const sheet = getSheet("Users");
  if (!sheet) return { success: true, photographers: [] };

  const rows = sheet.getDataRange().getValues();
  const photographers = [];

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] === "photographer") {
      photographers.push({
        username: rows[i][0],
        fullName: rows[i][3],
        phone: rows[i][4],
        active: rows[i][6]
      });
    }
  }

  return { success: true, photographers };
}

function getPhotographerBookings(params) {
  const { username, year, month } = params;
  const sheet = getSheet("PhotographyBookings");
  if (!sheet) return { success: true, bookings: [] };

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const prefix = `${yearNum}-${String(monthNum).padStart(2, "0")}`;
  const rows = sheet.getDataRange().getValues();
  const bookings = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === username && String(rows[i][2]).startsWith(prefix)) {
      bookings.push({
        id: rows[i][0],
        date: String(rows[i][2]),
        hour: String(rows[i][3]),
        status: String(rows[i][5]),
        notes: rows[i][6] || ""
      });
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
      bookings.push({
        id: rows[i][0],
        date: String(rows[i][2]),
        hour: String(rows[i][3]),
        status: String(rows[i][5]),
        notes: rows[i][6] || ""
      });
    }
  }

  bookings.sort((a, b) => a.date.localeCompare(b.date) || a.hour.localeCompare(b.hour));
  return { success: true, bookings };
}

function createPhotographer(data) {
  const sheet = getSheet("Users");
  if (!sheet) return { success: false, message: "System error" };

  // Check if username exists
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.username) {
      return { success: false, message: "اسم المستخدم موجود بالفعل" };
    }
  }

  const hash = computeHash(data.password);
  sheet.appendRow([
    data.username,
    hash,
    "photographer",
    data.fullName,
    data.phone || "",
    "",
    true
  ]);

  return { success: true };
}
