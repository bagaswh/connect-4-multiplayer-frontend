import Point from './Point';

export enum Color {
  PlayerA = 'PlayerA',
  PlayerB = 'PlayerB',
  DropHint = 'DropHint',
  Inactive = 'Inactive',
  Scanning = 'Scanning',
  Mark = 'Mark',
  Winning = 'Winning',
}

export default class Cell {
  public readonly point: Point;
  public color: Color;

  constructor(point: Point, color = Color.Inactive) {
    this.point = point;
    this.color = color;
  }

  setColor(color: Color) {
    this.color = color;
  }

  empty() {
    return this.color == Color.Inactive;
  }

  active() {
    return this.color == Color.PlayerA || this.color == Color.PlayerB;
  }

  compare(target: Cell) {
    return this.color == target.color;
  }
}
