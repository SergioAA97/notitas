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
exports.modNote = modNote;

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

/**
 * @desc Crea un objeto de tipo nota inicializado y lo devuelve
 *
 * @example
 * import {createNote} from './testing.js';
 *
 * const note = createNote({title: "Titulo",body:"Body"});
 *
 *  @param {Object} o - Un objeto
 *  @param {string} o.title - Un titulo
 *  @param {string} o.body - Un cuepo de texto
 *  @return {Object} El objeto nota
 */
/* Se importan modulos */
function createNote(_ref) {
  var title = _ref.title,
      body = _ref.body;

  var note = {
    id: generateId(),
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

  /* Codigo que se ejecuta al correr el programa desde la consola */

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
  var notes = db.filter(function (note) {
    return note.body.match(new RegExp(title, "i")) || note.title.match(new RegExp(title, "i"));
  });
  if (notes.length == 0) {
    console.log("No results for search " + title);
  }
  return notes;
}

/**
 * @desc Elimina una nota.
 *
 * @example
 *  const wasSuccessful = deleteNote(title);
 *
 *  @param {string} title - Titulo de la nota a eliminar
 *  @return {boolean} True , false
 */
function deleteNote(id) {
  var search = fetchNotes();
  if (search.length === 0) {
    console.log("No notes to delete");
    return false;
  }
  var index = search.findIndex(function (note) {
    return note.id === id;
  });
  if (index === -1) {
    console.log("No notes match " + id);
    return false;
  }

  search.splice(index, 1);

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
/**
 * @desc Modifica una nota.
 *
 * @example
 *  const wasSuccessful = modNote(id,{title: "New title",body:"New body"});
 *  @param {string} idToSearch - Id de la nota a modificar
 *  @param {object} o - Objeto con propiedades a modificar
 *  @param {string} o.title - Titulo del objeto a modificar
 *  @param {string} o.body  - Body del objeto a modificar
 *  @return {boolean} True , false
 */
function modNote(idToSearch, _ref3) {
  var title = _ref3.title,
      body = _ref3.body;

  //Parameter checking
  if (!idToSearch && typeof idToSearch !== "string") {
    console.log("Error: id to search was empty or non valid.");
    return false;
  }
  //Get notes
  var notes = fetchNotes();

  //Find the note
  var index = notes.findIndex(function (x) {
    return x.id === idToSearch;
  });
  if (index === -1) {
    console.log("No note found for id ", idToSearch);
    return false;
  }
  if (title || body) {
    var modified = false;
    if (title && typeof title === "string") {
      notes[index].title = title;
      modified = true;
    }
    if (body && typeof body === "string") {
      notes[index].body = body;
      modified = true;
    }
    if (modified) {
      notes[index].lastModified = new Date();
    } else {
      return false;
    }

    return writeNotes(notes);
  }
  return false;
}
/* ----    END EXPORTS   ---- */
/* ----    LOCAL FUNCTIONS   ---- */
/**
 * @desc Escribe notas a partir de Array a archivo
 *
 * @example
 * var success = writeNotes(notes,"./somePath.txt");
 *
 * @return {boolean} Devuelve verdadero si se escribe con exito, falso si hay error
 */
function writeNotes(notes) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : notePath;

  try {
    (0, _fs.writeFile)(path, JSON.stringify(notes), function (error) {
      if (error) throw err;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

/**
 * @desc Genera un ID unico
 *
 * @example
 * var id = generateId();
 *
 *  @return {string} El ID
 */
function generateId() {
  function generate() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  var arr = fetchNotes();
  var id = generate();

  var isUnique = false;
  //Check duplicates
  while (!isUnique) {
    //Check notes for matching id
    var dup = arr.filter(function (x) {
      return x.id === id;
    });
    if (dup.length === 0) {
      //No duplicates
      isUnique = true;
    } else {
      //Re generate
      id = generate();
    }
  }

  return id;
}

/* ----    END LOCAL FUNCTIONS   ---- */

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
    if (_yargs.argv.hasOwnProperty("id")) {
      console.log(deleteNote(_yargs.argv.id));
    }
    break;
  case "get":
    if (_yargs.argv.hasOwnProperty("title")) {
      console.log(getNote(_yargs.argv.title));
    }
    break;
  case "all":
    console.log(fetchNotes());
    break;
  case "mod":
    if (_yargs.argv.hasOwnProperty("id") && (_yargs.argv.hasOwnProperty("title") || _yargs.argv.hasOwnProperty("body"))) {
      var obj = {
        title: _yargs.argv.title ? _yargs.argv.title : "",
        body: _yargs.argv.body ? _yargs.argv.body : ""
      };
      console.log(modNote(_yargs.argv.id, obj));
    }
    break;
  default:
    console.log("Usage:");
    console.log("Add: add a new note (--title='New Title', --body='Some text here...')");
    console.log("Remove: remove a note (--id='New id')");
    console.log("Get: get a note (--title='New Title')");
    console.log("Mod: modify a note (--id='New id', --body='Some text here...')");
    console.log("All: get all notes");
    break;
}