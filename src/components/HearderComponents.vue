
<template>
  <a-layout-header class="header">
    <div class="logo-image"/>
    <a-switch class="switch" v-model:checked="state" @click="clickSwitch" :loading="switchLoading" checked-children="维护中" un-checked-children="服务中" />

  </a-layout-header>
</template>

<script>
import {defineComponent, onMounted, ref} from 'vue';
import axios from "axios";
import {notification} from "ant-design-vue";
export default defineComponent({
  name: "sideBar-view",
  setup() {
    const switchLoading = ref(false);
    const state = ref(false);
    const clickSwitch = () => {
      switchLoading.value = true;
      let _state;
      if(state.value){
        _state = 1;
      }else {
        _state = 0;
      }
      axios.get("/user/system/admin/door/update/" + _state).then((response) => {
        const json = response.data;
        if(json.status){
          notification.success({
            message: '切换成功',
          })
          switchLoading.value = false;
        }else {
          notification.error({
            message: '切换失败',
          })
          state.value = !state.value;
          switchLoading.value = false;
        }
      })
    };

    const checkStatus = () => {
      axios.get("/user/system/login/door/status").then((response) => {
        const json = response.data;
        if (json.status) {
          if(json.data === 0){
            state.value = false;
          }else {
            state.value = true;
          }
        }
      })
    }
    onMounted(() => {
      checkStatus();
    })



    return {
      state,
      clickSwitch,
      switchLoading
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
.switch{
  float: right;
  margin-right: 20px;
  margin-top: 20px;
}
</style>
