const express = require('express')
const axios = require('axios')

const app = express()

const port = 5555

function onListen () {
  console.log(`Listening on :${port}`)
}

const dataminerApi = 'http://localhost:4000'

function render (content) {
  const page = `<html>
  <head>
    <title>User Dashboard</title>
  </head>
  <body>
    ${content}
  </body>
</html>`

  return page
}

function renderHomepage (data) {
  // { rein: {}, david: {}, lisa: {} }
  const users = Object.keys(data)
  // ['rein', 'david', 'lisa']

  const paragraphs = users.map(user => {
    return `<p><a href='/user/${user}'>${user}</a></p>`
  })

  // const array = ['a', 'b', 'c']
  // const joined = array.join('-----')
  // joined === 'a-----b-----c'
  const joined = paragraphs.join('')
  // '<p>David</p><p>Rein</p><p>Lisa</p>'

  const content = `<h1>Users</h1>
 ${joined}`

  const page = render(content)

  return page
}

app.get(
  '/',
  async (request, response) => {
    try {
      const dataminerResponse = await axios.get(dataminerApi)

      const { data } = dataminerResponse

      console.log('data test:', data)

      const page = renderHomepage(data)

      response.send(page)
    } catch (error) {
      console.log('error.message test:', error.message)
    }
  }
)

app.get(
  '/user/:name',
  async (request, response, next) => {
    try {
      const { name } = request.params
      // const name = request.params.name
      
      const url = `${dataminerApi}/user/${name}`
      // http://localhost:4000/user/:name

      const dataminerResponse = await axios.get(url)

      const { data } = dataminerResponse
      // const data = dataminerResponse.data
      // { hours: 1, website: 'x.com', job: 'something' }

      const content = `<h1>${name}</h1>
<p>Occupation: ${data.job}</p>
<p>Last visited website: ${dataminerResponse.data.website}</p>
<p>Hours online per day: ${data.hours}</p>
`

      const page = render(content)

      response.send(page)
    } catch (error) {
      next(error)
    }
  }
)

app.listen(port, onListen)