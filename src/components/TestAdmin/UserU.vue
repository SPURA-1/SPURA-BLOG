<template >
  <div id="user">
    <div class="userComponent">
      <div class="userHead">
        <p>ID</p>
        <p>nickName</p>
        <p>Phone</p>
        <p>Email</p>
        <p>BLOG-Num</p>
        <p>Delete</p>
      </div>
      <ul class="userItems">
        <li
          class="user_item"
          v-cloak
          v-for="(user, index) in userList"
          :key="index"
        >
          <p>{{ user.id }}</p>
          <p>{{ user.nick_name }}</p>
          <p>{{ user.phone }}</p>
          <p>{{ user.email ? user.email : "Null" }}</p>
          <p>{{ user.blog_num }}</p>
          <p class="del" @click="deleteUser(user.id, index)">删除</p>
        </li>
      </ul>
      <div class="page">
        <p @click="previous">上一页</p>
        <p v-cloak>当前页 {{ nowPage }}</p>
        <p @click="next">下一页</p>
        <p v-cloak>共 {{ allPages }} 页</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      onePageNum: "", // 一个页面可以展示的数据的数量
      userList: [], // 用户数据列表
      allPages: "", // 所有页数，根据总记录数和onePageNum计算
      nowPage: 1,
    };
  },
  mounted: function () {
    // 挂载组件时，添加now类，用于控制文字的样式
    var userText = document.getElementById("userText");
    userText.classList.add("now");

    // 检测是否登录
    var verify = localStorage.getItem("verify");
    if (!verify) {
      swal({
        title: "未登录，请先登录",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(function (willDelete) {
        window.location.href = "/adminLogin";
      });
      return;
    }

    // 获取div的高度，来决定一页渲染多少个数据
    this.onePageNum = parseInt(
      document.querySelector(".userItems").clientHeight / 38
    );

    // 发送请求，获取到第一页的数据
    var that = this;
    axios
      .post("/admin/userData", {
        page: 1,
        num: that.onePageNum, // 一页可以展示多少条数据
      })
      .then(function (response) {
        that.userList = response.data.users;
        that.allPages = Math.ceil(response.data.usersNum / that.onePageNum);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  destroyed: function () {
    // 销毁组件时，移除now类
    var userText = document.getElementById("userText");
    userText.classList.remove("now");
  },
  methods: {
    // 点击上一页
    previous: function () {
      if (this.nowPage == 1) {
        swal({
          title: "没有上一页啦！",
          icon: "info",
          button: false,
          timer: 800,
        });
        return;
      }
      this.nowPage = this.nowPage - 1;
      var that = this;
      axios
        .post("/admin/userData", {
          page: that.nowPage,
          num: that.onePageNum, // 一页可以展示多少条数据
        })
        .then(function (response) {
          that.userList = response.data.users;
          that.allPages = Math.ceil(response.data.usersNum / that.onePageNum);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 点击下一页
    next: function () {
      if (this.nowPage == this.allPages) {
        swal({
          title: "没有下一页啦！",
          icon: "info",
          button: false,
          timer: 800,
        });
        return;
      }
      this.nowPage = this.nowPage + 1;
      var that = this;
      axios
        .post("/admin/userData", {
          page: that.nowPage,
          num: that.onePageNum, // 一页可以展示多少条数据
        })
        .then(function (response) {
          that.userList = response.data.users;
          that.allPages = Math.ceil(response.data.usersNum / that.onePageNum);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteUser: function (userID, index) {
      var that = this;
      swal({
        title: "确认删除？",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(function (willDelete) {
        if (willDelete) {
          axios
            .post("/admin/deleteUser", {
              user_id: userID,
            })
            .then(function (response) {
              if (response.data.status) {
                that.userList.splice(index, 1);
                swal({
                  title: "删除成功",
                  icon: "info",
                  button: false,
                  timer: 800,
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
  },
}

</script>

<style scoped>


</style>
