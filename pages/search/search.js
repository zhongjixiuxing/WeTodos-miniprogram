import store from '../../store';
import create from '../../plugins/westore/utils/create';

const {getCurrentRouteUrl} = require('../../utils/util');

const app = getApp()

create(store,{
  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    keyboardHeight: 0,
    condition: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    const data = {};
    if (opts.hasOwnProperty('condition')) {
      data.condition = decodeURIComponent(opts.condition);
    }

    this.setData(data);
    this.refresh();
  },

  goback(e) {
    wx.redirectTo({
      url: '/pages/home/home'
    })
  },
  conditionChange(e) {
    const condition = e.detail.value.trim();
    const data = {
      condition: condition
    };

    if (condition === '') {
      data.records = [];
    }
    this.setData(data);
    this.refresh();
  },
  refresh() {
    const tasks = this.store.data.infos.tasks;
    const newRecords = [];
    const condition = this.data.condition;

    if (condition === '') {
      this.setData({
        records: []
      });
      return;
    }

    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];

      if (t.name.indexOf(condition) !== -1) {
        newRecords.push({
          type: 'task',
          value: t,
        });
      }

      for (let k=0; k<t.steps.length; k++) {
        const step = t.steps[k];
        if (step.value.indexOf(condition) !== -1) {
          newRecords.push({
            type: 'step',
            value: step,
            task: t,
            idx: k
          });
        }
      }
    }

    this.setData({
      records: newRecords
    })
  },
  toggleTaskSelect(e) {
    const task = e.currentTarget.dataset.task;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.state = task.state === 'pending' ? 'finished' : 'pending';
        tasks[i].state = task.state;

        this.store.data.infos.tasks = tasks;
        this.update();
        this.refresh();
        break;
      }
    }
  },
  revertImportant(e) {
    const task = e.currentTarget.dataset.task;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.important = !task.important;
        tasks[i].important = task.important;

        this.store.data.infos.tasks = tasks;
        this.update();
        this.refresh();
        break;
      }
    }
  },
  toggleStepState(e) {
    const record = e.currentTarget.dataset.record;
    const task = record.task;
    const idx = record.idx;
    const tasks = this.store.data.infos.tasks;
    for (let i=0; i<tasks.length; i++) {
      const t = tasks[i];
      if (t.id === task.id) {
        task.steps[idx].state = task.steps[idx].state === 'pending' ? 'finished' : 'pending';
        tasks[i].steps = task.steps;

        this.store.data.infos.tasks = tasks;
        this.update();
        this.refresh();
        break;
      }
    }
  },

  goTaskPage(e) {
    const from = encodeURIComponent(getCurrentRouteUrl(getCurrentPages(), {condition: this.data.condition}));

    wx.redirectTo({
      url: `/pages/task/task?tid=${e.currentTarget.dataset.tid}&from=${from}`
    })
  },
  inputFocus(e) {
    if (e.detail.hasOwnProperty('height')) {
      this.setData({
        keyboardHeight: e.detail.height
      })
    }
  },
  inputBlur(e) {
    this.setData({
      keyboardHeight: 0
    })
  }
})
