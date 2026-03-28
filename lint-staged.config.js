export default {
  // TypeScript 文件
  '**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // Vue 文件
  '**/*.vue': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JavaScript 文件
  '**/*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // 样式文件
  '**/*.{css,scss,sass,less}': [
    'prettier --write',
  ],
  
  // 配置文件
  '**/*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
  
  // HTML 文件
  '**/*.html': [
    'prettier --write',
  ],
};