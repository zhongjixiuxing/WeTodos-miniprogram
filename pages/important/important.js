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
    isEditorVisible: false,
    tasksMoveDrawerVisible: false,
    actions: [
      {
        name: '编辑',
        leftIcon: {
          type:'icon',
          value: 'label'
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
      // {
      //   name: '隐藏已完成任务',
      //   leftIcon: {
      //     type:'icon',
      //     value: 'success'
      //   },
      // },
      // {
      //   name: '显示完成的任务',
      //   leftIcon: {
      //     type:'icon',
      //     value: 'success'
      //   },
      // }
    ],
    infos: null,
    userProfile: null,
    groups: [],
    currentGroup: null,
    themes: null,
    date: '2019-10-01',
    selectedTasks: [],
    expireDateCfg: {
      start: `${new Date().getFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getDate()}`,
    },
    todayNo: getDateNo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    // update theme configure
    this.setData({
      userProfile: this.store.data.userProfile,
      infos: this.store.data.infos
    });

    const data = {};
    const listTheme = this.data.userProfile.importantList.theme;
    const finishedTaskVisible = this.data.userProfile.importantList.finishedTaskVisible;
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
    if (finishedTaskVisible) {
      this.data.actions.push({
        name: '隐藏已完成任务',
        leftIcon: {
          type:'icon',
          value: 'success'
        },
      });
    } else {
      this.data.actions.push({
        name: '显示完成的任务',
        leftIcon: {
          type:'icon',
          value: 'success'
        },
      });
    }
    data.actions = this.data.actions;

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
      const task = fillNewTaskObj({
        id: uuid(),
        name: e.detail.value,
        state: 'pending',
        important: true,
        lid: null,
      });

      const tasks = this.store.data.infos.tasks;
      tasks.push(task);

      this.setData({
        ['infos.tasks']: tasks
      });

      app.globalData.events$.next({
        event: REQ_ACTION.NEW_TASK,
        data: task
      });
    }

    this.revertCreateTaskInput();
  },


  createTaskByBlurEvent(e) {
    let value = e.detail.value.trim();
    for (let i=0; i<this.store.data.infos.tasks.length; i++) {
      let lastTask = this.store.data.infos.tasks[this.store.data.infos.tasks.length - 1];
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
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        tasks[i].important = !t.important;

        this.setData({
          ['infos.tasks']: tasks
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });
        break;
      }
    }
  },
  revertState(e) {
    const task = e.currentTarget.dataset.task;
    const tasks = this.store.data.infos.tasks;

    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.state = task.state === 'pending' ? 'finished' : 'pending';
        tasks[i].state = task.state;

        this.setData({
          ['infos.tasks']: tasks
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
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
    const action = this.data.actions[e.detail.index];
    let actions, userProfile;

    switch (action.name) {
      case '更改主题':
        this.setData({
          isUpdateListName: false,
          actionsVisible: false,
          isUpdateTheme: true
        });
        break;

      case '编辑':
        this.setData({
          isEditorVisible: true,
          actionsVisible: false,
          selectedTasks: [],
        });
        break;

      case '显示完成的任务':
      case '隐藏已完成任务':
        userProfile = this.store.data.userProfile;
        actions = this.data.actions;
        for (let i=0; i<actions.length; i++) {
          if (actions[i].name === '显示完成的任务') {
            actions[i].name = '隐藏已完成任务';
            userProfile.importantList.finishedTaskVisible = true;
            break;
          } else if (actions[i].name === '隐藏已完成任务') {
            actions[i].name = '显示完成的任务';
            userProfile.importantList.finishedTaskVisible = false;
            break;
          }
        }

        this.setData({
          userProfile: userProfile,
          actions
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_USER_PROFILE,
          data: userProfile
        });
        break;
      default:
        throw new Error('Unknown action: ' + action.name);
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
    });
  },
  updateListName(e) {
    const name = e.detail.value.trim();

    this.setData({
      isInputNewListName: false,
      ['list.name']: name,
      isUpdateListName: false,
    });
  },
  updateTheme(e) {
    const type = this.data.themes.selected.type;
    const idx = e.currentTarget.dataset.idx;
    const theme = {
      type,
      value: this.data.themes[`${type}s`][idx].value
    };

    this.setData({
      ['themes.selected.index']: idx,
      ['userProfile.importantList.theme']: theme
    });

    app.globalData.events$.next({
      event: REQ_ACTION.UPDATE_USER_PROFILE,
      data: this.store.data.userProfile
    });
  },
  changeSelectThemeType(e) {
    if (this.data.themes.selected.type === e.currentTarget.dataset.type) {
      return;
    }

    const type = e.currentTarget.dataset.type

    this.store.data.userProfile.importantList.theme = {
      type,
      value: this.data.themes[`${type}s`][0].value
    };

    this.update();
    this.setData({
      ['themes.selected.type']: type,
      ['themes.selected.index']: 0,
      ['userProfile.importantList.theme']: this.store.data.userProfile.importantList.theme,
    });
  },
  closeUpdateThemeInput(e) {
    this.setData({
      isUpdateTheme: false,
    });
  },
  deleteList() {
    const lists = this.store.data.infos.lists;
    for (let i=0; i<lists.length; i++) {
      if (lists[i].id === this.data.list.id) {
        lists.splice(i, 1);

        this.store.data.infos.lists = lists;
        this.update();
        break;
      }
    }

    this.goback();
  },
  toggleTasksMoveDrawerVisible() {
    this.setData({
      tasksMoveDrawerVisible: !this.data.tasksMoveDrawerVisible
    })
  },
  tasksActionClick(e) {
    switch (e.currentTarget.dataset.action) {
      case 'all-select':
        const tasks = this.getImportantTasks(this.store.data.infos.tasks, this.data.userProfile);
        if (tasks.length === this.data.selectedTasks.length) {
          this.setData({
            selectedTasks: [], // clean all
          })
        } else {
          this.setData({
            selectedTasks: tasks.map((v) => {return v.id})
          })
        }

        break;
      case 'move':
        this.toggleTasksMoveDrawerVisible();
        break;
      case 'expire':
        break;
      case 'delete':
        this.deleteSelectedTasks();
        break;
      default:
        throw new Error('Un-support tasks action: ' + e.currentTarget.dataset.action);
    }
  },
  toggleTaskSelect(e) {
    const selectedTasks = this.data.selectedTasks;
    const taskId = e.currentTarget.dataset.task.id;
    if (!selectedTasks.includes(taskId)) {
      selectedTasks.push(taskId);
    } else {
      const idx = selectedTasks.indexOf(taskId);
      selectedTasks.splice(idx, 1);
    }

    this.setData({selectedTasks});
  },
  getImportantTasks(tasks, userProfile) {
    const result = [];
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].important) {
        if (tasks[i].state === 'finished' && userProfile.importantList.finishedTaskVisible === false) {
          continue;
        }
        result.push(tasks[i]);
      }
    }

    return result;
  },
  closeEditorPage() {
    this.setData({isEditorVisible: false});
  },
  deleteSelectedTasks() {
    const tasks = this.store.data.infos.tasks;
    const deleteTaskIds = this.data.selectedTasks;
    const delTasks = [];

    for (let i=0; i<deleteTaskIds.length; i++) {
      let idx = -1;
      for (let k=0; k<tasks.length; k++) {
        if (tasks[k].id === deleteTaskIds[i]) {
          idx = k;
          break;
        }
      }

      if (idx === -1) {
        console.warn('deleteSelectedTasks task id not found: ' + deleteTaskIds[i]);
        continue;
      }

      delTasks.push(tasks[idx]);
      tasks.splice(idx, 1)
    }

    this.setData({
      ['infos.tasks']: tasks,
      selectedTasks: [],
    });

    for (let i=0; i<delTasks.length; i++) {
      app.globalData.events$.next({
        event: REQ_ACTION.DELETE_TASK,
        data: delTasks[i]
      });
    }
    this.closeEditorPage();
  },
  updateTasksExpireDate(e) {
    const tasks = this.store.data.infos.tasks;
    const taskIds = this.data.selectedTasks;
    const newDate = parseInt(e.detail.value.replace(new RegExp('-','g'), ''));
    for (let i=0; i<taskIds.length; i++) {
      let idx = -1;
      for (let k=0; k<tasks.length; k++) {
        if (tasks[k].id === taskIds[i]) {
          idx = k;
          tasks[k].expireDay = newDate;
          break;
        }
      }

      if (idx === -1) {
        console.warn('deleteSelectedTasks task id not found: ' + deleteTaskIds[i]);
        continue;
      }
    }

    this.store.data.infos.tasks = tasks;
    this.update();
    this.setData({
      infos: this.store.data.infos,
      selectedTasks: [],
    });
    this.closeEditorPage();
  },
  moveToList(e) {
    const list = e.currentTarget.dataset.list;
    const tasks = this.store.data.infos.tasks;
    const taskIds = this.data.selectedTasks;
    const updateTasks = [];

    for (let k=0; k<tasks.length; k++) {
      if (taskIds.includes(tasks[k].id)) {
        tasks[k].lid = list.id;
        updateTasks.push(tasks[k]);
        break;
      }
    }

    this.setData({
      ['infos.tasks']: tasks,
      selectedTasks: [],
    });

    updateTasks.forEach((t) => {
      app.globalData.events$.next({
        event: REQ_ACTION.UPDATE_TASK,
        data: t
      });
    });
    this.closeEditorPage();
  },
  goTaskPage(e) {
    wx.redirectTo({
      url: `/pages/task/task?tid=${e.currentTarget.dataset.task.id}&from=${encodeURIComponent(getCurrentRouteUrl(getCurrentPages()))}`
    })
  }
})
