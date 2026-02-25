const STORAGE_KEY = "school_students";

const form = document.getElementById("addStudentForm");
const studentNameInput = document.getElementById("studentName");
const dateOfBirthInput = document.getElementById("dateOfBirth");
const studentClassInput = document.getElementById("studentClass");
const sectionInput = document.getElementById("section");
const rollNumberInput = document.getElementById("rollNumber");
const studentsTableBody = document.getElementById("studentsTableBody");
const clearStudentsButton = document.getElementById("clearStudents");
let editingIndex = -1;

if (form) {
	initializeForm();

	[studentNameInput, dateOfBirthInput, studentClassInput, sectionInput].forEach(function (input) {
		input.addEventListener("input", updateRollNumberPreview);
		input.addEventListener("change", updateRollNumberPreview);
	});

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		const students = getStudents();
		const generatedRoll = rollNumberInput.value || generateRollNumber(students);
		const newStudent = {
			rollNumber: generatedRoll,
			name: form.studentName.value.trim(),
			dateOfBirth: form.dateOfBirth.value,
			studentClass: form.studentClass.value.trim(),
			section: form.section.value.trim().toUpperCase()
		};

		students.push(newStudent);
		saveStudents(students);
		renderStudents(students);

		form.reset();
		initializeForm();
	});

	clearStudentsButton.addEventListener("click", function () {
		localStorage.removeItem(STORAGE_KEY);
		editingIndex = -1;
		renderStudents([]);
		initializeForm();
	});

	studentsTableBody.addEventListener("click", handleTableActions);
}

function initializeForm() {
	rollNumberInput.value = "";
	updateRollNumberPreview();
	renderStudents(getStudents());
}

function getStudents() {
	try {
		const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
}

function saveStudents(students) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function generateRollNumber(students) {
	const currentYear = new Date().getFullYear();
	const nextSequence = students.reduce(function (maxSequence, student) {
		const match = String(student.rollNumber || "").match(/(\d+)$/);
		if (!match) {
			return maxSequence;
		}

		const sequence = Number(match[1]);
		return sequence > maxSequence ? sequence : maxSequence;
	}, 0) + 1;

	return `STD-${currentYear}-${String(nextSequence).padStart(4, "0")}`;
}

function updateRollNumberPreview() {
	const students = getStudents();
	if (isFormReadyForRoll()) {
		rollNumberInput.value = generateRollNumber(students);
	} else {
		rollNumberInput.value = "";
	}
}

function isFormReadyForRoll() {
	return (
		studentNameInput && studentNameInput.value.trim() &&
		dateOfBirthInput && dateOfBirthInput.value &&
		studentClassInput && studentClassInput.value.trim() &&
		sectionInput && sectionInput.value.trim()
	);
}

function renderStudents(students) {
	if (!studentsTableBody) {
		return;
	}

	if (!students.length) {
		studentsTableBody.innerHTML = "<tr><td colspan='6'>No students added yet.</td></tr>";
		return;
	}

	studentsTableBody.innerHTML = students
		.map(function (student, index) {
			if (editingIndex === index) {
				return `<tr>
					<td>${escapeHtml(student.rollNumber)}</td>
					<td><input class="table-edit-input" data-field="name" data-index="${index}" value="${escapeHtml(student.name)}"></td>
					<td><input class="table-edit-input" data-field="dateOfBirth" data-index="${index}" type="date" value="${escapeHtml(student.dateOfBirth || "")}"></td>
					<td><input class="table-edit-input" data-field="studentClass" data-index="${index}" value="${escapeHtml(student.studentClass)}"></td>
					<td><input class="table-edit-input" data-field="section" data-index="${index}" value="${escapeHtml(student.section || "")}"></td>
					<td>
						<button class="table-action-btn save" data-action="save" data-index="${index}" type="button">Save</button>
						<button class="table-action-btn cancel" data-action="cancel" data-index="${index}" type="button">Cancel</button>
					</td>
				</tr>`;
			}

			return `<tr>
				<td>${escapeHtml(student.rollNumber)}</td>
				<td>${escapeHtml(student.name)}</td>
				<td>${escapeHtml(student.dateOfBirth || "-")}</td>
				<td>${escapeHtml(student.studentClass)}</td>
				<td>${escapeHtml(student.section || "-")}</td>
				<td>
					<button class="table-action-btn edit" data-action="edit" data-index="${index}" type="button">Edit</button>
					<button class="table-action-btn delete" data-action="delete" data-index="${index}" type="button">Delete</button>
				</td>
			</tr>`;
		})
		.join("");
}

function handleTableActions(event) {
	const actionButton = event.target.closest("button[data-action]");
	if (!actionButton) {
		return;
	}

	const action = actionButton.dataset.action;
	const index = Number(actionButton.dataset.index);
	if (Number.isNaN(index)) {
		return;
	}

	if (action === "edit") {
		editingIndex = index;
		renderStudents(getStudents());
		return;
	}

	if (action === "cancel") {
		editingIndex = -1;
		renderStudents(getStudents());
		return;
	}

	if (action === "save") {
		saveEditedStudent(index);
		return;
	}

	if (action === "delete") {
		deleteStudent(index);
	}
}

function saveEditedStudent(index) {
	const students = getStudents();
	if (!students[index]) {
		editingIndex = -1;
		renderStudents(students);
		return;
	}

	const nameInput = studentsTableBody.querySelector(`input[data-field="name"][data-index="${index}"]`);
	const dobInput = studentsTableBody.querySelector(`input[data-field="dateOfBirth"][data-index="${index}"]`);
	const classInput = studentsTableBody.querySelector(`input[data-field="studentClass"][data-index="${index}"]`);
	const sectionInputEdit = studentsTableBody.querySelector(`input[data-field="section"][data-index="${index}"]`);

	const updatedName = nameInput ? nameInput.value.trim() : "";
	const updatedDob = dobInput ? dobInput.value : "";
	const updatedClass = classInput ? classInput.value.trim() : "";
	const updatedSection = sectionInputEdit ? sectionInputEdit.value.trim().toUpperCase() : "";

	if (!updatedName || !updatedDob || !updatedClass || !updatedSection) {
		alert("Please fill all fields before saving.");
		return;
	}

	students[index] = {
		...students[index],
		name: updatedName,
		dateOfBirth: updatedDob,
		studentClass: updatedClass,
		section: updatedSection
	};

	saveStudents(students);
	editingIndex = -1;
	renderStudents(students);
}

function deleteStudent(index) {
	const students = getStudents();
	if (!students[index]) {
		return;
	}

	students.splice(index, 1);
	saveStudents(students);
	editingIndex = -1;
	renderStudents(students);
	updateRollNumberPreview();
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/* ── Seed sample students (versioned – bumping SEED_VERSION forces re-seed) ── */
var SEED_VERSION = "v2";
var SEED_VERSION_KEY = "school_students_seed_version";

function seedStudents() {
	var storedVersion = localStorage.getItem(SEED_VERSION_KEY);
	if (storedVersion === SEED_VERSION) { return; }

	var seed = [
		/* ── Class 8 – Section A ── */
		{ name: "Aarav Mehta",      dob: "2013-04-12", cls: "8",  sec: "A" },
		{ name: "Priya Sharma",     dob: "2013-07-23", cls: "8",  sec: "A" },
		{ name: "Rohan Verma",      dob: "2013-02-08", cls: "8",  sec: "A" },
		{ name: "Sneha Patel",      dob: "2013-09-15", cls: "8",  sec: "A" },
		{ name: "Karan Singh",      dob: "2013-11-30", cls: "8",  sec: "A" },
		/* ── Class 8 – Section B ── */
		{ name: "Divya Nair",       dob: "2013-06-18", cls: "8",  sec: "B" },
		{ name: "Arjun Gupta",      dob: "2013-01-25", cls: "8",  sec: "B" },
		{ name: "Meera Iyer",       dob: "2013-03-10", cls: "8",  sec: "B" },
		{ name: "Vikram Das",       dob: "2013-08-05", cls: "8",  sec: "B" },
		{ name: "Ananya Joshi",     dob: "2013-12-20", cls: "8",  sec: "B" },
		/* ── Class 9 – Section A ── */
		{ name: "Rahul Sharma",     dob: "2012-05-14", cls: "9",  sec: "A" },
		{ name: "Anjali Verma",     dob: "2012-08-29", cls: "9",  sec: "A" },
		{ name: "Nikhil Tiwari",    dob: "2012-03-17", cls: "9",  sec: "A" },
		{ name: "Pooja Reddy",      dob: "2012-10-06", cls: "9",  sec: "A" },
		{ name: "Suresh Kumar",     dob: "2012-01-22", cls: "9",  sec: "A" },
		/* ── Class 9 – Section B ── */
		{ name: "Kavya Menon",      dob: "2012-07-11", cls: "9",  sec: "B" },
		{ name: "Harsh Agarwal",    dob: "2012-04-03", cls: "9",  sec: "B" },
		{ name: "Simran Kaur",      dob: "2012-11-28", cls: "9",  sec: "B" },
		{ name: "Akash Yadav",      dob: "2012-06-16", cls: "9",  sec: "B" },
		{ name: "Ritika Bose",      dob: "2012-09-09", cls: "9",  sec: "B" },
		/* ── Class 10 – Section A ── */
		{ name: "Aditya Kapoor",    dob: "2011-02-14", cls: "10", sec: "A" },
		{ name: "Neha Chatterjee",  dob: "2011-07-30", cls: "10", sec: "A" },
		{ name: "Manish Trivedi",   dob: "2011-05-19", cls: "10", sec: "A" },
		{ name: "Deepika Pillai",   dob: "2011-10-07", cls: "10", sec: "A" },
		{ name: "Siddharth Roy",    dob: "2011-03-25", cls: "10", sec: "A" },
		/* ── Class 10 – Section B ── */
		{ name: "Ishaan Malhotra",  dob: "2011-08-13", cls: "10", sec: "B" },
		{ name: "Tanya Saxena",     dob: "2011-01-08", cls: "10", sec: "B" },
		{ name: "Yash Pandey",      dob: "2011-06-22", cls: "10", sec: "B" },
		{ name: "Riya Desai",       dob: "2011-11-17", cls: "10", sec: "B" },
		{ name: "Varun Bhatt",      dob: "2011-04-04", cls: "10", sec: "B" },
		/* ── Class 12 – Section A ── */
		{ name: "Aryan Kapoor",     dob: "2009-03-11", cls: "12", sec: "A" },
		{ name: "Sanya Mehta",      dob: "2009-06-25", cls: "12", sec: "A" },
		{ name: "Devansh Tiwari",   dob: "2009-01-18", cls: "12", sec: "A" },
		{ name: "Nandini Sharma",   dob: "2009-09-04", cls: "12", sec: "A" },
		{ name: "Kunal Verma",      dob: "2009-11-22", cls: "12", sec: "A" },
		/* ── Class 12 – Section B ── */
		{ name: "Tanvi Singh",      dob: "2009-05-30", cls: "12", sec: "B" },
		{ name: "Parth Agarwal",    dob: "2009-08-14", cls: "12", sec: "B" },
		{ name: "Shreya Nair",      dob: "2009-02-07", cls: "12", sec: "B" },
		{ name: "Vivek Pandey",     dob: "2009-10-19", cls: "12", sec: "B" },
		{ name: "Aisha Khan",       dob: "2009-07-03", cls: "12", sec: "B" }
	];

	var year = new Date().getFullYear();
	var seeded = seed.map(function(s, i) {
		var roll = "STD-" + year + "-" + String(i + 1).padStart(4, "0");
		return {
			rollNumber:   roll,
			name:         s.name,
			dateOfBirth:  s.dob,
			studentClass: s.cls,
			section:      s.sec
		};
	});

	saveStudents(seeded);
	localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
	console.log("[Seed] 40 sample students (incl. Class 12) loaded into school_students.");
}