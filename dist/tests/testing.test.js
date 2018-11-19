"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _testing = require("../testing");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it("[testing.js:fetchNotes] Deberia devolver un array", function () {
  // Get notes
  var res = (0, _testing.fetchNotes)();

  // Check type
  if (!Array.isArray(res)) {
    // Array.isArray will return true only if the variable passed is an array
    throw new Error("Deberia ser Array pero es " + (typeof res === "undefined" ? "undefined" : _typeof(res)));
  }

  //Test inserting note
  // Creamos JSON que es un objeto, pero no es un array
  var objJson = "{\"some\":\"value\"}";
  // Creamos notas test
  var testFilePath = createTestNotes({ str: objJson });
  // Hacemos fetch sobre el archivo corrupto
  var testNote = (0, _testing.fetchNotes)({ path: testFilePath });
  if (!Array.isArray(testNote)) {
    //  Pasando un archivo corrupto comprobamos si la funcion devuelve siempre un array o si falla
    throw new Error("Fallo de tipo con datos invalidos: deberia ser array, es: " + (typeof testNote === "undefined" ? "undefined" : _typeof(testNote)));
  }

  //Test corrupt data load
  var corrJson = "\"someFail\":\"willOccur\"}";
  createTestNotes({ str: corrJson });
  // Hacemos fetch sobre el archivo corrupto
  var corrNote = (0, _testing.fetchNotes)({ path: testFilePath });
  if (!Array.isArray(corrNote)) {
    //  Pasando un archivo corrupto comprobamos si la funcion devuelve siempre un array o si falla
    throw new Error("Fallo de tipo con datos corruptos: deberia ser array, es: " + (typeof corrNote === "undefined" ? "undefined" : _typeof(corrNote)));
  }

  //Clean up

  _fs2.default.unlinkSync(testFilePath);
});

/**
 * @desc Crea un archivo de texto en el path y con el str pasados
 * @example
 *  createTestNotes({str : 'someValue'});
 * @param {object} obj - Un objeto
 * @param {string} obj.str - El string a escribir en archivo
 * @param {string} [obj.path] - Direccion donde guardar el archivo
 * @return {string} La direccion donde se ha escrito el archivo
 */
var createTestNotes = function createTestNotes(_ref) {
  var _ref$path = _ref.path,
      path = _ref$path === undefined ? "./test.txt" : _ref$path,
      str = _ref.str;

  try {
    // Escribimos archivo de prueba
    _fs2.default.writeFileSync(path, str);
    return path;
  } catch (e) {
    throw Error("[CRITICAL] Error creating note test file");
  }
};