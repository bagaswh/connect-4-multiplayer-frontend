import Board from '~/modules/game/game/Board';
import Cell, { Color } from '~/modules/game/game/Cell';

let board: Board;

function initializeBoard() {
  return new Board({
    grid: {
      rows: 7,
      cols: 6,
    },
  });
}

describe('test board', () => {
  beforeEach(() => {
    board = initializeBoard();
  });

  describe.skip('new board', () => {
    test('all top cells should be at the bottom of each column', () => {
      expect(board.getTopCellsRow()).toStrictEqual({
        '0': 2,
        '1': 2,
        '2': 2,
      });

      expect(board.getHorizontalCellsBoundary()).toStrictEqual({
        '0': { left: -1, right: -1 },
        '1': { left: -1, right: -1 },
      });
    });

    test('grid structure', () => {
      expect(board.getGrid()).toStrictEqual<Cell[][]>([
        [
          new Cell({ x: 0, y: 0 }),
          new Cell({ x: 1, y: 0 }),
          new Cell({ x: 2, y: 0 }),
        ],
        [
          new Cell({ x: 0, y: 1 }),
          new Cell({ x: 1, y: 1 }),
          new Cell({ x: 2, y: 1 }),
        ],
      ]);
    });

    test('get cell', () => {
      expect(board.getCell({ x: 1, y: 0 })).toStrictEqual<Cell>(
        new Cell({ x: 1, y: 0 })
      );
    });
  });

  describe.only('drop', () => {
    beforeEach(() => {
      board = initializeBoard();
      // board.drop(0, Color.ActiveA);
      board.drop(2, Color.ActiveA);
      board.drop(4, Color.ActiveA);
      board.drop(5, Color.ActiveA);
      board.drop(1, Color.ActiveA);
      board.drop(0, Color.ActiveA);

      board.drop(1, Color.ActiveA);
      board.drop(5, Color.ActiveA);
      // this should get ignored
      // board.drop(0, Color.ActiveA);
    });

    test('board structure after drop', () => {
      expect(board.getGrid()).toStrictEqual<Cell[][]>([
        [
          new Cell({ x: 0, y: 0 }, Color.ActiveA),
          new Cell({ x: 1, y: 0 }),
          new Cell({ x: 2, y: 0 }),
        ],
        [
          new Cell({ x: 0, y: 1 }, Color.ActiveA),
          new Cell({ x: 1, y: 1 }),
          new Cell({ x: 2, y: 1 }),
        ],
      ]);
    });

    test('board top cells dictionary after drop', () => {
      expect(board.getTopCellsRow()).toStrictEqual({
        '0': 0,
        '1': 2,
        '2': 2,
      });
    });

    test.only('board horizontal cells boundary after drop', () => {
      const center = board.config.grid.cols / 2;
      expect(board.getHorizontalCellsBoundary()).toStrictEqual({
        '0': { left: NaN, right: NaN },
        '1': { left: NaN, right: NaN },
        '2': { left: NaN, right: NaN },
        '3': { left: NaN, right: NaN },
        '4': { left: NaN, right: NaN },
        '5': { left: 1, right: 5 },
        '6': { left: 0, right: 5 },
      });
    });
  });
});
