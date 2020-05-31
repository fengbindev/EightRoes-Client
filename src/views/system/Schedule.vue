<template>
  <div>
    <a-card :bordered="false">
      <a-list size="large" :loading="loading">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta>
            <a slot="title" class="list-item-title">{{ item.sourceName }}</a>
            <div slot="description">
              <div class="list-content-item">
                <p> 类型：<a href="#">{{ item.typeCode }}</a></p>
              </div>
              <div class="list-content-item">
                <p> id：<a href="#">{{ item.sourceId }}</a></p>
              </div>
              <div class="list-content-item">
                <p> 状态：
                  <a-tag color="green" v-if="item.isUsing==='Y'">启用</a-tag>
                  <a-tag color="red" v-else>禁用</a-tag>
                </p>
              </div>
              <div class="list-content-item">
                <p> 下次执行时间：<a href="#">{{ item.nextRunTime }}</a></p>
              </div>
            </div>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)" v-priv="'ScheduleManagerPriv.Edit'">编辑</a>
          </div>
          <div slot="actions">
            <a @click="excuted(item)" v-priv="'AccountConfigPriv.Run'">立即执行</a>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <schedule-modal ref="modal" @ok="handleOk"/>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import ScheduleModal from '@/views/system/components/ScheduleModal'
import { getSchedule, excutedSchedule } from '@/api/system'

export default {
  name: 'StandardList',
  components: {
    HeadInfo,
    ScheduleModal
  },
  data () {
    return {
      loading: false,
      data: []
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    getDate () {
      this.loading = true
      getSchedule().then(res => {
        this.loading = false
      if (res.status === 1) {
        this.data = res.data
      }
    })
    },
    edit (record) {
      this.$refs.modal.edit(record)
    },
    excuted (record) {
      excutedSchedule(record.id).then(res => {
        if (res.status === 1) {
          this.$message.success('任务开始执行')
        } else {
              this.$message.error(res.message)
          }
      })
    },
    handleOk () {
      this.getDate()
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }
    .list-item-title {
      font-size: 17px;
    }
    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
            a {
                margin-left: 12px;
                line-height: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;
              }
        }
    }
</style>
