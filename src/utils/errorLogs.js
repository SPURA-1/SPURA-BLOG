// 导入Vue和Vuex的store实例
import Vue from 'vue';
import store from '@/store';

// 导入用于判断数据类型的工具函数
import { isArray, isString } from '@/utils/validate';

// 导入设置配置文件
import setting from '@/config/setting.config';

// 从配置文件中获取是否需要记录错误日志的配置
const needErrorLog = setting.errorLog;
// 定义一个函数用于检查是否需要记录错误日志
const checkNeed = () => {
    // 获取当前环境
    const env = process.env.NODE_ENV;

    // 根据配置判断是否需要记录错误日志
    if (isString(needErrorLog)) {
        return env === needErrorLog;
    }

    if (isArray(needErrorLog)) {
        return needErrorLog.includes(env);
    }

    return false;
};

// 检查是否需要记录错误日志
if (checkNeed()) {
    // 配置Vue的全局错误处理器
    Vue.config.errorHandler = (err, vm, info) => {
        // 在控制台输出错误信息、组件实例和其他信息
        console.error('错误拦截:', err, vm, info);

        // 获取当前页面的URL
        const url = window.location.href;
        // 在下一个Tick时，调用Vuex中的action，将错误信息记录到errorLog模块中
        Vue.nextTick(() => {
            store.dispatch('addErrorLog', { err, vm, info, url });
        });
    };
}
