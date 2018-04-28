<template>
  <div>
    <span class="tech-sel-wrapper">
      <div ref="selectBox" class="select-box" tabindex="-1" @blur="blur" @focus="focus" :style="{width: `${width}px`}">
        <div class="tag-box">
          <template v-for="(item, index) in selectNodes">
            <Tag
              :fade="false"
              closable
              :key="index"
              @on-close="closeTag"
              :name="JSON.stringify(item)"
            >
              {{item.title}}
            </Tag>
          </template>
        </div>
        <div class="content-box" ref="contentBox">
          <div class="input-box" v-if="search">
            <div style="width: 40%;display: inline-block">
              <i-input
                @on-keyup="keyUp"
                @on-blur="inputBlur"
                v-model="keyWord"
                size="small"
                icon="ios-search">
              </i-input>
            </div>
          </div>
          <div class="tree-box">
            <Tree
              :data="searching ? searchData : originData"
              multiple
              show-checkbox
              @on-check-change="setSelectNodes"
            ></Tree>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    props: {
      data: {
        type: Array,
        default: null,
        required: true
      },
      search: {
        type: Boolean,
        default: false,
        required: false
      },
      width: {
        type: [String, Number],
        default: 300,
        required: false
      },
      value: {
        type: Array,
        default: null,
        required: true
      },
      pkey: {
        type: String,
        default: 'title',
        required: false
      }
    },
    data () {
      return {
        searching: false,
        searchData: [],
        originData: [],
        selectNodes: [],
        keyWord: null
      }
    },
    methods: {
      focus: function () {
        const vm = this
        $(vm.$refs.selectBox).addClass('active')
        $(vm.$refs.contentBox).addClass('fade-in')
      },
      blur: function ({relatedTarget}) {
        const vm = this
        switch (true) {
          case $(relatedTarget).parents('.input-box').length > 0:
            break
          case $(relatedTarget).parents('.tree-box').length > 0:
            $(vm.$refs.selectBox).focus()
            break
          default:
            $(vm.$refs.selectBox).removeClass('active')
            $(vm.$refs.contentBox).removeClass('fade-in').addClass('fade-out')
        }
      },
      inputBlur: function ({relatedTarget}) {
        const vm = this
        switch (true) {
          case relatedTarget === vm.$refs.selectBox:
            $(vm.$refs.selectBox).focus()
            break
          case $(relatedTarget).parents('.tree-box').length > 0:
            $(vm.$refs.selectBox).focus()
            break
          default:
            $(vm.$refs.selectBox).removeClass('active')
            $(vm.$refs.contentBox).removeClass('fade-in').addClass('fade-out')
        }
      },
      setSelectNodes: function () {
        const vm = this
        let nodes = []
        vm.traverseTree(
          {children: vm.originData},
          (node) => { if (!node.children && node.checked === true) nodes.push(node) }
        )
        vm.$emit('input', vm.selectNodes = nodes)
      },
      keyUp: function () {
        const vm = this
        if (vm.keyWord && vm.keyWord.length > 0) {
          vm.searchData = []
          vm.traverseTree(
            {children: vm.originData},
            (node) => { if (!node.children && node.title.includes(vm.keyWord)) vm.searchData.push(node) }
          )
          vm.searching = true
        } else {
          vm.traverseTree(
            {children: vm.originData},
            (node) => {
              if (node.children && node.children.length > 0) {
                delete node.checked
                delete node.indeterminate
              }
            }
          )
          vm.searching = false
        }
      },
      closeTag: function (event, value) {
        const vm = this
        let {nodeKey: closeKey} = JSON.parse(value)
        vm.traverseTree(
          {children: vm.originData},
          (node) => {
            if (node.children && node.children.length > 0) {
              node.checked = node.indeterminate = false
            } else if (+node.nodeKey === +closeKey) node.checked = false
          }
        )
        vm.setSelectNodes()
      },
      traverseTree: function (node, callBack, parentNode) {
        const vm = this
        callBack && callBack(node, parentNode)
        if (node.children && node.children.length > 0) {
          for (let index in node.children) {
            vm.traverseTree(node.children[index], callBack, node)
          }
        }
      }
    },
    created () {
      const vm = this
      let cloneData = JSON.parse(JSON.stringify(vm.data))
      let keys = vm.value.map((val) => { if (val[vm.pkey]) return val[vm.pkey] })
      vm.traverseTree(
        {children: cloneData},
        (node, parentNode) => {
          if (parentNode && parentNode.title) {
            node.value = `${parentNode.value}/${node.title}`
          } else {
            node.value = node.title
          }
          if (!node.children && keys.includes(node[vm.pkey])) node.checked = true
        }
      )
      vm.originData = cloneData
      vm.setSelectNodes()
    }
  }
</script>

<style scoped lang="scss">
  .tech-sel-wrapper {
    display: inline-block;
    text-align: left;
    .select-box {
      position: relative;
      min-height: 30px;
      border-radius: 5px;
      border: 1px solid #CCC;
      transition: .3s;
      cursor: pointer;
      .tag-box {
        width: 100%;
        height: 100%;
        padding: 5px;
      }
      &:hover {
        border-color: #57a3f3;
      }
      &:focus, &.active {
        border-color: #57a3f3;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
        outline: none;
      }
      .content-box {
        height: 0;
        background-color: #FFF;
        cursor: default;
        position: absolute;
        left: 0;
        top: 110%;
        padding-left: 10px;
        box-shadow: rgba(0, 0, 0, 0.15) 0 2px 8px 0;
        width: 100%;
        max-height: 400px;
        overflow-y: auto;
        &.fade-out {
          animation: fade-out .5s forwards;
        }
        &.fade-in {
          animation: fade-in .3s forwards;
        }
        .input-box {
          padding-top: 5px;
          padding-right: 10px;
          text-align: right;
        }
      }
    }
  }

  @keyframes fade-in {
    0% {
      height: auto;
      opacity: 0;
    }
    100% {
      height: auto;
      opacity: 1;
    }
  }

  @keyframes fade-out {
    0% {
      height: auto;
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      height: 0;
    }
  }
</style>
