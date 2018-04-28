# vue-super-tree-select

> 基于Vue和iView-UI组件库开发的一款树选择器，支持本地搜索
![vue-super-tree-select](https://github.com/FFFFF1/vue-super-tree-select/blob/master/demo.jpg)
## install 安装
``` bash
npm install vue-super-tree-select --save
```
## Usage 示例
> 该组件是基于iView的，请事先use iView 与其CSS
``` vue
<template>
  <super-tree-select v-model='model_' :data='data_' :search='true' width="500"></super-tree-select>
</template>

<script>
import superTreeSelect from 'vue-super-tree-select'

export default {
  components: {superTreeSelect},
  data () {
    return {
      model_: [],
      data_: [
        {
          title: '早餐',
          children: [
            {
              title: '北方',
              children: [
                {title: '豆浆'},
                {title: '油条'}
              ]
            },
            {
              title: '南方',
              children: [
                {title: '肠粉'},
                {title: '虾饺'}
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>

```
## config 配置项
| 属性 | 说明 | 类型 | 默认值 |
:-------: | -------  |  :-------:  |  :-------:
| pkey | 设置每一个节点的唯一标识 | String | title
| v-model | 存放组件中选择的最底层节点信息,每个节点信息会自动加上一个value属性，记录其所有父节点的pkey值类似于:'id1/id2/id3' | Array | /|
| data | 组件中所有的选择项，格式请参照示例 | Array | /|
| search | 是否可搜索，设置该属性为true时，可以根据子节点的title进行搜索 | Boolean | false |
| width | 设置组件的宽度 | String | 300 |
