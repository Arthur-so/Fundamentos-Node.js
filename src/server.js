import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './middlewares/routes.js'
import { extreactQueryParams } from './utils/extrect-query-params.js'

// Query parameters: URL Stateful => ex: filtros (opcionais) = http://localhost:3333/users?userID=1&name=Arthur
// Route parameters: Identificação de recurso = GET http://localhost:3333/users/1
// Request body: Envio de informações de um formulário (HTTPs)

const server = http.createServer(async(req, res) => {
     const {method, url} = req

    await json(req, res)

     const route = routes.find(route => {
          return route.method == method && route.path.test(url)
     })

     if (route) {
          const routeParams = req.url.match(route.path)

          const {query, ...params} = routeParams.groups

          req.params = params
          req.query = query ? extreactQueryParams(query) : ''

          return route.handler(req, res)
     }

     return res.writeHead(404).end()
})

server.listen(3333)