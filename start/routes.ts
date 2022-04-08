import Route from '@ioc:Adonis/Core/Route'

import './routes/auth'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
