"use strict";

import rxwx from 'rxjs6-wx';
const {REQ_ACTION} = require('../config/properties');
const {publicClient,authClient} = require('../services/apollo');
const store = require('../store').default;
const AsyncRefresh = require('./async_refresh');
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.onPlay(() => {});

innerAudioContext.onError((res) => {
    console.log(res.errMsg);
    console.log(res.errCode);
});

module.exports = (events$, app) => {
    const asyncRefreshClient = new AsyncRefresh(app);
    let infos;
    const events$$ = events$.subscribe(
        (data) => {
            switch (data.event) {
                case REQ_ACTION.PLAY_SOUND:
                    if (innerAudioContext.src.length === 0) {
                        innerAudioContext.src = 'http://file.52lishi.com/file/yinxiao/lyq1712281.mp3';
                    }
                    innerAudioContext.stop();
                    innerAudioContext.seek(0);
                    innerAudioContext.play();

                    break;
                case REQ_ACTION.NEW_GROUP:
                case REQ_ACTION.UPDATE_GROUP:
                case REQ_ACTION.DELETE_GROUP:
                case REQ_ACTION.NEW_TASK:
                case REQ_ACTION.UPDATE_TASK:
                case REQ_ACTION.DELETE_TASK:
                case REQ_ACTION.NEW_LIST:
                case REQ_ACTION.UPDATE_LIST:
                case REQ_ACTION.DELETE_LIST:
                    infos = store.data.infos;
                    wx.setStorageSync('infos', infos);
                    asyncRefreshClient.put({
                        type: data.event,
                        data: data.data
                    });
                    break;

                case REQ_ACTION.WX_USER_PROFILE_UPDATE:
                    const profile = JSON.parse(data.data.rawData);
                    app.globalData.userInfo = profile;
                    store.data.userProfile.wxUserInfo = profile;
                    if (store.data.userProfile && Object.keys(store.data.userProfile).length > 1) {
                        events$.next({
                            event: REQ_ACTION.UPDATE_USER_PROFILE,
                            data: store.data.userProfile
                        });
                    }

                    break;

                case REQ_ACTION.SYNC_TASKS:
                    asyncRefreshClient.syncTasks({})
                        .then((resp) => {
                            store.data.infos.tasks = resp.getTasks.tasks;
                            if (resp.getTasks.LastEvaluatedKey && Object.keys(resp.getTasks.LastEvaluatedKey).length !== 0) {
                                return events$.next({
                                    event: REQ_ACTION.SYNC_TASKS_AGAIN,
                                    data: {
                                        LastEvaluatedKey: resp.getTasks.LastEvaluatedKey
                                    }
                                });
                            }

                            // update current page data
                            const pages = getCurrentPages();
                            pages[0].setData({
                                infos: store.data.infos
                            });

                            events$.next({
                                event: REQ_ACTION.SYNC_TASKS_FINISHED,
                                data: {}
                            });
                        });
                    break;

                case REQ_ACTION.SYNC_TASKS_AGAIN:
                    asyncRefreshClient.getTasks({LastEvaluatedKey: data.data.LastEvaluatedKey})
                        .then((resp) => {
                            store.data.infos.tasks = store.data.infos.lists.concat(resp.getTasks.tasks);
                            if (resp.getTasks.LastEvaluatedKey && Object.keys(resp.getTasks.LastEvaluatedKey).length !== 0) {
                                return events$.next({
                                    event: REQ_ACTION.SYNC_LISTS_AGAIN,
                                    data: {
                                        LastEvaluatedKey: resp.getTasks.LastEvaluatedKey
                                    }
                                });
                            }

                            // update current page data
                            const pages = getCurrentPages();
                            pages[0].setData({
                                infos: store.data.infos
                            });

                            events$.next({
                                event: REQ_ACTION.SYNC_TASKS_FINISHED,
                                data: {}
                            });
                        })
                    break;

                case REQ_ACTION.SYNC_TASKS_FINISHED:
                    wx.setStorageSync('infos', store.data.infos);
                    const pages = getCurrentPages();
                    pages[0].update();
                    break;
                case REQ_ACTION.SYNC_LISTS_FINISHED:
                    wx.setStorageSync('infos', store.data.infos);
                    events$.next({
                        event: REQ_ACTION.SYNC_TASKS,
                        data: {}
                    });
                    break;
                case REQ_ACTION.SYNC_LISTS_AGAIN:
                    asyncRefreshClient.syncLists({LastEvaluatedKey: data.data.LastEvaluatedKey})
                        .then((resp) => {
                            store.data.infos.lists = store.data.infos.lists.concat(resp.getLists.lists);
                            if (resp.getLists.LastEvaluatedKey && Object.keys(resp.getLists.LastEvaluatedKey).length !== 0) {
                                return events$.next({
                                    event: REQ_ACTION.SYNC_LISTS_AGAIN,
                                    data: {
                                        LastEvaluatedKey: resp.getLists.LastEvaluatedKey
                                    }
                                });
                            }

                            // update current page data
                            const pages = getCurrentPages();
                            pages[0].setData({
                                infos: store.data.infos
                            });

                            events$.next({
                                event: REQ_ACTION.SYNC_LISTS_FINISHED,
                                data: {}
                            });
                        })
                    break;
                case REQ_ACTION.SYNC_LISTS:
                    asyncRefreshClient.syncLists({})
                        .then((resp) => {
                            store.data.infos.lists = resp.getLists.lists;
                            if (resp.getLists.LastEvaluatedKey && Object.keys(resp.getLists.LastEvaluatedKey).length !== 0) {
                                return events$.next({
                                    event: REQ_ACTION.SYNC_LISTS_AGAIN,
                                    data: {
                                        LastEvaluatedKey: resp.getLists.LastEvaluatedKey
                                    }
                                });
                            }

                            // update current page data
                            const pages = getCurrentPages();
                            pages[0].setData({
                                infos: store.data.infos
                            });

                            events$.next({
                                event: REQ_ACTION.SYNC_LISTS_FINISHED,
                                data: {}
                            });
                        });
                    break;
                case REQ_ACTION.USER_LOGIN:
                    store.data.user = Object.assign(store.data.user, data.data);
                    delete store.data.user.profile;
                    store.data.userProfile = data.data.profile;
                    if (data.data.profile.wxUserInfo && Object.keys(data.data.profile.wxUserInfo).length !== 0) {
                        store.data.userInfo = data.data.profile.wxUserInfo;
                    }
                    wx.setStorageSync('user', store.data.user);
                    wx.setStorageSync('userProfile', store.data.userProfile);

                    events$.next({
                        event: REQ_ACTION.SYNC_LISTS,
                        data: {}
                    });
                    break;

                case REQ_ACTION.APP_ON_LOADING:
                    let user = wx.getStorageSync('user') || null;
                    let hasRetLoign = false;
                    if (!user) {
                        hasRetLoign = true;
                    } else {
                        store.data.user = user;
                    }

                    const userProfile = wx.getStorageSync('userProfile') || null;
                    if (userProfile) {
                        store.data.userProfile = userProfile;
                    } else {
                        hasRetLoign = true;
                    }

                    infos = wx.getStorageSync('infos') || null;
                    if (infos) {
                        store.data.infos = infos;
                    } else {
                        hasRetLoign = true;
                    }

                    if (hasRetLoign) {
                        events$.next({event: REQ_ACTION.REQ_LOGIN});
                    }

                    break;

                case REQ_ACTION.REQ_LOGIN:
                    wx.login({
                        success: res => {
                            console.log('wx.login res : ', res);
                            // 发送 res.code 到后台换取 openId, sessionKey, unionId
                            if (res.errMsg !== 'login:ok') {
                                throw new Error('wx.login failed: ', res);
                            }

                            publicClient.mutate({
                                mutation: `
                                    mutation Login($code: String!) {
                                        wxLogin(code: $code) {
                                          id,
                                          token,
                                          openid,
                                          session_key,
                                          profile
                                        }
                                    }
                                    `,
                                variables: {
                                    code: res.code,
                                }
                            })
                                .then(data => {
                                    events$.next({
                                        event: REQ_ACTION.USER_LOGIN,
                                        data: data.wxLogin
                                    });
                                })
                                .catch(error => console.error(error));

                        },
                        fail: err => {
                            console.error('wx.login failed: ', err);
                        }
                    })
                    break;

                case REQ_ACTION.UPDATE_USER_PROFILE:
                    asyncRefreshClient.put({
                        type: data.event,
                        data: data.data
                    });
                    wx.setStorageSync('userProfile', data.data);
                    break;

                case REQ_ACTION.SYNC:
                    asyncRefreshClient.sync();
                    break;
                default:
                    console.error('Unknown REQ_ACTION: ', data.event);
            }
        },
        err => {
            console.error('Rx Service Error: ', err);
        },
        () => {
            console.error('Rx Server completed, that will exist...');
        });
}
