"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notePath = undefined;
exports.createNote = createNote;
exports.fetchNotes = fetchNotes;
exports.addNote = addNote;
exports.getNote = getNote;
exports.deleteNote = deleteNote;

var _fs = require("fs");

var _yargs = require("yargs");

/*
 *  ----    EXPORTS   ----
 *
 *  Estas funciones se exportan. Esto quiere decir que son
 *  utilizables desde cualquier punto del proyecto.
 *
 *  Para importar una funcion en otro archivo, se sigue la
 *  siguiente sintaxis:
 *
 *  import { fetchNotes } from 'pathToFile/file.js';
 *
 *  Donde pathToFile y file son la direccion del archivo en
 *  el proyecto. Si el archivo se encuentra en la carpeta root del proyecto
 *  la linea queda asi:
 *
 *  import { fetchNotes } from './testing.js';
 */

/* Se importan modulos */
function createNote(_ref) {
  var title = _ref.title,
      body = _ref.body;

  var note = {
    title: title,
    body: body,
    created: new Date(),
    lastModified: new Date()
  };
  return note;
}
/* Parseo de comandos por consola */
var notePath = exports.notePath = "./notes.txt";
/**
 * @desc Devuelve un array con las notas o vacio
 *
 * @example
 * import {fechNotes, notePath} from './testing.js';
 *
 * const notes = fetchNotes({notePath});
 *
 *  @param {Object} o - Un objeto
 *  @param {string} [o.notePath = './notes.txt'] - Direccion de archivo de notas a abrir
 *  @return {Array.<object>} El array con las notas (o vacio)
 */
function fetchNotes() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$path = _ref2.path,
      path = _ref2$path === undefined ? notePath : _ref2$path;

  var notes = [];
  try {
    if (!path || typeof path !== "string") return notes;
    notes = (0, _fs.readFileSync)(path, { encoding: "utf8" });
    var jsonObj = [];
    if (notes) {
      jsonObj = JSON.parse(notes);
      if (!Array.isArray(jsonObj)) {
        return [];
      }
    }
  } catch (e) {
    console.log("Error parsing notes:", e);
  }

  return jsonObj;
}
/**
 * @desc Añade una nueva nota.
 *
 * @example
 *  const wasSuccessful = addNote("Un nuevo titulo","Con mas texto");
 *
 *  @param {string} title - Titulo de la nota
 *  @param {string} body - Cuerpo de la nota
 *  @return {boolean} True if successful, false if something failed
 */
function addNote(title, body) {
  //Parameter checking
  if (!title || typeof title !== "string") {
    console.log("ERROR: title is not a string or is empty!");
    return false;
  }

  var notes = fetchNotes();

  var note = createNote({ title: title, body: body });

  notes.push(note);
  var newArray = JSON.stringify(notes);

  (0, _fs.writeFile)(notePath, newArray, function (err) {
    if (err) {
      console.log("ERROR: File could not be opened:", err);
      return false;
    }
    console.log("SUCCESS: File writing done");
    return true;
  });
}

/**
 * @desc Devuelve notas filtradas por título.
 *
 * @example
 *  const Results = getNote(title);
 *
 *  @param {string} title - Titulo de la nota
 *  @return {Array<object>} True-->Array with search resutls , false-->Empty array
 */
function getNote(title) {
  if (!title || typeof title !== "string") {
    console.log("Error: A title is required");
    return false;
  }

  var db = fetchNotes();
  var notes = db.filter(function searchNote(note) {
    return note.body.match(new RegExp(title, "i")) || note.title.match(new RegExp(title, "i"));
  });
  if (notes.length == 0) {
    console.log("No results for search " + title);
  }
  return notes;
}

/**
 * @desc Elimina una nueva nota.
 *
 * @example
 *  const wasSuccessful = deleteNote(title);
 *
 *  @param {string} title - Titulo de la nota a eliminar
 *  @return {boolean} True , false
 */
function deleteNote(title) {
  var search = fetchNotes();
  if (search.length === 0) {
    console.log("No notes to delete");
    return false;
  }
  var index = search.findIndex(function (note) {
    return note.title === title;
  });
  if (index === -1) {
    console.log("No notes match " + title);
    return false;
  }
  var removedNote = search.splice(index, 1);
  try {
    (0, _fs.writeFile)(notePath, JSON.stringify(search), function (error) {
      if (error) throw err;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}
/* ----    END EXPORTS   ---- */

/* ----     EXECUTABLE CODE    ----
 *
 *  Este codigo solo se ejecuta con el siguiente comando en
 *  el terminal:
 *
 *  npm run testing
 *
 *  He creado un script "testing" en package.json para que
 *  ejecute el comando [ npm run build && node dist/testing.js ]
 *  simplemente con poner npm run testing. Podeis ver como esta hecho en el
 *  archivo package.json, bajo la propiedad "scripts".
 */
//console.log(getNote("1"));
console.log(deleteNote("The new note 2"));
switch (_yargs.argv._[0]) {
  case "add":
    if (_yargs.argv.hasOwnProperty("title") && _yargs.argv.hasOwnProperty("body")) {
      addNote(_yargs.argv.title, _yargs.argv.body);
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
    console.log("Add: add a new note (--title='New Title', --body='Some text here...')");
    console.log("Remove: remove a note (--title='New Title')");
    console.log("Get: get a note (--title='New Title')");
    console.log("Mod: modify a note (--title='New Title', --body='Some text here...')");
    console.log("All: get all notes");
    break;
}