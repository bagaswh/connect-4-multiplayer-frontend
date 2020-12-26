import { cloneDeep } from 'lodash';

import Cell, { Color } from './Cell';
import Point from './Point';

export interface BoardConfig {
  grid?: {
    rows: number;
    cols: number;
  };
  visualizeAreaBoundary?: boolean;
}

export interface Win {
  from: Point;
  to: Point;
  color: Color;
  dir: 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';
  points: Point[];
}

function createGrid(rows = 7, cols = 8) {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells.push([]);
    for (let col = 0; col < cols; col++) {
      cells[row].push(new Cell({ x: col, y: row }));
    }
  }
  return cells;
}

export default class Board extends EventTarget {
  private readonly grid: Cell[][];
  public readonly config: BoardConfig;
  private topCellsRow: { [key: number]: number } = {};
  private currentDropHint!: { cell: Cell; point: Point } | undefined;
  private isScanning = false;
  private horizontalCellsBoundary: {
    [key: number]: {
      left: number;
      right: number;
    };
  } = {};

  public constructor(config?: BoardConfig) {
    super();

    const defaultConfigs: BoardConfig = {
      grid: {
        cols: 8,
        rows: 7,
      },
      visualizeAreaBoundary: true,
    };
    this.config = { ...defaultConfigs, ...(config || {}) };
    this.grid = createGrid(this.config.grid?.rows, this.config.grid?.cols);
    this.setCellsMap();
  }

  public getGrid() {
    return cloneDeep(this.grid);
  }

  private setCellsMap() {
    // Set all top cells to the most bottom for each column.
    for (let col = 0; col < (this.config.grid?.cols || 0); col++) {
      this.topCellsRow[col] = this.config.grid?.rows || 0;
    }

    // Set horizontal cell boundaries.
    for (let row = 0; row < (this.config.grid?.rows || 0); row++) {
      this.horizontalCellsBoundary[row] = {
        left: (this.config.grid?.cols || 0) + 1,
        right: -1,
      };
    }
  }

  public getTopCellsRow() {
    return cloneDeep(this.topCellsRow);
  }

  public getHorizontalCellsBoundary() {
    return cloneDeep(this.horizontalCellsBoundary);
  }

  private setCell(p: Point, cell: Cell) {
    if (this.grid[p.y] && this.grid[p.y][p.x]) {
      this.grid[p.y][p.x] = cell;
    }
  }

  public getCell(p: Point): Cell | undefined {
    const cell = this.grid[p.y]?.[p.x];
    return cell ? cloneDeep(cell) : undefined;
  }

  private setHorizontalCellsBoundary(row: number, x: number) {
    const { left, right } = this.horizontalCellsBoundary[row];
    if (x < left) {
      this.horizontalCellsBoundary[row].left = x;
    }
    if (x > right) {
      this.horizontalCellsBoundary[row].right = x;
    }
  }

  private setTopCellsRow(x: number, y: number) {
    this.topCellsRow[x] = y;
  }

  private getDropPoint(x: number) {
    const y = this.topCellsRow[x] - 1;
    return { x, y };
  }

  public drop(x: number, color: Color): Win | undefined {
    if (this.isScanning) {
      return;
    }

    const point = this.getDropPoint(x);
    const cell = this.getCell(point);
    if (cell) {
      this.setCell(point, new Cell(point, color));
      this.setTopCellsRow(point.x, point.y);
      this.setHorizontalCellsBoundary(point.y, point.x);
      const win = this.checkWin();
      if (win) {
        this.drawWin(win);
        return win;
      }
    }
  }

  public dropHint(x: number) {
    const point = this.getDropPoint(x);
    const cell = this.getCell(point);
    if (cell) {
      this.setCell(point, new Cell(point, Color.DropHint));
      this.currentDropHint = { point, cell };
    }
  }

  public removeDropHints() {
    if (this.currentDropHint) {
      const { point, cell: prevCell } = this.currentDropHint;
      const cell = this.getCell(point);
      if (cell && cell.color == Color.DropHint) {
        this.setCell(point, prevCell);
      }
      this.currentDropHint = undefined;
    }
  }

  private getCellBoundaries() {
    const top = Math.min(...Object.values(this.topCellsRow));
    const left = Math.min(
      ...Object.values(this.horizontalCellsBoundary).map(
        (boundary) => boundary.left
      )
    );
    const right = Math.max(
      ...Object.values(this.horizontalCellsBoundary).map(
        (boundary) => boundary.right
      )
    );
    return { top, left, right };
  }

  private drawArea(top: number, left: number, right: number) {
    for (let row = top; row <= (this.config.grid?.rows || 0); row++) {
      for (let col = left; col <= right; col++) {
        const cell = this.getCell({ x: col, y: row });
        if (cell && cell.empty()) {
          this.setCell(
            { x: col, y: row },
            new Cell({ x: col, y: row }, Color.Mark)
          );
        }
      }
    }
  }

  private printGrid() {
    console.table(this.getGrid().map((row) => row.map((cell) => cell.color)));
  }

  private lookRight(cell: Cell) {
    const { x, y } = cell.point;
    const c1 = this.getCell({ x: x + 1, y });
    const c2 = this.getCell({ x: x + 2, y });
    const c3 = this.getCell({ x: x + 3, y });
    if (!c1 || !c2 || !c3 || !c1.active() || !c2.active() || !c3.active()) {
      return false;
    }
    return cell.compare(c1) && cell.compare(c2) && cell.compare(c3);
  }

  private lookUp(cell: Cell) {
    const { x, y } = cell.point;
    const c1 = this.getCell({ x, y: y - 1 });
    const c2 = this.getCell({ x, y: y - 2 });
    const c3 = this.getCell({ x, y: y - 3 });
    if (!c1 || !c2 || !c3 || !c1.active() || !c2.active() || !c3.active()) {
      return false;
    }
    return cell.compare(c1) && cell.compare(c2) && cell.compare(c3);
  }

  private lookDiagonalRight(cell: Cell) {
    const { x, y } = cell.point;
    const c1 = this.getCell({ x: x + 1, y: y - 1 });
    const c2 = this.getCell({ x: x + 2, y: y - 2 });
    const c3 = this.getCell({ x: x + 3, y: y - 3 });
    if (!c1 || !c2 || !c3 || !c1.active() || !c2.active() || !c3.active()) {
      return false;
    }
    return cell.compare(c1) && cell.compare(c2) && cell.compare(c3);
  }

  private lookDiagonalLeft(cell: Cell) {
    const { x, y } = cell.point;
    const c1 = this.getCell({ x: x - 1, y: y - 1 });
    const c2 = this.getCell({ x: x - 2, y: y - 2 });
    const c3 = this.getCell({ x: x - 3, y: y - 3 });
    if (!c1 || !c2 || !c3 || !c1.active() || !c2.active() || !c3.active()) {
      return false;
    }
    return cell.compare(c1) && cell.compare(c2) && cell.compare(c3);
  }

  private checkWin(): Win | undefined {
    const { top, left, right } = this.getCellBoundaries();
    if (this.config.visualizeAreaBoundary) {
      this.drawArea(top, left, right);
    }

    // +1 because `right` and `left` are actually 0-based.
    const h = this.config.grid?.rows || 0;
    for (let row = top; row < h; row++) {
      for (let col = left; col <= right; col++) {
        const point = { x: col, y: row };
        const cell = this.getCell(point) as Cell;
        if (cell.empty()) continue;

        // look right
        if (col + 3 <= right && this.lookRight(cell)) {
          return {
            from: { x: col, y: row },
            to: { x: col + 3, y: row },
            dir: 'horizontal',
            color: cell.color,
            points: [
              { x: col, y: row },
              { x: col + 1, y: row },
              { x: col + 2, y: row },
              { x: col + 3, y: row },
            ],
          };
        }

        if (row - 3 >= top) {
          // look up
          if (this.lookUp(cell)) {
            return {
              from: { x: col, y: row },
              to: { x: col, y: row - 3 },
              dir: 'vertical',
              color: cell.color,
              points: [
                { x: col, y: row },
                { x: col, y: row - 1 },
                { x: col, y: row - 2 },
                { x: col, y: row - 3 },
              ],
            };
          }

          // look up & right
          if (col + 3 <= right && this.lookDiagonalRight(cell)) {
            return {
              from: { x: col, y: row },
              to: { x: col + 3, y: row - 3 },
              dir: 'diagonal-left',
              color: cell.color,
              points: [
                { x: col, y: row },
                { x: col + 1, y: row - 1 },
                { x: col + 2, y: row - 2 },
                { x: col + 3, y: row - 3 },
              ],
            };
          }

          // look up & left
          if (col - 3 >= left && this.lookDiagonalLeft(cell)) {
            return {
              from: { x: col, y: row },
              to: { x: col - 3, y: row - 3 },
              dir: 'diagonal-right',
              color: cell.color,
              points: [
                { x: col, y: row },
                { x: col - 1, y: row - 1 },
                { x: col - 2, y: row - 2 },
                { x: col - 3, y: row - 3 },
              ],
            };
          }
        }
      }
    }
  }

  private drawWin(win: Win) {
    win.points.forEach((point) => {
      const cell = this.getCell(point);
      if (cell) {
        this.setCell(point, new Cell(point, Color.Winning));
      }
    });
  }
}
