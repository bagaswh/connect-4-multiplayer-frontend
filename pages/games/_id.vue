<template>
  <div class="game-room">
    <header class="game-room__controls"></header>
    <section class="game-room__main">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 border game-room__chat"></div>

        <div class="col-span-9 border game-room__level">
          <div class="game-room__score flex w-full">
            <div
              class="game-room__player-one-score flex w-full border-r-2 border-solid border-gray-300"
            >
              <div class="game-room__player-name w-full">PLAYER 1</div>
              <div class="game-room__player-score w-full text-right pr-1">
                69
              </div>
            </div>

            <div class="game-room__player-two-score flex w-full">
              <div class="game-room__player-score w-full pl-1">96</div>
              <div class="game-room__player-name w-full text-right">
                PLAYER 2
              </div>
            </div>
          </div>

          <div class="game-room__timer">
            <ProgressBar />
          </div>

          <div class="game-room__board">
            <Board drop-color="ActiveB" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Icon from '~/components/Icon.vue';
import ProgressBar from '~/components/ProgressBar.vue';
import Board from '~/modules/game/game/components/Board.vue';

@Component({ components: { Icon, ProgressBar, Board } })
export default class GameRoom extends Vue {}
</script>
