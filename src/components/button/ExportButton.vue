<template>
  <el-dropdown @command="handleExport" trigger="click">
    <el-button :type="buttonType" :icon="buttonIcon" :loading="loading">
      {{ buttonText }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="excel">
        <i class="el-icon-document"></i> Excel
      </el-dropdown-item>
      <el-dropdown-item command="word">
        <i class="el-icon-document"></i> Word
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs'
import axios from 'axios'
import { Document, Packer, ImageRun, Paragraph, Table,
  TableCell, TableRow, TextRun, WidthType, AlignmentType} from 'docx'

export default {
  name: 'ExportButton',
  props: {
    exportConfig: {
      type: Object,
      required: true,
      validator: config => ['fetchApi', 'fields', 'filename'].every(key => key in config)
    },
    buttonText: { type: String, default: '导出数据' },
    buttonType: { type: String, default: 'primary' },
    buttonIcon: { type: String, default: 'el-icon-download' },
    imageBaseUrl: { type: String, default: '' }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async handleExport(command) {
      this.loading = true
      try {
        const rawData = await this.exportConfig.fetchApi()
        const processedData = await this.processData(rawData.data.data.users || rawData.data.data)
        
        command === 'excel' 
          ? await this.exportExcel(processedData) 
          : await this.exportWord(processedData)
        
        this.$emit('export-success')
      } catch (error) {
        this.$emit('export-error', error)
        console.error('Export Error:', error)
      } finally {
        this.loading = false
      }
    },

    async processData(rawData) {
      return Promise.all(rawData.map(async item => ({
        ...item,
        mg_state: item.mg_state === 1 ? '✅ 启用' : '❌ 关闭',
        user_role: item.user_role === 1 ? '👑 管理员' : '👤 普通用户',
        // user_pic: await this.fetchImage(item.user_pic)
        user_pic: item.user_pic ? await this.fetchImage(item.user_pic).catch(() => null): null,  // 图片加载失败时设为null
      })))
    },

    async fetchImage(url) {
      if (!url) return null
      try {
        const response = await axios.get(`${this.imageBaseUrl}${url}`, {
          responseType: 'arraybuffer'
        })
        return Buffer.from(response.data)
      } catch {
        return null
      }
    },

    async exportExcel(data) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Sheet1')

      // 设置表头样式
      worksheet.columns = Object.keys(this.exportConfig.fields).map(key => ({
        header: this.exportConfig.fields[key],
        key,
        width: 20,
        style: {
          font: { bold: true, color: { argb: 'FFFFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } }
        }
      }))

      // 添加数据和图片
      data.forEach((item, rowIndex) => {
        const row = worksheet.addRow({ ...item, user_pic: '' })
        
        if (item.user_pic) {
          const imageColIndex = Object.keys(this.exportConfig.fields).indexOf('user_pic')
          const image = workbook.addImage({
            buffer: item.user_pic,
            extension: this.getImageType(item.user_pic)
          })
          
          worksheet.addImage(image, {
            tl: { col: imageColIndex, row: rowIndex },
            br: { col: imageColIndex + 1, row: rowIndex + 1 },
            editAs: 'oneCell'
          })
        }
      })

      const buffer = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buffer]), `${this.exportConfig.filename}.xlsx`)
    },

    getImageType(buffer) {
      const header = buffer.toString('hex', 0, 4)
      return {
        '89504e47': 'png',
        'ffd8ffe0': 'jpeg',
        'ffd8ffe1': 'jpeg'
      }[header] || 'png'
    },

    // async exportWord(data) {
    //   const doc = new Document({
    //     sections: [{
    //       properties: {},
    //       children: data.map(item => new Paragraph({
    //         children: Object.entries(this.exportConfig.fields)
    //           .map(([key, title]) => new TextRun({
    //             text: `${title}: ${item[key]}    `,
    //             bold: key === Object.keys(this.exportConfig.fields)[0]
    //           }))
    //       }))
    //     }]
    //   })

    //   const blob = await Packer.toBlob(doc)
    //   saveAs(blob, `${this.exportConfig.filename}.docx`)
    // }

    async exportWord(data) {
      try {
        const { Document, AlignmentType, WidthType, BorderStyle, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun } = await import('docx');

        // 创建标准化单元格（改用箭头函数并访问外部依赖）
        const createCell = (content) => {
          return new TableCell({
            children: [new Paragraph({
              children: [new TextRun({
                text: content.toString(),  // 确保转换为字符串
                color: "000000"
              })],
              shading: { fill: "FFFFFF" },
              spacing: { after: 10 }
            })]
          });
        };


        // 创建文档对象
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Table({
                // ========== 表格全局配置 ==========
                width: { 
                  size: 100, 
                  type: WidthType.PERCENTAGE  // 表格占满页面宽度
                },
                columnWidths: new Array(Object.keys(this.exportConfig.fields).length).fill(2000), // 每列2000缇（约3.5厘米）
                borders: {
                  top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                  left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
                  right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }
                },
                rows: [
                  // ========== 表头行 ==========
                  new TableRow({
                    children: Object.values(this.exportConfig.fields).map(header => 
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({
                            text: header,
                            bold: true,
                            color: "FFFFFF"  // 白色文字
                          })],
                          shading: { 
                            fill: "404040",  // 深灰色背景
                          },
                          alignment: AlignmentType.CENTER  // 居中显示
                        })]
                      })
                    )
                  }),

                  // 数据行（注意改用新的createCell）
                  ...data.map(item => new TableRow({
                    children: Object.keys(this.exportConfig.fields).map(key => {
                      switch(key) {
                        // case 'mg_state':
                        //    // 测试用例 1：强制显示"启用"
                        //    // return createCell('✅ 启用');
                        //   return createCell(Number(item[key]) == 1 ? '✅ 启用' : '❌ 关闭');
                        // case 'user_role':
                        //   return createCell(Number(item[key]) == 1 ? '👑 管理员' : '👤 普通用户');
                        case 'user_pic':   // 图片字段
                              return new TableCell({
                                children: [new Paragraph({
                                  children: item.user_pic 
                                    ? [new ImageRun({
                                        data: item.user_pic,
                                        transformation: {
                                          width: 50,  // 50mm 
                                          height: 50
                                        }
                                      })]
                                    : [new TextRun("无头像")],
                                  alignment: AlignmentType.CENTER
                                })]
                              });

                        default:
                          return createCell(item[key] || '无');  // 使用新的createCell
                      }
                    })
                  }))
                ]
              })
            ]
          }]
        });

        // 生成并保存文件
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${this.exportConfig.filename}.docx`);

      } catch (error) {
        console.error('Word导出失败:', error);
        throw new Error(`Word文件生成失败: ${error.message}`);
    }
    },
  }
}
</script>

<style scoped>
.el-dropdown {
  margin-left: 10px;
}
</style>