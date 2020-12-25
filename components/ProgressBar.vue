<template>
  <div class="progress-bar">
    <div class="relative pt-1">
      <div
        class="overflow-hidden h-2 mb-4 text-xs flex bg-green-200"
        :class="classes"
      >
        <div
          :style="style"
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop({ type: Number, default: 0 }) progress!: number;
  @Prop({ type: Boolean, default: false }) rounded!: boolean;

  get style() {
    return `width: ${this.progress}%`;
  }

  get classes() {
    return {
      rounded: this.rounded,
    };
  }
}
</script>
