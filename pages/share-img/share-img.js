const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_tips_modal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animateInit()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.show_img) this.animateInit()
  },

  animateInit() {
    this.show_img = true

    this.animation = this.animation || wx.createAnimation({
      duration: 500,
      timingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    })
    this.animation1 = this.animation1 || wx.createAnimation({
      duration: 500,
      delay: 150,
      timingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    })

    this.animation.translateY(0).rotate(0).step()
    this.animation1.translateY(0).rotate(0).step()
    this.setData({
      animation: this.animation.export(),
      animation1: this.animation1.export()
    })
  },
  // 生成图片
  toShareFriend() {
    wx.showLoading({
      title: '海报生成中',
    })
    this.setData({
      show: true
    })
  },

  saveImg(e) {
    const {
      result
    } = e.detail
    const self = this
    // 查询授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.hideLoading()
          self.setData({
            show_tips_modal: true
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: result.tempFilePath,
            success: res1 => {
              app.showTips(0, '图片已保存')
            },
            fail: err => {
              app.showTips(0, '图片生成失败')
            },
            complete: res1 => {
              wx.hideLoading()
              self.setData({
                show: false
              })
            }
          })
        }
      }
    })
  },

  closePage() {
    wx.navigateBack({
      delta: 1
    })
  },

  // close modal
  closeModal: function (e) {
    this.setData({
      show_tips_modal: false
    })
  },
  // confim modal
  confimModal: function (e) {
    this.setData({
      show_tips_modal: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.animation.translateY(800).rotate(90).step()
    this.animation1.translateY(800).rotate(90).step()

    this.setData({
      animation: this.animation.export(),
      animation1: this.animation1.export()
    })
  }
})