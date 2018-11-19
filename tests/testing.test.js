import { fetchNotes, addNote, notePath } from "../testing";
import fs from "fs";

it("[testing.js:fetchNotes] Deberia devolver un array", () => {
  // Get notes
  var res = fetchNotes();

  // Check type
  if (!Array.isArray(res)) {
    // Array.isArray will return true only if the variable passed is an array
    throw new Error(`Deberia ser Array pero es ${typeof res}`);
  }

  //Test inserting note
  // Creamos JSON que es un objeto, pero no es un array
  const objJson = `{"some":"value"}`;
  // Creamos notas test
  const testFilePath = createTestNotes({ str: objJson });
  // Hacemos fetch sobre el archivo corrupto
  const testNote = fetchNotes({ path: testFilePath });
  if (!Array.isArray(testNote)) {
    //  Pasando un archivo corrupto comprobamos si la funcion devuelve siempre un array o si falla
    throw new Error(
      `Fallo de tipo con datos invalidos: deberia ser array, es: ${typeof testNote}`
    );
  }

  //Test corrupt data load
  const corrJson = `"someFail":"willOccur"}`;
  createTestNotes({ str: corrJson });
  // Hacemos fetch sobre el archivo corrupto
  const corrNote = fetchNotes({ path: testFilePath });
  if (!Array.isArray(corrNote)) {
    //  Pasando un archivo corrupto comprobamos si la funcion devuelve siempre un array o si falla
    throw new Error(
      `Fallo de tipo con datos corruptos: deberia ser array, es: ${typeof corrNote}`
    );
  }

  //Clean up

  fs.unlinkSync(testFilePath);
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
const createTestNotes = ({ path = "./test.txt", str }) => {
  try {
    // Escribimos archivo de prueba
    fs.writeFileSync(path, str);
    return path;
  } catch (e) {
    throw Error(`[CRITICAL] Error creating note test file`);
  }
};
