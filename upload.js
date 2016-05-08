/* global XMLHttpRequest */

this.Uploader = function (config) {
  /*
    Function to carry out the actual PUT request to S3 using the signed request from the app.
  */
  function upload_file (file, signed_request) {
    var xhr = new XMLHttpRequest()
    xhr.open('PUT', signed_request)
    xhr.setRequestHeader('x-amz-acl', 'private')
    xhr.onload = function () {
      if (xhr.status === 200) {
        config.logger('<code>' + file.name + '</code> uploaded successfully!')
      } else {
        config.logger('upload failed :(')
      }
    }
    xhr.onerror = function () {
      config.logger(JSON.parse(xhr.responseText).errorMessage)
    }
    // xhr.upload.addEventListener('progress', function (e) {
    //   if (e.lengthComputable) {
    //     var percentLoaded = Math.round(e.loaded / e.total * 100)
    //     config.logger('<progress value="' + percentLoaded + '" max="100">' + percentLoaded + '%</progress>')
    //   }
    // })
    xhr.send(file)
  }

  /*
    Function to get the temporary signed request from the app.
    If request successful, continue to upload the file using this signed
    request.
  */
  function get_signed_request (file) {
    var url = config.signatory_url
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.responseText)
        if (xhr.status === 200) {
          config.logger(response.message)
          upload_file(file, response.signed_request)
        } else {
          config.logger(response.errorMessage)
        }
      }
    }
    var payload = JSON.stringify({
      filename: file.name,
      email: config.input.email.value,
      password: config.input.password.value
    })
    xhr.send(payload)
    config.logger('Logging in...')
  }

  /*
     Function called when file input updated. If there is a file selected, then
     start upload procedure by asking for a signed request from the app.
  */
  function init_upload () {
    var files = config.input.file.files
    var file = files[0]
    if (file.type !== 'image/gif') { return config.logger('It\'s gotta be a gif.') }
    if (file == null) { return config.logger('No file selected.') }
    get_signed_request(file)
  }

  /*
     Bind listeners when the page loads.
  */
  (function () {
    console.log('config', config)
    config.input.file.onchange = init_upload
  })()
}

