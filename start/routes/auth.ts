import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/user'

Route.post('login', async ({ auth, request, response, view }) => {
  const email = request.input('email')
  const password = request.input('password')

  const user = await User.query().where('email', email).first()

  if (!user) {
    return view.render('login', { error: 'Identifiant ou mot de passe invalide' })
  }

  if (user.provider !== 'web') {
    return view.render('login', { error: `Veuillez utiliser la connexion via ${user.provider}` })
  }

  if (!(await Hash.verify(user.password, password))) {
    return response.badRequest('Identifiant ou mot de passe invalide')
  }

  await auth.use('web').login(user)
})

Route.get('/login', async ({ view }) => {
  return view.render('login')
}).as('login')

Route.get('/home', async ({ view }) => {
  return view.render('home')
})
  .middleware('auth')
  .as('home')

Route.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect().toRoute('login')
}).as('logout')

const providers: ('google' | 'facebook')[] = ['google', 'facebook']

providers.forEach((providerName: 'google' | 'facebook') => {
  Route.get(`/${providerName}/redirect`, async ({ ally }) => {
    return ally.use(providerName).redirect()
  }).as(`auth.${providerName}`)

  Route.get(`/${providerName}/callback`, async ({ ally, auth, response }) => {
    const provider = ally.use(providerName)

    if (provider.accessDenied()) {
      return 'Access was denied'
    }

    if (provider.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (provider.hasError()) {
      return provider.getError()
    }

    const providerUser = await provider.user()

    const user = await User.firstOrCreate(
      {
        email: providerUser.email!,
      },
      {
        name: providerUser.name,
        accessToken: providerUser.token.token,
        isVerified: providerUser.emailVerificationState === 'verified',
        provider: providerName,
        password: 'default',
      }
    )

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  })
})
