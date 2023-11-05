function check3Same(a: number, b: number, c: number, board: number[]) {
    return (board[a] != 0 && board[b] != 0 && board[c] != 0) ? (board[a] === board[b] && board[a] === board[c]) : false;
}

export function checkWin(board: number[]) {
    let isEnd: boolean = true;
    for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
            isEnd = false;
            break;
        }
    }
    if (check3Same(0, 1, 2, board)) {
        return board[0];
    } else if (check3Same(3, 4, 5, board)) {
        return board[3];
    } else if (check3Same(6, 7, 8, board)) {
        return board[6];
    } else if (check3Same(0, 3, 6, board)) {
        return board[0];
    } else if (check3Same(1, 4, 7, board)) {
        return board[1];
    } else if (check3Same(2, 5, 8, board)) {
        return board[2];
    } else if (check3Same(0, 4, 8, board)) {
        return board[0];
    } else if (check3Same(2, 4, 6, board)) {
        return board[2];
    } else if (isEnd){
        return -1;
    } else {
        return 0;
    }
}