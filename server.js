// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.port || 3000;






var notes = [];

var id = -1;



// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// =============================================================
// Basic route that sends the user first to the AJAX Page
// GET * - Should return the index.html file
app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "public/index.html"));
});


// GET /notes - Should return the notes.html file.

app.get("/notes", function (req, res) {

    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET /api/notes - Should read the db.json file and return all saved notes as JSON.

// =============================================================

app.get("/api/notes", function (req, res) {

    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", function (err, data) {

        if (err) {
            throw err;
        }

        notes = JSON.parse(data);

        id = notes.length;

        return res.json(notes);
    });


});

// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {

    id = parseInt(id) + 1;
    id = id.toString();
    var newNote = req.body;
    var newNoteArray = [...notes, { ...newNote, "id": id }];

    // add it to the db.json file,
    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(newNoteArray, null, '\t'));

    console.log("note has been successfully added");

    // return the new note to the client.
    return res.json(notes);

});

// delete /api/notes - Should delete the selected note, update it to the db.json file, and then return the new note to the client.
app.delete("/api/notes/:id", function (req, res) {

    var index = req.params.id;
    for (let i = 0; i < notes.length; i++) {
        if (index === notes[i].id) {

            notes.splice(i, 1);

            // update it to the db.json file,
            fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, '\t'));
            
            console.log("note has been successfully deleted");

            // return the new note to the client.
            return res.json(notes);
        }

    }

});





















// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
    console.log("Welcome!")
});