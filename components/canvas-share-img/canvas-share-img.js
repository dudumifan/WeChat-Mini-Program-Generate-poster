// packageHome/components/canvas-share-img/canvas-share-img.js
const app = getApp()

const deviceWidth = app.globalData.ww

// 单位转换
const rpx2px = rpx => deviceWidth / 750 * rpx

// 获取图片信息
const getImageInfo = url => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 设置文本行数，超出省略
 * @param {object} ctx canvas实例
 * @param {string} text 文本数据
 * @param {number} lineNum 行数
 * @param {number} width 文字宽度最宽默认 620rpx
 * 返回 由每一行组成的数组
 */
const setTextLine = (ctx, text, lineNum = 1, width = 610) => {
  const str_arr = String(text).split('')
  width = rpx2px(width)
  let temp = ''
  // 分行
  let row_arr = str_arr.reduce((arr, word) => {
    const w = ctx.measureText(temp).width
    if (w < width) {
      temp += word;
    } else {
      arr.push(temp)
      temp = word
    }
    return arr
  }, [])
  row_arr.push(temp)
  temp = ''

  // 判断需要的行数
  row_arr = row_arr.slice(0, lineNum)
  if (row_arr.length > 1) {
    // 最后一行超出则省略号
    row_arr[row_arr.length - 1].split().every(v => {
      temp += v
      if (ctx.measureText(temp).width > (width - 20)) {
        temp += '...'
        return false
      }
      return true
    })
    row_arr.splice(row_arr.length - 1, 1, temp)
  }

  return row_arr
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    ready() {
      this.initCanvas()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initCanvas() {
      const product = {
        name: 'originDu',
        specification: '小小前端页面仔',
        description: '写点啥呢'
      }
      const user_address = '北京市丰台区成寿寺地铁站'
      const self = this

      // 兼容无图
      let product_img = new Promise((resolve, reject) => {
          resolve({
            height: 638,
            path: '/images/f.png'
          })
        })


      Promise.all([product_img]).then(([product_img]) => {
        const ctx = wx.createCanvasContext('myCanvas', this)
        // 绘制背景
        const canvas_W = rpx2px(705)
        const canvas_H = rpx2px(1180)
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, canvas_W, canvas_H)

        // 绘制logo
        const logo_SX = rpx2px(35)
        const logo_SY = rpx2px(23)
        const logo_W = rpx2px(253)
        const logo_H = rpx2px(80)
        ctx.drawImage('/images/logo1.png', logo_SX, logo_SY, logo_W, logo_H)

        // 绘制商品
        const product_SX = rpx2px(33)
        const product_SY = rpx2px(122)
        const product_W = rpx2px(638)
        const product_H = rpx2px(product_img.height)

        ctx.drawImage(product_img.path, product_SX, product_SY, product_W, product_H)

        // 计算地址长度导致的换行 默认一行 2行时上调 40 像素
        const str = user_address
        const adress_text_SIZE = rpx2px(30)
        ctx.setFontSize(adress_text_SIZE)

        const arr = setTextLine(ctx, str, 2)
        const diff_height = (arr.length - 1) * 40

        // 绘制蓝条地址
        const adress_SX = rpx2px(0)
        const adress_SY = rpx2px(760 - diff_height)
        const adress_W = rpx2px(706)
        const adress_H = rpx2px(100 + diff_height)

        ctx.setFillStyle('#01A1DD')
        ctx.fillRect(adress_SX, adress_SY, adress_W, adress_H)

        // 绘制地标
        const address_icon_SX = rpx2px(20)
        const address_icon_SY = rpx2px(792 - diff_height)
        const address_icon_W = rpx2px(25)
        const address_icon_H = rpx2px(29)

        ctx.drawImage('/images/address-white.png', address_icon_SX, address_icon_SY, address_icon_W, address_icon_H)

        // 绘制地址
        const adress_text_X = rpx2px(54)
        const adress_text_Y = rpx2px(788 - diff_height) + adress_text_SIZE // 高度加字号

        ctx.setFillStyle('#fff')

        arr.forEach((line_str, i) => {
          ctx.fillText(
            line_str,
            adress_text_X,
            adress_text_Y + rpx2px(42 * i),
          )
        })

        // 绘制菜名
        const product_name_SIZE = rpx2px(32)
        const product_name_X = rpx2px(33)
        const product_name_Y = rpx2px(878) + product_name_SIZE // 高度加字号

        ctx.setFontSize(product_name_SIZE)
        ctx.setFillStyle('#000')
        let product_name = product.name
        if (product.specification) {
          product_name = `${product.name}(${product.specification})`
        }
        if (product_name.length > 12) {
          product_name = product_name.slice(0, 11) + '...'
        }
        ctx.fillText(
          product_name,
          product_name_X,
          product_name_Y,
        )

        // 绘制描述
        const product_desc_SIZE = rpx2px(24)
        const product_desc_X = rpx2px(33)
        const product_desc_Y = rpx2px(928) + product_desc_SIZE // 高度加字号

        ctx.setFontSize(product_desc_SIZE)
        ctx.setFillStyle('#999')
        let desc = product.description
        if (desc.length > 12) {
          desc = desc.slice(0, 11) + '...'
        }
        ctx.fillText(
          desc,
          product_desc_X,
          product_desc_Y,
        )

        // 绘制价格
        const product_price_SIZE = rpx2px(36)
        const product_price_X = rpx2px(41)
        const product_price_Y = rpx2px(1081) + product_price_SIZE // 高度加字号

        ctx.setFontSize(product_price_SIZE)
        ctx.setFillStyle('#FF5F2C')

        ctx.fillText(
          '￥0.00',
          product_price_X,
          product_price_Y,
        )

        // 绘制规格 
        const product_unit_SIZE = rpx2px(24)
        const product_unit_X = rpx2px(80 + '￥0.00'.length * 20)
        // const product_unit_Y = rpx2px(1081) + product_unit_SIZE // 高度加字号

        ctx.setFontSize(product_unit_SIZE)
        ctx.setFillStyle('#999999')

        ctx.fillText(
          '顿',
          product_unit_X,
          product_price_Y,
        )

        // 绘制二维码
        const minicode_SX = rpx2px(471)
        const minicode_SY = rpx2px(882)
        const minicode_W = rpx2px(200)
        const minicode_H = rpx2px(200)

        ctx.drawImage('/images/9150e4e5gy1g11l5isqfqj20hw0imwf5.jpg', minicode_SX, minicode_SY, minicode_W, minicode_H)

        // 绘制二维码描述
        const minicode_desc_SIZE = rpx2px(24)
        const minicode_desc_X = rpx2px(471)
        const minicode_desc_Y = rpx2px(1100) + minicode_desc_SIZE // 高度加字号

        ctx.setFontSize(minicode_desc_SIZE)
        ctx.setFillStyle('#999')

        ctx.fillText(
          '长按识别，立即点餐',
          minicode_desc_X,
          minicode_desc_Y,
        )
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            quality: 1,
            success: result => {
              self.triggerEvent('confim', { result })
            }
          }, self)
        })
      })
    }
  }
})