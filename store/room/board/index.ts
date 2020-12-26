import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Board, { BoardConfig } from '~/modules/game/game/Board';
import { Color } from '~/modules/game/game/Cell';

@Module({
  name: 'room/board',
  stateFactory: true,
  namespaced: true,
})
export default class BoardModule extends VuexModule {
  board!: Board;
  initialized = false;

  @Mutation
  initBoard(config?: BoardConfig) {
    this.board = new Board(config);
    this.initialized = true;
  }

  @Mutation
  drop({ x, color }: { x: number; color: Color }) {
    this.board.drop(x, color);
  }

  get boardConfig() {
    return this.board.config;
  }
}
