import Vue from 'vue'
import store from '../store/index'
/**权限指令**/
const has = Vue.directive('has', {
    // 打印el.parentNode发现竟然是null
    // 原因在于钩子函数 inserted：被绑定元素插入父节点时调用
    inserted: function (el, binding, vnode) {
        // 获取页面按钮权限
        let btnPermissionsArr = [];
        if (binding.value) {
            // 如果指令传值，获取指令参数，根据指令参数和当前登录人按钮权限做比较。
            btnPermissionsArr = Array.of(binding.value);
        } else {
            // 否则获取路由中的参数，根据路由的btnPermissionsArr和当前登录人按钮权限做比较。
            btnPermissionsArr = vnode.context.$route.meta.btnPermissions;
        }
        // 在删除元素之前添加检查

        if (!Vue.prototype.$_has(btnPermissionsArr)) {
            el.parentNode.removeChild(el);  // 删除元素
            // el.style.display = 'none';   // 隐藏元素
        }

    }
});
// 权限检查方法
Vue.prototype.$_has = function (value) {
    let isExist = false;
    // 获取用户按钮权限
    // let btnPermissionsStr = sessionStorage.getItem("btnPermissions");
    // 从 Vuex 中获取用户按钮权限
    let btnPermissionsList = [];
    const btnPermissionsArr = store.state.userRole;
    btnPermissionsList = Array.of(btnPermissionsArr);

    if (!btnPermissionsList || !Array.isArray(btnPermissionsList) || btnPermissionsList.length === 0) {
        return false;
    }

    const arrayAsString = value[0];

    // 如果传递了权限值，检查是否在用户权限数组中
    if (arrayAsString && btnPermissionsList.includes(arrayAsString)) {
        isExist = true;
    }

    return isExist;
};
export { has }