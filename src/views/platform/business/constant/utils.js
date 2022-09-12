function formartRegion(code = [], list = []) {
  let text = '--'
  const region = code
  if (code && Array.isArray(code) && code.length) {
    if (region[0] === 'CN') {
      const find = list.filter(
        i => i.region_code === region[1] && i.province_code === region[2] && i.city_code === region[3]
      )
      if (find[0]) {
        text =
          find[0].country_name +
          '-' +
          find[0].region_name +
          '-' +
          find[0].province_name +
          '-' +
          find[0].city_name
      }
      const provinc = list.filter(
        i =>
          i.city_code === '' &&
          !region[3] &&
          i.province_code === region[2] &&
          i.region_code === region[1]
      )
      if (provinc[0]) {
        text =
          provinc[0].country_name +
          '-' +
          provinc[0].region_name +
          '-' +
          provinc[0].province_name
      }
    } else if (region[0] === 'GAT') {
      const find = list.filter(
        i => i.country_code === region[1] && i.region_code === region[0]
      )
      if (find[0]) text = find[0].country_name
    } else {
      const find = list.filter(
        i => i.country_code === region[2] && i.big_state_code === region[1]
      )
      if (find[0]) text = find[0].big_state_name + '-' + find[0].country_name
    }
  }
  return text
}

export {
  formartRegion
}
