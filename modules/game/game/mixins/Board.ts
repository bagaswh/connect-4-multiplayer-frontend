import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Cell, { Color } from '../Cell';
import Board, { Win } from '../Board';
import { boardStore } from '~/store';

@Component({
  computed: {
    ...mapState('room/board', ['board', 'boardGrid', 'win']),
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
    boardStore.initBoard({ visualizeAreaBoundary: false });
  }

  drop(x: number, color: Color) {
    boardStore.drop({ x, color });
    boardStore.dropHint(x);
    this.dropColor =
      this.dropColor == Color.PlayerA ? Color.PlayerB : Color.PlayerA;
  }

  dropHint(x: number) {
    boardStore.dropHint(x);
  }

  removeDropHints() {
    boardStore.removeDropHints();
  }
}
