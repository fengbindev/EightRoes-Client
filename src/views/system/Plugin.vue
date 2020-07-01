<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="pluginTree"
          :openKeys.sync="openKeys"
          :search="true"
          @handleSearch="handleSearch"
          @click="handleClick"></s-tree>
      </a-col>
      <a-col :span="19">
        <a-table :columns="columns" :data-source="pluginData.extendPoints" :row-key="record => record.id" bordered>
          <template slot="title">
            扩展点
          </template>
        </a-table>

        <a-table :columns="columns" :data-source="pluginData.extendActions" :row-key="record => record.id" bordered>
          <template slot="title">
            扩展行为
          </template>
        </a-table>

        <a-table :columns="columns" :data-source="pluginData.extendServices" :row-key="record => record.id" bordered>
          <template slot="title">
            扩展服务
          </template>
        </a-table>

        <a-table :columns="columns" :data-source="pluginData.extendItems" :row-key="record => record.id" bordered>
          <template slot="title">
            扩展项
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import STree from './components/tree/Tree'
import { STable } from '@/components'
import { getPlugin, getPluginDetail } from '@/api/system'

export default {
  name: 'TreeList',
  components: {
    STable,
    STree
  },
  data () {
    return {
      openKeys: ['0'],
      loading: false,
      pluginData: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '描述',
          dataIndex: 'desc'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPluginDetail(this.queryParam.pluginId ? this.queryParam.pluginId : '')
          .then(res => {
            return res.result
          })
      },
      pluginTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    getPlugin().then(res => {
      this.pluginTree = res.data
    })
  },
  methods: {
    handleClick (e) {
      getPluginDetail(e.key).then(res => {
        this.pluginData = res.data
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSearch (e) {
      getPlugin(Object.assign({}, {
        title: e.args[0] ? e.args[0] : ''
      })).then(res => {
         this.pluginTree = res.data
      })
    }
  }
}
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
