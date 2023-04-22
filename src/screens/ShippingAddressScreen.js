import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckOutSteps from '../component/CheckOutSteps'
import {Store} from "../Store"

function ShippingAddressScreen() {

    const navigate = useNavigate();
    const{state, dispatch: ctxDispatch} = useContext(Store)
    const{userInfo,  cart: {shippingAddress} }= state

    const[fullName, setFullName] = useState(shippingAddress.fullName||"")
    const[address, setAddress] = useState(shippingAddress.address||"")
    const[city, setCity] = useState(shippingAddress.city||"")
    const[postalcode, setPostalcode] = useState(shippingAddress.postalcode||"")
    const[country, setCountry] = useState(shippingAddress.country||"")

const submitHandler = (e)=>{
    e.preventDefault();

    localStorage.setItem('shippingAddress',JSON.stringify({
        fullName,
        address,
        city,
        postalcode,
        country
    }))

    ctxDispatch({type:'SAVE_SHIPPING_ADDRESS',payload:{
        fullName,
        address,
        city,
        postalcode,
        country
    }});
   
    navigate('/payment')
}

useEffect(()=>{
    if(!userInfo){
        navigate('/signin?redirect=/shipping');
    }
},[userInfo, navigate])

  return (
    <div>
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            <CheckOutSteps step1 step2 />
            <div className='container small-container' id='small-container'>
            <h1 className='my-3'>Shipping Address</h1>
        <Form onSubmit={submitHandler} >
        <Form.Group className='mt-3'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
            value={fullName}
            onChange={(e)=>{setFullName(e.target.value)}}
            required
              />
           
        </Form.Group>

        <Form.Group className='mt-3'>
            <Form.Label>Address</Form.Label>
            <Form.Control 
            value={address}
            onChange={(e)=>{setAddress(e.target.value)}}
            required
            />
           
        </Form.Group>

        <Form.Group className='mt-3'>
            <Form.Label>City</Form.Label>
            <Form.Control 
            value={city}
            onChange={(e)=>{setCity(e.target.value)}}
            required
            />
            
        </Form.Group>

        <Form.Group className='mt-3'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control 
            value={postalcode}
            onChange={(e)=>{setPostalcode(e.target.value)}}
            required
            />
           
        </Form.Group>
        
        <Form.Group className='mt-3'>
            <Form.Label> Countery </Form.Label>
            <Form.Control 
            value={country}
            onChange={(e)=>{setCountry(e.target.value)}}
            required
            />
            
        </Form.Group>
        <div className='mt-3'>
            <Button varient='primary' type='submit'>
               Continue
            </Button>
        </div>

        </Form>
         </div>
     </div>
  )
}

export default ShippingAddressScreen