
import "../styles/globals.css"
import 'highlight.js/styles/stackoverflow-dark.css'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}