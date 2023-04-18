<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="app" style="margin-top:80px;">
    <header>
      <div class="leftHead">
        <img src="@/assets/Main/logo.png" />
        <p style="user-select: none">BLOG</p>
        <div>
          <a id="userText" href="" @click.prevent="comName = 'user'"
            >用户管理</a
          >
          <a id="blogText" href="" @click.prevent="comName = 'blog'"
            >博客管理</a
          >
        </div>
      </div>
      <div class="rightHead">
        <img src="@/assets/Main/avatar.jpg" alt="" />
        <p>管理者</p>
      </div>
    </header>
    <div></div>
    <div class="container">
      <component :is="comName"></component>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
body{
    width: 100vw;
    height: 100vh;
 /* 这里的100vh代表的就是100%的视窗大小，
    减掉的80px就是header的大小 
    calc表示的是会动态计算视窗高度减去header的高度*/
    height: calc(100vh - 80px);
    background-image: url("@/assets/Main/adminBgc.png");
    background-size: cover;
    background-attachment:fixed;
}
a{
    text-decoration: none;
    color: black;
}
#app{
    width: 100%;
    height: 100%;
}
header{
    width: 100%;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10%;
    position: fixed;
    left: 0;
    top: 0;
    box-shadow: 1px 0px 5px rgba(0, 0, 0, .3);
    /* background-image: url("@/assets/Main/adminBgc.png"); */
    /* background: rgba(0, 0, 0, 0.082); */

}
.leftHead{
    width: 75%;
    height: 100%;
    min-width: 320px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.leftHead > img{
    height: 30px;
    margin-right: 10px;
}
.leftHead > div{
  /* user-select 禁止用户选中文字 */
    user-select: none;
    margin-left: 40px;
    height: 30px;
}
.leftHead > div > a{
    font-size: 16px;
    line-height: 30px;
}
.leftHead > div > a:first-child{
    margin-right: 40px;
}
.leftHead > div > a:hover{
  /* 放上去变成鼠标指针手形光标
     以后可改成自己做的光标 */
    cursor: pointer;
}
.rightHead{
    width: 15%;
    height: 40px;
    min-width: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* user-select 禁止用户选中文字 */
    user-select: none;
}
.rightHead > img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
}

.container{
    width: calc(80% - 30px);
    height: calc(100% - 60px);
    margin: 80px auto 0;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    padding: 15px;
}
</style>
