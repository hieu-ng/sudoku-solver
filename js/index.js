$(document).ready(() => {
  // Highlight positive cells in input grid
  highlightCell();
  $(document).keyup(() => {
    highlightCell();
  });

  $(document).click(() => {
    highlightCell();
  });
  // Create sample sudoku grid
  $(".sample-data").click(() => {
    let count_input = 0;
    let j = 0;
    $('.form-control').each((i, obj) => {
      if (i > 0 && i % 9 == 0) {
        count_input = count_input + 1;
        j = 0;
      }
      // console.log(i, $(obj).val(), test[count_input][j]);
      $(obj).val(`${test[count_input][j]}`);
      j = j + 1
    });
  });

  //  Clear input grid
  $(".clear-data").click(() => {
    $('.form-control').each((i, obj) => {
      $(obj).val(0);
    });
    arr = [[]];
  });

  // Launch sudoku solver
  $(".get-result").click(() => {
    var zeroPosition = [];
    var arr =[[]];
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
    console.log(zeroPosition);
    console.log(arr);
    // Check for valid input
    if (checkValidInput(arr) == false) {
      // console.log(arr);
      alert('ERROR! Grid is empty!');
    } else {
      solver(arr);      
      console.log(arr);
      var count_output = 0;
      var j = 0;
      // Display result grid
      $('.table').find('td').each(function (i, obj) {
        highlightResult(i, obj, zeroPosition);
        if (j > 0 && j % 9 == 0) {
          count_output = count_output + 1;
          j = 0;
        }
        $(obj).text(arr[count_output][j]); // console.log(arr[0][j], $(obj).text());
        j = j + 1;
      });
    }
  });
});
// var arr = [
//   []
// ];

function getZeroPosition(i, val, a) {
  if (val == 0) {
    a.push(i);
  }
}

// Highlight positive number
function highlightCell() {
  $('.form-control').each((i, obj) => {
    if ($(obj).val() > 0) {
      $(obj).addClass('highlighted-cell');
    } else if ($(obj).hasClass('highlighted-cell')) {
      $(obj).removeClass('highlighted-cell');
    }
  });
}

function highlightResult(i, obj, a) {
  $('.table').find('td').each(function (i, obj) {
    if (a.includes(i) && $(obj).hasClass('highlighted-cell') == false) {
      $(obj).addClass('highlighted-cell');
    } else if (a.includes(i) == false && $(obj).hasClass('highlighted-cell')) {
      $(obj).removeClass('highlighted-cell');
    }
  });
}

// Check for valid input
function checkValidInput(a) {
  let count = 0;
  a.forEach((cur) => {
    cur.forEach((c) => {
      if (c > 0) {
        count++;
      }
    });
  });
  if (count < 21) {
    return false;
  } else {
    return true;
  }
}


var test = [
  [7, 8, 0, 4, 0, 0, 1, 2, 0],
  [6, 0, 0, 0, 7, 5, 0, 0, 9],
  [0, 0, 0, 6, 0, 1, 0, 7, 8],
  [0, 0, 7, 0, 4, 0, 2, 6, 0],
  [0, 0, 1, 0, 5, 0, 9, 3, 0],
  [9, 0, 4, 0, 6, 0, 0, 0, 5],
  [0, 7, 0, 3, 0, 0, 0, 1, 2],
  [1, 2, 0, 0, 0, 7, 4, 0, 0],
  [0, 4, 9, 2, 0, 6, 0, 0, 7]
];

var test1 = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
          [6, 0, 0, 1, 9, 5, 0, 0, 0],
          [0, 9, 8, 0, 0, 0, 0, 6, 0],
          [8, 0, 0, 0, 6, 0, 0, 0, 3],
          [4, 0, 0, 8, 0, 3, 0, 0, 1],
          [7, 0, 0, 0, 2, 0, 0, 0, 6],
          [0, 6, 0, 0, 0, 0, 2, 8, 0],
          [0, 0, 0, 4, 1, 9, 0, 0, 5],
          [0, 0, 0, 0, 8, 0, 0, 7, 9]];

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

  for (i = box_y; i < box_y + 2; i++) {
    for (j = box_x; j < box_x + 2; j++) {
      if (grid[i][j] == num && JSON.stringify([i, j]) != JSON.stringify(pos)) {
        return false;
      }
    }
  }
  return true;
}

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
