import { Vue, Component } from 'vue-property-decorator';
import Board from '../Board';
import { Color } from '../Cell';
import Point from '../Point';

interface Cell {
  p: Point;
  color: Color;
}

@Component
export default class BoardMixin extends Vue {
  board!: Board;
  boardGrid!: Cell[][];

  created() {
    this.board = new Board();
    this.updateGrid();
  }

  updateGrid() {
    this.boardGrid = this.board
      .getGrid()
      .map((row) => row.map((cell) => ({ p: cell.point, color: cell.color })));
    this.$forceUpdate();
  }

  drop(x: number, color: Color) {
    this.board.drop(x, color);
    this.updateGrid();
  }
}
