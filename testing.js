/* Se importan modulos */
import { readFileSync, writeFile, fstat } from "fs";
/* Parseo de comandos por consola */
import { argv } from "yargs";

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
export function createNote({ title, body }) {
  let note = {
    id: generateId(),
    title,
    body,
    created: new Date(),
    lastModified: new Date()
  };
  return note;
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
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  var arr = fetchNotes();
  var id = generate();

  var isUnique = false;
  //Check duplicates
  while (!isUnique) {
    //Check notes for matching id
    var dup = arr.filter(x => x.id === id);
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

export const notePath = "./notes.txt";
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
export function fetchNotes({ path = notePath } = {}) {
  var notes = [];
  try {
    if (!path || typeof path !== "string") return notes;
    notes = readFileSync(path, { encoding: "utf8" });
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
export function addNote(title, body) {
  //Parameter checking
  if (!title || typeof title !== "string") {
    console.log("ERROR: title is not a string or is empty!");
    return false;
  }

  /* Codigo que se ejecuta al correr el programa desde la consola */

  var notes = fetchNotes();

  var note = createNote({ title, body });

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

/**
 * @desc Devuelve notas filtradas por título.
 *
 * @example
 *  const Results = getNote(title);
 *
 *  @param {string} title - Titulo de la nota
 *  @return {Array<object>} True-->Array with search resutls , false-->Empty array
 */
export function getNote(title) {
  if (!title || typeof title !== "string") {
    console.log("Error: A title is required");
    return false;
  }

  var db = fetchNotes();
  var notes = db.filter(function(note) {
    return (
      note.body.match(new RegExp(title, "i")) ||
      note.title.match(new RegExp(title, "i"))
    );
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
export function deleteNote(title) {
  let search = fetchNotes();
  if (search.length === 0) {
    console.log("No notes to delete");
    return false;
  }
  let index = search.findIndex(function(note) {
    return note.title === title;
  });
  if (index === -1) {
    console.log("No notes match " + title);
    return false;
  }

  search.splice(index, 1);

  try {
    writeFile(notePath, JSON.stringify(search), function(error) {
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

switch (argv._[0]) {
  case "add":
    if (argv.hasOwnProperty("title") && argv.hasOwnProperty("body")) {
      addNote(argv.title, argv.body);
    }

    break;
  case "remove":
    if (argv.hasOwnProperty("title")) {
      console.log(deleteNote(argv.title));
    }
    break;
  case "get":
    if (argv.hasOwnProperty("title")) {
      console.log(getNote(argv.title));
    }
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
