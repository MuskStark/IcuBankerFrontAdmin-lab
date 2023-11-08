<template>
  <p>
    <a-button type="primary" @click="handleAdd()">
      新增
    </a-button>&nbsp;
    <a-button type="primary" @click="handleQuery()">
      刷新
    </a-button>
  </p>
  <a-table :dataSource="timelines"
           :columns="columns"
           :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="primary" @click="handleEdit(record)" size="small">
          更新
        </a-button>
        <a-space>
          <a-popconfirm
              title="删除后不可恢复，确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDelete(record)"
          >
            <a-button type="danger" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal
      v-model:title="modelTitle"
      v-model:visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
  >
    <a-form :model="timelineInfo" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="更新内容">
        <a-textarea style="height: 50px" v-model:value="timelineInfo.subject"/>
      </a-form-item>
      <a-form-item label="节点颜色">
        <a-input v-model:value="timelineInfo.color"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {defineComponent, onMounted, ref} from 'vue';
import axios from 'axios';
import {notification} from "ant-design-vue";

export default defineComponent({
  name: 'timeline-view',
  setup() {

    const loading = ref(false);
    const timelines = ref([]);
    const columns = ref([
      {
        title: "序号",
        dataIndex: 'index',
      },
      {
        title: "更新内容",
        dataIndex: 'subject',
      },
      {
        title: "节点颜色",
        dataIndex: 'color',
      },
      {
        title: "更新日期",
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        dataIndex: 'operation'
      }
    ]);
    const getTimeLine = () => {
      loading.value = true;
      axios.get("/sys/timeline/login/queryInfo").then((response) => {
        const json = response.data;
        if (json.status) {
          const timeLine = json.data;
          timeLine.sort((a, b) => {
            return b.updateTime - a.updateTime;
          });
          let index = 1;
          timeLine.forEach((item) => {
            item["index"] = index;
            const date = new Date(item.updateTime);
            const formatted = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            item.updateTime = formatted;
            index++;
          });
          timelines.value = timeLine;
          loading.value = false;
        }
      })
    }

    const handleQuery = () => {
      getTimeLine();
    }

    const modelTitle = ref();
    const modalVisible = ref(false);
    const modalLoading = ref(false);
    const timelineInfo = ref({
      id: undefined,
      subject: undefined,
      color: undefined,
    })

    const handleAdd = () => {
      modelTitle.value = "新增";
      timelineInfo.value.subject = "";
      timelineInfo.value.color = "";
      modalVisible.value = true;
    }

    const handleEdit = (record) => {
      modelTitle.value = "更新";
      timelineInfo.value = window.Tool.copy(record);
      modalVisible.value = true;
    }

    const handleDelete = (record) => {
      axios.get("/sys/timeline/admin/delete/"+ record.id).then((response) => {
        const json = response.data;
        if (json.status) {
          notification.success({description: "删除成功！"});
          handleQuery();
        } else {
          notification.error({description: json.message});
        }
      })
    }

    const handleModalOk = () => {
      if (modelTitle.value === "新增") {
        axios.post("/sys/timeline/admin/add", timelineInfo.value).then((response) => {
          const json = response.data;
          if (json.status) {
            notification.success({description: "新增成功！"});
            handleQuery();
            modalVisible.value = false;
          } else {
            notification.error({description: json.message});
          }
        })
      } else if (modelTitle.value === "更新") {
        axios.post("/sys/timeline/admin/update", timelineInfo.value).then((response) => {
          const json = response.data;
          if (json.status) {
            notification.success({description: "更新成功！"});
            handleQuery();
            modalVisible.value = false;
          } else {
            notification.error({description: json.message});
          }
        })
      }
    }


    onMounted(() => {
      getTimeLine();

    });

    return {
      loading,
      timelines,
      columns,
      handleQuery,
      modelTitle,
      modalVisible,
      modalLoading,
      handleAdd,
      handleEdit,
      handleModalOk,
      handleDelete,
      timelineInfo
    }
  }
})
</script>

<style scoped>
</style>
