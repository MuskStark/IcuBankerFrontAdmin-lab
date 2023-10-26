
<template>
  <a-layout-header class="header">
    <div class="logo-image"/>

  </a-layout-header>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
  name: "sideBar-view",
  setup() {


    return {
    };
  },
});
</script>
<style scoped>
.logo-image{
  margin-top: 5px;
  margin-right: 12px;
  float: left;
  background: url("@/assets/ICUBanker.png") no-repeat scroll center;
  background-size: 100% 100%;
  width: 200px;
  height: 50px;
  display: inline-block;
}
</style>
