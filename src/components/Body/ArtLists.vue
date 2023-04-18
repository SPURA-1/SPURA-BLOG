<template>
    <div class="body">
        <div data-scroll-reveal="enter bottom over 1s" class="blogs">
            <h3 class="blogtitle"><a href="javascript:void(0);">Java监听器</a></h3> <span class="blogpic"><a
                    href="javascript:void(0);" title=""><!----></a></span>
            <p class="blogtext">简易监听器实现方式之一</p>
            <div class="bloginfo">
                <ul style="list-style-type:none;">
                    <li class="author"><span class="iconfont"></span> <a href="javascript:void(0);">mogu2022</a></li>
                    <li class="lmname"><span class="iconfont"></span> <a href="javascript:void(0);">后端开发</a></li>
                    <li class="view"><span class="iconfont"></span> <span>91</span></li>
                    <li class="like"><span class="iconfont"></span>
                        2
                    </li>
                    <li class="createTime"><span class="iconfont"></span>
                        2023-02-25 16:58:39
                    </li>
                </ul>
            </div>
        </div>
        <div data-scroll-reveal="enter bottom over 1s" class="blogs">
            <h3 class="blogtitle"><a href="javascript:void(0);">AJAX</a></h3> <span class="blogpic"><a
                    href="javascript:void(0);" title=""></a></span>
            <p class="blogtext">AJAX</p>
            <div class="bloginfo">
                <ul style="list-style-type:none;">
                    <li class="author"><span class="iconfont"></span> <a href="javascript:void(0);">mogu2022</a></li>
                    <li class="lmname"><span class="iconfont"></span> <a href="javascript:void(0);">后端开发</a></li>
                    <li class="view"><span class="iconfont"></span> <span>71</span></li>
                    <li class="like"><span class="iconfont"></span>
                        0
                    </li>
                    <li class="createTime"><span class="iconfont"></span>
                        2023-02-19 10:53:09
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>

.body {
    width: 900px;
    height: 300px;
    margin-top: 100px;
    margin-left: 500px;
    /* margin-right: 150px; */
    text-align: center;
    justify-content: center;
    
}
.blogs {
    overflow: hidden;
    margin-bottom: 20px;
    padding: 20px;
    background: #06a6f0;
    box-shadow: 0 2px 5px 0 hsla(0,0%,57%,.1);
    transition: all .6s ease;
}

ul {
    overflow: hidden;
    white-space:nowrap;    
}
li {
    list-style: none;
    float: left;
    width: 130px;
}

</style>