<template>
  <div class="login-phone-container">
    <div class="login-title">SPURA 博客后台</div>
    <div class="switch-tabs">
      <span
        :class="{ active: isLogin }"
        @click="isLogin = true"
      >登录</span>
      <span
        :class="{ active: !isLogin }"
        @click="isLogin = false"
      >注册</span>
    </div>
    <form
      v-if="isLogin"
      @submit.prevent="loginHandler"
      class="login-form"
    >
      <input
        v-model="loginForm.username"
        type="text"
        placeholder="请输入用户名"
        autocomplete="username"
        required
      />
      <input
        v-model="loginForm.Password"
        type="password"
        placeholder="请输入密码"
        autocomplete="current-password"
        required
      />
      <div class="captcha-row">
        <input
          v-model="loginForm.captcha"
          type="text"
          placeholder="验证码"
          maxlength="6"
          required
        />
        <img
          :src="captchaImg"
          alt="验证码"
          class="captcha-img"
          @click="refreshCaptcha"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
    <form
      v-else
      @submit.prevent="registerHandler"
      class="login-form"
    >
      <input
        v-model="registerForm.name"
        type="text"
        placeholder="请输入账号"
        autocomplete="username"
        required
      />
      <input
        v-model="registerForm.password"
        type="password"
        placeholder="请输入密码"
        autocomplete="new-password"
        required
      />
      <input
        v-model="registerForm.checkPass"
        type="password"
        placeholder="请再次输入密码"
        autocomplete="new-password"
        required
      />
      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>
    </form>
    <div
      class="login-tip"
      v-if="isLogin"
    >请使用账号登录</div>
    <div
      class="login-tip"
      v-else
    >请填写注册信息</div>
    <button
      class="home-btn"
      @click="$router.push('/')"
    >
      返回主页
    </button>
  </div>
</template>

<script>
import { UserLogin, UserReg, UserCaptcha } from '@/api/LoginMa.api';

export default {
  name: "LoginPhone",
  data() {
    return {
      isLogin: true,
      loading: false,
      captchaImg: "",
      loginForm: {
        username: "",
        Password: "",
        captcha: ""
      },
      registerForm: {
        name: "",
        password: "",
        checkPass: ""
      }
    };
  },
  created() {
    this.refreshCaptcha();
  },
  methods: {
    async refreshCaptcha() {
      try {
        const res = await UserCaptcha();
        if (res && res.data && res.data.captcha) {
          const base64Image = res.data.captcha
          this.captchaImg = 'data:image/png;base64,' + base64Image
        }
      } catch (e) {
        this.captchaImg = "";
      }
    },
    async loginHandler() {
      if (!this.loginForm.username || !this.loginForm.Password || !this.loginForm.captcha) {
        alert("请输入用户名、密码和验证码");
        return;
      }
      this.loading = true;
      const params = new URLSearchParams();
      params.append('username', this.loginForm.username);
      params.append('password', this.loginForm.Password);
      params.append('captcha', this.loginForm.captcha);
      try {
        const res = await UserLogin(params);
        this.loading = false;
        if (res.data && res.data.status === 200) {
          sessionStorage.setItem('token', res.data.token);
          this.$message && this.$message.success('登录成功！');
          this.$store && this.$store.commit('updateToken', res.data.token);
          this.$store && this.$store.commit('login', res.data.role);
          this.$store && this.$store.commit('loginMsg', res.data.data);
          this.$router.push({ path: '/Admin-Main' });
        } else {
          this.$message && this.$message.error(res.data.message || "用户名、密码或验证码错误");
          this.refreshCaptcha();
        }
      } catch (e) {
        this.loading = false;
        alert("登录失败，请重试");
        this.refreshCaptcha();
      }
    },
    async registerHandler() {
      if (!this.registerForm.name || !this.registerForm.password || !this.registerForm.checkPass) {
        alert("请填写完整信息和验证码");
        return;
      }
      if (this.registerForm.password !== this.registerForm.checkPass) {
        alert("两次密码不一致");
        return;
      }
      this.loading = true;
      try {
        const addUserform = {
          username: this.registerForm.name,
          password: this.registerForm.password
        };
        const res = await UserReg(addUserform);
        this.loading = false;
        if (res.status === 200) {
          this.$message && this.$message.success('新用户创建成功!');
          this.isLogin = true;
          // 清空注册表单
          this.registerForm.name = "";
          this.registerForm.password = "";
          this.registerForm.checkPass = "";
        } else {
          this.$message && this.$message.error(res.data?.message || '新用户创建失败!');
          this.refreshCaptcha();
        }
      } catch (e) {
        this.loading = false;
        alert("注册失败，请重试");
        this.refreshCaptcha();
      }
    }
  }
};
</script>

<style scoped>
.login-phone-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f6fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}
.login-title {
  display: flex;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #409eff;
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
}
.switch-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
  gap: 32px;
}
.switch-tabs span {
  background: linear-gradient(90deg, #cecece 60%, #e7e7e7 100%);
  font-size: 18px;
  color: #888;
  padding: 6px 28px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.04);
  width: 150px;
}
.switch-tabs .active {
  background: linear-gradient(90deg, #409eff 60%, #66b1ff 100%);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
  width: 150px;
}
.login-form {
  width: 92vw;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  padding: 36px 22px 28px 22px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.6s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.login-form input {
  height: 46px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 17px;
  outline: none;
  background: #f8faff;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.03);
}
.login-form input:focus {
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}
.captcha-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.captcha-row input {
  flex: 1;
}
.captcha-img {
  height: 40px;
  width: 90px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #f8f8f8;
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.04);
  transition: box-shadow 0.2s;
}
.captcha-img:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
}
.login-form button {
  height: 46px;
  background: linear-gradient(90deg, #409eff 60%, #66b1ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  letter-spacing: 2px;
}
.login-form button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
  box-shadow: none;
}
.login-tip {
  margin-top: 28px;
  color: #888;
  font-size: 15px;
  text-align: center;
  letter-spacing: 1px;
}
.home-btn {
  width: 120px;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #409eff;
  background: transparent;
  border: 2px solid #409eff;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-align: center;
}
.home-btn:hover {
  background: #409eff;
  color: #fff;
}
</style>