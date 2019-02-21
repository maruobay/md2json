const md = require('markdown-it')()
const hljs = require('highlight')
const emoji = require('markdown-it-emoji')
const container = require('markdown-it-container')
const mark = require('markdown-it-mark')
const meta = require('markdown-it-meta')
const anchor = require('markdown-it-anchor')
const toc = require('markdown-it-table-of-contents')

md.set({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'hljs language-',
  highlight (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {
        console.log(__)
      }
    }

    return ''
  },
})

md
  .use(emoji)
  .use(container)
  .use(mark)
  .use(meta)
  .use(anchor, {
    permalink: true,
    permalinkBefore: true,
  })
  .use(toc, {
    slugify: anchor.defaults.slugify,
    includeLevel: [2, 3],
  })

// toc custom
md.renderer.rules.toc_open = () => '<div class="table-of-contents"><div class="toc-title">- table of contents -</div>'
md.renderer.rules.toc_close = () => '</div>'

// link custom
const defaultRender = md.renderer.rules.link_open || function render (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const tokensLocal = tokens
  const hrefIndex = tokensLocal[idx].attrIndex('href')

  if (hrefIndex >= 0) {
    const link = tokensLocal[idx].attrs[hrefIndex]
    const href = link[1]
    const isExternal = /^https?:/.test(href) && !/\/\/isoppp.com\//.test(href)

    if (isExternal) {
      const aIndex = tokensLocal[idx].attrIndex('target')
      if (aIndex >= 0) {
        tokensLocal[idx].attrs[aIndex][1] = '_blank'
      } else {
        tokensLocal[idx].attrPush(['target', '_blank'])
      }
    }
  }

  // pass token to default renderer.
  return defaultRender(tokensLocal, idx, options, env, self)
}

module.exports = {
  md,
}
