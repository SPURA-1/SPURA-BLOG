<template>
  <div>
    <!-- 面包屑导航区 -->
    <top-bar style="margin-bottom:10px;" />
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
    <div>
      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
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

        <!-- 使用v-for循环生成el-table-column -->
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              text
              size="small"
              type="primary"
              @click="detailButton(scope.row)"
            >
              详情
            </el-button>
            <el-button
              text
              size="small"
              type="danger"
              @click="delButton(scope.row.id)"
            >
              删除
            </el-button>
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
    <el-dialog
      title="测试"
      :visible.sync="dialogFormVisible"
      width="850px"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item
          label="数据节点"
          prop="datanode_array"
        >
          <el-transfer
            v-model="datanodeArray"
            filterable
            filter-placeholder="请选择数据节点"
            :data="datanodeData"
            :titles="['待绑定', '已绑定']"
            @change="handleTransferChange"
          >
          </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-table
            v-if="tableNodeData.length > 0"
            :data="tableNodeData"
          >
            <el-table-column
              label="数据节点权限控制"
              prop="id"
            >
              <template slot-scope="scope">
                {{ getNameById(scope.row.id) }}
              </template>
            </el-table-column>
            <el-table-column
              label="属性"
              prop="perm"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.perm"
                  placeholder="请选择"
                  :rules="[{ required: true, message: '请选择属性', trigger: 'blur' }]"
                >
                  <!-- 下拉框选项 -->
                  <el-option
                    v-for="option in permMap"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 表格列定义 -->
            <!-- 这里需要根据实际情况定义表格列 -->
          </el-table>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogStatus()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
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
      tableColumns: [
        { prop: 'Name', label: '名称', align: 'center' },
        { prop: 'ManufacturerCount', label: '数量', align: 'center' },
        { prop: 'Comment', label: '备注信息', align: 'center' },
        { prop: 'CreateTime', label: '创建时间', align: 'center' },
        { prop: 'UpdateTime', label: '更新时间', align: 'center' },
      ],
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
      temp: {
        id: undefined,
        status: '1',
        datanode_array: [],
      },
      dialogFormVisible: false,  // dialog显示
      datanodeArray: [], // 右边穿梭框选中的数据
      tableNodeData: [], // 表格数据
      datanodeData: [],
      permMap:
        [
          { value: 1, label: "普通" },
          { value: 2, label: "稀有" },
        ],
      datanodeList:
        [
          {
            "id": 1,
            "name": "音响列表",
            "comment": "备注",
          },
          {
            "id": 2,
            "name": "键盘列表",
            "comment": "备注",
          },
          {
            "id": 3,
            "name": "鼠标列表",
            "comment": "备注",
          },
          {
            "id": 4,
            "name": "笔记本列表",
            "comment": "备注",
          },
          {
            "id": 5,
            "name": "平板列表",
            "comment": "备注",
          },
          {
            "id": 6,
            "name": "手机列表",
            "comment": "备注",
          },
          {
            "id": 7,
            "name": "电脑列表",
            "comment": "备注",
          },
          {
            "id": 8,
            "name": "机器列表",
            "comment": "备注",
          },
          {
            "id": 9,
            "name": "人员列表",
            "comment": "备注",
          }
        ]
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
    detailButton(row) {
      console.log(row, '详情');
      // 处理详情按钮点击事件
    },
    delButton(id) {
      console.log(id, '删除');
      // 处理删除按钮点击事件
    },
    handleCreate() {
      // 数据节点
      this.datanodeData = []
      for (let i in this.datanodeList) {
        let item = {
          key: this.datanodeList[i].id,
          label: this.datanodeList[i].name
        }
        this.datanodeData.push(item)
      }
      this.dialogFormVisible = true;
    },
    handleTransferChange(newData, direction, movedData) {
      if (direction === 'right') {
        // 右移数据时，添加到表格数据中
        movedData.forEach(item => {
          const newItem = { id: item, perm: 1 };
          this.tableNodeData.push(newItem);
        });
      } else if (direction === 'left') {
        // 左移数据时，从表格数据中移除
        movedData.forEach(item => {
          const index = this.tableNodeData.findIndex(tableItem => {
            return tableItem.id === item;
          });
          if (index !== -1) {
            this.tableNodeData.splice(index, 1);
            // console.log(this.tableNodeData, '删除成功');
          }
        });

      }
    },
    getNameById(id) {
      const targetObject = this.datanodeList.find(item => item.id === id);
      return targetObject ? targetObject.name : '未找到';
    },
    dialogStatus() {
      // 将添加了值的穿梭框数据重新返回给要提交的数据总和
      this.temp.datanode_array = Object.values(this.tableNodeData)
      console.log(this.temp);
    }
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