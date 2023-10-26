<template>
  <a-row >
    <a-col :span="8" :offset="10" >
      <a-form
          class="login"
          :model="formData"
          name="basic"
          autocomplete="off"
      >
        <div class="logo-image"> </div>
        <a-form-item
            label="用户名"
            name="userName"
            :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formData.userName" />
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formData.password" />
        </a-form-item>

        <a-form-item name="remember" >
          <a-checkbox v-model:checked="formData.agree">
            同意用户使用协议
          </a-checkbox>
          <a v-on:click="userContract">查看协议</a>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
          <a-button type="primary" @click="login">登录</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>

import { defineComponent, reactive } from 'vue';
import axios from "axios";
import {notification} from "ant-design-vue";
import store from "@/store";
import router from "@/router";
  export default defineComponent({
    name: 'LoginView',
    setup() {
      const formData = reactive({
        userName: '',
        password: '',
        agree: true,
      });

      const userContract = ()=>{
        console.log('点击用户协议');
      }
      const login = ()=>{
        if(formData.agree) {
          axios.post("/user/manage/login", formData).then((response) => {
            const json = response.data;
            if (json.status) {
              store.commit("setUserInfo", json.data);
              if(json.data.roleId === 1) {
                notification.success({
                  message: '登录成功',
                  description: '欢迎' + json.data.userName + '！'
                })
                // 界面跳转
                router.push("/");
              }else {
                notification.error({
                  message: '禁止登录',
                  description: '非管理员！'
                });
              }
            } else {
              notification.error({
                message: '登陆失败',
                description: json.message
              });
            }
          });
        }else {
          notification.warning({
            description: "请先同意用户协议！"
          });
        }
      }

      return {
        formData,
        login,
        userContract
      };
    },
  });


</script>
<style scoped>
.login {
  position: absolute;
  margin-top: 200px;
  padding: 30px 30px 20px;
  border: 2px solid grey;
  border-radius: 10px;
  background-color: #fcfcfc;
}
.logo-image{
  position: relative;
  margin-top: 5px;
  margin-bottom: 24px;
  background: url("@/assets/ICUBanker.png") no-repeat scroll center;
  background-size: 100% 100%;
  width: 300px;
  height: 100px;
  display: inline-block;
}
</style>