# WeTodos wechat mini program 




## 开发环境配置

   * webstorm 开发，小程序官方ide实在难用
   * webstorm 小程序开发插件安装： [Wxapp](https://www.jianshu.com/p/a436b4f9e4ed)
   * 使用scss 开发： [Scss](https://blog.csdn.net/ktutu/article/details/78783008)
   * 状态管理：[Westore](https://github.com/Tencent/westore)
   
## 小程序参考资料
   * 权限授权处理：[土家胖哥](https://juejin.im/post/5cfa0013e51d4558936aa047)   
   * 白嫖图床: [聚合图床](https://www.superbed.cn/)

## 遇到的问题
   * dynamodb error: Invalid attribute value type   
     这个出现在dynamodb table 有个index field, 但index field 的类型(type)可能是HASH, 
     在更新时的数据里可能传入""空字符串导致的
