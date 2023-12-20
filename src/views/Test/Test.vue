<template>
  <div>
    <div class="button-group">
      <button
        :class="{ active: currentTab === 'control' }"
        @click="currentTab = 'control'"
      >1</button>
      <button
        :class="{ active: currentTab === 'manufacturer' }"
        @click="currentTab = 'manufacturer'"
      >2</button>
    </div>
    <div v-if="currentTab === 'control'">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-table
          :data="form.responseData"
          :key="form.responseData.ID"
          row-key="id"
          border
          style="margin-top:10px; overflow:auto; max-height:800px;"
        >

          <el-table-column label="姓名">
            <template slot="header">
              <span class="requiredclass">姓名</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'responseData.' + scope.$index + '.Name' "
                :rules='rules.Name'
              >
                <el-input v-model="scope.row.Name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="ManufacturerCount"
            label="数量"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop=" 'responseData.' + scope.$index + '.ManufacturerCount' "
                :rules='rules.Count'
              >
                <el-input v-model.number="scope.row.ManufacturerCount"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="Comment"
            label="备注信息"
          >

          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
          >

          </el-table-column>
          <el-table-column
            prop="UpdateTime"
            label="更新时间"
          >

          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="del(scope.$index)"
                icon='el-icon-delete'
              ></el-button>
              <el-button
                type="primary"
                size="mini"
                @click="add"
                icon='el-icon-plus'
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div v-if="currentTab === 'manufacturer'">
      <el-table
        :data="responseMenuData"
        :key="responseMenuData.ID"
        border
        style="margin-top:10px; overflow:auto; max-height:800px;"
      >

        <el-table-column
          prop="Name"
          label="名称"
        >

        </el-table-column>
        <el-table-column
          prop="ManufacturerName"
          label="厂商"
        >

        </el-table-column>
        <el-table-column
          prop="ManufacturerModel"
          label="型号"
        >

        </el-table-column>
        <el-table-column
          prop="Comment"
          label="备注信息"
        >

        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          label="更新时间"
        >
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button size="mini">修改</el-button>&nbsp;
            <el-button size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-tag
        type='danger'
        size="medium "
        style="font-size:20px;margin-top:10px;"
      >点击删除触发错误报警提醒</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数量不能为空'));
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else if (value < 18) {
        callback(new Error('必须大于18'));
      } else if (value > 50) {
        callback(new Error('小于50'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        Name: [
          { required: true, message: '名字不能为空', trigger: 'blur' }
        ],
        Count: [
          { required: true, trigger: 'blur', validator: checkAge }
        ],
      },
      currentTab: 'control',
      form: {
        responseData: [{
          ID: 1,
          Name: 10,
          ManufacturerCount: 1,
          Comment: 1,
          CreateTime: 1,
          UpdateTime: 1,
        }],
      },
      responseMenuData: [{
        ID: 1,
        Name: 1,
        ManufacturerCount: 1,
        Comment: 1,
        CreateTime: 1,
        UpdateTime: 1,
      }],
    }
  },
  methods: {
    add() {
      console.log(this.form, 'ssqqqqqq');
      this.form.responseData.push({
        Name: "",
        ManufacturerCount: null,
      })
    },
    del(index) {
      this.form.responseData.splice(index, 1);
      this.$refs.form.validate()
    },

  }
}
</script>

<style lang="less" scoped>
// 输入框 提示错误 颜色
/deep/ .el-form-item__error {
  color: green;
}
// 输入框的边框颜色
/deep/ .el-form-item.is-error .el-input__inner {
  border-color: blue;
}
// 输入框的验证图标颜色
// /deep/ .el-form-item.is-error .el-input__validateIcon {
//   color: blue;
// }
.requiredclass::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.button-group button:nth-child(1) {
  font-size: 15px;
  height: 100%;
  width: 150px;
}

.button-group button:nth-child(2) {
  font-size: 15px;
  height: 100%;
  width: 150px;
}
.button-group button.active {
  border: #efefef 1px solid;
  background-color: #ffffff;
}
</style>