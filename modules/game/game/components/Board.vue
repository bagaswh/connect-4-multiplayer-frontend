<template>
  <div class="board">
    <div class="board__drop-points flex">
      <div
        v-for="(_, index) in new Array(boardConfig.grid.cols)"
        :key="index"
        class="board__drop-point"
      >
        <div
          class="board__cell-drop-point w-6 h-6 border"
          @click="drop(index, dropColor)"
        />
      </div>
    </div>
    <div class="board__cells">
      <div
        v-for="(row, rowIndex) in boardGrid"
        :key="rowIndex"
        class="board__cells-row flex"
      >
        <div
          v-for="(col, colIndex) in boardGrid[rowIndex]"
          :key="colIndex"
          class="board__cell w-6 h-6 border"
          :class="getColorClassName(col.color)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { BoardConfig } from '../Board';
import { Color } from '../Cell';
import BoardMixin from '../mixins/Board';

export interface ColorConfig {
  [key: string]: string;
}

@Component
export default class Board extends Mixins(BoardMixin) {
  @Prop({
    type: Object,
    default: () => ({
      [Color.ActiveA]: 'red',
      [Color.ActiveB]: 'yellow',
      [Color.Inactive]: '',
    }),
  })
  colorConfig!: ColorConfig;

  @Prop({ type: String, default: '' }) dropColor!: Color;

  boardConfig!: BoardConfig;

  created() {
    this.boardConfig = { grid: { rows: 7, cols: 8 } };
  }

  getColor(color: Color) {
    return this.colorConfig[color];
  }

  getColorClassName(color: Color) {
    const c = this.getColor(color);
    const map: any = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
    };
    return [map[c]];
  }
}
</script>

<style>
.board__cell-drop-point:hover {
  background-color: red;
}
</style>
