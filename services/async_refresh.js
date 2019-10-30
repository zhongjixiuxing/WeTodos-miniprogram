'use strict';

import rxwx from "rxjs6-wx";
const {REQ_ACTION} = require('../config/properties');
const {publicClient,authClient} = require('../services/apollo');

/***
 *
 * 同步服务器工具类
 *
 * @type {module.AsyncRefresh}
 */

module.exports = class AsyncRefresh {
    cacheKey = 'cache_actions';
    currentSyncAction = 'current_sync_action';
    isSynching = false; // 是否正在同步？
    app = null;
    static ACTION = {
        NEW_GROUP: 'new_group',
        UPDATE_GROUP: 'update_group',
        DELETE_GROUP: 'delete_group',
        NEW_LIST: 'new_list',
        UPDATE_LIST: 'update_list',
        DELETE_LIST: 'delete_list',
        NEW_TASK: 'new_task',
        UPDATE_TASK: 'update_task',
        DELETE_TASK: 'delete_task',
        UPDATE_USER_PROFILE: 'update_user_profile',
        SYNC_LISTS: 'sync_lists',
    };

    constructor(app) {
        this.app = app;
        let cacheData = wx.getStorageSync(this.cacheKey);
        if (!cacheData) {
            cacheData = [];
        }

        this._cache = cacheData;
    }

    put(action) {
        let isExist;
        const actionTypes = [AsyncRefresh.ACTION.NEW_GROUP, AsyncRefresh.ACTION.UPDATE_GROUP];
        const actionListTypes = [AsyncRefresh.ACTION.NEW_LIST, AsyncRefresh.ACTION.UPDATE_LIST];
        const actionTaskTypes = [AsyncRefresh.ACTION.NEW_TASK, AsyncRefresh.ACTION.UPDATE_TASK];

        switch (action.type) {
            case AsyncRefresh.ACTION.NEW_GROUP:
                this._cache.push(action);
                this.store();
                break;

            case AsyncRefresh.ACTION.UPDATE_GROUP:

                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            this._cache[i].data = action.data;
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;

            case AsyncRefresh.ACTION.DELETE_GROUP:
                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            if (a.type === AsyncRefresh.ACTION.NEW_GROUP) {
                                this._cache.splice(i, 1);
                            } else {
                                this._cache[i].type = AsyncRefresh.ACTION.DELETE_GROUP;
                            }

                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;

            case AsyncRefresh.ACTION.NEW_LIST:
                this._cache.push(action);
                this.store();
                break;

            case AsyncRefresh.ACTION.UPDATE_LIST:

                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionListTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            this._cache[i].data = action.data;
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;

            case AsyncRefresh.ACTION.DELETE_LIST:
                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionListTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            if (a.type === AsyncRefresh.ACTION.NEW_LIST) {
                                this._cache.splice(i, 1);
                            } else {
                                this._cache[i].type = AsyncRefresh.ACTION.DELETE_LIST;
                            }

                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;

            case AsyncRefresh.ACTION.NEW_TASK:
                this._cache.push(action);
                this.store();
                break;

            case AsyncRefresh.ACTION.UPDATE_TASK:

                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionTaskTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            this._cache[i].data = action.data;
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;

            case AsyncRefresh.ACTION.DELETE_TASK:
                isExist = false;
                /**
                 * 查找cache是否已经存在相关的记录，有则更新，没则插入
                 */
                for (let i=0; i<this._cache.length; i++) {
                    const a = this._cache[i];
                    if (actionListTypes.includes(a.type)) {
                        if (action.data.id === a.data.id) {
                            if (a.type === AsyncRefresh.ACTION.NEW_TASK) {
                                this._cache.splice(i, 1);
                            } else {
                                this._cache[i].type = AsyncRefresh.ACTION.DELETE_TASK;
                            }

                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this._cache.push(action);
                }
                this.store();
                break;
            case AsyncRefresh.ACTION.UPDATE_USER_PROFILE:
                this._cache.push(action);
                this.store();
                break;
            default:
                throw new Error(`Unknown AsyncRefresh type: ${action.type}`);
        }
    }

    /**
     * 同步缓存的操作到服务器
     */
    async sync() {
        if (this.isSynching) {
            return;
        }

        this.isSynching = true;
        while(true) {
            let action = wx.getStorageSync(this.currentSyncAction);
            if (!action) {
                if (!this._cache || this._cache.length === 0) {
                    this.isSynching = false;
                    break;
                }

                action = this._cache.splice(0, 1);
                if (action.length === 0) {
                    this.isSynching = false;
                    break;
                }

                action = action[0];
                wx.setStorageSync(this.currentSyncAction, action);
                this.store();
            }

            await this.syncAction(action);
            wx.removeStorageSync(this.currentSyncAction);
        }
    }

    async syncAction(action) {
        switch (action.type) {
            case AsyncRefresh.ACTION.NEW_GROUP:
                return await this.newGroupReq(action);
                break;

            case AsyncRefresh.ACTION.UPDATE_GROUP:
                return await this.updateGroupReq(action);
                break;

            case AsyncRefresh.ACTION.DELETE_GROUP:
                return await this.deleteGroupReq(action);
                break;

            case AsyncRefresh.ACTION.NEW_LIST:
                return await this.newListReq(action);
                break;

            case AsyncRefresh.ACTION.UPDATE_LIST:
                return await this.updateListReq(action);
                break;

            case AsyncRefresh.ACTION.DELETE_LIST:
                return await this.deleteListReq(action);
                break;

            case AsyncRefresh.ACTION.NEW_TASK:
                return await this.newTaskReq(action);
                break;

            case AsyncRefresh.ACTION.UPDATE_TASK:
                return await this.updateTaskReq(action);
                break;

            case AsyncRefresh.ACTION.DELETE_TASK:
                return await this.deleteTaskReq(action);
                break;

            case AsyncRefresh.ACTION.UPDATE_USER_PROFILE:
                return await this.updateUserProfile(action);
                break;

            default:
                throw new Error(`Unknown AsyncRefresh.syncAction action type: ${action.type}`);
        }
    }

    /**
     * 执行graph mutate request
     *
     * @param gqlString
     * @param variables
     */
    async authMutateReq(gqlString, variables) {
        const user = this.app.globalData.store.data.user;

        if (!user || !user.token) {
            this.app.globalData.events$.next({
                event: REQ_ACTION.REQ_LOGIN
            });

            // await login to get token
            await new Promise((resolve, reject) => {
                let tempEvent$$;
                tempEvent$$ = this.app.globalData.events$
                    .pipe(
                        rxwx.Rx.operators.filter(e => e.event === REQ_ACTION.USER_LOGIN)
                    )
                    .subscribe((e) => {
                        tempEvent$$.unsubscribe();
                        tempEvent$$ = null;
                        resolve(e);
                    });
                setTimeout(() => {
                    if (tempEvent$$) {
                        tempEvent$$.unsubscribe();
                        reject('timeout in 12s');
                    }
                }, 12000);
            });
        }

        return await authClient.mutate({
            mutation: gqlString,
            variables,
            header: {
                Authorization: `Bearer ${this.app.globalData.store.data.user.token}`
            }
        });
    }

    async authQueryReq(gqlString, variables) {
        const user = this.app.globalData.store.data.user;

        if (!user || !user.token) {
            this.app.globalData.events$.next({
                event: REQ_ACTION.REQ_LOGIN
            });

            // await login to get token
            await new Promise((resolve, reject) => {
                let tempEvent$$;
                tempEvent$$ = this.app.globalData.events$
                    .pipe(
                        rxwx.Rx.operators.filter(e => e.event === REQ_ACTION.USER_LOGIN)
                    )
                    .subscribe((e) => {
                        tempEvent$$.unsubscribe();
                        tempEvent$$ = null;
                        resolve(e);
                    });
                setTimeout(() => {
                    if (tempEvent$$) {
                        tempEvent$$.unsubscribe();
                        reject('timeout in 12s');
                    }
                }, 12000);
            });
        }

        return await authClient.query({
            query: gqlString,
            variables,
            header: {
                Authorization: `Bearer ${this.app.globalData.store.data.user.token}`
            }
        });
    }


    /**
     *  持久化到localstorage
     */
    store() {
        wx.setStorageSync(this.cacheKey, this._cache);
    }

    async newListReq(action) {
        const {id, name, createdAt, gid, taskCount, theme} = action.data;
        const list = {id, name, createdAt, gid, taskCount, theme};

        return await this.authMutateReq(`
                    mutation CreateList($list: ListInput!) {
                        createList(list: $list) {
                          id
                        }
                    }
                    `, {
            list
        });
    }

    async updateListReq(action) {
        const {id, name, createdAt, gid, taskCount, theme} = action.data;
        const list = {id, name, createdAt, gid, taskCount, theme};

        return await this.authMutateReq(`
                    mutation UpdateList($list: ListInput!) {
                        updateList(list: $list) {
                            id
                        }
                    }
                    `, {
            list
        });
    }

    async deleteListReq(action) {
        return await this.authMutateReq(`
                    mutation DeleteList($list: ListInput!) {
                        deleteList(list: $list) {
                            id
                        }
                    }
                    `, {
            list: {
                id: action.data.id
            }
        });
    }

    async newGroupReq(action) {
        const {id, name, createdAt, gid} = action.data;
        const group = {id, name, createdAt, gid};

        return await this.authMutateReq(`
                    mutation CreateGroup($group: GroupInput!) {
                        createGroup(group: $group) {
                          id
                        }
                    }
                    `, {
            group
        });
    }

    async updateGroupReq(action) {
        const {id, name, createdAt, gid} = action.data;
        const group = {id, name, createdAt, gid};

        return await this.authMutateReq(`
                    mutation UpdateGroup($group: GroupInput!) {
                        updateGroup(group: $group) {
                            id
                        }
                    }
                    `, {
            group
        });
    }

    async deleteGroupReq(action) {
        return await this.authMutateReq(`
                    mutation DeleteGroup($group: GroupInput!) {
                        deleteGroup(group: $group) {
                            id
                        }
                    }
                    `, {
            group: {
                id: action.data.id
            }
        });
    }

    async newTaskReq(action) {
        const {id, name, lid, state, type, important, isMyday, steps, expireDay, comment, createdAt, updatedAt, repeat} = action.data;
        const task = {id, name, lid, state, type, important, isMyday, steps, expireDay, comment, createdAt, updatedAt, repeat};
        if (task.hasOwnProperty('lid') && (task.lid === null || task.id === '')) {
            delete task['lid'];
        }

        return await this.authMutateReq(`
                    mutation CreateTask($task: TaskInput!) {
                        createTask(task: $task) {
                          id
                        }
                    }
                    `, {
            task
        });
    }

    async updateTaskReq(action) {
        const {id, name, lid, state, type, important, isMyday, steps, expireDay, comment, createdAt, updatedAt, repeat} = action.data;
        const task = {id, name, lid, state, type, important, isMyday, steps, expireDay, comment, createdAt, updatedAt, repeat};
        if (task.hasOwnProperty('lid') && (task.lid === null || task.id === '')) {
            delete task['lid'];
        }

        return await this.authMutateReq(`
                    mutation UpdateTask($task: TaskInput!) {
                        updateTask(task: $task) {
                            id
                        }
                    }
                    `, {
            task
        });
    }

    async deleteTaskReq(action) {
        return await this.authMutateReq(`
                    mutation DeleteTask($task: TaskInput!) {
                        deleteTask(task: $task) {
                            id
                        }
                    }
                    `, {
            task: {
                id: action.data.id
            }
        });
    }

    async updateUserProfile(action) {
        return await this.authMutateReq(`
                    mutation UpdateUserProfile($profile: UserProfileInput!) {
                        updateUserProfile(profile: $profile)
                    }
                    `, {
            profile: {
                data: {...action.data}
            }
        });
    }

    async syncLists(query) {
        return await this.authQueryReq(`
                    query SyncLists($query: GetListQuery!) {
                        getLists(query: $query) {
                            offset
                            limit
                            count
                            lists{
                                id
                                gid
                                name
                                createdAt
                                taskCount
                                theme{
                                    type
                                    value
                                }
                            }
                            LastEvaluatedKey
                        }
                    }
                    `, {
            query
        });
    }

    async syncTasks(query) {
        return await this.authQueryReq(`
                    query SyncTasks($query: GetTaskQuery!) {
                        getTasks(query: $query) {
                            offset
                            limit
                            count
                            tasks{
                                id
                                name
                                lid
                                state
                                type
                                important
                                isMyday
                                steps{
                                    state
                                    value
                                }
                                expireDay
                                comment
                                createdAt
                                updatedAt
                                repeat
                            }
                            LastEvaluatedKey
                        }
                    }
                    `, {
            query
        });
    }
}


