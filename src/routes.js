import { Router } from 'express'

const routes = new Router()

routes.get('/', (req,res) => {
  return res.json({ message: 'people somenthing do know'})
})

export default routes