export async function json(req, res) {

    const buffers = []

    // faz a leitura completa
   for await (const chunk of req) {
       buffers.push(chunk)
   }

   // transforma em um obj java script
   try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
   } catch {
         req.body = null
   }

   res.setHeader('Content-type', 'application/json')
}