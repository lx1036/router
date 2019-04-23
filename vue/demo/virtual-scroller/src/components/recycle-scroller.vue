<template>
  <div class="vue-recycle-scroller">
    <div v-if="$slots.before" class="vue-recycle-scroller-slot">
      <slot name="before"></slot>
    </div>

    <div class="vue-recycle-scroller-item-wrapper">
      <div v-for="view of pool" class="vue-recycle-scroller-item-view">
        <slot></slot>
      </div>
    </div>

    <div v-if="$slots.after" class="vue-recycle-scroller-slot">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script lang="ts">
  /**
   * @see Slots: https://cn.vuejs.org/v2/guide/components-slots.html
   */
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    name: 'recycle-scroller',
  })
  export default class RecycleScroller extends Vue {
    public pool = [];
  }
</script>

<style scoped>

</style>
