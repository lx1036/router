<template>
  <div id="app">
    <p>asdfasdfsdaf</p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class App extends Vue {
    public beforeCreate() {
      console.log('beforeCreate');
    }

    public created() {
      console.log('created');
    }

    public beforeMount() {
      console.log('beforeMount');
    }

    public mounted() {
      console.log('mounted');
    }

    public beforeDestroy() {
      console.log('beforeDestroy');
    }

    public destroyed() {
      console.log('destroy');
    }
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
