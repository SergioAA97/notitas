import { getNote } from "./testing";

function modNote(titleToSearch, { title, body }) {
  //Get notes

  //Parameter checking
  if (!titleToSearch && typeof titleToSearch !== "string") {
    console.log("Error: Title to search was empty or non valid.");
    return false;
  }
  //Modify note

  //Find the note
  let noteToMod = getNote(titleToSearch);

  if (noteToMod.length === 0) {
    console.log("No note found for title ", titleToSearch);
    return false;
  }
}
