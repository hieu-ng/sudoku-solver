$(document).ready(() => {
  $(".btn").click(() => {
    inputLen = $('.form-control').length;
    let count_input = count_output = j = 0;
    //  Push input grid to array
    $('.form-control').each((i, obj) => {

      if (i > 0 && i % 9 == 0) {
        count_input = count_input + 1;
        arr[count_input] = [];
      }
      arr[count_input].push($(obj).val());
    });

    // solver(arr);
    // Display result grid
    $('.table').find('td').each(function(i, obj) {
      if (j > 0 && j % 9 == 0) {
        count_output = count_output + 1;
        j = 0;
      }
      $(obj).text(arr[count_output][j]);
      j = j + 1
    });
    console.log(arr);
    // console.log(valid(arr, 1, [0,0]));
  });
});
var arr = [
  []
];

function solver(grid) {
  find = findEmpty(grid);
  if (find) {
    [row, col] = find;
  } else {
    return True;
  }
  for (i = 1; i < 10; j++) {
    if (valid(grid, i, [row, col])) {
      grid[row][col] = i;

      if (solver(grid)) {
        return True;
      }

      grid[row][col] = 0;
    }
  }
  return False;
}

function findEmpty(grid) {
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      if (grid[i][j] == 0) {
        return [i, j];
      }
    }
  }
}

function valid(grid, num, pos) {
  // check row
  for (i = 0; i < 9; i++) {
    if (grid[pos[0]][i] === num && pos[1] !== i) {
      return False;
    }
  }

  // check col
  for (j = 0; j < 9; j++) {
    if (grid[j][pos[1]] === num && pos[0] !== j) {
      return False;
    }
  }

  // Check box
  // get top left position cell in current 3x3 box
  box_x = Math.floor(pos[1]/3) * 3;
  box_y = Math.floor(pos[0]/3) * 3;

  for (i = box_y; i < box_y + 3; i++) {
    for (j = box_x; j < box_x + 3; j++) {
      if (grid[i][j] === num && JSON.stringify([i, j]) !== JSON.stringify(pos)) {
        return False;
      }
    }
  }
  return True;
}
