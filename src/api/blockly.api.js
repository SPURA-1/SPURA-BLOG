import service from "@/utils/request"

//  Blockly代码返回

/**
 * @description Blockly
 * @url  /blockly/generateCode
 * */
export function getBlocklyCode(params) {
    return service.post('/blockly/generateCode', params);
}