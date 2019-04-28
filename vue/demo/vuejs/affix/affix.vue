<template>
  <div ref="placeholderNode" >
    <div ref="fixedNode">

    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import {VueConstructor} from 'vue';

  @Component({
    name: 'a-affix',
  })
  class AffixComponent extends Vue {
    public name = "affix";
    private events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
    private eventHandlers = {};
    private affixStyle;
    private placeholderStyle;
    /*public static install = (vue: VueConstructor): void => {
      vue.component(AffixComponent.name, AffixComponent)
    };*/

    @Prop(Number) readonly offsetTop!: number;
    @Prop(Number) readonly offset!: number;
    @Prop(Number) readonly offsetBottom!: number;
    @Prop() readonly target!: Function;
    @Prop({default: 'ant-affix'}) readonly prefixCls!: string;

  }

  /*AffixComponent.install = function (vue: VueConstructor) {
    vue.component(AffixComponent.name, AffixComponent)
  };*/

  export default AffixComponent;
</script>

<style scoped>

</style>
