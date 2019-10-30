import create from '../../plugins/westore/utils/create';
import store from "../../store";

const {getDateNo} = require('../../utils/util');
const {REQ_ACTION} = require('../../config/properties');

//获取应用实例
const app = getApp()

create(store,{
  data: {
    isUpdateTaskName: false,
    isAddStepInput: false,
    isMemoInput: false,
    updateStepIdx: -1,
    expireDateCfg: {
      start: `${new Date().getFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getDate()}`,
    },
    task: null,
    expireDayString: null,
    createdAt: null,
    originUrl: null
  },

  onLoad: function (opts) {
    const tasks = this.store.data.infos.tasks;
    let task;
    for (let i=0; i<tasks.length; i++) {
      if (`${tasks[i].id}` === opts.tid) {
        task = tasks[i];
        break;
      }
    }

    if (!task){
      throw new Error('Task ID not found: ' + opts.tid);
    }

    const expireDayString = this.getFormatDate(task.expireDay); // init expire day
    const date = new Date(task.createdAt);
    const createdAt = this.getFormatDate(getDateNo(date));

    const data = {task, expireDayString: expireDayString, createdAt: createdAt};

    if (opts.from) {
      data.originUrl = decodeURIComponent(opts.from);
    }

    this.setData(data);
  },

  goback(e) {
    let redirect = '/pages/home/home';
    if (this.data.originUrl) {
      redirect = this.data.originUrl;
    }

    wx.redirectTo({
      url: redirect
    });
  },
  revertState(e) {
    const tasks = this.store.data.infos.tasks;
    const task = this.data.task;

    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.state = task.state === 'pending' ? 'finished' : 'pending';
        tasks[i].state = task.state;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({
          task
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: task
        });

        break;
      }
    }
  },
  revertImportant(e) {
    const tasks = this.store.data.infos.tasks;
    const task = this.data.task;

    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.important = !task.important;
        tasks[i].important = task.important;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({
          task
        });

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });

        break;
      }
    }
  },
  revertMyDay() {
    const tasks = this.store.data.infos.tasks;
    const task = this.data.task;

    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.isMyday = !task.isMyday;
        tasks[i].isMyday = task.isMyday;
        this.setData({
          task
        });

        this.store.data.infos.tasks = tasks;
        this.update();

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });

        break;
      }
    }
  },
  showUpdateNameInput() {
    this.setData({
      isUpdateTaskName: true
    })
  },
  updateName(e) {
    const newName = e.detail.value.trim();
    const task = this.data.task;
    if (newName === task.name || newName === '') {
      return;
    }

    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.name = newName;
        tasks[i].name = newName;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({
          task
        });

        break;
      }
    }
  },
  revertStep(e) {
    const task = this.data.task;
    const idx = e.currentTarget.dataset.idx;
    task.steps[idx].state = task.steps[idx].state === 'pending' ? 'finished' : 'pending';

    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].steps[idx].state = task.steps[idx].state;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task});

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });
        break;
      }
    }
  },
  removeStep(e) {
    const task = this.data.task;
    const idx = e.currentTarget.dataset.idx;
    task.steps.splice(idx, 1);

    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].steps = task.steps;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task});

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });
        break;
      }
    }
  },
  toggleAddStepInput() {
    this.setData({
      isAddStepInput: !this.data.isAddStepInput
    });
  },
  addStep(e) {
    const task = this.data.task;
    const stepText = e.detail.value.trim();
    if (stepText === '' || (task.steps.length !== 0 && task.steps[task.steps.length - 1].value === stepText)) {
      return;
    }

    task.steps.push({
      value: stepText,
      state: 'pending'
    });

    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].steps = task.steps;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task, isAddStepInput: false});

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });
        break;
      }
    }
  },
  updateStepText(e) {
    const newText = e.detail.value.trim();
    const idx = e.currentTarget.dataset.idx
    this.setData({
      updateStepIdx: -1,
    });
    if (newText === '') {
      return this.removeStep(e);
    }

    const task = this.data.task;
    if (newText === task.steps[idx].value) {
      return;
    }

    task.steps[idx].value = newText;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].steps = task.steps;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task});
        break;
      }
    }
  },
  showStepTextInput(e) {
    this.setData({
      updateStepIdx: e.currentTarget.dataset.idx
    })
  },

  updateTasksExpireDate(e) {
    const task = this.data.task;
    const tasks = this.store.data.infos.tasks;
    const newDate = parseInt(e.detail.value.replace(new RegExp('-','g'), ''));
    task.expireDay = newDate;

    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].expireDay = task.expireDay;
        this.store.data.infos.tasks = tasks;
        this.update();

        const expireDayString = this.getFormatDate(task.expireDay);

        this.setData({task, expireDayString});

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });

        break;
      }
    }
  },
  getFormatDate(day) {
    if (!day || day === 0) {
      return;
    }

    const todayNo = parseInt(`${new Date().getFullYear()}${new Date().getUTCMonth() + 1}${new Date().getDate()}`);
    const tomorrow = new Date(Date.now() + 86400000);
    const tomorrowNo = parseInt(`${tomorrow.getFullYear()}${tomorrow.getUTCMonth() + 1}${tomorrow.getDate()}`);

    if (day === todayNo) {
      return '今天';
    } else if (day === tomorrowNo) {
      return '明天';
    } else {
      const dayStr = `${day}`;

      const yearNo = parseInt(dayStr.substr(0, 4));
      let monthNo = parseInt(dayStr.substr(4, 2));
      let dayNo = parseInt(dayStr.substr(6, 2));
      monthNo = monthNo < 10 ? '0' + monthNo : monthNo;
      dayNo = dayNo < 10 ? '0' + dayNo : dayNo;

      const date = new Date(`${yearNo}-${monthNo}-${dayNo}`);
      return `${date.getUTCMonth() + 1}月${date.getDate()}日 周${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}`
    }
  },

  unsetExpireDay() {
    const task = this.data.task;
    task.expireDay = 0;

    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].expireDay = task.expireDay;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task});
        break;
      }
    }
  },
  updateMemo(e) {
    const memo = e.detail.value.trim();

    this.setData({isMemoInput: false});
    const task = this.data.task;
    if (memo === task.comment) {
      return;
    }

    task.comment = memo;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].comment = memo;
        this.store.data.infos.tasks = tasks;
        this.update();
        this.setData({task});

        app.globalData.events$.next({
          event: REQ_ACTION.UPDATE_TASK,
          data: tasks[i]
        });
        break;
      }
    }
  },
  deleteTask(e) {
    const task = this.data.task;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks.splice(i, 1);
        this.store.data.infos.tasks = tasks;
        this.update();

        app.globalData.events$.next({
          event: REQ_ACTION.DELETE_TASK,
          data: task
        });

        break;
      }
    }

    this.goback();
  },
  openMemoTextarea() {
    this.setData({isMemoInput: true})
  }
})
