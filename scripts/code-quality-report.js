#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// 颜色输出
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

function colorize(text, color) {
  return `${colors[color] || colors.reset}${text}${colors.reset}`;
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: projectRoot,
      stdio: "pipe",
      encoding: "utf-8",
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

function getFileStats() {
  const stats = {
    totalFiles: 0,
    tsFiles: 0,
    vueFiles: 0,
    jsFiles: 0,
    styleFiles: 0,
    otherFiles: 0,
  };

  function countFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // 忽略一些目录
        if (["node_modules", "dist", "out", ".git", ".github", "coverage"].includes(file.name)) {
          continue;
        }
        countFiles(fullPath);
      } else {
        stats.totalFiles++;
        const ext = path.extname(file.name).toLowerCase();

        if (ext === ".ts" || ext === ".tsx") {
          stats.tsFiles++;
        } else if (ext === ".vue") {
          stats.vueFiles++;
        } else if (ext === ".js" || ext === ".jsx") {
          stats.jsFiles++;
        } else if (ext === ".css" || ext === ".scss" || ext === ".sass" || ext === ".less") {
          stats.styleFiles++;
        } else {
          stats.otherFiles++;
        }
      }
    }
  }

  countFiles(projectRoot);
  return stats;
}

function generateReport() {
  console.log(colorize("\n📊 代码质量报告生成器", "bold"));
  console.log(colorize("=".repeat(50), "cyan"));

  // 获取文件统计
  console.log(colorize("\n📁 文件统计:", "bold"));
  const stats = getFileStats();
  console.log(`  总文件数: ${colorize(stats.totalFiles.toString(), "green")}`);
  console.log(`  TypeScript 文件: ${colorize(stats.tsFiles.toString(), "blue")}`);
  console.log(`  Vue 文件: ${colorize(stats.vueFiles.toString(), "magenta")}`);
  console.log(`  JavaScript 文件: ${colorize(stats.jsFiles.toString(), "yellow")}`);
  console.log(`  样式文件: ${colorize(stats.styleFiles.toString(), "cyan")}`);
  console.log(`  其他文件: ${colorize(stats.otherFiles.toString(), "white")}`);

  // 运行类型检查
  console.log(colorize("\n🔍 类型检查:", "bold"));
  const typecheckResult = runCommand("pnpm typecheck");
  if (typecheckResult.success) {
    console.log(colorize("  ✅ 类型检查通过", "green"));
  } else {
    console.log(colorize("  ❌ 类型检查失败", "red"));
    console.log(colorize(`  错误信息: ${typecheckResult.output}`, "red"));
  }

  // 运行 ESLint 检查
  console.log(colorize("\n📝 ESLint 检查:", "bold"));
  const eslintResult = runCommand("pnpm lint");
  if (eslintResult.success) {
    console.log(colorize("  ✅ ESLint 检查通过", "green"));
  } else {
    console.log(colorize("  ❌ ESLint 检查失败", "red"));
    console.log(colorize(`  错误信息: ${eslintResult.output}`, "red"));
  }

  // 运行 Prettier 检查
  console.log(colorize("\n🎨 Prettier 格式化检查:", "bold"));
  const prettierResult = runCommand("pnpm format --check");
  if (prettierResult.success) {
    console.log(colorize("  ✅ 代码格式化检查通过", "green"));
  } else {
    console.log(colorize("  ⚠️  代码格式化需要调整", "yellow"));
    console.log(colorize(`  提示: 运行 ${colorize("pnpm format", "cyan")} 自动格式化`, "yellow"));
  }

  // 运行构建检查（跳过原生构建，需要Rust环境）
  console.log(colorize("\n🔨 构建检查:", "bold"));
  console.log(colorize("  ⚠️  跳过原生构建检查（需要Rust环境）", "yellow"));
  console.log(colorize("  提示: 如需完整构建检查，请安装Rust工具链", "white"));
  const _buildResult = { success: true, output: "跳过原生构建检查" };

  // 总结
  console.log(colorize("\n📈 总结:", "bold"));
  console.log(colorize("=".repeat(50), "cyan"));

  const allPassed = typecheckResult.success && eslintResult.success;

  if (allPassed) {
    console.log(colorize("🎉 所有代码质量检查通过！", "green"));
    console.log(colorize("   项目代码质量优秀，可以继续开发。", "green"));
  } else {
    console.log(colorize("⚠️  代码质量检查发现问题，请修复后再提交。", "yellow"));
    console.log(colorize("   建议修复步骤:", "yellow"));
    console.log(colorize("   1. 运行 pnpm lint:fix 修复ESLint问题", "cyan"));
    console.log(colorize("   2. 运行 pnpm format 格式化代码", "cyan"));
    console.log(colorize("   3. 修复TypeScript类型错误", "cyan"));
    console.log(colorize("   4. 重新运行构建检查", "cyan"));
  }

  console.log(colorize("\n💡 提示:", "bold"));
  console.log(colorize("   - 提交前会自动运行代码质量检查", "white"));
  console.log(colorize("   - 使用 Git 钩子确保代码质量", "white"));
  console.log(colorize("   - CI/CD 会进行完整的质量检查", "white"));

  return allPassed;
}

// 运行报告生成
try {
  const success = generateReport();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error(colorize(`❌ 报告生成失败: ${error.message}`, "red"));
  process.exit(1);
}
