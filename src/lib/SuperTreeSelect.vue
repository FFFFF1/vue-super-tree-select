<template>
  <div>
    <span class="tech-sel-wrapper">
      <div
        ref="selectBox"
        :class="['select-box', {active: showClass.isActive}]"
        tabindex="-1"
        @blur="blur"
        @focus="focus"
        @mouseenter="hover"
        @mouseleave="() => {this.showClear = false}"
        :style="{width: `${width}px`}">
        <div class="tag-box">
          <template v-for="(item, index) in selectNodes">
            <Tag
              :fade="false"
              closable
              :key="index"
              @on-close="closeTag"
              :name="JSON.stringify(item)">
              {{item.title}}
            </Tag>
          </template>
        </div>
        <div v-if="clearable" class="clear-btn" v-show="showClear" @click="clear">
          <Icon type="close-circled" size="16"></Icon>
        </div>
        <div :class="['content-box', {'fade-in': showClass.fadeIn}, {'fade-out': showClass.fadeIn}]" ref="contentBox">
          <div class="input-box" v-if="searchable" ref="inputBox">
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
          <div class="tree-box" ref="treeBox">
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
  const contains = (parentNode, childNode) => {
    if (parentNode && childNode) return parentNode.contains(childNode)
    return false
  }

  export default {
    props: {
      data: {
        type: Array,
        default: null,
        required: true
      },
      searchable: {
        type: Boolean,
        default: false,
        required: false
      },
      clearable: {
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
        keyWord: null,
        showClear: false,
        showClass: {
          'isActive': false,
          'fadeIn': false,
          'fadeOut': false
        }
      }
    },
    methods: {
      focus: function () {
        const vm = this
        vm.showClass.isActive = true
        vm.showClass.fadeIn = true
      },
      blur: function ({relatedTarget}) {
        const vm = this
        switch (true) {
          case contains(vm.$refs.inputBox, relatedTarget):
            break
          case contains(vm.$refs.treeBox, relatedTarget):
            vm.$refs.selectBox.focus()
            break
          default:
            vm.showClass.isActive = false
            vm.showClass.fadeIn = false
            vm.showClass.fadeOut = true
        }
      },
      hover: function () {
        const vm = this
        if (vm.selectNodes.length > 0) vm.showClear = true
      },
      inputBlur: function ({relatedTarget}) {
        const vm = this
        switch (true) {
          case relatedTarget === vm.$refs.selectBox:
            vm.$refs.selectBox.focus()
            break
          case contains(vm.$refs.treeBox, relatedTarget):
            vm.$refs.selectBox.focus()
            break
          default:
            vm.showClass.isActive = false
            vm.showClass.fadeIn = false
            vm.showClass.fadeOut = true
        }
      },
      clear: function () {
        const vm = this
        vm.selectNodes = []
        vm.originData = vm.resetTree(
          (node) => {
            delete node.checked
            delete node.indeterminate
          }
        )
        vm.setSelectNodes()
      },
      setSelectNodes: function () {
        const vm = this
        let nodes = []
        vm.traverseTree(
          {children: vm.originData},
          (node) => {
            if (!node.children && node.checked === true) nodes.push(node)
          }
        )
        vm.$emit('input', vm.selectNodes = nodes)
      },
      keyUp: function () {
        const vm = this
        if (vm.keyWord && vm.keyWord.length > 0) {
          vm.searchData = []
          vm.traverseTree(
            {children: vm.originData},
            (node) => {
              if (!node.children && node.title.includes(vm.keyWord)) vm.searchData.push(node)
            }
          )
          vm.searching = true
        } else {
          vm.originData = vm.resetTree(
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
        let curKey = JSON.parse(value)[vm.pkey]
        vm.originData = vm.resetTree(
          (node) => {
            if (node.children && node.children.length > 0) {
              delete node.checked
              delete node.indeterminate
            } else if (node[vm.pkey] === curKey) node.checked = false
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
      },
      resetTree: function (callBack) {
        const vm = this
        let cloneNode = JSON.parse(JSON.stringify(vm.originData.length > 0 ? vm.originData : vm.data))
        vm.traverseTree(
          {children: cloneNode},
          callBack
        )
        return cloneNode
      }
    },
    created () {
      const vm = this
      let keys = vm.value.map((val) => {
        if (val[vm.pkey]) return val[vm.pkey]
      })
      vm.originData = vm.resetTree(
        (node, parentNode) => {
          if (parentNode && parentNode[vm.pkey]) {
            node.value = `${parentNode.value}/${node[vm.pkey]}`
          } else {
            node.value = node[vm.pkey]
          }
          if (!node.children && keys.includes(node[vm.pkey])) node.checked = true
        }
      )
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
      min-height: 40px;
      border-radius: 5px;
      border: 1px solid #CCC;
      transition: .3s;
      .clear-btn {
        position: absolute;
        right: 20px;
        top: 5px;
        transition: .5s;
        cursor: pointer;
        &:hover {
          color: #f07649;
        }
      }
      .tag-box {
        width: 100%;
        padding: 5px;
        max-height: 300px;
        overflow-y: auto;
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
        position: absolute;
        z-index: 100;
        left: 0;
        top: 100%;
        margin-top: 5px;
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
