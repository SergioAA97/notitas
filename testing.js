import { readFileSync, writeFile } from "fs";
import { argv } from "yargs";

var notePath = "./notes.txt";

function fetchNotes() {
  var notes = readFileSync(notePath, { encoding: "utf8" });
  var jsonObj = [];
  try {
    if (notes) {
      jsonObj = JSON.parse(notes);
    }
  } catch (e) {
    console.log("Error parsing:", e);
  }

  return jsonObj;
}

function addNote(title, body) {
  //Parameter checking
  if (!title || typeof title !== "string") {
    console.log("ERROR: title is not a string or is empty!");
    return false;
  }

  var notes = fetchNotes();

  var note = {
    title: title,
    body: body,
    created: new Date(),
    lastModified: new Date()
  };

  notes.push(note);
  var newArray = JSON.stringify(notes);

  writeFile(notePath, newArray, err => {
    if (err) {
      console.log("ERROR: File could not be opened:", err);
      return false;
    }
    console.log("SUCCESS: File writing done");
    return true;
  });
}

switch (argv._[0]) {
  case "add":
    if (argv.hasOwnProperty("title") && argv.hasOwnProperty("body")) {
      addNote(argv.title, argv.body);
    }

    break;
  case "remove":
    break;
  case "get":
    break;
  case "all":
    console.log(fetchNotes());
    break;
  case "mod":
    break;
  default:
    console.log("Usage:");
    console.log(
      "Add: add a new note (--title='New Title', --body='Some text here...')"
    );
    console.log("Remove: remove a note (--title='New Title')");
    console.log("Get: get a note (--title='New Title')");
    console.log(
      "Mod: modify a note (--title='New Title', --body='Some text here...')"
    );
    console.log("All: get all notes");
    break;
}
