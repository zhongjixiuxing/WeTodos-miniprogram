import store from '../../store';
import create from '../../plugins/westore/utils/create';
const {REQ_ACTION} = require('../../config/properties');
const {uuid} = require('../../utils/util');

const {getCurrentRouteUrl, fillNewTaskObj, getDateNo} = require('../../utils/util');

const app = getApp()

create(store,{
  /**
   * 页面的初始数据
   */
  data: {
    isEditorVisible: false,
    isCreateTask: false,
    isInputNewListName: false,
    actionsVisible: false,
    isUpdateTheme: false,
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
    ],
    selectedTasks: [],
    ownerlessTasks: [],
    infos: null,
    groups: [],
    currentGroup: null,
    themes: null,
    userProfile: null,
    todayNo: getDateNo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    this.setData({
      userProfile: this.store.data.userProfile,
    });

    const data = {};
    const listTheme = this.data.userProfile.ownerlessTasks.theme;
    const finishedTaskVisible = this.data.userProfile.ownerlessTasks.finishedTaskVisible;
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

    this.refreshTasks();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      infos: this.store.data.infos
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

  handleTaskState: function (e) {
    console.log('handleTaskState -------- : ', e);
  },

  goback: function (e) {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },
  refreshTasks() {
    const tasks = this.getOwnerlessTasks();
    const data = {
      ownerlessTasks: tasks
    };

    this.setData(data);
  },
  getOwnerlessTasks() {
    const tasks = this.store.data.infos.tasks;
    const ownerlessTasks = [];
    for (let i=0; i<tasks.length; i++) {
      const task = tasks[i];
      if (task.lid !== null){
        continue;
      }

      if (task.state === 'finished' && this.store.data.userProfile.ownerlessTasks.finishedTaskVisible === false) {
        continue;
      }

      ownerlessTasks.push(task);
    }

    return ownerlessTasks;
  },

  createTask: function (e) {
    const value = e.detail.value.trim();
    if (value && value !== '') {
      const task = fillNewTaskObj({
        id: uuid(),
        name: e.detail.value,
        state: 'pending',
        important: false,
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
    this.refreshTasks();
  },

  createTaskByBlurEvent(e) {
    const value =  e.detail.value.trim();
    if (this.store.data.infos.tasks.length > 0) {
      const lastTask = this.store.data.infos.tasks[this.store.data.infos.tasks.length - 1];
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
    let idx;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        tasks[i].important = !t.important;
        idx = i;
        break;
      }
    }

    this.setData({
      ['infos.tasks']: tasks
    });

    app.globalData.events$.next({
      event: REQ_ACTION.UPDATE_TASK,
      data: tasks[idx]
    });
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
    console.log("handleCancel1 ---------------- : ", e);
    this.setData({
      isUpdateTheme: false,
    })
  },

  actionClick(e) {
    const action = this.data.actions[e.detail.index];
    let actions, userProfile;

    switch (action.name) {
      case '编辑':
        this.setData({
          isEditorVisible: true,
          actionsVisible: false,
          tasksMoveDrawerVisible: false,
          selectedTasks: [],
        });
        break;
      case '更改主题':
        this.setData({
          actionsVisible: false,
          isUpdateTheme: true
        });
        break;
      case '删除清单':
        this.deleteList();
        break;
      case '显示完成的任务':
      case '隐藏已完成任务':
        userProfile = this.store.data.userProfile;
        actions = this.data.actions;
        for (let i=0; i<actions.length; i++) {
          if (actions[i].name === '显示完成的任务') {
            actions[i].name = '隐藏已完成任务';
            userProfile.ownerlessTasks.finishedTaskVisible = true;
            break;
          } else if (actions[i].name === '隐藏已完成任务') {
            actions[i].name = '显示完成的任务';
            userProfile.ownerlessTasks.finishedTaskVisible = false;
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
    });
  },
  updateTheme(e) {
    const type = this.data.themes.selected.type;
    const idx = e.currentTarget.dataset.idx
    const theme = {
      type,
      value: this.data.themes[`${type}s`][idx].value
    }

    this.setData({
      ['themes.selected.index']: idx,
      ['userProfile.ownerlessTasks.theme']: theme
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
    });
  },
  closeEditorPage() {
    this.setData({isEditorVisible: false});
  },
  tasksActionClick(e) {
    switch (e.currentTarget.dataset.action) {
      case 'all-select':
        const tasks = this.getOwnerlessTasks();
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

    this.refreshTasks();
    this.closeEditorPage();
  },
  toggleTasksMoveDrawerVisible() {
    this.setData({
      tasksMoveDrawerVisible: !this.data.tasksMoveDrawerVisible
    })
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
  goTaskPage(e) {
    wx.navigateTo({
      url: `/pages/task/task?tid=${e.currentTarget.dataset.task.id}&from=${encodeURIComponent(getCurrentRouteUrl(getCurrentPages()))}`
    })
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

    this.refreshTasks();
    this.closeEditorPage();
  },
})
