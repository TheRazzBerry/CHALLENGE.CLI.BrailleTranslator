// Get arguments (English or Braille that needs to be translated)
var ARGS = process.argv.slice(2);

// Function that creates a trimmed string from input arguments
function ARGS_toString(input) {
    let inputArgsToString = "";
    input.forEach(function (value) {
        inputArgsToString += value + " ";
    });
    return inputArgsToString.trim();
}

// Store arguments as string in the inputString variable
var inputString = ARGS_toString(ARGS);

// Set REGEX strings to check if input is English or Braille
var REGEX_English = /[^A-Za-z0-9 ]+/g;
var REGEX_Braille = /[^.O]+/g;

// Functions to check if input is English or Braille
function isBraille(input) { return !REGEX_Braille.test(input) && input.length % 6 == 0; }
function isEnglish(input) { return !REGEX_English.test(input); }

// Create English and Braille index matching character arrays
var CHARS_EnglishArray = "abcdefghijklmnopqrstuvwxyz1234567890 ".split("");
var CHARS_BrailleArray =
    [
        "O.....", "O.O...", "OO....", "OO.O..", "O..O..", "OOO...",
        "OOOO..", "O.OO..", ".OO...", ".OOO..", "O...O.", "O.O.O.",
        "OO..O.", 'OO.OO.', 'O..OO.', 'OOO.O.', 'OOOOO.', 'O.OOO.',
        '.OO.O.', '.OOOO.', 'O...OO', 'O.O.OO', '.OOO.O', 'OO..OO',
        'OO.OOO', 'O..OOO', "O.....", "O.O...", "OO....", "OO.O..",
        "O..O..", "OOO...", "OOOO..", "O.OO..", ".OO...", ".OOO..",
        '......'
    ];

// Set special Braille characters
var CHAR_BrailleCapitalFollows = ".....O";
var CHAR_BrailleNumberFollows = ".O.OOO";
var CHAR_BrailleSpace = "......"

// Function to convert from English to Braille
var FLAG_EnglishNumbers = false;
function TL_EnglishToBraille(input) {
    let OUT_BrailleString = "";

    // Iterate over every English character as an array
    input.split("").forEach(function (value) {
        // Checks if English character is chapitalized and adds preceding Braille
        if (value == value.toUpperCase() && value != " " && isNaN(parseInt(value))) {
            OUT_BrailleString += CHAR_BrailleCapitalFollows;
        }

        // Checks if character is a space and sets FLAG_EnglishNumbers to false if true
        if (value == " " && FLAG_EnglishNumbers == true) {
            FLAG_EnglishNumbers = false
        }

        // Checks if character is a number and if FLAG_EnglishNumber is false then adds preceding Braille
        if (!isNaN(parseInt(value)) && FLAG_EnglishNumbers == false) {
            FLAG_EnglishNumbers = true;
            OUT_BrailleString += CHAR_BrailleNumberFollows;
        }

        // Stores index of character
        let CHAR_Index = CHARS_EnglishArray.indexOf(value.toLowerCase());

        // Finds Braille character in array based on index then appends onto output string
        OUT_BrailleString += CHARS_BrailleArray[CHAR_Index];
    })

    // Return Braille output string
    return OUT_BrailleString;
}

// Function to convert from Braille to English
var FLAG_BrailleCapital = false;
var FLAG_BrailleNumber = false;
function TL_BrailleToEnglish(input) {
    let OUT_EnglishString = "";

    // Iterate over every 6 letter Braille character as an array
    input.match(/.{1,6}/g).forEach(function (value) {
        // Check if character is to signify that the next character is a capital then moves to next iteration with a return
        if (value == CHAR_BrailleCapitalFollows) {
            FLAG_BrailleCapital = true;
            return;
        }

        // Checks if character is to signify that the next characters are numbers until a space then moves to next iteration with a return
        if (value == CHAR_BrailleNumberFollows) {
            FLAG_BrailleNumber = true;
            return;
        }

        // Checks if character is a space to  set FLAG_BrailleNumber to false
        if (value == CHAR_BrailleSpace) {
            FLAG_BrailleNumber = false;
        }

        // Stores index of character
        let CHAR_Index = CHARS_BrailleArray.indexOf(value);

        // Checks if character should be a capital and appends to output string and sets FLAG_BrailleCapital to false then moves to next iteration with a return
        if (FLAG_BrailleCapital == true) {
            OUT_EnglishString += CHARS_EnglishArray[CHAR_Index].toUpperCase();
            FLAG_BrailleCapital = false;
            return;
        }

        // Checks if character should be a number and appends to output string then moves to next iteration with a return
        if (FLAG_BrailleNumber == true) {
            OUT_EnglishString += CHARS_EnglishArray[CHAR_Index + 26];
            return
        }

        // Finds English character in array (placed after conditionals) based on index then appends onto output string
        OUT_EnglishString += CHARS_EnglishArray[CHAR_Index];
    });

    // Return Engligh output string
    return OUT_EnglishString;
}

// Function to check if input is English or Braille then execute correct translation function
function TL_CheckThenExecute(input) {
    // If input is Braille then translate to English and return output
    if (isBraille(input)) {
        return TL_BrailleToEnglish(input);
    }

    // If input is English then translate to Braille and return output
    if (isEnglish(input)) {
        return TL_EnglishToBraille(input);
    }

    // If neither of the above conditions are true then return error;
    return new Error("Invalid Input!");
}

// Testable Output
console.log(TL_CheckThenExecute(inputString));