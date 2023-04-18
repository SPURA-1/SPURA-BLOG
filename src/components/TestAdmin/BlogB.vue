<!-- eslint-disable vue/multi-word-component-names -->
<template id="blog">
  <div class="blogComponent">
    <div class="blogHead">
      <p>ID</p>
      <p>UserID</p>
      <p>Title</p>
      <p>Content</p>
      <p>KeyWords</p>
      <p>Number</p>
      <p>Delete</p>
    </div>
    <ul class="blogItems">
      <li
        class="blog_item"
        v-cloak
        v-for="(blog, index) in blogList"
        :key="index"
      >
        <p v-cloak>{{ blog.id }}</p>
        <p v-cloak>{{ blog.user_id }}</p>
        <p v-cloak>{{ blog.title }}</p>
        <p v-cloak>{{ blog.content }}</p>
        <p v-cloak>{{ blog.keywords }}</p>
        <p v-cloak>{{ blog.collection_num }}</p>
        <p v-cloak class="del" @click="deleteBlog(blog.id, index)">删除</p>
      </li>
    </ul>
    <div class="page">
      <p @click="previous">上一页</p>
      <p v-cloak>当前页 {{ nowPage }}</p>
      <p @click="next">下一页</p>
      <p v-cloak>共 {{ allPages }} 页</p>
    </div>
  </div>
</template>


<script>
export default {
  data: function () {
    return {
      onePageNum: "", // 一个页面可以展示的数据的数量
      blogList: [], // 用户数据列表
      allPages: "", // 所有页数，根据总记录数和onePageNum计算
      nowPage: 1,
    };
  },
  mounted: function () {
    // 挂载组件时，添加now类，用于控制文字的样式
    var blogText = document.getElementById("blogText");
    blogText.classList.add("now");

    // 获取div的高度，来决定一页渲染多少个数据
    this.onePageNum = parseInt(
      document.querySelector(".blogItems").clientHeight / 38
    );

    // 发送请求，获取到第一页的数据
    var that = this;
    axios
      .post("/admin/blogData", {
        page: 1,
        num: that.onePageNum, // 一页可以展示多少条数据
      })
      .then(function (response) {
        for (var i = 0; i < response.data.blogs.length; i++) {
          if (response.data.blogs[i].content.length > 8) {
            response.data.blogs[i].content =
              response.data.blogs[i].content.substr(0, 8) + "...";
          }
          if (response.data.blogs[i].keywords.length > 8) {
            response.data.blogs[i].keywords =
              response.data.blogs[i].keywords.substr(0, 8) + "...";
          }
          if (response.data.blogs[i].title.length > 8) {
            response.data.blogs[i].title =
              response.data.blogs[i].content.substr(0, 8) + "...";
          }
        }
        that.blogList = response.data.blogs;
        that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  destroyed: function () {
    // 销毁组件时，移除now类
    var blogText = document.getElementById("blogText");
    blogText.classList.remove("now");
  },
  methods: {
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
        .post("/admin/blogData", {
          page: that.nowPage,
          num: that.onePageNum, // 一页可以展示多少条数据
        })
        .then(function (response) {
          for (var i = 0; i < response.data.blogs.length; i++) {
            if (response.data.blogs[i].content.length > 8) {
              response.data.blogs[i].content =
                response.data.blogs[i].content.substr(0, 8) + "...";
            }
            if (response.data.blogs[i].keywords.length > 8) {
              response.data.blogs[i].keywords =
                response.data.blogs[i].keywords.substr(0, 8) + "...";
            }
            if (response.data.blogs[i].title.length > 8) {
              response.data.blogs[i].title =
                response.data.blogs[i].content.substr(0, 8) + "...";
            }
          }
          that.blogList = response.data.blogs;
          that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
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
        .post("/admin/blogData", {
          page: that.nowPage,
          num: that.onePageNum, // 一页可以展示多少条数据
        })
        .then(function (response) {
          for (var i = 0; i < response.data.blogs.length; i++) {
            if (response.data.blogs[i].content.length > 8) {
              response.data.blogs[i].content =
                response.data.blogs[i].content.substr(0, 8) + "...";
            }
            if (response.data.blogs[i].keywords.length > 8) {
              response.data.blogs[i].keywords =
                response.data.blogs[i].keywords.substr(0, 8) + "...";
            }
            if (response.data.blogs[i].title.length > 8) {
              response.data.blogs[i].title =
                response.data.blogs[i].content.substr(0, 8) + "...";
            }
          }
          that.blogList = response.data.blogs;
          that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 删除博客
    deleteBlog: function (blogID, index) {
      var that = this;
      swal({
        title: "确认删除？",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(function (willDelete) {
        if (willDelete) {
          axios
            .post("/admin/deleteBlog", {
              blog_id: blogID,
            })
            .then(function (response) {
              if (response.data.status) {
                that.blogList.splice(index, 1);
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
