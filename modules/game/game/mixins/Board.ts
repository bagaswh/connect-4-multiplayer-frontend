import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Cell, { Color } from '../Cell';
import Board, { Win } from '../Board';
import { boardStore } from '~/store';

@Component({
  computed: {
    ...mapState('room/board', ['board', 'boardGrid']),
  },
})
export default class BoardMixin extends Vue {
  @Prop({ type: String, default: '' }) dropColor!: Color;

  board!: Board;
  boardGrid!: Cell[][];
  win!: Win | undefined;

  get boardConfig() {
    return this.board.config;
  }

  created() {
    boardStore.initBoard({ visualizeAreaBoundary: true });
    this.updateGrid();
    this.board.addEventListener('updategrid', this.updateGrid.bind(this));
  }

  updateGrid() {
    // this.boardGrid = this.board
    // .getGrid()
    // .map((row) => row.map((cell) => ({ p: cell.point, color: cell.color })));
    // this.$forceUpdate();
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
