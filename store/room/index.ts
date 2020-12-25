import { Module, VuexModule } from 'vuex-module-decorators';

@Module({
  name: 'room',
  stateFactory: true,
  namespaced: true,
})
export default class RoomModule extends VuexModule {}
