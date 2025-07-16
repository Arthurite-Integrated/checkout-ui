import server from './src/server'

console.log(await server.createBusiness({
  name: 'Test Business',
  email: 'test@example.com',
  street: '123 Test St',
  state: 'Test State',
  country: 'Test Country'
}))