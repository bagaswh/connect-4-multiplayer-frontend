<template>
  <div class="board">
    <div class="board__drop-points flex">
      <div
        v-for="(_, index) in new Array(boardConfig.grid.cols)"
        :key="index"
        class="board__drop-point"
      >
        <div
          class="board__cell-drop-point w-6 h-6 border rounded-full"
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
        class="board__cells-row flex"
      >
        <div
          v-for="(col, colIndex) in boardGrid[rowIndex]"
          :key="colIndex"
          class="board__cell w-6 h-6 border rounded-full"
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
      [Color.ActiveA]: 'red',
      [Color.ActiveB]: 'yellow',
      [Color.Scanning]: 'gray',
      [Color.Inactive]: '',
    }),
  })
  colorConfig!: Record<Color, string>;

  @Prop({ type: String, default: '' }) dropColor!: Color;

  get computedColorConfig() {
    return {
      ...this.colorConfig,
      [Color.DropHint]: this.colorConfig[this.dropColor] + '-light',
    };
  }

  getColor(color: Color) {
    return this.computedColorConfig[color];
  }

  getColorClassName(color: Color) {
    const c = this.getColor(color);
    const map: any = {
      red: 'bg-red-500',
      'red-ligt': 'bg-red-300',
      yellow: 'bg-yellow-500',
      'yellow-light': 'bg-yellow-300',
      gray: 'bg-gray-400',
      'gray-light': 'bg-gray-200',
    };
    return [map[c]];
  }
}
</script>
