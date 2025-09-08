const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
let students = [];
let nextId = 1; 

// Helper: validate payload for create/update
function validateStudentPayload(payload, options = {}) {
  //   requireAllFields: true for POST/PUT (default false)
  //   currentId: numeric id to ignore when checking unique email (for update)
  const { requireallfields = false, currentId = null } = options;
  const errors = [];

  const name = payload.name;
  const email = payload.email;
  const age = payload.age;
  const course = payload.course;

  // Required fields (for create or full update)
  if (requireallfields) {
    if (!name) errors.push("name is required");
    if (!email) errors.push("email is required");
    if (age === undefined) errors.push("age is required");
    if (!course) errors.push("course is required");
  }

  // If email present, basic format check + uniqueness
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push("email is invalid");
    const existing = students.find(s => s.email === email && s.id !== currentId);
    if (existing) errors.push("email must be unique");
  }

  // If age present, must be a positive integer
  if (age !== undefined) {
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum <= 0) errors.push("age must be a positive integer");
  }

  return errors;
}

/*
  ROUTES:
  GET    /students         -> list with pagination ?page & ?limit
  GET    /students/:id     -> get one student
  POST   /students         -> create (all fields required)
  PUT    /students/:id     -> update (all fields required)
  DELETE /students/:id     -> delete
*/

app.get('/students', (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const total = students.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = students.slice(start, start + limit);

  res.json({
    page,
    limit,
    total,
    totalPages,
    data
  });
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// POST /students (create)
app.post('/students', (req, res) => {
  const payload = req.body;
  const errors = validateStudentPayload(payload, { requireAllFields: true });
  if (errors.length) return res.status(400).json({ errors });

  const newStudent = {
    id: nextId++,
    name: payload.name,
    email: payload.email,
    age: Number(payload.age),
    course: payload.course
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /students/:id (full update)
app.put('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const payload = req.body;
  const errors = validateStudentPayload(payload, { requireAllFields: true, currentId: id });
  if (errors.length) return res.status(400).json({ errors });

  const updated = {
    id,
    name: payload.name,
    email: payload.email,
    age: Number(payload.age),
    course: payload.course
  };

  students[index] = updated;
  res.json(updated);
});

// DELETE /students/:id
app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const deleted = students.splice(index, 1)[0];
  res.json({ message: "Deleted", student: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Student API running at http://localhost:${PORT}`);
});
