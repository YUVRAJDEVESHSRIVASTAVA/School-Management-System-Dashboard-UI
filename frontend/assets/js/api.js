/* ─────────────────────────────────────────────
   School ERP  –  API helper  (api.js)
   All fetch calls to the Spring Boot backend
───────────────────────────────────────────── */
var API_BASE = "http://127.0.0.1:8080/api";

async function apiGet(path) {
	const res = await fetch(API_BASE + path);
	if (!res.ok) throw new Error("API error: " + res.status + " " + path);
	return res.json();
}

async function apiPost(path, body) {
	const res = await fetch(API_BASE + path, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error("API error: " + res.status);
	return res.json();
}

async function apiDelete(path) {
	const res = await fetch(API_BASE + path, { method: "DELETE" });
	if (!res.ok) throw new Error("API error: " + res.status + " " + path);
	return res.text();
}

/* ── Students ─────────────────────────────── */
function fetchAllStudents()                          { return apiGet("/students"); }
function fetchStudentByRoll(roll)                    { return apiGet("/students/roll/" + encodeURIComponent(roll)); }
function fetchStudentsByClass(cls)                   { return apiGet("/students/class/" + encodeURIComponent(cls)); }
function fetchStudentsByClassSection(cls, sec)       { return apiGet("/students/class/" + encodeURIComponent(cls) + "/section/" + encodeURIComponent(sec)); }

/* ── Teachers ─────────────────────────────── */
function fetchAllTeachers()          { return apiGet("/teachers"); }
function saveTeacher(body)           { return apiPost("/teachers", body); }

/* ── Marks ────────────────────────────────── */
function fetchAllMarks()             { return apiGet("/marks"); }
function fetchMarksByRoll(roll)      { return apiGet("/marks/roll/" + encodeURIComponent(roll)); }
function fetchMarksByExam(examType)  { return apiGet("/marks/exam/" + encodeURIComponent(examType)); }
function saveMarksForStudent(studentId, body) { return apiPost("/marks/student/" + studentId, body); }
function deleteMarks(id)             { return apiDelete("/marks/" + id); }

/* ── Attendance ───────────────────────────── */
function fetchAllAttendance()        { return apiGet("/attendance"); }
function fetchAttendanceByRoll(roll) { return apiGet("/attendance/roll/" + encodeURIComponent(roll)); }
function saveAttendanceForStudent(studentId, body) { return apiPost("/attendance/student/" + studentId, body); }
function deleteAttendance(id)        { return apiDelete("/attendance/" + id); }

/* ── Results ──────────────────────────────── */
function fetchAllResults()           { return apiGet("/results"); }
function fetchResultsByRoll(roll)    { return apiGet("/results/roll/" + encodeURIComponent(roll)); }
function fetchResultsByExam(exam)    { return apiGet("/results/exam/" + encodeURIComponent(exam)); }