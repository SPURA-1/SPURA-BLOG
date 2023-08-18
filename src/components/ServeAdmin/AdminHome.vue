<template>
  <div class="div1">
    <!-- 资源视图 -->
    <div class="top-wrap">
      <el-card class="box-card">
        <p style="margin-bottom:20px;">资源总览</p>
        <div class="top-box">
          <div class="box-wrap">
            <div>文章总数</div>
            <div style="font-size:30px; color:#0066cc;">{{ this.data.artLength }}</div>
          </div>
          <div class="box-wrap">
            <div>游戏总数</div>
            <div style="font-size:30px; color:#009933;">{{ this.data.gameLength }}</div>
          </div>
          <div class="box-wrap">
            <div>留言总数</div>
            <div style="font-size:30px; color:#a1a1a1;">{{ this.data.commentLength }}</div>
          </div>
          <div class="box-wrap">
            <div>用户总数</div>
            <div style="font-size:30px; color:#0066cc;">{{ this.data.userLength }}</div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 下半部分容器 -->
    <div class="bottom-wrap">
      <!-- 左边容器 -->
      <div class="left-box">
        <div class="left-container">
          <p class="f18">任务调度</p>
          <!-- 测试任务 -->
          <div class="all-test-box">
            <div class="test-box" style="height:110px;min-width:430px;" v-for="page in taskList" :key="page.ID">
              <div class="title">
                <span class="icon">测</span>
                <p class="f20">{{ page.Name }}</p>
              </div>
              <div class="contens">
                <div>
                  <span style="width: 200px">执行机器人数：{{ page.RobotCount  }}</span>
                  <span>用例数：{{ page.ProcCount  }}</span>
                  <span>任务状态：{{ page.Status  }}</span>
                </div>
                <div>
                  <span>执行方式：{{ page.RunType  }}</span>
                  <span>测试时间：{{ page.BeginTime  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最近任务结果视图 接口为报告数据-->
        <div class="left-container">
          <p class="f18">最近任务结果视图</p>
          <div class="all-test-box">
            <div class="test-box" v-for="item in ReportList" :key="item.ID">
              <div class="title" style="justify-content: space-between;">
                <div class="test">
                  <span class="icon">测</span>
                  <div class="f20">{{ item.Name }}</div>
                </div>
                <div>{{ item.Status }}</div>

              </div>
              <div class="contens">
                <div>
                  <span style="width: 200px">用例数:&nbsp;{{ item.ProcCount }}</span>
                  <span>测试次数:&nbsp;{{ item.ProcSuccess }}</span>
                </div>
                <div>
                  <span>被测设备数:&nbsp;{{ item.RobotCount }}</span>
                  <span>成功率:&nbsp;{{ item.ProcPercent+'%' }}</span>
                </div>
                <div class="spilt-box">
                  <div>
                    <i class="el-icon-user-solid"></i>
                    <span>{{ item.Username }}</span>
                  </div>
                  <div>
                    <i class="el-icon-time"></i>
                    <span>{{ item.RealBeginTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-card class="box-card">
        <!-- 右边容器 -->
        <div class="right-box">
          <!-- 头部个人信息 -->
          <div class="right-top">
            <h3>您好！欢迎登录</h3>
            <div class="user-content">
              <p>最近登陆时间：{{ this.data.last_time }}</p>
              <p>最近登陆IP：{{ this.data.last_ip }}</p>
              <p>登录次数：{{ this.data.login_count }}</p>
            </div>
          </div>
          <!-- 底部快捷操作 -->
          <div class="shortcuts">
            <p style="margin-bottom: 20px" class="f18">图表</p>
            <!-- <EChart /> -->
          </div>
        </div>
      </el-card>
    </div>
    <footer class="chart-box" style="width: 100%; overflow: auto">

      <p id="htmer_time" style="color: #fd7286;font-size: large;font-weight: bolder;"></p>

    </footer>

  </div>
</template>

<script>
import { getAdminData } from '@/api/AdminHome.api'
import EChart from '../ECharts/EChart.vue'
import TimeOut from '../../assets/JS/TimeOut'
export default {
  components: {
    EChart
  },
  data() {
    return {
      // 记录在线时长
      startTime: null,
      endTime: null,
      ListData: {},
      data: {},
      pageHistory: [],
      userInfo: {},
      ReportList: [], // 测试数组
      taskList: [], // 测试任务数组
      taskStatus: [],
      ReportStatusList: [],
      FastAct: [], // 快捷操作列表
    };
  },
  created() {
    this.getPageListData(); // 获取资源视图信息
    this.getReportListData(); // 获取测试任务数据
    this.getTaskListData(); // 获取最近任务结果视图
  },
  computed: {
    percentage() {
      return (this.data.task_count / this.data.proc_count) * 100;
    },
    formattedPercentage() {
      return this.percentage.toFixed(0);
    }
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
    // 获取首页数据列表
    getPageListData() {
      getAdminData()
        .then(res => {
          if (res.status === 200) {
            this.data = res.data
            console.log(res.data)
          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },
    // 获取报告列表
    getReportListData() {

    },
    // 获取任务列表
    getTaskListData() {

    },
  },
};
</script>


// <style lang="less" scoped>
// // 滚动条隐藏
// ::v-deep .all-test-box::-webkit-scrollbar {
//   display: none;
// }
// .div1 {
//   height: 100%;
//   width: 100%;
//   align-items: center;
//   justify-content: center;
// }
//
</style>

<style lang="scss" scoped>
// 滚动条隐藏
::v-deep .all-test-box::-webkit-scrollbar {
  display: none;
}
.div1 {
  height: 100%;
  .top-wrap {
    height: 160px;
    .box-card {
      height: 100%;
      .top-box {
        height: 100%;
        width: 70%;
        min-width: 600px;
        display: flex;
        justify-content: space-between;
        .box-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .bottom-wrap {
    height: calc(100% - 170px);
    min-width: 1200px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    .left-box {
      width: 72%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .left-container {
        width: 100%;
        min-width: 730px;
        height: 50%;
        background-color: #fff;
        .all-test-box {
          height: calc(100% - 40px);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          overflow: auto;
          .test-box {
            width: 49%;
            height: 130px;
            padding: 0 20px;
            margin-top: 10px;
            border: 1px solid rgb(228, 228, 228);
            border-radius: 4px;
            .title {
              height: 40px;
              display: flex;
              align-items: center;

              .test {
                display: flex;
                align-items: center;
              }
              .icon {
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: rgb(8, 79, 231);
                text-align: center;
                line-height: 30px;
                color: #fff;
                margin-right: 10px;
              }
            }
            .contens {
              font-size: 14px;
              height: 90px;
              > div {
                height: 30px;
                display: flex;
                justify-content: space-between;
                width: 100%;
              }
              .spilt-box {
                margin-bottom: none;
                border-top: 1px solid rgba(228, 228, 228, 0.6);
                color: rgb(190, 188, 188);
                i {
                  margin-right: 5px;
                  display: inline-block;
                }
              }
            }
          }
          .test-box:hover {
            background-color: rgba(0, 102, 255, 0.1);
          }
        }
      }
    }
    .right-box {
      width: 27%;
      height: 100%;
      .right-top {
        padding: 20px;
        height: 166px;
        min-width: 340px;
        background-color: #fff;
        margin-bottom: 10px;
        h3 {
          color: rgb(0, 102, 204);
          margin-bottom: 15px;
        }
        .user-content {
          > p {
            font-size: 16px;
            padding: 2px 0;
          }
        }
      }
      .shortcuts {
        padding: 20px;
        background-color: #fff;
        height: calc(100% - 166px);
        .btn-wrap {
          // width: 60%;
          width: 150px;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column-reverse;
          .el-button {
            width: 150px;
          }
        }
      }
    }
  }
}
</style>