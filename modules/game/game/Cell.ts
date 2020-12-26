import Point from './Point';

export enum Color {
  ActiveA = 'ActiveA',
  ActiveB = 'ActiveB',
  DropHint = 'DropHint',
  Inactive = 'Inactive',
  Scanning = 'Scanning',
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
}
