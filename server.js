const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

// Get = READ - Post = CREATE - Put = UPDATE - Delete -= DELETE


//GET route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
  console.log("index.html route working")
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    console.log("notes.html route working")
})

// API route for getting notes - This gets all the json(db) to show our notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(err) throw err
        res.json(notes)
        console.log("GET METHOD IS WORKING")
    })
})

// API route for creating notes - This handles creating a note and adding it to json(db)
app.post('/api/notes', (req, res) => {
    const postNote = createNote(req.body, notes)
    res.json(postNote)
    console.log("POST METHOD IS WORKING")
})

// Function that actually handles creating note with id and updating our db file
const createNote = (body, notesArr) => {
    const postNote = body;
    body.id = notesArr.length;
    notesArr.push(postNote)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArr, 2)
    )
    return postNote
}

//  API route for deleting notes - This deletes a note by id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id)
    res.json(true)
    console.log("DELETE METHOD IS WORKING")
})

const deleteNote = (noteId) => {
    for(let i = 0; i < notes.length; i++) {
        let note = notes[i]
        if (note.id == noteId) {
            notes.splice(i, 1)
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json"),
                JSON.stringify(notes)
            )
            break;
        } else {
            console.log("No note matches that id")
        }
    }
}


app.listen(PORT, ()=> {
    console.log(`listening on PORT: ${PORT}`)
})