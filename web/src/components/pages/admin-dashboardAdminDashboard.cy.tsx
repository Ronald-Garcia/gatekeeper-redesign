import AdminDashboard from './admin-dashboard'


//cypress testing for admin dashboard. 
describe('<AdminDashboard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdminDashboard />)
  })
})