/* ───────────────────────────────────────────────
   School ERP  –  Auth helpers (login.js)
   Used by: login.html, register.html, all pages
─────────────────────────────────────────────── */

var AUTH_USERS_KEY   = "school_users";
var AUTH_SESSION_KEY = "school_session";

/* ── User store ─────────────────────────────── */
function getUsers() {
	try {
		var parsed = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) { return []; }
}

function saveUsers(users) {
	localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

/* ── Seed default teachers ──────────────────── */
(function seedDefaultTeachers() {
	var users = getUsers();
	var defaultTeachers = [
		{ fullName: "Admin",          username: "admin@school.edu",            password: "Admin@123",   role: "teacher", subject: "Administration" },
		{ fullName: "Rajesh Kumar",   username: "rajesh.kumar@school.edu",     password: "Rajesh@123",  role: "teacher", subject: "Mathematics",        qualification: "M.Sc Mathematics, B.Ed" },
		{ fullName: "Priya Nair",     username: "priya.nair@school.edu",       password: "Priya@123",   role: "teacher", subject: "Science",            qualification: "M.Sc Physics, B.Ed" },
		{ fullName: "Sunita Sharma",  username: "sunita.sharma@school.edu",    password: "Sunita@123",  role: "teacher", subject: "English",            qualification: "M.A English, B.Ed" },
		{ fullName: "Amit Tiwari",    username: "amit.tiwari@school.edu",      password: "Amit@123",    role: "teacher", subject: "Hindi",              qualification: "M.A Hindi, B.Ed" },
		{ fullName: "Kavya Menon",    username: "kavya.menon@school.edu",      password: "Kavya@123",   role: "teacher", subject: "Computer Science",   qualification: "MCA, B.Ed" },
		{ fullName: "Ravi Shankar",   username: "ravi.shankar@school.edu",     password: "Ravi@123",    role: "teacher", subject: "Physical Education", qualification: "M.P.Ed" }
	];
	defaultTeachers.forEach(function(t) {
		var idx = users.findIndex(function(u) { return u.username === t.username; });
		if (idx === -1) { users.push(t); }
		else { users[idx] = Object.assign(users[idx], t); } // update existing
	});
	saveUsers(users);
})();

/* ── Session store ──────────────────────────── */
function getSession() {
	try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null"); }
	catch (e) { return null; }
}

function setSession(user) {
	localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
	localStorage.removeItem(AUTH_SESSION_KEY);
}

/* ── Auto roll-number helper ────────────────── */
function generateRollForNewUser() {
	var users  = getUsers();
	var year   = new Date().getFullYear();
	var students = users.filter(function (u) { return u.role === "student"; });
	var seq    = students.length + 1;
	return "STD-" + year + "-" + String(seq).padStart(4, "0");
}

/* ── Register ───────────────────────────────── */
function registerUser(data) {
	var users    = getUsers();
	var username = (data.username || "").trim().toLowerCase();

	if (!username) {
		return { ok: false, message: "Username cannot be empty." };
	}

	var exists = users.some(function (u) {
		return u.username === username;
	});

	if (exists) {
		return { ok: false, message: "Username already taken." };
	}

	var roll = data.rollNumber && data.rollNumber.trim()
		? data.rollNumber.trim()
		: (data.role === "student" ? generateRollForNewUser() : null);

	var newUser = {
		fullName   : data.fullName,
		username   : username,
		password   : data.password,   // plain for demo; hash in prod
		role       : data.role,       // "student" | "teacher"
		rollNumber : roll
	};

	users.push(newUser);
	saveUsers(users);
	return { ok: true, rollNumber: roll };
}

/* ── Login ──────────────────────────────────── */
async function loginUser(username, password, expectedRole) {

	// Students: authenticate against the backend DB
	if (expectedRole === "student") {
		try {
			var res = await fetch("http://localhost:8080/api/auth/login", {
				method  : "POST",
				headers : { "Content-Type": "application/json" },
				body    : JSON.stringify({ role: "student", email: username.trim().toLowerCase(), password: password })
			});
			var data = await res.json();
			if (res.ok && data.ok) {
				setSession({
					username     : data.username,
					fullName     : data.fullName,
					role         : "student",
					rollNumber   : data.rollNumber   || null,
					studentClass : data.studentClass || null,
					section      : data.section      || null
				});
				return { ok: true };
			}
			return { ok: false, message: data.message || "Invalid email or password." };
		} catch (e) {
			return { ok: false, message: "Cannot reach server. Make sure the backend is running on port 8080." };
		}
	}

	// Teachers: check localStorage
	var users = getUsers();
	var user  = users.find(function (u) {
		return u.username === username.toLowerCase() && u.password === password;
	});

	if (!user) {
		return { ok: false, message: "Invalid username or password." };
	}

	if (user.role !== expectedRole) {
		var label = user.role === "teacher" ? "Teacher" : "Student";
		return { ok: false, message: "This account is a " + label + " account. Please select the correct role." };
	}

	setSession({
		username      : user.username,
		fullName      : user.fullName,
		role          : user.role,
		rollNumber    : user.rollNumber    || null,
		subject       : user.subject       || null,
		qualification : user.qualification || null
	});

	return { ok: true };
}

/* ── Auth guards (call at top of protected pages) ─── */

// Redirect to login if no session
function requireAuth(redirectTo) {
	var session = getSession();
	if (!session) {
		window.location.href = redirectTo || "../pages/login.html";
		return null;
	}
	return session;
}

// Only teachers may access this page
function requireTeacher(redirectTo) {
	var session = requireAuth(redirectTo);
	if (session && session.role !== "teacher") {
		window.location.href = redirectTo || "login.html";
		return null;
	}
	return session;
}

/* ── Logout ─────────────────────────────────── */
function logout(redirectTo) {
	clearSession();
	window.location.href = redirectTo || "../pages/login.html";
}

/* ── Mobile sidebar hamburger (auto-inject on every page with a sidebar) ── */
document.addEventListener("DOMContentLoaded", function () {
	if (!document.querySelector(".sidebar")) return;
	var btn = document.createElement("button");
	btn.id        = "sidebarToggle";
	btn.className = "hamburger-btn";
	btn.innerHTML = '<i class="fa fa-bars"></i>';
	btn.setAttribute("aria-label", "Toggle menu");
	btn.onclick = function (e) {
		e.stopPropagation();
		document.querySelector(".sidebar").classList.toggle("sidebar-open");
	};
	document.body.appendChild(btn);
	// Close sidebar when tapping outside on mobile
	document.addEventListener("click", function (e) {
		var sidebar = document.querySelector(".sidebar");
		if (!sidebar) return;
		if (!sidebar.contains(e.target) && e.target.id !== "sidebarToggle" && !e.target.closest("#sidebarToggle")) {
			sidebar.classList.remove("sidebar-open");
		}
	});
});