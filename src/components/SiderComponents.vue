<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
    >
      <a-sub-menu key="admin" v-if="displayMenu()">

        <template #title>
          <span>
            系统管理
          </span>
        </template>

        <a-menu-item key="/user-manager">
          <router-link to="/user-manager">
            <user-outlined/> &nbsp; 用户管理
          </router-link>
        </a-menu-item>

        <a-menu-item key="/batch-job-view">
          <router-link to="/batch-job-view">
            <user-outlined/> &nbsp; 定时任务管理
          </router-link>
        </a-menu-item>
        <a-menu-item key="/timeline-view">
          <router-link to="/timeline-view">
            <user-outlined/> &nbsp; 更新日志维护
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import {defineComponent, ref, watch} from 'vue';
import {UserOutlined} from "@ant-design/icons-vue";
import router from "@/router";
import store from "@/store";

export default defineComponent({
  name: "sideBar-view",
  components: {
    UserOutlined,
  },
  setup() {
    const displayMenu = () => {
      if (store.state.User.roleId === 1) {
        return true;
      }else {
        return false;
      }
    }
    // 使菜单两边选中的功能保持一致
    const selectedKeys = ref([]);
    watch(() => router.currentRoute.value.path, (newValue) => {
      selectedKeys.value = [];
      selectedKeys.value.push(newValue);
    }, {immediate: true});


    return {
      selectedKeys,
      displayMenu
    };
  },
});
</script>

<style scoped>

</style>
