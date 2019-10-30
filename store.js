export default {
    data: {
        user: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        logs: [],

        defaultListTheme: {
            type: 'color',
            value: '#0099CC'
        },
        userProfile2: {
            importantList: {
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                },
                finishedTaskVisible: true,
            },
            mydayList: {
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                },
                finishedTaskVisible: true,
            },
            planList: {
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                },
                finishedTaskVisible: true,
            },
            ownerlessTasks: {
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                },
                finishedTaskVisible: true,
            }
        },
        userProfile: {},
        infos: {
            lists: [],
            tasks: []
        },
        infos2: {
            lists: [{
                id: 'list-001',
                gid: 'group-001', // group id, 如果不属于任何一个group, 将其标识为none
                name: 'TODO 小程序开发',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 1,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                },
            },{
                id: 'list-002',
                gid: 'group-001',
                name: 'NUC mini 电脑修理',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'list-003',
                gid: 'group-002',
                name: 'Graphql 复习总结',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'list-004',
                gid: 'group-002',
                name: 'Serverless 探索',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'list-005',
                gid: 'group-003',
                name: '老家房屋装修事宜',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'list-006',
                gid: 'group-003',
                name: '爸妈健康监控',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'list-007',
                gid: 'none',
                name: '面试稳工',
                createdAt: '2019-09-29T14:09:06.070Z',
                taskCount: 0,
                theme: {
                    type: 'color', // enum, color/image
                    value: '#3388ff'
                }
            },{
                id: 'group-001',
                gid: 'group', // group id, 如果不属于任何一个group, 将其标识为none
                name: '工作',
                createdAt: '2019-09-29T14:09:06.070Z',
            },{
                id: 'group-002',
                gid: 'group',
                name: '学习',
                createdAt: '2019-09-29T14:09:06.070Z',
            },{
                id: 'group-003',
                gid: 'group',
                name: '家庭',
                createdAt: '2019-09-29T14:09:06.070Z',
            }],
            tasks: [{
                id: 'task-001',
                lid: 'list-007', // group id
                name: '更新一份简历PDF',
                state: 'pending', // enum, pending/finished
                type: '',
                important: true,
                steps: [],
                // expireDay: 20191029,
                expireDay: 0,
                isMyday: false,
                comment: 'task-comment',
                createdAt: '2019-09-29T14:09:06.070Z',
                updatedAt: '2019-09-29T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-002',
                lid: 'list-007', // group id
                name: '抽两天时间复习面试知识点',
                state: 'pending', // enum, pending/finished
                type: '',
                important: true,
                isMyday: true,
                steps: [{
                    state: 'pending',
                    value: 'Node.js'
                }, {
                    state: 'pending',
                    value: 'Graphql'
                }, {
                    state: 'pending',
                    value: 'Database'
                }, {
                    state: 'pending',
                    value: 'System architecture'
                }, {
                    state: 'pending',
                    value: 'Frontend vue/angular, and base knowledge sets'
                }],
                expireDay: 20191002,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-003',
                lid: 'list-007', // group id
                name: '在招聘市场上寻找符合目标的公司',
                state: 'pending', // enum, pending/finished
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 20191025,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-004',
                lid: 'list-001',
                name: '更新后台Aws Serverless service repo',
                state: 'pending',
                type: '',
                important: true,
                isMyday: true,
                steps: [],
                expireDay: 20191025,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-005',
                lid: 'list-001',
                name: '集成GraphQL, 连接后台',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 20191025,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-006',
                lid: 'list-001',
                name: '上线小程序去测试用户授权连接功能',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 20191025,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-007',
                lid: 'list-002',
                name: '联系NUC 客服解决USB口不能正常使用的问题',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-008',
                lid: 'list-003',
                name: '在Notion上总结一份GraphQL的知识点',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-009',
                lid: 'list-004',
                name: '开通AWS Cloud账号',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-010',
                lid: 'list-004',
                name: 'serverless 自动化deploy',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-011',
                lid: 'list-004',
                name: 'Aws lambda S3探索',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-012',
                lid: 'list-006',
                name: '抽时间回去陪爸妈到高州人民医院做次健康检查',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 20191228,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-013',
                lid: 'list-006',
                name: '做个简易的小工具收集、分析、监控家人的健康数据',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 2020428,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-014',
                lid: 'list-005',
                name: '确定设计方案',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [],
                expireDay: 20191228,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            },{
                id: 'task-015',
                lid: 'list-002',
                name: '搭建本地服务器',
                state: 'pending',
                type: '',
                important: true,
                isMyday: false,
                steps: [{
                    state: 'pending',
                    value: '在henri家有public ip的光纤'
                }],
                expireDay: 0,
                comment: '',
                createdAt: '2019-10-08T14:09:06.070Z',
                updatedAt: '2019-10-08T14:09:06.070Z',
                repeat: '',
            }],
        },
        themes: {
            selected: {
                type: 'color', // color or picture,
                index: 0,
            },
            colors: [{
                value: '#996699',
            }, {
                value: '#0099CC'
            }, {
                value: '#FF6666'
            }, {
                value: '#003366'
            }, {
                value: '#663366'
            }, {
                value: '#0066CC'
            }, {
                value: '#993333'
            }, {
                value: '#CC0033'
            }, {
                value: '#333399'
            }, {
                value: '#003399'
            }, {
                value: '#99CC00'
            }, {
                value: '#9933FF'
            }, {
                value: '#6666CC'
            }, {
                value: '#339933'
            }, {
                value: '#009966'
            }, {
                value: '#336699'
            }, {
                value: '#3399CC'
            }, {
                value: '#FF33CC'
            }],

            pictures: [{
                value: 'https://i.ibb.co/JKm36cW/forest-4507031-640.jpg',
            },{
                value: 'https://i.ibb.co/5RGDxSR/fox-4505465-640.jpg',
            },{
                value: 'https://i.ibb.co/Z1DMkbh/landscape-4487659-640.jpg',
            },{
                value: 'https://i.ibb.co/kcXM24z/milky-way-4416194-640.jpg',
            },{
                value: 'https://i.ibb.co/b2c6x4T/milky-way-4484593-640.jpg',
            },{
                value: 'https://i.ibb.co/k468VM6/milky-way-4500469-640.jpg',
            },{
                value: 'https://i.ibb.co/bP6wgtN/moon-4498253-640.jpg',
            },{
                value: 'https://i.ibb.co/BybNqBw/sailing-boat-4060710-640.jpg',
            }]
        },
    },
}
