import { Component } from 'react'

import axios from 'axios'
import { FaExclamationTriangle } from "react-icons/fa";
import { EditPopUp, DeletePopUp, EditAddressesPopUp }from '../EditAndDeletePopUp'
import './index.css'

class EditCustomerForm extends Component{
    state={customerId:'', customerDataPresent: false, customerData:{}, addressData:[]}

    onEnterCustomerId = event=>{
        this.setState({customerId: event.target.value})
    }

    getCustomerDetails = async (id) =>{
        const url = `http://localhost:5000/api/customers/${id}`

        try{
            const response = await axios.get(url)
            console.log(response)
            const updatedData = {
                id: response.data.id,
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                phone: response.data.phone_number
            }
            this.setState({customerData:updatedData})
        } catch (e) {
            console.log('Error:', e)
            this.setState({ customerData: {} })
        }
    }
    getAddressDetails = async (id) =>{
        const url = `http://localhost:5000/api/customers/${id}/addresses`
        try{
            const response = await axios.get(url)
            console.log(response)
            const updatedData = response.data.addresses.map(eachObj=>({
                id: eachObj.id,
                customerId: eachObj.customer_id,
                addressDetails: eachObj.address_details,
                city: eachObj.city,
                state: eachObj.state,
                pinCode: eachObj.pin_code
            }))
            
            this.setState({addressData:updatedData, customerDataPresent: response.data.addresses.length>0})
        } catch (e) {
            console.log('Error:', e)
            this.setState({addressData:[], customerDataPresent:false})
        }
    }

    onSubmitForm = event =>{
        const {customerId}=this.state
        event.preventDefault()
        this.getCustomerDetails(customerId)
        this.getAddressDetails(customerId)
    }


    render(){
        const {customerId,customerData, customerDataPresent, addressData}=this.state
        const {firstName,lastName, phone} = customerData
        return(
            <form className="edit-customer-main-container-form" onSubmit={this.onSubmitForm}>
                <h1>Update Customer Information</h1>
                <hr className='horizontal-line'/>
                <div className="phone-customerid-container">
                    <div className="customerId-input-container">
                        <label className="label-heading" htmlFor="customer-id">Customer ID<span className="star-mark">*</span></label>
                        <input required className="input-element" id="customer-id" type="text" name="customerId" value={customerId} onChange={this.onEnterCustomerId}/>
                    </div>
                </div>
                <button type='submit' className='check-button'>Check Customer</button>
                {customerDataPresent && (
                    <div>
                        <div className='customer-data-container'>
                            <div className='edit-customer-info-container'>
                                <div>
                                    <h1 className='customer-name'>{firstName}{" "}{lastName}</h1>
                                    <p className='phone-number-title'><span className='sub-title'>Phone:</span> {phone}</p>
                                    <p className='customer-id-title'><span className='sub-title'>Customer ID:</span> {customerData.id}</p>     
                                    <EditPopUp 
                                        customerData={customerData}
                                        onUpdate={(updatedCustomer) =>
                                            this.setState(prevState => ({
                                            customerData: { ...prevState.customerData, ...updatedCustomer }
                                            }))
                                        }
                                    />
                                </div>
                                <DeletePopUp 
                                    customerId={customerId}
                                />
                            </div>
                        </div>
                        <div className='address-heading-container'>
                            <h1 className='address-title-heading'>Addresses</h1>
                            {addressData.length===1 && (
                                <div className='note-container'>
                                    <FaExclamationTriangle className='caution-icon'/>
                                    <p>Only One Address</p>
                                </div>
                            )}
                        </div>
                        <ul className='addresses-unordered-list'>
                            {addressData.map(eachAddress=>(
                                <li key={eachAddress.id} className='each-address-list-item'>
                                    <p className='address-details-text'>{eachAddress.addressDetails}{", "}{eachAddress.city}{", "}{eachAddress.state}{", "}{eachAddress.pinCode}</p>
                                    <EditAddressesPopUp 
                                        addressData={eachAddress} 
                                        onUpdate={(updatedAddress) => {
                                            this.setState(prevState => ({
                                                addressData: prevState.addressData.map(addr =>
                                                    addr.id === eachAddress.id ? { ...addr, ...updatedAddress } : addr
                                                )
                                            }))
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        )
    }

}

export default EditCustomerForm