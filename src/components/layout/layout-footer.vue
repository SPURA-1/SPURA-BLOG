<template>
  <div id="layout-footer">
    <div class="footer-main">
      <div class="footer-item" v-if="socials.length">
        <div v-for="item in socials" :key="item.id">
          <a v-if="item.href" target="_blank" class="out-link" :href="item.href">
            <i class="iconfont" :class="item.icon"></i>{{ item.title }}</a>
          <el-popover
              v-else
              placement="bottom"
              width="100"
              trigger="click"
              content="这是一段内容">
            <el-image
                v-if="item.img"
                style="width: 100px; height: 100px;"
                :src="item.img"
                :preview-src-list="[item.img]"
                fit="contain"
            ></el-image>
            <p v-if="item.text">{{ item.text }}</p>
            <span slot="reference" class="out-link cus">
              <i class="iconfont" :class="item.icon"></i>{{ item.title }}</span>
          </el-popover>
        </div>
      </div>
      <div class="footer-item">
        <div style="font-size:17px;font-weight: bold;">资源</div>
        <div><a target="_blank" class="out-link" href="https://segmentfault.com/weekly?utm_source=sf-footer">每周精选</a>
        </div>
        <div><a target="_blank" class="out-link" href="https://pixabay.com/images/search/">PIXABOY插图</a></div>
      </div>
      <div class="footer-item">
        <div style="font-size:17px;font-weight: bold;">后台</div>
        <div><router-link class="out-link"  to="/Admin-Main">☞后台管理</router-link></div>
      </div>
    </div>
    <div>
      <p id="htmer_time" style="color: #fd7286;font-size: large;font-weight: bolder;"></p>
    </div>
    <div class="copyright">{{ ` Copyright ©${new Date().getFullYear()} by` }}<a target="_blank" class="out-link"
       href="https://github.com/SPURA-1">@SPURA</a>
      . All rights reserved. |
    </div>
    <div class="copyright" style="margin-top: 10px">
      <iframe name="weather_inc" src="http://i.tianqi.com/?c=code&id=1" width="420" height="20" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
    </div>
    
  </div>
</template>

<script>
import TimeOut from '../../assets/JS/TimeOut'

export default {
  name: "layout-footer",
  data() {
    return {
      socials: []
    }
  },
  components: {
    
  },
  computed: {
    runTimeInterval() {
      return this.$store.state.runTimeInterval;
    }
  },
  methods: {
    getSocial() {
      this.$store.dispatch('getSocials').then(data => {
        this.socials = data
      })
    },
  },
  created() {
    this.getSocial();
    this.$store.dispatch('initComputeTime');
  }
}
</script>

<style scoped lang="less">
#htmer_time {
  text-align: center;
}

#layout-footer {
  padding: 2%;
  border-top: 1px solid #F7F7F7;
  font-size: 13px;
  color: #9c9c9c;


  a.out-link:hover {
    color: #ff6d6d;
    text-decoration: none;
  }
  a{text-decoration: none;}

  .footer-main {
    max-width: 800px;
    margin: 0 auto 20px auto;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    text-align: center;

    .footer-item {
      flex: 1;

      & > div:not(:last-child) {
        margin-bottom: 10px;
      }

      i {
        margin-right: 10px;
      }
    }
  }

  .copyright {
    text-align: center;
    line-height: 20px;
  }
}

/*****/
@media (max-width: 800px) {
  #layout-footer {
    .footer-main .footer-item:nth-child(3) {
      flex: 2;
    }
  }
}

@media (max-width: 600px) {
  #layout-footer {
    .footer-main {
      display: block;

      .footer-item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;

        & > div {
          margin-bottom: 10px;
        }
      }
    }
  }
}

/*****/

.cus {
  cursor: pointer;

  &:hover {
    color: #ff6d6d;
  }
}
</style>
