<template>
  <span v-if="SettingBar">
    <div class="setting-bar-setting">
      <div @click="handleOpenSettingBar" :style="{ backgroundColor: SettingColor }" style="border-radius:10px;">
        <i class="el-icon-s-tools" style="color: #fff"></i>
        <p>主题配置</p>
      </div>
      <!-- <div>
        <i class=""></i>
        <p>拷贝源码</p>
      </div> -->
    </div>

    <el-drawer :visible.sync="drawerVisible" :append-to-body="true" direction="rtl" size="300px" title="主题配置">
      <el-scrollbar style="height: auto; overflow: hidden">
        <div class="el-drawer__body">
          <el-form ref="form" :model="setting" label-position="top">
            <el-form-item label="主题">
              <el-radio-group v-model="setting.name" style="display:flex;">
                <el-radio-button label="gold">默认</el-radio-button>
                <el-radio-button label="green">绿荫草场</el-radio-button>
                <el-radio-button label="red">荣耀典藏</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="布局">
              <el-radio-group v-model="setting.layout">
                <el-radio-button label="vertical">纵向布局</el-radio-button>
                <el-radio-button label="horizontal">横向布局</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="头部">
              <el-radio-group v-model="setting.header">
                <el-radio-button label="fixed">固定头部</el-radio-button>
                <el-radio-button label="noFixed">不固定头部</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="多标签">
              <el-radio-group v-model="setting.tabsBar">
                <el-radio-button label="true">开启</el-radio-button>
                <el-radio-button label="false">不开启</el-radio-button>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
        </div>
      </el-scrollbar>

      <div class="el-drawer__footer">
        <el-button type="primary" @click="handleSaveSetting">保存</el-button>
        <el-button type="" @click="drawerVisible = false">取消</el-button>
      </div>
    </el-drawer>
  </span>
</template>

<script>
export default {
  name: 'SettingBar',
  props: {
    // 父组件传递的 SettingColor
    SettingColor: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      drawerVisible: false,
      SettingBar: true,
      setting: {
        name: 'gold',
        layout: '',
        // header: 'fixed',
        // tabsBar: '',
      },
    }
  },
  computed: {
  },
  created() {
    this.loadSettingFromLocalStorage();
  },
  methods: {
    // 按钮数据的回显
    loadSettingFromLocalStorage() {
      const storedSetting = localStorage.getItem('SPURA-setting');
      if (storedSetting) {
        try {
          const parsedSetting = JSON.parse(storedSetting);
          this.setting = {
            name: parsedSetting.name || 'gold',
            layout: parsedSetting.layout || 'vertical',
            // 其他属性...
          };
        } catch (error) {
          console.error('Error parsing Setting from localStorage', error);
        }
      }
    },
    handleOpenSettingBar() {
      this.drawerVisible = true
    },
    handleSaveSetting() {
      let { name, layout } = this.setting
      let SettingConfig = {
        name,
        layout
      };
      localStorage.setItem('SPURA-setting', JSON.stringify(SettingConfig));
      window.location.reload();
      this.drawerVisible = false
    },

  },
}
</script>

<style lang="scss" scoped>
@mixin right-bar {
  position: fixed;
  right: 0;
  z-index: 999;
  width: 60px;
  min-height: 60px;
  text-align: center;
  cursor: pointer;

  > div {
    padding-top: 10px;
    border-bottom: 0 !important;

    &:hover {
      opacity: 0.9;
    }

    & + div {
      border-top: 1px solid #fff;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: 12px;
      line-height: 30px;
      color: #fff;
    }
  }
}

.setting-bar-setting {
  @include right-bar;

  top: calc((100vh - 110px) / 2);

  ::v-deep {
    svg:not(:root).svg-inline--fa {
      display: block;
      margin-right: auto;
      margin-left: auto;
      color: #fff;
    }

    .svg-icon {
      display: block;
      margin-right: auto;
      margin-left: auto;
      font-size: 20px;
      color: #fff;
      fill: #fff;
    }
  }
}

.el-drawer__body {
  padding: 20px;
}

.el-drawer__footer {
  border-top: 1px solid #dedede;
  position: fixed;
  bottom: 10px;
  width: 100%;
  padding: 10px 0 0 80px;
  height: 50px;
}
</style>
<style lang="scss" scoped>
.el-drawer__wrapper {
  outline: none !important;

  * {
    outline: none !important;
  }
}
.vab-color-picker {
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
