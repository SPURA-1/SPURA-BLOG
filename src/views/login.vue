
<template>
  <!-- 登录注册页面 -->
  <div class="login-register-container">
    <div class="box">
      <div class="left" v-show="left_show">
        <div>
          <p>Welcome</p>
          <p>Spura后台系统</p>
        </div>
        <el-button class="button" round size="small" @click="toRegister(), play()">去注册</el-button>
      </div>
      <div class="right" v-show="right_show">
        <div>
          <p>Welcome</p>
          <p>Spura后台系统</p>
        </div>
        <el-button class="button" round size="small" @click="toLogin(), play()">去登录</el-button>
      </div>
    </div>

    <!-- elementUI 表单组件 -->
    <div class="form-box" :class="{ move: isMove, back: isBack, newPosition: isNew }" :style="{ left: nowLeft + '%' }">
      <transition name="el-fade-in">
        <el-form :model="loginForm" status-icon :rules="Rules" ref="loginForm" label-width="100px" class="demo-ruleForm" size="small" @keyup.enter.native="loginHeadler">
          <!-- ⬆ keyup 监视键盘的键抬起来的事件，限定范围 回车 按键，native是原生事件-->

          <!-- 登录 -->
          <div class="right-form" v-show="login_show">
            <el-form-item label="账 号" prop="username">
              <el-input ref="inputUsername" type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="密 码" prop="Password">
              <el-input type="password" v-model="loginForm.Password" autocomplete="off" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <!-- @click="loginHeadler()" -->
              <!-- @click="$router.push('/login')" -->
              <el-button type="primary" @click="loginHeadler" size="small" round>登录</el-button>
            </el-form-item>
          </div>
        </el-form>
      </transition>

      <!-- elementUI 表单组件 -->
      <transition name="el-fade-in">
        <el-form :model="registerForm" status-icon :rules="Rules" ref="registerForm" label-width="100px" class="demo-ruleForm2" size="small" @keyup.enter.native="handleThrottledStatusChange">
          <!-- 注册 -->
          <div class="left-form" v-show="!login_show">
            <el-form-item label="账 号" prop="name">
              <el-input ref="inputName" type="text" v-model="registerForm.name" autocomplete="off" placeholder="请输入账号" clearable></el-input>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input ref="registerPass" type="password" v-model="registerForm.password" autocomplete="off" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="registerForm.checkPass" autocomplete="off" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" round @click="handleThrottledStatusChange">注册</el-button>
            </el-form-item>
          </div>
        </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
import { UserLogin, UserReg } from '@/api/LoginMa.api';
export default {
  name: "LoginAndRegisterView",
  data() {
    // 确认密码校验器(以后加强)
    // const comfirmPassword = (rule, value, callback) => {};
    // 密码强度校验器(以后加强)
    // const passwordValidator = (rule, value, callback) => {};
    return {
      left_show: true,
      right_show: false,
      login_show: true,
      isMove: false,
      isBack: false,
      isNew: false,
      timer1: null,
      timer2: null,
      timer3: null,
      // 初始页面为true，变成flase
      movable: true,
      nowLeft: 50,
      registerForm: {
        name: "",
        password: "",
        checkPass: "",
      },
      loginForm: {
        username: "",
        Password: "",
      },
      Rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: ("用户名必须是1-10的字母数字"),
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
        ],
        checkPass: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
          // 自定义校验规则---validator,校验规则函数在data中定义
          { validator: this.samePwd, trigger: "blur" },
        ],
      },
      // 节流
      lastUpdateTimestamp: 0, //上次点击时间
      throttleInterval: 2000, // 节流时间间隔，单位：毫秒
    };
  },
  computed: {},
  methods: {
    // 自定义校验规则
    // 参数: rule : 基础校验规则
    // value: 绑定该自定义验证规则的属性值
    // callback: 该自定义验证的回调，必须调用
    samePwd(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次密码不一致!'));
      } else {
        callback();
      }
    },
    // 跳转至注册按钮
    toRegister() {
      if (this.movable) {
        // 控制当前表单元素，并重置动画
        this.timer1 = setTimeout(() => {
          this.left_show = false;
          clearTimeout(this.timer1);
          this.timer1 = null;
          this.movable = true;
          // 背景图片的控制
          this.isNew = true;
          // 获取输入框焦点
          this.$refs.inputName.focus();
          this.reset();
        }, 700);
        // 右侧注册界面的显示
        this.timer2 = setTimeout(() => {
          this.right_show = true;
          clearTimeout(this.timer2);
          this.timer2 = null;
        }, 240);
        // 隐藏另一部分，并将原表单值清空
        this.timer3 = setTimeout(() => {
          this.login_show = false;
          this.loginForm.username = "";
          this.loginForm.Password = "";
          clearTimeout(this.timer3);
          this.timer3 = null;
        }, 350);
      }
    },
    // 跳转至登录
    toLogin() {
      if (this.movable) {
        // 控制当前表单元素，并重置动画
        // isNew 设置为false 背景图片不会再次改变
        this.isNew = false;
        this.timer1 = setTimeout(() => {
          this.right_show = false;
          clearTimeout(this.timer1);
          this.timer1 = null;
          this.movable = true;
          // 获取输入框焦点
          this.$refs.inputUsername.focus();
          this.reset();
        }, 700);
        // 左侧注册界面的显示
        this.timer2 = setTimeout(() => {
          this.left_show = true;
          clearTimeout(this.timer2);
          this.timer2 = null;
        }, 240);
        // 隐藏另一部分，并将原表单值清空
        this.timer3 = setTimeout(() => {
          this.login_show = true;
          this.registerForm.name = "";
          this.registerForm.password = "";
          this.registerForm.checkPass = "";
          clearTimeout(this.timer3);
          this.timer3 = null;
        }, 350);
      }
    },
    // 播放动画
    // 动态添加类名给盒子，从而实现盒子的左右滑动效果。
    // 播放动画是添加isMove类名或者isBack类名，
    // 这个通过当前盒子的位置进行判断需要添加哪一个类名。
    // 当动画结束之后通过定时器调用reset()方法重置动画（即去掉相应的类名）
    play() {
      if (this.movable) {
        this.movable = false;
        if (this.nowLeft === 50) {
          this.isMove = true;
        } else {
          this.isBack = true;
        }
      }
    },
    // 动画重置
    reset() {
      if (this.nowLeft === 50) {
        this.isMove = false;
        this.nowLeft = 25;
      } else {
        this.isBack = false;
        this.nowLeft = 50;
      }
    },
    // 登录的 AXIOS 
    loginHeadler() {
      // 获取键盘输入的账号密码
      const Uid = this.loginForm.username
      const Pid = this.loginForm.Password
      const params = new URLSearchParams();
      params.append('username', Uid);
      params.append('password', Pid);
      UserLogin(params)
        .then((res) => {
          // console.log(res.data);
          // console.log(res)
          if (res.data.status === 200) {
            // 将用户token保存到session中
            sessionStorage.setItem('token', res.data.token);
            this.$message.success('登录成功！')
            // 把 token 记录到 vuex 中
            this.$store.commit('updateToken', res.data.token)
            this.$store.commit('login', res.data.role)
            this.$store.commit('loginMsg', res.data.data)
            // 登录成功后的跳转
            this.$router.push({ path: '/Admin-Main' });
          } else {
            this.$message.error("账号或密码错误");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 节流
    handleThrottledStatusChange() {
      const currentTime = Date.now(); // 获取当前时间戳
      // 检查当前时间与上次更新时间的间隔是否超过节流时间间隔
      if (currentTime - this.lastUpdateTimestamp >= this.throttleInterval) {
        this.wecomeNewUser(); // 执行实际的状态更新逻辑
        this.lastUpdateTimestamp = currentTime; // 更新上次更新时间戳
      }
    },
    // 注册
    wecomeNewUser() {
      // 手动触发表单验证
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const addUserform = {
            username: this.registerForm.name,
            password: this.registerForm.password
          }
          UserReg(addUserform)
            .then(res => {
              if (res.status === 200) {
                this.$message.success('新用户创建成功!')
                // 注册完成后 动画移动到登录
                this.toLogin(), this.play()
              } else {
                console.log('报错');
                this.$message.error('新用户创建失败!')
              }
            })
            .catch(err => {
              console.log(err, 'AXIOS报错');
              this.$message.error('新用户创建失败!')
            })
        } else {
          // 表单验证未通过，显示错误提示
          this.$message.error('请检查表单项的输入！');
        }
      });
    },
  },
  mounted() {
    //获取登录表单账号input焦点
    this.$refs.inputUsername.focus();
  },
};
</script>

<style lang="less" scoped>
.login-register-container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/background.jpg") no-repeat;
  background-size: 100% 100%;
  position: relative;
  color: black;
  .box {
    position: fixed;
    width: 800px;
    height: 480px;
    top: 50%;
    left: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: translate(-50%, -50%);
    border-radius: 24px;
    box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.4);
    .left,
    .right {
      position: absolute;
      height: 100%;
      top: 50%;
      p {
        font-size: 24px;
      }
      div {
        transform: translate(0, 180px);
      }
      .button {
        transform: translateY(320px);
      }
    }
    .left {
      left: 25%;
      transform: translate(-50%, -50%);
    }
    .right {
      right: 25%;
      transform: translate(50%, -50%);
    }
  }
  .form-box {
    position: absolute;
    top: 50%;
    left: 49%;
    height: 560px;
    width: 360px;
    background: url("@/assets/background.jpg") no-repeat -830px center;
    border-radius: 20px;
    transform: translate(18%, -50%);
    box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.4);
    z-index: 2;
    .demo-ruleForm {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .demo-ruleForm2 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  // 通过background属性设置盒子背景图片的位置移动，
  // 以及盒子位置的移动，从而实现丝滑的盒子加背景移动效果。
  // 通过move和back两个类分别调用相应的动画。实现从左到右和从右到左两种效果。
  @keyframes move {
    0% {
      left: 50%;
      background: url("@/assets/background.jpg") no-repeat -830px center;
    }
    100% {
      left: 25%;
      background: url("@/assets/background.jpg") no-repeat -280px center;
    }
  }
  @keyframes back {
    0% {
      left: 25%;
      background: url("@/assets/background.jpg") no-repeat -280px center;
    }
    100% {
      left: 50%;
      background: url("@/assets/background.jpg") no-repeat -830px center;
    }
  }
  .move {
    animation: move 0.7s ease-in-out 1 alternate forwards;
  }
  .back {
    animation: back 0.7s ease-in-out 1 alternate forwards;
  }
  // 由于动画结束后将会去掉类名，所以盒子会出现瞬间跳到原始位置的问题，
  // 此时需要加上这个新的类，才能实现让盒子处于左侧
  //（默认原始位置在右侧，如果需要修改动画后的位置，记得修改这个类的属性值）
  .newPosition {
    background: url("@/assets/background.jpg") no-repeat -280px center !important;
  }
  .myInput {
    width: 180px;
  }
}
</style>