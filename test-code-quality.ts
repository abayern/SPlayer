// 测试代码质量自动化的文件
// 这个文件包含一些故意违反规则的代码，用于测试自动化工具

const testVariable = "测试变量"; // 未使用的变量

function testFunction(param: any) {
  // 使用any类型
  console.log("测试函数", param);

  if (param == "test") {
    // 使用==而不是===
    return true;
  }

  return false;
}

// 测试格式化
const longString =
  "这是一个非常长的字符串，用于测试Prettier的自动换行功能，看看它是否能够正确地处理超长的字符串并自动进行换行处理";

export { testFunction };
