$(document).ready(() => {
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
  $(".clear-data").click(() => {
    $('.form-control').each((i, obj) => {
      $(obj).val('0');
    });
  });
  $(".get-result").click(() => {
    let count_input = 0;
    //  Push input grid to array
    $('.form-control').each((i, obj) => {

      if (i > 0 && i % 9 == 0) {
        count_input = count_input + 1;
        arr[count_input] = [];
      }
      arr[count_input].push($(obj).val());
    });
    // console.log(arr);
    solver(arr);
    console.log(arr);
    var count_output = 0;
    var j = 0;
    // Display result grid
    $('.table').find('td').each(function(i, obj) {
      if (j > 0 && j % 9 == 0) {
        count_output = count_output + 1;
        j = 0;
      }
      $(obj).text(arr[count_output][j]); // console.log(arr[0][j], $(obj).text());

      j = j + 1;
    });

  });
});
var arr = [
  []
];


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
