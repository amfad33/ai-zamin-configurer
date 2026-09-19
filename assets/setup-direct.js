var AIZaminDirect = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // browser-config/node_modules/jsonc-parser/lib/esm/impl/scanner.js
  function createScanner(text, ignoreTrivia = false) {
    const len = text.length;
    let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
    function scanHexDigits(count, exact) {
      let digits = 0;
      let value2 = 0;
      while (digits < count || !exact) {
        let ch = text.charCodeAt(pos);
        if (ch >= 48 && ch <= 57) {
          value2 = value2 * 16 + ch - 48;
        } else if (ch >= 65 && ch <= 70) {
          value2 = value2 * 16 + ch - 65 + 10;
        } else if (ch >= 97 && ch <= 102) {
          value2 = value2 * 16 + ch - 97 + 10;
        } else {
          break;
        }
        pos++;
        digits++;
      }
      if (digits < count) {
        value2 = -1;
      }
      return value2;
    }
    function setPosition(newPosition) {
      pos = newPosition;
      value = "";
      tokenOffset = 0;
      token = 16;
      scanError = 0;
    }
    function scanNumber() {
      let start = pos;
      if (text.charCodeAt(pos) === 48) {
        pos++;
      } else {
        pos++;
        while (pos < text.length && isDigit2(text.charCodeAt(pos))) {
          pos++;
        }
      }
      if (pos < text.length && text.charCodeAt(pos) === 46) {
        pos++;
        if (pos < text.length && isDigit2(text.charCodeAt(pos))) {
          pos++;
          while (pos < text.length && isDigit2(text.charCodeAt(pos))) {
            pos++;
          }
        } else {
          scanError = 3;
          return text.substring(start, pos);
        }
      }
      let end = pos;
      if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
        pos++;
        if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
          pos++;
        }
        if (pos < text.length && isDigit2(text.charCodeAt(pos))) {
          pos++;
          while (pos < text.length && isDigit2(text.charCodeAt(pos))) {
            pos++;
          }
          end = pos;
        } else {
          scanError = 3;
        }
      }
      return text.substring(start, end);
    }
    function scanString() {
      let result = "", start = pos;
      while (true) {
        if (pos >= len) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        }
        const ch = text.charCodeAt(pos);
        if (ch === 34) {
          result += text.substring(start, pos);
          pos++;
          break;
        }
        if (ch === 92) {
          result += text.substring(start, pos);
          pos++;
          if (pos >= len) {
            scanError = 2;
            break;
          }
          const ch2 = text.charCodeAt(pos++);
          switch (ch2) {
            case 34:
              result += '"';
              break;
            case 92:
              result += "\\";
              break;
            case 47:
              result += "/";
              break;
            case 98:
              result += "\b";
              break;
            case 102:
              result += "\f";
              break;
            case 110:
              result += "\n";
              break;
            case 114:
              result += "\r";
              break;
            case 116:
              result += "	";
              break;
            case 117:
              const ch3 = scanHexDigits(4, true);
              if (ch3 >= 0) {
                result += String.fromCharCode(ch3);
              } else {
                scanError = 4;
              }
              break;
            default:
              scanError = 5;
          }
          start = pos;
          continue;
        }
        if (ch >= 0 && ch <= 31) {
          if (isLineBreak(ch)) {
            result += text.substring(start, pos);
            scanError = 2;
            break;
          } else {
            scanError = 6;
          }
        }
        pos++;
      }
      return result;
    }
    function scanNext() {
      value = "";
      scanError = 0;
      tokenOffset = pos;
      lineStartOffset = lineNumber;
      prevTokenLineStartOffset = tokenLineStartOffset;
      if (pos >= len) {
        tokenOffset = len;
        return token = 17;
      }
      let code = text.charCodeAt(pos);
      if (isWhiteSpace(code)) {
        do {
          pos++;
          value += String.fromCharCode(code);
          code = text.charCodeAt(pos);
        } while (isWhiteSpace(code));
        return token = 15;
      }
      if (isLineBreak(code)) {
        pos++;
        value += String.fromCharCode(code);
        if (code === 13 && text.charCodeAt(pos) === 10) {
          pos++;
          value += "\n";
        }
        lineNumber++;
        tokenLineStartOffset = pos;
        return token = 14;
      }
      switch (code) {
        // tokens: []{}:,
        case 123:
          pos++;
          return token = 1;
        case 125:
          pos++;
          return token = 2;
        case 91:
          pos++;
          return token = 3;
        case 93:
          pos++;
          return token = 4;
        case 58:
          pos++;
          return token = 6;
        case 44:
          pos++;
          return token = 5;
        // strings
        case 34:
          pos++;
          value = scanString();
          return token = 10;
        // comments
        case 47:
          const start = pos - 1;
          if (text.charCodeAt(pos + 1) === 47) {
            pos += 2;
            while (pos < len) {
              if (isLineBreak(text.charCodeAt(pos))) {
                break;
              }
              pos++;
            }
            value = text.substring(start, pos);
            return token = 12;
          }
          if (text.charCodeAt(pos + 1) === 42) {
            pos += 2;
            const safeLength = len - 1;
            let commentClosed = false;
            while (pos < safeLength) {
              const ch = text.charCodeAt(pos);
              if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
                pos += 2;
                commentClosed = true;
                break;
              }
              pos++;
              if (isLineBreak(ch)) {
                if (ch === 13 && text.charCodeAt(pos) === 10) {
                  pos++;
                }
                lineNumber++;
                tokenLineStartOffset = pos;
              }
            }
            if (!commentClosed) {
              pos++;
              scanError = 1;
            }
            value = text.substring(start, pos);
            return token = 13;
          }
          value += String.fromCharCode(code);
          pos++;
          return token = 16;
        // numbers
        case 45:
          value += String.fromCharCode(code);
          pos++;
          if (pos === len || !isDigit2(text.charCodeAt(pos))) {
            return token = 16;
          }
        // found a minus, followed by a number so
        // we fall through to proceed with scanning
        // numbers
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          value += scanNumber();
          return token = 11;
        // literals and unknown symbols
        default:
          while (pos < len && isUnknownContentCharacter(code)) {
            pos++;
            code = text.charCodeAt(pos);
          }
          if (tokenOffset !== pos) {
            value = text.substring(tokenOffset, pos);
            switch (value) {
              case "true":
                return token = 8;
              case "false":
                return token = 9;
              case "null":
                return token = 7;
            }
            return token = 16;
          }
          value += String.fromCharCode(code);
          pos++;
          return token = 16;
      }
    }
    function isUnknownContentCharacter(code) {
      if (isWhiteSpace(code) || isLineBreak(code)) {
        return false;
      }
      switch (code) {
        case 125:
        case 93:
        case 123:
        case 91:
        case 34:
        case 58:
        case 44:
        case 47:
          return false;
      }
      return true;
    }
    function scanNextNonTrivia() {
      let result;
      do {
        result = scanNext();
      } while (result >= 12 && result <= 15);
      return result;
    }
    return {
      setPosition,
      getPosition: () => pos,
      scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
      getToken: () => token,
      getTokenValue: () => value,
      getTokenOffset: () => tokenOffset,
      getTokenLength: () => pos - tokenOffset,
      getTokenStartLine: () => lineStartOffset,
      getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
      getTokenError: () => scanError
    };
  }
  function isWhiteSpace(ch) {
    return ch === 32 || ch === 9;
  }
  function isLineBreak(ch) {
    return ch === 10 || ch === 13;
  }
  function isDigit2(ch) {
    return ch >= 48 && ch <= 57;
  }
  var CharacterCodes;
  var init_scanner = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/impl/scanner.js"() {
      "use strict";
      (function(CharacterCodes2) {
        CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
        CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
        CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
        CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
        CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
        CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
        CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
        CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
        CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
        CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
        CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
        CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
        CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
        CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
        CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
        CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
        CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
        CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
        CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
        CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
        CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
        CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
        CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
        CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
        CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
        CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
        CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
        CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
        CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
        CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
        CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
        CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
        CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
        CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
        CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
        CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
        CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
        CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
        CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
        CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
        CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
        CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
        CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
        CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
        CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
        CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
        CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
        CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
        CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
        CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
        CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
        CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
        CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
        CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
        CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
        CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
        CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
        CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
        CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
        CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
        CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
        CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
        CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
        CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
        CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
        CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
        CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
        CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
        CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
        CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
        CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
        CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
        CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
        CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
        CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
        CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
        CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
        CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
        CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
        CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
      })(CharacterCodes || (CharacterCodes = {}));
    }
  });

  // browser-config/node_modules/jsonc-parser/lib/esm/impl/string-intern.js
  var cachedSpaces, maxCachedValues, cachedBreakLinesWithSpaces, supportedEols;
  var init_string_intern = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/impl/string-intern.js"() {
      cachedSpaces = new Array(20).fill(0).map((_, index) => {
        return " ".repeat(index);
      });
      maxCachedValues = 200;
      cachedBreakLinesWithSpaces = {
        " ": {
          "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\n" + " ".repeat(index);
          }),
          "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\r" + " ".repeat(index);
          }),
          "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\r\n" + " ".repeat(index);
          })
        },
        "	": {
          "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\n" + "	".repeat(index);
          }),
          "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\r" + "	".repeat(index);
          }),
          "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
            return "\r\n" + "	".repeat(index);
          })
        }
      };
      supportedEols = ["\n", "\r", "\r\n"];
    }
  });

  // browser-config/node_modules/jsonc-parser/lib/esm/impl/format.js
  function format(documentText, range, options) {
    let initialIndentLevel;
    let formatText;
    let formatTextStart;
    let rangeStart;
    let rangeEnd;
    if (range) {
      rangeStart = range.offset;
      rangeEnd = rangeStart + range.length;
      formatTextStart = rangeStart;
      while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
        formatTextStart--;
      }
      let endOffset = rangeEnd;
      while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
        endOffset++;
      }
      formatText = documentText.substring(formatTextStart, endOffset);
      initialIndentLevel = computeIndentLevel(formatText, options);
    } else {
      formatText = documentText;
      initialIndentLevel = 0;
      formatTextStart = 0;
      rangeStart = 0;
      rangeEnd = documentText.length;
    }
    const eol = getEOL(options, documentText);
    const eolFastPathSupported = supportedEols.includes(eol);
    let numberLineBreaks = 0;
    let indentLevel = 0;
    let indentValue;
    if (options.insertSpaces) {
      indentValue = cachedSpaces[options.tabSize || 4] ?? repeat(cachedSpaces[1], options.tabSize || 4);
    } else {
      indentValue = "	";
    }
    const indentType = indentValue === "	" ? "	" : " ";
    let scanner = createScanner(formatText, false);
    let hasError = false;
    function newLinesAndIndent() {
      if (numberLineBreaks > 1) {
        return repeat(eol, numberLineBreaks) + repeat(indentValue, initialIndentLevel + indentLevel);
      }
      const amountOfSpaces = indentValue.length * (initialIndentLevel + indentLevel);
      if (!eolFastPathSupported || amountOfSpaces > cachedBreakLinesWithSpaces[indentType][eol].length) {
        return eol + repeat(indentValue, initialIndentLevel + indentLevel);
      }
      if (amountOfSpaces <= 0) {
        return eol;
      }
      return cachedBreakLinesWithSpaces[indentType][eol][amountOfSpaces];
    }
    function scanNext() {
      let token = scanner.scan();
      numberLineBreaks = 0;
      while (token === 15 || token === 14) {
        if (token === 14 && options.keepLines) {
          numberLineBreaks += 1;
        } else if (token === 14) {
          numberLineBreaks = 1;
        }
        token = scanner.scan();
      }
      hasError = token === 16 || scanner.getTokenError() !== 0;
      return token;
    }
    const editOperations = [];
    function addEdit(text, startOffset, endOffset) {
      if (!hasError && (!range || startOffset < rangeEnd && endOffset > rangeStart) && documentText.substring(startOffset, endOffset) !== text) {
        editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
      }
    }
    let firstToken = scanNext();
    if (options.keepLines && numberLineBreaks > 0) {
      addEdit(repeat(eol, numberLineBreaks), 0, 0);
    }
    if (firstToken !== 17) {
      let firstTokenStart = scanner.getTokenOffset() + formatTextStart;
      let initialIndent = indentValue.length * initialIndentLevel < 20 && options.insertSpaces ? cachedSpaces[indentValue.length * initialIndentLevel] : repeat(indentValue, initialIndentLevel);
      addEdit(initialIndent, formatTextStart, firstTokenStart);
    }
    while (firstToken !== 17) {
      let firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      let secondToken = scanNext();
      let replaceContent = "";
      let needsLineBreak = false;
      while (numberLineBreaks === 0 && (secondToken === 12 || secondToken === 13)) {
        let commentTokenStart = scanner.getTokenOffset() + formatTextStart;
        addEdit(cachedSpaces[1], firstTokenEnd, commentTokenStart);
        firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
        needsLineBreak = secondToken === 12;
        replaceContent = needsLineBreak ? newLinesAndIndent() : "";
        secondToken = scanNext();
      }
      if (secondToken === 2) {
        if (firstToken !== 1) {
          indentLevel--;
        }
        ;
        if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 1) {
          replaceContent = newLinesAndIndent();
        } else if (options.keepLines) {
          replaceContent = cachedSpaces[1];
        }
      } else if (secondToken === 4) {
        if (firstToken !== 3) {
          indentLevel--;
        }
        ;
        if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 3) {
          replaceContent = newLinesAndIndent();
        } else if (options.keepLines) {
          replaceContent = cachedSpaces[1];
        }
      } else {
        switch (firstToken) {
          case 3:
          case 1:
            indentLevel++;
            if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
              replaceContent = newLinesAndIndent();
            } else {
              replaceContent = cachedSpaces[1];
            }
            break;
          case 5:
            if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
              replaceContent = newLinesAndIndent();
            } else {
              replaceContent = cachedSpaces[1];
            }
            break;
          case 12:
            replaceContent = newLinesAndIndent();
            break;
          case 13:
            if (numberLineBreaks > 0) {
              replaceContent = newLinesAndIndent();
            } else if (!needsLineBreak) {
              replaceContent = cachedSpaces[1];
            }
            break;
          case 6:
            if (options.keepLines && numberLineBreaks > 0) {
              replaceContent = newLinesAndIndent();
            } else if (!needsLineBreak) {
              replaceContent = cachedSpaces[1];
            }
            break;
          case 10:
            if (options.keepLines && numberLineBreaks > 0) {
              replaceContent = newLinesAndIndent();
            } else if (secondToken === 6 && !needsLineBreak) {
              replaceContent = "";
            }
            break;
          case 7:
          case 8:
          case 9:
          case 11:
          case 2:
          case 4:
            if (options.keepLines && numberLineBreaks > 0) {
              replaceContent = newLinesAndIndent();
            } else {
              if ((secondToken === 12 || secondToken === 13) && !needsLineBreak) {
                replaceContent = cachedSpaces[1];
              } else if (secondToken !== 5 && secondToken !== 17) {
                hasError = true;
              }
            }
            break;
          case 16:
            hasError = true;
            break;
        }
        if (numberLineBreaks > 0 && (secondToken === 12 || secondToken === 13)) {
          replaceContent = newLinesAndIndent();
        }
      }
      if (secondToken === 17) {
        if (options.keepLines && numberLineBreaks > 0) {
          replaceContent = newLinesAndIndent();
        } else {
          replaceContent = options.insertFinalNewline ? eol : "";
        }
      }
      const secondTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(replaceContent, firstTokenEnd, secondTokenStart);
      firstToken = secondToken;
    }
    return editOperations;
  }
  function repeat(s, count) {
    let result = "";
    for (let i = 0; i < count; i++) {
      result += s;
    }
    return result;
  }
  function computeIndentLevel(content, options) {
    let i = 0;
    let nChars = 0;
    const tabSize = options.tabSize || 4;
    while (i < content.length) {
      let ch = content.charAt(i);
      if (ch === cachedSpaces[1]) {
        nChars++;
      } else if (ch === "	") {
        nChars += tabSize;
      } else {
        break;
      }
      i++;
    }
    return Math.floor(nChars / tabSize);
  }
  function getEOL(options, text) {
    for (let i = 0; i < text.length; i++) {
      const ch = text.charAt(i);
      if (ch === "\r") {
        if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
          return "\r\n";
        }
        return "\r";
      } else if (ch === "\n") {
        return "\n";
      }
    }
    return options && options.eol || "\n";
  }
  function isEOL(text, offset) {
    return "\r\n".indexOf(text.charAt(offset)) !== -1;
  }
  var init_format = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/impl/format.js"() {
      "use strict";
      init_scanner();
      init_string_intern();
    }
  });

  // browser-config/node_modules/jsonc-parser/lib/esm/impl/parser.js
  function getLocation(text, position) {
    const segments = [];
    const earlyReturnException = new Object();
    let previousNode = void 0;
    const previousNodeInst = {
      value: {},
      offset: 0,
      length: 0,
      type: "object",
      parent: void 0
    };
    let isAtPropertyKey = false;
    function setPreviousNode(value, offset, length, type) {
      previousNodeInst.value = value;
      previousNodeInst.offset = offset;
      previousNodeInst.length = length;
      previousNodeInst.type = type;
      previousNodeInst.colonOffset = void 0;
      previousNode = previousNodeInst;
    }
    try {
      visit(text, {
        onObjectBegin: (offset, length) => {
          if (position <= offset) {
            throw earlyReturnException;
          }
          previousNode = void 0;
          isAtPropertyKey = position > offset;
          segments.push("");
        },
        onObjectProperty: (name, offset, length) => {
          if (position < offset) {
            throw earlyReturnException;
          }
          setPreviousNode(name, offset, length, "property");
          segments[segments.length - 1] = name;
          if (position <= offset + length) {
            throw earlyReturnException;
          }
        },
        onObjectEnd: (offset, length) => {
          if (position <= offset) {
            throw earlyReturnException;
          }
          previousNode = void 0;
          segments.pop();
        },
        onArrayBegin: (offset, length) => {
          if (position <= offset) {
            throw earlyReturnException;
          }
          previousNode = void 0;
          segments.push(0);
        },
        onArrayEnd: (offset, length) => {
          if (position <= offset) {
            throw earlyReturnException;
          }
          previousNode = void 0;
          segments.pop();
        },
        onLiteralValue: (value, offset, length) => {
          if (position < offset) {
            throw earlyReturnException;
          }
          setPreviousNode(value, offset, length, getNodeType(value));
          if (position <= offset + length) {
            throw earlyReturnException;
          }
        },
        onSeparator: (sep, offset, length) => {
          if (position <= offset) {
            throw earlyReturnException;
          }
          if (sep === ":" && previousNode && previousNode.type === "property") {
            previousNode.colonOffset = offset;
            isAtPropertyKey = false;
            previousNode = void 0;
          } else if (sep === ",") {
            const last = segments[segments.length - 1];
            if (typeof last === "number") {
              segments[segments.length - 1] = last + 1;
            } else {
              isAtPropertyKey = true;
              segments[segments.length - 1] = "";
            }
            previousNode = void 0;
          }
        }
      });
    } catch (e) {
      if (e !== earlyReturnException) {
        throw e;
      }
    }
    return {
      path: segments,
      previousNode,
      isAtPropertyKey,
      matches: (pattern) => {
        let k = 0;
        for (let i = 0; k < pattern.length && i < segments.length; i++) {
          if (pattern[k] === segments[i] || pattern[k] === "*") {
            k++;
          } else if (pattern[k] !== "**") {
            return false;
          }
        }
        return k === pattern.length;
      }
    };
  }
  function parse(text, errors = [], options = ParseOptions.DEFAULT) {
    let currentProperty = null;
    let currentParent = [];
    const previousParents = [];
    function onValue(value) {
      if (Array.isArray(currentParent)) {
        currentParent.push(value);
      } else if (currentProperty !== null) {
        currentParent[currentProperty] = value;
      }
    }
    const visitor = {
      onObjectBegin: () => {
        const object = {};
        onValue(object);
        previousParents.push(currentParent);
        currentParent = object;
        currentProperty = null;
      },
      onObjectProperty: (name) => {
        currentProperty = name;
      },
      onObjectEnd: () => {
        currentParent = previousParents.pop();
      },
      onArrayBegin: () => {
        const array = [];
        onValue(array);
        previousParents.push(currentParent);
        currentParent = array;
        currentProperty = null;
      },
      onArrayEnd: () => {
        currentParent = previousParents.pop();
      },
      onLiteralValue: onValue,
      onError: (error, offset, length) => {
        errors.push({ error, offset, length });
      }
    };
    visit(text, visitor, options);
    return currentParent[0];
  }
  function parseTree(text, errors = [], options = ParseOptions.DEFAULT) {
    let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
    function ensurePropertyComplete(endOffset) {
      if (currentParent.type === "property") {
        currentParent.length = endOffset - currentParent.offset;
        currentParent = currentParent.parent;
      }
    }
    function onValue(valueNode) {
      currentParent.children.push(valueNode);
      return valueNode;
    }
    const visitor = {
      onObjectBegin: (offset) => {
        currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
      },
      onObjectProperty: (name, offset, length) => {
        currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] });
        currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
      },
      onObjectEnd: (offset, length) => {
        ensurePropertyComplete(offset + length);
        currentParent.length = offset + length - currentParent.offset;
        currentParent = currentParent.parent;
        ensurePropertyComplete(offset + length);
      },
      onArrayBegin: (offset, length) => {
        currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
      },
      onArrayEnd: (offset, length) => {
        currentParent.length = offset + length - currentParent.offset;
        currentParent = currentParent.parent;
        ensurePropertyComplete(offset + length);
      },
      onLiteralValue: (value, offset, length) => {
        onValue({ type: getNodeType(value), offset, length, parent: currentParent, value });
        ensurePropertyComplete(offset + length);
      },
      onSeparator: (sep, offset, length) => {
        if (currentParent.type === "property") {
          if (sep === ":") {
            currentParent.colonOffset = offset;
          } else if (sep === ",") {
            ensurePropertyComplete(offset);
          }
        }
      },
      onError: (error, offset, length) => {
        errors.push({ error, offset, length });
      }
    };
    visit(text, visitor, options);
    const result = currentParent.children[0];
    if (result) {
      delete result.parent;
    }
    return result;
  }
  function findNodeAtLocation(root, path) {
    if (!root) {
      return void 0;
    }
    let node = root;
    for (let segment of path) {
      if (typeof segment === "string") {
        if (node.type !== "object" || !Array.isArray(node.children)) {
          return void 0;
        }
        let found = false;
        for (const propertyNode of node.children) {
          if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
            node = propertyNode.children[1];
            found = true;
            break;
          }
        }
        if (!found) {
          return void 0;
        }
      } else {
        const index = segment;
        if (node.type !== "array" || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
          return void 0;
        }
        node = node.children[index];
      }
    }
    return node;
  }
  function getNodePath(node) {
    if (!node.parent || !node.parent.children) {
      return [];
    }
    const path = getNodePath(node.parent);
    if (node.parent.type === "property") {
      const key = node.parent.children[0].value;
      path.push(key);
    } else if (node.parent.type === "array") {
      const index = node.parent.children.indexOf(node);
      if (index !== -1) {
        path.push(index);
      }
    }
    return path;
  }
  function getNodeValue(node) {
    switch (node.type) {
      case "array":
        return node.children.map(getNodeValue);
      case "object":
        const obj = /* @__PURE__ */ Object.create(null);
        for (let prop of node.children) {
          const valueNode = prop.children[1];
          if (valueNode) {
            obj[prop.children[0].value] = getNodeValue(valueNode);
          }
        }
        return obj;
      case "null":
      case "string":
      case "number":
      case "boolean":
        return node.value;
      default:
        return void 0;
    }
  }
  function contains(node, offset, includeRightBound = false) {
    return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
  }
  function findNodeAtOffset(node, offset, includeRightBound = false) {
    if (contains(node, offset, includeRightBound)) {
      const children = node.children;
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length && children[i].offset <= offset; i++) {
          const item = findNodeAtOffset(children[i], offset, includeRightBound);
          if (item) {
            return item;
          }
        }
      }
      return node;
    }
    return void 0;
  }
  function visit(text, visitor, options = ParseOptions.DEFAULT) {
    const _scanner = createScanner(text, false);
    const _jsonPath = [];
    let suppressedCallbacks = 0;
    function toNoArgVisit(visitFunction) {
      return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
    }
    function toOneArgVisit(visitFunction) {
      return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
    }
    function toOneArgVisitWithPath(visitFunction) {
      return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
    }
    function toBeginVisit(visitFunction) {
      return visitFunction ? () => {
        if (suppressedCallbacks > 0) {
          suppressedCallbacks++;
        } else {
          let cbReturn = visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice());
          if (cbReturn === false) {
            suppressedCallbacks = 1;
          }
        }
      } : () => true;
    }
    function toEndVisit(visitFunction) {
      return visitFunction ? () => {
        if (suppressedCallbacks > 0) {
          suppressedCallbacks--;
        }
        if (suppressedCallbacks === 0) {
          visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
        }
      } : () => true;
    }
    const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
    const disallowComments = options && options.disallowComments;
    const allowTrailingComma = options && options.allowTrailingComma;
    function scanNext() {
      while (true) {
        const token = _scanner.scan();
        switch (_scanner.getTokenError()) {
          case 4:
            handleError(
              14
              /* ParseErrorCode.InvalidUnicode */
            );
            break;
          case 5:
            handleError(
              15
              /* ParseErrorCode.InvalidEscapeCharacter */
            );
            break;
          case 3:
            handleError(
              13
              /* ParseErrorCode.UnexpectedEndOfNumber */
            );
            break;
          case 1:
            if (!disallowComments) {
              handleError(
                11
                /* ParseErrorCode.UnexpectedEndOfComment */
              );
            }
            break;
          case 2:
            handleError(
              12
              /* ParseErrorCode.UnexpectedEndOfString */
            );
            break;
          case 6:
            handleError(
              16
              /* ParseErrorCode.InvalidCharacter */
            );
            break;
        }
        switch (token) {
          case 12:
          case 13:
            if (disallowComments) {
              handleError(
                10
                /* ParseErrorCode.InvalidCommentToken */
              );
            } else {
              onComment();
            }
            break;
          case 16:
            handleError(
              1
              /* ParseErrorCode.InvalidSymbol */
            );
            break;
          case 15:
          case 14:
            break;
          default:
            return token;
        }
      }
    }
    function handleError(error, skipUntilAfter = [], skipUntil = []) {
      onError(error);
      if (skipUntilAfter.length + skipUntil.length > 0) {
        let token = _scanner.getToken();
        while (token !== 17) {
          if (skipUntilAfter.indexOf(token) !== -1) {
            scanNext();
            break;
          } else if (skipUntil.indexOf(token) !== -1) {
            break;
          }
          token = scanNext();
        }
      }
    }
    function parseString(isValue) {
      const value = _scanner.getTokenValue();
      if (isValue) {
        onLiteralValue(value);
      } else {
        onObjectProperty(value);
        _jsonPath.push(value);
      }
      scanNext();
      return true;
    }
    function parseLiteral() {
      switch (_scanner.getToken()) {
        case 11:
          const tokenValue = _scanner.getTokenValue();
          let value = Number(tokenValue);
          if (isNaN(value)) {
            handleError(
              2
              /* ParseErrorCode.InvalidNumberFormat */
            );
            value = 0;
          }
          onLiteralValue(value);
          break;
        case 7:
          onLiteralValue(null);
          break;
        case 8:
          onLiteralValue(true);
          break;
        case 9:
          onLiteralValue(false);
          break;
        default:
          return false;
      }
      scanNext();
      return true;
    }
    function parseProperty() {
      if (_scanner.getToken() !== 10) {
        handleError(3, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
        return false;
      }
      parseString(false);
      if (_scanner.getToken() === 6) {
        onSeparator(":");
        scanNext();
        if (!parseValue()) {
          handleError(4, [], [
            2,
            5
            /* SyntaxKind.CommaToken */
          ]);
        }
      } else {
        handleError(5, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      _jsonPath.pop();
      return true;
    }
    function parseObject() {
      onObjectBegin();
      scanNext();
      let needsComma = false;
      while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
        if (_scanner.getToken() === 5) {
          if (!needsComma) {
            handleError(4, [], []);
          }
          onSeparator(",");
          scanNext();
          if (_scanner.getToken() === 2 && allowTrailingComma) {
            break;
          }
        } else if (needsComma) {
          handleError(6, [], []);
        }
        if (!parseProperty()) {
          handleError(4, [], [
            2,
            5
            /* SyntaxKind.CommaToken */
          ]);
        }
        needsComma = true;
      }
      onObjectEnd();
      if (_scanner.getToken() !== 2) {
        handleError(7, [
          2
          /* SyntaxKind.CloseBraceToken */
        ], []);
      } else {
        scanNext();
      }
      return true;
    }
    function parseArray() {
      onArrayBegin();
      scanNext();
      let isFirstElement = true;
      let needsComma = false;
      while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
        if (_scanner.getToken() === 5) {
          if (!needsComma) {
            handleError(4, [], []);
          }
          onSeparator(",");
          scanNext();
          if (_scanner.getToken() === 4 && allowTrailingComma) {
            break;
          }
        } else if (needsComma) {
          handleError(6, [], []);
        }
        if (isFirstElement) {
          _jsonPath.push(0);
          isFirstElement = false;
        } else {
          _jsonPath[_jsonPath.length - 1]++;
        }
        if (!parseValue()) {
          handleError(4, [], [
            4,
            5
            /* SyntaxKind.CommaToken */
          ]);
        }
        needsComma = true;
      }
      onArrayEnd();
      if (!isFirstElement) {
        _jsonPath.pop();
      }
      if (_scanner.getToken() !== 4) {
        handleError(8, [
          4
          /* SyntaxKind.CloseBracketToken */
        ], []);
      } else {
        scanNext();
      }
      return true;
    }
    function parseValue() {
      switch (_scanner.getToken()) {
        case 3:
          return parseArray();
        case 1:
          return parseObject();
        case 10:
          return parseString(true);
        default:
          return parseLiteral();
      }
    }
    scanNext();
    if (_scanner.getToken() === 17) {
      if (options.allowEmptyContent) {
        return true;
      }
      handleError(4, [], []);
      return false;
    }
    if (!parseValue()) {
      handleError(4, [], []);
      return false;
    }
    if (_scanner.getToken() !== 17) {
      handleError(9, [], []);
    }
    return true;
  }
  function stripComments(text, replaceCh) {
    let _scanner = createScanner(text), parts = [], kind, offset = 0, pos;
    do {
      pos = _scanner.getPosition();
      kind = _scanner.scan();
      switch (kind) {
        case 12:
        case 13:
        case 17:
          if (offset !== pos) {
            parts.push(text.substring(offset, pos));
          }
          if (replaceCh !== void 0) {
            parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
          }
          offset = _scanner.getPosition();
          break;
      }
    } while (kind !== 17);
    return parts.join("");
  }
  function getNodeType(value) {
    switch (typeof value) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
      case "object": {
        if (!value) {
          return "null";
        } else if (Array.isArray(value)) {
          return "array";
        }
        return "object";
      }
      default:
        return "null";
    }
  }
  var ParseOptions;
  var init_parser = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/impl/parser.js"() {
      "use strict";
      init_scanner();
      (function(ParseOptions2) {
        ParseOptions2.DEFAULT = {
          allowTrailingComma: false
        };
      })(ParseOptions || (ParseOptions = {}));
    }
  });

  // browser-config/node_modules/jsonc-parser/lib/esm/impl/edit.js
  function setProperty(text, originalPath, value, options) {
    const path = originalPath.slice();
    const errors = [];
    const root = parseTree(text, errors);
    let parent = void 0;
    let lastSegment = void 0;
    while (path.length > 0) {
      lastSegment = path.pop();
      parent = findNodeAtLocation(root, path);
      if (parent === void 0 && value !== void 0) {
        if (typeof lastSegment === "string") {
          value = { [lastSegment]: value };
        } else {
          value = [value];
        }
      } else {
        break;
      }
    }
    if (!parent) {
      if (value === void 0) {
        throw new Error("Can not delete in empty document");
      }
      return withFormatting(text, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value) }, options);
    } else if (parent.type === "object" && typeof lastSegment === "string" && Array.isArray(parent.children)) {
      const existing = findNodeAtLocation(parent, [lastSegment]);
      if (existing !== void 0) {
        if (value === void 0) {
          if (!existing.parent) {
            throw new Error("Malformed AST");
          }
          const propertyIndex = parent.children.indexOf(existing.parent);
          let removeBegin;
          let removeEnd = existing.parent.offset + existing.parent.length;
          if (propertyIndex > 0) {
            let previous = parent.children[propertyIndex - 1];
            removeBegin = previous.offset + previous.length;
          } else {
            removeBegin = parent.offset + 1;
            if (parent.children.length > 1) {
              let next = parent.children[1];
              removeEnd = next.offset;
            }
          }
          return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: "" }, options);
        } else {
          return withFormatting(text, { offset: existing.offset, length: existing.length, content: JSON.stringify(value) }, options);
        }
      } else {
        if (value === void 0) {
          return [];
        }
        const newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value)}`;
        const index = options.getInsertionIndex ? options.getInsertionIndex(parent.children.map((p) => p.children[0].value)) : parent.children.length;
        let edit;
        if (index > 0) {
          let previous = parent.children[index - 1];
          edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
        } else if (parent.children.length === 0) {
          edit = { offset: parent.offset + 1, length: 0, content: newProperty };
        } else {
          edit = { offset: parent.offset + 1, length: 0, content: newProperty + "," };
        }
        return withFormatting(text, edit, options);
      }
    } else if (parent.type === "array" && typeof lastSegment === "number" && Array.isArray(parent.children)) {
      const insertIndex = lastSegment;
      if (insertIndex === -1) {
        const newProperty = `${JSON.stringify(value)}`;
        let edit;
        if (parent.children.length === 0) {
          edit = { offset: parent.offset + 1, length: 0, content: newProperty };
        } else {
          const previous = parent.children[parent.children.length - 1];
          edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
        }
        return withFormatting(text, edit, options);
      } else if (value === void 0 && parent.children.length >= 0) {
        const removalIndex = lastSegment;
        const toRemove = parent.children[removalIndex];
        let edit;
        if (parent.children.length === 1) {
          edit = { offset: parent.offset + 1, length: parent.length - 2, content: "" };
        } else if (parent.children.length - 1 === removalIndex) {
          let previous = parent.children[removalIndex - 1];
          let offset = previous.offset + previous.length;
          let parentEndOffset = parent.offset + parent.length;
          edit = { offset, length: parentEndOffset - 2 - offset, content: "" };
        } else {
          edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: "" };
        }
        return withFormatting(text, edit, options);
      } else if (value !== void 0) {
        let edit;
        const newProperty = `${JSON.stringify(value)}`;
        if (!options.isArrayInsertion && parent.children.length > lastSegment) {
          const toModify = parent.children[lastSegment];
          edit = { offset: toModify.offset, length: toModify.length, content: newProperty };
        } else if (parent.children.length === 0 || lastSegment === 0) {
          edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + "," };
        } else {
          const index = lastSegment > parent.children.length ? parent.children.length : lastSegment;
          const previous = parent.children[index - 1];
          edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
        }
        return withFormatting(text, edit, options);
      } else {
        throw new Error(`Can not ${value === void 0 ? "remove" : options.isArrayInsertion ? "insert" : "modify"} Array index ${insertIndex} as length is not sufficient`);
      }
    } else {
      throw new Error(`Can not add ${typeof lastSegment !== "number" ? "index" : "property"} to parent of type ${parent.type}`);
    }
  }
  function withFormatting(text, edit, options) {
    if (!options.formattingOptions) {
      return [edit];
    }
    let newText = applyEdit(text, edit);
    let begin = edit.offset;
    let end = edit.offset + edit.content.length;
    if (edit.length === 0 || edit.content.length === 0) {
      while (begin > 0 && !isEOL(newText, begin - 1)) {
        begin--;
      }
      while (end < newText.length && !isEOL(newText, end)) {
        end++;
      }
    }
    const edits = format(newText, { offset: begin, length: end - begin }, { ...options.formattingOptions, keepLines: false });
    for (let i = edits.length - 1; i >= 0; i--) {
      const edit2 = edits[i];
      newText = applyEdit(newText, edit2);
      begin = Math.min(begin, edit2.offset);
      end = Math.max(end, edit2.offset + edit2.length);
      end += edit2.content.length - edit2.length;
    }
    const editLength = text.length - (newText.length - end) - begin;
    return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
  }
  function applyEdit(text, edit) {
    return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
  }
  var init_edit = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/impl/edit.js"() {
      "use strict";
      init_format();
      init_parser();
    }
  });

  // browser-config/node_modules/jsonc-parser/lib/esm/main.js
  var main_exports = {};
  __export(main_exports, {
    ParseErrorCode: () => ParseErrorCode,
    ScanError: () => ScanError,
    SyntaxKind: () => SyntaxKind,
    applyEdits: () => applyEdits,
    createScanner: () => createScanner2,
    findNodeAtLocation: () => findNodeAtLocation2,
    findNodeAtOffset: () => findNodeAtOffset2,
    format: () => format2,
    getLocation: () => getLocation2,
    getNodePath: () => getNodePath2,
    getNodeValue: () => getNodeValue2,
    modify: () => modify,
    parse: () => parse2,
    parseTree: () => parseTree2,
    printParseErrorCode: () => printParseErrorCode,
    stripComments: () => stripComments2,
    visit: () => visit2
  });
  function printParseErrorCode(code) {
    switch (code) {
      case 1:
        return "InvalidSymbol";
      case 2:
        return "InvalidNumberFormat";
      case 3:
        return "PropertyNameExpected";
      case 4:
        return "ValueExpected";
      case 5:
        return "ColonExpected";
      case 6:
        return "CommaExpected";
      case 7:
        return "CloseBraceExpected";
      case 8:
        return "CloseBracketExpected";
      case 9:
        return "EndOfFileExpected";
      case 10:
        return "InvalidCommentToken";
      case 11:
        return "UnexpectedEndOfComment";
      case 12:
        return "UnexpectedEndOfString";
      case 13:
        return "UnexpectedEndOfNumber";
      case 14:
        return "InvalidUnicode";
      case 15:
        return "InvalidEscapeCharacter";
      case 16:
        return "InvalidCharacter";
    }
    return "<unknown ParseErrorCode>";
  }
  function format2(documentText, range, options) {
    return format(documentText, range, options);
  }
  function modify(text, path, value, options) {
    return setProperty(text, path, value, options);
  }
  function applyEdits(text, edits) {
    let sortedEdits = edits.slice(0).sort((a, b) => {
      const diff = a.offset - b.offset;
      if (diff === 0) {
        return a.length - b.length;
      }
      return diff;
    });
    let lastModifiedOffset = text.length;
    for (let i = sortedEdits.length - 1; i >= 0; i--) {
      let e = sortedEdits[i];
      if (e.offset + e.length <= lastModifiedOffset) {
        text = applyEdit(text, e);
      } else {
        throw new Error("Overlapping edit");
      }
      lastModifiedOffset = e.offset;
    }
    return text;
  }
  var createScanner2, ScanError, SyntaxKind, getLocation2, parse2, parseTree2, findNodeAtLocation2, findNodeAtOffset2, getNodePath2, getNodeValue2, visit2, stripComments2, ParseErrorCode;
  var init_main = __esm({
    "browser-config/node_modules/jsonc-parser/lib/esm/main.js"() {
      "use strict";
      init_format();
      init_edit();
      init_scanner();
      init_parser();
      createScanner2 = createScanner;
      (function(ScanError2) {
        ScanError2[ScanError2["None"] = 0] = "None";
        ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
        ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
        ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
        ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
        ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
        ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
      })(ScanError || (ScanError = {}));
      (function(SyntaxKind2) {
        SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
        SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
        SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
        SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
        SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
        SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
        SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
        SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
        SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
        SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
        SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
        SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
        SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
        SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
        SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
        SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
        SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
      })(SyntaxKind || (SyntaxKind = {}));
      getLocation2 = getLocation;
      parse2 = parse;
      parseTree2 = parseTree;
      findNodeAtLocation2 = findNodeAtLocation;
      findNodeAtOffset2 = findNodeAtOffset;
      getNodePath2 = getNodePath;
      getNodeValue2 = getNodeValue;
      visit2 = visit;
      stripComments2 = stripComments;
      (function(ParseErrorCode2) {
        ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
        ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
        ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
        ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
        ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
        ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
        ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
        ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
        ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
        ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
        ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
        ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
        ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
        ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
        ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
        ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
      })(ParseErrorCode || (ParseErrorCode = {}));
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/parser.js
  var require_parser = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/parser.js"(exports2, module2) {
      "use strict";
      var ParserEND = 1114112;
      var ParserError = class _ParserError extends Error {
        /* istanbul ignore next */
        constructor(msg, filename, linenumber) {
          super("[ParserError] " + msg, filename, linenumber);
          this.name = "ParserError";
          this.code = "ParserError";
          if (Error.captureStackTrace) Error.captureStackTrace(this, _ParserError);
        }
      };
      var State = class {
        constructor(parser) {
          this.parser = parser;
          this.buf = "";
          this.returned = null;
          this.result = null;
          this.resultTable = null;
          this.resultArr = null;
        }
      };
      var Parser2 = class {
        constructor() {
          this.pos = 0;
          this.col = 0;
          this.line = 0;
          this.obj = {};
          this.ctx = this.obj;
          this.stack = [];
          this._buf = "";
          this.char = null;
          this.ii = 0;
          this.state = new State(this.parseStart);
        }
        parse(str) {
          if (str.length === 0 || str.length == null) return;
          this._buf = String(str);
          this.ii = -1;
          this.char = -1;
          let getNext;
          while (getNext === false || this.nextChar()) {
            getNext = this.runOne();
          }
          this._buf = null;
        }
        nextChar() {
          if (this.char === 10) {
            ++this.line;
            this.col = -1;
          }
          ++this.ii;
          this.char = this._buf.codePointAt(this.ii);
          ++this.pos;
          ++this.col;
          return this.haveBuffer();
        }
        haveBuffer() {
          return this.ii < this._buf.length;
        }
        runOne() {
          return this.state.parser.call(this, this.state.returned);
        }
        finish() {
          this.char = ParserEND;
          let last;
          do {
            last = this.state.parser;
            this.runOne();
          } while (this.state.parser !== last);
          this.ctx = null;
          this.state = null;
          this._buf = null;
          return this.obj;
        }
        next(fn) {
          if (typeof fn !== "function") throw new ParserError("Tried to set state to non-existent state: " + JSON.stringify(fn));
          this.state.parser = fn;
        }
        goto(fn) {
          this.next(fn);
          return this.runOne();
        }
        call(fn, returnWith) {
          if (returnWith) this.next(returnWith);
          this.stack.push(this.state);
          this.state = new State(fn);
        }
        callNow(fn, returnWith) {
          this.call(fn, returnWith);
          return this.runOne();
        }
        return(value) {
          if (this.stack.length === 0) throw this.error(new ParserError("Stack underflow"));
          if (value === void 0) value = this.state.buf;
          this.state = this.stack.pop();
          this.state.returned = value;
        }
        returnNow(value) {
          this.return(value);
          return this.runOne();
        }
        consume() {
          if (this.char === ParserEND) throw this.error(new ParserError("Unexpected end-of-buffer"));
          this.state.buf += this._buf[this.ii];
        }
        error(err) {
          err.line = this.line;
          err.col = this.col;
          err.pos = this.pos;
          return err;
        }
        /* istanbul ignore next */
        parseStart() {
          throw new ParserError("Must declare a parseStart method");
        }
      };
      Parser2.END = ParserEND;
      Parser2.Error = ParserError;
      module2.exports = Parser2;
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/create-datetime.js
  var require_create_datetime = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/create-datetime.js"(exports2, module2) {
      "use strict";
      module2.exports = (value) => {
        const date = new Date(value);
        if (isNaN(date)) {
          throw new TypeError("Invalid Datetime");
        } else {
          return date;
        }
      };
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/format-num.js
  var require_format_num = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/format-num.js"(exports2, module2) {
      "use strict";
      module2.exports = (d, num) => {
        num = String(num);
        while (num.length < d) num = "0" + num;
        return num;
      };
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/create-datetime-float.js
  var require_create_datetime_float = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/create-datetime-float.js"(exports2, module2) {
      "use strict";
      var f = require_format_num();
      var FloatingDateTime = class extends Date {
        constructor(value) {
          super(value + "Z");
          this.isFloating = true;
        }
        toISOString() {
          const date = `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
          const time = `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
          return `${date}T${time}`;
        }
      };
      module2.exports = (value) => {
        const date = new FloatingDateTime(value);
        if (isNaN(date)) {
          throw new TypeError("Invalid Datetime");
        } else {
          return date;
        }
      };
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/create-date.js
  var require_create_date = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/create-date.js"(exports2, module2) {
      "use strict";
      var f = require_format_num();
      var DateTime = globalThis.Date;
      var Date2 = class extends DateTime {
        constructor(value) {
          super(value);
          this.isDate = true;
        }
        toISOString() {
          return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
        }
      };
      module2.exports = (value) => {
        const date = new Date2(value);
        if (isNaN(date)) {
          throw new TypeError("Invalid Datetime");
        } else {
          return date;
        }
      };
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/create-time.js
  var require_create_time = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/create-time.js"(exports2, module2) {
      "use strict";
      var f = require_format_num();
      var Time = class extends Date {
        constructor(value) {
          super(`0000-01-01T${value}Z`);
          this.isTime = true;
        }
        toISOString() {
          return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
        }
      };
      module2.exports = (value) => {
        const date = new Time(value);
        if (isNaN(date)) {
          throw new TypeError("Invalid Datetime");
        } else {
          return date;
        }
      };
    }
  });

  // browser-config/node_modules/@iarna/toml/lib/toml-parser.js
  var require_toml_parser = __commonJS({
    "browser-config/node_modules/@iarna/toml/lib/toml-parser.js"(exports, module) {
      "use strict";
      module.exports = makeParserClass(require_parser());
      module.exports.makeParserClass = makeParserClass;
      var TomlError = class _TomlError extends Error {
        constructor(msg) {
          super(msg);
          this.name = "TomlError";
          if (Error.captureStackTrace) Error.captureStackTrace(this, _TomlError);
          this.fromTOML = true;
          this.wrapped = null;
        }
      };
      TomlError.wrap = (err) => {
        const terr = new TomlError(err.message);
        terr.code = err.code;
        terr.wrapped = err;
        return terr;
      };
      module.exports.TomlError = TomlError;
      var createDateTime = require_create_datetime();
      var createDateTimeFloat = require_create_datetime_float();
      var createDate = require_create_date();
      var createTime = require_create_time();
      var CTRL_I = 9;
      var CTRL_J = 10;
      var CTRL_M = 13;
      var CTRL_CHAR_BOUNDARY = 31;
      var CHAR_SP = 32;
      var CHAR_QUOT = 34;
      var CHAR_NUM = 35;
      var CHAR_APOS = 39;
      var CHAR_PLUS = 43;
      var CHAR_COMMA = 44;
      var CHAR_HYPHEN = 45;
      var CHAR_PERIOD = 46;
      var CHAR_0 = 48;
      var CHAR_1 = 49;
      var CHAR_7 = 55;
      var CHAR_9 = 57;
      var CHAR_COLON = 58;
      var CHAR_EQUALS = 61;
      var CHAR_A = 65;
      var CHAR_E = 69;
      var CHAR_F = 70;
      var CHAR_T = 84;
      var CHAR_U = 85;
      var CHAR_Z = 90;
      var CHAR_LOWBAR = 95;
      var CHAR_a = 97;
      var CHAR_b = 98;
      var CHAR_e = 101;
      var CHAR_f = 102;
      var CHAR_i = 105;
      var CHAR_l = 108;
      var CHAR_n = 110;
      var CHAR_o = 111;
      var CHAR_r = 114;
      var CHAR_s = 115;
      var CHAR_t = 116;
      var CHAR_u = 117;
      var CHAR_x = 120;
      var CHAR_z = 122;
      var CHAR_LCUB = 123;
      var CHAR_RCUB = 125;
      var CHAR_LSQB = 91;
      var CHAR_BSOL = 92;
      var CHAR_RSQB = 93;
      var CHAR_DEL = 127;
      var SURROGATE_FIRST = 55296;
      var SURROGATE_LAST = 57343;
      var escapes = {
        [CHAR_b]: "\b",
        [CHAR_t]: "	",
        [CHAR_n]: "\n",
        [CHAR_f]: "\f",
        [CHAR_r]: "\r",
        [CHAR_QUOT]: '"',
        [CHAR_BSOL]: "\\"
      };
      function isDigit(cp) {
        return cp >= CHAR_0 && cp <= CHAR_9;
      }
      function isHexit(cp) {
        return cp >= CHAR_A && cp <= CHAR_F || cp >= CHAR_a && cp <= CHAR_f || cp >= CHAR_0 && cp <= CHAR_9;
      }
      function isBit(cp) {
        return cp === CHAR_1 || cp === CHAR_0;
      }
      function isOctit(cp) {
        return cp >= CHAR_0 && cp <= CHAR_7;
      }
      function isAlphaNumQuoteHyphen(cp) {
        return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_APOS || cp === CHAR_QUOT || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
      }
      function isAlphaNumHyphen(cp) {
        return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
      }
      var _type = Symbol("type");
      var _declared = Symbol("declared");
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var defineProperty = Object.defineProperty;
      var descriptor = { configurable: true, enumerable: true, writable: true, value: void 0 };
      function hasKey(obj, key) {
        if (hasOwnProperty.call(obj, key)) return true;
        if (key === "__proto__") defineProperty(obj, "__proto__", descriptor);
        return false;
      }
      var INLINE_TABLE = Symbol("inline-table");
      function InlineTable() {
        return Object.defineProperties({}, {
          [_type]: { value: INLINE_TABLE }
        });
      }
      function isInlineTable(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === INLINE_TABLE;
      }
      var TABLE = Symbol("table");
      function Table() {
        return Object.defineProperties({}, {
          [_type]: { value: TABLE },
          [_declared]: { value: false, writable: true }
        });
      }
      function isTable(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === TABLE;
      }
      var _contentType = Symbol("content-type");
      var INLINE_LIST = Symbol("inline-list");
      function InlineList(type) {
        return Object.defineProperties([], {
          [_type]: { value: INLINE_LIST },
          [_contentType]: { value: type }
        });
      }
      function isInlineList(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === INLINE_LIST;
      }
      var LIST = Symbol("list");
      function List() {
        return Object.defineProperties([], {
          [_type]: { value: LIST }
        });
      }
      function isList(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === LIST;
      }
      var _custom;
      try {
        const utilInspect = eval("require('util').inspect");
        _custom = utilInspect.custom;
      } catch (_) {
      }
      var _inspect = _custom || "inspect";
      var BoxedBigInt = class {
        constructor(value) {
          try {
            this.value = globalThis.BigInt.asIntN(64, value);
          } catch (_) {
            this.value = null;
          }
          Object.defineProperty(this, _type, { value: INTEGER });
        }
        isNaN() {
          return this.value === null;
        }
        /* istanbul ignore next */
        toString() {
          return String(this.value);
        }
        /* istanbul ignore next */
        [_inspect]() {
          return `[BigInt: ${this.toString()}]}`;
        }
        valueOf() {
          return this.value;
        }
      };
      var INTEGER = Symbol("integer");
      function Integer(value) {
        let num = Number(value);
        if (Object.is(num, -0)) num = 0;
        if (globalThis.BigInt && !Number.isSafeInteger(num)) {
          return new BoxedBigInt(value);
        } else {
          return Object.defineProperties(new Number(num), {
            isNaN: { value: function() {
              return isNaN(this);
            } },
            [_type]: { value: INTEGER },
            [_inspect]: { value: () => `[Integer: ${value}]` }
          });
        }
      }
      function isInteger(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === INTEGER;
      }
      var FLOAT = Symbol("float");
      function Float(value) {
        return Object.defineProperties(new Number(value), {
          [_type]: { value: FLOAT },
          [_inspect]: { value: () => `[Float: ${value}]` }
        });
      }
      function isFloat(obj) {
        if (obj === null || typeof obj !== "object") return false;
        return obj[_type] === FLOAT;
      }
      function tomlType(value) {
        const type = typeof value;
        if (type === "object") {
          if (value === null) return "null";
          if (value instanceof Date) return "datetime";
          if (_type in value) {
            switch (value[_type]) {
              case INLINE_TABLE:
                return "inline-table";
              case INLINE_LIST:
                return "inline-list";
              /* istanbul ignore next */
              case TABLE:
                return "table";
              /* istanbul ignore next */
              case LIST:
                return "list";
              case FLOAT:
                return "float";
              case INTEGER:
                return "integer";
            }
          }
        }
        return type;
      }
      function makeParserClass(Parser2) {
        class TOMLParser extends Parser2 {
          constructor() {
            super();
            this.ctx = this.obj = Table();
          }
          /* MATCH HELPER */
          atEndOfWord() {
            return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine();
          }
          atEndOfLine() {
            return this.char === Parser2.END || this.char === CTRL_J || this.char === CTRL_M;
          }
          parseStart() {
            if (this.char === Parser2.END) {
              return null;
            } else if (this.char === CHAR_LSQB) {
              return this.call(this.parseTableOrList);
            } else if (this.char === CHAR_NUM) {
              return this.call(this.parseComment);
            } else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
              return null;
            } else if (isAlphaNumQuoteHyphen(this.char)) {
              return this.callNow(this.parseAssignStatement);
            } else {
              throw this.error(new TomlError(`Unknown character "${this.char}"`));
            }
          }
          // HELPER, this strips any whitespace and comments to the end of the line
          // then RETURNS. Last state in a production.
          parseWhitespaceToEOL() {
            if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
              return null;
            } else if (this.char === CHAR_NUM) {
              return this.goto(this.parseComment);
            } else if (this.char === Parser2.END || this.char === CTRL_J) {
              return this.return();
            } else {
              throw this.error(new TomlError("Unexpected character, expected only whitespace or comments till end of line"));
            }
          }
          /* ASSIGNMENT: key = value */
          parseAssignStatement() {
            return this.callNow(this.parseAssign, this.recordAssignStatement);
          }
          recordAssignStatement(kv) {
            let target = this.ctx;
            let finalKey = kv.key.pop();
            for (let kw of kv.key) {
              if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
                throw this.error(new TomlError("Can't redefine existing key"));
              }
              target = target[kw] = target[kw] || Table();
            }
            if (hasKey(target, finalKey)) {
              throw this.error(new TomlError("Can't redefine existing key"));
            }
            if (isInteger(kv.value) || isFloat(kv.value)) {
              target[finalKey] = kv.value.valueOf();
            } else {
              target[finalKey] = kv.value;
            }
            return this.goto(this.parseWhitespaceToEOL);
          }
          /* ASSSIGNMENT expression, key = value possibly inside an inline table */
          parseAssign() {
            return this.callNow(this.parseKeyword, this.recordAssignKeyword);
          }
          recordAssignKeyword(key) {
            if (this.state.resultTable) {
              this.state.resultTable.push(key);
            } else {
              this.state.resultTable = [key];
            }
            return this.goto(this.parseAssignKeywordPreDot);
          }
          parseAssignKeywordPreDot() {
            if (this.char === CHAR_PERIOD) {
              return this.next(this.parseAssignKeywordPostDot);
            } else if (this.char !== CHAR_SP && this.char !== CTRL_I) {
              return this.goto(this.parseAssignEqual);
            }
          }
          parseAssignKeywordPostDot() {
            if (this.char !== CHAR_SP && this.char !== CTRL_I) {
              return this.callNow(this.parseKeyword, this.recordAssignKeyword);
            }
          }
          parseAssignEqual() {
            if (this.char === CHAR_EQUALS) {
              return this.next(this.parseAssignPreValue);
            } else {
              throw this.error(new TomlError('Invalid character, expected "="'));
            }
          }
          parseAssignPreValue() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else {
              return this.callNow(this.parseValue, this.recordAssignValue);
            }
          }
          recordAssignValue(value) {
            return this.returnNow({ key: this.state.resultTable, value });
          }
          /* COMMENTS: #...eol */
          parseComment() {
            do {
              if (this.char === Parser2.END || this.char === CTRL_J) {
                return this.return();
              }
            } while (this.nextChar());
          }
          /* TABLES AND LISTS, [foo] and [[foo]] */
          parseTableOrList() {
            if (this.char === CHAR_LSQB) {
              this.next(this.parseList);
            } else {
              return this.goto(this.parseTable);
            }
          }
          /* TABLE [foo.bar.baz] */
          parseTable() {
            this.ctx = this.obj;
            return this.goto(this.parseTableNext);
          }
          parseTableNext() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else {
              return this.callNow(this.parseKeyword, this.parseTableMore);
            }
          }
          parseTableMore(keyword) {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else if (this.char === CHAR_RSQB) {
              if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) {
                throw this.error(new TomlError("Can't redefine existing key"));
              } else {
                this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table();
                this.ctx[_declared] = true;
              }
              return this.next(this.parseWhitespaceToEOL);
            } else if (this.char === CHAR_PERIOD) {
              if (!hasKey(this.ctx, keyword)) {
                this.ctx = this.ctx[keyword] = Table();
              } else if (isTable(this.ctx[keyword])) {
                this.ctx = this.ctx[keyword];
              } else if (isList(this.ctx[keyword])) {
                this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
              } else {
                throw this.error(new TomlError("Can't redefine existing key"));
              }
              return this.next(this.parseTableNext);
            } else {
              throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
            }
          }
          /* LIST [[a.b.c]] */
          parseList() {
            this.ctx = this.obj;
            return this.goto(this.parseListNext);
          }
          parseListNext() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else {
              return this.callNow(this.parseKeyword, this.parseListMore);
            }
          }
          parseListMore(keyword) {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else if (this.char === CHAR_RSQB) {
              if (!hasKey(this.ctx, keyword)) {
                this.ctx[keyword] = List();
              }
              if (isInlineList(this.ctx[keyword])) {
                throw this.error(new TomlError("Can't extend an inline array"));
              } else if (isList(this.ctx[keyword])) {
                const next = Table();
                this.ctx[keyword].push(next);
                this.ctx = next;
              } else {
                throw this.error(new TomlError("Can't redefine an existing key"));
              }
              return this.next(this.parseListEnd);
            } else if (this.char === CHAR_PERIOD) {
              if (!hasKey(this.ctx, keyword)) {
                this.ctx = this.ctx[keyword] = Table();
              } else if (isInlineList(this.ctx[keyword])) {
                throw this.error(new TomlError("Can't extend an inline array"));
              } else if (isInlineTable(this.ctx[keyword])) {
                throw this.error(new TomlError("Can't extend an inline table"));
              } else if (isList(this.ctx[keyword])) {
                this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
              } else if (isTable(this.ctx[keyword])) {
                this.ctx = this.ctx[keyword];
              } else {
                throw this.error(new TomlError("Can't redefine an existing key"));
              }
              return this.next(this.parseListNext);
            } else {
              throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
            }
          }
          parseListEnd(keyword) {
            if (this.char === CHAR_RSQB) {
              return this.next(this.parseWhitespaceToEOL);
            } else {
              throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
            }
          }
          /* VALUE string, number, boolean, inline list, inline object */
          parseValue() {
            if (this.char === Parser2.END) {
              throw this.error(new TomlError("Key without value"));
            } else if (this.char === CHAR_QUOT) {
              return this.next(this.parseDoubleString);
            }
            if (this.char === CHAR_APOS) {
              return this.next(this.parseSingleString);
            } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
              return this.goto(this.parseNumberSign);
            } else if (this.char === CHAR_i) {
              return this.next(this.parseInf);
            } else if (this.char === CHAR_n) {
              return this.next(this.parseNan);
            } else if (isDigit(this.char)) {
              return this.goto(this.parseNumberOrDateTime);
            } else if (this.char === CHAR_t || this.char === CHAR_f) {
              return this.goto(this.parseBoolean);
            } else if (this.char === CHAR_LSQB) {
              return this.call(this.parseInlineList, this.recordValue);
            } else if (this.char === CHAR_LCUB) {
              return this.call(this.parseInlineTable, this.recordValue);
            } else {
              throw this.error(new TomlError("Unexpected character, expecting string, number, datetime, boolean, inline array or inline table"));
            }
          }
          recordValue(value) {
            return this.returnNow(value);
          }
          parseInf() {
            if (this.char === CHAR_n) {
              return this.next(this.parseInf2);
            } else {
              throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
            }
          }
          parseInf2() {
            if (this.char === CHAR_f) {
              if (this.state.buf === "-") {
                return this.return(-Infinity);
              } else {
                return this.return(Infinity);
              }
            } else {
              throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
            }
          }
          parseNan() {
            if (this.char === CHAR_a) {
              return this.next(this.parseNan2);
            } else {
              throw this.error(new TomlError('Unexpected character, expected "nan"'));
            }
          }
          parseNan2() {
            if (this.char === CHAR_n) {
              return this.return(NaN);
            } else {
              throw this.error(new TomlError('Unexpected character, expected "nan"'));
            }
          }
          /* KEYS, barewords or basic, literal, or dotted */
          parseKeyword() {
            if (this.char === CHAR_QUOT) {
              return this.next(this.parseBasicString);
            } else if (this.char === CHAR_APOS) {
              return this.next(this.parseLiteralString);
            } else {
              return this.goto(this.parseBareKey);
            }
          }
          /* KEYS: barewords */
          parseBareKey() {
            do {
              if (this.char === Parser2.END) {
                throw this.error(new TomlError("Key ended without value"));
              } else if (isAlphaNumHyphen(this.char)) {
                this.consume();
              } else if (this.state.buf.length === 0) {
                throw this.error(new TomlError("Empty bare keys are not allowed"));
              } else {
                return this.returnNow();
              }
            } while (this.nextChar());
          }
          /* STRINGS, single quoted (literal) */
          parseSingleString() {
            if (this.char === CHAR_APOS) {
              return this.next(this.parseLiteralMultiStringMaybe);
            } else {
              return this.goto(this.parseLiteralString);
            }
          }
          parseLiteralString() {
            do {
              if (this.char === CHAR_APOS) {
                return this.return();
              } else if (this.atEndOfLine()) {
                throw this.error(new TomlError("Unterminated string"));
              } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
                throw this.errorControlCharInString();
              } else {
                this.consume();
              }
            } while (this.nextChar());
          }
          parseLiteralMultiStringMaybe() {
            if (this.char === CHAR_APOS) {
              return this.next(this.parseLiteralMultiString);
            } else {
              return this.returnNow();
            }
          }
          parseLiteralMultiString() {
            if (this.char === CTRL_M) {
              return null;
            } else if (this.char === CTRL_J) {
              return this.next(this.parseLiteralMultiStringContent);
            } else {
              return this.goto(this.parseLiteralMultiStringContent);
            }
          }
          parseLiteralMultiStringContent() {
            do {
              if (this.char === CHAR_APOS) {
                return this.next(this.parseLiteralMultiEnd);
              } else if (this.char === Parser2.END) {
                throw this.error(new TomlError("Unterminated multi-line string"));
              } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
                throw this.errorControlCharInString();
              } else {
                this.consume();
              }
            } while (this.nextChar());
          }
          parseLiteralMultiEnd() {
            if (this.char === CHAR_APOS) {
              return this.next(this.parseLiteralMultiEnd2);
            } else {
              this.state.buf += "'";
              return this.goto(this.parseLiteralMultiStringContent);
            }
          }
          parseLiteralMultiEnd2() {
            if (this.char === CHAR_APOS) {
              return this.return();
            } else {
              this.state.buf += "''";
              return this.goto(this.parseLiteralMultiStringContent);
            }
          }
          /* STRINGS double quoted */
          parseDoubleString() {
            if (this.char === CHAR_QUOT) {
              return this.next(this.parseMultiStringMaybe);
            } else {
              return this.goto(this.parseBasicString);
            }
          }
          parseBasicString() {
            do {
              if (this.char === CHAR_BSOL) {
                return this.call(this.parseEscape, this.recordEscapeReplacement);
              } else if (this.char === CHAR_QUOT) {
                return this.return();
              } else if (this.atEndOfLine()) {
                throw this.error(new TomlError("Unterminated string"));
              } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
                throw this.errorControlCharInString();
              } else {
                this.consume();
              }
            } while (this.nextChar());
          }
          recordEscapeReplacement(replacement) {
            this.state.buf += replacement;
            return this.goto(this.parseBasicString);
          }
          parseMultiStringMaybe() {
            if (this.char === CHAR_QUOT) {
              return this.next(this.parseMultiString);
            } else {
              return this.returnNow();
            }
          }
          parseMultiString() {
            if (this.char === CTRL_M) {
              return null;
            } else if (this.char === CTRL_J) {
              return this.next(this.parseMultiStringContent);
            } else {
              return this.goto(this.parseMultiStringContent);
            }
          }
          parseMultiStringContent() {
            do {
              if (this.char === CHAR_BSOL) {
                return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement);
              } else if (this.char === CHAR_QUOT) {
                return this.next(this.parseMultiEnd);
              } else if (this.char === Parser2.END) {
                throw this.error(new TomlError("Unterminated multi-line string"));
              } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
                throw this.errorControlCharInString();
              } else {
                this.consume();
              }
            } while (this.nextChar());
          }
          errorControlCharInString() {
            let displayCode = "\\u00";
            if (this.char < 16) {
              displayCode += "0";
            }
            displayCode += this.char.toString(16);
            return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`));
          }
          recordMultiEscapeReplacement(replacement) {
            this.state.buf += replacement;
            return this.goto(this.parseMultiStringContent);
          }
          parseMultiEnd() {
            if (this.char === CHAR_QUOT) {
              return this.next(this.parseMultiEnd2);
            } else {
              this.state.buf += '"';
              return this.goto(this.parseMultiStringContent);
            }
          }
          parseMultiEnd2() {
            if (this.char === CHAR_QUOT) {
              return this.return();
            } else {
              this.state.buf += '""';
              return this.goto(this.parseMultiStringContent);
            }
          }
          parseMultiEscape() {
            if (this.char === CTRL_M || this.char === CTRL_J) {
              return this.next(this.parseMultiTrim);
            } else if (this.char === CHAR_SP || this.char === CTRL_I) {
              return this.next(this.parsePreMultiTrim);
            } else {
              return this.goto(this.parseEscape);
            }
          }
          parsePreMultiTrim() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else if (this.char === CTRL_M || this.char === CTRL_J) {
              return this.next(this.parseMultiTrim);
            } else {
              throw this.error(new TomlError("Can't escape whitespace"));
            }
          }
          parseMultiTrim() {
            if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
              return null;
            } else {
              return this.returnNow();
            }
          }
          parseEscape() {
            if (this.char in escapes) {
              return this.return(escapes[this.char]);
            } else if (this.char === CHAR_u) {
              return this.call(this.parseSmallUnicode, this.parseUnicodeReturn);
            } else if (this.char === CHAR_U) {
              return this.call(this.parseLargeUnicode, this.parseUnicodeReturn);
            } else {
              throw this.error(new TomlError("Unknown escape character: " + this.char));
            }
          }
          parseUnicodeReturn(char) {
            try {
              const codePoint = parseInt(char, 16);
              if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) {
                throw this.error(new TomlError("Invalid unicode, character in range 0xD800 - 0xDFFF is reserved"));
              }
              return this.returnNow(String.fromCodePoint(codePoint));
            } catch (err) {
              throw this.error(TomlError.wrap(err));
            }
          }
          parseSmallUnicode() {
            if (!isHexit(this.char)) {
              throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
            } else {
              this.consume();
              if (this.state.buf.length >= 4) return this.return();
            }
          }
          parseLargeUnicode() {
            if (!isHexit(this.char)) {
              throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
            } else {
              this.consume();
              if (this.state.buf.length >= 8) return this.return();
            }
          }
          /* NUMBERS */
          parseNumberSign() {
            this.consume();
            return this.next(this.parseMaybeSignedInfOrNan);
          }
          parseMaybeSignedInfOrNan() {
            if (this.char === CHAR_i) {
              return this.next(this.parseInf);
            } else if (this.char === CHAR_n) {
              return this.next(this.parseNan);
            } else {
              return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart);
            }
          }
          parseNumberIntegerStart() {
            if (this.char === CHAR_0) {
              this.consume();
              return this.next(this.parseNumberIntegerExponentOrDecimal);
            } else {
              return this.goto(this.parseNumberInteger);
            }
          }
          parseNumberIntegerExponentOrDecimal() {
            if (this.char === CHAR_PERIOD) {
              this.consume();
              return this.call(this.parseNoUnder, this.parseNumberFloat);
            } else if (this.char === CHAR_E || this.char === CHAR_e) {
              this.consume();
              return this.next(this.parseNumberExponentSign);
            } else {
              return this.returnNow(Integer(this.state.buf));
            }
          }
          parseNumberInteger() {
            if (isDigit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnder);
            } else if (this.char === CHAR_E || this.char === CHAR_e) {
              this.consume();
              return this.next(this.parseNumberExponentSign);
            } else if (this.char === CHAR_PERIOD) {
              this.consume();
              return this.call(this.parseNoUnder, this.parseNumberFloat);
            } else {
              const result = Integer(this.state.buf);
              if (result.isNaN()) {
                throw this.error(new TomlError("Invalid number"));
              } else {
                return this.returnNow(result);
              }
            }
          }
          parseNoUnder() {
            if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) {
              throw this.error(new TomlError("Unexpected character, expected digit"));
            } else if (this.atEndOfWord()) {
              throw this.error(new TomlError("Incomplete number"));
            }
            return this.returnNow();
          }
          parseNoUnderHexOctBinLiteral() {
            if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) {
              throw this.error(new TomlError("Unexpected character, expected digit"));
            } else if (this.atEndOfWord()) {
              throw this.error(new TomlError("Incomplete number"));
            }
            return this.returnNow();
          }
          parseNumberFloat() {
            if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnder, this.parseNumberFloat);
            } else if (isDigit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_E || this.char === CHAR_e) {
              this.consume();
              return this.next(this.parseNumberExponentSign);
            } else {
              return this.returnNow(Float(this.state.buf));
            }
          }
          parseNumberExponentSign() {
            if (isDigit(this.char)) {
              return this.goto(this.parseNumberExponent);
            } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
              this.consume();
              this.call(this.parseNoUnder, this.parseNumberExponent);
            } else {
              throw this.error(new TomlError("Unexpected character, expected -, + or digit"));
            }
          }
          parseNumberExponent() {
            if (isDigit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnder);
            } else {
              return this.returnNow(Float(this.state.buf));
            }
          }
          /* NUMBERS or DATETIMES  */
          parseNumberOrDateTime() {
            if (this.char === CHAR_0) {
              this.consume();
              return this.next(this.parseNumberBaseOrDateTime);
            } else {
              return this.goto(this.parseNumberOrDateTimeOnly);
            }
          }
          parseNumberOrDateTimeOnly() {
            if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnder, this.parseNumberInteger);
            } else if (isDigit(this.char)) {
              this.consume();
              if (this.state.buf.length > 4) this.next(this.parseNumberInteger);
            } else if (this.char === CHAR_E || this.char === CHAR_e) {
              this.consume();
              return this.next(this.parseNumberExponentSign);
            } else if (this.char === CHAR_PERIOD) {
              this.consume();
              return this.call(this.parseNoUnder, this.parseNumberFloat);
            } else if (this.char === CHAR_HYPHEN) {
              return this.goto(this.parseDateTime);
            } else if (this.char === CHAR_COLON) {
              return this.goto(this.parseOnlyTimeHour);
            } else {
              return this.returnNow(Integer(this.state.buf));
            }
          }
          parseDateTimeOnly() {
            if (this.state.buf.length < 4) {
              if (isDigit(this.char)) {
                return this.consume();
              } else if (this.char === CHAR_COLON) {
                return this.goto(this.parseOnlyTimeHour);
              } else {
                throw this.error(new TomlError("Expected digit while parsing year part of a date"));
              }
            } else {
              if (this.char === CHAR_HYPHEN) {
                return this.goto(this.parseDateTime);
              } else {
                throw this.error(new TomlError("Expected hyphen (-) while parsing year part of date"));
              }
            }
          }
          parseNumberBaseOrDateTime() {
            if (this.char === CHAR_b) {
              this.consume();
              return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin);
            } else if (this.char === CHAR_o) {
              this.consume();
              return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct);
            } else if (this.char === CHAR_x) {
              this.consume();
              return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex);
            } else if (this.char === CHAR_PERIOD) {
              return this.goto(this.parseNumberInteger);
            } else if (isDigit(this.char)) {
              return this.goto(this.parseDateTimeOnly);
            } else {
              return this.returnNow(Integer(this.state.buf));
            }
          }
          parseIntegerHex() {
            if (isHexit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnderHexOctBinLiteral);
            } else {
              const result = Integer(this.state.buf);
              if (result.isNaN()) {
                throw this.error(new TomlError("Invalid number"));
              } else {
                return this.returnNow(result);
              }
            }
          }
          parseIntegerOct() {
            if (isOctit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnderHexOctBinLiteral);
            } else {
              const result = Integer(this.state.buf);
              if (result.isNaN()) {
                throw this.error(new TomlError("Invalid number"));
              } else {
                return this.returnNow(result);
              }
            }
          }
          parseIntegerBin() {
            if (isBit(this.char)) {
              this.consume();
            } else if (this.char === CHAR_LOWBAR) {
              return this.call(this.parseNoUnderHexOctBinLiteral);
            } else {
              const result = Integer(this.state.buf);
              if (result.isNaN()) {
                throw this.error(new TomlError("Invalid number"));
              } else {
                return this.returnNow(result);
              }
            }
          }
          /* DATETIME */
          parseDateTime() {
            if (this.state.buf.length < 4) {
              throw this.error(new TomlError("Years less than 1000 must be zero padded to four characters"));
            }
            this.state.result = this.state.buf;
            this.state.buf = "";
            return this.next(this.parseDateMonth);
          }
          parseDateMonth() {
            if (this.char === CHAR_HYPHEN) {
              if (this.state.buf.length < 2) {
                throw this.error(new TomlError("Months less than 10 must be zero padded to two characters"));
              }
              this.state.result += "-" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseDateDay);
            } else if (isDigit(this.char)) {
              this.consume();
            } else {
              throw this.error(new TomlError("Incomplete datetime"));
            }
          }
          parseDateDay() {
            if (this.char === CHAR_T || this.char === CHAR_SP) {
              if (this.state.buf.length < 2) {
                throw this.error(new TomlError("Days less than 10 must be zero padded to two characters"));
              }
              this.state.result += "-" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseStartTimeHour);
            } else if (this.atEndOfWord()) {
              return this.returnNow(createDate(this.state.result + "-" + this.state.buf));
            } else if (isDigit(this.char)) {
              this.consume();
            } else {
              throw this.error(new TomlError("Incomplete datetime"));
            }
          }
          parseStartTimeHour() {
            if (this.atEndOfWord()) {
              return this.returnNow(createDate(this.state.result));
            } else {
              return this.goto(this.parseTimeHour);
            }
          }
          parseTimeHour() {
            if (this.char === CHAR_COLON) {
              if (this.state.buf.length < 2) {
                throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
              }
              this.state.result += "T" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseTimeMin);
            } else if (isDigit(this.char)) {
              this.consume();
            } else {
              throw this.error(new TomlError("Incomplete datetime"));
            }
          }
          parseTimeMin() {
            if (this.state.buf.length < 2 && isDigit(this.char)) {
              this.consume();
            } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
              this.state.result += ":" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseTimeSec);
            } else {
              throw this.error(new TomlError("Incomplete datetime"));
            }
          }
          parseTimeSec() {
            if (isDigit(this.char)) {
              this.consume();
              if (this.state.buf.length === 2) {
                this.state.result += ":" + this.state.buf;
                this.state.buf = "";
                return this.next(this.parseTimeZoneOrFraction);
              }
            } else {
              throw this.error(new TomlError("Incomplete datetime"));
            }
          }
          parseOnlyTimeHour() {
            if (this.char === CHAR_COLON) {
              if (this.state.buf.length < 2) {
                throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
              }
              this.state.result = this.state.buf;
              this.state.buf = "";
              return this.next(this.parseOnlyTimeMin);
            } else {
              throw this.error(new TomlError("Incomplete time"));
            }
          }
          parseOnlyTimeMin() {
            if (this.state.buf.length < 2 && isDigit(this.char)) {
              this.consume();
            } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
              this.state.result += ":" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseOnlyTimeSec);
            } else {
              throw this.error(new TomlError("Incomplete time"));
            }
          }
          parseOnlyTimeSec() {
            if (isDigit(this.char)) {
              this.consume();
              if (this.state.buf.length === 2) {
                return this.next(this.parseOnlyTimeFractionMaybe);
              }
            } else {
              throw this.error(new TomlError("Incomplete time"));
            }
          }
          parseOnlyTimeFractionMaybe() {
            this.state.result += ":" + this.state.buf;
            if (this.char === CHAR_PERIOD) {
              this.state.buf = "";
              this.next(this.parseOnlyTimeFraction);
            } else {
              return this.return(createTime(this.state.result));
            }
          }
          parseOnlyTimeFraction() {
            if (isDigit(this.char)) {
              this.consume();
            } else if (this.atEndOfWord()) {
              if (this.state.buf.length === 0) throw this.error(new TomlError("Expected digit in milliseconds"));
              return this.returnNow(createTime(this.state.result + "." + this.state.buf));
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
            }
          }
          parseTimeZoneOrFraction() {
            if (this.char === CHAR_PERIOD) {
              this.consume();
              this.next(this.parseDateTimeFraction);
            } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
              this.consume();
              this.next(this.parseTimeZoneHour);
            } else if (this.char === CHAR_Z) {
              this.consume();
              return this.return(createDateTime(this.state.result + this.state.buf));
            } else if (this.atEndOfWord()) {
              return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
            }
          }
          parseDateTimeFraction() {
            if (isDigit(this.char)) {
              this.consume();
            } else if (this.state.buf.length === 1) {
              throw this.error(new TomlError("Expected digit in milliseconds"));
            } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
              this.consume();
              this.next(this.parseTimeZoneHour);
            } else if (this.char === CHAR_Z) {
              this.consume();
              return this.return(createDateTime(this.state.result + this.state.buf));
            } else if (this.atEndOfWord()) {
              return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
            }
          }
          parseTimeZoneHour() {
            if (isDigit(this.char)) {
              this.consume();
              if (/\d\d$/.test(this.state.buf)) return this.next(this.parseTimeZoneSep);
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
            }
          }
          parseTimeZoneSep() {
            if (this.char === CHAR_COLON) {
              this.consume();
              this.next(this.parseTimeZoneMin);
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected colon"));
            }
          }
          parseTimeZoneMin() {
            if (isDigit(this.char)) {
              this.consume();
              if (/\d\d$/.test(this.state.buf)) return this.return(createDateTime(this.state.result + this.state.buf));
            } else {
              throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
            }
          }
          /* BOOLEAN */
          parseBoolean() {
            if (this.char === CHAR_t) {
              this.consume();
              return this.next(this.parseTrue_r);
            } else if (this.char === CHAR_f) {
              this.consume();
              return this.next(this.parseFalse_a);
            }
          }
          parseTrue_r() {
            if (this.char === CHAR_r) {
              this.consume();
              return this.next(this.parseTrue_u);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseTrue_u() {
            if (this.char === CHAR_u) {
              this.consume();
              return this.next(this.parseTrue_e);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseTrue_e() {
            if (this.char === CHAR_e) {
              return this.return(true);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseFalse_a() {
            if (this.char === CHAR_a) {
              this.consume();
              return this.next(this.parseFalse_l);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseFalse_l() {
            if (this.char === CHAR_l) {
              this.consume();
              return this.next(this.parseFalse_s);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseFalse_s() {
            if (this.char === CHAR_s) {
              this.consume();
              return this.next(this.parseFalse_e);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          parseFalse_e() {
            if (this.char === CHAR_e) {
              return this.return(false);
            } else {
              throw this.error(new TomlError("Invalid boolean, expected true or false"));
            }
          }
          /* INLINE LISTS */
          parseInlineList() {
            if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
              return null;
            } else if (this.char === Parser2.END) {
              throw this.error(new TomlError("Unterminated inline array"));
            } else if (this.char === CHAR_NUM) {
              return this.call(this.parseComment);
            } else if (this.char === CHAR_RSQB) {
              return this.return(this.state.resultArr || InlineList());
            } else {
              return this.callNow(this.parseValue, this.recordInlineListValue);
            }
          }
          recordInlineListValue(value) {
            if (this.state.resultArr) {
              const listType = this.state.resultArr[_contentType];
              const valueType = tomlType(value);
              if (listType !== valueType) {
                throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`));
              }
            } else {
              this.state.resultArr = InlineList(tomlType(value));
            }
            if (isFloat(value) || isInteger(value)) {
              this.state.resultArr.push(value.valueOf());
            } else {
              this.state.resultArr.push(value);
            }
            return this.goto(this.parseInlineListNext);
          }
          parseInlineListNext() {
            if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
              return null;
            } else if (this.char === CHAR_NUM) {
              return this.call(this.parseComment);
            } else if (this.char === CHAR_COMMA) {
              return this.next(this.parseInlineList);
            } else if (this.char === CHAR_RSQB) {
              return this.goto(this.parseInlineList);
            } else {
              throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
            }
          }
          /* INLINE TABLE */
          parseInlineTable() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else if (this.char === Parser2.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
              throw this.error(new TomlError("Unterminated inline array"));
            } else if (this.char === CHAR_RCUB) {
              return this.return(this.state.resultTable || InlineTable());
            } else {
              if (!this.state.resultTable) this.state.resultTable = InlineTable();
              return this.callNow(this.parseAssign, this.recordInlineTableValue);
            }
          }
          recordInlineTableValue(kv) {
            let target = this.state.resultTable;
            let finalKey = kv.key.pop();
            for (let kw of kv.key) {
              if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
                throw this.error(new TomlError("Can't redefine existing key"));
              }
              target = target[kw] = target[kw] || Table();
            }
            if (hasKey(target, finalKey)) {
              throw this.error(new TomlError("Can't redefine existing key"));
            }
            if (isInteger(kv.value) || isFloat(kv.value)) {
              target[finalKey] = kv.value.valueOf();
            } else {
              target[finalKey] = kv.value;
            }
            return this.goto(this.parseInlineTableNext);
          }
          parseInlineTableNext() {
            if (this.char === CHAR_SP || this.char === CTRL_I) {
              return null;
            } else if (this.char === Parser2.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
              throw this.error(new TomlError("Unterminated inline array"));
            } else if (this.char === CHAR_COMMA) {
              return this.next(this.parseInlineTable);
            } else if (this.char === CHAR_RCUB) {
              return this.goto(this.parseInlineTable);
            } else {
              throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
            }
          }
        }
        return TOMLParser;
      }
    }
  });

  // browser-config/node_modules/@iarna/toml/parse-pretty-error.js
  var require_parse_pretty_error = __commonJS({
    "browser-config/node_modules/@iarna/toml/parse-pretty-error.js"(exports2, module2) {
      "use strict";
      module2.exports = prettyError;
      function prettyError(err, buf) {
        if (err.pos == null || err.line == null) return err;
        let msg = err.message;
        msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:
`;
        if (buf && buf.split) {
          const lines = buf.split(/\n/);
          const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length;
          let linePadding = " ";
          while (linePadding.length < lineNumWidth) linePadding += " ";
          for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
            let lineNum = String(ii + 1);
            if (lineNum.length < lineNumWidth) lineNum = " " + lineNum;
            if (err.line === ii) {
              msg += lineNum + "> " + lines[ii] + "\n";
              msg += linePadding + "  ";
              for (let hh = 0; hh < err.col; ++hh) {
                msg += " ";
              }
              msg += "^\n";
            } else {
              msg += lineNum + ": " + lines[ii] + "\n";
            }
          }
        }
        err.message = msg + "\n";
        return err;
      }
    }
  });

  // browser-config/node_modules/@iarna/toml/parse-string.js
  var require_parse_string = __commonJS({
    "browser-config/node_modules/@iarna/toml/parse-string.js"(exports2, module2) {
      "use strict";
      module2.exports = parseString;
      var TOMLParser = require_toml_parser();
      var prettyError = require_parse_pretty_error();
      function parseString(str) {
        if (globalThis.Buffer && globalThis.Buffer.isBuffer(str)) {
          str = str.toString("utf8");
        }
        const parser = new TOMLParser();
        try {
          parser.parse(str);
          return parser.finish();
        } catch (err) {
          throw prettyError(err, str);
        }
      }
    }
  });

  // browser-config/node_modules/@iarna/toml/stringify.js
  var require_stringify = __commonJS({
    "browser-config/node_modules/@iarna/toml/stringify.js"(exports2, module2) {
      "use strict";
      module2.exports = stringify4;
      module2.exports.value = stringifyInline;
      function stringify4(obj) {
        if (obj === null) throw typeError("null");
        if (obj === void 0) throw typeError("undefined");
        if (typeof obj !== "object") throw typeError(typeof obj);
        if (typeof obj.toJSON === "function") obj = obj.toJSON();
        if (obj == null) return null;
        const type = tomlType2(obj);
        if (type !== "table") throw typeError(type);
        return stringifyObject("", "", obj);
      }
      function typeError(type) {
        return new Error("Can only stringify objects, not " + type);
      }
      function arrayOneTypeError() {
        return new Error("Array values can't have mixed types");
      }
      function getInlineKeys(obj) {
        return Object.keys(obj).filter((key) => isInline(obj[key]));
      }
      function getComplexKeys(obj) {
        return Object.keys(obj).filter((key) => !isInline(obj[key]));
      }
      function toJSON(obj) {
        let nobj = Array.isArray(obj) ? [] : Object.prototype.hasOwnProperty.call(obj, "__proto__") ? { ["__proto__"]: void 0 } : {};
        for (let prop of Object.keys(obj)) {
          if (obj[prop] && typeof obj[prop].toJSON === "function" && !("toISOString" in obj[prop])) {
            nobj[prop] = obj[prop].toJSON();
          } else {
            nobj[prop] = obj[prop];
          }
        }
        return nobj;
      }
      function stringifyObject(prefix, indent, obj) {
        obj = toJSON(obj);
        var inlineKeys;
        var complexKeys;
        inlineKeys = getInlineKeys(obj);
        complexKeys = getComplexKeys(obj);
        var result = [];
        var inlineIndent = indent || "";
        inlineKeys.forEach((key) => {
          var type = tomlType2(obj[key]);
          if (type !== "undefined" && type !== "null") {
            result.push(inlineIndent + stringifyKey2(key) + " = " + stringifyAnyInline(obj[key], true));
          }
        });
        if (result.length > 0) result.push("");
        var complexIndent = prefix && inlineKeys.length > 0 ? indent + "  " : "";
        complexKeys.forEach((key) => {
          result.push(stringifyComplex(prefix, complexIndent, key, obj[key]));
        });
        return result.join("\n");
      }
      function isInline(value) {
        switch (tomlType2(value)) {
          case "undefined":
          case "null":
          case "integer":
          case "nan":
          case "float":
          case "boolean":
          case "string":
          case "datetime":
            return true;
          case "array":
            return value.length === 0 || tomlType2(value[0]) !== "table";
          case "table":
            return Object.keys(value).length === 0;
          /* istanbul ignore next */
          default:
            return false;
        }
      }
      function tomlType2(value) {
        if (value === void 0) {
          return "undefined";
        } else if (value === null) {
          return "null";
        } else if (typeof value === "bigint" || Number.isInteger(value) && !Object.is(value, -0)) {
          return "integer";
        } else if (typeof value === "number") {
          return "float";
        } else if (typeof value === "boolean") {
          return "boolean";
        } else if (typeof value === "string") {
          return "string";
        } else if ("toISOString" in value) {
          return isNaN(value) ? "undefined" : "datetime";
        } else if (Array.isArray(value)) {
          return "array";
        } else {
          return "table";
        }
      }
      function stringifyKey2(key) {
        var keyStr = String(key);
        if (/^[-A-Za-z0-9_]+$/.test(keyStr)) {
          return keyStr;
        } else {
          return stringifyBasicString(keyStr);
        }
      }
      function stringifyBasicString(str) {
        return '"' + escapeString(str).replace(/"/g, '\\"') + '"';
      }
      function stringifyLiteralString(str) {
        return "'" + str + "'";
      }
      function numpad(num, str) {
        while (str.length < num) str = "0" + str;
        return str;
      }
      function escapeString(str) {
        return str.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/([\u0000-\u001f\u007f])/, (c) => "\\u" + numpad(4, c.codePointAt(0).toString(16)));
      }
      function stringifyMultilineString(str) {
        let escaped = str.split(/\n/).map((str2) => {
          return escapeString(str2).replace(/"(?="")/g, '\\"');
        }).join("\n");
        if (escaped.slice(-1) === '"') escaped += "\\\n";
        return '"""\n' + escaped + '"""';
      }
      function stringifyAnyInline(value, multilineOk) {
        let type = tomlType2(value);
        if (type === "string") {
          if (multilineOk && /\n/.test(value)) {
            type = "string-multiline";
          } else if (!/[\b\t\n\f\r']/.test(value) && /"/.test(value)) {
            type = "string-literal";
          }
        }
        return stringifyInline(value, type);
      }
      function stringifyInline(value, type) {
        if (!type) type = tomlType2(value);
        switch (type) {
          case "string-multiline":
            return stringifyMultilineString(value);
          case "string":
            return stringifyBasicString(value);
          case "string-literal":
            return stringifyLiteralString(value);
          case "integer":
            return stringifyInteger(value);
          case "float":
            return stringifyFloat(value);
          case "boolean":
            return stringifyBoolean(value);
          case "datetime":
            return stringifyDatetime(value);
          case "array":
            return stringifyInlineArray(value.filter((_) => tomlType2(_) !== "null" && tomlType2(_) !== "undefined" && tomlType2(_) !== "nan"));
          case "table":
            return stringifyInlineTable(value);
          /* istanbul ignore next */
          default:
            throw typeError(type);
        }
      }
      function stringifyInteger(value) {
        return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "_");
      }
      function stringifyFloat(value) {
        if (value === Infinity) {
          return "inf";
        } else if (value === -Infinity) {
          return "-inf";
        } else if (Object.is(value, NaN)) {
          return "nan";
        } else if (Object.is(value, -0)) {
          return "-0.0";
        }
        var chunks = String(value).split(".");
        var int3 = chunks[0];
        var dec = chunks[1] || 0;
        return stringifyInteger(int3) + "." + dec;
      }
      function stringifyBoolean(value) {
        return String(value);
      }
      function stringifyDatetime(value) {
        return value.toISOString();
      }
      function isNumber(type) {
        return type === "float" || type === "integer";
      }
      function arrayType(values) {
        var contentType = tomlType2(values[0]);
        if (values.every((_) => tomlType2(_) === contentType)) return contentType;
        if (values.every((_) => isNumber(tomlType2(_)))) return "float";
        return "mixed";
      }
      function validateArray(values) {
        const type = arrayType(values);
        if (type === "mixed") {
          throw arrayOneTypeError();
        }
        return type;
      }
      function stringifyInlineArray(values) {
        values = toJSON(values);
        const type = validateArray(values);
        var result = "[";
        var stringified = values.map((_) => stringifyInline(_, type));
        if (stringified.join(", ").length > 60 || /\n/.test(stringified)) {
          result += "\n  " + stringified.join(",\n  ") + "\n";
        } else {
          result += " " + stringified.join(", ") + (stringified.length > 0 ? " " : "");
        }
        return result + "]";
      }
      function stringifyInlineTable(value) {
        value = toJSON(value);
        var result = [];
        Object.keys(value).forEach((key) => {
          result.push(stringifyKey2(key) + " = " + stringifyAnyInline(value[key], false));
        });
        return "{ " + result.join(", ") + (result.length > 0 ? " " : "") + "}";
      }
      function stringifyComplex(prefix, indent, key, value) {
        var valueType = tomlType2(value);
        if (valueType === "array") {
          return stringifyArrayOfTables(prefix, indent, key, value);
        } else if (valueType === "table") {
          return stringifyComplexTable(prefix, indent, key, value);
        } else {
          throw typeError(valueType);
        }
      }
      function stringifyArrayOfTables(prefix, indent, key, values) {
        values = toJSON(values);
        validateArray(values);
        var firstValueType = tomlType2(values[0]);
        if (firstValueType !== "table") throw typeError(firstValueType);
        var fullKey = prefix + stringifyKey2(key);
        var result = "";
        values.forEach((table) => {
          if (result.length > 0) result += "\n";
          result += indent + "[[" + fullKey + "]]\n";
          result += stringifyObject(fullKey + ".", indent, table);
        });
        return result;
      }
      function stringifyComplexTable(prefix, indent, key, value) {
        var fullKey = prefix + stringifyKey2(key);
        var result = "";
        if (getInlineKeys(value).length > 0) {
          result += indent + "[" + fullKey + "]\n";
        }
        return result + stringifyObject(fullKey + ".", indent, value);
      }
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/identity.js
  function isCollection(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return true;
      }
    return false;
  }
  function isNode(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return true;
      }
    return false;
  }
  var ALIAS, DOC, MAP, PAIR, SCALAR, SEQ, NODE_TYPE, isAlias, isDocument, isMap, isPair, isScalar, isSeq, hasAnchor;
  var init_identity = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/identity.js"() {
      ALIAS = Symbol.for("yaml.alias");
      DOC = Symbol.for("yaml.document");
      MAP = Symbol.for("yaml.map");
      PAIR = Symbol.for("yaml.pair");
      SCALAR = Symbol.for("yaml.scalar");
      SEQ = Symbol.for("yaml.seq");
      NODE_TYPE = Symbol.for("yaml.node.type");
      isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
      isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
      isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
      isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
      isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
      isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
      hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    }
  });

  // browser-config/node_modules/yaml/browser/dist/visit.js
  function visit3(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node)) {
      const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      visit_(null, node, visitor_, Object.freeze([]));
  }
  function visit_(key, node, visitor, path) {
    const ctrl = callVisitor(key, node, visitor, path);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visit_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0; i < node.items.length; ++i) {
          const ci = visit_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = visit_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = visit_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node)) {
      const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      await visitAsync_(null, node, visitor_, Object.freeze([]));
  }
  async function visitAsync_(key, node, visitor, path) {
    const ctrl = await callVisitor(key, node, visitor, path);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0; i < node.items.length; ++i) {
          const ci = await visitAsync_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = await visitAsync_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = await visitAsync_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    }
    return visitor;
  }
  function callVisitor(key, node, visitor, path) {
    if (typeof visitor === "function")
      return visitor(key, node, path);
    if (isMap(node))
      return visitor.Map?.(key, node, path);
    if (isSeq(node))
      return visitor.Seq?.(key, node, path);
    if (isPair(node))
      return visitor.Pair?.(key, node, path);
    if (isScalar(node))
      return visitor.Scalar?.(key, node, path);
    if (isAlias(node))
      return visitor.Alias?.(key, node, path);
    return void 0;
  }
  function replaceNode(key, path, node) {
    const parent = path[path.length - 1];
    if (isCollection(parent)) {
      parent.items[key] = node;
    } else if (isPair(parent)) {
      if (key === "key")
        parent.key = node;
      else
        parent.value = node;
    } else if (isDocument(parent)) {
      parent.contents = node;
    } else {
      const pt = isAlias(parent) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${pt} parent`);
    }
  }
  var BREAK, SKIP, REMOVE;
  var init_visit = __esm({
    "browser-config/node_modules/yaml/browser/dist/visit.js"() {
      init_identity();
      BREAK = Symbol("break visit");
      SKIP = Symbol("skip children");
      REMOVE = Symbol("remove node");
      visit3.BREAK = BREAK;
      visit3.SKIP = SKIP;
      visit3.REMOVE = REMOVE;
      visitAsync.BREAK = BREAK;
      visitAsync.SKIP = SKIP;
      visitAsync.REMOVE = REMOVE;
    }
  });

  // browser-config/node_modules/yaml/browser/dist/doc/directives.js
  var escapeChars, escapeTagName, Directives;
  var init_directives = __esm({
    "browser-config/node_modules/yaml/browser/dist/doc/directives.js"() {
      init_identity();
      init_visit();
      escapeChars = {
        "!": "%21",
        ",": "%2C",
        "[": "%5B",
        "]": "%5D",
        "{": "%7B",
        "}": "%7D"
      };
      escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
      Directives = class _Directives {
        constructor(yaml, tags) {
          this.docStart = null;
          this.docEnd = false;
          this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
          this.tags = Object.assign({}, _Directives.defaultTags, tags);
        }
        clone() {
          const copy = new _Directives(this.yaml, this.tags);
          copy.docStart = this.docStart;
          return copy;
        }
        /**
         * During parsing, get a Directives instance for the current document and
         * update the stream state according to the current version's spec.
         */
        atDocument() {
          const res = new _Directives(this.yaml, this.tags);
          switch (this.yaml.version) {
            case "1.1":
              this.atNextDocument = true;
              break;
            case "1.2":
              this.atNextDocument = false;
              this.yaml = {
                explicit: _Directives.defaultYaml.explicit,
                version: "1.2"
              };
              this.tags = Object.assign({}, _Directives.defaultTags);
              break;
          }
          return res;
        }
        /**
         * @param onError - May be called even if the action was successful
         * @returns `true` on success
         */
        add(line, onError) {
          if (this.atNextDocument) {
            this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
            this.tags = Object.assign({}, _Directives.defaultTags);
            this.atNextDocument = false;
          }
          const parts = line.trim().split(/[ \t]+/);
          const name = parts.shift();
          switch (name) {
            case "%TAG": {
              if (parts.length !== 2) {
                onError(0, "%TAG directive should contain exactly two parts");
                if (parts.length < 2)
                  return false;
              }
              const [handle, prefix] = parts;
              this.tags[handle] = prefix;
              return true;
            }
            case "%YAML": {
              this.yaml.explicit = true;
              if (parts.length !== 1) {
                onError(0, "%YAML directive should contain exactly one part");
                return false;
              }
              const [version] = parts;
              if (version === "1.1" || version === "1.2") {
                this.yaml.version = version;
                return true;
              } else {
                const isValid = /^\d+\.\d+$/.test(version);
                onError(6, `Unsupported YAML version ${version}`, isValid);
                return false;
              }
            }
            default:
              onError(0, `Unknown directive ${name}`, true);
              return false;
          }
        }
        /**
         * Resolves a tag, matching handles to those defined in %TAG directives.
         *
         * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
         *   `'!local'` tag, or `null` if unresolvable.
         */
        tagName(source, onError) {
          if (source === "!")
            return "!";
          if (source[0] !== "!") {
            onError(`Not a valid tag: ${source}`);
            return null;
          }
          if (source[1] === "<") {
            const verbatim = source.slice(2, -1);
            if (verbatim === "!" || verbatim === "!!") {
              onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
              return null;
            }
            if (source[source.length - 1] !== ">")
              onError("Verbatim tags must end with a >");
            return verbatim;
          }
          const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
          if (!suffix)
            onError(`The ${source} tag has no suffix`);
          const prefix = this.tags[handle];
          if (prefix) {
            try {
              return prefix + decodeURIComponent(suffix);
            } catch (error) {
              onError(String(error));
              return null;
            }
          }
          if (handle === "!")
            return source;
          onError(`Could not resolve tag: ${source}`);
          return null;
        }
        /**
         * Given a fully resolved tag, returns its printable string form,
         * taking into account current tag prefixes and defaults.
         */
        tagString(tag) {
          for (const [handle, prefix] of Object.entries(this.tags)) {
            if (tag.startsWith(prefix))
              return handle + escapeTagName(tag.substring(prefix.length));
          }
          return tag[0] === "!" ? tag : `!<${tag}>`;
        }
        toString(doc) {
          const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
          const tagEntries = Object.entries(this.tags);
          let tagNames;
          if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
            const tags = {};
            visit3(doc.contents, (_key, node) => {
              if (isNode(node) && node.tag)
                tags[node.tag] = true;
            });
            tagNames = Object.keys(tags);
          } else
            tagNames = [];
          for (const [handle, prefix] of tagEntries) {
            if (handle === "!!" && prefix === "tag:yaml.org,2002:")
              continue;
            if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
              lines.push(`%TAG ${handle} ${prefix}`);
          }
          return lines.join("\n");
        }
      };
      Directives.defaultYaml = { explicit: false, version: "1.2" };
      Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/doc/anchors.js
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      const sa = JSON.stringify(anchor);
      const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
      throw new Error(msg);
    }
    return true;
  }
  function anchorNames(root) {
    const anchors = /* @__PURE__ */ new Set();
    visit3(root, {
      Value(_key, node) {
        if (node.anchor)
          anchors.add(node.anchor);
      }
    });
    return anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!exclude.has(name))
        return name;
    }
  }
  function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = /* @__PURE__ */ new Map();
    let prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source);
        prevAnchors ?? (prevAnchors = anchorNames(doc));
        const anchor = findNewAnchor(prefix, prevAnchors);
        prevAnchors.add(anchor);
        return anchor;
      },
      /**
       * With circular references, the source node is only resolved after all
       * of its child nodes are. This is why anchors are set only after all of
       * the nodes have been created.
       */
      setAnchors: () => {
        for (const source of aliasObjects) {
          const ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
            ref.node.anchor = ref.anchor;
          } else {
            const error = new Error("Failed to resolve repeated object (this should not happen)");
            error.source = source;
            throw error;
          }
        }
      },
      sourceObjects
    };
  }
  var init_anchors = __esm({
    "browser-config/node_modules/yaml/browser/dist/doc/anchors.js"() {
      init_identity();
      init_visit();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/doc/applyReviver.js
  function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; ++i) {
          const v0 = val[i];
          const v1 = applyReviver(reviver, val, String(i), v0);
          if (v1 === void 0)
            delete val[i];
          else if (v1 !== v0)
            val[i] = v1;
        }
      } else if (val instanceof Map) {
        for (const k of Array.from(val.keys())) {
          const v0 = val.get(k);
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            val.delete(k);
          else if (v1 !== v0)
            val.set(k, v1);
        }
      } else if (val instanceof Set) {
        for (const v0 of Array.from(val)) {
          const v1 = applyReviver(reviver, val, v0, v0);
          if (v1 === void 0)
            val.delete(v0);
          else if (v1 !== v0) {
            val.delete(v0);
            val.add(v1);
          }
        }
      } else {
        for (const [k, v0] of Object.entries(val)) {
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            delete val[k];
          else if (v1 !== v0)
            val[k] = v1;
        }
      }
    }
    return reviver.call(obj, key, val);
  }
  var init_applyReviver = __esm({
    "browser-config/node_modules/yaml/browser/dist/doc/applyReviver.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/toJS.js
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !hasAnchor(value))
        return value.toJSON(arg, ctx);
      const data = { aliasCount: 0, count: 1, res: void 0 };
      ctx.anchors.set(value, data);
      ctx.onCreate = (res2) => {
        data.res = res2;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }
  var init_toJS = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/toJS.js"() {
      init_identity();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/Node.js
  var NodeBase;
  var init_Node = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/Node.js"() {
      init_applyReviver();
      init_identity();
      init_toJS();
      NodeBase = class {
        constructor(type) {
          Object.defineProperty(this, NODE_TYPE, { value: type });
        }
        /** Create a copy of this node.  */
        clone() {
          const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
          if (this.range)
            copy.range = this.range.slice();
          return copy;
        }
        /** A plain JavaScript representation of this node. */
        toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
          if (!isDocument(doc))
            throw new TypeError("A document argument is required");
          const ctx = {
            anchors: /* @__PURE__ */ new Map(),
            doc,
            keep: true,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
          };
          const res = toJS(this, "", ctx);
          if (typeof onAnchor === "function")
            for (const { count, res: res2 } of ctx.anchors.values())
              onAnchor(res2, count);
          return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/Alias.js
  function getAliasCount(doc, node, anchors) {
    if (isAlias(node)) {
      const source = node.resolve(doc);
      const anchor = anchors && source && anchors.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (isCollection(node)) {
      let count = 0;
      for (const item of node.items) {
        const c = getAliasCount(doc, item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (isPair(node)) {
      const kc = getAliasCount(doc, node.key, anchors);
      const vc = getAliasCount(doc, node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }
  var Alias;
  var init_Alias = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/Alias.js"() {
      init_anchors();
      init_visit();
      init_identity();
      init_Node();
      init_toJS();
      Alias = class extends NodeBase {
        constructor(source) {
          super(ALIAS);
          this.source = source;
          Object.defineProperty(this, "tag", {
            set() {
              throw new Error("Alias nodes cannot have tags");
            }
          });
        }
        /**
         * Resolve the value of this alias within `doc`, finding the last
         * instance of the `source` anchor before this node.
         */
        resolve(doc, ctx) {
          if (ctx?.maxAliasCount === 0)
            throw new ReferenceError("Alias resolution is disabled");
          let nodes;
          if (ctx?.aliasResolveCache) {
            nodes = ctx.aliasResolveCache;
          } else {
            nodes = [];
            visit3(doc, {
              Node: (_key, node) => {
                if (isAlias(node) || hasAnchor(node))
                  nodes.push(node);
              }
            });
            if (ctx)
              ctx.aliasResolveCache = nodes;
          }
          let found = void 0;
          for (const node of nodes) {
            if (node === this)
              break;
            if (node.anchor === this.source)
              found = node;
          }
          if (found && ctx) {
            const { anchors, doc: doc2, maxAliasCount } = ctx;
            let data = anchors.get(found);
            if (!data) {
              toJS(found, null, ctx);
              data = anchors.get(found);
            }
            if (data?.res === void 0) {
              const msg = "This should not happen: Alias anchor was not resolved?";
              throw new ReferenceError(msg);
            }
            if (maxAliasCount >= 0) {
              data.count += 1;
              if (data.aliasCount === 0)
                data.aliasCount = getAliasCount(doc2, found, anchors);
              if (data.count * data.aliasCount > maxAliasCount) {
                const msg = "Excessive alias count indicates a resource exhaustion attack";
                throw new ReferenceError(msg);
              }
            }
          }
          return found;
        }
        toJSON(_arg, ctx) {
          if (!ctx)
            return { source: this.source };
          const source = this.resolve(ctx.doc, ctx);
          if (!source) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new ReferenceError(msg);
          }
          return ctx.anchors.get(source).res;
        }
        toString(ctx, _onComment, _onChompKeep) {
          const src = `*${this.source}`;
          if (ctx) {
            anchorIsValid(this.source);
            if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
              const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
              throw new Error(msg);
            }
            if (ctx.implicitKey)
              return `${src} `;
          }
          return src;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/Scalar.js
  var isScalarValue, Scalar;
  var init_Scalar = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/Scalar.js"() {
      init_identity();
      init_Node();
      init_toJS();
      isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
      Scalar = class extends NodeBase {
        constructor(value) {
          super(SCALAR);
          this.value = value;
        }
        toJSON(arg, ctx) {
          return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
        }
        toString() {
          return String(this.value);
        }
      };
      Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
      Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
      Scalar.PLAIN = "PLAIN";
      Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
      Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    }
  });

  // browser-config/node_modules/yaml/browser/dist/doc/createNode.js
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) ?? match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t) => t.identify?.(value) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (isDocument(value))
      value = value.contents;
    if (isNode(value))
      return value;
    if (isPair(value)) {
      const map2 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
      map2.items.push(value);
      return map2;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
      value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
    let ref = void 0;
    if (aliasDuplicateObjects && value && typeof value === "object") {
      ref = sourceObjects.get(value);
      if (ref) {
        ref.anchor ?? (ref.anchor = onAnchor(value));
        return new Alias(ref.anchor);
      } else {
        ref = { anchor: null, node: null };
        sourceObjects.set(value, ref);
      }
    }
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema4.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      if (!value || typeof value !== "object") {
        const node2 = new Scalar(value);
        if (ref)
          ref.node = node2;
        return node2;
      }
      tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
    if (tagName)
      node.tag = tagName;
    else if (!tagObj.default)
      node.tag = tagObj.tag;
    if (ref)
      ref.node = node;
    return node;
  }
  var defaultTagPrefix;
  var init_createNode = __esm({
    "browser-config/node_modules/yaml/browser/dist/doc/createNode.js"() {
      init_Alias();
      init_identity();
      init_Scalar();
      defaultTagPrefix = "tag:yaml.org,2002:";
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/Collection.js
  function collectionFromPath(schema4, path, value) {
    let v = value;
    for (let i = path.length - 1; i >= 0; --i) {
      const k = path[i];
      if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        v = /* @__PURE__ */ new Map([[k, v]]);
      }
    }
    return createNode(v, void 0, {
      aliasDuplicateObjects: false,
      keepUndefined: false,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: schema4,
      sourceObjects: /* @__PURE__ */ new Map()
    });
  }
  var isEmptyPath, Collection;
  var init_Collection = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/Collection.js"() {
      init_createNode();
      init_identity();
      init_Node();
      isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
      Collection = class extends NodeBase {
        constructor(type, schema4) {
          super(type);
          Object.defineProperty(this, "schema", {
            value: schema4,
            configurable: true,
            enumerable: false,
            writable: true
          });
        }
        /**
         * Create a copy of this collection.
         *
         * @param schema - If defined, overwrites the original's schema
         */
        clone(schema4) {
          const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
          if (schema4)
            copy.schema = schema4;
          copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
          if (this.range)
            copy.range = this.range.slice();
          return copy;
        }
        /**
         * Adds a value to the collection. For `!!map` and `!!omap` the value must
         * be a Pair instance or a `{ key, value }` object, which may not have a key
         * that already exists in the map.
         */
        addIn(path, value) {
          if (isEmptyPath(path))
            this.add(value);
          else {
            const [key, ...rest] = path;
            const node = this.get(key, true);
            if (isCollection(node))
              node.addIn(rest, value);
            else if (node === void 0 && this.schema)
              this.set(key, collectionFromPath(this.schema, rest, value));
            else
              throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
          }
        }
        /**
         * Removes a value from the collection.
         * @returns `true` if the item was found and removed.
         */
        deleteIn(path) {
          const [key, ...rest] = path;
          if (rest.length === 0)
            return this.delete(key);
          const node = this.get(key, true);
          if (isCollection(node))
            return node.deleteIn(rest);
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
        /**
         * Returns item at `key`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        getIn(path, keepScalar) {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (rest.length === 0)
            return !keepScalar && isScalar(node) ? node.value : node;
          else
            return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
        }
        hasAllNullValues(allowScalar) {
          return this.items.every((node) => {
            if (!isPair(node))
              return false;
            const n = node.value;
            return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
          });
        }
        /**
         * Checks if the collection includes a value with the key `key`.
         */
        hasIn(path) {
          const [key, ...rest] = path;
          if (rest.length === 0)
            return this.has(key);
          const node = this.get(key, true);
          return isCollection(node) ? node.hasIn(rest) : false;
        }
        /**
         * Sets a value in this collection. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        setIn(path, value) {
          const [key, ...rest] = path;
          if (rest.length === 0) {
            this.set(key, value);
          } else {
            const node = this.get(key, true);
            if (isCollection(node))
              node.setIn(rest, value);
            else if (node === void 0 && this.schema)
              this.set(key, collectionFromPath(this.schema, rest, value));
            else
              throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
          }
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyComment.js
  function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
      return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
  }
  var stringifyComment, lineComment;
  var init_stringifyComment = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyComment.js"() {
      stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
      lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/foldFlowLines.js
  function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
      return text;
    if (lineWidth < minContentWidth)
      minContentWidth = 0;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = void 0;
    let prev = void 0;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i, indent.length);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch; ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === "\n") {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text, i, indent.length);
        end = i + indent.length + endStep;
        split = void 0;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
          const next = text[i + 1];
          if (next && next !== " " && next !== "\n" && next !== "	")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = void 0;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "	") {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = void 0;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i2 = 0; i2 < folds.length; ++i2) {
      const fold = folds[i2];
      const end2 = folds[i2 + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end2)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end2)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text, i, indent) {
    let end = i;
    let start = i + 1;
    let ch = text[start];
    while (ch === " " || ch === "	") {
      if (i < start + indent) {
        ch = text[++i];
      } else {
        do {
          ch = text[++i];
        } while (ch && ch !== "\n");
        end = i;
        start = i + 1;
        ch = text[start];
      }
    }
    return end;
  }
  var FOLD_FLOW, FOLD_BLOCK, FOLD_QUOTED;
  var init_foldFlowLines = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/foldFlowLines.js"() {
      FOLD_FLOW = "flow";
      FOLD_BLOCK = "block";
      FOLD_QUOTED = "quoted";
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyString.js
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
      if (str[i] === "\n") {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + "\n\n";
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += "\n";
                i += 2;
              }
              str += indent;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
      qs = doubleQuotedString;
    else {
      const hasDouble = value.includes('"');
      const hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    if (!blockQuote || /\n[\t ]+$/.test(value)) {
      return quotedString(value, ctx);
    }
    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
      return literal ? "|\n" : ">\n";
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
      const ch = value[endStart - 1];
      if (ch !== "\n" && ch !== "	" && ch !== " ")
        break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf("\n");
    if (endNlPos === -1) {
      chomp = "-";
    } else if (value === end || endNlPos !== end.length - 1) {
      chomp = "+";
      if (onChompKeep)
        onChompKeep();
    } else {
      chomp = "";
    }
    if (end) {
      value = value.slice(0, -end.length);
      if (end[end.length - 1] === "\n")
        end = end.slice(0, -1);
      end = end.replace(blockEndNewlines, `$&${indent}`);
    }
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
      const ch = value[startEnd];
      if (ch === " ")
        startWithSpace = true;
      else if (ch === "\n")
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
      value = value.substring(start.length);
      start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? "2" : "1";
    let header = (startWithSpace ? indentSize : "") + chomp;
    if (comment) {
      header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
      if (onComment)
        onComment();
    }
    if (!literal) {
      const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
      let literalFallback = false;
      const foldOptions = getFoldOptions(ctx, true);
      if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) {
        foldOptions.onOverflow = () => {
          literalFallback = true;
        };
      }
      const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
      if (!literalFallback)
        return `>${header}
${indent}${body}`;
    }
    value = value.replace(/\n+/g, `$&${indent}`);
    return `|${header}
${indent}${start}${value}${end}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
      return quotedString(value, ctx);
    }
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
      if (indent === "") {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      } else if (implicitKey && indent === indentStep) {
        return quotedString(value, ctx);
      }
    }
    const str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
      const { compat, tags } = ctx.doc.schema;
      if (tags.some(test) || compat?.some(test))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type2) => {
      switch (_type2) {
        case Scalar.BLOCK_FOLDED:
        case Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    let res = _stringify(type);
    if (res === null) {
      const { defaultKeyType, defaultStringType } = ctx.options;
      const t = implicitKey && defaultKeyType || defaultStringType;
      res = _stringify(t);
      if (res === null)
        throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
  }
  var getFoldOptions, containsDocumentMarker, blockEndNewlines;
  var init_stringifyString = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyString.js"() {
      init_Scalar();
      init_foldFlowLines();
      getFoldOptions = (ctx, isBlock2) => ({
        indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
        lineWidth: ctx.options.lineWidth,
        minContentWidth: ctx.options.minContentWidth
      });
      containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
      try {
        blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
      } catch {
        blockEndNewlines = /\n+(?!\n|$)/g;
      }
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringify.js
  function createStringifyContext(doc, options) {
    const opt = Object.assign({
      blockQuote: true,
      commentString: stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: true,
      indentSeq: true,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: false,
      singleQuote: null,
      trailingComma: false,
      trueStr: "true",
      verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = false;
        break;
      case "flow":
        inFlow = true;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: /* @__PURE__ */ new Set(),
      doc,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) ?? match[0];
    }
    let tagObj = void 0;
    let obj;
    if (isScalar(item)) {
      obj = item.value;
      let match = tags.filter((t) => t.identify?.(obj));
      if (match.length > 1) {
        const testMatch = match.filter((t) => t.test);
        if (testMatch.length > 0)
          match = testMatch;
      }
      tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, { anchors, doc }) {
    if (!doc.directives)
      return "";
    const props = [];
    const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
    if (anchor && anchorIsValid(anchor)) {
      anchors.add(anchor);
      props.push(`&${anchor}`);
    }
    const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
    if (tag)
      props.push(doc.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    if (isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item)) {
        throw new TypeError(`Cannot stringify circular structure without alias nodes`);
      } else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = void 0;
    const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
    tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }
  var init_stringify = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringify.js"() {
      init_anchors();
      init_identity();
      init_stringifyComment();
      init_stringifyString();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyPair.js
  function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = isNode(key) && key.comment || null;
    if (simpleKeys) {
      if (keyComment) {
        throw new Error("With simple keys, key nodes cannot have comments");
      }
      if (isCollection(key) || !isNode(key) && typeof key === "object") {
        const msg = "With simple keys, collection cannot be used as a key value";
        throw new Error(msg);
      }
    }
    let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: false,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = true;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      str = `? ${str}`;
      if (keyComment && !keyCommentDone) {
        str += lineComment(str, ctx.indent, commentString(keyComment));
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent}:`;
    } else {
      str = `${str}:`;
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (isNode(value)) {
      vsb = !!value.spaceBefore;
      vcb = value.commentBefore;
      valueComment = value.comment;
    } else {
      vsb = false;
      vcb = null;
      valueComment = null;
      if (value && typeof value === "object")
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && isScalar(value))
      ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
      ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
    let ws = " ";
    if (keyComment || vsb || vcb) {
      ws = vsb ? "\n" : "";
      if (vcb) {
        const cs = commentString(vcb);
        ws += `
${indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === "\n" && valueComment)
          ws = "\n\n";
      } else {
        ws += `
${ctx.indent}`;
      }
    } else if (!explicitKey && isCollection(value)) {
      const vs0 = valueStr[0];
      const nl0 = valueStr.indexOf("\n");
      const hasNewline = nl0 !== -1;
      const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow) {
        let hasPropsLine = false;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          }
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = true;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === "\n") {
      ws = "";
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone) {
      str += lineComment(str, ctx.indent, commentString(valueComment));
    } else if (chompKeep && onChompKeep) {
      onChompKeep();
    }
    return str;
  }
  var init_stringifyPair = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyPair.js"() {
      init_identity();
      init_Scalar();
      init_stringify();
      init_stringifyComment();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/log.js
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn") {
      console.warn(warning);
    }
  }
  var init_log = __esm({
    "browser-config/node_modules/yaml/browser/dist/log.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
  function addMergeToJSMap(ctx, map2, value) {
    const source = resolveAliasValue(ctx, value);
    if (isSeq(source))
      for (const it of source.items)
        mergeValue(ctx, map2, it);
    else if (Array.isArray(source))
      for (const it of source)
        mergeValue(ctx, map2, it);
    else
      mergeValue(ctx, map2, source);
  }
  function mergeValue(ctx, map2, value) {
    const source = resolveAliasValue(ctx, value);
    if (!isMap(source))
      throw new Error("Merge sources must be maps or map aliases");
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value2] of srcMap) {
      if (map2 instanceof Map) {
        if (!map2.has(key))
          map2.set(key, value2);
      } else if (map2 instanceof Set) {
        map2.add(key);
      } else if (!Object.prototype.hasOwnProperty.call(map2, key)) {
        Object.defineProperty(map2, key, {
          value: value2,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return map2;
  }
  function resolveAliasValue(ctx, value) {
    return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
  }
  var MERGE_KEY, merge, isMergeKey;
  var init_merge = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js"() {
      init_identity();
      init_Scalar();
      MERGE_KEY = "<<";
      merge = {
        identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
        default: "key",
        tag: "tag:yaml.org,2002:merge",
        test: /^<<$/,
        resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
          addToJSMap: addMergeToJSMap
        }),
        stringify: () => MERGE_KEY
      };
      isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
  function addPairToJSMap(ctx, map2, { key, value }) {
    if (isNode(key) && key.addToJSMap)
      key.addToJSMap(ctx, map2, value);
    else if (isMergeKey(ctx, key))
      addMergeToJSMap(ctx, map2, value);
    else {
      const jsKey = toJS(key, "", ctx);
      if (map2 instanceof Map) {
        map2.set(jsKey, toJS(value, jsKey, ctx));
      } else if (map2 instanceof Set) {
        map2.add(jsKey);
      } else {
        const stringKey = stringifyKey(key, jsKey, ctx);
        const jsValue = toJS(value, stringKey, ctx);
        if (stringKey in map2)
          Object.defineProperty(map2, stringKey, {
            value: jsValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map2[stringKey] = jsValue;
      }
    }
    return map2;
  }
  function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (isNode(key) && ctx?.doc) {
      const strCtx = createStringifyContext(ctx.doc, {});
      strCtx.anchors = /* @__PURE__ */ new Set();
      for (const node of ctx.anchors.keys())
        strCtx.anchors.add(node.anchor);
      strCtx.inFlow = true;
      strCtx.inStringifyKey = true;
      const strKey = key.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
        ctx.mapKeyWarned = true;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }
  var init_addPairToJSMap = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/addPairToJSMap.js"() {
      init_log();
      init_merge();
      init_stringify();
      init_identity();
      init_toJS();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/Pair.js
  function createPair(key, value, ctx) {
    const k = createNode(key, void 0, ctx);
    const v = createNode(value, void 0, ctx);
    return new Pair(k, v);
  }
  var Pair;
  var init_Pair = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/Pair.js"() {
      init_createNode();
      init_stringifyPair();
      init_addPairToJSMap();
      init_identity();
      Pair = class _Pair {
        constructor(key, value = null) {
          Object.defineProperty(this, NODE_TYPE, { value: PAIR });
          this.key = key;
          this.value = value;
        }
        clone(schema4) {
          let { key, value } = this;
          if (isNode(key))
            key = key.clone(schema4);
          if (isNode(value))
            value = value.clone(schema4);
          return new _Pair(key, value);
        }
        toJSON(_, ctx) {
          const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
          return addPairToJSMap(ctx, pair, this);
        }
        toString(ctx, onComment, onChompKeep) {
          return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyCollection.js
  function stringifyCollection(collection, ctx, options) {
    const flow = ctx.inFlow ?? collection.flow;
    const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify4(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment2 = null;
      if (isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
        if (item.comment)
          comment2 = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = false;
      let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
      if (comment2)
        str2 += lineComment(str2, itemIndent, commentString(comment2));
      if (chompKeep && comment2)
        chompKeep = false;
      lines.push(blockItemPrefix + str2);
    }
    let str;
    if (lines.length === 0) {
      str = flowChars.start + flowChars.end;
    } else {
      str = lines[0];
      for (let i = 1; i < lines.length; ++i) {
        const line = lines[i];
        str += line ? `
${indent}${line}` : "\n";
      }
    }
    if (comment) {
      str += "\n" + indentComment(commentString(comment), indent);
      if (onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
    const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: true,
      type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment = null;
      if (isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, false);
        if (item.comment)
          comment = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, false);
          if (ik.comment)
            reqNewline = true;
        }
        const iv = isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment = iv.comment;
          if (iv.commentBefore)
            reqNewline = true;
        } else if (item.value == null && ik?.comment) {
          comment = ik.comment;
        }
      }
      if (comment)
        reqNewline = true;
      let str = stringify(item, itemCtx, () => comment = null);
      reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
      if (i < items.length - 1) {
        str += ",";
      } else if (ctx.options.trailingComma) {
        if (ctx.options.lineWidth > 0) {
          reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
        }
        if (reqNewline) {
          str += ",";
        }
      }
      if (comment)
        str += lineComment(str, itemIndent, commentString(comment));
      lines.push(str);
      linesAtValue = lines.length;
    }
    const { start, end } = flowChars;
    if (lines.length === 0) {
      return start + end;
    } else {
      if (!reqNewline) {
        const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (const line of lines)
          str += line ? `
${indentStep}${indent}${line}` : "\n";
        return `${str}
${indent}${end}`;
      } else {
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
      }
    }
  }
  function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
      comment = comment.replace(/^\n+/, "");
    if (comment) {
      const ic = indentComment(commentString(comment), indent);
      lines.push(ic.trimStart());
    }
  }
  var init_stringifyCollection = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyCollection.js"() {
      init_identity();
      init_stringify();
      init_stringifyComment();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/YAMLMap.js
  function findPair(items, key) {
    const k = isScalar(key) ? key.value : key;
    for (const it of items) {
      if (isPair(it)) {
        if (it.key === key || it.key === k)
          return it;
        if (isScalar(it.key) && it.key.value === k)
          return it;
      }
    }
    return void 0;
  }
  var YAMLMap;
  var init_YAMLMap = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/YAMLMap.js"() {
      init_stringifyCollection();
      init_addPairToJSMap();
      init_Collection();
      init_identity();
      init_Pair();
      init_Scalar();
      YAMLMap = class extends Collection {
        static get tagName() {
          return "tag:yaml.org,2002:map";
        }
        constructor(schema4) {
          super(MAP, schema4);
          this.items = [];
        }
        /**
         * A generic collection parsing method that can be extended
         * to other node classes that inherit from YAMLMap
         */
        static from(schema4, obj, ctx) {
          const { keepUndefined, replacer } = ctx;
          const map2 = new this(schema4);
          const add = (key, value) => {
            if (typeof replacer === "function")
              value = replacer.call(obj, key, value);
            else if (Array.isArray(replacer) && !replacer.includes(key))
              return;
            if (value !== void 0 || keepUndefined)
              map2.items.push(createPair(key, value, ctx));
          };
          if (obj instanceof Map) {
            for (const [key, value] of obj)
              add(key, value);
          } else if (obj && typeof obj === "object") {
            for (const key of Object.keys(obj))
              add(key, obj[key]);
          }
          if (typeof schema4.sortMapEntries === "function") {
            map2.items.sort(schema4.sortMapEntries);
          }
          return map2;
        }
        /**
         * Adds a value to the collection.
         *
         * @param overwrite - If not set `true`, using a key that is already in the
         *   collection will throw. Otherwise, overwrites the previous value.
         */
        add(pair, overwrite) {
          let _pair;
          if (isPair(pair))
            _pair = pair;
          else if (!pair || typeof pair !== "object" || !("key" in pair)) {
            _pair = new Pair(pair, pair?.value);
          } else
            _pair = new Pair(pair.key, pair.value);
          const prev = findPair(this.items, _pair.key);
          const sortEntries = this.schema?.sortMapEntries;
          if (prev) {
            if (!overwrite)
              throw new Error(`Key ${_pair.key} already set`);
            if (isScalar(prev.value) && isScalarValue(_pair.value))
              prev.value.value = _pair.value;
            else
              prev.value = _pair.value;
          } else if (sortEntries) {
            const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
            if (i === -1)
              this.items.push(_pair);
            else
              this.items.splice(i, 0, _pair);
          } else {
            this.items.push(_pair);
          }
        }
        delete(key) {
          const it = findPair(this.items, key);
          if (!it)
            return false;
          const del = this.items.splice(this.items.indexOf(it), 1);
          return del.length > 0;
        }
        get(key, keepScalar) {
          const it = findPair(this.items, key);
          const node = it?.value;
          return (!keepScalar && isScalar(node) ? node.value : node) ?? void 0;
        }
        has(key) {
          return !!findPair(this.items, key);
        }
        set(key, value) {
          this.add(new Pair(key, value), true);
        }
        /**
         * @param ctx - Conversion context, originally set in Document#toJS()
         * @param {Class} Type - If set, forces the returned collection type
         * @returns Instance of Type, Map, or Object
         */
        toJSON(_, ctx, Type) {
          const map2 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
          if (ctx?.onCreate)
            ctx.onCreate(map2);
          for (const item of this.items)
            addPairToJSMap(ctx, map2, item);
          return map2;
        }
        toString(ctx, onComment, onChompKeep) {
          if (!ctx)
            return JSON.stringify(this);
          for (const item of this.items) {
            if (!isPair(item))
              throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
          }
          if (!ctx.allNullValues && this.hasAllNullValues(false))
            ctx = Object.assign({}, ctx, { allNullValues: true });
          return stringifyCollection(this, ctx, {
            blockItemPrefix: "",
            flowChars: { start: "{", end: "}" },
            itemIndent: ctx.indent || "",
            onChompKeep,
            onComment
          });
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/common/map.js
  var map;
  var init_map = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/common/map.js"() {
      init_identity();
      init_YAMLMap();
      map = {
        collection: "map",
        default: true,
        nodeClass: YAMLMap,
        tag: "tag:yaml.org,2002:map",
        resolve(map2, onError) {
          if (!isMap(map2))
            onError("Expected a mapping for this tag");
          return map2;
        },
        createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/nodes/YAMLSeq.js
  function asItemIndex(key) {
    let idx = isScalar(key) ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  var YAMLSeq;
  var init_YAMLSeq = __esm({
    "browser-config/node_modules/yaml/browser/dist/nodes/YAMLSeq.js"() {
      init_createNode();
      init_stringifyCollection();
      init_Collection();
      init_identity();
      init_Scalar();
      init_toJS();
      YAMLSeq = class extends Collection {
        static get tagName() {
          return "tag:yaml.org,2002:seq";
        }
        constructor(schema4) {
          super(SEQ, schema4);
          this.items = [];
        }
        add(value) {
          this.items.push(value);
        }
        /**
         * Removes a value from the collection.
         *
         * `key` must contain a representation of an integer for this to succeed.
         * It may be wrapped in a `Scalar`.
         *
         * @returns `true` if the item was found and removed.
         */
        delete(key) {
          const idx = asItemIndex(key);
          if (typeof idx !== "number")
            return false;
          const del = this.items.splice(idx, 1);
          return del.length > 0;
        }
        get(key, keepScalar) {
          const idx = asItemIndex(key);
          if (typeof idx !== "number")
            return void 0;
          const it = this.items[idx];
          return !keepScalar && isScalar(it) ? it.value : it;
        }
        /**
         * Checks if the collection includes a value with the key `key`.
         *
         * `key` must contain a representation of an integer for this to succeed.
         * It may be wrapped in a `Scalar`.
         */
        has(key) {
          const idx = asItemIndex(key);
          return typeof idx === "number" && idx < this.items.length;
        }
        /**
         * Sets a value in this collection. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         *
         * If `key` does not contain a representation of an integer, this will throw.
         * It may be wrapped in a `Scalar`.
         */
        set(key, value) {
          const idx = asItemIndex(key);
          if (typeof idx !== "number")
            throw new Error(`Expected a valid index, not ${key}.`);
          const prev = this.items[idx];
          if (isScalar(prev) && isScalarValue(value))
            prev.value = value;
          else
            this.items[idx] = value;
        }
        toJSON(_, ctx) {
          const seq2 = [];
          if (ctx?.onCreate)
            ctx.onCreate(seq2);
          let i = 0;
          for (const item of this.items)
            seq2.push(toJS(item, String(i++), ctx));
          return seq2;
        }
        toString(ctx, onComment, onChompKeep) {
          if (!ctx)
            return JSON.stringify(this);
          return stringifyCollection(this, ctx, {
            blockItemPrefix: "- ",
            flowChars: { start: "[", end: "]" },
            itemIndent: (ctx.indent || "") + "  ",
            onChompKeep,
            onComment
          });
        }
        static from(schema4, obj, ctx) {
          const { replacer } = ctx;
          const seq2 = new this(schema4);
          if (obj && Symbol.iterator in Object(obj)) {
            let i = 0;
            for (let it of obj) {
              if (typeof replacer === "function") {
                const key = obj instanceof Set ? it : String(i++);
                it = replacer.call(obj, key, it);
              }
              seq2.items.push(createNode(it, void 0, ctx));
            }
          }
          return seq2;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/common/seq.js
  var seq;
  var init_seq = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/common/seq.js"() {
      init_identity();
      init_YAMLSeq();
      seq = {
        collection: "seq",
        default: true,
        nodeClass: YAMLSeq,
        tag: "tag:yaml.org,2002:seq",
        resolve(seq2, onError) {
          if (!isSeq(seq2))
            onError("Expected a sequence for this tag");
          return seq2;
        },
        createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/common/string.js
  var string;
  var init_string = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/common/string.js"() {
      init_stringifyString();
      string = {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify(item, ctx, onComment, onChompKeep) {
          ctx = Object.assign({ actualString: true }, ctx);
          return stringifyString(item, ctx, onComment, onChompKeep);
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/common/null.js
  var nullTag;
  var init_null = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/common/null.js"() {
      init_Scalar();
      nullTag = {
        identify: (value) => value == null,
        createNode: () => new Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^(?:~|[Nn]ull|NULL)?$/,
        resolve: () => new Scalar(null),
        stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/core/bool.js
  var boolTag;
  var init_bool = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/core/bool.js"() {
      init_Scalar();
      boolTag = {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
        resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
        stringify({ source, value }, ctx) {
          if (source && boolTag.test.test(source)) {
            const sv = source[0] === "t" || source[0] === "T";
            if (value === sv)
              return source;
          }
          return value ? ctx.options.trueStr : ctx.options.falseStr;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyNumber.js
  function stringifyNumber({ format: format3, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    const num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
    if (!format3 && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }
  var init_stringifyNumber = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyNumber.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/core/float.js
  var floatNaN, floatExp, float;
  var init_float = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/core/float.js"() {
      init_Scalar();
      init_stringifyNumber();
      floatNaN = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
        resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
        stringify: stringifyNumber
      };
      floatExp = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        format: "EXP",
        test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
        resolve: (str) => parseFloat(str),
        stringify(node) {
          const num = Number(node.value);
          return isFinite(num) ? num.toExponential() : stringifyNumber(node);
        }
      };
      float = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
        resolve(str) {
          const node = new Scalar(parseFloat(str));
          const dot = str.indexOf(".");
          if (dot !== -1 && str[str.length - 1] === "0")
            node.minFractionDigits = str.length - dot - 1;
          return node;
        },
        stringify: stringifyNumber
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/core/int.js
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber(node);
  }
  var intIdentify, intResolve, intOct, int, intHex;
  var init_int = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/core/int.js"() {
      init_stringifyNumber();
      intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
      intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
      intOct = {
        identify: (value) => intIdentify(value) && value >= 0,
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "OCT",
        test: /^0o[0-7]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
        stringify: (node) => intStringify(node, 8, "0o")
      };
      int = {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^[-+]?[0-9]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
        stringify: stringifyNumber
      };
      intHex = {
        identify: (value) => intIdentify(value) && value >= 0,
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "HEX",
        test: /^0x[0-9a-fA-F]+$/,
        resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
        stringify: (node) => intStringify(node, 16, "0x")
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/core/schema.js
  var schema;
  var init_schema = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/core/schema.js"() {
      init_map();
      init_null();
      init_seq();
      init_string();
      init_bool();
      init_float();
      init_int();
      schema = [
        map,
        seq,
        string,
        nullTag,
        boolTag,
        intOct,
        int,
        intHex,
        floatNaN,
        floatExp,
        float
      ];
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/json/schema.js
  function intIdentify2(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON, jsonScalars, jsonError, schema2;
  var init_schema2 = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/json/schema.js"() {
      init_Scalar();
      init_map();
      init_seq();
      stringifyJSON = ({ value }) => JSON.stringify(value);
      jsonScalars = [
        {
          identify: (value) => typeof value === "string",
          default: true,
          tag: "tag:yaml.org,2002:str",
          resolve: (str) => str,
          stringify: stringifyJSON
        },
        {
          identify: (value) => value == null,
          createNode: () => new Scalar(null),
          default: true,
          tag: "tag:yaml.org,2002:null",
          test: /^null$/,
          resolve: () => null,
          stringify: stringifyJSON
        },
        {
          identify: (value) => typeof value === "boolean",
          default: true,
          tag: "tag:yaml.org,2002:bool",
          test: /^true$|^false$/,
          resolve: (str) => str === "true",
          stringify: stringifyJSON
        },
        {
          identify: intIdentify2,
          default: true,
          tag: "tag:yaml.org,2002:int",
          test: /^-?(?:0|[1-9][0-9]*)$/,
          resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
          stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
        },
        {
          identify: (value) => typeof value === "number",
          default: true,
          tag: "tag:yaml.org,2002:float",
          test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
          resolve: (str) => parseFloat(str),
          stringify: stringifyJSON
        }
      ];
      jsonError = {
        default: true,
        tag: "",
        test: /^/,
        resolve(str, onError) {
          onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
          return str;
        }
      };
      schema2 = [map, seq].concat(jsonScalars, jsonError);
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
  var binary;
  var init_binary = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js"() {
      init_Scalar();
      init_stringifyString();
      binary = {
        identify: (value) => value instanceof Uint8Array,
        // Buffer inherits from Uint8Array
        default: false,
        tag: "tag:yaml.org,2002:binary",
        /**
         * Returns a Buffer in node and an Uint8Array in browsers
         *
         * To use the resulting buffer as an image, you'll want to do something like:
         *
         *   const blob = new Blob([buffer], { type: 'image/jpeg' })
         *   document.querySelector('#photo').src = URL.createObjectURL(blob)
         */
        resolve(src, onError) {
          if (typeof atob === "function") {
            const str = atob(src.replace(/[\n\r]/g, ""));
            const buffer = new Uint8Array(str.length);
            for (let i = 0; i < str.length; ++i)
              buffer[i] = str.charCodeAt(i);
            return buffer;
          } else {
            onError("This environment does not support reading binary tags; either Buffer or atob is required");
            return src;
          }
        },
        stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
          if (!value)
            return "";
          const buf = value;
          let str;
          if (typeof btoa === "function") {
            let s = "";
            for (let i = 0; i < buf.length; ++i)
              s += String.fromCharCode(buf[i]);
            str = btoa(s);
          } else {
            throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
          }
          type ?? (type = Scalar.BLOCK_LITERAL);
          if (type !== Scalar.QUOTE_DOUBLE) {
            const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
            const n = Math.ceil(str.length / lineWidth);
            const lines = new Array(n);
            for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
              lines[i] = str.substr(o, lineWidth);
            }
            str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
          }
          return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
  function resolvePairs(seq2, onError) {
    if (isSeq(seq2)) {
      for (let i = 0; i < seq2.items.length; ++i) {
        let item = seq2.items[i];
        if (isPair(item))
          continue;
        else if (isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          const pair = item.items[0] || new Pair(new Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            const cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq2.items[i] = isPair(item) ? item : new Pair(item);
      }
    } else
      onError("Expected a sequence for this tag");
    return seq2;
  }
  function createPairs(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const pairs2 = new YAMLSeq(schema4);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i++), it);
        let key, value;
        if (Array.isArray(it)) {
          if (it.length === 2) {
            key = it[0];
            value = it[1];
          } else
            throw new TypeError(`Expected [key, value] tuple: ${it}`);
        } else if (it && it instanceof Object) {
          const keys = Object.keys(it);
          if (keys.length === 1) {
            key = keys[0];
            value = it[key];
          } else {
            throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
          }
        } else {
          key = it;
        }
        pairs2.items.push(createPair(key, value, ctx));
      }
    return pairs2;
  }
  var pairs;
  var init_pairs = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js"() {
      init_identity();
      init_Pair();
      init_Scalar();
      init_YAMLSeq();
      pairs = {
        collection: "seq",
        default: false,
        tag: "tag:yaml.org,2002:pairs",
        resolve: resolvePairs,
        createNode: createPairs
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
  var YAMLOMap, omap;
  var init_omap = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js"() {
      init_identity();
      init_toJS();
      init_YAMLMap();
      init_YAMLSeq();
      init_pairs();
      YAMLOMap = class _YAMLOMap extends YAMLSeq {
        constructor() {
          super();
          this.add = YAMLMap.prototype.add.bind(this);
          this.delete = YAMLMap.prototype.delete.bind(this);
          this.get = YAMLMap.prototype.get.bind(this);
          this.has = YAMLMap.prototype.has.bind(this);
          this.set = YAMLMap.prototype.set.bind(this);
          this.tag = _YAMLOMap.tag;
        }
        /**
         * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
         * but TypeScript won't allow widening the signature of a child method.
         */
        toJSON(_, ctx) {
          if (!ctx)
            return super.toJSON(_);
          const map2 = /* @__PURE__ */ new Map();
          if (ctx?.onCreate)
            ctx.onCreate(map2);
          for (const pair of this.items) {
            let key, value;
            if (isPair(pair)) {
              key = toJS(pair.key, "", ctx);
              value = toJS(pair.value, key, ctx);
            } else {
              key = toJS(pair, "", ctx);
            }
            if (map2.has(key))
              throw new Error("Ordered maps must not include duplicate keys");
            map2.set(key, value);
          }
          return map2;
        }
        static from(schema4, iterable, ctx) {
          const pairs2 = createPairs(schema4, iterable, ctx);
          const omap2 = new this();
          omap2.items = pairs2.items;
          return omap2;
        }
      };
      YAMLOMap.tag = "tag:yaml.org,2002:omap";
      omap = {
        collection: "seq",
        identify: (value) => value instanceof Map,
        nodeClass: YAMLOMap,
        default: false,
        tag: "tag:yaml.org,2002:omap",
        resolve(seq2, onError) {
          const pairs2 = resolvePairs(seq2, onError);
          const seenKeys = [];
          for (const { key } of pairs2.items) {
            if (isScalar(key)) {
              if (seenKeys.includes(key.value)) {
                onError(`Ordered maps must not include duplicate keys: ${key.value}`);
              } else {
                seenKeys.push(key.value);
              }
            }
          }
          return Object.assign(new YAMLOMap(), pairs2);
        },
        createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
  function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag, falseTag;
  var init_bool2 = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js"() {
      init_Scalar();
      trueTag = {
        identify: (value) => value === true,
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
        resolve: () => new Scalar(true),
        stringify: boolStringify
      };
      falseTag = {
        identify: (value) => value === false,
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
        resolve: () => new Scalar(false),
        stringify: boolStringify
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
  var floatNaN2, floatExp2, float2;
  var init_float2 = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/float.js"() {
      init_Scalar();
      init_stringifyNumber();
      floatNaN2 = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
        resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
        stringify: stringifyNumber
      };
      floatExp2 = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        format: "EXP",
        test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
        resolve: (str) => parseFloat(str.replace(/_/g, "")),
        stringify(node) {
          const num = Number(node.value);
          return isFinite(num) ? num.toExponential() : stringifyNumber(node);
        }
      };
      float2 = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
        resolve(str) {
          const node = new Scalar(parseFloat(str.replace(/_/g, "")));
          const dot = str.indexOf(".");
          if (dot !== -1) {
            const f = str.substring(dot + 1).replace(/_/g, "");
            if (f[f.length - 1] === "0")
              node.minFractionDigits = f.length;
          }
          return node;
        },
        stringify: stringifyNumber
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
  function intResolve2(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === "-" || sign === "+")
      offset += 1;
    str = str.substring(offset).replace(/_/g, "");
    if (intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n2 = BigInt(str);
      return sign === "-" ? BigInt(-1) * n2 : n2;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify2(node, radix, prefix) {
    const { value } = node;
    if (intIdentify3(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber(node);
  }
  var intIdentify3, intBin, intOct2, int2, intHex2;
  var init_int2 = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/int.js"() {
      init_stringifyNumber();
      intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
      intBin = {
        identify: intIdentify3,
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "BIN",
        test: /^[-+]?0b[0-1_]+$/,
        resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
        stringify: (node) => intStringify2(node, 2, "0b")
      };
      intOct2 = {
        identify: intIdentify3,
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "OCT",
        test: /^[-+]?0[0-7_]+$/,
        resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
        stringify: (node) => intStringify2(node, 8, "0")
      };
      int2 = {
        identify: intIdentify3,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^[-+]?[0-9][0-9_]*$/,
        resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
        stringify: stringifyNumber
      };
      intHex2 = {
        identify: intIdentify3,
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "HEX",
        test: /^[-+]?0x[0-9a-fA-F_]+$/,
        resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
        stringify: (node) => intStringify2(node, 16, "0x")
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
  var YAMLSet, set;
  var init_set = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/set.js"() {
      init_identity();
      init_Pair();
      init_YAMLMap();
      YAMLSet = class _YAMLSet extends YAMLMap {
        constructor(schema4) {
          super(schema4);
          this.tag = _YAMLSet.tag;
        }
        add(key) {
          let pair;
          if (isPair(key))
            pair = key;
          else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
            pair = new Pair(key.key, null);
          else
            pair = new Pair(key, null);
          const prev = findPair(this.items, pair.key);
          if (!prev)
            this.items.push(pair);
        }
        /**
         * If `keepPair` is `true`, returns the Pair matching `key`.
         * Otherwise, returns the value of that Pair's key.
         */
        get(key, keepPair) {
          const pair = findPair(this.items, key);
          return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
        }
        set(key, value) {
          if (typeof value !== "boolean")
            throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
          const prev = findPair(this.items, key);
          if (prev && !value) {
            this.items.splice(this.items.indexOf(prev), 1);
          } else if (!prev && value) {
            this.items.push(new Pair(key));
          }
        }
        toJSON(_, ctx) {
          return super.toJSON(_, ctx, Set);
        }
        toString(ctx, onComment, onChompKeep) {
          if (!ctx)
            return JSON.stringify(this);
          if (this.hasAllNullValues(true))
            return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
          else
            throw new Error("Set items must all have null values");
        }
        static from(schema4, iterable, ctx) {
          const { replacer } = ctx;
          const set2 = new this(schema4);
          if (iterable && Symbol.iterator in Object(iterable))
            for (let value of iterable) {
              if (typeof replacer === "function")
                value = replacer.call(iterable, value, value);
              set2.items.push(createPair(value, null, ctx));
            }
          return set2;
        }
      };
      YAMLSet.tag = "tag:yaml.org,2002:set";
      set = {
        collection: "map",
        identify: (value) => value instanceof Set,
        nodeClass: YAMLSet,
        default: false,
        tag: "tag:yaml.org,2002:set",
        createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
        resolve(map2, onError) {
          if (isMap(map2)) {
            if (map2.hasAllNullValues(true))
              return Object.assign(new YAMLSet(), map2);
            else
              onError("Set items must all have null values");
          } else
            onError("Expected a mapping for this tag");
          return map2;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
  function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
    return sign === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === "bigint")
      num = (n) => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber(node);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = (value - parts[0]) / _60;
      parts.unshift(value % _60);
      if (value >= 60) {
        value = (value - parts[0]) / _60;
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
  }
  var intTime, floatTime, timestamp;
  var init_timestamp = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js"() {
      init_stringifyNumber();
      intTime = {
        identify: (value) => typeof value === "bigint" || Number.isInteger(value),
        default: true,
        tag: "tag:yaml.org,2002:int",
        format: "TIME",
        test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
        resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
        stringify: stringifySexagesimal
      };
      floatTime = {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        format: "TIME",
        test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
        resolve: (str) => parseSexagesimal(str, false),
        stringify: stringifySexagesimal
      };
      timestamp = {
        identify: (value) => value instanceof Date,
        default: true,
        tag: "tag:yaml.org,2002:timestamp",
        // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
        // may be omitted altogether, resulting in a date format. In such a case, the time part is
        // assumed to be 00:00:00Z (start of day, UTC).
        test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
        resolve(str) {
          const match = str.match(timestamp.test);
          if (!match)
            throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
          const [, year, month, day, hour, minute, second] = match.map(Number);
          const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
          let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
          const tz = match[8];
          if (tz && tz !== "Z") {
            let d = parseSexagesimal(tz, false);
            if (Math.abs(d) < 30)
              d *= 60;
            date -= 6e4 * d;
          }
          return new Date(date);
        },
        stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
  var schema3;
  var init_schema3 = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js"() {
      init_map();
      init_null();
      init_seq();
      init_string();
      init_binary();
      init_bool2();
      init_float2();
      init_int2();
      init_merge();
      init_omap();
      init_pairs();
      init_set();
      init_timestamp();
      schema3 = [
        map,
        seq,
        string,
        nullTag,
        trueTag,
        falseTag,
        intBin,
        intOct2,
        int2,
        intHex2,
        floatNaN2,
        floatExp2,
        float2,
        binary,
        merge,
        omap,
        pairs,
        set,
        intTime,
        floatTime,
        timestamp
      ];
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/tags.js
  function getTags(customTags, schemaName, addMergeTag) {
    const schemaTags = schemas.get(schemaName);
    if (schemaTags && !customTags) {
      return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
    }
    let tags = schemaTags;
    if (!tags) {
      if (Array.isArray(customTags))
        tags = [];
      else {
        const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
      }
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags = tags.concat(tag);
    } else if (typeof customTags === "function") {
      tags = customTags(tags.slice());
    }
    if (addMergeTag)
      tags = tags.concat(merge);
    return tags.reduce((tags2, tag) => {
      const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
      if (!tagObj) {
        const tagName = JSON.stringify(tag);
        const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
      }
      if (!tags2.includes(tagObj))
        tags2.push(tagObj);
      return tags2;
    }, []);
  }
  var schemas, tagsByName, coreKnownTags;
  var init_tags = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/tags.js"() {
      init_map();
      init_null();
      init_seq();
      init_string();
      init_bool();
      init_float();
      init_int();
      init_schema();
      init_schema2();
      init_binary();
      init_merge();
      init_omap();
      init_pairs();
      init_schema3();
      init_set();
      init_timestamp();
      schemas = /* @__PURE__ */ new Map([
        ["core", schema],
        ["failsafe", [map, seq, string]],
        ["json", schema2],
        ["yaml11", schema3],
        ["yaml-1.1", schema3]
      ]);
      tagsByName = {
        binary,
        bool: boolTag,
        float,
        floatExp,
        floatNaN,
        floatTime,
        int,
        intHex,
        intOct,
        intTime,
        map,
        merge,
        null: nullTag,
        omap,
        pairs,
        seq,
        set,
        timestamp
      };
      coreKnownTags = {
        "tag:yaml.org,2002:binary": binary,
        "tag:yaml.org,2002:merge": merge,
        "tag:yaml.org,2002:omap": omap,
        "tag:yaml.org,2002:pairs": pairs,
        "tag:yaml.org,2002:set": set,
        "tag:yaml.org,2002:timestamp": timestamp
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/schema/Schema.js
  var sortMapEntriesByKey, Schema;
  var init_Schema = __esm({
    "browser-config/node_modules/yaml/browser/dist/schema/Schema.js"() {
      init_identity();
      init_map();
      init_seq();
      init_string();
      init_tags();
      sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
      Schema = class _Schema {
        constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
          this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
          this.name = typeof schema4 === "string" && schema4 || "core";
          this.knownTags = resolveKnownTags ? coreKnownTags : {};
          this.tags = getTags(customTags, this.name, merge2);
          this.toStringOptions = toStringDefaults ?? null;
          Object.defineProperty(this, MAP, { value: map });
          Object.defineProperty(this, SCALAR, { value: string });
          Object.defineProperty(this, SEQ, { value: seq });
          this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
        }
        clone() {
          const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
          copy.tags = this.tags.slice();
          return copy;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/stringify/stringifyDocument.js
  function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
      const dir = doc.directives.toString(doc);
      if (dir) {
        lines.push(dir);
        hasDirectives = true;
      } else if (doc.directives.docStart)
        hasDirectives = true;
    }
    if (hasDirectives)
      lines.push("---");
    const ctx = createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      const cs = commentString(doc.commentBefore);
      lines.unshift(indentComment(cs, ""));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
      if (isNode(doc.contents)) {
        if (doc.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc.contents.commentBefore) {
          const cs = commentString(doc.contents.commentBefore);
          lines.push(indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc.comment;
        contentComment = doc.contents.comment;
      }
      const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
      let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body += lineComment(body, "", commentString(contentComment));
      if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
        lines[lines.length - 1] = `--- ${body}`;
      } else
        lines.push(body);
    } else {
      lines.push(stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
      if (doc.comment) {
        const cs = commentString(doc.comment);
        if (cs.includes("\n")) {
          lines.push("...");
          lines.push(indentComment(cs, ""));
        } else {
          lines.push(`... ${cs}`);
        }
      } else {
        lines.push("...");
      }
    } else {
      let dc = doc.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(indentComment(commentString(dc), ""));
      }
    }
    return lines.join("\n") + "\n";
  }
  var init_stringifyDocument = __esm({
    "browser-config/node_modules/yaml/browser/dist/stringify/stringifyDocument.js"() {
      init_identity();
      init_stringify();
      init_stringifyComment();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/doc/Document.js
  function assertCollection(contents) {
    if (isCollection(contents))
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }
  var Document;
  var init_Document = __esm({
    "browser-config/node_modules/yaml/browser/dist/doc/Document.js"() {
      init_Alias();
      init_Collection();
      init_identity();
      init_Pair();
      init_toJS();
      init_Schema();
      init_stringifyDocument();
      init_anchors();
      init_applyReviver();
      init_createNode();
      init_directives();
      Document = class _Document {
        constructor(value, replacer, options) {
          this.commentBefore = null;
          this.comment = null;
          this.errors = [];
          this.warnings = [];
          Object.defineProperty(this, NODE_TYPE, { value: DOC });
          let _replacer = null;
          if (typeof replacer === "function" || Array.isArray(replacer)) {
            _replacer = replacer;
          } else if (options === void 0 && replacer) {
            options = replacer;
            replacer = void 0;
          }
          const opt = Object.assign({
            intAsBigInt: false,
            keepSourceTokens: false,
            logLevel: "warn",
            prettyErrors: true,
            strict: true,
            stringKeys: false,
            uniqueKeys: true,
            version: "1.2"
          }, options);
          this.options = opt;
          let { version } = opt;
          if (options?._directives) {
            this.directives = options._directives.atDocument();
            if (this.directives.yaml.explicit)
              version = this.directives.yaml.version;
          } else
            this.directives = new Directives({ version });
          this.setSchema(version, options);
          this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
        }
        /**
         * Create a deep copy of this Document and its contents.
         *
         * Custom Node values that inherit from `Object` still refer to their original instances.
         */
        clone() {
          const copy = Object.create(_Document.prototype, {
            [NODE_TYPE]: { value: DOC }
          });
          copy.commentBefore = this.commentBefore;
          copy.comment = this.comment;
          copy.errors = this.errors.slice();
          copy.warnings = this.warnings.slice();
          copy.options = Object.assign({}, this.options);
          if (this.directives)
            copy.directives = this.directives.clone();
          copy.schema = this.schema.clone();
          copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
          if (this.range)
            copy.range = this.range.slice();
          return copy;
        }
        /** Adds a value to the document. */
        add(value) {
          if (assertCollection(this.contents))
            this.contents.add(value);
        }
        /** Adds a value to the document. */
        addIn(path, value) {
          if (assertCollection(this.contents))
            this.contents.addIn(path, value);
        }
        /**
         * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
         *
         * If `node` already has an anchor, `name` is ignored.
         * Otherwise, the `node.anchor` value will be set to `name`,
         * or if an anchor with that name is already present in the document,
         * `name` will be used as a prefix for a new unique anchor.
         * If `name` is undefined, the generated anchor will use 'a' as a prefix.
         */
        createAlias(node, name) {
          if (!node.anchor) {
            const prev = anchorNames(this);
            node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
          }
          return new Alias(node.anchor);
        }
        createNode(value, replacer, options) {
          let _replacer = void 0;
          if (typeof replacer === "function") {
            value = replacer.call({ "": value }, "", value);
            _replacer = replacer;
          } else if (Array.isArray(replacer)) {
            const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
            const asStr = replacer.filter(keyToStr).map(String);
            if (asStr.length > 0)
              replacer = replacer.concat(asStr);
            _replacer = replacer;
          } else if (options === void 0 && replacer) {
            options = replacer;
            replacer = void 0;
          }
          const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
          const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
            this,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            anchorPrefix || "a"
          );
          const ctx = {
            aliasDuplicateObjects: aliasDuplicateObjects ?? true,
            keepUndefined: keepUndefined ?? false,
            onAnchor,
            onTagObj,
            replacer: _replacer,
            schema: this.schema,
            sourceObjects
          };
          const node = createNode(value, tag, ctx);
          if (flow && isCollection(node))
            node.flow = true;
          setAnchors();
          return node;
        }
        /**
         * Convert a key and a value into a `Pair` using the current schema,
         * recursively wrapping all values as `Scalar` or `Collection` nodes.
         */
        createPair(key, value, options = {}) {
          const k = this.createNode(key, null, options);
          const v = this.createNode(value, null, options);
          return new Pair(k, v);
        }
        /**
         * Removes a value from the document.
         * @returns `true` if the item was found and removed.
         */
        delete(key) {
          return assertCollection(this.contents) ? this.contents.delete(key) : false;
        }
        /**
         * Removes a value from the document.
         * @returns `true` if the item was found and removed.
         */
        deleteIn(path) {
          if (isEmptyPath(path)) {
            if (this.contents == null)
              return false;
            this.contents = null;
            return true;
          }
          return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
        }
        /**
         * Returns item at `key`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        get(key, keepScalar) {
          return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
        }
        /**
         * Returns item at `path`, or `undefined` if not found. By default unwraps
         * scalar values from their surrounding node; to disable set `keepScalar` to
         * `true` (collections are always returned intact).
         */
        getIn(path, keepScalar) {
          if (isEmptyPath(path))
            return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
          return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
        }
        /**
         * Checks if the document includes a value with the key `key`.
         */
        has(key) {
          return isCollection(this.contents) ? this.contents.has(key) : false;
        }
        /**
         * Checks if the document includes a value at `path`.
         */
        hasIn(path) {
          if (isEmptyPath(path))
            return this.contents !== void 0;
          return isCollection(this.contents) ? this.contents.hasIn(path) : false;
        }
        /**
         * Sets a value in this document. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        set(key, value) {
          if (this.contents == null) {
            this.contents = collectionFromPath(this.schema, [key], value);
          } else if (assertCollection(this.contents)) {
            this.contents.set(key, value);
          }
        }
        /**
         * Sets a value in this document. For `!!set`, `value` needs to be a
         * boolean to add/remove the item from the set.
         */
        setIn(path, value) {
          if (isEmptyPath(path)) {
            this.contents = value;
          } else if (this.contents == null) {
            this.contents = collectionFromPath(this.schema, Array.from(path), value);
          } else if (assertCollection(this.contents)) {
            this.contents.setIn(path, value);
          }
        }
        /**
         * Change the YAML version and schema used by the document.
         * A `null` version disables support for directives, explicit tags, anchors, and aliases.
         * It also requires the `schema` option to be given as a `Schema` instance value.
         *
         * Overrides all previously set schema options.
         */
        setSchema(version, options = {}) {
          if (typeof version === "number")
            version = String(version);
          let opt;
          switch (version) {
            case "1.1":
              if (this.directives)
                this.directives.yaml.version = "1.1";
              else
                this.directives = new Directives({ version: "1.1" });
              opt = { resolveKnownTags: false, schema: "yaml-1.1" };
              break;
            case "1.2":
            case "next":
              if (this.directives)
                this.directives.yaml.version = version;
              else
                this.directives = new Directives({ version });
              opt = { resolveKnownTags: true, schema: "core" };
              break;
            case null:
              if (this.directives)
                delete this.directives;
              opt = null;
              break;
            default: {
              const sv = JSON.stringify(version);
              throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
            }
          }
          if (options.schema instanceof Object)
            this.schema = options.schema;
          else if (opt)
            this.schema = new Schema(Object.assign(opt, options));
          else
            throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
        }
        // json & jsonArg are only used from toJSON()
        toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
          const ctx = {
            anchors: /* @__PURE__ */ new Map(),
            doc: this,
            keep: !json,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
          };
          const res = toJS(this.contents, jsonArg ?? "", ctx);
          if (typeof onAnchor === "function")
            for (const { count, res: res2 } of ctx.anchors.values())
              onAnchor(res2, count);
          return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
        }
        /**
         * A JSON representation of the document `contents`.
         *
         * @param jsonArg Used by `JSON.stringify` to indicate the array index or
         *   property name.
         */
        toJSON(jsonArg, onAnchor) {
          return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
        }
        /** A YAML representation of the document. */
        toString(options = {}) {
          if (this.errors.length > 0)
            throw new Error("Document with errors cannot be stringified");
          if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
            const s = JSON.stringify(options.indent);
            throw new Error(`"indent" option must be a positive integer, not ${s}`);
          }
          return stringifyDocument(this, options);
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/errors.js
  var YAMLError, YAMLParseError, YAMLWarning, prettifyError;
  var init_errors = __esm({
    "browser-config/node_modules/yaml/browser/dist/errors.js"() {
      YAMLError = class extends Error {
        constructor(name, pos, code, message) {
          super();
          this.name = name;
          this.code = code;
          this.message = message;
          this.pos = pos;
        }
      };
      YAMLParseError = class extends YAMLError {
        constructor(pos, code, message) {
          super("YAMLParseError", pos, code, message);
        }
      };
      YAMLWarning = class extends YAMLError {
        constructor(pos, code, message) {
          super("YAMLWarning", pos, code, message);
        }
      };
      prettifyError = (src, lc) => (error) => {
        if (error.pos[0] === -1)
          return;
        error.linePos = error.pos.map((pos) => lc.linePos(pos));
        const { line, col } = error.linePos[0];
        error.message += ` at line ${line}, column ${col}`;
        let ci = col - 1;
        let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
        if (ci >= 60 && lineStr.length > 80) {
          const trimStart = Math.min(ci - 39, lineStr.length - 79);
          lineStr = "\u2026" + lineStr.substring(trimStart);
          ci -= trimStart - 1;
        }
        if (lineStr.length > 80)
          lineStr = lineStr.substring(0, 79) + "\u2026";
        if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
          let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
          if (prev.length > 80)
            prev = prev.substring(0, 79) + "\u2026\n";
          lineStr = prev + lineStr;
        }
        if (/[^ ]/.test(lineStr)) {
          let count = 1;
          const end = error.linePos[1];
          if (end?.line === line && end.col > col) {
            count = Math.max(1, Math.min(end.col - col, 80 - ci));
          }
          const pointer = " ".repeat(ci) + "^".repeat(count);
          error.message += `:

${lineStr}
${pointer}
`;
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-props.js
  function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = "";
    let commentSep = "";
    let hasNewline = false;
    let reqSpace = false;
    let tab = null;
    let anchor = null;
    let tag = null;
    let newlineAfterProp = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = false;
      }
      if (tab) {
        if (atNewline && token.type !== "comment" && token.type !== "newline") {
          onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        }
        tab = null;
      }
      switch (token.type) {
        case "space":
          if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
            tab = token;
          }
          hasSpace = true;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = token.source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += commentSep + cb;
          commentSep = "";
          atNewline = false;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment)
              comment += token.source;
            else if (!found || indicator !== "seq-item-ind")
              spaceBefore = true;
          } else
            commentSep += token.source;
          atNewline = true;
          hasNewline = true;
          if (anchor || tag)
            newlineAfterProp = token;
          hasSpace = true;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
          anchor = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
          found = token;
          atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
          hasSpace = false;
          break;
        case "comma":
          if (flow) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
            comma = token;
            atNewline = false;
            hasSpace = false;
            break;
          }
        // else fallthrough
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
          atNewline = false;
          hasSpace = false;
      }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    }
    if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
      onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma,
      found,
      spaceBefore,
      comment,
      hasNewline,
      anchor,
      tag,
      newlineAfterProp,
      end,
      start: start ?? end
    };
  }
  var init_resolve_props = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-props.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/util-contains-newline.js
  function containsNewline(key) {
    if (!key)
      return null;
    switch (key.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key.source.includes("\n"))
          return true;
        if (key.end) {
          for (const st of key.end)
            if (st.type === "newline")
              return true;
        }
        return false;
      case "flow-collection":
        for (const it of key.items) {
          for (const st of it.start)
            if (st.type === "newline")
              return true;
          if (it.sep) {
            for (const st of it.sep)
              if (st.type === "newline")
                return true;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return true;
        }
        return false;
      default:
        return true;
    }
  }
  var init_util_contains_newline = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/util-contains-newline.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
  function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === "flow-collection") {
      const end = fc.end[0];
      if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
        const msg = "Flow end indicator should be more indented than parent";
        onError(end, "BAD_INDENT", msg, true);
      }
    }
  }
  var init_util_flow_indent_check = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/util-flow-indent-check.js"() {
      init_util_contains_newline();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/util-map-includes.js
  function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
      return false;
    const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
    return items.some((pair) => isEqual(pair.key, search));
  }
  var init_util_map_includes = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/util-map-includes.js"() {
      init_identity();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-block-map.js
  function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLMap;
    const map2 = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
      const { start, key, sep, value } = collItem;
      const keyProps = resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: bm.indent,
        startOnNewline: true
      });
      const implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key) {
          if (key.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key && key.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep) {
          commentEnd = keyProps.end;
          if (keyProps.comment) {
            if (map2.comment)
              map2.comment += "\n" + keyProps.comment;
            else
              map2.comment = keyProps.comment;
          }
          continue;
        }
        if (keyProps.newlineAfterProp || containsNewline(key)) {
          onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        }
      } else if (keyProps.found?.indent !== bm.indent) {
        onError(offset, "BAD_INDENT", startColMsg);
      }
      ctx.atKey = true;
      const keyStart = keyProps.end;
      const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, key, onError);
      ctx.atKey = false;
      if (mapIncludes(ctx, map2.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      const valueProps = resolveProps(sep ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: bm.indent,
        startOnNewline: !key || key.type === "block-scalar"
      });
      offset = valueProps.end;
      if (valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
        if (ctx.schema.compat)
          flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map2.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map2.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    map2.range = [bm.offset, offset, commentEnd ?? offset];
    return map2;
  }
  var startColMsg;
  var init_resolve_block_map = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-block-map.js"() {
      init_Pair();
      init_YAMLMap();
      init_resolve_props();
      init_util_contains_newline();
      init_util_flow_indent_check();
      init_util_map_includes();
      startColMsg = "All mapping items must start at the same column";
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-block-seq.js
  function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLSeq;
    const seq2 = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
      const props = resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        parentIndent: bs.indent,
        startOnNewline: true
      });
      if (!props.found) {
        if (props.anchor || props.tag || value) {
          if (value?.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        } else {
          commentEnd = props.end;
          if (props.comment)
            seq2.comment = props.comment;
          continue;
        }
      }
      const node = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bs.indent, value, onError);
      offset = node.range[2];
      seq2.items.push(node);
    }
    seq2.range = [bs.offset, offset, commentEnd ?? offset];
    return seq2;
  }
  var init_resolve_block_seq = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-block-seq.js"() {
      init_YAMLSeq();
      init_resolve_props();
      init_util_flow_indent_check();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-end.js
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment = "";
    if (end) {
      let hasSpace = false;
      let sep = "";
      for (const token of end) {
        const { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = true;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += sep + cb;
            sep = "";
            break;
          }
          case "newline":
            if (comment)
              sep += source;
            hasSpace = true;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment, offset };
  }
  var init_resolve_end = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-end.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
  function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
    const isMap2 = fc.start.source === "{";
    const fcName = isMap2 ? "flow map" : "flow sequence";
    const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
    const coll = new NodeClass(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0; i < fc.items.length; ++i) {
      const collItem = fc.items[i];
      const { start, key, sep, value } = collItem;
      const props = resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep && !value) {
          if (i === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment) {
            if (coll.comment)
              coll.comment += "\n" + props.comment;
            else
              coll.comment = props.comment;
          }
          offset = props.end;
          continue;
        }
        if (!isMap2 && ctx.options.strict && containsNewline(key))
          onError(
            key,
            // checked by containsNewline()
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys of flow sequence pairs need to be on a single line"
          );
      }
      if (i === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop: for (const st of start) {
            switch (st.type) {
              case "comma":
              case "space":
                break;
              case "comment":
                prevItemComment = st.source.substring(1);
                break loop;
              default:
                break loop;
            }
          }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += "\n" + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap2 && !sep && !props.found) {
        const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
        coll.items.push(valueNode);
        offset = valueNode.range[2];
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        ctx.atKey = true;
        const keyStart = props.end;
        const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
        if (isBlock(key))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        ctx.atKey = false;
        const valueProps = resolveProps(sep ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (valueProps.found) {
          if (!isMap2 && !props.found && ctx.options.strict) {
            if (sep)
              for (const st of sep) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value) {
          if ("source" in value && value.source?.[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap2) {
          const map2 = coll;
          if (mapIncludes(ctx, map2.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map2.items.push(pair);
        } else {
          const map2 = new YAMLMap(ctx.schema);
          map2.flow = true;
          map2.items.push(pair);
          const endRange = (valueNode ?? keyNode).range;
          map2.range = [keyNode.range[0], endRange[1], endRange[2]];
          coll.items.push(map2);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    const expectedEnd = isMap2 ? "}" : "]";
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce?.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      const name = fcName[0].toUpperCase() + fcName.substring(1);
      const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
      if (ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment) {
        if (coll.comment)
          coll.comment += "\n" + end.comment;
        else
          coll.comment = end.comment;
      }
      coll.range = [fc.offset, cePos, end.offset];
    } else {
      coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
  }
  var blockMsg, isBlock;
  var init_resolve_flow_collection = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-flow-collection.js"() {
      init_identity();
      init_Pair();
      init_YAMLMap();
      init_YAMLSeq();
      init_resolve_end();
      init_resolve_props();
      init_util_contains_newline();
      init_util_map_includes();
      blockMsg = "Block collections are not allowed within flow collections";
      isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/compose-collection.js
  function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
    const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
    const Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName) {
      coll.tag = Coll.tagName;
      return coll;
    }
    if (tagName)
      coll.tag = tagName;
    return coll;
  }
  function composeCollection(CN2, ctx, token, props, onError) {
    const tagToken = props.tag;
    const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (token.type === "block-seq") {
      const { anchor, newlineAfterProp: nl } = props;
      const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
      if (lastProp && (!nl || nl.offset < lastProp.offset)) {
        const message = "Missing newline after block sequence props";
        onError(lastProp, "MISSING_CHAR", message);
      }
    }
    const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
    if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
    if (!tag) {
      const kt = ctx.schema.knownTags[tagName];
      if (kt?.collection === expType) {
        ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
        tag = kt;
      } else {
        if (kt) {
          onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
        } else {
          onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
        }
        return resolveCollection(CN2, ctx, token, onError, tagName);
      }
    }
    const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
    const node = isNode(res) ? res : new Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
      node.format = tag.format;
    return node;
  }
  var init_compose_collection = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/compose-collection.js"() {
      init_identity();
      init_Scalar();
      init_YAMLMap();
      init_YAMLSeq();
      init_resolve_block_map();
      init_resolve_block_seq();
      init_resolve_flow_collection();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
  function resolveBlockScalar(ctx, scalar, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
      const content = lines[i][1];
      if (content === "" || content === "\r")
        chompStart = i;
      else
        break;
    }
    if (chompStart === 0) {
      const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
      let end2 = start + header.length;
      if (scalar.source)
        end2 += scalar.source.length;
      return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
    }
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
      const [indent, content] = lines[i];
      if (content === "" || content === "\r") {
        if (header.indent === 0 && indent.length > trimIndent)
          trimIndent = indent.length;
      } else {
        if (indent.length < trimIndent) {
          const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
          onError(offset + indent.length, "MISSING_CHAR", message);
        }
        if (header.indent === 0)
          trimIndent = indent.length;
        contentStart = i;
        if (trimIndent === 0 && !ctx.atRoot) {
          const message = "Block scalar values in collections must be indented";
          onError(offset, "BAD_INDENT", message);
        }
        break;
      }
      offset += indent.length + content.length + 1;
    }
    for (let i = lines.length - 1; i >= chompStart; --i) {
      if (lines[i][0].length > trimIndent)
        chompStart = i + 1;
    }
    let value = "";
    let sep = "";
    let prevMoreIndented = false;
    for (let i = 0; i < contentStart; ++i)
      value += lines[i][0].slice(trimIndent) + "\n";
    for (let i = contentStart; i < chompStart; ++i) {
      let [indent, content] = lines[i];
      offset += indent.length + content.length + 1;
      const crlf = content[content.length - 1] === "\r";
      if (crlf)
        content = content.slice(0, -1);
      if (content && indent.length < trimIndent) {
        const src = header.indent ? "explicit indentation indicator" : "first line";
        const message = `Block scalar lines must not be less indented than their ${src}`;
        onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
        indent = "";
      }
      if (type === Scalar.BLOCK_LITERAL) {
        value += sep + indent.slice(trimIndent) + content;
        sep = "\n";
      } else if (indent.length > trimIndent || content[0] === "	") {
        if (sep === " ")
          sep = "\n";
        else if (!prevMoreIndented && sep === "\n")
          sep = "\n\n";
        value += sep + indent.slice(trimIndent) + content;
        sep = "\n";
        prevMoreIndented = true;
      } else if (content === "") {
        if (sep === "\n")
          value += "\n";
        else
          sep = "\n";
      } else {
        value += sep + content;
        sep = " ";
        prevMoreIndented = false;
      }
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i = chompStart; i < lines.length; ++i)
          value += "\n" + lines[i][0].slice(trimIndent);
        if (value[value.length - 1] !== "\n")
          value += "\n";
        break;
      default:
        value += "\n";
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header") {
      onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
      return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = "";
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
      const ch = source[i];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        const n = Number(ch);
        if (!indent && n)
          indent = n;
        else if (error === -1)
          error = offset + i;
      }
    }
    if (error !== -1)
      onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = "";
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
      const token = props[i];
      switch (token.type) {
        case "space":
          hasSpace = true;
        // fallthrough
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace) {
            const message = "Comments must be separated from other tokens by white space characters";
            onError(token, "MISSING_CHAR", message);
          }
          length += token.source.length;
          comment = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message);
          length += token.source.length;
          break;
        /* istanbul ignore next should not happen */
        default: {
          const message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          const ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent, chomp, comment, length };
  }
  function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
      lines.push([split[i], split[i + 1]]);
    return lines;
  }
  var init_resolve_block_scalar = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-block-scalar.js"() {
      init_Scalar();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
  function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type2;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
      case "scalar":
        _type2 = Scalar.PLAIN;
        value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type2 = Scalar.QUOTE_SINGLE;
        value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type2 = Scalar.QUOTE_DOUBLE;
        value = doubleQuotedValue(source, _onError);
        break;
      /* istanbul ignore next should not happen */
      default:
        onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
        return {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type2,
      comment: re.comment,
      range: [offset, valueEnd, re.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      /* istanbul ignore next should not happen */
      case "	":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return unfoldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function unfoldLines(source) {
    const line = /(.*?)\r?\n/sy;
    let match = line.exec(source);
    if (!match)
      return source;
    let trimEnd, trimBoth;
    try {
      trimEnd = new RegExp("(?<![ 	])[ 	]+$");
      trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
    } catch {
      trimEnd = /[ \t]+$/;
      trimBoth = /^[ \t]+|[ \t]+$/g;
    }
    let res = match[1].replace(trimEnd, "");
    let sep = " ";
    let pos = line.lastIndex;
    while (match = line.exec(source)) {
      const lm = match[1].replace(trimBoth, "");
      if (lm === "") {
        if (sep === "\n")
          res += sep;
        else
          sep = "\n";
      } else {
        res += sep + lm;
        sep = " ";
      }
      pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i = 1; i < source.length - 1; ++i) {
      const ch = source[i];
      if (ch === "\r" && source[i + 1] === "\n")
        continue;
      if (ch === "\n") {
        const { fold, offset } = foldNewline(source, i);
        res += fold;
        i = offset;
      } else if (ch === "\\") {
        let next = source[++i];
        const cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === "\n") {
          next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "\r" && source[i + 1] === "\n") {
          next = source[++i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          const length = next === "x" ? 2 : next === "u" ? 4 : 8;
          res += parseCharCode(source, i + 1, length, onError);
          i += length;
        } else {
          const raw = source.substr(i - 1, 2);
          onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
          res += raw;
        }
      } else if (ch === " " || ch === "	") {
        const wsStart = i;
        let next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
        if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
          res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
      } else {
        res += ch;
      }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "";
    let ch = source[offset + 1];
    while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== "\n")
        break;
      if (ch === "\n")
        fold += "\n";
      offset += 1;
      ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    try {
      return String.fromCodePoint(code);
    } catch {
      const raw = source.substr(offset - 2, length + 2);
      onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
      return raw;
    }
  }
  var escapeCodes;
  var init_resolve_flow_scalar = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js"() {
      init_Scalar();
      init_resolve_end();
      escapeCodes = {
        "0": "\0",
        // null character
        a: "\x07",
        // bell character
        b: "\b",
        // backspace
        e: "\x1B",
        // escape character
        f: "\f",
        // form feed
        n: "\n",
        // line feed
        r: "\r",
        // carriage return
        t: "	",
        // horizontal tab
        v: "\v",
        // vertical tab
        N: "\x85",
        // Unicode next line
        _: "\xA0",
        // Unicode non-breaking space
        L: "\u2028",
        // Unicode line separator
        P: "\u2029",
        // Unicode paragraph separator
        " ": " ",
        '"': '"',
        "/": "/",
        "\\": "\\",
        "	": "	"
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/compose-scalar.js
  function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
    let tag;
    if (ctx.options.stringKeys && ctx.atKey) {
      tag = ctx.schema[SCALAR];
    } else if (tagName)
      tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
    else if (token.type === "scalar")
      tag = findScalarTagByTest(ctx, value, token, onError);
    else
      tag = ctx.schema[SCALAR];
    let scalar;
    try {
      const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = isScalar(res) ? res : new Scalar(res);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
      scalar = new Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment)
      scalar.comment = comment;
    return scalar;
  }
  function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema4[SCALAR];
    const matchWithTest = [];
    for (const tag of schema4.tags) {
      if (!tag.collection && tag.tag === tagName) {
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
      }
    }
    for (const tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    const kt = schema4.knownTags[tagName];
    if (kt && !kt.collection) {
      schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
      return kt;
    }
    onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
    return schema4[SCALAR];
  }
  function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
    const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
    if (schema4.compat) {
      const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
      if (tag.tag !== compat.tag) {
        const ts = directives.tagString(tag.tag);
        const cs = directives.tagString(compat.tag);
        const msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, true);
      }
    }
    return tag;
  }
  var init_compose_scalar = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/compose-scalar.js"() {
      init_identity();
      init_Scalar();
      init_resolve_block_scalar();
      init_resolve_flow_scalar();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      pos ?? (pos = before.length);
      for (let i = pos - 1; i >= 0; --i) {
        let st = before[i];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i];
        while (st?.type === "space") {
          offset += st.source.length;
          st = before[++i];
        }
        break;
      }
    }
    return offset;
  }
  var init_util_empty_scalar_position = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js"() {
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/compose-node.js
  function composeNode(ctx, token, props, onError) {
    const atKey = ctx.atKey;
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    let isSrcToken = true;
    switch (token.type) {
      case "alias":
        node = composeAlias(ctx, token, onError);
        if (anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        node = composeScalar(ctx, token, tag, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          node = composeCollection(CN, ctx, token, props, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          onError(token, "RESOURCE_EXHAUSTION", message);
        }
        break;
      default: {
        const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message);
        isSrcToken = false;
      }
    }
    node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
    if (anchor && node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (atKey && ctx.options.stringKeys && (!isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
      const msg = "With stringKeys, all keys must be strings";
      onError(tag ?? token, "NON_STRING_KEY", msg);
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      if (token.type === "scalar" && token.source === "")
        node.comment = comment;
      else
        node.commentBefore = comment;
    }
    if (ctx.options.keepSourceTokens && isSrcToken)
      node.srcToken = token;
    return node;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    const token = {
      type: "scalar",
      offset: emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    };
    const node = composeScalar(ctx, token, tag, onError);
    if (anchor) {
      node.anchor = anchor.source.substring(1);
      if (node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      node.comment = comment;
      node.range[2] = end;
    }
    return node;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
    const valueEnd = offset + source.length;
    const re = resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
      alias.comment = re.comment;
    return alias;
  }
  var CN;
  var init_compose_node = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/compose-node.js"() {
      init_Alias();
      init_identity();
      init_compose_collection();
      init_compose_scalar();
      init_resolve_end();
      init_util_empty_scalar_position();
      CN = { composeNode, composeEmptyNode };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/compose-doc.js
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document(void 0, opts);
    const ctx = {
      atKey: false,
      atRoot: true,
      directives: doc.directives,
      options: doc.options,
      schema: doc.schema
    };
    const props = resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      parentIndent: 0,
      startOnNewline: true
    });
    if (props.found) {
      doc.directives.docStart = true;
      if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
      doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
  }
  var init_compose_doc = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/compose-doc.js"() {
      init_Document();
      init_compose_node();
      init_resolve_end();
      init_resolve_props();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/compose/composer.js
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment = "";
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
      const source = prelude[i];
      switch (source[0]) {
        case "#":
          comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
          atComment = true;
          afterEmptyLine = false;
          break;
        case "%":
          if (prelude[i + 1]?.[0] !== "#")
            i += 1;
          atComment = false;
          break;
        default:
          if (!atComment)
            afterEmptyLine = true;
          atComment = false;
      }
    }
    return { comment, afterEmptyLine };
  }
  var Composer;
  var init_composer = __esm({
    "browser-config/node_modules/yaml/browser/dist/compose/composer.js"() {
      init_directives();
      init_Document();
      init_errors();
      init_identity();
      init_compose_doc();
      init_resolve_end();
      Composer = class {
        constructor(options = {}) {
          this.doc = null;
          this.atDirectives = false;
          this.prelude = [];
          this.errors = [];
          this.warnings = [];
          this.onError = (source, code, message, warning) => {
            const pos = getErrorPos(source);
            if (warning)
              this.warnings.push(new YAMLWarning(pos, code, message));
            else
              this.errors.push(new YAMLParseError(pos, code, message));
          };
          this.directives = new Directives({ version: options.version || "1.2" });
          this.options = options;
        }
        decorate(doc, afterDoc) {
          const { comment, afterEmptyLine } = parsePrelude(this.prelude);
          if (comment) {
            const dc = doc.contents;
            if (afterDoc) {
              doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
            } else if (afterEmptyLine || doc.directives.docStart || !dc) {
              doc.commentBefore = comment;
            } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
              let it = dc.items[0];
              if (isPair(it))
                it = it.key;
              const cb = it.commentBefore;
              it.commentBefore = cb ? `${comment}
${cb}` : comment;
            } else {
              const cb = dc.commentBefore;
              dc.commentBefore = cb ? `${comment}
${cb}` : comment;
            }
          }
          if (afterDoc) {
            for (let i = 0; i < this.errors.length; ++i)
              doc.errors.push(this.errors[i]);
            for (let i = 0; i < this.warnings.length; ++i)
              doc.warnings.push(this.warnings[i]);
          } else {
            doc.errors = this.errors;
            doc.warnings = this.warnings;
          }
          this.prelude = [];
          this.errors = [];
          this.warnings = [];
        }
        /**
         * Current stream status information.
         *
         * Mostly useful at the end of input for an empty stream.
         */
        streamInfo() {
          return {
            comment: parsePrelude(this.prelude).comment,
            directives: this.directives,
            errors: this.errors,
            warnings: this.warnings
          };
        }
        /**
         * Compose tokens into documents.
         *
         * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
         * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
         */
        *compose(tokens, forceDoc = false, endOffset = -1) {
          for (const token of tokens)
            yield* this.next(token);
          yield* this.end(forceDoc, endOffset);
        }
        /** Advance the composer by one CST token. */
        *next(token) {
          switch (token.type) {
            case "directive":
              this.directives.add(token.source, (offset, message, warning) => {
                const pos = getErrorPos(token);
                pos[0] += offset;
                this.onError(pos, "BAD_DIRECTIVE", message, warning);
              });
              this.prelude.push(token.source);
              this.atDirectives = true;
              break;
            case "document": {
              const doc = composeDoc(this.options, this.directives, token, this.onError);
              if (this.atDirectives && !doc.directives.docStart)
                this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
              this.decorate(doc, false);
              if (this.doc)
                yield this.doc;
              this.doc = doc;
              this.atDirectives = false;
              break;
            }
            case "byte-order-mark":
            case "space":
              break;
            case "comment":
            case "newline":
              this.prelude.push(token.source);
              break;
            case "error": {
              const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
              const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
              if (this.atDirectives || !this.doc)
                this.errors.push(error);
              else
                this.doc.errors.push(error);
              break;
            }
            case "doc-end": {
              if (!this.doc) {
                const msg = "Unexpected doc-end without preceding document";
                this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
                break;
              }
              this.doc.directives.docEnd = true;
              const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
              this.decorate(this.doc, true);
              if (end.comment) {
                const dc = this.doc.comment;
                this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
              }
              this.doc.range[2] = end.offset;
              break;
            }
            default:
              this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
          }
        }
        /**
         * Call at end of input to yield any remaining document.
         *
         * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
         * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
         */
        *end(forceDoc = false, endOffset = -1) {
          if (this.doc) {
            this.decorate(this.doc, true);
            yield this.doc;
            this.doc = null;
          } else if (forceDoc) {
            const opts = Object.assign({ _directives: this.directives }, this.options);
            const doc = new Document(void 0, opts);
            if (this.atDirectives)
              this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
            doc.range = [0, endOffset, endOffset];
            this.decorate(doc, false);
            yield doc;
          }
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/cst-scalar.js
  function resolveAsScalar(token, strict = true, onError) {
    if (token) {
      const _onError = (pos, code, message) => {
        const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
        if (onError)
          onError(offset, code, message);
        else
          throw new YAMLParseError([offset, offset + 1], code, message);
      };
      switch (token.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return resolveFlowScalar(token, strict, _onError);
        case "block-scalar":
          return resolveBlockScalar({ options: { strict } }, token, _onError);
      }
    }
    return null;
  }
  function createScalarToken(value, context) {
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
    const source = stringifyString({ type, value }, {
      implicitKey,
      indent: indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    const end = context.end ?? [
      { type: "newline", offset: -1, indent, source: "\n" }
    ];
    switch (source[0]) {
      case "|":
      case ">": {
        const he = source.indexOf("\n");
        const head = source.substring(0, he);
        const body = source.substring(he + 1) + "\n";
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, end))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        return { type: "block-scalar", offset, indent, props, source: body };
      }
      case '"':
        return { type: "double-quoted-scalar", offset, indent, source, end };
      case "'":
        return { type: "single-quoted-scalar", offset, indent, source, end };
      default:
        return { type: "scalar", offset, indent, source, end };
    }
  }
  function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = "indent" in token ? token.indent : null;
    if (afterKey && typeof indent === "number")
      indent += 2;
    if (!type)
      switch (token.type) {
        case "single-quoted-scalar":
          type = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          type = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          const header = token.props[0];
          if (header.type !== "block-scalar-header")
            throw new Error("Invalid block scalar header");
          type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          type = "PLAIN";
      }
    const source = stringifyString({ type, value }, {
      implicitKey: implicitKey || indent === null,
      indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
      case "|":
      case ">":
        setBlockScalarValue(token, source);
        break;
      case '"':
        setFlowScalarValue(token, source, "double-quoted-scalar");
        break;
      case "'":
        setFlowScalarValue(token, source, "single-quoted-scalar");
        break;
      default:
        setFlowScalarValue(token, source, "scalar");
    }
  }
  function setBlockScalarValue(token, source) {
    const he = source.indexOf("\n");
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + "\n";
    if (token.type === "block-scalar") {
      const header = token.props[0];
      if (header.type !== "block-scalar-header")
        throw new Error("Invalid block scalar header");
      header.source = head;
      token.source = body;
    } else {
      const { offset } = token;
      const indent = "indent" in token ? token.indent : -1;
      const props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
        props.push({ type: "newline", offset: -1, indent, source: "\n" });
      for (const key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type: "block-scalar", indent, props, source: body });
    }
  }
  function addEndtoBlockProps(props, end) {
    if (end)
      for (const st of end)
        switch (st.type) {
          case "space":
          case "comment":
            props.push(st);
            break;
          case "newline":
            props.push(st);
            return true;
        }
    return false;
  }
  function setFlowScalarValue(token, source, type) {
    switch (token.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        token.type = type;
        token.source = source;
        break;
      case "block-scalar": {
        const end = token.props.slice(1);
        let oa = source.length;
        if (token.props[0].type === "block-scalar-header")
          oa -= token.props[0].source.length;
        for (const tok of end)
          tok.offset += oa;
        delete token.props;
        Object.assign(token, { type, source, end });
        break;
      }
      case "block-map":
      case "block-seq": {
        const offset = token.offset + source.length;
        const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
        delete token.items;
        Object.assign(token, { type, source, end: [nl] });
        break;
      }
      default: {
        const indent = "indent" in token ? token.indent : -1;
        const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type, indent, source, end });
      }
    }
  }
  var init_cst_scalar = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/cst-scalar.js"() {
      init_resolve_block_scalar();
      init_resolve_flow_scalar();
      init_errors();
      init_stringifyString();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/cst-stringify.js
  function stringifyToken(token) {
    switch (token.type) {
      case "block-scalar": {
        let res = "";
        for (const tok of token.props)
          res += stringifyToken(tok);
        return res + token.source;
      }
      case "block-map":
      case "block-seq": {
        let res = "";
        for (const item of token.items)
          res += stringifyItem(item);
        return res;
      }
      case "flow-collection": {
        let res = token.start.source;
        for (const item of token.items)
          res += stringifyItem(item);
        for (const st of token.end)
          res += st.source;
        return res;
      }
      case "document": {
        let res = stringifyItem(token);
        if (token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
      default: {
        let res = token.source;
        if ("end" in token && token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
    }
  }
  function stringifyItem({ start, key, sep, value }) {
    let res = "";
    for (const st of start)
      res += st.source;
    if (key)
      res += stringifyToken(key);
    if (sep)
      for (const st of sep)
        res += st.source;
    if (value)
      res += stringifyToken(value);
    return res;
  }
  var stringify2;
  var init_cst_stringify = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/cst-stringify.js"() {
      stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/cst-visit.js
  function visit4(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (const field of ["key", "value"]) {
      const token = item[field];
      if (token && "items" in token) {
        for (let i = 0; i < token.items.length; ++i) {
          const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK2)
            return BREAK2;
          else if (ci === REMOVE2) {
            token.items.splice(i, 1);
            i -= 1;
          }
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
  }
  var BREAK2, SKIP2, REMOVE2;
  var init_cst_visit = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/cst-visit.js"() {
      BREAK2 = Symbol("break visit");
      SKIP2 = Symbol("skip children");
      REMOVE2 = Symbol("remove item");
      visit4.BREAK = BREAK2;
      visit4.SKIP = SKIP2;
      visit4.REMOVE = REMOVE2;
      visit4.itemAtPath = (cst, path) => {
        let item = cst;
        for (const [field, index] of path) {
          const tok = item?.[field];
          if (tok && "items" in tok) {
            item = tok.items[index];
          } else
            return void 0;
        }
        return item;
      };
      visit4.parentCollection = (cst, path) => {
        const parent = visit4.itemAtPath(cst, path.slice(0, -1));
        const field = path[path.length - 1][0];
        const coll = parent?.[field];
        if (coll && "items" in coll)
          return coll;
        throw new Error("Parent collection not found");
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/cst.js
  var cst_exports = {};
  __export(cst_exports, {
    BOM: () => BOM,
    DOCUMENT: () => DOCUMENT,
    FLOW_END: () => FLOW_END,
    SCALAR: () => SCALAR2,
    createScalarToken: () => createScalarToken,
    isCollection: () => isCollection2,
    isScalar: () => isScalar2,
    prettyToken: () => prettyToken,
    resolveAsScalar: () => resolveAsScalar,
    setScalarValue: () => setScalarValue,
    stringify: () => stringify2,
    tokenType: () => tokenType,
    visit: () => visit4
  });
  function prettyToken(token) {
    switch (token) {
      case BOM:
        return "<BOM>";
      case DOCUMENT:
        return "<DOC>";
      case FLOW_END:
        return "<FLOW_END>";
      case SCALAR2:
        return "<SCALAR>";
      default:
        return JSON.stringify(token);
    }
  }
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR2:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case "\n":
      case "\r\n":
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "	":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  var BOM, DOCUMENT, FLOW_END, SCALAR2, isCollection2, isScalar2;
  var init_cst = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/cst.js"() {
      init_cst_scalar();
      init_cst_stringify();
      init_cst_visit();
      BOM = "\uFEFF";
      DOCUMENT = "";
      FLOW_END = "";
      SCALAR2 = "";
      isCollection2 = (token) => !!token && "items" in token;
      isScalar2 = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/lexer.js
  function isEmpty(ch) {
    switch (ch) {
      case void 0:
      case " ":
      case "\n":
      case "\r":
      case "	":
        return true;
      default:
        return false;
    }
  }
  var hexDigits, tagChars, flowIndicatorChars, invalidAnchorChars, isNotAnchorChar, Lexer;
  var init_lexer = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/lexer.js"() {
      init_cst();
      hexDigits = new Set("0123456789ABCDEFabcdef");
      tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
      flowIndicatorChars = new Set(",[]{}");
      invalidAnchorChars = new Set(" ,[]{}\n\r	");
      isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
      Lexer = class {
        constructor() {
          this.atEnd = false;
          this.blockScalarIndent = -1;
          this.blockScalarKeep = false;
          this.buffer = "";
          this.flowKey = false;
          this.flowLevel = 0;
          this.indentNext = 0;
          this.indentValue = 0;
          this.lineEndPos = null;
          this.next = null;
          this.pos = 0;
        }
        /**
         * Generate YAML tokens from the `source` string. If `incomplete`,
         * a part of the last line may be left as a buffer for the next call.
         *
         * @returns A generator of lexical tokens
         */
        *lex(source, incomplete = false) {
          if (source) {
            if (typeof source !== "string")
              throw TypeError("source is not a string");
            this.buffer = this.buffer ? this.buffer + source : source;
            this.lineEndPos = null;
          }
          this.atEnd = !incomplete;
          let next = this.next ?? "stream";
          while (next && (incomplete || this.hasChars(1)))
            next = yield* this.parseNext(next);
        }
        atLineEnd() {
          let i = this.pos;
          let ch = this.buffer[i];
          while (ch === " " || ch === "	")
            ch = this.buffer[++i];
          if (!ch || ch === "#" || ch === "\n")
            return true;
          if (ch === "\r")
            return this.buffer[i + 1] === "\n";
          return false;
        }
        charAt(n) {
          return this.buffer[this.pos + n];
        }
        continueScalar(offset) {
          let ch = this.buffer[offset];
          if (this.indentNext > 0) {
            let indent = 0;
            while (ch === " ")
              ch = this.buffer[++indent + offset];
            if (ch === "\r") {
              const next = this.buffer[indent + offset + 1];
              if (next === "\n" || !next && !this.atEnd)
                return offset + indent + 1;
            }
            return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
          }
          if (ch === "-" || ch === ".") {
            const dt = this.buffer.substr(offset, 3);
            if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
              return -1;
          }
          return offset;
        }
        getLine() {
          let end = this.lineEndPos;
          if (typeof end !== "number" || end !== -1 && end < this.pos) {
            end = this.buffer.indexOf("\n", this.pos);
            this.lineEndPos = end;
          }
          if (end === -1)
            return this.atEnd ? this.buffer.substring(this.pos) : null;
          if (this.buffer[end - 1] === "\r")
            end -= 1;
          return this.buffer.substring(this.pos, end);
        }
        hasChars(n) {
          return this.pos + n <= this.buffer.length;
        }
        setNext(state) {
          this.buffer = this.buffer.substring(this.pos);
          this.pos = 0;
          this.lineEndPos = null;
          this.next = state;
          return null;
        }
        peek(n) {
          return this.buffer.substr(this.pos, n);
        }
        *parseNext(next) {
          switch (next) {
            case "stream":
              return yield* this.parseStream();
            case "line-start":
              return yield* this.parseLineStart();
            case "block-start":
              return yield* this.parseBlockStart();
            case "doc":
              return yield* this.parseDocument();
            case "flow":
              return yield* this.parseFlowCollection();
            case "quoted-scalar":
              return yield* this.parseQuotedScalar();
            case "block-scalar":
              return yield* this.parseBlockScalar();
            case "plain-scalar":
              return yield* this.parsePlainScalar();
          }
        }
        *parseStream() {
          let line = this.getLine();
          if (line === null)
            return this.setNext("stream");
          if (line[0] === BOM) {
            yield* this.pushCount(1);
            line = line.substring(1);
          }
          if (line[0] === "%") {
            let dirEnd = line.length;
            let cs = line.indexOf("#");
            while (cs !== -1) {
              const ch = line[cs - 1];
              if (ch === " " || ch === "	") {
                dirEnd = cs - 1;
                break;
              } else {
                cs = line.indexOf("#", cs + 1);
              }
            }
            while (true) {
              const ch = line[dirEnd - 1];
              if (ch === " " || ch === "	")
                dirEnd -= 1;
              else
                break;
            }
            const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
            yield* this.pushCount(line.length - n);
            this.pushNewline();
            return "stream";
          }
          if (this.atLineEnd()) {
            const sp = yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - sp);
            yield* this.pushNewline();
            return "stream";
          }
          yield DOCUMENT;
          return yield* this.parseLineStart();
        }
        *parseLineStart() {
          const ch = this.charAt(0);
          if (!ch && !this.atEnd)
            return this.setNext("line-start");
          if (ch === "-" || ch === ".") {
            if (!this.atEnd && !this.hasChars(4))
              return this.setNext("line-start");
            const s = this.peek(3);
            if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
              yield* this.pushCount(3);
              this.indentValue = 0;
              this.indentNext = 0;
              return s === "---" ? "doc" : "stream";
            }
          }
          this.indentValue = yield* this.pushSpaces(false);
          if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
            this.indentNext = this.indentValue;
          return yield* this.parseBlockStart();
        }
        *parseBlockStart() {
          const [ch0, ch1] = this.peek(2);
          if (!ch1 && !this.atEnd)
            return this.setNext("block-start");
          if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
            const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
            this.indentNext = this.indentValue + 1;
            this.indentValue += n;
            return "block-start";
          }
          return "doc";
        }
        *parseDocument() {
          yield* this.pushSpaces(true);
          const line = this.getLine();
          if (line === null)
            return this.setNext("doc");
          let n = yield* this.pushIndicators();
          switch (line[n]) {
            case "#":
              yield* this.pushCount(line.length - n);
            // fallthrough
            case void 0:
              yield* this.pushNewline();
              return yield* this.parseLineStart();
            case "{":
            case "[":
              yield* this.pushCount(1);
              this.flowKey = false;
              this.flowLevel = 1;
              return "flow";
            case "}":
            case "]":
              yield* this.pushCount(1);
              return "doc";
            case "*":
              yield* this.pushUntil(isNotAnchorChar);
              return "doc";
            case '"':
            case "'":
              return yield* this.parseQuotedScalar();
            case "|":
            case ">":
              n += yield* this.parseBlockScalarHeader();
              n += yield* this.pushSpaces(true);
              yield* this.pushCount(line.length - n);
              yield* this.pushNewline();
              return yield* this.parseBlockScalar();
            default:
              return yield* this.parsePlainScalar();
          }
        }
        *parseFlowCollection() {
          let nl, sp;
          let indent = -1;
          do {
            nl = yield* this.pushNewline();
            if (nl > 0) {
              sp = yield* this.pushSpaces(false);
              this.indentValue = indent = sp;
            } else {
              sp = 0;
            }
            sp += yield* this.pushSpaces(true);
          } while (nl + sp > 0);
          const line = this.getLine();
          if (line === null)
            return this.setNext("flow");
          if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
            const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
            if (!atFlowEndMarker) {
              this.flowLevel = 0;
              yield FLOW_END;
              return yield* this.parseLineStart();
            }
          }
          let n = 0;
          while (line[n] === ",") {
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            this.flowKey = false;
          }
          n += yield* this.pushIndicators();
          switch (line[n]) {
            case void 0:
              return "flow";
            case "#":
              yield* this.pushCount(line.length - n);
              return "flow";
            case "{":
            case "[":
              yield* this.pushCount(1);
              this.flowKey = false;
              this.flowLevel += 1;
              return "flow";
            case "}":
            case "]":
              yield* this.pushCount(1);
              this.flowKey = true;
              this.flowLevel -= 1;
              return this.flowLevel ? "flow" : "doc";
            case "*":
              yield* this.pushUntil(isNotAnchorChar);
              return "flow";
            case '"':
            case "'":
              this.flowKey = true;
              return yield* this.parseQuotedScalar();
            case ":": {
              const next = this.charAt(1);
              if (this.flowKey || isEmpty(next) || next === ",") {
                this.flowKey = false;
                yield* this.pushCount(1);
                yield* this.pushSpaces(true);
                return "flow";
              }
            }
            // fallthrough
            default:
              this.flowKey = false;
              return yield* this.parsePlainScalar();
          }
        }
        *parseQuotedScalar() {
          const quote = this.charAt(0);
          let end = this.buffer.indexOf(quote, this.pos + 1);
          if (quote === "'") {
            while (end !== -1 && this.buffer[end + 1] === "'")
              end = this.buffer.indexOf("'", end + 2);
          } else {
            while (end !== -1) {
              let n = 0;
              while (this.buffer[end - 1 - n] === "\\")
                n += 1;
              if (n % 2 === 0)
                break;
              end = this.buffer.indexOf('"', end + 1);
            }
          }
          const qb = this.buffer.substring(0, end);
          let nl = qb.indexOf("\n", this.pos);
          if (nl !== -1) {
            while (nl !== -1) {
              const cs = this.continueScalar(nl + 1);
              if (cs === -1)
                break;
              nl = qb.indexOf("\n", cs);
            }
            if (nl !== -1) {
              end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
            }
          }
          if (end === -1) {
            if (!this.atEnd)
              return this.setNext("quoted-scalar");
            end = this.buffer.length;
          }
          yield* this.pushToIndex(end + 1, false);
          return this.flowLevel ? "flow" : "doc";
        }
        *parseBlockScalarHeader() {
          this.blockScalarIndent = -1;
          this.blockScalarKeep = false;
          let i = this.pos;
          while (true) {
            const ch = this.buffer[++i];
            if (ch === "+")
              this.blockScalarKeep = true;
            else if (ch > "0" && ch <= "9")
              this.blockScalarIndent = Number(ch) - 1;
            else if (ch !== "-")
              break;
          }
          return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
        }
        *parseBlockScalar() {
          let nl = this.pos - 1;
          let indent = 0;
          let ch;
          loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
            switch (ch) {
              case " ":
                indent += 1;
                break;
              case "\n":
                nl = i2;
                indent = 0;
                break;
              case "\r": {
                const next = this.buffer[i2 + 1];
                if (!next && !this.atEnd)
                  return this.setNext("block-scalar");
                if (next === "\n")
                  break;
              }
              // fallthrough
              default:
                break loop;
            }
          }
          if (!ch && !this.atEnd)
            return this.setNext("block-scalar");
          if (indent >= this.indentNext) {
            if (this.blockScalarIndent === -1)
              this.indentNext = indent;
            else {
              this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
            }
            do {
              const cs = this.continueScalar(nl + 1);
              if (cs === -1)
                break;
              nl = this.buffer.indexOf("\n", cs);
            } while (nl !== -1);
            if (nl === -1) {
              if (!this.atEnd)
                return this.setNext("block-scalar");
              nl = this.buffer.length;
            }
          }
          let i = nl + 1;
          ch = this.buffer[i];
          while (ch === " ")
            ch = this.buffer[++i];
          if (ch === "	") {
            while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
              ch = this.buffer[++i];
            nl = i - 1;
          } else if (!this.blockScalarKeep) {
            do {
              let i2 = nl - 1;
              let ch2 = this.buffer[i2];
              if (ch2 === "\r")
                ch2 = this.buffer[--i2];
              const lastChar = i2;
              while (ch2 === " ")
                ch2 = this.buffer[--i2];
              if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
                nl = i2;
              else
                break;
            } while (true);
          }
          yield SCALAR2;
          yield* this.pushToIndex(nl + 1, true);
          return yield* this.parseLineStart();
        }
        *parsePlainScalar() {
          const inFlow = this.flowLevel > 0;
          let end = this.pos - 1;
          let i = this.pos - 1;
          let ch;
          while (ch = this.buffer[++i]) {
            if (ch === ":") {
              const next = this.buffer[i + 1];
              if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
                break;
              end = i;
            } else if (isEmpty(ch)) {
              let next = this.buffer[i + 1];
              if (ch === "\r") {
                if (next === "\n") {
                  i += 1;
                  ch = "\n";
                  next = this.buffer[i + 1];
                } else
                  end = i;
              }
              if (next === "#" || inFlow && flowIndicatorChars.has(next))
                break;
              if (ch === "\n") {
                const cs = this.continueScalar(i + 1);
                if (cs === -1)
                  break;
                i = Math.max(i, cs - 2);
              }
            } else {
              if (inFlow && flowIndicatorChars.has(ch))
                break;
              end = i;
            }
          }
          if (!ch && !this.atEnd)
            return this.setNext("plain-scalar");
          yield SCALAR2;
          yield* this.pushToIndex(end + 1, true);
          return inFlow ? "flow" : "doc";
        }
        *pushCount(n) {
          if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos += n;
            return n;
          }
          return 0;
        }
        *pushToIndex(i, allowEmpty) {
          const s = this.buffer.slice(this.pos, i);
          if (s) {
            yield s;
            this.pos += s.length;
            return s.length;
          } else if (allowEmpty)
            yield "";
          return 0;
        }
        *pushIndicators() {
          let n = 0;
          loop: while (true) {
            switch (this.charAt(0)) {
              case "!":
                n += yield* this.pushTag();
                n += yield* this.pushSpaces(true);
                continue loop;
              case "&":
                n += yield* this.pushUntil(isNotAnchorChar);
                n += yield* this.pushSpaces(true);
                continue loop;
              case "-":
              // this is an error
              case "?":
              // this is an error outside flow collections
              case ":": {
                const inFlow = this.flowLevel > 0;
                const ch1 = this.charAt(1);
                if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                  if (!inFlow)
                    this.indentNext = this.indentValue + 1;
                  else if (this.flowKey)
                    this.flowKey = false;
                  n += yield* this.pushCount(1);
                  n += yield* this.pushSpaces(true);
                  continue loop;
                }
              }
            }
            break loop;
          }
          return n;
        }
        *pushTag() {
          if (this.charAt(1) === "<") {
            let i = this.pos + 2;
            let ch = this.buffer[i];
            while (!isEmpty(ch) && ch !== ">")
              ch = this.buffer[++i];
            return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
          } else {
            let i = this.pos + 1;
            let ch = this.buffer[i];
            while (ch) {
              if (tagChars.has(ch))
                ch = this.buffer[++i];
              else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
                ch = this.buffer[i += 3];
              } else
                break;
            }
            return yield* this.pushToIndex(i, false);
          }
        }
        *pushNewline() {
          const ch = this.buffer[this.pos];
          if (ch === "\n")
            return yield* this.pushCount(1);
          else if (ch === "\r" && this.charAt(1) === "\n")
            return yield* this.pushCount(2);
          else
            return 0;
        }
        *pushSpaces(allowTabs) {
          let i = this.pos - 1;
          let ch;
          do {
            ch = this.buffer[++i];
          } while (ch === " " || allowTabs && ch === "	");
          const n = i - this.pos;
          if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos = i;
          }
          return n;
        }
        *pushUntil(test) {
          let i = this.pos;
          let ch = this.buffer[i];
          while (!test(ch))
            ch = this.buffer[++i];
          return yield* this.pushToIndex(i, false);
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/line-counter.js
  var LineCounter;
  var init_line_counter = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/line-counter.js"() {
      LineCounter = class {
        constructor() {
          this.lineStarts = [];
          this.addNewLine = (offset) => this.lineStarts.push(offset);
          this.linePos = (offset) => {
            let low = 0;
            let high = this.lineStarts.length;
            while (low < high) {
              const mid = low + high >> 1;
              if (this.lineStarts[mid] < offset)
                low = mid + 1;
              else
                high = mid;
            }
            if (this.lineStarts[low] === offset)
              return { line: low + 1, col: 1 };
            if (low === 0)
              return { line: 0, col: offset };
            const start = this.lineStarts[low - 1];
            return { line: low, col: offset - start + 1 };
          };
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/parse/parser.js
  function includesToken(list, type) {
    for (let i = 0; i < list.length; ++i)
      if (list[i].type === type)
        return true;
    return false;
  }
  function findNonEmptyIndex(list) {
    for (let i = 0; i < list.length; ++i) {
      switch (list[i].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i;
      }
    }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return true;
      default:
        return false;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        const it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      /* istanbul ignore next should not happen */
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i = prev.length;
    loop: while (--i >= 0) {
      switch (prev[i].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break loop;
      }
    }
    while (prev[++i]?.type === "space") {
    }
    return prev.splice(i, prev.length);
  }
  function arrayPushArray(target, source) {
    if (source.length < 1e5)
      Array.prototype.push.apply(target, source);
    else
      for (let i = 0; i < source.length; ++i)
        target.push(source[i]);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (const it of fc.items) {
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          delete it.key;
          if (isFlowToken(it.value)) {
            if (it.value.end)
              arrayPushArray(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          } else
            arrayPushArray(it.start, it.sep);
          delete it.sep;
        }
      }
    }
  }
  var Parser;
  var init_parser2 = __esm({
    "browser-config/node_modules/yaml/browser/dist/parse/parser.js"() {
      init_cst();
      init_lexer();
      Parser = class {
        /**
         * @param onNewLine - If defined, called separately with the start position of
         *   each new line (in `parse()`, including the start of input).
         */
        constructor(onNewLine) {
          this.atNewLine = true;
          this.atScalar = false;
          this.indent = 0;
          this.offset = 0;
          this.onKeyLine = false;
          this.stack = [];
          this.source = "";
          this.type = "";
          this.lexer = new Lexer();
          this.onNewLine = onNewLine;
        }
        /**
         * Parse `source` as a YAML stream.
         * If `incomplete`, a part of the last line may be left as a buffer for the next call.
         *
         * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
         *
         * @returns A generator of tokens representing each directive, document, and other structure.
         */
        *parse(source, incomplete = false) {
          if (this.onNewLine && this.offset === 0)
            this.onNewLine(0);
          for (const lexeme of this.lexer.lex(source, incomplete))
            yield* this.next(lexeme);
          if (!incomplete)
            yield* this.end();
        }
        /**
         * Advance the parser by the `source` of one lexical token.
         */
        *next(source) {
          this.source = source;
          if (this.atScalar) {
            this.atScalar = false;
            yield* this.step();
            this.offset += source.length;
            return;
          }
          const type = tokenType(source);
          if (!type) {
            const message = `Not a YAML token: ${source}`;
            yield* this.pop({ type: "error", offset: this.offset, message, source });
            this.offset += source.length;
          } else if (type === "scalar") {
            this.atNewLine = false;
            this.atScalar = true;
            this.type = "scalar";
          } else {
            this.type = type;
            yield* this.step();
            switch (type) {
              case "newline":
                this.atNewLine = true;
                this.indent = 0;
                if (this.onNewLine)
                  this.onNewLine(this.offset + source.length);
                break;
              case "space":
                if (this.atNewLine && source[0] === " ")
                  this.indent += source.length;
                break;
              case "explicit-key-ind":
              case "map-value-ind":
              case "seq-item-ind":
                if (this.atNewLine)
                  this.indent += source.length;
                break;
              case "doc-mode":
              case "flow-error-end":
                return;
              default:
                this.atNewLine = false;
            }
            this.offset += source.length;
          }
        }
        /** Call at end of input to push out any remaining constructions */
        *end() {
          while (this.stack.length > 0)
            yield* this.pop();
        }
        get sourceToken() {
          const st = {
            type: this.type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
          };
          return st;
        }
        *step() {
          const top = this.peek(1);
          if (this.type === "doc-end" && top?.type !== "doc-end") {
            while (this.stack.length > 0)
              yield* this.pop();
            this.stack.push({
              type: "doc-end",
              offset: this.offset,
              source: this.source
            });
            return;
          }
          if (!top)
            return yield* this.stream();
          switch (top.type) {
            case "document":
              return yield* this.document(top);
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
              return yield* this.scalar(top);
            case "block-scalar":
              return yield* this.blockScalar(top);
            case "block-map":
              return yield* this.blockMap(top);
            case "block-seq":
              return yield* this.blockSequence(top);
            case "flow-collection":
              return yield* this.flowCollection(top);
            case "doc-end":
              return yield* this.documentEnd(top);
          }
          yield* this.pop();
        }
        peek(n) {
          return this.stack[this.stack.length - n];
        }
        *pop(error) {
          const token = error ?? this.stack.pop();
          if (!token) {
            const message = "Tried to pop an empty stack";
            yield { type: "error", offset: this.offset, source: "", message };
          } else if (this.stack.length === 0) {
            yield token;
          } else {
            const top = this.peek(1);
            if (token.type === "block-scalar") {
              token.indent = "indent" in top ? top.indent : 0;
            } else if (token.type === "flow-collection" && top.type === "document") {
              token.indent = 0;
            }
            if (token.type === "flow-collection")
              fixFlowSeqItems(token);
            switch (top.type) {
              case "document":
                top.value = token;
                break;
              case "block-scalar":
                top.props.push(token);
                break;
              case "block-map": {
                const it = top.items[top.items.length - 1];
                if (it.value) {
                  top.items.push({ start: [], key: token, sep: [] });
                  this.onKeyLine = true;
                  return;
                } else if (it.sep) {
                  it.value = token;
                } else {
                  Object.assign(it, { key: token, sep: [] });
                  this.onKeyLine = !it.explicitKey;
                  return;
                }
                break;
              }
              case "block-seq": {
                const it = top.items[top.items.length - 1];
                if (it.value)
                  top.items.push({ start: [], value: token });
                else
                  it.value = token;
                break;
              }
              case "flow-collection": {
                const it = top.items[top.items.length - 1];
                if (!it || it.value)
                  top.items.push({ start: [], key: token, sep: [] });
                else if (it.sep)
                  it.value = token;
                else
                  Object.assign(it, { key: token, sep: [] });
                return;
              }
              /* istanbul ignore next should not happen */
              default:
                yield* this.pop();
                yield* this.pop(token);
            }
            if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
              const last = token.items[token.items.length - 1];
              if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
                if (top.type === "document")
                  top.end = last.start;
                else
                  top.items.push({ start: last.start });
                token.items.splice(-1, 1);
              }
            }
          }
        }
        *stream() {
          switch (this.type) {
            case "directive-line":
              yield { type: "directive", offset: this.offset, source: this.source };
              return;
            case "byte-order-mark":
            case "space":
            case "comment":
            case "newline":
              yield this.sourceToken;
              return;
            case "doc-mode":
            case "doc-start": {
              const doc = {
                type: "document",
                offset: this.offset,
                start: []
              };
              if (this.type === "doc-start")
                doc.start.push(this.sourceToken);
              this.stack.push(doc);
              return;
            }
          }
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML stream`,
            source: this.source
          };
        }
        *document(doc) {
          if (doc.value)
            return yield* this.lineEnd(doc);
          switch (this.type) {
            case "doc-start": {
              if (findNonEmptyIndex(doc.start) !== -1) {
                yield* this.pop();
                yield* this.step();
              } else
                doc.start.push(this.sourceToken);
              return;
            }
            case "anchor":
            case "tag":
            case "space":
            case "comment":
            case "newline":
              doc.start.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(doc);
          if (bv)
            this.stack.push(bv);
          else {
            yield {
              type: "error",
              offset: this.offset,
              message: `Unexpected ${this.type} token in YAML document`,
              source: this.source
            };
          }
        }
        *scalar(scalar) {
          if (this.type === "map-value-ind") {
            const prev = getPrevProps(this.peek(2));
            const start = getFirstKeyStartProps(prev);
            let sep;
            if (scalar.end) {
              sep = scalar.end;
              sep.push(this.sourceToken);
              delete scalar.end;
            } else
              sep = [this.sourceToken];
            const map2 = {
              type: "block-map",
              offset: scalar.offset,
              indent: scalar.indent,
              items: [{ start, key: scalar, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map2;
          } else
            yield* this.lineEnd(scalar);
        }
        *blockScalar(scalar) {
          switch (this.type) {
            case "space":
            case "comment":
            case "newline":
              scalar.props.push(this.sourceToken);
              return;
            case "scalar":
              scalar.source = this.source;
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine) {
                let nl = this.source.indexOf("\n") + 1;
                while (nl !== 0) {
                  this.onNewLine(this.offset + nl);
                  nl = this.source.indexOf("\n", nl) + 1;
                }
              }
              yield* this.pop();
              break;
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.step();
          }
        }
        *blockMap(map2) {
          const it = map2.items[map2.items.length - 1];
          switch (this.type) {
            case "newline":
              this.onKeyLine = false;
              if (it.value) {
                const end = "end" in it.value ? it.value.end : void 0;
                const last = Array.isArray(end) ? end[end.length - 1] : void 0;
                if (last?.type === "comment")
                  end?.push(this.sourceToken);
                else
                  map2.items.push({ start: [this.sourceToken] });
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "space":
            case "comment":
              if (it.value) {
                map2.items.push({ start: [this.sourceToken] });
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                if (this.atIndentedComment(it.start, map2.indent)) {
                  const prev = map2.items[map2.items.length - 2];
                  const end = prev?.value?.end;
                  if (Array.isArray(end)) {
                    arrayPushArray(end, it.start);
                    end.push(this.sourceToken);
                    map2.items.pop();
                    return;
                  }
                }
                it.start.push(this.sourceToken);
              }
              return;
          }
          if (this.indent >= map2.indent) {
            const atMapIndent = !this.onKeyLine && this.indent === map2.indent;
            const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
            let start = [];
            if (atNextItem && it.sep && !it.value) {
              const nl = [];
              for (let i = 0; i < it.sep.length; ++i) {
                const st = it.sep[i];
                switch (st.type) {
                  case "newline":
                    nl.push(i);
                    break;
                  case "space":
                    break;
                  case "comment":
                    if (st.indent > map2.indent)
                      nl.length = 0;
                    break;
                  default:
                    nl.length = 0;
                }
              }
              if (nl.length >= 2)
                start = it.sep.splice(nl[1]);
            }
            switch (this.type) {
              case "anchor":
              case "tag":
                if (atNextItem || it.value) {
                  start.push(this.sourceToken);
                  map2.items.push({ start });
                  this.onKeyLine = true;
                } else if (it.sep) {
                  it.sep.push(this.sourceToken);
                } else {
                  it.start.push(this.sourceToken);
                }
                return;
              case "explicit-key-ind":
                if (!it.sep && !it.explicitKey) {
                  it.start.push(this.sourceToken);
                  it.explicitKey = true;
                } else if (atNextItem || it.value) {
                  start.push(this.sourceToken);
                  map2.items.push({ start, explicitKey: true });
                } else {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken], explicitKey: true }]
                  });
                }
                this.onKeyLine = true;
                return;
              case "map-value-ind":
                if (it.explicitKey) {
                  if (!it.sep) {
                    if (includesToken(it.start, "newline")) {
                      Object.assign(it, { key: null, sep: [this.sourceToken] });
                    } else {
                      const start2 = getFirstKeyStartProps(it.start);
                      this.stack.push({
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                      });
                    }
                  } else if (it.value) {
                    map2.items.push({ start: [], key: null, sep: [this.sourceToken] });
                  } else if (includesToken(it.sep, "map-value-ind")) {
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start, key: null, sep: [this.sourceToken] }]
                    });
                  } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                    const start2 = getFirstKeyStartProps(it.start);
                    const key = it.key;
                    const sep = it.sep;
                    sep.push(this.sourceToken);
                    delete it.key;
                    delete it.sep;
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key, sep }]
                    });
                  } else if (start.length > 0) {
                    it.sep = it.sep.concat(start, this.sourceToken);
                  } else {
                    it.sep.push(this.sourceToken);
                  }
                } else {
                  if (!it.sep) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else if (it.value || atNextItem) {
                    map2.items.push({ start, key: null, sep: [this.sourceToken] });
                  } else if (includesToken(it.sep, "map-value-ind")) {
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: [], key: null, sep: [this.sourceToken] }]
                    });
                  } else {
                    it.sep.push(this.sourceToken);
                  }
                }
                this.onKeyLine = true;
                return;
              case "alias":
              case "scalar":
              case "single-quoted-scalar":
              case "double-quoted-scalar": {
                const fs = this.flowScalar(this.type);
                if (atNextItem || it.value) {
                  map2.items.push({ start, key: fs, sep: [] });
                  this.onKeyLine = true;
                } else if (it.sep) {
                  this.stack.push(fs);
                } else {
                  Object.assign(it, { key: fs, sep: [] });
                  this.onKeyLine = true;
                }
                return;
              }
              default: {
                const bv = this.startBlockValue(map2);
                if (bv) {
                  if (bv.type === "block-seq") {
                    if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                      yield* this.pop({
                        type: "error",
                        offset: this.offset,
                        message: "Unexpected block-seq-ind on same line with key",
                        source: this.source
                      });
                      return;
                    }
                  } else if (atMapIndent) {
                    map2.items.push({ start });
                  }
                  this.stack.push(bv);
                  return;
                }
              }
            }
          }
          yield* this.pop();
          yield* this.step();
        }
        *blockSequence(seq2) {
          const it = seq2.items[seq2.items.length - 1];
          switch (this.type) {
            case "newline":
              if (it.value) {
                const end = "end" in it.value ? it.value.end : void 0;
                const last = Array.isArray(end) ? end[end.length - 1] : void 0;
                if (last?.type === "comment")
                  end?.push(this.sourceToken);
                else
                  seq2.items.push({ start: [this.sourceToken] });
              } else
                it.start.push(this.sourceToken);
              return;
            case "space":
            case "comment":
              if (it.value)
                seq2.items.push({ start: [this.sourceToken] });
              else {
                if (this.atIndentedComment(it.start, seq2.indent)) {
                  const prev = seq2.items[seq2.items.length - 2];
                  const end = prev?.value?.end;
                  if (Array.isArray(end)) {
                    arrayPushArray(end, it.start);
                    end.push(this.sourceToken);
                    seq2.items.pop();
                    return;
                  }
                }
                it.start.push(this.sourceToken);
              }
              return;
            case "anchor":
            case "tag":
              if (it.value || this.indent <= seq2.indent)
                break;
              it.start.push(this.sourceToken);
              return;
            case "seq-item-ind":
              if (this.indent !== seq2.indent)
                break;
              if (it.value || includesToken(it.start, "seq-item-ind"))
                seq2.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
          }
          if (this.indent > seq2.indent) {
            const bv = this.startBlockValue(seq2);
            if (bv) {
              this.stack.push(bv);
              return;
            }
          }
          yield* this.pop();
          yield* this.step();
        }
        *flowCollection(fc) {
          const it = fc.items[fc.items.length - 1];
          if (this.type === "flow-error-end") {
            let top;
            do {
              yield* this.pop();
              top = this.peek(1);
            } while (top?.type === "flow-collection");
          } else if (fc.end.length === 0) {
            switch (this.type) {
              case "comma":
              case "explicit-key-ind":
                if (!it || it.sep)
                  fc.items.push({ start: [this.sourceToken] });
                else
                  it.start.push(this.sourceToken);
                return;
              case "map-value-ind":
                if (!it || it.value)
                  fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
                else if (it.sep)
                  it.sep.push(this.sourceToken);
                else
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                return;
              case "space":
              case "comment":
              case "newline":
              case "anchor":
              case "tag":
                if (!it || it.value)
                  fc.items.push({ start: [this.sourceToken] });
                else if (it.sep)
                  it.sep.push(this.sourceToken);
                else
                  it.start.push(this.sourceToken);
                return;
              case "alias":
              case "scalar":
              case "single-quoted-scalar":
              case "double-quoted-scalar": {
                const fs = this.flowScalar(this.type);
                if (!it || it.value)
                  fc.items.push({ start: [], key: fs, sep: [] });
                else if (it.sep)
                  this.stack.push(fs);
                else
                  Object.assign(it, { key: fs, sep: [] });
                return;
              }
              case "flow-map-end":
              case "flow-seq-end":
                fc.end.push(this.sourceToken);
                return;
            }
            const bv = this.startBlockValue(fc);
            if (bv)
              this.stack.push(bv);
            else {
              yield* this.pop();
              yield* this.step();
            }
          } else {
            const parent = this.peek(2);
            if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
              yield* this.pop();
              yield* this.step();
            } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
              const prev = getPrevProps(parent);
              const start = getFirstKeyStartProps(prev);
              fixFlowSeqItems(fc);
              const sep = fc.end.splice(1, fc.end.length);
              sep.push(this.sourceToken);
              const map2 = {
                type: "block-map",
                offset: fc.offset,
                indent: fc.indent,
                items: [{ start, key: fc, sep }]
              };
              this.onKeyLine = true;
              this.stack[this.stack.length - 1] = map2;
            } else {
              yield* this.lineEnd(fc);
            }
          }
        }
        flowScalar(type) {
          if (this.onNewLine) {
            let nl = this.source.indexOf("\n") + 1;
            while (nl !== 0) {
              this.onNewLine(this.offset + nl);
              nl = this.source.indexOf("\n", nl) + 1;
            }
          }
          return {
            type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
          };
        }
        startBlockValue(parent) {
          switch (this.type) {
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
              return this.flowScalar(this.type);
            case "block-scalar-header":
              return {
                type: "block-scalar",
                offset: this.offset,
                indent: this.indent,
                props: [this.sourceToken],
                source: ""
              };
            case "flow-map-start":
            case "flow-seq-start":
              return {
                type: "flow-collection",
                offset: this.offset,
                indent: this.indent,
                start: this.sourceToken,
                items: [],
                end: []
              };
            case "seq-item-ind":
              return {
                type: "block-seq",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken] }]
              };
            case "explicit-key-ind": {
              this.onKeyLine = true;
              const prev = getPrevProps(parent);
              const start = getFirstKeyStartProps(prev);
              start.push(this.sourceToken);
              return {
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, explicitKey: true }]
              };
            }
            case "map-value-ind": {
              this.onKeyLine = true;
              const prev = getPrevProps(parent);
              const start = getFirstKeyStartProps(prev);
              return {
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, key: null, sep: [this.sourceToken] }]
              };
            }
          }
          return null;
        }
        atIndentedComment(start, indent) {
          if (this.type !== "comment")
            return false;
          if (this.indent <= indent)
            return false;
          return start.every((st) => st.type === "newline" || st.type === "space");
        }
        *documentEnd(docEnd) {
          if (this.type !== "doc-mode") {
            if (docEnd.end)
              docEnd.end.push(this.sourceToken);
            else
              docEnd.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
          }
        }
        *lineEnd(token) {
          switch (this.type) {
            case "comma":
            case "doc-start":
            case "doc-end":
            case "flow-seq-end":
            case "flow-map-end":
            case "map-value-ind":
              yield* this.pop();
              yield* this.step();
              break;
            case "newline":
              this.onKeyLine = false;
            // fallthrough
            case "space":
            case "comment":
            default:
              if (token.end)
                token.end.push(this.sourceToken);
              else
                token.end = [this.sourceToken];
              if (this.type === "newline")
                yield* this.pop();
          }
        }
      };
    }
  });

  // browser-config/node_modules/yaml/browser/dist/public-api.js
  function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
    return { lineCounter, prettyErrors };
  }
  function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser = new Parser(lineCounter?.addNewLine);
    const composer = new Composer(options);
    const docs = Array.from(composer.compose(parser.parse(source)));
    if (prettyErrors && lineCounter)
      for (const doc of docs) {
        doc.errors.forEach(prettifyError(source, lineCounter));
        doc.warnings.forEach(prettifyError(source, lineCounter));
      }
    if (docs.length > 0)
      return docs;
    return Object.assign([], { empty: true }, composer.streamInfo());
  }
  function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser = new Parser(lineCounter?.addNewLine);
    const composer = new Composer(options);
    let doc = null;
    for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
      if (!doc)
        doc = _doc;
      else if (doc.options.logLevel !== "silent") {
        doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    }
    if (prettyErrors && lineCounter) {
      doc.errors.forEach(prettifyError(source, lineCounter));
      doc.warnings.forEach(prettifyError(source, lineCounter));
    }
    return doc;
  }
  function parse3(src, reviver, options) {
    let _reviver = void 0;
    if (typeof reviver === "function") {
      _reviver = reviver;
    } else if (options === void 0 && reviver && typeof reviver === "object") {
      options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
      return null;
    doc.warnings.forEach((warning) => warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
      if (doc.options.logLevel !== "silent")
        throw doc.errors[0];
      else
        doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
  }
  function stringify3(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
    }
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      const indent = Math.round(options);
      options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === void 0) {
      const { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return void 0;
    }
    if (isDocument(value) && !_replacer)
      return value.toString(options);
    return new Document(value, _replacer, options).toString(options);
  }
  var init_public_api = __esm({
    "browser-config/node_modules/yaml/browser/dist/public-api.js"() {
      init_composer();
      init_Document();
      init_errors();
      init_log();
      init_identity();
      init_line_counter();
      init_parser2();
    }
  });

  // browser-config/node_modules/yaml/browser/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    Alias: () => Alias,
    CST: () => cst_exports,
    Composer: () => Composer,
    Document: () => Document,
    Lexer: () => Lexer,
    LineCounter: () => LineCounter,
    Pair: () => Pair,
    Parser: () => Parser,
    Scalar: () => Scalar,
    Schema: () => Schema,
    YAMLError: () => YAMLError,
    YAMLMap: () => YAMLMap,
    YAMLParseError: () => YAMLParseError,
    YAMLSeq: () => YAMLSeq,
    YAMLWarning: () => YAMLWarning,
    isAlias: () => isAlias,
    isCollection: () => isCollection,
    isDocument: () => isDocument,
    isMap: () => isMap,
    isNode: () => isNode,
    isPair: () => isPair,
    isScalar: () => isScalar,
    isSeq: () => isSeq,
    parse: () => parse3,
    parseAllDocuments: () => parseAllDocuments,
    parseDocument: () => parseDocument,
    stringify: () => stringify3,
    visit: () => visit3,
    visitAsync: () => visitAsync
  });
  var init_dist = __esm({
    "browser-config/node_modules/yaml/browser/dist/index.js"() {
      init_composer();
      init_Document();
      init_Schema();
      init_errors();
      init_Alias();
      init_identity();
      init_Pair();
      init_Scalar();
      init_YAMLMap();
      init_YAMLSeq();
      init_cst();
      init_lexer();
      init_line_counter();
      init_parser2();
      init_public_api();
      init_visit();
    }
  });

  // browser-config/node_modules/yaml/browser/index.js
  var browser_exports = {};
  __export(browser_exports, {
    Alias: () => Alias,
    CST: () => cst_exports,
    Composer: () => Composer,
    Document: () => Document,
    Lexer: () => Lexer,
    LineCounter: () => LineCounter,
    Pair: () => Pair,
    Parser: () => Parser,
    Scalar: () => Scalar,
    Schema: () => Schema,
    YAMLError: () => YAMLError,
    YAMLMap: () => YAMLMap,
    YAMLParseError: () => YAMLParseError,
    YAMLSeq: () => YAMLSeq,
    YAMLWarning: () => YAMLWarning,
    default: () => browser_default,
    isAlias: () => isAlias,
    isCollection: () => isCollection,
    isDocument: () => isDocument,
    isMap: () => isMap,
    isNode: () => isNode,
    isPair: () => isPair,
    isScalar: () => isScalar,
    isSeq: () => isSeq,
    parse: () => parse3,
    parseAllDocuments: () => parseAllDocuments,
    parseDocument: () => parseDocument,
    stringify: () => stringify3,
    visit: () => visit3,
    visitAsync: () => visitAsync
  });
  var browser_default;
  var init_browser = __esm({
    "browser-config/node_modules/yaml/browser/index.js"() {
      init_dist();
      init_dist();
      browser_default = dist_exports;
    }
  });

  // browser-config/hermes.js
  var require_hermes = __commonJS({
    "browser-config/hermes.js"(exports2, module2) {
      var YAML = (init_browser(), __toCommonJS(browser_exports));
      var KEY = "HERMES_CUSTOM_AIZAMIN_API_KEY";
      var ENDPOINT = "https://aizamin.ir/v1";
      var STT = `"""AI Zamin STT: use Hermes' plugin API, never its model-correcting OpenAI route."""
from agent.transcription_provider import TranscriptionProvider

MODELS = ("whisper-large-v3-turbo", "whisper-large-v3")
ENDPOINT = "https://aizamin.ir/v1"


class AIZaminTranscriptionProvider(TranscriptionProvider):
    @property
    def name(self):
        return "aizamin"

    @property
    def display_name(self):
        return "AI Zamin Whisper"

    def default_model(self):
        return MODELS[0]

    def list_models(self):
        return [{"id": model, "display": model} for model in MODELS]

    def is_available(self):
        from agent.secret_scope import get_secret
        return bool(get_secret("HERMES_CUSTOM_AIZAMIN_API_KEY"))

    def transcribe(self, file_path, *, model=None, language=None, **extra):
        failure = {"success": False, "transcript": "", "provider": self.name}
        model = model or self.default_model()
        if model not in MODELS:
            return {**failure, "error": "Unsupported AI Zamin STT model; choose whisper-large-v3-turbo or whisper-large-v3."}
        try:
            from agent.secret_scope import get_secret
            from hermes_cli.config import load_config
            from openai import OpenAI
            key = get_secret("HERMES_CUSTOM_AIZAMIN_API_KEY")
            if not key:
                return {**failure, "error": "Re-run the AI Zamin configurer to configure your API key."}
            cfg = (load_config().get("stt") or {}).get("aizamin") or {}
            # A purchased gateway key must never be sent to another endpoint.
            base_url = cfg.get("base_url", ENDPOINT)
            if base_url.rstrip("/") != ENDPOINT:
                return {**failure, "error": "AI Zamin STT base_url must be https://aizamin.ir/v1."}
            kwargs = {"model": model, "response_format": "json"}
            if language:
                kwargs["language"] = language
            if extra.get("prompt"):
                kwargs["prompt"] = extra["prompt"]
            with OpenAI(api_key=key, base_url=ENDPOINT, timeout=120, max_retries=0) as client:
                with open(file_path, "rb") as audio:
                    result = client.audio.transcriptions.create(file=audio, **kwargs)
            text = getattr(result, "text", None)
            if not isinstance(text, str) or not text.strip():
                return {**failure, "error": "AI Zamin returned no transcription text."}
            return {"success": True, "transcript": text.strip(), "provider": self.name}
        except Exception:
            # SDK exceptions may contain request/credential details. Do not echo them.
            return {**failure, "error": "AI Zamin transcription failed; check connectivity, credit and model access. No fallback was used."}


def register(ctx):
    ctx.register_transcription_provider(AIZaminTranscriptionProvider())
`;
      function parseDocument2(text) {
        const doc = YAML.parseDocument(text, { uniqueKeys: true });
        if (doc.errors.length || doc.warnings.length) throw Error("YAML \u0645\u0639\u062A\u0628\u0631 \u0648 \u0628\u062F\u0648\u0646 \u062A\u06AF \u0633\u0641\u0627\u0631\u0634\u06CC \u0644\u0627\u0632\u0645 \u0627\u0633\u062A.");
        const c = doc.toJS({ maxAliasCount: 0 });
        if (!c || typeof c !== "object" || Array.isArray(c)) throw Error("config.yaml \u0628\u0627\u06CC\u062F \u06CC\u06A9 mapping \u0628\u0627\u0634\u062F.");
        YAML.visit(doc, { Alias() {
          throw Error("YAML alias \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0627\u0632 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
        }, Pair(_, pair) {
          if (pair.key?.value === "<<") throw Error("YAML merge \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.");
        } });
        return { doc, c };
      }
      function parseYAML(text) {
        return parseDocument2(text).c;
      }
      async function planHermes(p, read, consent = {}) {
        if (!consent.profileConfirmed || !consent.unmanagedConfirmed || !consent.pluginsConfirmed) throw Error("\u062A\u0623\u06CC\u06CC\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0641\u0639\u0627\u0644\u060C \u0646\u0628\u0648\u062F \u0633\u06CC\u0627\u0633\u062A \u0645\u062F\u06CC\u0631\u06CC\u062A\u06CC \u0648 \u0646\u0635\u0628 \u0627\u0641\u0632\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u062A\u0635\u0648\u06CC\u0631/\u0635\u062F\u0627 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A.");
        if (await read(".managed") !== null) throw Error("\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062F\u0627\u0631\u0627\u06CC \u0646\u0634\u0627\u0646 \u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0633\u062A\u061B \u0641\u0642\u0637 \u0645\u062F\u06CC\u0631 \u0633\u06CC\u0633\u062A\u0645 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062A\u0646\u0638\u06CC\u0645 \u06A9\u0646\u062F.");
        const text = await read("config.yaml");
        if (text === null) throw Error("config.yaml \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F\u061B \u067E\u0648\u0634\u0647\u0654 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0648\u062C\u0648\u062F \u0648 \u0641\u0639\u0627\u0644 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.");
        const { doc, c } = parseDocument2(text);
        const env = await read(".env") ?? "";
        if (env.includes("HERMES_MANAGED") || c.secrets) throw Error("\u0633\u06CC\u0627\u0633\u062A \u0645\u062F\u06CC\u0631\u06CC\u062A\u06CC \u06CC\u0627 \u0645\u0646\u0628\u0639 secrets \u062E\u0627\u0631\u062C\u06CC \u067E\u06CC\u062F\u0627 \u0634\u062F\u061B \u0627\u062F\u0627\u0645\u0647 \u0641\u0642\u0637 \u0627\u0632 \u0645\u0633\u06CC\u0631 \u0631\u0633\u0645\u06CC Hermes.");
        const vision = c.auxiliary?.vision;
        if (vision && Object.keys(vision).some((k) => !["provider", "model"].includes(k))) throw Error("vision \u062F\u0627\u0631\u0627\u06CC \u062A\u0646\u0638\u06CC\u0645 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0627\u0633\u062A\u061B \u0628\u0631\u0627\u06CC \u062D\u0641\u0638 \u062C\u062F\u0627\u0633\u0627\u0632\u06CC \u0627\u0639\u062A\u0628\u0627\u0631 \u0627\u0632 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
        if (env.includes(KEY) || JSON.stringify(c).toLowerCase().includes("aizamin")) throw Error("\u062A\u0646\u0638\u06CC\u0645 \u0642\u0628\u0644\u06CC AI Zamin \u067E\u06CC\u062F\u0627 \u0634\u062F\u061B \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0644\u06CC\u062F \u06CC\u0627 \u0645\u0647\u0627\u062C\u0631\u062A \u0641\u0642\u0637 \u0628\u0627 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u0631\u0633\u0645\u06CC \u0627\u0646\u062C\u0627\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F.");
        for (const path of ["auth.json", "provider_models_cache.json"]) {
          const raw = await read(path);
          if (raw !== null) {
            let data;
            try {
              data = JSON.parse(raw);
            } catch {
              throw Error("\u0641\u0627\u06CC\u0644 \u0627\u0639\u062A\u0628\u0627\u0631 \u06CC\u0627 cache \u062E\u0631\u0627\u0628 \u0627\u0633\u062A.");
            }
            if (JSON.stringify(data).toLowerCase().includes("aizamin") || JSON.stringify(data).includes(KEY) || path === "auth.json" && Object.keys(data.credential_pool || {}).some((k) => k.startsWith("custom"))) throw Error("\u0627\u0639\u062A\u0628\u0627\u0631 \u0633\u0641\u0627\u0631\u0634\u06CC \u0642\u0628\u0644\u06CC \u067E\u06CC\u062F\u0627 \u0634\u062F\u061B \u0628\u0631\u0627\u06CC \u062C\u0644\u0648\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u062A\u062F\u0627\u062E\u0644 \u0627\u0632 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
          }
        }
        if (!/^[A-Za-z0-9._-]+$/.test(p.key)) throw Error("\u0642\u0627\u0644\u0628 \u06A9\u0644\u06CC\u062F \u0628\u0631\u0627\u06CC \u0646\u0648\u0634\u062A\u0646 \u0627\u0645\u0646 \u062F\u0631 env \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.");
        const record = (value) => {
          if (value !== void 0 && (!value || typeof value !== "object" || Array.isArray(value))) throw Error("\u0633\u0627\u062E\u062A\u0627\u0631 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0627\u0633\u0627\u0632\u06AF\u0627\u0631 \u0627\u0633\u062A.");
        };
        for (const key of ["providers", "stt", "image_gen", "auxiliary", "plugins", "platform_toolsets", "agent"]) record(c[key]);
        const list = (v) => {
          if (v !== void 0 && (!Array.isArray(v) || v.some((x) => typeof x !== "string"))) throw Error("\u0641\u0647\u0631\u0633\u062A \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0627\u0633\u0627\u0632\u06AF\u0627\u0631 \u0627\u0633\u062A.");
          return v || [];
        };
        if (list(c.agent?.disabled_toolsets).length || list(c.plugins?.disabled).some((x) => ["aizamin", "aizamin-stt", "stt/aizamin", "image_gen/aizamin"].includes(x))) throw Error("\u0627\u0628\u0632\u0627\u0631 \u06CC\u0627 \u0627\u0641\u0632\u0648\u0646\u0647 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u0627\u0628\u062A\u062F\u0627 \u0633\u06CC\u0627\u0633\u062A \u0622\u0646 \u0631\u0627 \u062F\u0631 Hermes \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F.");
        const set2 = (path, value) => doc.setIn(path.split("."), value);
        set2("providers.aizamin", { api: ENDPOINT, key_env: KEY, transport: "chat_completions", default_model: p.model, models: p.catalog, models_discovered: true, discover_models: false });
        for (const [path, value] of Object.entries({ "stt.aizamin.base_url": ENDPOINT, "stt.aizamin.model": "whisper-large-v3-turbo", "stt.provider": "aizamin", "stt.enabled": true, "image_gen.provider": "aizamin", "image_gen.aizamin.model": "gpt-image-2.5-flare-medium", "auxiliary.vision.provider": "aizamin", "auxiliary.vision.model": p.model })) set2(path, value);
        set2("plugins.enabled", [.../* @__PURE__ */ new Set([...list(c.plugins?.enabled), "image_gen/aizamin", "stt/aizamin"])]);
        for (const name of ["image_gen/aizamin", "stt/aizamin"]) doc.setIn(["plugins", "entries", name, "allow_tool_override"], false);
        for (const [platform, tools] of Object.entries(c.platform_toolsets || {})) doc.setIn(["platform_toolsets", platform], [.../* @__PURE__ */ new Set([...list(tools), "image_gen", "vision"])]);
        const files = [];
        for (const name of ["plugin.yaml", "__init__.py"]) {
          if (!p.plugin?.[name]) throw Error("\u0627\u0641\u0632\u0648\u0646\u0647\u0654 \u062A\u0635\u0648\u06CC\u0631 \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A.");
          files.push({ path: "plugins/image_gen/aizamin/" + name, text: p.plugin[name] });
        }
        files.push({ path: "plugins/stt/aizamin/plugin.yaml", text: "name: aizamin-stt\nversion: 1.0.0\ndescription: AI Zamin Whisper speech transcription\n" }, { path: "plugins/stt/aizamin/__init__.py", text: STT });
        for (const f of files) if (await read(f.path) !== null) throw Error("\u0627\u0641\u0632\u0648\u0646\u0647\u0654 \u0642\u0628\u0644\u06CC \u067E\u06CC\u062F\u0627 \u0634\u062F\u061B \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646\u06CC \u0645\u0633\u062A\u0642\u06CC\u0645 \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A.");
        const output = doc.toString();
        parseYAML(output);
        files.push({ path: ".env", text: env + (env && !env.endsWith("\n") ? "\n" : "") + KEY + "=" + p.key + "\n" }, { path: "config.yaml", text: output });
        return files;
      }
      module2.exports = { planHermes, parseYAML };
    }
  });

  // browser-config/direct.js
  var require_direct = __commonJS({
    "browser-config/direct.js"(exports2, module2) {
      var jsonc = (init_main(), __toCommonJS(main_exports));
      var toml = { parse: require_parse_string(), stringify: require_stringify() };
      var { planHermes, parseYAML } = require_hermes();
      var enc = new TextEncoder();
      function object(value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("\u0633\u0627\u062E\u062A\u0627\u0631 \u0641\u0627\u06CC\u0644 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A\u061B \u0647\u06CC\u0686 \u0641\u0627\u06CC\u0644\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0646\u06A9\u0631\u062F.");
        return value;
      }
      function parseJSON(text) {
        const errors = [];
        const value = jsonc.parse(text, errors, { allowTrailingComma: true });
        if (errors.length) throw new Error("\u0641\u0627\u06CC\u0644 JSON/JSONC \u062E\u0631\u0627\u0628 \u0627\u0633\u062A\u061B \u0627\u0628\u062A\u062F\u0627 \u0622\u0646 \u0631\u0627 \u0627\u0635\u0644\u0627\u062D \u06A9\u0646\u06CC\u062F.");
        return object(value);
      }
      function parseTOML(text) {
        try {
          return toml.parse(text);
        } catch {
          throw new Error("\u0641\u0627\u06CC\u0644 TOML \u062E\u0631\u0627\u0628 \u0627\u0633\u062A\u061B \u0627\u0628\u062A\u062F\u0627 \u0622\u0646 \u0631\u0627 \u0627\u0635\u0644\u0627\u062D \u06A9\u0646\u06CC\u062F.");
        }
      }
      function section(parent, key) {
        if (Object.hasOwn(parent, key)) return object(parent[key]);
        return parent[key] = {};
      }
      function capability(app, env = globalThis) {
        if (!env.isSecureContext || typeof env.showDirectoryPicker !== "function") return { ok: false, reason: "\u0627\u06CC\u0646 \u0645\u0631\u0648\u0631\u06AF\u0631 \u062F\u0633\u062A\u0631\u0633\u06CC \u0646\u0648\u0634\u062A\u0646 \u067E\u0648\u0634\u0647 \u0646\u062F\u0627\u0631\u062F. \u0627\u0632 Chrome \u06CC\u0627 Edge \u062F\u0633\u06A9\u062A\u0627\u067E \u0631\u0648\u06CC HTTPS\u060C \u06CC\u0627 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u062F\u0627\u0646\u0644\u0648\u062F\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F." };
        if (app === "hermes") return { ok: true, reason: "Hermes: \u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0648\u0644\u06CC\u0647 \u0628\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0634\u062E\u0635\u06CC \u0648 \u063A\u06CC\u0631\u0645\u062F\u06CC\u0631\u06CC\u062A\u06CC\u061B \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0644\u06CC\u062F \u06CC\u0627 \u0645\u0647\u0627\u062C\u0631\u062A \u062A\u0646\u0638\u06CC\u0645 \u0642\u0628\u0644\u06CC \u0641\u0642\u0637 \u0628\u0627 \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631." };
        return { ok: true, reason: "" };
      }
      function absolutePath(path, os) {
        path = path.trim().replaceAll("\\", "/").replace(/\/+$/, "");
        if (/[\x00-\x1f\x7f]/.test(path) || path.split("/").some((s) => s === "." || s === "..") || (os === "windows" ? !/^[A-Za-z]:\//.test(path) : !path.startsWith("/"))) throw new Error("\u0645\u0633\u06CC\u0631 \u0645\u0637\u0644\u0642 \u067E\u0648\u0634\u0647 \u0631\u0627 \u062F\u0642\u06CC\u0642\u0627\u064B \u0627\u0632 \u0646\u0648\u0627\u0631 \u0646\u0634\u0627\u0646\u06CC \u0641\u0627\u06CC\u0644\u200C\u0645\u0646\u06CC\u062C\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F\u061B \u0645\u0633\u06CC\u0631 \u0646\u0633\u0628\u06CC \u06CC\u0627 ~ \u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0646\u06CC\u0633\u062A.");
        return path;
      }
      async function plan(artifact, read, absolute = "", binary2 = null, consent = {}) {
        const p = artifact.payload;
        const output = [];
        const add = (path, text) => output.push({ path, text });
        if (p.app === "hermes") {
          output.push(...await planHermes(p, read, consent));
        } else if (p.app === "opencode") {
          let path = "opencode.jsonc", text = await read(path);
          if (text === null) {
            path = "opencode.json";
            text = await read(path);
          }
          if (text === null) {
            path = "opencode.jsonc";
            text = "{}\n";
          }
          const data = parseJSON(text);
          section(data, "provider");
          const agents = section(data, "agent");
          for (const name of ["build", "plan"]) section(section(agents, name), "options");
          const edits = [[["provider", "openai"], p.provider], [["agent", "build", "options", "store"], false], [["agent", "plan", "options", "store"], false], [["$schema"], "https://opencode.ai/config.json"]];
          for (const [path2, value] of edits) text = jsonc.applyEdits(text, jsonc.modify(text, path2, value, { formattingOptions: { insertSpaces: true, tabSize: 2, eol: "\n" } }));
          parseJSON(text);
          add(path, text);
          add("aizamin-image.json", JSON.stringify({ apiKey: p.key }, null, 2) + "\n");
          add("tools/aizamin_image.ts", p.tool);
        } else if (p.app === "codex") {
          absolute = absolutePath(absolute, artifact.os);
          if (!binary2 || binary2.length < 2) throw new Error("\u0641\u0627\u06CC\u0644 \u0627\u0628\u0632\u0627\u0631 \u062A\u0635\u0648\u06CC\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
          const c = parseTOML(await read("config.toml") ?? "");
          Object.assign(c, { model_provider: "OpenAI", model: "gpt-5.5", review_model: "gpt-5.5", model_reasoning_effort: "xhigh", disable_response_storage: true, cli_auth_credentials_store: "file", forced_login_method: "api" });
          section(c, "model_providers").OpenAI = { name: "OpenAI", base_url: "https://aizamin.ir/v1", wire_api: "responses", requires_openai_auth: true };
          section(c, "features").goals = true;
          const name = "aizamin/aizamin-image" + (artifact.os === "windows" ? ".exe" : "");
          section(c, "mcp_servers").aizamin_image = { command: absolute + "/" + name, args: ["--mcp"], tool_timeout_sec: 360, env: { AIZAMIN_IMAGE_KEY: p.key } };
          const auth = await read("auth.json");
          if (auth !== null) parseJSON(auth);
          output.push({ path: name, bytes: binary2 });
          const result = toml.stringify(c);
          parseTOML(result);
          add("config.toml", result);
          add("auth.json", JSON.stringify({ OPENAI_API_KEY: p.key }, null, 2) + "\n");
        } else throw new Error(capability(p.app).reason);
        return output;
      }
      async function fileHandle(root, path, create = false) {
        let dir = root;
        const parts = path.split("/");
        for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create });
        return dir.getFileHandle(parts.at(-1), { create });
      }
      async function bytes(root, path) {
        try {
          const file = await (await fileHandle(root, path)).getFile();
          if (file.size > 32 * 1024 * 1024) throw new Error("\u0641\u0627\u06CC\u0644 \u0628\u0632\u0631\u06AF\u200C\u062A\u0631 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A.");
          return new Uint8Array(await file.arrayBuffer());
        } catch (e) {
          if (e.name === "NotFoundError") return null;
          throw e;
        }
      }
      function equal(a, b) {
        return a === null || b === null ? a === b : a.length === b.length && a.every((v, i) => v === b[i]);
      }
      async function write(root, path, data) {
        const stream = await (await fileHandle(root, path, true)).createWritable();
        try {
          await stream.write(data);
          await stream.close();
        } catch (e) {
          try {
            await stream.abort();
          } catch {
          }
          throw e;
        }
        if (!equal(await bytes(root, path), data)) throw new Error("\u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0641\u0627\u06CC\u0644 \u0628\u0627 \u0646\u062A\u06CC\u062C\u0647\u0654 \u0645\u0648\u0631\u062F \u0627\u0646\u062A\u0638\u0627\u0631 \u06CC\u06A9\u0633\u0627\u0646 \u0646\u06CC\u0633\u062A.");
      }
      async function preflight(root, artifact, absolute, binary2, consent = {}) {
        const snapshots = /* @__PURE__ */ new Map();
        async function read(path) {
          const b = await bytes(root, path);
          snapshots.set(path, b);
          return b === null ? null : new TextDecoder("utf-8", { fatal: true }).decode(b);
        }
        const files = await plan(artifact, read, absolute, binary2, consent);
        for (const f of files) {
          if (!snapshots.has(f.path)) snapshots.set(f.path, await bytes(root, f.path));
          f.bytes = f.bytes || enc.encode(f.text);
          delete f.text;
        }
        return { files, snapshots };
      }
      async function apply(root, prepared, onProgress = () => {
      }) {
        for (const [path, before] of prepared.snapshots) if (!equal(await bytes(root, path), before)) throw new Error("\u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u067E\u0633 \u0627\u0632 \u0628\u0631\u0631\u0633\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F\u0647\u200C\u0627\u0646\u062F\u061B \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F. \u0647\u06CC\u0686 \u062A\u0646\u0638\u06CC\u0645\u06CC \u0646\u0648\u0634\u062A\u0647 \u0646\u0634\u062F.");
        const suffix = ".aizamin.backup." + (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-") + "-" + crypto.randomUUID();
        const backups = [], written = [];
        try {
          for (const f of prepared.files) {
            const old = prepared.snapshots.get(f.path);
            if (old !== null) {
              const backup = f.path + suffix;
              if (await bytes(root, backup) !== null) throw new Error("Backup collision");
              await write(root, backup, old);
              backups.push(backup);
              onProgress({ backups: [...backups], written: [...written] });
            }
          }
          for (const f of prepared.files) {
            await write(root, f.path, f.bytes);
            written.push(f.path);
            onProgress({ backups: [...backups], written: [...written] });
          }
          return { backups, written };
        } catch {
          const error = new Error("\u0639\u0645\u0644\u06CC\u0627\u062A \u06A9\u0627\u0645\u0644 \u0646\u0634\u062F. \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0628\u0639\u0636\u06CC \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0646\u0648\u0634\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627\u0634\u0646\u062F\u061B \u0628\u0631\u0646\u0627\u0645\u0647 \u0631\u0627 \u0627\u062C\u0631\u0627 \u0646\u06A9\u0646\u06CC\u062F. \u0641\u0647\u0631\u0633\u062A \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u062A\u0623\u06CC\u06CC\u062F\u0634\u062F\u0647 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F.");
          error.result = { backups, written };
          throw error;
        }
      }
      async function savedHandle(app, value) {
        const db = await new Promise((resolve, reject) => {
          const req = indexedDB.open("aizamin-setup-folders", 1);
          req.onupgradeneeded = () => req.result.createObjectStore("handles");
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        try {
          return await new Promise((resolve, reject) => {
            const tx = db.transaction("handles", value ? "readwrite" : "readonly");
            const req = value ? tx.objectStore("handles").put(value, app) : tx.objectStore("handles").get(app);
            let result;
            req.onsuccess = () => {
              result = req.result;
            };
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error);
          });
        } finally {
          db.close();
        }
      }
      function mount(getArtifact) {
        const dialog = document.querySelector("[data-direct-dialog]");
        const status = dialog.querySelector("[data-direct-status]");
        const details = dialog.querySelector("[data-direct-files]");
        const picker = dialog.querySelector("[data-direct-pick]");
        const check = dialog.querySelector("[data-direct-check]");
        const commit = dialog.querySelector("[data-direct-write]");
        const close = dialog.querySelector("[data-direct-close]");
        const pathInput = dialog.querySelector("[data-direct-path]");
        const consent = dialog.querySelector("[data-direct-confirm]");
        const hermesChecks = [...dialog.querySelectorAll("[data-hermes-consent]")];
        hermesChecks.forEach((el) => el.addEventListener("change", () => {
          pending();
        }));
        let artifact, root, remembered, prepared, busy = false;
        const message = (text) => {
          status.textContent = text;
        };
        const pending = () => {
          prepared = null;
          consent.checked = false;
          commit.disabled = true;
          details.textContent = "";
        };
        const lock = (value) => {
          busy = value;
          picker.disabled = value;
          check.disabled = value || !root;
          close.disabled = value;
          commit.disabled = true;
          pathInput.disabled = value;
          consent.disabled = value;
          hermesChecks.forEach((el) => {
            el.disabled = value;
          });
        };
        dialog.addEventListener("cancel", (e) => {
          if (busy) e.preventDefault();
        });
        close.addEventListener("click", () => {
          if (!busy) {
            pending();
            artifact = null;
            root = null;
            dialog.close();
          }
        });
        pathInput.addEventListener("input", pending);
        consent.addEventListener("change", () => {
          commit.disabled = busy || !prepared || !consent.checked;
        });
        document.querySelectorAll("[data-direct]").forEach((button) => {
          const support = capability(button.dataset.direct);
          button.disabled = !support.ok;
          const reason = document.createElement("small");
          reason.textContent = support.reason;
          button.parentElement.after(reason);
          button.addEventListener("click", () => {
            artifact = getArtifact(button.dataset.direct);
            if (!artifact) return;
            pending();
            root = null;
            remembered = null;
            pathInput.value = "";
            consent.checked = false;
            lock(false);
            const codex = artifact.payload.app === "codex";
            dialog.querySelector("[data-hermes-options]").hidden = artifact.payload.app !== "hermes";
            hermesChecks.forEach((el) => {
              el.checked = false;
            });
            dialog.querySelector("[data-direct-path-label]").hidden = !codex;
            dialog.querySelector("[data-direct-title]").textContent = "\u062A\u0646\u0638\u06CC\u0645 \u0645\u0633\u062A\u0642\u06CC\u0645 " + artifact.payload.app;
            dialog.querySelector("[data-direct-guide]").textContent = artifact.payload.app === "hermes" ? "\u06F1. \u062F\u0631 Hermes \u0645\u0633\u06CC\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0641\u0639\u0627\u0644 \u0631\u0627 \u0628\u0627 hermes config path \u0648 hermes config env-path \u0645\u0634\u062E\u0635 \u06A9\u0646\u06CC\u062F\u061B \u0633\u067E\u0633 \u0647\u0645\u0647\u0654 \u067E\u0646\u062C\u0631\u0647\u200C\u0647\u0627 \u0648 gateway \u0622\u0646 \u0631\u0627 \u0628\u0628\u0646\u062F\u06CC\u062F \u0648 \u062F\u0642\u06CC\u0642\u0627\u064B \u0647\u0645\u0627\u0646 \u067E\u0648\u0634\u0647\u0654 \u062F\u0627\u0631\u0627\u06CC config.yaml \u0648 .env \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F. \u0645\u0633\u06CC\u0631 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u062F\u0631 macOS/Linux \u0628\u0631\u0627\u0628\u0631 ~/.hermes \u0648 \u062F\u0631 Windows \u0628\u0631\u0627\u0628\u0631 %LOCALAPPDATA%\\hermes \u0627\u0633\u062A\u061B \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u06CC\u0627 HERMES_HOME \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0645\u062A\u0641\u0627\u0648\u062A \u0628\u0627\u0634\u062F. \u0645\u0631\u0648\u0631\u06AF\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0641\u0639\u0627\u0644 \u0648 \u0633\u06CC\u0627\u0633\u062A \u0628\u06CC\u0631\u0648\u0646 \u067E\u0648\u0634\u0647 \u0631\u0627 \u062A\u0634\u062E\u06CC\u0635 \u0646\u0645\u06CC\u200C\u062F\u0647\u062F. \u0641\u0642\u0637 \u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0648\u0644\u06CC\u0647 \u0628\u0647 \u0646\u0635\u0628 \u0634\u062E\u0635\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u062A\u0646\u0638\u06CC\u0645 \u06CC\u0627 \u06A9\u0644\u06CC\u062F \u0642\u0628\u0644\u06CC AI Zamin \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F." : codex ? "\u06F1. Codex \u0631\u0627 \u0628\u0628\u0646\u062F\u06CC\u062F. \u067E\u0648\u0634\u0647\u0654 CODEX_HOME \u06CC\u0627 \u067E\u0648\u0634\u0647\u0654 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 .codex \u062F\u0631 \u062E\u0627\u0646\u0647\u0654 \u06A9\u0627\u0631\u0628\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F (Windows: %USERPROFILE%\\.codex\u061B macOS/Linux: ~/.codex). \u0627\u06AF\u0631 \u0646\u06CC\u0633\u062A\u060C \u062E\u0648\u062F\u062A\u0627\u0646 \u062F\u0631 \u0641\u0627\u06CC\u0644\u200C\u0645\u0646\u06CC\u062C\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F. \u0645\u0633\u06CC\u0631 \u06A9\u0627\u0645\u0644 \u0647\u0645\u0627\u0646 \u067E\u0648\u0634\u0647 \u0631\u0627 \u0648\u0627\u0631\u062F \u0648 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F\u061B \u0645\u0631\u0648\u0631\u06AF\u0631 \u0645\u0633\u06CC\u0631 \u0648\u0627\u0642\u0639\u06CC \u0631\u0627 \u0646\u0645\u06CC\u200C\u062F\u0627\u0646\u062F. \u0627\u0628\u0632\u0627\u0631 \u062A\u0635\u0648\u06CC\u0631 \u0628\u0648\u0645\u06CC \u0647\u0645 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648 \u062F\u0631 \u0647\u0645\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0646\u0648\u0634\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F." : "\u06F1. OpenCode \u0631\u0627 \u0628\u0628\u0646\u062F\u06CC\u062F. \u0641\u0642\u0637 \u067E\u0648\u0634\u0647\u0654 opencode \u062F\u0627\u062E\u0644 XDG_CONFIG_HOME \u06CC\u0627 \u067E\u0648\u0634\u0647\u0654 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 ~/.config/opencode \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F (Windows: %USERPROFILE%\\.config\\opencode). \u0627\u06AF\u0631 \u0646\u06CC\u0633\u062A\u060C \u062F\u0631 \u0641\u0627\u06CC\u0644\u200C\u0645\u0646\u06CC\u062C\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F. \u062A\u0646\u0638\u06CC\u0645 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0648 provider\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631 \u062D\u0641\u0638 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F\u061B provider openai \u0628\u0627 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A AI Zamin \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0645\u06CC\u200C\u0634\u0648\u062F.";
            message("\u0645\u0631\u0648\u0631\u06AF\u0631 \u0641\u0642\u0637 \u0628\u0647 \u067E\u0648\u0634\u0647\u200C\u0627\u06CC \u06A9\u0647 \u062A\u0623\u06CC\u06CC\u062F \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F \u062F\u0633\u062A\u0631\u0633\u06CC \u0645\u06CC\u200C\u06AF\u06CC\u0631\u062F. \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0628\u0647 \u0633\u0631\u0648\u0631 \u0627\u0631\u0633\u0627\u0644 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F. \u0634\u0631\u0648\u0639 \u0627\u0632 \u067E\u0648\u0634\u0647\u0654 \u0642\u0628\u0644\u06CC \u06CC\u0627 Documents \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0631\u0641\u062A\u0646 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0628\u0647 \u0645\u0633\u06CC\u0631 \u062F\u0644\u062E\u0648\u0627\u0647 \u0645\u0645\u06A9\u0646 \u0646\u06CC\u0633\u062A.");
            dialog.showModal();
            savedHandle(artifact.payload.app).then((h) => {
              remembered = h;
            }).catch(() => {
            });
          });
        });
        picker.addEventListener("click", async () => {
          pending();
          root = null;
          lock(true);
          try {
            const h = await showDirectoryPicker({ id: "aizamin-" + artifact.payload.app, mode: "readwrite", startIn: remembered || "documents" });
            if (artifact.payload.app === "opencode" && h.name !== "opencode") throw new Error("\u0641\u0642\u0637 \u067E\u0648\u0634\u0647\u0654 opencode \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.");
            if (await h.queryPermission({ mode: "readwrite" }) !== "granted") throw new Error("\u0645\u062C\u0648\u0632 \u0646\u0648\u0634\u062A\u0646 \u067E\u0648\u0634\u0647 \u062F\u0627\u062F\u0647 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
            root = h;
            remembered = h;
            await savedHandle(artifact.payload.app, h).catch(() => {
            });
            message("\u06F2. \u067E\u0648\u0634\u0647\u0654 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647: " + h.name + " \u2014 \u0627\u06A9\u0646\u0648\u0646 \u0628\u0631\u0631\u0633\u06CC \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0631\u0627 \u0628\u0632\u0646\u06CC\u062F. \u0642\u0628\u0644 \u0627\u0632 \u0646\u0648\u0634\u062A\u0646\u060C \u0641\u0647\u0631\u0633\u062A \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.");
          } catch (e) {
            message(e.name === "AbortError" ? "\u0627\u0646\u062A\u062E\u0627\u0628 \u0644\u063A\u0648 \u0634\u062F\u061B \u0647\u06CC\u0686 \u0641\u0627\u06CC\u0644\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0646\u06A9\u0631\u062F." : e.name === "NotAllowedError" ? "\u062F\u0633\u062A\u0631\u0633\u06CC \u0631\u062F \u0634\u062F\u061B \u062A\u0646\u0638\u06CC\u0645\u200C\u06AF\u0631 \u062F\u0627\u0646\u0644\u0648\u062F\u06CC \u0647\u0645\u0686\u0646\u0627\u0646 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0627\u0633\u062A." : e.message);
          } finally {
            lock(false);
          }
        });
        check.addEventListener("click", async () => {
          pending();
          lock(true);
          message("\u062F\u0631 \u062D\u0627\u0644 \u0628\u0631\u0631\u0633\u06CC \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0648 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0628\u0632\u0627\u0631 \u0644\u0627\u0632\u0645\u061B \u0647\u0646\u0648\u0632 \u0686\u06CC\u0632\u06CC \u0646\u0648\u0634\u062A\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F\u2026");
          try {
            let binary2 = null, absolute = "";
            if (artifact.payload.app === "codex") {
              absolute = absolutePath(pathInput.value, artifact.os);
              if (absolute.split("/").at(-1) !== root.name) throw new Error("\u0646\u0627\u0645 \u0627\u0646\u062A\u0647\u0627\u06CC \u0645\u0633\u06CC\u0631 \u0628\u0627 \u067E\u0648\u0634\u0647\u0654 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u06CC\u06A9\u06CC \u0646\u06CC\u0633\u062A.");
            }
            if (artifact.payload.app === "codex") {
              const response = await fetch(artifact.binaryUrl, { credentials: "same-origin", redirect: "error" });
              if (!response.ok) throw new Error("\u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0628\u0632\u0627\u0631 \u062A\u0635\u0648\u06CC\u0631 \u0627\u0646\u062C\u0627\u0645 \u0646\u0634\u062F\u061B \u0647\u06CC\u0686 \u0641\u0627\u06CC\u0644\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0646\u06A9\u0631\u062F.");
              binary2 = new Uint8Array(await response.arrayBuffer());
              const magic = artifact.os === "windows" ? [77, 90] : artifact.os === "linux" ? [127, 69, 76, 70] : [207, 250, 237, 254];
              if (binary2.length < 1024 || !magic.every((v, i) => binary2[i] === v)) throw new Error("\u0641\u0627\u06CC\u0644 \u0627\u0628\u0632\u0627\u0631 \u062A\u0635\u0648\u06CC\u0631 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
            }
            prepared = await preflight(root, artifact, absolute, binary2, Object.fromEntries(hermesChecks.map((el) => [el.dataset.hermesConsent, el.checked])));
            details.textContent = prepared.files.map((f) => (prepared.snapshots.get(f.path) === null ? "\u0627\u06CC\u062C\u0627\u062F: " : "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u0648 \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646\u06CC: ") + f.path).join("\n");
            message(artifact.payload.app === "hermes" ? "\u06F3. \u0627\u0641\u0632\u0648\u062F\u0646 provider \u062C\u062F\u0627\u06AF\u0627\u0646\u0647\u060C \u06A9\u0644\u06CC\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u06CC \u0648 \u0627\u0641\u0632\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u062A\u0635\u0648\u06CC\u0631/\u0635\u062F\u0627 \u0631\u0627 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F. \u0645\u062F\u0644 \u0686\u062A \u0641\u0639\u0627\u0644\u060C auth.json \u0648 \u06A9\u0644\u06CC\u062F\u0647\u0627\u06CC \u0642\u0628\u0644\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0645\u06CC\u200C\u06A9\u0646\u0646\u062F. \u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0635\u0648\u06CC\u0631\u060C vision \u0648 STT \u0628\u0647 AI Zamin \u062A\u063A\u06CC\u06CC\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061B \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0642\u0628\u0644\u06CC \u0622\u0646\u200C\u0647\u0627 \u0628\u0627\u0642\u06CC \u0645\u06CC\u200C\u0645\u0627\u0646\u062F. \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627 \u062D\u0627\u0648\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062E\u0635\u0648\u0635\u06CC \u0647\u0633\u062A\u0646\u062F\u061B \u0645\u0631\u0648\u0631\u06AF\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0645\u062C\u0648\u0632\u0647\u0627\u06CC Unix \u0631\u0627 \u0645\u062D\u062F\u0648\u062F \u06A9\u0646\u062F." : "\u06F3. \u0641\u0647\u0631\u0633\u062A \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u0648 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F. \u0627\u0628\u062A\u062F\u0627 \u0627\u0632 \u062A\u0645\u0627\u0645 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0645\u0648\u062C\u0648\u062F \u0646\u0633\u062E\u0647\u0654 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u062F\u0631 \u0647\u0645\u0627\u0646 \u067E\u0648\u0634\u0647 \u0633\u0627\u062E\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F. \u0642\u0627\u0644\u0628 TOML \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0628\u0627\u0632\u0646\u0648\u06CC\u0633\u06CC \u0634\u0648\u062F\u061B \u0627\u0635\u0644 \u0641\u0627\u06CC\u0644 \u062F\u0631 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F. \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u06A9\u0644\u06CC\u062F \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u0631\u0627 \u062E\u0635\u0648\u0635\u06CC \u0646\u06AF\u0647 \u062F\u0627\u0631\u06CC\u062F\u061B \u0645\u0631\u0648\u0631\u06AF\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0645\u062C\u0648\u0632\u0647\u0627\u06CC Unix \u0631\u0627 \u0645\u062D\u062F\u0648\u062F \u06A9\u0646\u062F.");
          } catch (e) {
            message(artifact.payload.app === "hermes" ? "\u0628\u0631\u0631\u0633\u06CC \u0645\u062A\u0648\u0642\u0641 \u0634\u062F: " + e.message : "\u0628\u0631\u0631\u0633\u06CC \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F\u061B \u0645\u0633\u06CC\u0631\u060C \u0645\u062C\u0648\u0632 \u0648 \u0633\u0644\u0627\u0645\u062A \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC JSON/TOML \u06CC\u0627 \u062F\u0627\u0646\u0644\u0648\u062F \u0627\u0628\u0632\u0627\u0631 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F. \u0647\u06CC\u0686 \u062A\u0646\u0638\u06CC\u0645\u06CC \u0646\u0648\u0634\u062A\u0647 \u0646\u0634\u062F.");
          } finally {
            lock(false);
            commit.disabled = !prepared || !consent.checked;
          }
        });
        commit.addEventListener("click", async () => {
          if (!prepared || !consent.checked) return;
          lock(true);
          const report = (result) => {
            details.textContent = "\u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0648 \u062A\u0623\u06CC\u06CC\u062F\u0634\u062F\u0647:\n" + result.written.join("\n") + "\n\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627:\n" + result.backups.join("\n");
          };
          try {
            const result = await apply(root, prepared, report);
            report(result);
            if (artifact.payload.app === "hermes") {
              message("\u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC Hermes \u0645\u0633\u062A\u0642\u06CC\u0645\u0627\u064B \u0646\u0648\u0634\u062A\u0647 \u0648 \u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0634\u062F\u0646\u062F\u061B \u0641\u0627\u06CC\u0644 \u0627\u062C\u0631\u0627\u06CC\u06CC \u0644\u0627\u0632\u0645 \u0646\u06CC\u0633\u062A. \u062F\u0633\u062A\u0631\u0633\u06CC \u067E\u0648\u0634\u0647 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627 \u0631\u0627 \u062E\u0635\u0648\u0635\u06CC \u0646\u06AF\u0647 \u062F\u0627\u0631\u06CC\u062F \u0648 Hermes \u0631\u0627 \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F. \u0645\u062F\u0644 \u0686\u062A \u0641\u0639\u0627\u0644 \u062D\u0641\u0638 \u0634\u062F. \u0633\u0627\u0632\u06AF\u0627\u0631\u06CC \u0646\u0633\u062E\u0647 \u0648 \u0627\u062C\u0631\u0627\u06CC \u0648\u0627\u0642\u0639\u06CC \u0686\u062A/\u062A\u0635\u0648\u06CC\u0631/\u0635\u062F\u0627 \u062F\u0631 \u0645\u0631\u0648\u0631\u06AF\u0631 \u0622\u0632\u0645\u0627\u06CC\u0634 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0627\u06AF\u0631 \u0627\u0628\u0632\u0627\u0631\u0647\u0627 \u062F\u0631 Hermes \u063A\u06CC\u0631\u0641\u0639\u0627\u0644\u200C\u0627\u0646\u062F\u060C \u0627\u0632 \u0628\u062E\u0634 Tools \u062E\u0648\u062F \u0628\u0631\u0646\u0627\u0645\u0647 \u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F.");
              details.textContent += "\n\n\u0627\u0646\u062A\u062E\u0627\u0628 \u0627\u062E\u062A\u06CC\u0627\u0631\u06CC \u0645\u062F\u0644 \u062F\u0631 Hermes: /model custom:aizamin:" + artifact.payload.model;
            } else if (artifact.os !== "windows") {
              message(artifact.payload.app === "codex" ? "\u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0646\u0648\u0634\u062A\u0647 \u0648 \u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0634\u062F\u0646\u062F\u060C \u0627\u0645\u0627 \u0631\u0627\u0647\u200C\u0627\u0646\u062F\u0627\u0632\u06CC \u0647\u0646\u0648\u0632 \u06A9\u0627\u0645\u0644 \u0646\u06CC\u0633\u062A. \u0645\u0631\u0648\u0631\u06AF\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F chmod \u06CC\u0627 \u0627\u0628\u0632\u0627\u0631 \u062A\u0635\u0648\u06CC\u0631 \u0631\u0627 \u0627\u062C\u0631\u0627 \u06A9\u0646\u062F. \u062F\u0631 \u062A\u0631\u0645\u06CC\u0646\u0627\u0644\u060C \u067E\u0633 \u0627\u0632 \u0628\u0631\u0631\u0633\u06CC \u06A9\u062F\u060C \u062F\u0633\u062A\u0648\u0631 \u0632\u06CC\u0631 \u0631\u0627 \u062E\u0648\u062F\u062A\u0627\u0646 \u0627\u062C\u0631\u0627 \u06A9\u0646\u06CC\u062F\u061B \u0633\u067E\u0633 Codex \u0631\u0627 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F." : "\u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0646\u0648\u0634\u062A\u0647 \u0648 \u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0634\u062F\u0646\u062F. \u0645\u0631\u0648\u0631\u06AF\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0645\u062D\u0631\u0645\u0627\u0646\u06AF\u06CC \u0645\u062C\u0648\u0632 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0631\u0627 \u062A\u0636\u0645\u06CC\u0646 \u06A9\u0646\u062F\u061B \u062F\u0633\u062A\u0631\u0633\u06CC \u067E\u0648\u0634\u0647 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627 \u0631\u0627 \u0628\u0647 \u06A9\u0627\u0631\u0628\u0631 \u062E\u0648\u062F \u0645\u062D\u062F\u0648\u062F \u06A9\u0646\u06CC\u062F\u060C \u0633\u067E\u0633 OpenCode \u0631\u0627 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.");
              if (artifact.payload.app === "codex") {
                const abs = absolutePath(pathInput.value, artifact.os);
                const quote = (s) => "'" + s.replaceAll("'", "'\\''") + "'";
                details.textContent += "\n\nchmod 700 " + quote(abs + "/aizamin/aizamin-image") + "\nchmod 600 " + quote(abs + "/config.toml") + " " + quote(abs + "/auth.json") + "\n\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u0647\u0627 \u0646\u06CC\u0632 \u062D\u0627\u0648\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062E\u0635\u0648\u0635\u06CC \u0647\u0633\u062A\u0646\u062F\u061B \u062F\u0633\u062A\u0631\u0633\u06CC \u0622\u0646\u200C\u0647\u0627 \u0631\u0627 \u0645\u062D\u062F\u0648\u062F \u06A9\u0646\u06CC\u062F.";
              }
            } else message("\u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0646\u0648\u0634\u062A\u0647 \u0648 \u0628\u0627\u0632\u062E\u0648\u0627\u0646\u06CC \u0634\u062F\u0646\u062F. \u0628\u0631\u0646\u0627\u0645\u0647 \u0631\u0627 \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F\u061B \u0627\u062C\u0631\u0627\u06CC \u0648\u0627\u0642\u0639\u06CC \u0686\u062A \u06CC\u0627 \u062A\u0635\u0648\u06CC\u0631 \u0627\u0632 \u0648\u0628\u0633\u0627\u06CC\u062A \u0622\u0632\u0645\u0627\u06CC\u0634 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A. Defender \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0627\u0628\u0632\u0627\u0631 \u0628\u0648\u0645\u06CC \u062A\u0635\u0648\u06CC\u0631 \u0631\u0627 \u0647\u0645\u0686\u0646\u0627\u0646 \u0646\u0627\u0634\u0646\u0627\u0633 \u062A\u0634\u062E\u06CC\u0635 \u062F\u0647\u062F\u061B \u0622\u0646\u062A\u06CC\u200C\u0648\u06CC\u0631\u0648\u0633 \u0631\u0627 \u062E\u0627\u0645\u0648\u0634 \u0646\u06A9\u0646\u06CC\u062F.");
          } catch (e) {
            if (e.result) report(e.result);
            message(e.message);
          } finally {
            prepared = null;
            lock(false);
          }
        });
      }
      module2.exports = { plan, parseJSON, parseTOML, parseYAML, capability, preflight, apply, mount };
    }
  });
  return require_direct();
})();
if (typeof module !== "undefined") module.exports = AIZaminDirect;
