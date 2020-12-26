import { cloneDeep } from 'lodash';
import delay from 'delay';

import Cell, { Color } from './Cell';
import Point from './Point';

export interface BoardConfig {
  grid: {
    rows: number;
    cols: number;
  };
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
    };
    this.config = config || defaultConfigs;
    this.grid = createGrid(this.config.grid?.rows, this.config.grid?.cols);
    this.setCellsMap();
  }

  public getGrid() {
    return cloneDeep(this.grid);
  }

  private setCellsMap() {
    // Set all top cells to the most bottom for each column.
    for (let col = 0; col < this.config.grid.cols; col++) {
      this.topCellsRow[col] = this.config.grid.rows;
    }

    // Set horizontal cells map.
    for (let row = 0; row < this.config.grid.rows; row++) {
      this.horizontalCellsBoundary[row] = {
        left: this.config.grid.cols + 1,
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

  public drop(x: number, color: Color) {
    const point = this.getDropPoint(x);
    const cell = this.getCell(point);
    if (cell) {
      this.setCell(point, new Cell(point, color));
      this.setTopCellsRow(point.x, point.y);
      this.setHorizontalCellsBoundary(point.y, point.x);
      this.checkWin(point);
    }
  }

  private getDropPoint(x: number) {
    const y = this.topCellsRow[x] - 1;
    return { x, y };
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

  private drawPotentiallyScannedArea(top: number, left: number, right: number) {
    for (let row = top; row <= this.config.grid.rows; row++) {
      for (let col = left; col <= right; col++) {
        const cell = this.getCell({ x: col, y: row });
        if (cell && cell.color == Color.Inactive) {
          this.setCell(
            { x: col, y: row },
            new Cell({ x: col, y: row }, Color.Scanning)
          );
        }
      }
    }
  }

  private checkWin(startingPoint: Point) {
    const { top, left, right } = this.getCellBoundaries();
    this.drawPotentiallyScannedArea(top, left, right);
    // console.log({ top, left, right }, startingPoint);

    // const { x: sX, y: sY } = startingPoint;
    // const cellNeighborLeft = this.getCell({ x: sX - 1, y: sY });
    // const shouldCheckLeft = cellNeighborLeft;
    // const shouldCheckLeft = startingPoint.x >= 4;
    // const shouldCheckLeftDiagonal =
    // const shouldCheckUp =
    // const shouldCheckRightDiagonal
    // const shouldCheckRight = startingPoint.x <= this.config.grid.cols - 4;
    // const shouldCheckDown
  }

  private scanVertical(startingPoint: Point) {}

  private scanHorizontal() {}

  private scanDiagonal() {}

  private setCell(p: Point, cell: Cell) {
    if (this.grid[p.y] && this.grid[p.y][p.x]) {
      this.grid[p.y][p.x] = cell;
    }
  }

  public getCell(p: Point): Cell | undefined {
    const cell = this.grid[p.y]?.[p.x];
    return cell ? cloneDeep(cell) : undefined;
  }
}
