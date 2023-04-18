    
    Vue.component('blog', {
        template:"#blog",
        data:function(){
            return {
                onePageNum:"", // 一个页面可以展示的数据的数量
                blogList:[], // 用户数据列表
                allPages:"", // 所有页数，根据总记录数和onePageNum计算
                nowPage: 1,
            }
        },
        mounted: function() {
            // 挂载组件时，添加now类，用于控制文字的样式
            var blogText = document.getElementById("blogText");
            blogText.classList.add("now");

            // 获取div的高度，来决定一页渲染多少个数据
            this.onePageNum = parseInt(document.querySelector(".blogItems").clientHeight / 38);

            // 发送请求，获取到第一页的数据
            var that = this;
            axios.post("/admin/blogData", {
                page: 1,
                num: that.onePageNum // 一页可以展示多少条数据
            })
            .then(function(response){
                for(var i=0; i<response.data.blogs.length; i++){
                    if(response.data.blogs[i].content.length > 8){
                        response.data.blogs[i].content = response.data.blogs[i].content.substr(0, 8) + "...";
                    }
                    if(response.data.blogs[i].keywords.length > 8){
                        response.data.blogs[i].keywords = response.data.blogs[i].keywords.substr(0, 8) + "...";
                    }
                    if(response.data.blogs[i].title.length > 8){
                        response.data.blogs[i].title = response.data.blogs[i].content.substr(0, 8) + "...";
                    }
                }
                that.blogList = response.data.blogs;
                that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
            })
            .catch(function(error){
                console.log(error);
            });
        },
        destroyed: function() {
            // 销毁组件时，移除now类
            var blogText = document.getElementById("blogText");
            blogText.classList.remove("now");
        },
        methods:{
            previous:function(){
                if(this.nowPage == 1){
                    swal({
                        title: "没有上一页啦！",
                        icon: "info",
                        button: false,
                        timer: 800,
                    });
                    return
                }
                this.nowPage = this.nowPage - 1;
                var that = this;
                axios.post("/admin/blogData", {
                    page: that.nowPage,
                    num: that.onePageNum // 一页可以展示多少条数据
                })
                .then(function(response){
                    for (var i = 0; i < response.data.blogs.length; i++) {
                        if (response.data.blogs[i].content.length > 8) {
                            response.data.blogs[i].content = response.data.blogs[i].content.substr(0, 8) + "...";
                        }
                        if (response.data.blogs[i].keywords.length > 8) {
                            response.data.blogs[i].keywords = response.data.blogs[i].keywords.substr(0, 8) + "...";
                        }
                        if (response.data.blogs[i].title.length > 8) {
                            response.data.blogs[i].title = response.data.blogs[i].content.substr(0, 8) + "...";
                        }
                    }
                    that.blogList = response.data.blogs;
                    that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
                })
                .catch(function(error){
                    console.log(error);
                });
            },
            // 点击下一页
            next:function(){
                if(this.nowPage == this.allPages){
                    swal({
                        title: "没有下一页啦！",
                        icon: "info",
                        button: false,
                        timer: 800,
                    });
                    return
                }
                this.nowPage = this.nowPage + 1;
                var that = this;
                axios.post("/admin/blogData", {
                    page: that.nowPage,
                    num: that.onePageNum // 一页可以展示多少条数据
                })
                .then(function(response){
                    for (var i = 0; i < response.data.blogs.length; i++) {
                        if (response.data.blogs[i].content.length > 8) {
                            response.data.blogs[i].content = response.data.blogs[i].content.substr(0, 8) + "...";
                        }
                        if (response.data.blogs[i].keywords.length > 8) {
                            response.data.blogs[i].keywords = response.data.blogs[i].keywords.substr(0, 8) + "...";
                        }
                        if (response.data.blogs[i].title.length > 8) {
                            response.data.blogs[i].title = response.data.blogs[i].content.substr(0, 8) + "...";
                        }
                    }
                    that.blogList = response.data.blogs;
                    that.allPages = Math.ceil(response.data.blogsNum / that.onePageNum);
                })
                .catch(function(error){
                    console.log(error);
                });
            },
            // 删除博客
            deleteBlog:function(blogID, index){
                var that = this;
                swal({
                    title: "确认删除？",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then(function(willDelete){
                    if (willDelete) {
                        axios.post("/admin/deleteBlog", {
                            blog_id: blogID
                        })
                        .then(function(response){
                            if(response.data.status){
                                that.blogList.splice(index, 1);
                                swal({
                                    title: "删除成功",
                                    icon: "info",
                                    button: false,
                                    timer: 800,
                                });
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                    }
                });
            }
        }
    });
    var vm = new Vue({
        el: "#app",
        data: {
            comName:"user",
            beforeUnload_time:""
        },
        mounted:function(){
            window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
            window.addEventListener('unload', e => this.unloadHandler(e));
        },
        destroyed() {
            window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
            window.removeEventListener('unload', e => this.unloadHandler(e));
        },
        methods: {
            beforeunloadHandler(){
                this.beforeUnload_time = new Date().getTime();
            },
            unloadHandler(e){
                this._gap_time = new Date().getTime() - this.beforeUnload_time;
                //判断是窗口关闭还是刷新
                if(this._gap_time<=5){
                    localStorage.removeItem("verify");
                }
            },
        },
    });