import {Routes, Route} from 'react-router-dom'

import './App.css'

import CustomerListPage from './components/CustomerListPage'
import CustomerDetailsPage from './components/CustomerDetailsPage'
import CustomerFormPage from './components/CustomerFormPage'

const App = () => (
  <Routes>
    <Route path='/customers-list' element={<CustomerListPage/>}/>
    <Route path='/customer-details/:id' element={<CustomerDetailsPage/>}/>
    <Route path='/customer-form' element={<CustomerFormPage/>}/>
  </Routes>
)
export default App;
