import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 设置自定义颜色
      colors: {
        primary: {
          500: '#00B981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
}
export default config
