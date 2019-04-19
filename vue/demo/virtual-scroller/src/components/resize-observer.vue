<template>
  <div class="resize-observer" tabindex="-1"></div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export class ResizeObserver extends Vue {
    public name: string = 'resize-observer';

    public mounted() {

    }
  }


  /*export default {
    name: "resize-observer"
  }*/
</script>

<style scoped>

</style>
