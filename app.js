import rxwx from 'rxjs6-wx'
const {publicClient} = require('./services/apollo');
const {REQ_ACTION} = require('./config/properties');

const events$ = new rxwx.Rx.Subject();

//app.js
App({
  onLaunch: function () {
    // init rx server
    require('./services/rx')(events$, this);
    // init data
    events$.next({event: REQ_ACTION.APP_ON_LOADING});
  },
  onHide: function (d, d2) {
    events$.next({
      event: REQ_ACTION.SYNC,
      data: {}
    });
  },
  globalData: {
    userInfo: null,
    events$,
  }
});
