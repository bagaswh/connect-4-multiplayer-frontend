import { cloneDeep } from 'lodash';

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

export default class Board {
  private readonly grid: Cell[][];
  private readonly config: BoardConfig;
  private topCellsRow: { [key: number]: number } = {};

  public constructor(config?: BoardConfig) {
    const defaultConfigs: BoardConfig = {
      grid: {
        cols: 8,
        rows: 7,
      },
    };
    this.config = config || defaultConfigs;
    this.grid = createGrid(this.config.grid?.rows, this.config.grid?.cols);
    this.setTopCellsRow();
  }

  private setTopCellsRow() {
    // Set all top cells to the most bottom for each column.
    for (let col = 0; col < this.config.grid.cols; col++) {
      this.topCellsRow[col] = this.config.grid.rows;
    }
  }

  public getGrid() {
    return cloneDeep(this.grid);
  }

  public getTopCellsRow() {
    return cloneDeep(this.topCellsRow);
  }

  public drop(x: number, color: Color) {
    const y = this.topCellsRow[x] - 1;
    const point: Point = { x, y };
    const cell = this.getCell(point);
    if (cell) {
      this.setCell(point, new Cell(point, color));
      this.topCellsRow[x] = y;
    }
  }

  private setCell(p: Point, cell: Cell) {
    if (this.grid[p.y] && this.grid[p.x]) {
      this.grid[p.y][p.x] = cell;
    }
  }

  public getCell(p: Point): Cell | undefined {
    const cell = this.grid[p.y]?.[p.x];
    return cell ? cloneDeep(cell) : undefined;
  }
}
