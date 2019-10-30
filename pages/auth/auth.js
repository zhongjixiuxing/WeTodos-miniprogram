import store from '../../store';
import create from '../../plugins/westore/utils/create';

const app = getApp();

create(store,{

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 检测用户是否已经授权过某个权限，如果没有授权就调用小程序的授权，如果授权了就返回相应的状态给回调函数
   * scope为具体的某个权限
   * cb为回调
   */
  isAuthorize(scope, cb) {
    let self = this;
    wx.getSetting({
      success: async (res) => {
        if (!res.authSetting['scope.' + scope]) {
          wx.authorize({
            scope: 'scope.' + scope,
            success() {
              return typeof cb == "function" && cb();
            },
            fail() {
              self.setAuthTxt(scope);
              self.callBack = cb;
              self.setData({
                popShow: true
              })
            }
          })
        } else {
          if (typeof cb !== 'function') {
            throw new Error('Auth cb is not function type!');
          }

          cb(null, await this.getScopeAuthInfos(scope));
        }
      }
    })
  },
  getScopeAuthInfos(scope) {
    return new Promise((resolve, reject) => {
      switch (scope) {
        case 'userInfo':
          wx.getUserInfo({
            success: res => resolve(res)
          });
          break;
        default:
          throw new Error(`No support auth scope: ${scope}`);
      }
    });
  },
  setAuthTxt(authType) {
    let authTxt = '';
    switch (authType) {
      case 'userInfo':
        authTxt = '用户信息';
        break;
      case 'userLocation':
        authTxt = '地理位置';
        break;
      case 'record':
        authTxt = '录音功能';
        break;
      case 'writePhotosAlbum':
        authTxt = '保存到相册';
        break;
      case 'camera':
        authTxt = '摄像头';
        break;
    }
    this.setData({
      authType: authType,
      authTxt: authTxt
    })
  },
  getAuthorizeTool: function(res) {
    if (this.data.authType !== 'userInfo') {
      const scope = 'scope.' + this.data.authType;
      if (res.detail.authSetting[scope]) {
        this.setData({
          popShow: false
        })
        return typeof this.callBack == "function" && this.callBack(null, res.detail);
      }

      return;
    }

    if (res.detail.errMsg !== 'getUserInfo:ok') {
      return typeof this.callBack == "function" && this.callBack(res.detail.errMsg, res.detail);
    }

    this.setData({
      popShow: false
    })
    return typeof this.callBack == "function" && this.callBack(null, res.detail);
  },
  popClose() {
    this.setData({
      popShow: false
    })
  }

})
