"use strict";

var _testing = require("./testing");

function modNote(titleToSearch, _ref) {
  var title = _ref.title,
      body = _ref.body;

  //Get notes

  //Parameter checking
  if (!titleToSearch && typeof titleToSearch !== "string") {
    console.log("Error: Title to search was empty or non valid.");
    return false;
  }
  //Modify note

  //Find the note
  var noteToMod = (0, _testing.getNote)(titleToSearch);

  if (noteToMod.length === 0) {
    console.log("No note found for title ", titleToSearch);
    return false;
  }
}