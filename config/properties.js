
// 请求动作
const REQ_ACTION = Object.freeze({
    APP_ON_LOADING: 'app_on_loading',
    NEW_TASK: 'new_task',
    UPDATE_TASK: 'update_task',
    DELETE_TASK: 'delete_task',
    NEW_GROUP: 'new_group',
    UPDATE_GROUP: 'update_group',
    DELETE_GROUP: 'delete_group',
    NEW_LIST: 'new_list',
    UPDATE_LIST: 'update_list',
    DELETE_LIST: 'delete_list',
    USER_LOGIN: 'user_login',
    REQ_LOGIN: 'req_login',
    WX_USER_PROFILE_UPDATE: 'wx_user_profile_update',
    UPDATE_USER_PROFILE: 'update_user_profile',
    SYNC_LISTS: 'sync_lists',
    SYNC_LISTS_AGAIN: 'sync_lists_again',
    SYNC_LISTS_FINISHED: 'sync_lists_finished',
    SYNC_TASKS: 'sync_tasks',
    SYNC_TASKS_AGAIN: 'sync_tasks_again',
    SYNC_TASKS_FINISHED: 'sync_tasks_finished',
    SYNC: 'sync', // sync actions to remote graphql server
    PLAY_SOUND: 'play_sound'
});

module.exports = {
    REQ_ACTION,
}
