import { Component } from 'react'
import { Link } from 'react-router-dom'
import Banner from '../Banner'

import CreateCustomerForm from '../CreateCustomerForm'
import EditCustomerForm from '../EditCustomerForm'

import './index.css'


const tabsList = [
    {tabId: 'NEW_REGISTRATION', displayText: 'Create New Customer'},
    {tabId: 'EDIT_DETAILS', displayText: 'Edit Exisitng Customer'},
]

class CustomerFormPage extends Component{
    state={activeTabId:tabsList[0].tabId}

    onChangeTab = tabId => {
        this.setState({activeTabId: tabId})
    }

    render(){
        const {activeTabId}=this.state
        return(
            <div>
                <Banner/>
                <nav className='nav-container'>
                    <Link to='/customer-form' className='banner-heading-link'>
                        <h1 className='banner-heading'>Customer Form</h1>
                    </Link>
                </nav>
                <hr className='horizontal-line'/>
                <div className='customer-form-main-container'>
                    <div className='customer-form-card-container'>
                        <ul className="tab-list-unordered">
                            {tabsList.map(eachTab => (
                            <li key={eachTab.tabId} className="tabs-list">
                                <button
                                    type="button"
                                    className={`tab-btn ${activeTabId === eachTab.tabId ? 'active-tab-btn' : ''}`}
                                    onClick={()=>this.onChangeTab(eachTab.tabId)}
                                >
                                    {eachTab.displayText}
                                </button>
                            </li>
                            ))}
                        </ul>
                        <div className='form-section'>
                            {activeTabId===tabsList[0].tabId ? (<CreateCustomerForm />) : (<EditCustomerForm />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomerFormPage