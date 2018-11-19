"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notePath = undefined;
exports.fetchNotes = fetchNotes;
exports.addNote = addNote;

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

/* Parseo de comandos por consola */
function fetchNotes() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$path = _ref.path,
      path = _ref$path === undefined ? notePath : _ref$path;

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

  (0, _fs.writeFile)(notePath, newArray, function (err) {
    if (err) {
      console.log("ERROR: File could not be opened:", err);
      return false;
    }
    console.log("SUCCESS: File writing done");
    return true;
  });
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