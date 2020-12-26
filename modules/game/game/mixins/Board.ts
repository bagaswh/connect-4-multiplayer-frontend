import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { Color } from '../Cell';
import Point from '../Point';
import Board from '../Board';
import { boardStore } from '~/store';

interface Cell {
  p: Point;
  color: Color;
}

@Component({
  computed: {
    ...mapState('room/board', ['board']),
  },
})
export default class BoardMixin extends Vue {
  board!: Board;
  boardGrid!: Cell[][];

  get boardConfig() {
    return this.board.config;
  }

  created() {
    boardStore.initBoard();
    this.updateGrid();
    // TODO: Slow.
    this.board.addEventListener('update', this.updateGrid.bind(this));
  }

  updateGrid() {
    this.boardGrid = this.board
      .getGrid()
      .map((row) => row.map((cell) => ({ p: cell.point, color: cell.color })));
    this.$forceUpdate();
  }

  drop(x: number, color: Color) {
    boardStore.drop({ x, color });
    boardStore.dropHint(x);
    this.updateGrid();
  }

  dropHint(x: number) {
    boardStore.dropHint(x);
    this.updateGrid();
  }

  removeDropHints() {
    boardStore.removeDropHints();
    this.updateGrid();
  }
}
