const { randomUUID } = require("crypto");
const express = require("express");
const path = require("path"); //comes with node at core SHIPPED
const db = require("./db/db.json");

const app = express();
const PORT = 3001;

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("/api", (req, res) => {
  res.json({
    title: "test note",
    text: "taking my first note",
  });
});

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      //   note_id: uuid(),
    };
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});
// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
