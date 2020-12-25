import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import room from '~/store/room';
import board from '~/store/room/board';

let roomStore: room;
let boardStore: board;

function initialiseStores(store: Store<any>): void {
  roomStore = getModule(room, store);
  boardStore = getModule(board, store);
}

export { initialiseStores, roomStore, boardStore };
