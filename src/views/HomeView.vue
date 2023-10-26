<template>
  <a-layout>
    <header-bar-view></header-bar-view>
    <a-layout>
      <side-bar-view></side-bar-view>

      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          ICUBanker ©2023 Created by PhoebeJ
        </a-layout-footer>
      </a-layout>
    </a-layout>

  </a-layout>
</template>
<script>
import { defineComponent, ref } from 'vue';
import SideBarView from "@/components/SiderComponents.vue";
import HeaderBarView from "@/components/HearderComponents.vue";
export default defineComponent({
  components: {
    HeaderBarView,
    SideBarView,
  },
  setup() {
    return {
      selectedKeys1: ref(['2']),
      selectedKeys2: ref(['1']),
      collapsed: ref(false),
      openKeys: ref(['sub1']),
    };
  },
});
</script>
<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
