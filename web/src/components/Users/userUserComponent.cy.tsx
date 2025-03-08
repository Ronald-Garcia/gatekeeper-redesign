import UserComponent from './user'

describe('<UserComponent />', () => {
  it('renders', () => {
    cy.mount(<UserComponent user={{
      id: 0,
      name: '',
      cardNum: '',
      lastDigitOfCardNum: 0,
      JHED: '',
      isAdmin: 0,
      graduationYear: 0
    }} />)
  })
})