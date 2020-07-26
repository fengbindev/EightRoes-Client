<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="用户名">
              <a-input placeholder="请输入" v-model="queryParam.userName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="15">
            <a-form-item
              label="起止日期">
              <a-range-picker
                v-model="queryParam.createTime"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                @change="onCreateTimeChange" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="IP地址">
              <a-input placeholder="请输入" v-model="queryParam.ip"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getOperateLog } from '@/api/system'
import moment from 'moment'
export default {
  name: 'UserOperateLog',
  components: {
    STable
  },
  data () {
    return {
      description: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '时间',
          dataIndex: 'createTime'
        },
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: 'IP地址',
          dataIndex: 'ip'
        },
        {
          title: '原始消息',
          dataIndex: 'logMessage',
          ellipsis: true
        },
        {
          title: '请求消息',
          dataIndex: 'detailMessage',
          ellipsis: true
        },
        {
          title: '操作结果',
          dataIndex: 'result'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOperateLog(Object.assign(parameter, {
          userName: this.queryParam.userName ? this.queryParam.userName.trim() : '',
          ip: this.queryParam.ip ? this.queryParam.ip.trim() : '',
          startTime: this.queryParam.createTime ? moment(this.queryParam.createTime[0]).format('YYYY-MM-DD HH:mm') : '',
          endTime: this.queryParam.createTime ? moment(this.queryParam.createTime[1]).format('YYYY-MM-DD HH:mm') : ''
        }))
      }
    }
  },
  created () {
  },
  methods: {
    onCreateTimeChange (value, dateString) {
    },
    handleOk () {
      this.$refs.table.refresh(true)
    }
  },
  watch: {
  }
}
</script>
