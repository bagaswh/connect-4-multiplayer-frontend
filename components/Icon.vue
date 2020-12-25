<template>
  <img
    :class="className"
    :src="require(`~/assets/icons/${mode}/${name}.svg`)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop({ type: Object, default: () => ({}) }) name!: string;
  @Prop({ type: Boolean, default: false }) outline!: boolean;
  @Prop({ type: String, default: '' }) size!: 'small' | 'medium' | 'large';

  get mode() {
    return this.outline ? 'outline' : 'solid';
  }

  get className() {
    let className = 'h-6 w-6';
    switch (this.size) {
      case 'small':
        className = 'h-3 w-3';
        break;
      case 'medium':
        className = 'h-9 w-9';
        break;
      case 'large':
        className = 'h-12 w-12';
        break;
    }
    return className;
  }
}
</script>
