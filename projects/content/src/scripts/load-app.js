['polyfills.js', 'main.js'].forEach(path => {
  const elem = document.createElement('script')
  elem.src = browser.runtime.getURL(`content-script/${path}`)
  document.body.appendChild(elem)
})
