import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {cities,states} from '../../Data'

import './index.css'
import axios from 'axios'

class CreateCustomerForm extends Component{
    state = {
        customerDetails:{
            firstName: '',
            lastName: '',
            phone: '',
        },
        customerAddress: [ 
            {
                address_Id: uuidv4(),
                address:'',
                city:'',
                state:'',
                pincode:''
            } 
        ]
    }

    addAddressToNewCustomer = async (customerId)=>{
        const {customerAddress} = this.state
        const url = `http://localhost:5000/api/customers/${customerId}/addresses`

        try{
            for (const eachAddress of customerAddress){
                const response = await axios.post(url, {...eachAddress})
                console.log(response)
            }
        } catch (e) {
            console.log('Error:', e)
        }

    }

    createCustomer = async ()=>{
        const {customerDetails}=this.state
        const url= 'http://localhost:5000/api/customers'

        try{
            const response = await axios.post(url, {...customerDetails})
            console.log(response.data)
            const {customerId} = response.data
            await this.addAddressToNewCustomer(customerId)
        } catch (e) {
            console.log('Error:', e)
        }
    }

    onSubmitForm = async event =>{
        event.preventDefault()  
        await this.createCustomer()
        this.setState({
            customerDetails:{
            firstName: '',
            lastName: '',
            phone: '',
        },
        customerAddress: [ 
            {
                address_Id: uuidv4(),
                address:'',
                city:'',
                state:'',
                pincode:''
            }
        ]
        })
    }

    onEnterCustomerDetails = event =>{
        const {name,value} = event.target
        this.setState(prevState=>({customerDetails: {...prevState.customerDetails, [name]: value}}))
    }

    onEnterAddressDetails = (index,event) =>{
        const {name,value} = event.target
        this.setState(prevState=>{
            const updatedAddress = [...prevState.customerAddress]
            updatedAddress[index] = {...updatedAddress[index], [name]:value}
            return {customerAddress: updatedAddress}
        })
    }

    addNewAddress = () =>{
        this.setState(prevState=>({
            customerAddress:[
                ...prevState.customerAddress,
                {
                    address_Id: uuidv4(),
                    address:'',
                    city:'',
                    state:'',
                    pincode:''
                }
            ]
        }))
    }

    onCancelChanges = () =>{
        this.setState({
            customerDetails:{
            firstName: '',
            lastName: '',
            phone: '',
        },
        customerAddress: [ 
            {
                address_Id: uuidv4(),
                address:'',
                city:'',
                state:'',
                pincode:''
            }
        ]
        })
    }

    render(){
        const {customerDetails, customerAddress} = this.state
        const {firstName,lastName,phone} = customerDetails
        return(
            <form className="new-registration-main-container-form" onSubmit={this.onSubmitForm}>
                <h1>Customer Information</h1>
                <hr className='horizontal-line'/>
                <div className="form-first-last-name-phone">
                    <div className="name-input-container">
                        <label className="label-heading" htmlFor="first-name">First Name<span className="star-mark">*</span></label>
                        <input required className="input-element" id="first-name" type="text" name="firstName" value={firstName} onChange={this.onEnterCustomerDetails}/>
                    </div>
                    <div className="name-input-container">
                        <label className="label-heading" htmlFor="last-name">Last Name<span className="star-mark">*</span></label>
                        <input required className="input-element" id="last-name" type="text" name="lastName" value={lastName} onChange={this.onEnterCustomerDetails}/>
                    </div>
                    <div className="phone-input-container">
                        <label className="label-heading" htmlFor="phone-number">Mobile<span className="star-mark">*</span></label>
                        <input required className="input-element" id="phone-number" type="tel" name="phone" value={phone} onChange={this.onEnterCustomerDetails}/>
                    </div>
                </div>
                <h1>Address Information</h1>
                <hr className='horizontal-line'/>
                {customerAddress.map((eachAddress,index)=>(
                    <div key={eachAddress.address_Id} className="new-customer-address-main-container">
                        <div className="address-input-container">
                            <label className="label-heading" htmlFor='address-details'>Address {index+1}<span className='star-mark'>*</span></label>
                            <input required type="text" id='address-details' className="input-element" name='address' value={eachAddress.address} onChange={event=>this.onEnterAddressDetails(index,event)}/>
                        </div>
                        <div className='city-state-pin-container'>
                            <div className='city-input-container'>
                                <label className="label-heading" htmlFor='city'>City<span className='star-mark'>*</span></label>
                                <select required className="input-element" id='city' name='city' value={eachAddress.city} onChange={event=>this.onEnterAddressDetails(index,event)}>
                                    {cities.map(eachCity=>(
                                        <option key={eachCity.id} value={eachCity.name}>{eachCity.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='state-input-container'>
                                <label className="label-heading" htmlFor='state'>State<span className='star-mark'>*</span></label>
                                <select required className="input-element" id='state' name='state' value={eachAddress.state} onChange={event=>this.onEnterAddressDetails(index,event)}>
                                    {states.map(eachState=>(
                                        <option key={eachState.id} value={eachState.state}>{eachState.state}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="zip-input-container">
                                <label className="label-heading" htmlFor="zip-code">Pin Code<span className="star-mark">*</span></label>
                                <input required className="input-element" id="zip-code" type="text" name="pincode" value={eachAddress.pincode} onChange={event=>this.onEnterAddressDetails(index,event)}/>
                            </div>
                        </div>
                    </div>
                ))}
                <button type='button' className='add-button' onClick={this.addNewAddress}>+ Add Another Address</button>
                <div className='submit-cancel-button-container'>
                    <button type='submit' className='save-customer-button'>Save Customer</button>
                    <button type='button' className='cancel-button' onClick={this.onCancelChanges}>Cancel</button>
                </div>
            </form>
        )
    }
}

export default CreateCustomerForm