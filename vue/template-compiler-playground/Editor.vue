<template>
  <div>

    <label>
      <textarea ref="editor"></textarea>
    </label>
  </div>
</template>

<script>
  import CodeMirror from 'codemirror';
  import {debounce} from 'lodash';

  export default {
    name: "Editor",
    data(vm) {
      return {
        currentMode: vm.mode,
        currentTheme: vm.theme,
      }
    },
    props: {
      readOnly: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: 'vue'
      }
    },
    methods: {
      setValue(code) {

      },
      loadTheme(theme) {

      },
      loadMode(mode) {

      }
    },
    mounted() {
      this.loadTheme(this.currentTheme);
      this.loadMode(this.currentMode);

      this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
        value: '',
        mode: this.currentMode,
        theme: this.currentTheme,
        lineNumbers: true,
        autofocus: !this.readOnly,
        readOnly: this.readOnly,
        lineWrapping: true,
      });

      this.editor.on('change', debounce(() => {
        this.$emit('change', this.editor.getValue());
      }, 3000, {trailing: true}));
    }
  }
</script>

<style scoped>

</style>
