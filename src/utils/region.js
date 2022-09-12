function getBig(list) {
  const big_state = [] // 大洲编码
  const BIG = [] // 中国外的大洲-国家
  const country_code = [] // 国家编码
  const country = [] // 国家
  const filter_country = ['CN', 'TW', 'HK', 'MO']
  list.forEach(i => {
    if (big_state.indexOf(i.big_state_code) < 0) {
      big_state.push(i.big_state_code)
      BIG.push({
        label: i.big_state_name,
        value: i.big_state_code
      })
    }
    if (filter_country.indexOf(i.country_code) < 0 && country_code.indexOf(i.country_code) < 0) {
      country_code.push(i.country_code)
      country.push({
        big_state_code: i.big_state_code,
        big_state_name: i.big_state_name,
        label: i.country_name,
        value: i.country_code,
        id: i.id
      })
    }
  })
  country.forEach(c => {
    const children = list.filter(i => i.country_code === c.value && i.city_code)
    if (children.length) c.children = children
  })

  const countryAll = [{
    label: '中国',
    value: 'CN',
    children: getCountryCity('CN', list)
  }, {
    label: '中国海外',
    value: 'GAT',
    children: GetCNGW(['TW', 'HK', 'MO'], list)
  }
  ]
  BIG.forEach(big => {
    const children = country.filter(i => i.big_state_code === big.value)
    if (children.length) big.children = children
    countryAll.push(big)
  })
  return countryAll
}

function GetCNGW(HW, list) {
  const Arr = []
  HW.forEach(item => {
    const children = list.filter(i => i.country_code === item)
    if (children.length) {
      const city = children[0]
      city.label = city.country_name
      city.value = city.country_code
      Arr.push(city)
    }
  })
  return Arr
}

function getCountryCity(country, list) {
  const CITY = list.filter(i => i.country_code === country) // 城市
  const region = [] // 大区
  const region_city = []
  const province = [] // 省
  const provincelist = []
  CITY.forEach(c => {
    if (region.indexOf(c.region_code) < 0) {
      region.push(c.region_code)
      region_city.push({
        big_state_code: c.big_state_code,
        big_state_name: c.big_state_name,
        country_name: c.country_name,
        country_code: c.country_code,
        label: c.region_name,
        value: c.region_code,
        id: c.id
      })
    }
    if (province.indexOf(c.province_code) < 0) {
      province.push(c.province_code)
      provincelist.push({
        big_state_code: c.big_state_code,
        big_state_name: c.big_state_name,
        region_name: c.region_name,
        region_code: c.region_code,
        label: c.province_name,
        value: c.province_code,
        id: c.id
      })
    }
  })
  provincelist.forEach(i => {
    const children = CITY.filter(c => c.city_code && c.province_code === i.value)
    children.forEach(c => {
      c.label = c.city_name
      c.value = c.city_code
    })
    if (children.length > 0)i.children = children
  })
  region_city.forEach(i => {
    const children = provincelist.filter(p => p.region_code === i.value)
    if (children.length > 0)i.children = children
  })
  return region_city
}

function findRegin(list, value) {
  let find = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i].value === value) {
      find = list[i].label
      break
    } else {
      if (list[i].children && list[i].children.length) {
        find = findRegin(list[i].children, value)
        if (find) break
      }
    }
  }
  return find
}

export {
  getBig, findRegin, GetCNGW, getCountryCity
}
