import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import ConsoleLink from './ConsoleLink.vue'
import SwaggerLink from './SwaggerLink.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ConsoleLink', ConsoleLink)
    app.component('SwaggerLink', SwaggerLink)
  },
} satisfies Theme
