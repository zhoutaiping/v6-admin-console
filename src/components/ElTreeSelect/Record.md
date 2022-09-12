### 全局使用 需在main.js注册组件：
##### <a href="https://ayiaq1.github.io/el-tree-select/website/#/components/ElTreeSelect" target="_blank">在线API</a>

```
import ElTreeSelect from 'el-tree-select';
vue.use(ElTreeSelect);
内部直接使用 :  <el-tree-select v-model="id"/>
```


#### 支持的参数：

#### el-select 参数：

```
selectParams  :     支持el-select 相关参数

#### styles参数：
styles 对el-select设置style,类型:Object

#### selectClass参数：
selectClass  对el-select设置class,类型:String
```
#### el-tree 参数：

```
treeParams  :     支持el-tree 相关参数
增加：'clickParent'
treeParams.clickParent 类型：Boolean 默认：false
在selectParams.multiple=false单选情况下点击节点，判断是否关闭弹出框
clickParent: true 允许点击父级关闭弹出框 false 只能点击子级关闭弹出框
```

#### popover 参数：
```
popperClass  对应：popper-class,类型:String
```


#### 搜索框参数：

```
treeParams.filterable   Boolean 考虑是显示在弹出框内的，因此放到treeParams参数内
```


### 事件:

###### select-clear

```
select-clear 下拉框清空事件   this.$emit('select-clear');
```

###### removeTag

```
removeTag 移除单个标签，返回所有勾选的ids，以及当前移除的tag（可能为中文）标签   this.$emit('removeTag',ids,tag);
```

###### node-click

```
树点击,和el-tree参数一致: this.$emit('node-click', data, node, vm);
```

###### check

```
勾选触发,和el-tree参数一致: this.$emit('check',data, node, vm);
```

###### treeDataUpdateFun

```
treeDataUpdateFun 树更新数据

this.post(url,postobj,response=>{
    this.$refs.treeSelect.treeDataUpdateFun(response.data);
});
```


###### searchFun 参数: keywords

```
searchFun(value){
    // 如果是本地过滤：
    this.$refs.treeSelect.$refs.tree.filter(value);
    // 可以直接访问方法，也可以拿到 $refs.tree
    this.$refs.treeSelect.filterFun(val);
    // 如果是请求后台：
    this.post(url,postobj:{
        keywords:value
    },response=>{
        this.$refs.treeSelect.treeDataUpdateFun(response.data);
    });
}
```
