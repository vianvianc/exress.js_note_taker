const { randomUUID } = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path"); //comes with node at core SHIPPED
//not using db
const db = require("./db/db.json");

const app = express();
const PORT = 3001;

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get("/api", (req, res) => {
//   res.json({
//     title: "test note",
//     text: "taking my first note",
//     note_id: randomUUID(),
//   });
// });

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    return err ? console.log(err) : res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    fs.readFile("db/db.json", "utf-8", (err, data) => {
      if (err) console.log(err);
      const notes = JSON.parse(data);
      const newNote = {
        title,
        text,
        id: randomUUID(),
      };
      console.log(data);
      notes.push(newNote);

      fs.writeFile(`./db/db.json`, JSON.stringify(notes), (err) => {
        if (err) console.error(err);
        res.redirect("/notes");
      });
    });
  }
});
// redirect

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params);
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) console.log(err);
    // console.log(data);
    const notes = JSON.parse(data);
    const filtered = notes.filter((note) => note.id !== req.params.id);
    // console.log(filtered);
    fs.writeFile("db/db.json", JSON.stringify(filtered), (err) => {
      if (err) console.log(err);
      res.redirect("/notes");
    });
  });
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.listen(PORT, () =>
  console.log(`Note app listening at http://localhost:${PORT}`)
);
