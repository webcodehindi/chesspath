/**
 * WTChessPath - Get possible moves in chess board
 * 
 * @author Anuj Kumar <anujkumar00p@gmail.com>
 * @link https://instagram.com/webcodehindi
 * @link https://github.com/webcodehindi/chesspath
 */
 class WTChessPath {
    constructor(G_PIECE) {
        if (typeof G_PIECE != 'function') throw Error("First parameter should be a function");
        this._G_PIECE = G_PIECE; // Hold function provided by you
        this._PIECE_SQR1 = {}; // HOLD ALL 64 SQUARES
        this._PIECE_SQR2 = []; // HOLD ALL 64 SQUARES
        this._N_MOVES = []; // HOLD KNIGHT MOVES
        this._M_JUMP = { T: 8, B: -8, R: 1, L: -1, W: 7, X: 9, Y: -9, Z: -7 }; // MAX JUMP TO GET NEXT SQUARE
        this._SQR_H = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // HORIZONTAL SQAURE
        this._SQR_V = ['8', '7', '6', '5', '4', '3', '2', '1']; // VERTICAL SQUARE
        this._PATTERN = {
            K: 'T,1=B,1=L,1=R,1=W,1=X,1=Y,1=Z,1',
            Q: 'T=B=L=R=W=X=Y=Z',
            R: 'T=B=L=R',
            B: 'W=X=Y=Z',
            N: 'T,2=B,2=L,2=R,2',
            BP: 'T,2,=W,1=X,1',
            TP: 'B,2,=Y,1=Z,1'
        };
        this._SQR_V.forEach(V => this._SQR_H.forEach(H => {
            this._PIECE_SQR2.push(H + V);
            this._PIECE_SQR1[H + V] = (V - 1) * 8 + (H == 'A' ? 0 : H == 'B' ? 1 : H == 'C' ? 2 : H == 'D' ? 3 : H == 'E' ? 4 : H == 'F' ? 5 : H == 'G' ? 6 : 7);
        }));
        this._PIECE_SQR2 = this._PIECE_SQR2.sort((A, B) => A[1] - B[1]); // SORT SQUARE
    }

    _END_LOOP(POS) {
        let T = 8 - POS[1],
            L = this._SQR_H.findIndex(I => I == POS[0]);
        return {
            B: POS[0] + 1,
            T: POS[0] + 8,
            L: 'A' + POS[1],
            R: 'H' + POS[1],
            W: L < T ? 'A' + (parseInt(POS[1]) + L) : this._SQR_H[L - T] + '8',
            X: (7 - L) < T ? 'H' + (parseInt(POS[1]) + (7 - L)) : this._SQR_H[L + T] + '8',
            Y: L < (POS[1] - 1) ? 'A' + (POS[1] - L) : this._SQR_H[L - (POS[1] - 1)] + '1',
            Z: (7 - L) < (POS[1] - 1) ? 'H' + (POS[1] - (7 - L)) : this._SQR_H[L + (POS[1] - 1)] + '1'
        };
    }

    _EVAL_PATTERN(PATTERN, SQUARE, NAME = null, AGAIN = true, I_KING = false) {
        if (AGAIN) this._POS = { V: [], C: [], K: [], Q: [] };
        let END_LOOP = this._END_LOOP(SQUARE);
        PATTERN.split("=").forEach(P => {
            P = P.split(",");
            let STEPS = P[1] ?? 8,
                I_KILL = NAME == 'P' && (P[0] == 'T' || P[0] == 'B'),
                E_LOOP = this._PIECE_SQR1[END_LOOP[P[0]]],
                IN = this._PIECE_SQR1[SQUARE],
                I_VALID = NAME == 'P' && P[0] != 'T' && P[0] != 'B',
                I_BREAK = NAME == 'N',
                JUMP = this._M_JUMP[P[0]];
            if (IN != E_LOOP)
                for (let I = 0; I < STEPS; I++) {
                    IN += JUMP;
                    let PIECE = this._G_PIECE(this._PIECE_SQR2[IN]);
                    if ((PIECE == null || I_BREAK) && !I_VALID) this._POS.V.push(this._PIECE_SQR2[IN]);
                    if (PIECE && !I_KILL && this._COLOR != PIECE.C) this._POS.C.push(this._PIECE_SQR2[IN]);
                    if (I_KING && PIECE && PIECE.P == 'K' && this._COLOR == PIECE.C) {
                        this._POS.V.push(this._PIECE_SQR2[IN]);
                        if (IN != E_LOOP) continue;
                        else break;
                    }
                    if (IN == E_LOOP || (PIECE && !I_BREAK)) break;
                }
            if (NAME == 'P' && (P[0] == 'X' || P[0] == 'Z')) {
                let SCND = (P[0] == 'X') ? ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'] : ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7'];
                let FRST = (P[0] == 'X') ? ['A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8'] : ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'];
                this._POS.V.splice(SCND.some(S => SQUARE == S) ? 2 : 1); // CHECK IF PAWN CAN MOVE 2 SQUARE
                if (this._POS.V.concat(this._POS.C).some(S => FRST.includes(S))) this._POS.P = []; // IF PAWN IS PROMOTED
            } else if (NAME == 'N') {
                if (this._POS.V.length == 2) this._N_MOVES.push([P[0], this._POS.V[1]]);
                this._POS = { V: [], C: [], K: [], Q: [] };
                if (P[0] == 'R' && this._N_MOVES.length > 0) {
                    this._N_MOVES.forEach(M => this._EVAL_PATTERN(
                        M[0] == 'L' || M[0] == 'R' ? 'T,1=B,1' : 'L,1=R,1', M[1], null, false // GET KNIGHT MOVES
                    ));
                    this._N_MOVES = []; // EMPTY KNIGHT MOVES
                }
            }
        });
        return this._POS;
    }

    _GET_DIRECTION(I1, I2) { // PIECE, KING-INDEX (GET DIRECTION)
        if (I1[0] == I2[0]) return I1[1] > I2[1] ? "T" : "B";
        else if (I1[1] == I2[1]) return I1[0] > I2[0] ? "R" : "L";
        let END = this._END_LOOP(I2);
        I1 = this._PIECE_SQR1[I1], I2 = this._PIECE_SQR1[I2];
        if ((I1 - I2) % 7 == 0 && I1 <= this._PIECE_SQR1[END.W] && I1 >= this._PIECE_SQR1[END.Z]) return I1 > I2 ? 'W' : 'Z';
        if ((I1 - I2) % 9 == 0 && I1 <= this._PIECE_SQR1[END.X] && I1 >= this._PIECE_SQR1[END.Y]) return I1 > I2 ? 'X' : 'Y'
    }

    _IS_VALID(ARRAY) {
        for (let I = 0; I < ARRAY.length; I++) {
            if (this._G_PIECE(ARRAY[I]) != null || this.isKingUnsafe(ARRAY[I], this._COLOR).length > 0) return false;
        }
        return true;
    }

    _SET_PATTERN(NAME, SQUARE, COLOR, I_KING = false) {
        this._COLOR = COLOR;
        if (NAME == 'K') {
            let MOVES = this._EVAL_PATTERN(this._PATTERN.K, SQUARE),
                FILTERED = { V: [], C: [], K: [], Q: [] },
                TYPE = this._COLOR == 'W';
            for (let M in MOVES) MOVES[M].forEach(MOVE => this.isKingUnsafe(MOVE, this._COLOR).length == 0 && FILTERED[M].push(MOVE));
            if (this._CASTLE != 'N' && ((TYPE && SQUARE == 'E1') || (TYPE && SQUARE == 'E8')) && this.isKingUnsafe(SQUARE, this._COLOR).length == 0) {
                let POSITION = {
                    R1: TYPE ? 'A1' : 'A8',
                    R2: TYPE ? 'H1' : 'H8'
                };
                for (let P in POSITION) {
                    P = this._G_PIECE(POSITION[P]);
                    if (P == null || P.P != 'R') return FILTERED;
                }
                if ((this._CASTLE == 'B' || this._CASTLE == 'Q') && this._IS_VALID(TYPE ? ['B1', 'C1', 'D1'] : ['B8', 'C8', 'D8'])) {
                    FILTERED.Q = TYPE ? ['C1', 'D1'] : ['C8', 'D8'];
                    FILTERED.V.push(TYPE ? 'C1' : 'C8');
                }

                if ((this._CASTLE == 'B' || this._CASTLE == 'K') && this._IS_VALID(TYPE ? ['F1', 'G1'] : ['F8', 'G8'])) {
                    FILTERED.K = TYPE ? ['G1', 'F1'] : ['G8', 'F8'];
                    FILTERED.V.push(TYPE ? 'G1' : 'G8');
                }
            }
            return FILTERED;
        }
        return this._EVAL_PATTERN(
            this._PATTERN[NAME == 'P' ? 'W' == COLOR ? 'BP' : 'TP' : NAME],
            SQUARE, NAME, true, I_KING
        );
    }

    _CAN_MOVE(UNSAFE, PIECE, K_POSITION) {
        if (UNSAFE.length > 1) return false;
        PIECE = PIECE.V.concat(PIECE.C);
        if (['N', 'P'].some(P => P == this._G_PIECE(UNSAFE[0]).P)) return PIECE.some(M => M == UNSAFE[0]) ? UNSAFE : false;
        let INDEX = [],
            MOVES = this._EVAL_PATTERN(this._GET_DIRECTION(UNSAFE[0], K_POSITION), K_POSITION);
        MOVES.V.concat(MOVES.C).some(M => PIECE.includes(M) && INDEX.push(M));
        return (INDEX.length == 0) ? false : INDEX;
    }

    _CAN_KILL(DIRECTION, PIECE) {
        if (['L', 'R', 'T', 'B'].some(DIR => DIR == DIRECTION)) {
            if (['R', 'Q'].some(P => P == PIECE.P)) return true;
        } else {
            if (['B', 'Q'].some(P => P == PIECE.P)) return true;
        }
        return false;
    }

    move(SQUARE, K_POSITION, UNSAFE, CASTLE) {
        let PIECE = this._G_PIECE(SQUARE),
            POS = { V: [], C: [], K: [], Q: [] },
            DIRECTION, MOVE;
        if (PIECE == null) return POS; // RETURN IF INVALID POSITION GIVEN
        this._CASTLE = ['B', 'N', 'R', 'L'].some(E => E == CASTLE) ? CASTLE : 'B'; // CAN CASTLE
        let MOVES = this._SET_PATTERN(PIECE.P, SQUARE, PIECE.C); // GET PIECE LEGAL MOVES
        if (PIECE.P == 'K') return MOVES; // RETURN MOVES IF PIECE IS KING
        if (UNSAFE.length > 0) MOVE = this._CAN_MOVE(UNSAFE, MOVES, K_POSITION); // CHECK PIECE CAN MOVE
        if (MOVE == false) return POS; // RETURN MOVES IF PIECE HAS NO LEGAL MOVE
        if (MOVE != null) {
            MOVE.forEach(M => {
                if (MOVES.V.includes(M)) POS.V.push(M);
                if (MOVES.C.includes(M)) POS.C.push(M);
            });
            return POS;
        }
        if ((DIRECTION = this._GET_DIRECTION(SQUARE, K_POSITION))) {
            let D_MOVE = this._EVAL_PATTERN(DIRECTION, SQUARE, null, true, true);
            if (D_MOVE.C.length == 0 || !D_MOVE.V.some(S => S == K_POSITION)) return MOVES; // IF KING IS SAFE
            if (this._CAN_KILL(DIRECTION, this._G_PIECE(D_MOVE.C[0]))) {
                for (let M in MOVES) {
                    MOVES[M].forEach(I => {
                        if (D_MOVE.V.includes(I) || D_MOVE.C.includes(I)) POS[M].push(I);
                    });
                }
                return POS;
            }
        }
        return MOVES;
    }

    isKingUnsafe(SQUARE, COLOR) {
        let UNSAFE = [];
        ['Q', 'P', 'N'].forEach(PIECE => {
            this._SET_PATTERN(PIECE, SQUARE, COLOR, PIECE == 'Q').C.forEach(M => {
                let NAME = this._G_PIECE(M).P;
                if (PIECE == 'Q') {
                    if ([-7, -9, -8, -1, 1, 8, 9, 7].some(D => (D + this._PIECE_SQR1[SQUARE]) == this._PIECE_SQR1[M]) && NAME == 'K') UNSAFE.push(M);
                    else if (['W', 'X', 'Y', 'Z'].some(DIR => this._GET_DIRECTION(M, SQUARE) == DIR))['Q', 'B'].some(P => P == NAME) && UNSAFE.push(M);
                    else ['Q', 'R'].some(P => P == NAME) && UNSAFE.push(M);
                } else NAME == PIECE && UNSAFE.push(M);
            });
        });
        return UNSAFE;
    }
}
