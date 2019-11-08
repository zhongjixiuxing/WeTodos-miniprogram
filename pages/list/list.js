import store from '../../store';
import create from '../../plugins/westore/utils/create';
const {getCurrentRouteUrl, fillNewTaskObj, getDateNo} = require('../../utils/util');
const {REQ_ACTION} = require('../../config/properties');
const {uuid} = require('../../utils/util');

const app = getApp()

create(store,{
  /**
   * 页面的初始数据
   */
  data: {
    isCreateTask: false,
    isUpdateListName: false,
    isInputNewListName: false,
    actionsVisible: false,
    isUpdateTheme: false,
    isMoveToGroup: false,
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
    infos: null,
    list: null,
    groups: [],
    currentGroup: null,
    themes: null,
    todayNo: getDateNo(),
    newListInput: {
      name: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    const tasks = this.store.data.infos.tasks;
    const lists = this.store.data.infos.lists;
    const listTasks = [];
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].lid === opts.lid) {
        listTasks.push(tasks[i]);
      }
    }

    let list;
    let currentGroup = null;
    let groups = [];
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === opts.lid) {
        list = lists[i];
        continue;
      }
    }

    if (!list) {
      throw new Error('List ID not found: ' + opts.lid);
    }

    for (let i=0; i<lists.length; i++) {
      if (lists[i].gid === 'group') {
        if (lists[i].id !== list.gid) {
          groups.push(lists[i]);
        } else {
          currentGroup = lists[i];
        }
      }
    }

    list.tasks = listTasks;

    const data = {
      list,
      infos: this.store.data.infos,
      currentGroup
    };

    if (opts.isNew) {
        data.isInputNewListName = true;
    }
    if (groups.length === 0) {
      const actions = this.data.actions;
      actions.splice(1,1); // disable "move to group" action
    } else {
      data.groups = groups;
    }

    // update theme configure
    const listTheme = list.theme;
    this.store.data.themes.selected.type = listTheme.type;
    this.store.data.themes.selected.index = 0;
    for (let i=0; i<this.store.data.themes[`${listTheme.type}s`].length; i++) {
      const v = this.store.data.themes[`${listTheme.type}s`][i];
      if (v.value === listTheme.value) {
        this.store.data.themes.selected.index = i;
        break;
      }
    }

    data.themes = this.store.data.themes;
    this.update();
    this.setData(data);
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
    console.log('handleTaskState -------- : ', e);
  },

  goback: function (e) {
    wx.redirectTo({
      url: '/pages/home/home'
    })
  },

  createTask: function (e) {
    const value = e.detail.value.trim();
    if (value && value !== '') {
      const newList = this.data.list;
      const task = fillNewTaskObj({
        id: uuid(),
        name: e.detail.value,
        state: 'pending',
        important: false,
        lid: newList.id,
      });
      newList.tasks.push(task);
      this.setData({
        list: newList
      });

      const tasks = this.store.data.infos.tasks;
      tasks.push(task);

      app.globalData.events$.next({
        event: REQ_ACTION.NEW_TASK,
        data: task
      });

      newList.taskCount += 1;
      this.updateListSync(newList);
    }

    this.revertCreateTaskInput();
  },

  updateListSync(newList) {
    let list;
    const lists = this.store.data.infos.lists;
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === newList.id) {
        list = lists[i];
        const tempList = {...newList};
        delete tempList.tasks; // delete tasks property
        this.store.data.infos.lists[i] = tempList;
        this.update();

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_LIST,
          data: tempList
        });
        return;
      }
    }

    if (!list) {
      throw new Error(`List ID not found: ${newList.id}`);
    }
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
        const tasks = this.store.data.infos.tasks;
        for (let k=0; k<tasks.length; k++) {
          if (tasks[k].id === task.id) {
            this.store.data.infos.tasks[k].important = task.important;
            this.update();

            app.globalData.events$.next({
              event: REQ_ACTION.UPDATE_TASK,
              data: this.store.data.infos.tasks[k]
            });
            break;
          }
        }

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

        const tasks = this.store.data.infos.tasks;
        for (let k=0; k<tasks.length; k++) {
          if (tasks[k].id === task.id) {
            this.store.data.infos.tasks[k] = task;
            this.update();

            app.globalData.events$.next({
              event: REQ_ACTION.UPDATE_TASK,
              data: task
            });
            break;
          }
        }

        if (task.state === 'finished') {
          app.globalData.events$.next({
            event: REQ_ACTION.PLAY_SOUND,
            data: {}
          });
        }

        break;
      }
    }
  },
  handleCancel1(e) {
    console.log("handleCancel1 ---------------- : ", e);
    this.setData({
      isUpdateTheme: false,
    })
  },

  actionClick(e) {
    const action = this.data.actions[e.detail.index];

    switch (action.name) {
      case '重命名清单':
        this.setData({
          isUpdateListName: !this.isUpdateListName,
          actionsVisible: false,
        });
        break;
      case '将列表移动到...':
        this.setData({
          isUpdateListName: false,
          actionsVisible: false,
          isUpdateTheme: false,
          isMoveToGroup: true
        });
        break;
      case '更改主题':
        this.setData({
          isUpdateListName: false,
          actionsVisible: false,
          isUpdateTheme: true
        });
        break;
      case '删除清单':
        this.deleteList();
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
      isUpdateTheme: false,
      isMoveToGroup: false,
    });
  },
  updateListName(e) {
    const name = e.detail.value.trim();

    this.setData({
      isInputNewListName: false,
      ['list.name']: name,
      isUpdateListName: false,
    });

    app.globalData.events$.next({
      event: REQ_ACTION.UPDATE_LIST,
      data: this.data.list
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

    app.globalData.events$.next({
      event: REQ_ACTION.UPDATE_LIST,
      data: this.data.list
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
  },
  closeMoveToGroup(e) {
    this.setData({
      isMoveToGroup: false,
    });
  },
  changeGroup(e) {
    const group = e.currentTarget.dataset.group;
    const oldGid = this.data.list.gid;
    this.data.list.gid = group.id;
    const groups = this.data.groups;
    if (this.data.currentGroup) {
      groups.push(this.data.currentGroup);
    }

    for (let i=0; i<groups.length; i++) {
      if (groups[i].id === group.id) {
        groups.splice(i, 1);
        break;
      }
    }

    this.setData({
      'list.gid': group.id,
      currentGroup: group,
      groups,
      isMoveToGroup: false,
    });

    this.updateListSync(this.data.list);
  },
  deleteList() {
    const lists = this.store.data.infos.lists;
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === this.data.list.id) {
        const removeList = lists.splice(i, 1);

        this.store.data.infos.lists = lists;
        this.update();

        app.globalData.events$.next({
          event: REQ_ACTION.DELETE_LIST,
          data: removeList[0]
        });

        break;
      }
    }

    this.goback();
  },
  goTaskPage(e) {
    wx.redirectTo({
      url: `/pages/task/task?tid=${e.currentTarget.dataset.task.id}&from=${encodeURIComponent(getCurrentRouteUrl(getCurrentPages()))}`
    })
  },
  updateNewListName(e) {
    const value = this.data.list.name.trim();
    if (value && value !== '') {
      this.setData({
        isInputNewListName: false,
        ['list.name']: value,
        isUpdateListName: false,
      });

      app.globalData.events$.next({
        event: REQ_ACTION.UPDATE_LIST,
        data: this.data.list
      });
    }
  },
  newListNameInputUpdate(e) {
    const value = e.detail.value.trim();
    if (value && value !== '') {
      this.setData({
        ['list.name']: value,
      });

    }
  }
})
