<template>
  <div id="app" :class="$style.view">
    <section>
      <editor @change="handleCodeChange"></editor>
    </section>

    <section>
      <div>
        <select v-model="displayType">
          <option v-for="(value, key) of types" :key="key" :value="key">{{value}}</option>
        </select>
      </div>
      <div :class="" v-for="(type, key) of types" v-show="displayType === key" :key="key">
        <editor :title="type" :read-only="true" :ref="`${key}Editor`"></editor>
      </div>
    </section>
  </div>
</template>

<script>
  import Editor from 'Editor.vue';
  import {compile} from 'vue-template-compiler';

  const types = {
    ast: '抽象语法树(AST)',
    render: '渲染函数(render)',
    staticRenderFns: '静态渲染函数(staticRenderFns)',
    errors: '编译错误信息(errors)'
  };

  export default {
    name: "App",
    data() {
      return {
        displayType: 'ast',
        compiledResult: ''
      };
    },
    components: {
      'editor': Editor,
    },
    methods: {
      handleCodeChange(code) {
        this.compiledResult = compile(code, {preserveWhitespace: true});
        this.setEditorValue(this.displayType);
      },
      setEditorValue(type) {
        this.$nextTick(() => {
          switch (type) {
            case 'ast':
            default:
              this.$refs.astEditor[0].setValue(this.formatJson(this.compiledResult.ast));
              break;
            case 'render':
              break;
            case 'staticRenderFns':
              break;
            case 'errors':
              break;
          }
        });
      },
      formatJson(json) {
        if (!json) return;
        let cache = [];

        return JSON.stringify(json, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              return '[循环引用]';
            }

            cache.push(value);
          }

          return value;
        });
      }
    }
  }
</script>

<style scoped>

</style>
