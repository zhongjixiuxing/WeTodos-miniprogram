import store from '../../store';
import create from '../../plugins/westore/utils/create';

const {getCurrentRouteUrl, fillNewTaskObj, getDateNo} = require('../../utils/util');
const {REQ_ACTION} = require('../../config/properties');

const app = getApp();

const afterTomorrow = new Date(Date.now() + 172800000);
const end = new Date(Date.now() + 7 * 86400000);
const date = `周${['日', '一', '二', '三', '四', '五', '六'][afterTomorrow.getDay()]} ${afterTomorrow.getUTCMonth() + 1}月${afterTomorrow.getDate()} 至 周${['日', '一', '二', '三', '四', '五', '六'][end.getDay()]} ${end.getUTCMonth() + 1}月${end.getDate()}`

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
    planTasks: [{
      type: 'before',
      name: '以前',
      tasks: [],
    }, {
      type: 'today',
      name: '今天',
      tasks: [],
    }, {
      type: 'tomorrow',
      name: '明天',
      tasks: [],
    }, {
      type: 'next-week',
      name: date,
      tasks: [],
    }, {
      type: 'future',
      name: '稍后',
      tasks: [],
    }],
    themes: null,
    date: '2019-10-01',
    selectedTasks: [],
    currentDate: `${new Date().getUTCMonth() + 1}月${new Date().getDate()}日 星期${['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()]}`,
    expireDateCfg: {
      start: `${new Date().getFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getDate()}`,
    },
    todayNo: getDateNo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    this.setData({
      userProfile: this.store.data.userProfile,
    });

    // update theme configure
    const data = {};
    const listTheme = this.data.userProfile.planList.theme;
    const finishedTaskVisible = this.data.userProfile.planList.finishedTaskVisible;
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
    const data = {
      infos: this.store.data.infos,
    };

    const tasks = this.accordingPlanTasksByDate();
    data.planTasks = this.data.planTasks;
    data.planTasks[0].tasks = tasks.before.tasks;
    data.planTasks[1].tasks = tasks.today.tasks;
    data.planTasks[2].tasks = tasks.tomorrow.tasks;
    data.planTasks[3].tasks = tasks.nextWeek.tasks;
    data.planTasks[3].name = tasks.nextWeek.name;
    data.planTasks[4].tasks = tasks.future.tasks;

    this.setData(data);
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

  // 根据task expireDay日期进行分离
  accordingPlanTasksByDate() {
    const getDateNoFunc = (date) => {
      return parseInt(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`)
    }

    const now = new Date();
    const todayNo = getDateNoFunc(now);
    const tomorrowNo = getDateNoFunc(new Date(now.getTime() + 86401000));
    const nextWeek = {
      startNo: getDateNoFunc(new Date(now.getTime() + 172800000)),
      endNo: getDateNoFunc(new Date(now.getTime() + 7 * 86400000))
    }

    const afterTomorrow = new Date(now.getTime() + 172800000);
    const end = new Date(now.getTime() + 7 * 86400000);
    const planTasks = {
      before: {
        tasks: [],
      },
      today: {
        tasks: [],
      },
      tomorrow: {
        tasks: [],
      },
      nextWeek: {
        tasks: [],
        name: `周${['日', '一', '二', '三', '四', '五', '六'][afterTomorrow.getDay()]} ${afterTomorrow.getUTCMonth() + 1}月${afterTomorrow.getDate()} 至 周${['日', '一', '二', '三', '四', '五', '六'][end.getDay()]} ${end.getUTCMonth() + 1}月${end.getDate()}`
      },
      future: {
        tasks: [],
      }
    }



    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const task = tasks[i];
      if (task.expireDay === 0){
        continue;
      }

      if (task.state === 'finished' && this.store.data.userProfile.planList.finishedTaskVisible === false) {
        continue;
      }

      if (task.expireDay === todayNo) {
        planTasks.today.tasks.push(task);
      } else if (task.expireDay === tomorrowNo) {
        planTasks.tomorrow.tasks.push(task);
      } else if (task.expireDay < todayNo) {
        planTasks.before.tasks.push(task);
      } else if (task.expireDay >= nextWeek.startNo && task.expireDay <= nextWeek.endNo) {
        planTasks.nextWeek.tasks.push(task);
      } else {
        planTasks.future.tasks.push(task);
      }
    }

    return planTasks;
  },

  refreshTasks() {
    const tasks = this.accordingPlanTasksByDate();
    const data = {};
    data.planTasks = this.data.planTasks;
    data.planTasks[0].tasks = tasks.before.tasks;
    data.planTasks[1].tasks = tasks.today.tasks;
    data.planTasks[2].tasks = tasks.tomorrow.tasks;
    data.planTasks[3].tasks = tasks.nextWeek.tasks;
    data.planTasks[3].name = tasks.nextWeek.name;
    data.planTasks[4].tasks = tasks.future.tasks;

    this.setData(data);
  },

  handleTaskState: function (e) {
    console.log('handleTaskState ------- : ', e);
  },

  goback: function (e) {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  createTask: function (e) {
    const value = e.detail.value.trim();
    if (value && value !== '') {
      const task = fillNewTaskObj({
        id: Date.now(),
        name: e.detail.value,
        state: 'pending',
        important: false,
        isMyday: false,
        expireDay: parseInt(`${new Date().getFullYear()}${new Date().getUTCMonth() + 1}${new Date().getDate()}`),
        lid: null,
      });

      this.store.data.infos.tasks.push(task);
      this.update();

      this.refreshTasks();
      this.setData({
        infos: this.store.data.infos
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

    this.refreshTasks();
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

        if (task.state === 'finished') {
          app.globalData.events$.next({
            event: REQ_ACTION.PLAY_SOUND,
            data: {}
          });
        }

        break;
      }
    }

    this.refreshTasks();
  },
  handleCancel1(e) {
    this.setData({
      actionsVisible: false,
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
            userProfile.planList.finishedTaskVisible = true;
            break;
          } else if (actions[i].name === '隐藏已完成任务') {
            actions[i].name = '显示完成的任务';
            userProfile.planList.finishedTaskVisible = false;
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

        this.refreshTasks();
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
    const idx = e.currentTarget.dataset.idx
    const theme = {
      type,
      value: this.data.themes[`${type}s`][idx].value
    };

    this.update();
    this.setData({
      ['themes.selected.index']: idx,
      ['userProfile.planList.theme']: theme
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

    this.store.data.userProfile.planList.theme = {
      type,
      value: this.data.themes[`${type}s`][0].value
    };

    this.update();
    this.setData({
      ['themes.selected.type']: type,
      ['themes.selected.index']: 0,
      ['userProfile.planList.theme']: this.store.data.userProfile.planList.theme,
    });
  },
  closeUpdateThemeInput(e) {
    this.setData({
      isUpdateTheme: false,
    });
  },
  toggleTasksMoveDrawerVisible() {
    this.setData({
      tasksMoveDrawerVisible: !this.data.tasksMoveDrawerVisible
    })
  },
  tasksActionClick(e) {
    switch (e.currentTarget.dataset.action) {
      case 'all-select':
        const tasks = this.getMydayTasks(this.store.data.infos.tasks, this.data.userProfile);
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
  getMydayTasks(tasks, userProfile) {
    const result = [];
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].important) {
        if (tasks[i].state === 'finished' && userProfile.planList.finishedTaskVisible === false) {
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
      tasks.splice(idx, 1);
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

    this.refreshTasks();
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
    wx.navigateTo({
      url: `/pages/task/task?tid=${e.currentTarget.dataset.task.id}&from=${encodeURIComponent(getCurrentRouteUrl(getCurrentPages()))}`
    })
  }
})
