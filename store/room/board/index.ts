import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Board, { BoardConfig, Win } from '~/modules/game/game/Board';
import Cell, { Color } from '~/modules/game/game/Cell';

@Module({
  name: 'room/board',
  stateFactory: true,
  namespaced: true,
})
export default class BoardModule extends VuexModule {
  board!: Board;
  initialized = false;
  boardGrid: Cell[][] = [[]];
  win: Win | undefined = undefined;

  get boardConfig() {
    return this.board.config;
  }

  @Mutation
  initBoard(config?: BoardConfig) {
    this.board = new Board(config);
    this.boardGrid = this.board.getGrid();
    this.initialized = true;
  }

  @Mutation
  dropHint(x: number) {
    this.board.dropHint(x);
    this.boardGrid = this.board.getGrid();
  }

  @Mutation
  removeDropHints() {
    this.board.removeDropHints();
    this.boardGrid = this.board.getGrid();
  }

  @Mutation
  drop({ x, color }: { x: number; color: Color }) {
    const win = this.board.drop(x, color);
    if (win) {
      this.win = win;
    }
    this.boardGrid = this.board.getGrid();
  }
}
