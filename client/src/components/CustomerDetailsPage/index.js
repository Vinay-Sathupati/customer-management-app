import { useState, useEffect } from 'react'
import axios from 'axios'
import {EditPopUp, EditAddressesPopUp, DeletePopUp} from '../EditAndDeletePopUp'
import { FaExclamationTriangle } from "react-icons/fa";

import { useParams, Link } from 'react-router-dom'
import Banner from '../Banner'
import './index.css'


const CustomerDetailsPage = ()=> {
    const [customerData, setCustomerData] = useState({})
    const [addressData, setAddressData] = useState([])
    const {id} = useParams()

    useEffect(()=>{        
        const getCustomerDetails = async () =>{
            const url = `http://localhost:5000/api/customers/${id}`

            try{
                const response = await axios.get(url)
                console.log(response)
                setCustomerData({
                    id: response.data.id,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    phone: response.data.phone_number
                })
            } catch (e) {
                console.log('Error:', e)
            }
        }
        const getAddressDetails = async () =>{
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
                setAddressData(updatedData)
            } catch (e) {
                console.log('Error:', e)
            }
        }
        getCustomerDetails()
        getAddressDetails()
    },[id])

    const {firstName,lastName, phone} = customerData
    return(
        <div>
            <Banner />
            <nav className='nav-container'>
                <Link to={`/customer-details/${id}`} className='banner-heading-link'>
                    <h1 className='banner-heading'>Customer Details</h1>
                </Link>
                <div className='edit-delete-button-main-container'>
                    <div className='edit-buttom-container'>
                        <EditPopUp 
                            customerData={customerData}
                            onUpdate={(updatedCustomer) =>
                                setCustomerData(prev => ({ ...prev, ...updatedCustomer }))
                            }
                        />
                    </div>
                    <div className='delete-buttom-container'>
                        <DeletePopUp customerId={customerData.id}/>
                    </div>
                </div>  
            </nav>
            <hr className='horizontal-line'/>
            <div className='customer-details-main-container'>
                <div className='customer-details-card-container'>
                    <div className='customer-info-container'>
                        <h1 className='customer-full-name'>{firstName}{" "}{lastName}</h1>
                        <div className='phone-id-container'>
                            <p className='phone-number-title'><span className='sub-title'>Phone: </span>{phone}</p>
                            <p className='customer-id-title'><span className='sub-title'>Customer ID:</span> {customerData.id}</p>
                        </div>        
                    </div>
                    <hr className='horizontal-line'/>
                    <div>
                        <div className='address-heading-container'>
                            <h1 className='address-title-heading'>Addresses</h1>
                            {addressData.length>1? (''): (
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
                                        onUpdate={(updatedAddress) =>
                                            setAddressData(prev =>
                                                prev.map(addr =>
                                                    addr.id === updatedAddress.id ? updatedAddress : addr
                                                )
                                            )
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
        
    


export default CustomerDetailsPage