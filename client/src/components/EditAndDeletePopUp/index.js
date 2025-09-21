import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Popup from "reactjs-popup"
import axios from "axios";

import {cities,states} from '../../Data'

import './index.css'

export const DeletePopUp = (props)=>{
    const {customerId} = props
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const onDelete = async (close) =>{
        try {
            setLoading(true)
            setError('')
            const url = `http://localhost:5000/api/customers/${customerId}`
            const response = await axios.delete(url)
            console.log(response)
            setLoading(false)
            close()
            navigate('/customers-list')
        } catch (e) {
            console.log('Error:', e)
            setError('Failed to delete data')
            setLoading(false)
        }
    }
    return (
        <Popup
            trigger={<button className="delete-button">Delete</button>}
            modal
            nested
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>&times;</button>
                    <div className="header">Confirm Delete</div>
                    <div className="content">
                        <p className="delete-confirmation-text">Are you sure you want to delete this customer?</p>
                        {error && <p className="error-text">{error}</p>}
                        <div className="actions">
                            <button
                                className="delete-confirm-button"
                                type="button"
                                onClick={() => onDelete(close)}
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                className="close-button"
                                type="button"
                                onClick={close}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}




export const EditPopUp = (props)=>{
    const {customerData, onUpdate} = props
    const [firstName, setFirstName]= useState(customerData.firstName)
    const [lastName, setLastName] = useState(customerData.lastName)
    const [phoneNumber, setPhoneNumber] = useState(customerData.phone)

    useEffect(() => {
        setFirstName(customerData.firstName)
        setLastName(customerData.lastName)
        setPhoneNumber(customerData.phone)
    }, [customerData])

    return (
        <Popup
            trigger={<button className="edit-button"> Edit </button>}
            modal
            nested
        >
            {close =>{
                const onSubmitEdits = async (event)=>{
                    event.preventDefault()
                    try{
                        const updatedData = {
                            firstName,
                            lastName,
                            phone: phoneNumber,
                        }
                        const url = `http://localhost:5000/api/customers/${customerData.id}`
                        const response = await axios.put(url, updatedData)
                        console.log(response)
                        if (onUpdate) onUpdate(updatedData)
                        close()
                    } catch (e){
                        console.log('Error:', e)
                    }
                }
                return (
            <div className="modal">
                <button className="close" onClick={close}>
                &times;
                </button>
                <div className="header"> Update Details </div>
                <div className="content">
                    <form onSubmit={onSubmitEdits}>
                        <div className="form-first-last-name-phone">
                            <div className="name-input-container">
                                <label className="label-heading" htmlFor="first-name">First Name</label>
                                <input className="input-element" id="first-name" type="text" name="firstName" value={firstName} onChange={event=>setFirstName(event.target.value)}/>
                            </div>
                            <div className="name-input-container">
                                <label className="label-heading" htmlFor="last-name">Last Name</label>
                                <input className="input-element" id="last-name" type="text" name="lastName" value={lastName} onChange={event=>setLastName(event.target.value)}/>
                            </div>
                            <div className="phone-input-container">
                                <label className="label-heading" htmlFor="phone-number">Mobile</label>
                                <input className="input-element" id="phone-number" type="tel" name="phone" value={phoneNumber} onChange={event=>setPhoneNumber(event.target.value)}/>
                            </div>
                        </div>
                        <div className="actions">
                            <button className="update-button" type="submit">Update Changes</button>  
                            <button
                                className="close-button"
                                type="button"
                                onClick={() => {
                                console.log('modal closed ');
                                close();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
            )}}
        </Popup>
    )
}


export const EditAddressesPopUp = (props) =>{
    const {addressData,onUpdate} = props
    const [addressDetails, setAddressDetails] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pinCode, setPinCode] = useState("")

    useEffect(() => {
        if (addressData) {
            setAddressDetails(addressData.addressDetails)
            setCity(addressData.city)
            setState(addressData.state)
            setPinCode(addressData.pinCode)
        }
    }, [addressData])
    return (
        <Popup
            trigger={<button className="address-edit-button"> Edit Address </button>}
            modal
            nested
        >
            {close =>{
                const onSubmitAddressEdits = async (event)=>{
                    event.preventDefault()
                    try{
                        const updatedData = {
                            addressDetails,
                            city,
                            state,
                            pinCode
                        }
                        const url = `http://localhost:5000/api/addresses/${addressData.id}`
                        const response = await axios.put(url, updatedData)
                        console.log(response)
                        if (onUpdate) onUpdate(updatedData)
                        close()
                    } catch (e){
                        console.log('Error:', e)
                    }
                }
                return (
            <div className="modal">
                <button className="close" onClick={close}>
                &times;
                </button>
                <div className="header"> Update Address </div>
                <div className="content">
                    <form onSubmit={onSubmitAddressEdits}>
                        <div className="new-customer-address-main-container">
                            <div className="address-input-container">
                                <label className="label-heading" htmlFor='address-details'>Address</label>
                                <input required type="text" id='address-details' className="input-element" name='address' value={addressDetails} onChange={event=>setAddressDetails(event.target.value)}/>
                            </div>
                            <div className='city-state-pin-container'>
                                <div className='city-input-container'>
                                    <label className="label-heading" htmlFor='city'>City</label>
                                    <select required className="input-element" id='city' name='city' value={city} onChange={event=>setCity(event.target.value)}>
                                        {cities.map(eachCity=>(
                                            <option key={eachCity.id} value={eachCity.name}>{eachCity.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='state-input-container'>
                                    <label className="label-heading" htmlFor='state'>State</label>
                                    <select required className="input-element" id='state' name='state' value={state} onChange={event=>setState(event.target.value)}>
                                        {states.map(eachState=>(
                                            <option key={eachState.id} value={eachState.state}>{eachState.state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="zip-input-container">
                                    <label className="label-heading" htmlFor="zip-code">Pin Code</label>
                                    <input required className="input-element" id="zip-code" type="text" name="pincode" value={pinCode} onChange={event=>setPinCode(event.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="actions">
                            <button className="update-button" type="submit">Update Changes</button>  
                            <button
                                className="close-button"
                                type="button"
                                onClick={() => {
                                console.log('modal closed ');
                                close();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
            )}}
        </Popup>
    )
}
