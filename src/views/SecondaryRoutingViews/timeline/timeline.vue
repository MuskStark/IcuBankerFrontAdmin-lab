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
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'timeline-view',
  setup () {

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
          loading.value= false;
        }
      })
    }

    const handleQuery = () => {
      getTimeLine();
    }


    onMounted(() => {
      getTimeLine();

    });

    return {
      loading,
      timelines,
      columns,
      handleQuery
    };
  }
})
</script>

<style scoped>
</style>
