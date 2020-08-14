$(document).ready(() => {
  // Add cordinate to form elements
  addCoordinate();
  limitInput();
  focusCellEvent();
  focusOutEvent();
  // Create sample sudoku grid
  randomGridEvent();
  //  Clear input grid
  clearGridEvent();
  // Launch sudoku solver
  getResultEvent();
});

function limitInput() {
  $('.form-control').keyup(function () {
    this.value = this.value.replace(/[^1-9\.]/g, '');
  });
}

function focusOutEvent() {
  $(".form-control").focusout(function () {
    $(".form-control").each((i, obj) => {
      if ($(obj).css('background-color').length > 0) {
        if ($(obj).css('background-color') != 'rgb(255, 0, 0)') {
          $(obj).css('background-color', '');
        }
      }
    });
    var coorCur = $(this).attr('id');
    var valCur = $(this).val();
    var arr = [[]];
    var count_input = 0;
    var zero = [];
    if ($(this).val() != "") {
      $(".form-control").each((i, obj) => {
        if (i > 0 && i % 9 == 0) {
          count_input = count_input + 1;
          arr[count_input] = [];
        }
        if ($(obj).attr('id') != coorCur) {
          arr[count_input].push($(obj).val());
        }
        getZeroPosition(i, $(obj).val(), zero);
      });
      if (zero.length < 80) {
        let coorRow = (coorCur.split(''))[0];
        let coorCol = (coorCur.split(''))[1];
        if (valid(arr, valCur, [coorRow, coorCol]) == false) {
          $(this).css('background-color', 'rgb(255, 0, 0)');
        }
        else {
          $(this).css('background-color', '#fff');
        }
      }
    }
    else {
      if ($(this).css('background-color') == 'rgb(255, 0, 0)') {
        $(this).css('background-color', '');
      }
    }
  });
}

function focusCellEvent() {
  $(".form-control").focus(function () {
    var coorCur = $(this).attr('id');
    var valCur = $(this).val();
    var rowCol = getRowColFromCoordinate(coorCur);
    $(".form-control").each((i, obj) => {
      if (rowCol[0].includes($(obj).attr('id')) && !rowCol[1].includes($(obj).attr('id'))) {
        $(obj).css('background-color', '#e3fdfd');
      }
    });
  });
}

function resetText() {
  $('.notification').text('You can random a new sudoku grid or input your own grid');
}
function getRowColFromCoordinate(coorStr) {
  let coorRow = (coorStr.split(''))[0];
  let coorCol = (coorStr.split(''))[1];
  let row = [];
  let col = [];
  let ignore = [];
  for (i = 0; i < 9; i++) {
    row.push(String(coorRow) + String(i));
  }
  for (j = 0; j < 9; j++) {
    col.push(String(j) + String(coorCol));
  }
  row = row.filter(function (value, index, arr) { return value !== String(coorStr); });
  col = col.filter(function (value, index, arr) { return value !== String(coorStr); });
  var res = row.concat(col);
  $(".form-control").each((i, obj) => {
    if ($(obj).css('background-color') == 'rgb(255, 0, 0)') {
      ignore.push($(obj).attr('id'));
    }
  });

  return [res, ignore];
}

// add coordinate to form elements
function addCoordinate() {
  let row = 0;
  let col = 0;
  $('.form-control').each((i, obj) => {
    if (i > 0 && i % 9 == 0) {
      row += 1;
      col = 0;
    }
    let cor = String(row) + String(col);
    $(obj).attr('id', cor);
    col += 1;
  });
}


// random new grid
function randomGridEvent() {
  $(".sample-data").click(() => {
    let count_input = 0;
    let j = 0;
    let arr = randomSudoku();
    $('.form-control').each((i, obj) => {
      if (i > 0 && i % 9 == 0) {
        count_input = count_input + 1;
        j = 0;
      }
      removeHighlight(obj);
      $(obj).prop('readonly', false);
      $(obj).val(`${arr[count_input][j]}`);
      j = j + 1
    });
    enableButton('get-result');
    resetText();
  });
}

// clear grid event
function clearGridEvent() {
  $(".clear-data").click(() => {
    $('.form-control').each((i, obj) => {
      removeHighlight(obj);
      $(obj).val('');
      $(obj).prop('readonly', false);
    });
    arr = [[]];
    enableButton('get-result');
    resetText();
  });
}


function checkWin(zeroPosition, a, a_res) {
  if (!zeroPosition.length) {
    if (JSON.stringify(a) == JSON.stringify(a_res)) {
      $('.notification').text('Congratulations! You solved the puzzle.');
    }
  }
}

// get result event
function getResultEvent() {
  $(".get-result").click(() => {
    var zeroPosition = [];
    let arr = [[]];
    let count_input = 0;
    //  Push input grid to array
    $('.form-control').each((i, obj) => {
      getZeroPosition(i, $(obj).val(), zeroPosition);
      if (i > 0 && i % 9 == 0) {
        count_input = count_input + 1;
        arr[count_input] = [];
      }
      arr[count_input].push($(obj).val());
    });
    // Check for valid input
    var checkValid = checkInputBeforeSubmit(arr);
    console.log(checkValid);
    if (checkValid == true) {
      // var t0 = performance.now();
      console.log('fail');
      arrTemp = arr;
      solver(arr);
      checkWin(zeroPosition, arrTemp, arr);
      // var t1 = performance.now();
      // $('.notification').text(`Solving time took ${(t1 - t0).toFixed(2)} miliseconds.`);
      var count_output = 0;
      var j = 0;
      // Display result grid
      $('.form-control').each((i, obj) => {
        highlightResult(i, obj, zeroPosition);
        if (i > 0 && i % 9 == 0) {
          count_output = count_output + 1;
          j = 0;
        }
        $(obj).val(arr[count_output][j]);
        j = j + 1;
      });
      $(".get-result").prop("disabled", true);
    }
  });
}

function getZeroPosition(i, val, a) {
  if (val == '') {
    a.push(i);
  }
}

// remove highlight
function removeHighlight(obj) {
  if ($(obj).hasClass('highlighted-result')) {
    $(obj).removeClass('highlighted-result');
  }
  if ($(obj).css('background-color').length > 0) {
    $(obj).css({ "background-color": '' });
  }
}

// enable submit button
function enableButton(b) {
  $(`.${b}`).prop("disabled", false);
}



// var color2 = [45, 37, 29, 21, 13, 5, 54, 46, 38, 30, 22, 14, 6, 63, 55, 47, 39, 31, 23, 15, 7];
// var color3 = [72, 64, 56, 48, 40, 32, 24, 16, 8];
// var color4 = [73, 65, 57, 49, 41, 33, 25, 17, 74, 66, 58, 50, 42, 34, 26, 35, 43, 51, 59, 67, 75];
// var color5 = [76, 68, 60, 52, 44, 77, 69, 61, 53, 78, 70, 62, 79, 71, 80];
function highlightResult(i, obj, a) {
  $('.form-control').each((i, obj) => {
    $(obj).prop('readonly', true);
    if (a.includes(i)) {
      $(obj).addClass('highlighted-result');
      $(obj).css({ "background-color": '#dcedc1' });
    } else {
      $(obj).css({ "background-color": '' });
    }
  });
}

// Check for valid input
function checkInputBeforeSubmit(a) {
  let count = 0;
  console.log(a);
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      if (a[i][j] > 0) {
        count++;
        if (valid(a, a[i][j], [i, j]) == false) {
          $('.notification').text('ERROR! Input grid is invalid!');
          return false;
        }
      }
    }
  }
  if (count < 1) {
    $('.notification').text('ERROR! Input grid is empty!');
    return false;
  } else {
    return true;
  }
}

function valid(grid, num, pos) {
  // check row
  for (i = 0; i < grid[0].length; i++) {
    if (grid[pos[0]][i] == num && pos[1] != i) {
      return false;
    }
  }
  // check col
  for (j = 0; j < grid.length; j++) {
    if (grid[j][pos[1]] == num && pos[0] != j) {
      return false;
    }
  }

  // Check box
  // get top left position cell in current 3x3 box
  var box_x = Math.floor(pos[1] / 3) * 3;
  var box_y = Math.floor(pos[0] / 3) * 3;

  for (i = box_y; i < box_y + 3; i++) {
    for (j = box_x; j < box_x + 3; j++) {
      if (grid[i][j] == num && JSON.stringify([i, j]) != JSON.stringify(pos)) {
        return false;
      }
    }
  }
  return true;
}

// solve grid
function solver(grid) {
  var find = findEmpty(grid);
  if (!find) {
    return true;
  } else {
    var row = find[0];
    var col = find[1];
  }
  var i = 1
  while (i < 10) {
    if (valid(grid, i, [row, col])) {
      grid[row][col] = i;
      if (solver(grid)) {
        return true;
      } else {
        grid[row][col] = 0;
      }
    }
    i++;
  }

  return false;
}
// check for valid input for cell
function valid(grid, num, pos) {
  // check row
  for (i = 0; i < grid[0].length; i++) {
    if (grid[pos[0]][i] == num && pos[1] != i) {
      return false;
    }
  }
  // check col
  for (j = 0; j < grid.length; j++) {
    if (grid[j][pos[1]] == num && pos[0] != j) {
      return false;
    }
  }

  // Check box
  // get top left position cell in current 3x3 box
  var box_x = Math.floor(pos[1] / 3) * 3;
  var box_y = Math.floor(pos[0] / 3) * 3;

  for (i = box_y; i < box_y + 3; i++) {
    for (j = box_x; j < box_x + 3; j++) {
      if (grid[i][j] == num && JSON.stringify([i, j]) != JSON.stringify(pos)) {
        return false;
      }
    }
  }
  return true;
}
// find empty cell in grid
function findEmpty(grid) {
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      if (grid[i][j] == 0) {
        return [i, j];
      }
    }
  }
  return false;
}

// Getting a random integer between two values, inclusive (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// random a new grid
function randomSudoku() {
  a = SudokuCreate(9);
  delNum = getRandomIntInclusive(30, 40);
  let i = 0;

  var exist = [[]];
  while (i < delNum) {
    let row = getRandomIntInclusive(0, 8);
    let col = getRandomIntInclusive(0, 8);
    // counterpart when rotate
    let rowC = Math.abs(8 - row);
    let colC = Math.abs(8 - col);
    if (exist.filter(cur => (JSON.stringify(cur) == JSON.stringify([row, col]))).length === 0) {
      a[row][col] = '';
      exist.push([row, col]);
    }
    if (exist.filter(cur => (JSON.stringify(cur) == JSON.stringify([rowC, colC]))).length === 0) {
      a[rowC][colC] = '';
      exist.push([rowC, colC]);
    }
    // console.log(row, col, '||', rowC, colC);
    i++;
  }
  return a;
}

// Code by dethstrobe (https://codereview.stackexchange.com/users/67895/dethstrobe)
function SudokuCreate(maxNum) {
  //generate number set
  var numSet = [];
  var sudokuArray = [];

  //populates number set and files sudoku with the rows and columns it needs
  for (var i = 1; i <= maxNum; ++i) {
    numSet.push(i);
    sudokuArray.push(new Array(maxNum));
  }

  //size of sub boxes, figure out more dynamic way to set this
  var horizontalBoxSize = 3,
  verticalBoxSize = maxNum === 9 ? 3 : 2;

  //find random number from 0 to max number, expludes max
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //places numbers in the sudoku array
  function placeNumber(num, arr) {
    var lastRowIndex = arr.length - 1, //the index of the last row in the working array
    lastRow = arr[lastRowIndex], //the reference to the last row
    rowsToCheck = lastRowIndex % verticalBoxSize, //find what row of the sub box we are in vertically
    safeIndexes = [], //find which column is save to put a number in to
    randomSafeIndex; //pick one of the columns to place the number into from the safeIndexes array

    //used to find a safe column to place the number in the current row
    function findSafeIndex(boxesUsed) {
      //looks at previous rows if inside the sub box to see if the current number can be placed in the sub box
      function boxSafe(index) {
        var indexBox = Math.floor(index / horizontalBoxSize);//finds which sub box the current index is in
        if (boxesUsed.indexOf(indexBox) >= 0) {//checks to see if the current index's sub box has already been used
          return false;
        } else {
          return true;
        }
      }

      //loop through the current row to find a safe place to put the number
      for (var indexInLastRow = 0, rowLen = lastRow.length; indexInLastRow < rowLen; ++indexInLastRow) {
        var columnSafe = true; //assume the current column is safe

        //make sure the current number isn't already used in this column
        for (var rowIndex = arr.length - 1; rowIndex >= 0; --rowIndex) {
          if (arr[rowIndex][indexInLastRow] === num) {
            columnSafe = false;
          }
        }

        //make sure current index is empty, column is safe, and that current box is safe
        if (lastRow[indexInLastRow] === undefined && columnSafe && boxSafe(indexInLastRow)) {
          safeIndexes.push(indexInLastRow);
        }
      }

      //return a safe index to be used for the current number
      return safeIndexes[getRandomInt(safeIndexes.length)];
    }

    var horizontalBoxesUsed = []; //records which sub box has been used, in the current sub box row

    //if we are not if the first row of the sub box, loop through the other rows to see which subboxes have been used
    if (rowsToCheck > 0) {
      for (var i = rowsToCheck; i > 0; --i) {
        var horizontalBox = Math.floor(arr[lastRowIndex - i].indexOf(num) / horizontalBoxSize);
        horizontalBoxesUsed.push(horizontalBox);
      }
    }

    //get a safe index to put the number in to the row
    randomSafeIndex = findSafeIndex(horizontalBoxesUsed);

    //if there are no safe indexs return the number
    if (randomSafeIndex === undefined) {
      return num;
    } else {//else if there are safe indexs add the number to an index in the row and return true
      lastRow[randomSafeIndex] = num;
      return true;
    }
  }

  //loop through the numbers to set them in the sudoku
  for (var i = numSet.length - 1; i >= 0; --i) {
    var workingArray = [];//holds the rows we are currently working with and/or have already wored with
    var possible = true;//is the sudoku even possible?
    while (sudokuArray.length > 0) {//while there are rows in the sudokuArray have have been been processed keep looping
      workingArray.push(sudokuArray.shift());//add a row to the working array from the sudoku array

      possible = placeNumber(numSet[i], workingArray);//place the current working number in to the working array, to find out if the sudoku puzzle is possible

      if (possible !== true) {//if its not possible generate a new sudoku puzzle
        return SudokuCreate(maxNum);
      }
    }

    //make the sudoku array equal to the working array when we're done
    sudokuArray = workingArray;
  }
  return sudokuArray;//return our array to start to do some sudoku
}

// var color1 = [0, 1, 2, 3, 9, 10, 11, 18, 19, 27, 4, 12, 20, 28, 36];
// var test = [
//   [7, 8, 0, 4, 0, 0, 1, 2, 0],
//   [6, 0, 0, 0, 7, 5, 0, 0, 9],
//   [0, 0, 0, 6, 0, 1, 0, 7, 8],
//   [0, 0, 7, 0, 4, 0, 2, 6, 0],
//   [0, 0, 1, 0, 5, 0, 9, 3, 0],
//   [9, 0, 4, 0, 6, 0, 0, 0, 5],
//   [0, 7, 0, 3, 0, 0, 0, 1, 2],
//   [1, 2, 0, 0, 0, 7, 4, 0, 0],
//   [0, 4, 9, 2, 0, 6, 0, 0, 7]
// ];
