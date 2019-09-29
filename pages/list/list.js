const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCreateTask: false,
    isUpdateListName: false,
    actionsVisible: false,
    isUpdateTheme: false,
    actions: [
      {
        name: '重命名清单',
        leftIcon: {
          type:'icon',
          value: 'label'
        },
      },
      {
        name: '将列表移动到...',
        leftIcon: {
          type:'icon',
          value: 'send'
        },
        rightIcon: {
          type:'icon',
          value: 'enter'
        },
      },
      {
        name: '更改主题',
        leftIcon: {
          type:'icon',
          value: 'dynamic'
        },
        rightIcon: {
          type:'icon',
          value: 'enter'
        },
      },
      {
        name: '删除清单',
        leftIcon: {
          type:'icon',
          value: 'trash',
          color: 'red'
        },
        color: 'red'
      }
    ],
    list: {
      name: 'anxing',
      input: 'anxng',
      theme: {
        type: 'color',
        value: '#FF6666'
      },
      tasks: [{
        id: '001',
        name: '计划',
        state: 'pending',
        important: false,
      },{
        id: '002',
        name: '计划23生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成生命周期函数--监听页面初次渲染完成',
        state: 'pending',
        important: false,
      }]
    },
    themes: {
      selected: {
        type: 'color', // color or picture,
        index: 0,
      },
      colors: [{
        value: '#996699',
      }, {
        value: '#0099CC'
      }, {
        value: '#FF6666'
      }, {
        value: '#003366'
      }, {
        value: '#663366'
      }, {
        value: '#FFFF00'
      }, {
        value: '#0066CC'
      }, {
        value: '#993333'
      }, {
        value: '#CC0033'
      }, {
        value: '#333399'
      }, {
        value: '#003399'
      }, {
        value: '#99CC00'
      }, {
        value: '#9933FF'
      }, {
        value: '#6666CC'
      }, {
        value: '#339933'
      }, {
        value: '#009966'
      }, {
        value: '#336699'
      }, {
        value: '#99CCFF'
      }, {
        value: '#3399CC'
      }, {
        value: '#FF33CC'
      }],

      pictures: [{
        value: 'https://i.ibb.co/JKm36cW/forest-4507031-640.jpg',
      },{
        value: 'https://i.ibb.co/5RGDxSR/fox-4505465-640.jpg',
      },{
        value: 'https://i.ibb.co/Z1DMkbh/landscape-4487659-640.jpg',
      },{
        value: 'https://i.ibb.co/kcXM24z/milky-way-4416194-640.jpg',
      },{
        value: 'https://i.ibb.co/b2c6x4T/milky-way-4484593-640.jpg',
      },{
        value: 'https://i.ibb.co/k468VM6/milky-way-4500469-640.jpg',
      },{
        value: 'https://i.ibb.co/bP6wgtN/moon-4498253-640.jpg',
      },{
        value: 'https://i.ibb.co/wNdT7CN/park-4495453-640.jpg',
      },{
        value: 'https://i.ibb.co/BybNqBw/sailing-boat-4060710-640.jpg',
      }]
    }
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

  handleTaskState: function (e) {
    console.log('handleTaskState --------- : ', e);
  },

  goback: function (e) {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  createTask: function (e) {
    const value = e.detail.value.trim();
    if (value && value !== '') {
      const newList = this.data.list;
      newList.tasks.push({
        id: Date.now(),
        name: e.detail.value,
        state: 'pending',
        important: false,
      });
      this.setData({
        list: newList
      });
    }

    this.revertCreateTaskInput();
  },

  createTaskByBlurEvent(e) {
    const value =  e.detail.value.trim();
    if (this.data.list.tasks.length > 0) {
      const lastTask = this.data.list.tasks[this.data.list.tasks.length - 1];
      if (lastTask.name === value) {
        return;
      }
    }

    this.createTask(e);
  },
  revertCreateTaskInput: function(e) {
    this.setData({
      isCreateTask: !this.data.isCreateTask
    });
  },
  revertImportant(e) {
    const task = e.currentTarget.dataset.task;
    const newList = this.data.list;
    for (let i=0; i<this.data.list.tasks.length; i++) {
      const t = this.data.list.tasks[i];
      if (t.id === task.id) {
        task.important = !t.important;
        newList.tasks[i] = task;
        this.setData({
          list: newList
        });
        break;
      }
    }
  },
  revertState(e) {
    const task = e.currentTarget.dataset.task;
    const newList = this.data.list;

    for (let i=0; i<this.data.list.tasks.length; i++) {
      const t = this.data.list.tasks[i];
      if (t.id === task.id) {
        task.state = task.state === 'pending' ? 'finished' : 'pending';
        newList.tasks[i] = task;
        this.setData({
          list: newList
        });
        break;
      }
    }
  },
  handleCancel1(e) {
    console.log("handleCancel1 --------------- : ", e);
    this.setData({
      isUpdateTheme: false,
    })
  },

  actionClick(e) {
    console.log("handleClickItem1 --------------- : ", e);
    switch (e.detail.index) {
      case 0:  // rename list name
        this.setData({
          isUpdateListName: !this.isUpdateListName,
          actionsVisible: false,
        });
      case 2:  // rename list name
        this.setData({
          isUpdateListName: false,
          actionsVisible: false,
          isUpdateTheme: true
        });
        break;
    }
  },
  openActions(e) {
    this.setData({
      actionsVisible: true,
    });
  },
  revertActions() {
    this.setData({
      actionsVisible: !this.data.actionsVisible,
      isUpdateTheme: false
    });
  },
  updateListName(e) {
    const name = e.detail.value.trim();

    this.setData({
      ['list.name']: name,
      isUpdateListName: false,
    });
  },
  updateTheme(e) {
    const type = this.data.themes.selected.type;
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      ['themes.selected.index']: idx,
      ['list.theme.value']: type === 'color' ? this.data.themes.colors[idx].value : this.data.themes.pictures[idx].value,
      ['list.theme.type']: this.data.themes.selected.type,
    });
  },
  changeSelectThemeType(e) {
    if (this.data.themes.selected.type === e.currentTarget.dataset.type) {
      return;
    }

    const type = e.currentTarget.dataset.type

    this.setData({
      ['themes.selected.type']: type,
      ['themes.selected.index']: 0,
    });
  },
  closeUpdateThemeInput(e) {
    this.setData({
      isUpdateTheme: false,
    });
  }
})
