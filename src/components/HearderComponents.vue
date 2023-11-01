
<template>
  <a-layout-header class="header">
    <div class="logo-image"/>
    <a-button class="userButton" type="link" @click="showDrawer">用户信息</a-button>
    <a-drawer
        v-model:open="open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        style="color: red"
        title="登录信息"
        placement="right"
        @after-open-change="afterOpenChange"
    >
      <div>
        <span style="color: black">
          维护状态：
        </span>
      <a-switch class="switch" v-model:checked="state" @click="clickSwitch" :loading="switchLoading" checked-children="维护中" un-checked-children="服务中" />
      </div>
      <div class="info">
      <a-descriptions>
        <a-descriptions-item label="用户名">{{userInfo.userName}}</a-descriptions-item>
        <a-descriptions-item label="会员等级">{{ userInfo.roleName }}</a-descriptions-item>
      </a-descriptions>
      </div>
      <div class="logoutButton">
      <a-button  type="primary" @click="logout">退出</a-button>
      </div>
    </a-drawer>

  </a-layout-header>
</template>

<script>
import {defineComponent, onMounted, ref} from 'vue';
import axios from "axios";
import {notification} from "ant-design-vue";
import router from "@/router";
import store from "@/store";
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

    const userInfo = ref({
      userName: undefined,
      roleName: undefined
    });

    // 配置用户信息
    userInfo.value.userName = store.state.User.userName;

    if(store.state.User.roleId === 1){
      userInfo.value.roleName = "管理员";
    }else if (store.state.User.roleId === 2){
      userInfo.value.roleName = "高级会员";
    }else {
      userInfo.value.roleName = "普通用户";
    }

    const open = ref(false);
    const showDrawer = () => {
      open.value = true;
    }

    const logout = () => {
      window.sessionStorage.clear();
      router.push("/login");

    }
    onMounted(() => {

      checkStatus();
    })



    return {
      state,
      clickSwitch,
      switchLoading,
      open,
      showDrawer,
      logout,
      userInfo
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
.userButton {
  float: right;
  margin-right: 10px;
  margin-top: 15px;
}
.switch{
  float: right;
}

.logoutButton{
  position: absolute;
  display: inline-block;
  margin-left: 135px;
  bottom: 15px;
}
.info {
  margin-top: 12px;
}
.iterm {
  display: block;
}

</style>
