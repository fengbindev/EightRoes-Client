
<template>
  <div class="a-toolbar" :class="{ small: size === 'small' }">
    <div class="a-toolbar-body" :style="{ justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }">
      <slot></slot>
    </div>

  </div>
</template>

<script>

export default {
  data () {
    return {
      hiddenChildren: [],
      dropDownItems: []
    }
  },
  props: {
    size: {
      type: String,
      default: 'normal'
    },
    align: {
      type: String,
      default: 'left'
    }
  },
  methods: {
    shrink (wrapWidth, contentWidth) {
    },
    createDropDown () {
    },
    handleDropDownClick (item) {
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped>
  .a-toolbar {
    width: 100%;
    position: relative;
  }
  .a-toolbar,
  .a-toolbar-body {
    background-color: #f8f8f8;
  }

  .layout-col-menu .a-toolbar,
  .layout-col-menu .a-toolbar-body {
    background-color: #e8eaed;
  }
  .layout-col-list .a-toolbar,
  .layout-col-list .a-toolbar-body {
    background-color: #f8f8f8;
  }
  .layout-col-detail .a-toolbar,
  .layout-col-detail .a-toolbar-body {
    background-color: #eceef3;
  }

  .layout-col-detail .a-toolbar-body {
    /* box-shadow: inset 1px 0px 0px rgba(0, 0, 0, 0.06); */
  }
  .layout-col-menu .a-toolbar-body {
    box-shadow: inset -1px 0 3px rgba(0, 0, 0, 0.1);
  }
  .a-toolbar {
    height: 50px;
    border-bottom: 1px solid #ddd;
    margin: 0 !important;
  }

  .a-toolbar.small {
    height: 36px;
  }

  .a-toolbar-body {
    position: absolute;
    z-index: 100;
    /*left: 0;*/
    min-width: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }

  .a-toolbar-body {
    padding-left: 10px;
    padding-right: 10px;
  }

  .a-toolbar-body > span,
  .a-toolbar-body > .ant-btn:last-child,
  .a-toolbar-body > .a-toolbar-btn:last-child {
    margin-right: 10px;
  }

  .a-toolbar.small .a-toolbar-body {
    height: 36px;
  }

  .a-toolbar-body .button-separator {
    padding: 11px 0;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.25);
    display: inline-block;
    margin: 6px;
  }
  .a-toolbar-body .ant-btn+.ant-btn {
    margin-left: 10px;
  }

  @media (max-width: 576px) {
    .a-toolbar,
    .a-toolbar-body {
      min-height: 50px;
      height: auto;
    }

    .a-toolbar.small,
    .a-toolbar.small .a-toolbar-body {
      min-height: 36px;
      height: auto;
    }

    .a-toolbar-body {
      position: raative;
      flex-flow: row wrap;
      padding: 5px 0;
    }
  }

  .a-toolbar .ant-btn {
    background: transparent;
  }

  .a-toolbar .ant-btn.is-disabled {
    background-color: transparent;
    border-color: transparent;
  }

  .a-toolbar .ant-btn--primary {
    color: #fff;
    background-color: #00AF80;
    border-color: #00AF80;
  }

  .a-toolbar.small .bar-dropDown-wrap {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }
  .bar-dropDown-wrap {
    display: none;
    position: absolute;
    z-index: 101;
    right: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    height: 49px;
    line-height: 49px;
    text-align: center;
    /*font-size: 16px;*/
    /*color: #353535;*/
    font-weight: 400;
    cursor: pointer;
  }
  .bar-dropDown-wrap.active {
    display: block;
  }
  .bar-dropDown-wrap:hover {
    background-color: #eee;
    /*color: #ffffff;*/
  }
  .bar-dropDown-wrap:hover .menu-list {
    display: block;
  }
  .bar-dropDown-wrap .menu-list {
    list-style: none;
    display: none;
    top: 26px;
    right: 0;
    position: absolute;
    z-index: 1001;
    border: 1px solid #dfe4ed;
    border-radius: 4px;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px 0;
  }
  .menu-list .item-name {
    padding-left: 6px;
  }
  .bar-dropDown-wrap .menu-list .menu-item {
    list-style: none;
    display: block;
    padding: 0 20px;
    line-height: 36px;
    white-space: nowrap;
    text-align: left;
    font-size: 14px;
  }
  .bar-dropDown-wrap .menu-list .menu-item.disabled {
    cursor: not-allowed;
    color: #bfcbd9;
  }
  .bar-dropDown-wrap .menu-list .menu-item:not(.is-disabled):hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
  .a-popper[x-placement^=bottom] .popper__arrow{
    right: 7px;
    left: auto;
  }
</style>
