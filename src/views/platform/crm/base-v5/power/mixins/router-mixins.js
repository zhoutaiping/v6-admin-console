import { formartObjArr } from '@/utils/utils'
export default {
  data() {
    return {
      option: {
        status: [
          { label: '未启用', value: '0' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '2' }
        ],
        model: []
      }
    }
  },
  computed: {
    moduleList() {
      const modules = (this.responseData && this.responseData.modules) || null
      let module_main = (modules && modules.module_main) || null
      const module = (modules && modules.module) || null
      if (module_main && Object.keys(module_main).length) {
        const list = formartObjArr(module_main)
        list.forEach((i) => {
          const children = (module && module[i.value]) || null
          if (children) {
            i.children = formartObjArr(children)
          } else {
            i.children = []
          }
        })
        module_main = list
      }
      return module_main
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    init() {
      this.Fetch.get('/V4/acl.module.list', { page: 1, per_page: 100 }).then(res => {
        this.option.model = formartModel(res.list)
      })
    }
  }
}
function formartModel(list = []) {
  const grouplist = group(list)
  const model = set(list, grouplist)
  function group(arr) {
    const items = []
    arr.forEach((i) => {
      if (
        !items.find((f) => {
          return f.value === i.module_group
        })
      ) {
        items.push({
          label: i.module_group_title,
          value: i.module_group
        })
      }
    })
    return items
  }
  function set(arr, group_) {
    const model_ = JSON.parse(JSON.stringify(group_))
    model_.forEach((i) => {
      const children = arr.filter((f) => f.module_group === i.value)
      i.children =
        children.length > 0
          ? children.map((m) => {
            return { label: m.name, value: m.key }
          })
          : []
    })
    return model_
  }
  return model
}

