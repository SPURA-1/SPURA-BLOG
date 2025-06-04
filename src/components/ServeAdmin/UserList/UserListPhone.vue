<template>
  <div class="user-list-phone">
    <button
      class="back-btn"
      @click="$router.push('/AdminHome')"
    >
      返回
    </button>
    <div class="user-list-header">
      <span class="user-list-title">用户列表</span>
    </div>
    <div
      v-for="user in userList"
      :key="user.id"
      class="user-card"
    >
      <div class="user-avatar-wrap">
        <img
          v-if="user.user_pic"
          :src="ImageUrl + user.user_pic"
          class="user-avatar"
          alt="头像"
        />
        <div
          v-else
          class="user-avatar user-avatar-placeholder"
        >无头像</div>
      </div>
      <div class="user-info">
        <div class="user-name">{{ user.username }}</div>
        <div class="user-nickname">昵称：{{ user.nickname || '无' }}</div>
        <div class="user-role">权限：<span :style="{ color: user.user_role === '管理员' ? '#00cc00' : '' }">{{ user.user_role }}</span></div>
        <div class="user-email">邮箱：{{ user.email || '无' }}</div>
        <div class="user-status">
          状态：
          <span :class="user.mg_state === 1 ? 'on' : 'off'">
            {{ user.mg_state === 1 ? '启用' : '禁用' }}
          </span>
        </div>
      </div>
      <div class="user-switch">
        <el-switch
          v-model="user.mg_state"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleSwitch(user)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getUserMsg, userUpdstatus } from '@/api/UserInfo.api'
import { mapGetters } from 'vuex'
export default {
  name: 'UserListPhone',
  computed: {
    ...mapGetters(['userRole'])
  },
  data() {
    return {
      userList: [],
      ImageUrl: this.$store?.state?.ImageUrl || '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUserMsg({ pagenum: 1, pagesize: 20 }).then(res => {
        if (res.data && res.data.status === 200) {
          this.userList = res.data.data.users.map(item => ({
            id: item.id,
            username: item.username,
            email: item.email,
            user_pic: item.user_pic,
            nickname: item.nickname,
            mg_state: item.mg_state,
            user_role: item.user_role === 1 ? '管理员' : '用户'
          }))
        }
      })
    },
    handleSwitch(user) {
      if (this.userRole !== 1) {
        this.$message.error('当前账号没有权限！')
        // 恢复原状态
        user.mg_state = user.mg_state === 1 ? 0 : 1
        return
      }
      // 管理员可操作
      userUpdstatus({
        status: user.mg_state,
        userId: user.id
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('状态更新成功')
        } else {
          this.$message.error('状态更新失败')
        }
      }).catch(() => {
        this.$message.error('状态更新失败')
      })
    }
  }
}
</script>

<style scoped>
.user-list-phone {
  padding: 18px 8px 32px 8px;
  background: #f5f6fa;
  min-height: 100vh;
}
.user-list-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
.back-btn {
  display: flex;
  background: none;
  border: none;
  color: #409eff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #e0e7ff;
}
.user-list-title {
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  letter-spacing: 2px;
}
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 内容和switch分两端 */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.06);
  padding: 14px 12px;
  margin-bottom: 16px;
  gap: 14px;
  position: relative;
}
.user-avatar-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
  background: #f8f8f8;
  display: block;
}
.user-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #bbb;
  font-size: 14px;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  text-align: center;
}
.user-info {
  flex: 1 1 auto;
  font-size: 15px;
  color: #333;
  min-width: 0;
}
.user-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 2px;
}
.user-nickname,
.user-role,
.user-email,
.user-status {
  margin-bottom: 2px;
  color: #666;
}
.user-status .on {
  color: #13ce66;
  font-weight: bold;
}
.user-status .off {
  color: #ff4949;
  font-weight: bold;
}
.user-switch {
  min-width: 56px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
}
</style>