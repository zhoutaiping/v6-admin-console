
import moment from 'moment'

function getExcTime(datetime_1, count, time_unit) {
  const date_1 = datetime_1 ? moment(datetime_1) : moment() // 开始时间
  const unit = {
    'd': 'day',
    'm': 'months',
    'y': 'year'
  }
  const date_2 = date_1.add(Number(count), unit[time_unit])
  const newDate = moment(date_2).format('YYYY-MM-DD HH:mm:ss')
  return newDate
}

export {
  getExcTime
}
