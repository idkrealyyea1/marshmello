/* ===== Bilingual Translations (AR / EN) ===== */

const LANG_KEY = "marshmallow_lang";

const T = {
  // === Global ===
  "brand_name":        { ar: "مارشميلو",              en: "MARSHMALLOW" },
  "brand_sub":         { ar: " PHOTO CHALET & EVENTS", en: " PHOTO CHALET & EVENTS" },
  "nav_home":          { ar: "الرئيسية",              en: "Home" },
  "nav_chalet":        { ar: "الشاليه",               en: "Chalet" },
  "nav_salon":         { ar: "الكوافير",              en: "Salon" },
  "nav_photography":   { ar: "حجز التصوير",           en: "Booking" },
  "nav_about":         { ar: "من نحن",                en: "About" },
  "nav_admin":         { ar: "لوحة التحكم",           en: "Dashboard" },
  "nav_logout":        { ar: "تسجيل الخروج",          en: "Logout" },
  "nav_login":         { ar: "دخول",                  en: "Login" },

  // === Home Page ===
  "hero_title":        { ar: "MARSHMALLOW",            en: "MARSHMALLOW" },
  "hero_subtitle":     { ar: " PHOTO CHALET & EVENTS", en: " PHOTO CHALET & EVENTS" },
  "hero_tagline":      { ar: "استوديو تصوير وشاليه فاخر للمناسبات والأفراح. نوفر لك تجربة مميزة من الحجز والتصوير في أجواء رومانسية فاخرة.",
                         en: "A premium photo studio and chalet for events and celebrations. We offer a unique booking and photography experience in an elegant romantic atmosphere." },
  "home_chalet_title": { ar: "حجز الشاليه",           en: "Chalet Booking" },
  "home_chalet_desc":  { ar: "استمتع بتجربة مميزة في شاليهنا الفاخر", en: "Enjoy a unique experience in our luxurious chalet" },
  "home_photo_title":  { ar: "حجز جلسة تصوير",        en: "Photo Session" },
  "home_photo_desc":   { ar: "احجز موعدك لجلسة تصوير احترافية",  en: "Book your professional photography session" },
  "home_salon_title":  { ar: "مركز التجميل",           en: "Beauty Salon" },
  "home_salon_desc":   { ar: "خدمات تجميل وعناية متكاملة",        en: "Complete beauty and care services" },
  "home_contact_title":{ ar: "تواصل معنا",             en: "Contact Us" },
  "home_contact_desc": { ar: "تواصل عبر واتساب للاستفسار",        en: "Reach us via WhatsApp for inquiries" },

  // === Chalet Booking ===
  "chalet_title":      { ar: "حجز الشاليه",           en: "Chalet Booking" },
  "chalet_subtitle":   { ar: "اختر اليوم والوقت المناسب لك", en: "Choose your preferred day and time" },
  "chalet_tab_day":    { ar: "حجز نهاري",             en: "Day Use" },
  "chalet_tab_night":  { ar: "حجز مبيت",              en: "Overnight" },

  // === Photography Booking ===
  "photo_title":       { ar: "حجز جلسة تصوير",        en: "Photo Session Booking" },
  "photo_subtitle":    { ar: "اختر اليوم والوقت المناسب لجلستك", en: "Choose your preferred day and time" },
  "photo_request_btn": { ar: "إرسال الطلب",            en: "Submit Request" },
  "photo_request_title":{ ar: "تم إرسال طلب الحجز!",   en: "Request Submitted!" },
  "photo_request_msg": { ar: "تم استلام طلبك بنجاح. سيتم التواصل معك من قبل الإدارة لتأكيد الموعد.",
                         en: "Your request has been received. Our team will contact you to confirm the appointment." },
  "photo_login_req":   { ar: "الرجاء تسجيل الدخول للمتابعة", en: "Please log in to continue" },
  "photo_login_btn":   { ar: "تسجيل الدخول",          en: "Log In" },
  "photo_my_bookings": { ar: "حجوزاتي القادمة",        en: "My Upcoming Bookings" },
  "photo_no_bookings": { ar: "لا توجد حجوزات قادمة",  en: "No upcoming bookings" },

  // === Salon ===
  "salon_title":       { ar: "مركز التجميل والكوافير", en: "Beauty Salon & Styling" },
  "salon_subtitle":    { ar: "خدمات تجميل وعناية متكاملة بأيدي أمهر الخبيرات", en: "Complete beauty and care services by expert professionals" },
  "salon_book_wa":     { ar: "احجزي عبر واتساب",       en: "Book via WhatsApp" },

  // === Login ===
  "login_title":       { ar: "تسجيل الدخول",          en: "Sign In" },
  "login_subtitle":    { ar: " PHOTO CHALET & EVENTS", en: " PHOTO CHALET & EVENTS" },
  "login_username":    { ar: "اسم المستخدم",          en: "Username" },
  "login_username_ph": { ar: "أدخل اسم المستخدم",     en: "Enter your username" },
  "login_password":    { ar: "كلمة المرور",           en: "Password" },
  "login_password_ph": { ar: "أدخل كلمة المرور",      en: "Enter your password" },
  "login_btn":         { ar: "تسجيل الدخول",          en: "Sign In" },
  "login_btn_loading": { ar: "جاري التحقق...",        en: "Verifying..." },
  "login_back":        { ar: "العودة للرئيسية",        en: "Back to Home" },
  "login_error":       { ar: "اسم المستخدم أو كلمة المرور غير صحيحة", en: "Invalid username or password" },
  "login_error_empty": { ar: "يرجى ملء جميع الحقول",  en: "Please fill all fields" },
  "login_error_server":{ ar: "تعذر الاتصال بالسيرفر. حاول مرة أخرى.", en: "Connection failed. Try again." },

  // === Calendar ===
  "cal_available":     { ar: "متاح",                  en: "Available" },
  "cal_partial":       { ar: "محجوز جزئيًا",          en: "Partially Booked" },
  "cal_booked":        { ar: "محجوز بالكامل",          en: "Fully Booked" },
  "cal_past":          { ar: "تاريخ ماضٍ",             en: "Past Date" },
  "cal_loading":       { ar: "جاري تحميل التقويم...", en: "Loading calendar..." },

  // === Booking Modal ===
  "modal_full_name":   { ar: "الاسم الكامل",          en: "Full Name" },
  "modal_full_name_ph":{ ar: "أدخل اسمك الكامل",      en: "Enter your full name" },
  "modal_phone":       { ar: "رقم الهاتف / واتساب",   en: "Phone / WhatsApp" },
  "modal_phone_ph":    { ar: "05XXXXXXXX",             en: "05XXXXXXXX" },
  "modal_guests":      { ar: "عدد الأشخاص",           en: "Number of Guests" },
  "modal_notes":       { ar: "ملاحظات إضافية (اختياري)", en: "Additional Notes (Optional)" },
  "modal_notes_ph":    { ar: "أي طلبات خاصة...",      en: "Any special requests..." },
  "modal_notes_photo": { ar: "ملاحظات (اختياري)",      en: "Notes (Optional)" },
  "modal_notes_photo_ph":{ ar: "أي ملاحظات حول الجلسة...", en: "Any notes about the session..." },
  "modal_confirm":     { ar: "تأكيد الحجز",           en: "Confirm Booking" },
  "modal_sending":     { ar: "جاري الإرسال...",        en: "Sending..." },
  "modal_error_fill":  { ar: "يرجى ملء الاسم ورقم الهاتف", en: "Please fill name and phone" },
  "modal_error_select":{ ar: "يرجى اختيار اليوم والساعة", en: "Please select a day and time" },
  "modal_error_slot":  { ar: "هذه الساعة محجوزة بالفعل", en: "This slot is already booked" },
  "modal_error_server":{ ar: "تعذر الاتصال بالسيرفر. حاول مرة أخرى.", en: "Connection failed. Try again." },

  // === Pricing ===
  "price_label":       { ar: "السعر",                  en: "Price" },
  "price_loading":     { ar: "جاري تحميل السعر...",   en: "Loading price..." },
  "price_per_hour":    { ar: "/ساعة",                  en: "/hour" },
  "price_total":       { ar: "السعر الإجمالي",        en: "Total Price" },
  "price_sar":         { ar: "ريال",                   en: "SAR" },

  // === Confirmation ===
  "confirm_title":     { ar: "تم استلام طلب الحجز!",  en: "Booking Request Received!" },
  "confirm_msg":       { ar: "تم إرسال طلبك بنجاح. سيتم مراجعته من قبل الإدارة والتأكيد عبر واتساب.",
                         en: "Your request has been submitted successfully. It will be reviewed by admin and confirmed via WhatsApp." },
  "confirm_photo_title":{ ar: "تم حجز جلسة التصوير!",  en: "Photo Session Booked!" },
  "confirm_photo_msg": { ar: "تم تسجيل حجزك بنجاح. يمكنك متابعة حجوزاتك أدناه.",
                         en: "Your booking has been recorded. You can track it below." },
  "confirm_wa":        { ar: "تأكيد عبر واتساب",      en: "Confirm via WhatsApp" },
  "confirm_close":     { ar: "إغلاق",                 en: "Close" },

  // === Gallery ===
  "gallery_title":     { ar: "معرض الصور",            en: "Gallery" },
  "gallery_chalet":    { ar: "معرض الشاليه",          en: "Chalet Gallery" },
  "gallery_photo":     { ar: "معرض التصوير",          en: "Photography Gallery" },
  "gallery_salon":     { ar: "معرض خدمات التجميل",    en: "Salon Gallery" },
  "gallery_of":        { ar: "من",                     en: "of" },
  "gallery_zoom_in":   { ar: "تكبير",                  en: "Zoom in" },
  "gallery_zoom_out":  { ar: "تصغير",                  en: "Zoom out" },
  "gallery_close":     { ar: "إغلاق",                  en: "Close" },
  "gallery_prev":      { ar: "السابق",                 en: "Previous" },
  "gallery_next":      { ar: "التالي",                 en: "Next" },

  // === About Page ===
  "about_title":       { ar: "من نحن",                en: "About Us" },
  "about_story_title": { ar: "قصتنا",                 en: "Our Story" },
  "about_story":       { ar: "تأسست Marshmallow لتكون الوجهة الأولى للمناسبات الأنيقة والتصوير الاحترافي في أجواء فاخرة ومميزة. نؤمن بأن كل لحظة تستحق أن تُخلّد بأجمل صورة، وكل مناسبة تستحق أجواء استثنائية.",
                         en: "Marshmallow was founded to be the premier destination for elegant events and professional photography in a luxurious atmosphere. We believe every moment deserves to be captured beautifully, and every occasion deserves an exceptional setting." },
  "about_vision_title": { ar: "رؤيتنا",               en: "Our Vision" },
  "about_vision":      { ar: "أن نكون الخيار الأول للمناسبات والتصوير في المنطقة، من خلال تقديم تجربة فريدة تجمع بين الفخامة والاحترافية.",
                         en: "To be the first choice for events and photography in the region, delivering a unique experience that combines luxury and professionalism." },
  "about_mission_title":{ ar: "رسالتنا",              en: "Our Mission" },
  "about_mission":     { ar: "تقديم خدمات تصوير ومناسبات بأعلى معايير الجودة، مع الاهتمام بأدق التفاصيل لضمان تجربة لا تُنسى لعملائنا.",
                         en: "To deliver event and photography services at the highest quality standards, paying attention to every detail to ensure an unforgettable experience for our clients." },
  "about_why_title":   { ar: "لماذا مارشميلو؟",       en: "Why Marshmallow?" },
  "about_why_1_title": { ar: "شاليه فاخر",            en: "Luxurious Chalet" },
  "about_why_1":       { ar: "تصميم داخلي أنيق وتجهيزات متكاملة", en: "Elegant interior design and complete facilities" },
  "about_why_2_title": { ar: "تصوير احترافي",          en: "Professional Photography" },
  "about_why_2":       { ar: "استوديو مجهز بأحدث المعدات والإضاءة", en: "Studio equipped with the latest equipment and lighting" },
  "about_why_3_title": { ar: "خدمات تجميل شاملة",      en: "Complete Beauty Services" },
  "about_why_3":       { ar: "كوافير ومركز تجميل بأيدي خبيرات", en: "Salon and beauty center by expert professionals" },
  "about_why_4_title": { ar: "أسعار منافسة",           en: "Competitive Pricing" },
  "about_why_4":       { ar: "نظام أسعار ديناميكي يناسب جميع الميزانيات", en: "Dynamic pricing system to suit all budgets" },
  "about_services_title":{ ar: "خدماتنا",              en: "Our Services" },
  "about_book_now":    { ar: "احجز الآن",             en: "Book Now" },
  "about_stats_sessions":{ ar: "جلسة تصوير+",         en: "+ Photo Sessions" },
  "about_stats_clients":{ ar: "عميل سعيد+",           en: "+ Happy Clients" },
  "about_stats_services":{ ar: "خدمة رئيسية",         en: "Main Services" },
  "about_stats_rating":{ ar: "تقييم العملاء",          en: "Client Rating" },

  // === Testimonials ===
  "testimonials_title":{ ar: "آراء عملائنا",          en: "What Our Clients Say" },
  "testimonials_empty":{ ar: "لا توجد تقييمات بعد",   en: "No testimonials yet" },

  // === Admin ===
  "admin_title":       { ar: "لوحة التحكم",           en: "Admin Dashboard" },
  "admin_overview":    { ar: "نظرة عامة",              en: "Overview" },
  "admin_chalet_bk":   { ar: "حجوزات الشاليه",        en: "Chalet Bookings" },
  "admin_photo_bk":    { ar: "حجوزات التصوير",        en: "Photography Bookings" },
  "admin_photographers":{ ar: "المصورون",              en: "Photographers" },
  "admin_testimonials":{ ar: "آراء العملاء",          en: "Testimonials" },
  "admin_data_mgmt":   { ar: "إدارة البيانات",         en: "Data Management" },
  "admin_total_chalet":{ ar: "حجوزات الشاليه",        en: "Chalet Bookings" },
  "admin_total_photo": { ar: "حجوزات التصوير",        en: "Photo Bookings" },
  "admin_confirmed":   { ar: "مؤكدة",                 en: "Confirmed" },
  "admin_pending":     { ar: "قيد الانتظار",           en: "Pending" },
  "admin_monthly":     { ar: "حجوزات هذا الشهر",      en: "This Month's Bookings" },
  "admin_top_photo":   { ar: "أكثر المصوّرين نشاطًا", en: "Top Photographers" },
  "admin_no_data":     { ar: "لا توجد بيانات",        en: "No data available" },
  "admin_no_bookings": { ar: "لا توجد حجوزات",        en: "No bookings found" },
  "admin_add_photo":   { ar: "إضافة مصوّر جديد",      en: "Add New Photographer" },
  "admin_full_name":   { ar: "الاسم الكامل",          en: "Full Name" },
  "admin_username":    { ar: "اسم المستخدم",          en: "Username" },
  "admin_temp_pass":   { ar: "كلمة المرور المؤقتة",   en: "Temporary Password" },
  "admin_add_btn":     { ar: "إضافة",                 en: "Add" },
  "admin_no_photo":    { ar: "لا يوجد مصورون مسجلون", en: "No photographers registered" },

  // === Data Management ===
  "admin_export_chalet":{ ar: "تصدير حجوزات الشاليه", en: "Export Chalet Bookings" },
  "admin_export_photo":{ ar: "تصدير حجوزات التصوير",  en: "Export Photo Bookings" },
  "admin_export_all":  { ar: "تصدير كل البيانات",      en: "Export All Data" },
  "admin_backup":      { ar: "إنشاء نسخة احتياطية",   en: "Create Backup" },
  "admin_backup_history":{ ar: "سجل النسخ الاحتياطية", en: "Backup History" },
  "admin_backup_success":{ ar: "تم إنشاء النسخة الاحتياطية بنجاح!", en: "Backup created successfully!" },
  "admin_backup_name": { ar: "اسم النسخة",            en: "Backup Name" },
  "admin_backup_date": { ar: "تاريخ الإنشاء",          en: "Created Date" },
  "admin_backup_link": { ar: "رابط الملف",            en: "Drive Link" },
  "admin_exporting":   { ar: "جاري التصدير...",        en: "Exporting..." },
  "admin_backing_up":  { ar: "جاري إنشاء النسخة الاحتياطية...", en: "Creating backup..." },

  // === Testimonials Management ===
  "admin_test_name":   { ar: "الاسم",                 en: "Name" },
  "admin_test_rating": { ar: "التقييم",               en: "Rating" },
  "admin_test_comment":{ ar: "التعليق",               en: "Comment" },
  "admin_test_approved":{ ar: "الحالة",               en: "Status" },
  "admin_test_approve":{ ar: "اعتماد",                en: "Approve" },
  "admin_test_reject": { ar: "رفض",                   en: "Reject" },
  "admin_no_testimonials":{ ar: "لا توجد تقييمات",    en: "No testimonials" },

  // === Table Headers ===
  "th_date":           { ar: "التاريخ",               en: "Date" },
  "th_time":           { ar: "الوقت",                 en: "Time" },
  "th_type":           { ar: "النوع",                 en: "Type" },
  "th_customer":       { ar: "العميل",                en: "Customer" },
  "th_phone":          { ar: "الهاتف",                en: "Phone" },
  "th_guests":         { ar: "الأشخاص",               en: "Guests" },
  "th_price":          { ar: "السعر",                 en: "Price" },
  "th_status":         { ar: "الحالة",                en: "Status" },
  "th_actions":        { ar: "إجراءات",               en: "Actions" },
  "th_photographer":   { ar: "المصوّر",               en: "Photographer" },
  "th_notes":          { ar: "ملاحظات",               en: "Notes" },
  "th_bookings":       { ar: "حجز",                   en: "bookings" },

  // === Status ===
  "status_pending":    { ar: "قيد الانتظار",           en: "Pending" },
  "status_confirmed":  { ar: "مؤكد",                  en: "Confirmed" },
  "status_cancelled":  { ar: "ملغى",                  en: "Cancelled" },
  "type_day":          { ar: "نهاري",                  en: "Day" },
  "type_overnight":    { ar: "مبيت",                  en: "Overnight" },

  // === Buttons ===
  "btn_confirm":       { ar: "تأكيد",                 en: "Confirm" },
  "btn_cancel":        { ar: "إلغاء",                 en: "Cancel" },
  "btn_delete":        { ar: "حذف",                   en: "Delete" },
  "btn_approve":       { ar: "اعتماد",                en: "Approve" },
  "btn_reject":        { ar: "رفض",                   en: "Reject" },
  "btn_filter_all":    { ar: "الكل",                  en: "All" },
  "btn_filter_pending":{ ar: "قيد الانتظار",           en: "Pending" },
  "btn_filter_confirmed":{ ar: "مؤكد",                en: "Confirmed" },
  "btn_filter_cancelled":{ ar: "ملغى",                en: "Cancelled" },

  // === Alerts ===
  "alert_error":       { ar: "حدث خطأ",               en: "An error occurred" },
  "alert_success":     { ar: "تم بنجاح",              en: "Success" },
  "alert_server":      { ar: "تعذر الاتصال بالسيرفر", en: "Server connection failed" },

  // === Footer ===
  "footer_rights":     { ar: "جميع الحقوق محفوظة",    en: "All rights reserved" },
  "footer_staff":      { ar: "دخول الموظفين والمصورين", en: "Staff & Photographers Login" },

  // === Time ===
  "time_am":           { ar: "ص",                     en: "AM" },
  "time_pm":           { ar: "م",                     en: "PM" },

  // === Confirm Delete / Cancel ===
  "confirm_delete":    { ar: "هل أنت متأكد من حذف هذا الحجز؟", en: "Are you sure you want to delete this booking?" },
  "confirm_approve":   { ar: "هل تريد اعتماد هذا التقييم؟", en: "Approve this testimonial?" },
  "confirm_reject":    { ar: "هل تريد رفض هذا التقييم؟", en: "Reject this testimonial?" }
};
