import store from '../../store';
import create from '../../plugins/westore/utils/create';

const {uuid} = require('../../utils/util');
const {REQ_ACTION} = require('../../config/properties');

const app = getApp();

// array difference
const diff = function(arr1, arr2) {
  let set1 = new Set(arr1);
  let set2 = new Set(arr2);

  let subset = [];

  for (let item of set1) {
    if (!set2.has(item)) {
      subset.push(item);
    }
  }

  return subset;
};

create(store,{

  /**
   * 页面的初始数据
   */
  data: {
    showLoginAlert: false,
    userInfo: null,
    hasUserInfo: false,
    actionsVisible: false,
    renameGroupVisible: false,
    groupListsOperateVisible: false,
    canIUse: null,
    swipeActions: [{
      background: 'red',
      width : 100,
      color : 'white',
      fontsize : '20',
      icon : 'trash'
    }],
    currentOperateGroup: null,
    currentOperateGroupList: [],
    originalOperateGroupList: [],
    actions: [
      {
        name: '添加/删除列表',
        leftIcon: {
          type:'icon',
          value: 'send'
        },
      },
      {
        name: '重命名组',
        leftIcon: {
          type:'icon',
          value: 'label'
        },
      },

      {
        name: '取消列表分组',
        leftIcon: {
          type:'icon',
          value: 'trash',
          color: 'red'
        },
        color: 'red'
      }
    ],
    infos: null,
    newGroupInput: {
      visible: false,
      value: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.store.data.userInfo = app.globalData.userInfo;
    //   this.store.data.hasUserInfo = true;
    //   this.update()
    // } else if (this.data.canIUse) {
    //   app.userInfoReadyCallback = res => {
    //     this.store.data.userInfo = res.userInfo;
    //     this.store.data.hasUserInfo = true;
    //     this.update()
    //   }
    // } else {
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.store.data.userInfo = res.userInfo
    //       this.store.data.hasUserInfo = true
    //       this.update()
    //     }
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const userProfile = this.store.data.userProfile;
    if (!this.data.userInfo && userProfile && userProfile.wxUserInfo
      && Object.keys(userProfile.wxUserInfo).length > 0
    ) {
      this.store.data.userInfo = userProfile.wxUserInfo;
      this.update();
      this.setData({
        userInfo: userProfile.wxUserInfo
      });
    } else {
      this.monitorUserInfo();
    }

    // setTimeout(() => {
    //   const userProfile = this.store.data.userProfile;
    //   delete userProfile.wxUserInfo
    //   app.globalData.events$.next({
    //     event: REQ_ACTION.UPDATE_USER_PROFILE,
    //     data: userProfile
    //   });
    // }, 3000);

    // this.authorize = this.selectComponent("#authorization");
    // this.authorize.isAuthorize('userInfo', (err, data) => {
    //   if (err) {
    //     throw new Error(err);
    //   }
    //
    //   app.globalData.events$.next({
    //     event: REQ_ACTION.WX_USER_PROFILE_UPDATE,
    //     data
    //   });
    //   this.setData({userInfo: JSON.parse(data.rawData)});
    // });

    // setTimeout(() => {
    //   const infos = this.store.data.infos2;
    //   for (let i=0; i<infos.lists.length; i++) {
    //     const list = infos.lists[i];
    //     if (list.gid !== 'group') {
    //       app.globalData.events$.next({
    //         event: REQ_ACTION.NEW_LIST,
    //         data: list
    //       });
    //     } else {
    //       app.globalData.events$.next({
    //         event: REQ_ACTION.NEW_GROUP,
    //         data: list
    //       });
    //     }
    //   }
    //
    //   for (let i=0; i<infos.tasks.length; i++) {
    //     const task = infos.tasks[i];
    //     app.globalData.events$.next({
    //       event: REQ_ACTION.NEW_TASK,
    //       data: task
    //     });
    //   }
    //
    // }, 2000);
  },

  monitorUserInfo() {
    let user = wx.getStorageSync('user') || null;
    if (user) {
      this.getUserInfo();
    } else {
      setTimeout(() => {
        user = wx.getStorageSync('user') || null;
        if (!user) {
          return this.monitorUserInfo();
        }

        if (!this.store.data.userInfo || Object.keys(this.store.data.userInfo).length === 0) {
          this.getUserInfo();
        }
      }, 1000);
    }
  },

  getUserInfo() {
    wx.getSetting({
      success: async (res) => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            showLoginAlert: true
          });
        } else {
          wx.getUserInfo({
            success: res => {
              app.globalData.events$.next({
                event: REQ_ACTION.WX_USER_PROFILE_UPDATE,
                data: {
                  ...res
                }
              });

              this.setData({
                userInfo: res.userInfo
              });
            }
          });
        }
      }
    });
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

  goListPage: function(e) {
    const list = e.currentTarget.dataset.list;
    const url = '/pages/list/list?lid=' + list.id;
    wx.redirectTo({
      url
    });
  },
  openNewGroupInput() {
    this.setData({
      newGroupInput: {
        visible: true,
        value: ''
      }
    });
  },
  createNewGroup(e) {
    const value = this.data.newGroupInput.value.trim();
    if (value && value !== '') {
      const group = {
        id: uuid(),
        gid: 'group',
        name: value,
        createdAt: new Date().toISOString(),
      };

      this.data.infos.lists.push(group);
      this.setData({
        infos: this.data.infos,
      });

      app.globalData.events$.next({
        event: REQ_ACTION.NEW_GROUP,
        data: group
      });
    }

    // hidden input modal
    this.setData({
      newGroupInput: {
        visible: false,
        value: ''
      }
    });
  },
  closeNewGroupInput(e) {
    this.setData({
      ['newGroupInput.visible']: false
    });
  },
  newGroupInputChange(e) {
    this.setData({
      ['newGroupInput.value']: e.detail.value
    });
  },
  newList() {
    const list = {
      id: uuid(),
      name: '新建清单',
      theme: this.store.data.defaultListTheme,
      gid: 'none', // group id, 如果不属于任何一个group, 将其标识为none
      createdAt: new Date().toISOString(),
      taskCount: 0,
    };

    // TODO: 实在想不明白这里为什么到list页面在返回home page, 就会报错。 在真机上的表现是创建了两次list, why~why~why????
    // this.data.infos.lists.push(list);
    // this.setData({
    //   infos: this.data.infos
    // });

    const lists = this.store.data.infos.lists;
    lists.push(list);
    this.store.data.infos.lists = lists;
    this.update();

    app.globalData.events$.next({
      event: REQ_ACTION.NEW_LIST,
      data: list
    });

    wx.redirectTo({
      url: `/pages/list/list?lid=${list.id}&isNew=true`
    });
  },
  listActionClick(e) {
    switch (e.detail.index) {
      case 0: // delete list
        const lists = this.store.data.infos.lists;
        const list = e.currentTarget.dataset.list;
        for (let i=0; i<lists.length; i++) {
          if (lists[i].id === list.id) {
            lists.splice(i, 1);

            this.setData({
              ['infos.lists']: lists
            });

            app.globalData.events$.next({
              event: REQ_ACTION.DELETE_LIST,
              data: list
            });
            break;
          }
        }

        break;
      default:
        throw new Error('Unknown listActionClick index: ' + e.detail.index);
    }
  },
  showGroupOptions(e) {
    const groupId = e.detail.groupId;
    const lists = this.store.data.infos.lists;
    let group;
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === groupId) {
        group = lists[i];
      }
    }

    if (group) {
      this.setData({
        currentOperateGroup: group
      });
    } else {
      throw new Error('GroupId not found: ' + groupId);
    }


    this.revertGroupActions({});
  },
  groupActionClick(e) {
    let lists;
    switch (e.detail.index) {
      case 0:  // add/remove lists
        lists = this.store.data.infos.lists;
        const currentOperateGroupList = [];
        for (let i=0; i<lists.length; i++) {
          if (lists[i].gid === this.data.currentOperateGroup.id) {
            currentOperateGroupList.push(lists[i].id);
          }
        }

        this.setData({
          groupListsOperateVisible: true,
          actionsVisible: false,
          currentOperateGroupList,
          originalOperateGroupList: [...currentOperateGroupList],
        });
        break;

      case 1: // rename group
          this.setData({
            renameGroupVisible: true,
            actionsVisible: false,
          });
        break;

      case 2: // delete group
        lists = this.store.data.infos.lists;
        let group, idx;
        for (let i=0; i<lists.length; i++) {
          if (lists[i].id === this.data.currentOperateGroup.id) {
            group = lists[i];
            idx = i;
          } else {
            if (lists[i].gid === this.data.currentOperateGroup.id) {
              lists[i].gid = 'none';
              app.globalData.events$.next({
                event: REQ_ACTION.UPDATE_LIST,
                data: lists[i]
              });
            }
          }
        }
        lists.splice(idx, 1);

        if (group) {
          this.setData({
            ['infos.lists']: lists,
            actionsVisible: false,
          });

          app.globalData.events$.next({
            event: REQ_ACTION.DELETE_GROUP,
            data: group
          });
        }

        break;
    }
  },
  revertGroupActions(e) {
    this.setData({
      actionsVisible: !this.data.actionsVisible,
    });
  },
  colseGroupRename(e) {
    this.setData({
      renameGroupVisible: false,
    })
  },
  renameGroup(e) {
    this.setData({
      renameGroupVisible: false,
    })

    const lists = this.store.data.infos.lists;
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === this.data.currentOperateGroup.id) {
        lists[i].name = this.data.currentOperateGroup.name;

        this.setData({
          ['infos.lists']: lists
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_GROUP,
          data: lists[i]
        });
      }
    }
  },
  renameGroupInputChange(e) {
    const newName = e.detail.value.trim();
    this.setData({
      ['currentOperateGroup.name']: newName
    });
  },
  colseGroupListsOperate(e) {
    this.setData({
      groupListsOperateVisible: false,
    })
  },
  removeGroupListNode(e) {
    const listId = e.currentTarget.dataset.list.id;
    if (this.data.currentOperateGroupList.indexOf(listId) !== -1) {
      const currentOperateGroupList = this.data.currentOperateGroupList;
      currentOperateGroupList.splice(currentOperateGroupList.indexOf(listId), 1);
      this.setData({
        currentOperateGroupList
      });
    }
  },
  addGroupListNode(e) {
    const listId = e.currentTarget.dataset.list.id;
    if (this.data.currentOperateGroupList.indexOf(listId) === -1) {
      const currentOperateGroupList = this.data.currentOperateGroupList;
      currentOperateGroupList.push(listId);
      this.setData({
        currentOperateGroupList
      });
    }
  },
  confirmChangeGroupList(e) {
    const newLists = diff(this.data.currentOperateGroupList, this.data.originalOperateGroupList);
    const removeLists = diff(this.data.originalOperateGroupList, this.data.currentOperateGroupList);

    const lists = this.store.data.infos.lists;
    for (let i=0; i<lists.length; i++) {
      let changeList = null;
      if (removeLists.includes(lists[i].id)) {
        lists[i].gid = 'none';
        changeList = lists[i];
      }

      if (newLists.includes(lists[i].id)) {
        lists[i].gid = this.data.currentOperateGroup.id;
        changeList = lists[i];
      }

      if (changeList) {
        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_LIST,
          data: changeList
        });
      }
    }

    this.store.data.infos.lists = lists;
    this.update();
    this.setData({
      infos: this.store.data.infos,
      groupListsOperateVisible: false,
    });
  },
  redirectPage(e) {
    const page = e.currentTarget.dataset.page;
    wx.redirectTo({
      url: `/pages/${page}/${page}`
    });
  },
  useOfflineMode() {
    this.setData({
      showLoginAlert: false,
    });
  },
  openLoginAuth(res) {
    if (res.detail.errMsg !== 'getUserInfo:ok') {
      console.error('getUserInfo failed: ', res);
      return;
    }

    app.globalData.events$.next({
      event: REQ_ACTION.WX_USER_PROFILE_UPDATE,
      data: {
        ...res.detail
      }
    });

    this.setData({
      userInfo: res.detail.userInfo,
      showLoginAlert: false
    });
  }
})
