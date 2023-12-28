<template>
  <div>
    <div class="button-group">
      <button
        :class="{ active: currentTab === 'control' }"
        @click="currentTab = 'control'"
      >遥控型号汇聚</button>
      <button
        :class="{ active: currentTab === 'manufacturer' }"
        @click="currentTab = 'manufacturer'"
      >按厂商型号</button>
    </div>
    <div v-if="currentTab === 'control'">
      <el-table
        :data="responseData"
        :key="responseData.ID"
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
      </el-table>
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
            <el-button>修改</el-button>&nbsp;
            <el-button>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableColumns: [
        { prop: 'Name', label: '名称', align: 'center' },
        { prop: 'ManufacturerCount', label: '类型数量', align: 'center' },
        { prop: 'Comment', label: '备注信息', align: 'center' },
        { prop: 'CreateTime', label: '创建时间', align: 'center' },
        { prop: 'UpdateTime', label: '更新时间', align: 'center' },
        { label: "操作", prop: "action", width: 200, customRender: "action" },
      ],
      currentTab: 'control',
      responseData: [{
        ID: 1,
        Name: 1,
        ManufacturerCount: 1,
        Comment: 1,
        CreateTime: 1,
        UpdateTime: 1,
      }],
      responseMenuData: [{
        ID: 1,
        Name: 1,
        ManufacturerCount: 1,
        Comment: 1,
        CreateTime: 1,
        UpdateTime: 1,
      }],
    }
  }
}
</script>

<style scoped>
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