<template>
  <a-button type="dashed" @click="showAddModel">新增用户</a-button>
  <a-table
      :dataSource="userTable"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="userInfoLoading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'roleId'">
        <span v-for="item in USER_ROLE_NAME_ARRAY" :key="item.code">
          <span v-if="item.code === record.roleId">
            {{item.desc}}
          </span>
        </span>
      </template>
    <template v-if="column.dataIndex === 'operation'">
      <a-button
          type="text"
          @click="onUpdate(record)"
      >
        更新
      </a-button>
      <a-popconfirm
          v-if="userTable.length"
          title="Sure to delete?"
          @confirm="onDelete(record.userId)"
      >
        <a>Delete</a>
      </a-popconfirm>
    </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="新增用户" @ok="addNewUser">
    <a-form
        :model="newUserForm"
        name="basic"
        autocomplete="off"
    >
      <a-form-item
          label="用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="newUserForm.userName" />
      </a-form-item>

      <a-form-item
          label="初始密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password v-model:value="newUserForm.password" />
      </a-form-item>
      <a-form-item
          label="用户角色"
          :rules="[{ required: true, message: '请选择用户角色' }]"
      >
        <a-space>
          <a-select
              ref="select"
              v-model:value="newUserForm.roleId"
              style="width: 200px"
              :options="userRole"
          ></a-select>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="updateVisible" title="更新用户" @ok="updateUser">
    <a-form
        :model="updateUserForm"
        name="basic"
        autocomplete="off"
    >
      <a-form-item
          label="用户名"
          disabled
          :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="updateUserForm.userName" />
      </a-form-item>

      <a-form-item
          label="新密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password v-model:value="updateUserForm.password" />
      </a-form-item>
      <a-form-item
          label="用户角色"
          :rules="[{ required: true, message: '请选择用户角色' }]"
      >
        <a-space>
          <a-select
              ref="select"
              v-model:value="updateUserForm.roleId"
              style="width: 200px"
              :options="userRole"
          ></a-select>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {defineComponent, onMounted, ref} from "vue";
import axios from "axios";
import {notification} from "ant-design-vue";

export default defineComponent({
  setup(){

    const USER_ROLE_NAME_ARRAY = window.USER_ROLE_NAME_ARRAY;

    const userTable = ref([]);

    const columns = [{
      title: '用户Id',
      dataIndex: 'userId',
      width: '15%',
    },{
      title: '用户名',
      dataIndex: 'userName',
      width: '15%',
    },{
      title: '注册时间',
      dataIndex: 'createTime',
      width: '15%',
    },{
      title: '用户角色',
      dataIndex: 'roleId',
      width: '15%',
    },{
      title: '操作',
      dataIndex: 'operation',
    }]

    // 定义分页参数
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 5,
    });

    const newUserForm = ref({
      userName: undefined,
      password: undefined,
      roleId: undefined,
    });

    const updateUserForm = ref({
      userId: undefined,
      userName: undefined,
      password: undefined,
      roleId: undefined,
    });

    const userRole = ref([{
      value: 1,
      label: "系统管理员"
    },{
      value: 2,
      label: "高级会员"
    },{
      value: 0,
      label: "普通用户"
    }])

    // 定义显示框显示开关
    const visible = ref(false);
    const updateVisible = ref(false);

    // 定义表格加载状态开关
    const userInfoLoading = ref();


    // 页面方法实现

    // 新增用户
    const showAddModel = ()=>{
      visible.value = true;
    }

    const addNewUser = ()=>{
      axios.post("/user/manage/admin/add-new",newUserForm.value).then((response) =>{
        const json = response.data;
        if(json.status){
          notification.success({
            description: "用户新增成功"
          });
          visible.value = false;
          handelQuery();
        }else {
          notification.error({
            message: "用户新增失败",
            description: json.message
          });
        }
      })
    }
    // updateUser info
    const onUpdate = (record) => {
      updateUserForm.value.password = undefined;
      updateUserForm.value.roleId = record.roleId;
      updateUserForm.value.userName = record.userName;
      updateUserForm.value.userId = record.userId;
      updateVisible.value = true;
    }

    const updateUser = () => {
      axios.post("/user/manage/admin/update", updateUserForm.value).then((response) => {
        const json = response.data;
        if(json.status){
          notification.success({
            description: "用户更新成功"
          });
          updateVisible.value = false;
          handelQuery();
        }else {
          notification.error({
            message: "用户更新失败",
            description: json.message
          });
        }
      })
    }
    //删除用户
    const onDelete = (userId) =>{
      axios.delete("/user/manage/admin/delete/" + userId).then((response) =>{
        const json = response.data;
        if(json.status){
          notification.success({
            description: "用户删除成功"
          });
          handelQuery();
        }else {
          notification.error({
            message: "用户删除失败",
            description: json.message
          });
        }
      })
    }

    const handelQuery = (param) =>{
      if(!param){
        param = {
          page:1,
          size: pagination.value.pageSize
        }
      }
      userInfoLoading.value = true;
      axios.get("/user/manage/admin/query",{
        params:{
          page: param.page,
          size:param.size
        }
      }).then((response) =>{
        const json = response.data;
        if(json.status){
          userTable.value = json.data.resultList;
          pagination.value.current = param.page;
          pagination.value.total = json.data.total;
          userInfoLoading.value = false;
        }
      });
    }

    const handleTableChange = (pagination)=>{
      handelQuery({
        page: pagination.current,
        size: pagination.pageSize
      })
    }

    // 页面数据初始化
    onMounted(()=>{
      handelQuery({
        page:1,
        size:pagination.value.pageSize
      });
    });

    return {
      USER_ROLE_NAME_ARRAY,
      userTable,
      newUserForm,
      userRole,
      columns,
      visible,
      userInfoLoading,
      pagination,
      handelQuery,
      handleTableChange,
      onDelete,
      showAddModel,
      addNewUser,
      updateUserForm,
      updateVisible,
      onUpdate,
      updateUser
    }
  }
});
</script>