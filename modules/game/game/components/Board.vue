<template>
  <div class="board">
    <div class="board__drop-points flex justify-between mb-4 border">
      <div
        v-for="(_, index) in new Array(boardConfig.grid.cols)"
        :key="index"
        class="board__drop-point"
      >
        <div
          class="board__cell-drop-point w-16 h-16 border rounded-full"
          :class="['hover:' + getColorClassName(dropColor)]"
          @click="drop(index, dropColor)"
          @mouseenter="dropHint(index)"
          @mouseleave="removeDropHints"
        />
      </div>
    </div>
    <div class="board__cells">
      <div
        v-for="(row, rowIndex) in boardGrid"
        :key="rowIndex"
        class="board__cells-row flex justify-between"
      >
        <div
          v-for="(col, colIndex) in boardGrid[rowIndex]"
          :key="colIndex"
          class="board__cell w-16 h-16 border rounded-full"
          :class="getColorClassName(col.color)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Color } from '../Cell';
import BoardMixin from '../mixins/Board';

@Component
export default class Board extends Mixins(BoardMixin) {
  @Prop({
    type: Object,
    default: () => ({
      [Color.PlayerA]: 'red',
      [Color.PlayerB]: 'yellow',
      [Color.Mark]: 'gray',
      [Color.Inactive]: '',
    }),
  })
  colorConfig!: Record<Color, string>;

  get computedColorConfig() {
    return {
      ...this.colorConfig,
      [Color.DropHint]: this.colorConfig[this.dropColor] + '-light',
      [Color.Scanning]: this.colorConfig[this.dropColor] + '-light',
      [Color.Winning]:
        this.colorConfig[this.win?.color || this.dropColor] + '-dark',
    };
  }

  getColor(color: Color) {
    return this.computedColorConfig[color];
  }

  getColorClassName(color: Color) {
    const c = this.getColor(color);
    const map: any = {
      red: 'bg-red-500',
      'red-light': 'bg-red-300',
      'red-dark': 'bg-red-800',
      yellow: 'bg-yellow-500',
      'yellow-light': 'bg-yellow-300',
      'yellow-dark': 'bg-yellow-800',
      gray: 'bg-gray-400',
      'gray-light': 'bg-gray-200',
      'gray-dark': 'bg-gray-800',
      green: 'bg-green-500',
      'green-light': 'bg-green-300',
      'green-dark': 'bg-green-700',
    };
    return [map[c]];
  }
}
</script>
