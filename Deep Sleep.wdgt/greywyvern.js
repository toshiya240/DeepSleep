/*
* GreyWyvern's Buffered Text-fade Effect - v2.2
* - A bit of Javascript for handling intelligent fading of text
* - Copyright 2004 - Licenced for free distribution under the BSDL
*   - http://www.opensource.org/licenses/bsd-license.php

/* ***** Begin: GreyWyvern's Buffered Text-fade Effect - v2.2 ****** */
var fader = new Array(), fadeQ = new Array();
var RGB = new Array(256), k = 0, hex = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
for (var i = 0; i < 16; i++) for (var j = 0; j < 16; j++) RGB[k++] = hex[i] + hex[j];

function fadeObj(number, id, colOff, colOn, spdIn, spdOut, def) {
  this.number = number;
  this.id = id;
  this.colOff = [parseInt(colOff.substr(0, 2), 16), parseInt(colOff.substr(2, 2), 16), parseInt(colOff.substr(4, 2), 16)];
  this.colOn = [parseInt(colOn.substr(0, 2), 16), parseInt(colOn.substr(2, 2), 16), parseInt(colOn.substr(4, 2), 16)];
  this.colNow = [parseInt(colOff.substr(0, 2), 16), parseInt(colOff.substr(2, 2), 16), parseInt(colOff.substr(4, 2), 16)];
  this.spdIn = spdIn;
  this.spdOut = spdOut;
  this.def = def;
  this.direction = false;
  this.active = false;
  this.message = new Array();
  this.messageNow = 0;
}

function fadeCmd(number, message, direction) {
  this.number = number;
  this.message = message;
  this.direction = direction;
}

function fade(number, message, direction) {
  if (fader[number].def && fader[number].messageNow == 0 && fader[number].direction) {
    fadeQ[fadeQ.length] = new fadeCmd(number, 0, false);
    fadeQ[fadeQ.length] = new fadeCmd(number, message, direction);
    message = 0;
    direction = false;
  } else fadeQ[fadeQ.length] = new fadeCmd(number, message, direction);
  setTimeout("fadeBegin(" + number + ");", 20);
}

function fadeBegin(number) {
  for (var x = 0; x < fadeQ.length; x++) {
    for (var y = x + 1; y < fadeQ.length; y++) {
      if (fadeQ[x].number == fadeQ[y].number && fadeQ[x].message == fadeQ[y].message && fadeQ[x].direction != fadeQ[y].direction) {
        fadeQ.splice(x, 1);
        fadeQ.splice(y - 1, 1);
      }
    }
  }
  if (!fader[number].active) {
    for (var x = 0; x < fadeQ.length; x++) {
      if (fadeQ[x].number == number && fadeQ[x].direction != fader[number].direction) {
        var del = fadeQ.splice(x, 1);
        setTimeout("fadeEng(" + number + ", " + del[0].message + ", " + del[0].direction + ");", 0);
        break;
      }
    }
  }
}

function fadeEng(number, message, direction) {
  if (!fader[number].active) {
    fader[number].active = true;
    fader[number].direction = direction;
    fader[number].messageNow = message;
    document.getElementById(fader[number].id).innerHTML = fader[number].message[message];
  }
  var iniCol = (direction) ? fader[number].colOff : fader[number].colOn;
  var endCol = (direction) ? fader[number].colOn : fader[number].colOff;
  var incCol = fader[number].colNow;
  var spd = (direction) ? fader[number].spdIn : fader[number].spdOut;
  for (var x = 0; x < 3; x++) {
    var incr = (endCol[x] - iniCol[x]) / spd;
    incCol[x] = (incr < 0) ? Math.max(incCol[x] + incr, endCol[x]) : Math.min(incCol[x] + incr, endCol[x]);
  }
  document.getElementById(fader[number].id).style.color = "#" + RGB[parseInt(incCol[0])] + RGB[parseInt(incCol[1])] + RGB[parseInt(incCol[2])];
  if (incCol[0] == endCol[0] && incCol[1] == endCol[1] && incCol[2] == endCol[2]) {
    fader[number].active = false;
    for (var x = 0; x < fadeQ.length; x++) {
      if (fadeQ[x].number == number) {
        var del = fadeQ.splice(x, 1);
        setTimeout("fadeEng(" + number + ", " + del[0].message + ", " + del[0].direction + ");", 0);
        return false;
      }
    }
    if (!direction) {
      if (fader[number].def) {
        setTimeout("fadeEng(" + number + ", 0, true);", 0);
      } else document.getElementById(fader[number].id).innerHTML = "&nbsp;";
    }
  } else setTimeout("fadeEng(" + number + ", " + message + ", " + direction + ");", 0);
}
/* ***** End: GreyWyvern's Buffered Text-fade Effect - v2.2 ******** */

