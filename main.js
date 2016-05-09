'use strict'

/* global config Uploader */

let i = Math.floor(Math.random() * 360)
console.log('i', i)
function loop () {
  i += 0.1
  let html = document.getElementsByTagName('html')[0]
  html.style.backgroundColor = 'hsl(' + i % 360 + ', 100%, 90%)'
  window.requestAnimationFrame(loop)
}
window.requestAnimationFrame(loop)

const email = getParameterByName('email')
const code = getParameterByName('code')
if (email && code) {
  console.log('email', email, 'code', code)
  console.log('gotta validate email')
  const url = config.lambda_url + 'verify?email=' + email + '&code=' + code
  var xhr = new window.XMLHttpRequest()
  xhr.open('GET', url)
  flasher('Confirming your account and adding your gif...')
  xhr.onload = function () {
    if (xhr.status === 200) {
      return flasher('Verified email! Your gif is now showing up in people\'s browsers.')
    }
    flasher('Could not verify email address.')
  }
  xhr.onerror = function () {
    flasher('Could not verify email address.')
  }
  xhr.send()
}

var flashes = 0
function flasher (msg) {
  var el = document.getElementById('flash')
  flashes += 1
  const flash = flashes.toString()
  el.innerHTML += '<div class="flash" id="' + flash + '">' + msg + '<\/div>'
  setTimeout(function () {
    el.removeChild(document.getElementById(flash))
  }, 5000)
}

var xmlhttp = new window.XMLHttpRequest()
var url = 'http://b.ss.cx/http://list.radblock.xyz'
xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    var lots = JSON.parse(xmlhttp.responseText)
    var bigobject = lots[0]
    console.log('the big object is:', bigobject)
    var images = bigobject.works
    console.log(images)
    images.forEach(function (item) {
      var putGif = document.getElementById('gifs')
      putGif.innerHTML += '<div class="img-container"><img src="' + item.image + '"\/></div>'
      console.log('item', item)
    })
  }
}
xmlhttp.open('GET', url, true)
xmlhttp.send()

new Uploader({
  input: {
    file: document.getElementById('file'),
    email: document.getElementById('email'),
    password: document.getElementById('password')
  },
  signatory_url: config.lambda_url + 'submit',
  logger: flasher
})

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

