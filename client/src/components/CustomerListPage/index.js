import { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { BsFilterRight } from "react-icons/bs"
import {DeletePopUp} from '../EditAndDeletePopUp'
import Banner from '../Banner'
import FiltersGroup from '../FiltersGroup'
import {cities, states, sortbyOptions} from '../../Data'

import './index.css'


class CustomerListPage extends Component{
    state = {customersList: [], activeOptionId: sortbyOptions[0].optionId, searchedName:'', cityArr:[], stateArr:[]}

    componentDidMount() {
        this.getCustomersList()
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.searchedName !== this.state.searchedName ||
            prevState.activeOptionId !== this.state.activeOptionId ||
            prevState.cityArr !== this.state.cityArr ||
            prevState.stateArr !== this.state.stateArr
        ) {
            this.getCustomersList()
        }
    }

    getCustomersList = async () =>{
        const {searchedName, activeOptionId, cityArr, stateArr} = this.state
        const url = 'http://localhost:5000/api/customers'
        try{
        const response = await axios.get(url, {
            params:{
                name: searchedName,
                city: cityArr.join(","),
                state: stateArr.join(","),
                order_by: activeOptionId,
                limit: 10,
                offset:0
            }
        })
        
        console.log(response)
        this.setState({customersList: response.data})
        } catch (e) {
            console.error('Error:', e)
        }
    }

    onSearchName = event =>{
        this.setState({searchedName: event.target.value})
    }

    onChangeSortBy = event =>{
        this.setState({activeOptionId:event.target.value})   
    }

    onClearFilters = () =>{
        this.setState({
            activeOptionId: sortbyOptions[0].optionId,
            searchedName:'',
            cityArr: [],
            stateArr: []
        },this.getCustomersList)
        
    }

    onSelectCities = name =>{
        this.setState(prevState=>({
           cityArr: prevState.cityArr.includes(name) ? prevState.cityArr.filter(eachCity=> eachCity !== name): [...prevState.cityArr, name]
        }))
    }

    onSelectStates = state =>{
        this.setState(prevState=>({
            stateArr: prevState.stateArr.includes(state) ? prevState.stateArr.filter(eachState=> eachState !== state) : [...prevState.stateArr,state]
        }))
    }

    render () {
       const {customersList, activeOptionId,searchedName,cityArr, stateArr} = this.state 
        return (
            <div className='customers-list-page-main-container'>
                <Banner/>
                <nav className='nav-container'>
                    <Link to="/customers-list" className='banner-heading-link'>
                        <h1 className='banner-heading'>Customer Management</h1>
                    </Link>
                    <Link to="/customer-form">
                        <button type='button' className='add-customer-button'>Add Customer</button>
                    </Link>  
                </nav>
                <hr className='horizontal-line'/>
                <div className='search-and-sort-container'>
                    <input type='search' placeholder='Search by name' className='search-input-element' value={searchedName} onChange={this.onSearchName}/>
                    <div className='sort-by-container'>
                        <BsFilterRight className='sort-by-icon' />
                        <h1 className='sort-by-heading'>Sort by</h1>
                        <select className='sort-by-select' value={activeOptionId} onChange={this.onChangeSortBy}>
                            {sortbyOptions.map(eachOption =>(
                                <option 
                                    key={eachOption.optionId} 
                                    value={eachOption.optionId}
                                    className='select-option'
                                >
                                    {eachOption.displayText}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='filter-and-list-main-container'>
                    <FiltersGroup
                        cities={cities}
                        states = {states}
                        sortbyOptions={sortbyOptions}
                        activeOptionId={activeOptionId}
                        searchedName={searchedName}
                        cityArr={cityArr}
                        stateArr={stateArr}
                        onSelectCities={this.onSelectCities}
                        onSelectStates={this.onSelectStates}
                        onSearchName = {this.onSearchName}
                        onChangeSortBy={this.onChangeSortBy}
                        onClearFilters={this.onClearFilters}
                    />
                    <div className='customers-list-main-container'>
                        <table className='customers-list-table'>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {customersList.map((eachObj,index)=>(
                                    <tr key={eachObj.id}>
                                        <td>{index+1}</td>
                                        <td>{eachObj.first_name}</td>
                                        <td>{eachObj.last_name}</td>
                                        <td>{eachObj.phone_number}</td>
                                        <td>{eachObj.city}</td>
                                        <td>{eachObj.state}</td>
                                        <td>
                                            <div className='delete-view-button-container'>
                                                <Link to={`/customer-details/${eachObj.customer_id}`}>
                                                    <button type='button' className='view-button'>View</button>
                                                </Link>
                                                <DeletePopUp customerId={eachObj.customer_id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomerListPage