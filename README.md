# chesspath
Get all possible moves in chess board using pure JavaScript. You can get all possible moves and captured pieces, castling moves, pawn promotion information.

# How to use
You can load it in your html file
```html
<!-- Non minified -->
<script src="your-path/chesspath.js"></script>

<!-- Minified -->
<script src="your-path/chesspath.min.js"></script>
```

# Initilization
```js
let chess = ChessPath(
    (square) => {
         /* Return piece info if available otherwise don't return anything
         * ex. {P: 'K', C: 'W'}  here P means piece name and C means piece color
         *
         * sqaure => can be 'A1' or 'B4' or any other square
         *
         * pawn   => 'P'
         * king   => 'K'
         * queen  => 'Q'
         * bishop => 'B'
         * knight => 'N'
         * rook   => 'R'
         *
         * white  => 'W'
         * black  => 'B'
         */   
         return;
    }
);
```
This class require a callback function. You have to pass a function which return square information. Like piece name and piece color. You don't need to return anything if square has no piece.

```
       Chess board                      Chess piece position

8 | A8 B8 C8 D8 E8 F8 G8 H8        8 | r  n  b  q  k  b  n  r
7 | A7 B7 C7 D7 E7 F7 G7 H7        7 | p  p  p  p  p  p  p  p
6 | A6 B6 C6 D6 E6 F6 G6 H6        6 | -  -  -  -  -  -  -  -
5 | A5 B5 C5 D5 E5 F5 G5 H5        5 | -  -  -  -  -  -  -  -
4 | A4 B4 C4 D4 E4 F4 G4 H4        4 | -  -  -  -  -  -  -  -
3 | A3 B3 C3 D3 E3 F3 G3 H3        3 | -  -  -  -  -  -  -  -
2 | A2 B2 C2 D2 E2 F2 G2 H2        2 | P  P  P  P  P  P  P  P
1 | A1 B1 C1 D1 E1 F1 G1 H1        1 | R  N  B  Q  K  B  N  P
   ------------------------          ------------------------
    A  B  C  D  E  F  G  H            A  B  C  D  E  F  G  H
```

After seeing above piece position we know all position in the board ex. Piece at 'A1' white ROOK and at B2  white pawn etc.
So your callback function should be like this which can return a square information if sqaure has a piece otherwise it should return null.

# ChessPath class methods
This class provide only two method for your use 'isKingUnsafe()' and 'move()'.

```js
// Check if king is safe
let unsafeposition = chess.isKingUnsafe(
   square, // King position ex. 'E4'
   color  // Color of piece ( white => 'W', black => 'B')
);
```
This method return a array of all square which can do check king in the current sqaure. If array is empty it means king is safe. You can store all unsafe position ans lator you can use them for piece move. You should call this method after moving a piece to check another side king is safe or not.


```js
let moves = chess.move(
   square , // Sqaure ex. 'B2'
   kingPosition, // King position of current square color. ex. 'E4'
   unsafePosition, // A array of all piece from which king is unsafe. ex. ['A2', 'B4'] ( You can get all unsafe position by isKingUnsafe() method)
   canCastle //Is castling is possible. ex. 'B' ('B' => Both side, 'Q' => Queen side, 'K' => King side, 'N' => Can't castle)
);
```
This method return a object which you can use to determine all possible moves
```
{
   V: [], // Contain all valid moves
   C: [], // Contain all captured squars
   Q: [], // it will be available if a king will castle and contain two element
   K: [], // it will be available if a king will castle and contain two element
   P: [],  // it will be available if a pawn will oromote. this will be a empty square
}
```

# Note
For all piece name, piece colors, we use Uppercase letters. If you will use lowercase letters than this library will not work.
```
Pieces => P, K, Q, N, R, B
Colors => W, B
Castle => B, N, Q, K
```

If you like this library, follow me and give a star to this repository
