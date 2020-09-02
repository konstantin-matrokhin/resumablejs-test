import 'resumablejs'

let r

document.getElementById('form').addEventListener('submit', sendFile)
document.getElementById('pause').addEventListener('click', () => {
  if (!r) return
  log('Pause')
  r.pause()
})

document.getElementById('stop').addEventListener('click', () => {
  if (!r) return
  log('Stop')
  r.cancel()
})

document.getElementById('resume').addEventListener('click', () => {
  if (!r) return
  log('Resume')
  r.upload()
})

function sendFile(e) {
  e.preventDefault()
  const form = e.target
  r = new Resumable({
    target: form.url.value,
    // headers: {
    //   'Authorization': `Bearer ${ form.token.value }`,
    // },
    query: {
      documentType: 'ORDER_VIDEO',
      sourceRefValueId: 138,
    },
    testChunks: form.testChunks.checked,
    chunkSize: form.chunkSize.value * 1024 * 1024,
    method: 'octet',
  })

  r.addFile(document.getElementById('file').files[0])
  r.on('fileAdded', () => {
    r.upload()
  })

  r.on('error', (message) => {
    log('Error: ' + message)
  })

  r.on('progress', () => {
    document.getElementById('progress').innerText = Math.floor(r.progress()) * 100
  })

  r.on('catchAll', (event, file) => {
    log('Fired event: ' + event)
  })
}

function log(text) {
  const el = document.getElementById('log')
  el.value = `[${new Date().toLocaleString()}] ${text}\n${el.value}`
}
