<template>
  <div id="body" style="margin-top:80px;">
    <div class="btnnav">
      <el-button @click="getLuaCode">获取Lua code</el-button>
      <!-- <el-button @click="getWorkspaceXml">保存代码</el-button> -->
      <el-button @click="saveLuaCode = true">保存</el-button>
      <el-button type="text" @click="loadLuaCode" style="margin-left: 10px; color: #1e90ff;">导入用例</el-button>
      <!-- <LoadDialog :visible.sync="dialogVisible"></LoadDialog> -->
    </div>

    <el-dialog title="用例导入" :visible.sync="dialogVisible">
      <!-- <el-input placeholder="搜索" v-model="searchText"></el-input> -->
      <el-table :data="tableData">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleImport(scope.$index)">导入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 编辑需要弹出的内容 -->
    <el-dialog title="保存" :visible.sync="saveLuaCode" width="470px" style="font-weight: bold;">
      <el-form :model="form">
        <el-form-item label="用例名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:218px"></el-input>
        </el-form-item>
        <el-form-item label="用例类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择类型">
            <el-option label="类型一" value="shanghai"></el-option>
            <el-option label="类型二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例描述" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="form.description" style="width: 218px;">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveLuaCode = false">取 消</el-button>
        <el-button type="primary" @click="saveLuaCode = false">确 定</el-button>
      </div>
    </el-dialog>

    <div class="rightaside">
      <div id="blocklyDiv"></div>
      <div>
        <div id="screen-top">
          <a class="a-label">
            执行画面
          </a>
        </div>
        <div id="screen-bottom">
          <a class="a-label">
            执行记录
          </a>
          <div id="code-box">
            <Code>
              {{ latestCode }}
            </Code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import lua_compressed from "blockly";
// import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import Blockly from 'blockly';
// import {Lua} from 'blockly/lua.js';
import { javascriptGenerator } from 'blockly/javascript';
import { luaGenerator } from 'blockly/lua';

// 配置语言环境
import * as Ch from 'blockly/msg/zh-hans';
Blockly.setLocale(Ch);
import axios from 'axios';
import { getBlocklyCode } from '../../api/blockly.api'

// import LoadDialog from '../dialog/LoadDialog.vue'

export default {
  components: {
    // LoadDialog,
  },
  data() {
    return {
      // Blockly 工作区实例
      workspace: null,
      textarea2: '',
      latestCode: '',
      saveLuaCode: false,
      dialogVisible: false,
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
      },
      tableData: {},
      formLabelWidth: '120px',
      // 工具箱配置
      toolboxJson: {
        // kind，分类，categoryToolbox 为分类工具箱
        "kind": "categoryToolbox",
        "contents": [
          {
            "kind": "category",
            "name": "逻辑",
            "categorystyle": "logic_category",
            "contents": [
              {
                "kind": "category",
                "name": "If",
                "contents": [
                  {
                    "kind": "block",
                    "type": "math_change"
                  },
                  {
                    "kind": "block",
                    "type": "lib_add"
                  },
                  {
                    "kind": "block",
                    "type": "controls_if"
                  },
                  {
                    "kind": "block",
                    "type": "controls_if",
                    "extraState": {
                      "hasElse": "true"
                    }
                  },
                  {
                    "kind": "block",
                    "type": "controls_if",
                    "extraState": {
                      "hasElse": "true",
                      "elseIfCount": 1
                    }
                  }
                ]
              },
              {
                "kind": "category",
                "name": "布尔值",
                "categorystyle": "logic_category",
                "contents": [
                  {
                    "kind": "block",
                    "type": "logic_compare"
                  },
                  {
                    "kind": "block",
                    "type": "logic_operation"
                  },
                  {
                    "kind": "block",
                    "type": "logic_negate"
                  },
                  {
                    "kind": "block",
                    "type": "logic_boolean"
                  },
                  {
                    "kind": "block",
                    "type": "logic_null"
                  },
                  {
                    "kind": "block",
                    "type": "logic_ternary"
                  }
                ]
              }
            ]
          },
          {
            "kind": "category",
            "name": "循环",
            "categorystyle": "loop_category",
            "contents": [
              {
                "kind": "block",
                "type": "text"
              },
              {
                "kind": "block",
                "type": "text_print"
              },
              {
                "kind": "block",
                "type": "lib_add"
              },
              {
                "kind": "block",
                "type": "lib_add_define"
              },
              {
                "kind": "block",
                "type": "controls_repeat_ext",
                "inputs": {
                  "TIMES": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 10
                      }
                    }
                  }
                }
              },
              {
                "kind": "block",
                "type": "controls_whileUntil"
              },
              {
                "kind": "block",
                "type": "controls_for",
                "fields": {
                  "VAR": "i"
                },
                "inputs": {
                  "FROM": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 1
                      }
                    }
                  },
                  "TO": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 10
                      }
                    }
                  },
                  "BY": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 1
                      }
                    }
                  }
                }
              },
              {
                "kind": "block",
                "type": "controls_forEach"
              },
              {
                "kind": "block",
                "type": "controls_flow_statements"
              }
            ]
          },
          {
            "kind": "category",
            "name": "数学",
            "categorystyle": "math_category",
            "contents": [
              {
                "kind": "block",
                "type": "math_number",
                "fields": {
                  "NUM": 123
                }
              },
              {
                "kind": "block",
                "type": "math_arithmetic",
                "fields": {
                  "OP": "ADD"
                }
              },
              {
                "kind": "block",
                "type": "math_single",
                "fields": {
                  "OP": "ROOT"
                }
              },
              {
                "kind": "block",
                "type": "math_trig",
                "fields": {
                  "OP": "SIN"
                }
              },
              {
                "kind": "block",
                "type": "math_constant",
                "fields": {
                  "CONSTANT": "PI"
                }
              },
              {
                "kind": "block",
                "type": "math_number_property",
                "extraState": "<mutation divisor_input=\"false\"></mutation>",
                "fields": {
                  "PROPERTY": "EVEN"
                }
              },
              {
                "kind": "block",
                "type": "math_round",
                "fields": {
                  "OP": "ROUND"
                }
              },
              {
                "kind": "block",
                "type": "math_on_list",
                "extraState": "<mutation op=\"SUM\"></mutation>",
                "fields": {
                  "OP": "SUM"
                }
              },
              {
                "kind": "block",
                "type": "math_modulo"
              },
              {
                "kind": "block",
                "type": "math_constrain",
                "inputs": {
                  "LOW": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 1
                      }
                    }
                  },
                  "HIGH": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 100
                      }
                    }
                  }
                }
              },
              {
                "kind": "block",
                "type": "math_random_int",
                "inputs": {
                  "FROM": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 1
                      }
                    }
                  },
                  "TO": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 100
                      }
                    }
                  }
                }
              },
              {
                "kind": "block",
                "type": "math_random_float"
              },
              {
                "kind": "block",
                "type": "math_atan2"
              }
            ]
          },
          {
            "kind": "category",
            "name": "列表",
            "categorystyle": "list_category",
            "contents": [
              {
                "kind": "block",
                "type": "lists_create_empty"
              },
              {
                "kind": "block",
                "type": "lists_create_with",
                "extraState": {
                  "itemCount": 3
                }
              },
              {
                "kind": "block",
                "type": "lists_repeat",
                "inputs": {
                  "NUM": {
                    "block": {
                      "type": "math_number",
                      "fields": {
                        "NUM": 5
                      }
                    }
                  }
                }
              },
              {
                "kind": "block",
                "type": "lists_length"
              },
              {
                "kind": "block",
                "type": "lists_isEmpty"
              },
              {
                "kind": "block",
                "type": "lists_indexOf",
                "fields": {
                  "END": "FIRST"
                }
              },
              {
                "kind": "block",
                "type": "lists_getIndex",
                "fields": {
                  "MODE": "GET",
                  "WHERE": "FROM_START"
                }
              },
              {
                "kind": "block",
                "type": "lists_setIndex",
                "fields": {
                  "MODE": "SET",
                  "WHERE": "FROM_START"
                }
              }
            ]
          },
          {
            "kind": "sep"
          },
          {
            "kind": "category",
            "name": "变量",
            "categorystyle": "variable_category",
            "custom": "VARIABLE"
          },
          {
            "kind": "category",
            "name": "函数",
            "categorystyle": "procedure_category",
            "custom": "PROCEDURE"
          },
          {
            "kind": "category",
            "name": "记录",
            "expanded": "true",
            "contents": [
              {
                "kind": "category",
                "name": "随机",
                "contents": [
                  {
                    "kind": "block",
                    "type": "procedures_defnoreturn",
                    "extraState": {
                      "params": [
                        {
                          "name": "list"
                        }
                      ]
                    },
                    "icons": {
                      "comment": {
                        "text": "Describe this function...",
                        "pinned": false,
                        "height": 80,
                        "width": 160
                      }
                    },
                    "fields": {
                      "NAME": "randomize"
                    },
                    "inputs": {
                      "STACK": {
                        "block": {
                          "type": "controls_for",
                          "fields": {
                            "VAR": {
                              "name": "x"
                            }
                          },
                          "inputs": {
                            "FROM": {
                              "block": {
                                "type": "math_number",
                                "fields": {
                                  "NUM": 1
                                }
                              }
                            },
                            "TO": {
                              "block": {
                                "type": "lists_length",
                                "inline": false,
                                "inputs": {
                                  "VALUE": {
                                    "block": {
                                      "type": "variables_get",
                                      "fields": {
                                        "VAR": {
                                          "name": "list"
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "BY": {
                              "block": {
                                "type": "math_number",
                                "fields": {
                                  "NUM": 1
                                }
                              }
                            },
                            "DO": {
                              "block": {
                                "type": "variables_set",
                                "inline": false,
                                "fields": {
                                  "VAR": {
                                    "name": "y"
                                  }
                                },
                                "inputs": {
                                  "VALUE": {
                                    "block": {
                                      "type": "math_random_int",
                                      "inputs": {
                                        "FROM": {
                                          "block": {
                                            "type": "math_number",
                                            "fields": {
                                              "NUM": 1
                                            }
                                          }
                                        },
                                        "TO": {
                                          "block": {
                                            "type": "lists_length",
                                            "inline": false,
                                            "inputs": {
                                              "VALUE": {
                                                "block": {
                                                  "type": "variables_get",
                                                  "fields": {
                                                    "VAR": {
                                                      "name": "list"
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "next": {
                                  "block": {
                                    "type": "variables_set",
                                    "inline": false,
                                    "fields": {
                                      "VAR": {
                                        "name": "temp"
                                      }
                                    },
                                    "inputs": {
                                      "VALUE": {
                                        "block": {
                                          "type": "lists_getIndex",
                                          "fields": {
                                            "MODE": "GET",
                                            "WHERE": "FROM_START"
                                          },
                                          "inputs": {
                                            "VALUE": {
                                              "block": {
                                                "type": "variables_get",
                                                "fields": {
                                                  "VAR": {
                                                    "name": "list"
                                                  }
                                                }
                                              }
                                            },
                                            "AT": {
                                              "block": {
                                                "type": "variables_get",
                                                "fields": {
                                                  "VAR": {
                                                    "name": "y"
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "next": {
                                      "block": {
                                        "type": "lists_setIndex",
                                        "inline": false,
                                        "fields": {
                                          "MODE": "SET",
                                          "WHERE": "FROM_START"
                                        },
                                        "inputs": {
                                          "LIST": {
                                            "block": {
                                              "type": "variables_get",
                                              "fields": {
                                                "VAR": {
                                                  "name": "list"
                                                }
                                              }
                                            }
                                          },
                                          "AT": {
                                            "block": {
                                              "type": "variables_get",
                                              "fields": {
                                                "VAR": {
                                                  "name": "y"
                                                }
                                              }
                                            }
                                          },
                                          "TO": {
                                            "block": {
                                              "type": "lists_getIndex",
                                              "fields": {
                                                "MODE": "GET",
                                                "WHERE": "FROM_START"
                                              },
                                              "inputs": {
                                                "VALUE": {
                                                  "block": {
                                                    "type": "variables_get",
                                                    "fields": {
                                                      "VAR": {
                                                        "name": "list"
                                                      }
                                                    }
                                                  }
                                                },
                                                "AT": {
                                                  "block": {
                                                    "type": "variables_get",
                                                    "fields": {
                                                      "VAR": {
                                                        "name": "x"
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        },
                                        "next": {
                                          "block": {
                                            "type": "lists_setIndex",
                                            "inline": false,
                                            "fields": {
                                              "MODE": "SET",
                                              "WHERE": "FROM_START"
                                            },
                                            "inputs": {
                                              "LIST": {
                                                "block": {
                                                  "type": "variables_get",
                                                  "fields": {
                                                    "VAR": {
                                                      "name": "list"
                                                    }
                                                  }
                                                }
                                              },
                                              "AT": {
                                                "block": {
                                                  "type": "variables_get",
                                                  "fields": {
                                                    "VAR": {
                                                      "name": "x"
                                                    }
                                                  }
                                                }
                                              },
                                              "TO": {
                                                "block": {
                                                  "type": "variables_get",
                                                  "fields": {
                                                    "VAR": {
                                                      "name": "temp"
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              },
              {
                "kind": "category",
                "name": "随意输出",
                "contents": [
                  {
                    "kind": "block",
                    "type": "text_print",
                    "inputs": {
                      "TEXT": {
                        "block": {
                          "type": "text",
                          "fields": {
                            "TEXT": "'Twas brillig, and the slithy toves"
                          }
                        }
                      }
                    },
                    "next": {
                      "block": {
                        "type": "text_print",
                        "inputs": {
                          "TEXT": {
                            "block": {
                              "type": "text",
                              "fields": {
                                "TEXT": "  Did gyre and gimble in the wabe:"
                              }
                            }
                          }
                        },
                        "next": {
                          "block": {
                            "type": "text_print",
                            "inputs": {
                              "TEXT": {
                                "block": {
                                  "type": "text",
                                  "fields": {
                                    "TEXT": "All mimsy were the borogroves,"
                                  }
                                }
                              }
                            },
                            "next": {
                              "block": {
                                "type": "text_print",
                                "inputs": {
                                  "TEXT": {
                                    "block": {
                                      "type": "text",
                                      "fields": {
                                        "TEXT": "  And the mome raths outgrabe."
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    "kind": "block",
                    "type": "text_print",
                    "inputs": {
                      "TEXT": {
                        "block": {
                          "type": "text",
                          "fields": {
                            "TEXT": "\"Beware the Jabberwock, my son!"
                          }
                        }
                      }
                    },
                    "next": {
                      "block": {
                        "type": "text_print",
                        "inputs": {
                          "TEXT": {
                            "block": {
                              "type": "text",
                              "fields": {
                                "TEXT": "  The jaws that bite, the claws that catch!"
                              }
                            }
                          }
                        },
                        "next": {
                          "block": {
                            "type": "text_print",
                            "inputs": {
                              "TEXT": {
                                "block": {
                                  "type": "text",
                                  "fields": {
                                    "TEXT": "Beware the Jubjub bird, and shun"
                                  }
                                }
                              }
                            },
                            "next": {
                              "block": {
                                "type": "text_print",
                                "inputs": {
                                  "TEXT": {
                                    "block": {
                                      "type": "text",
                                      "fields": {
                                        "TEXT": "  The frumious Bandersnatch!\""
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      blocksJsonArray: [{
        "type": "lib_add",
        "message0": '求和 %1 %2',
        "args0": [
          {
            "type": "input_value",
            "name": "a",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "b",
            "check": "Number"
          }
        ],
        "output": "null",
        "colour": 160,
        "tooltip": "求和",
      },
      {
        "type": "lib_add_define",
        "message0": '红外发送',
        "colour": 230,
        "tooltip": "红外发送功能声明", //comment 提示
      }],
    }
  },
  created() {
    // 在页面创建时重置滚动条位置
    window.scrollTo(0, 0);
  },
  mounted() {
    this.workspace = Blockly.inject('blocklyDiv', { toolbox: this.toolboxJson });
    this.initBlockly();

    // axios({
    //   method: "get",
    //   url: "http://192.168.2.64:9510/blockly-lib/all",
    //   // data: params,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     if (res.data.code !== 200) {
    //       return this.$message.error("获取失败");
    //     } else {
    //       const blockDefs = []; // 存储新生成的Blockly块的数组
    //   res.data.data.forEach((blockjson) => {
    //     const {
    //       name,
    //       func,
    //       comment,
    //       params
    //     } = blockjson; // 解构块对象的属性

    //     const paramsNameType = JSON.parse(params);

    //     const lib_xxx = {
    //       type: `lib_${func}`,
    //       message0: `${name} ${Object.keys(paramsNameType).map((key, index) => `%${index + 1}`).join(" ")}`,
    //       args0: Object.keys(paramsNameType).map((key) => ({
    //         type: "input_value",
    //         name: key,
    //         check: paramsNameType[key]
    //       })),
    //       output: "null",
    //       colour: 160,
    //       tooltip: comment,
    //     };

    //     blockDefs.push(lib_xxx); // 将新生成的Blockly块添加到数组中
    //   });

    //   Blockly.defineBlocksWithJsonArray(blockDefs); // 定义所有新生成的Blockly块
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

  },
  methods: {
    initBlockly() {
      // 注册自定义块
      Blockly.defineBlocksWithJsonArray(this.blocksJsonArray);
      // 添加生成器函数
      this.blockGenerator();
      // 注入到 blockly-div 中
      // this.workspace = Blockly.inject('blocklyDiv', { toolbox: this.toolboxJson });
      // 为工作区添加修改事件，触发调用 updateCode 函数
      this.workspace.addChangeListener(this.updateCode);
    },

    // 更新当前块对应的 JS 代码
    updateCode() {
      // 获取当前块对应的 JS 代码
      this.latestCode = luaGenerator.workspaceToCode(this.workspace);
    },

    // 添加生成器函数，即每个自定义块要生成什么代码
    blockGenerator() {
      luaGenerator['lib_add_define'] = function (block) {
        return 'function add (a, b)\n' +
          '  return a+b\n' +
          'end';
      };

      luaGenerator['lib_add'] = function (block) {
        var a = javascriptGenerator.valueToCode(block, 'a',
          javascriptGenerator.ORDER_FUNCTION_CALL);
        var b = javascriptGenerator.valueToCode(block, 'b',
          javascriptGenerator.ORDER_FUNCTION_CALL);

        return ['add(' + a + ',' + b + ')', javascriptGenerator.ORDER_FUNCTION_CALL];
      };
    },


    getLuaCode() {
      this.latestCode = luaGenerator.workspaceToCode(this.workspace);
      // document.getElementById('screen-bottom').value = this.latestCode;
      const xmlData = Blockly.Xml.workspaceToDom(this.workspace);
      const xmlString = new XMLSerializer().serializeToString(xmlData);
      const params = {
        xmlData: xmlString
      }
      getBlocklyCode(params)
        .then(res => {
          if (res.status === 200) {
            // console.log(res.data.code, '**');

          } else {
            console.log('报错');
          }
        })
        .catch(err => {
          console.log(err, 'AXIOS报错');
        })
    },

    loadLuaCode() {
      this.dialogVisible = true;
    }

  }
}
</script>

<style  scoped>
.body {
  margin-top: 800px;
}

.btnnav {
  height: 50px;
  /* display: flex; */
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rightaside {
  display: flex;
}

#blocklyDiv {
  height: 700px;
  width: 1300px;
}

#screen-top {
  height: 345px;
  width: 500px;
  border: 1px solid;
  border-color: rgb(188, 188, 188);
  margin-left: 10px;
  flex-wrap: wrap;
}

#screen-bottom {
  height: 345px;
  width: 500px;
  border: 1px solid;
  border-color: rgb(188, 188, 188);
  margin-left: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.a-label {
  font-size: large;
  margin: 10px;
}
</style>
