const https = require('https')
const fs = require('fs')

const regexHeader = /<head>\X*<\/head>/
const regexOgImage = /<meta.*property="og:image".*content="(.*)".*\/?>/g
const regexAllMeta = /<meta.*\/?>/g

const url = 'https://www.youtube.com/watch?v=3g3xmJXGVAU'

const req = https.get(url, (res) => {
  //   console.log('statusCode:', res.statusCode)
  //   console.log('headers:', res.headers)
  let str = ''
  res.on('data', (d) => {
    str += d
  })

  res.on('end', () => {
    let m

    while ((m = regexOgImage.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regexOgImage.lastIndex) {
        regexOgImage.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`)
      })
    }

    // file save for debugging
    fs.writeFile('./fetched.html', str, function (err) {
      if (err) return console.log(err)
      console.log('File saved.')
    })
  })
})

req.on('error', (e) => {
  console.error(e)
})

req.end()
