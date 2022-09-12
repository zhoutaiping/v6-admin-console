import request from '@/utils/requestAll'

export default {
  product: function product(params) {
    return request({
      url: '/V4/product.list',
      method: 'get',
      params: params
    })
  },

  productMeal: function productMeal(data) {
    return request({
      url: '/V4/product.meal.list',
      method: 'post',
      data
    })
  }
}
