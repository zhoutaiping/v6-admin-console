import cloneDeep from 'lodash/cloneDeep'

/*
1. define your ref, format below:
{
  placeholder: {
    ...definition
  },
  data: []
}

2. bind to el-table
3. instantiation Mutator class, bind mutator.act() to @click
*/
class Mutator {
  constructor(ref) {
    this.ref = ref
    this.definition = cloneDeep(this.ref.placeholder)
    this.idCount = 0
  }

  act({ type, id }) {
    switch (type) {
      case 'EDIT':
        this.ref.data.forEach(row => {
          if (row.id === id) {
            row.edit = true
            for (var key of Object.keys(this.definition)) {
              this.ref.placeholder[key] = row[key]
            }
            return false
          }
        })
        break
      case 'EDIT_SAVE':
        this.ref.data.forEach(row => {
          if (row.id === id) {
            row.edit = false
            delete row.add
            for (var key of Object.keys(this.definition)) {
              row[key] = this.ref.placeholder[key]
            }
            this.ref.placeholder = cloneDeep(this.definition)
            return false
          }
        })
        break
      case 'EDIT_CANCEL':
        this.ref.data.forEach((row, index) => {
          if (row.id === id) {
            if (row.add) {
              this.ref.data.splice(index, 1)
            } else {
              row.edit = false
              for (var key of Object.keys(this.definition)) {
                this.ref.placeholder[key] = this.definition[key]
              }
            }
            return false
          }
        })
        break
      case 'DELETE':
        this.ref.data.forEach((row, index) => {
          if (row.id === id) {
            this.ref.data.splice(index, 1)
            return false
          }
        })
        break
      case 'ADD': {
        if (!this.isEdit()) {
          this.ref.data = [
            {
              id: this.idCount++,
              ...this.definition,
              add: true,
              edit: true
            },
            ...this.ref.data
          ]
        }
        break
      }
      default:
        throw new Error(`No Such Action Type [${type}]`)
    }
  }

  isEdit() {
    let eidt = false

    this.ref.data.forEach(row => {
      if (row.edit) {
        eidt = true
        return false
      }
    })

    return eidt
  }

  affine(data) {
    data.forEach(row => {
      row.edit = false

      if (!row.id) {
        row.id = this.idCount++
      }
    })
  }
}

export default Mutator
