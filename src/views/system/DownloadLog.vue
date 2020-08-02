<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="文件名">
              <a-input placeholder="请输入" v-model="queryParam.fileName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="15">
            <a-form-item
              label="起止时间">
              <a-range-picker
                v-model="queryParam.lastModifyTime"
                :show-time="{ format: 'HH:mm:ss' }"
                @change="onCreateTimeChange" />
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
      rowKey="fileName"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="download(record)">点击下载</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getLogFile } from '@/api/system'
import moment from 'moment'
import { downloadFile } from '@/utils/util'
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
          title: '文件名',
          dataIndex: 'fileName'
        },
        {
          title: '大小',
          dataIndex: 'fileSize'
        },
        {
          title: '最后修改时间',
          dataIndex: 'lastModifyTime'
        },
        {
          title: '下载',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getLogFile(Object.assign(parameter, {
          fileName: this.queryParam.fileName ? this.queryParam.fileName.trim() : '',
          startTime: this.queryParam.lastModifyTime ? moment(this.queryParam.lastModifyTime[0]).valueOf() : 0,
          endTime: this.queryParam.lastModifyTime ? moment(this.queryParam.lastModifyTime[1]).valueOf() : 0
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
    },
    download (record) {
      const downloadPath = '/operateLog/download?fileName=' + record.fileName
      downloadFile(downloadPath, record.fileName)
    }
  },
  watch: {
  }
}
</script>
