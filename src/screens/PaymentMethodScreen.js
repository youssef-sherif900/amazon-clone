import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'
import CheckOutSteps from '../component/CheckOutSteps'
import { Store } from '../Store'

function PaymentMethodScreen() {

const navigate = useNavigate()

const {state , dispatch:ctxDispatch} = useContext(Store)
const { cart: {shippingAddress , paymentMethod} } = state

const[paymentMethodName , setPaymentMethod] = useState( paymentMethod || 'PayPal')




useEffect(()=>{
    if(!shippingAddress.address){
        navigate('/shipping')
    } 
},[shippingAddress, navigate])

const submitHandler = (e)=>{
    e.preventDefault()
    ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethodName})
    localStorage.setItem('paymentMethod',paymentMethodName)
    navigate('/placeorder')
}

  return (
    <div>
        <CheckOutSteps step1 step2 step3 ></CheckOutSteps>
        <div className='container small-container' id='small-container'>
            <Helmet>
                <title>
                    Payment Method
                </title>
            </Helmet>
            <h1 className='mt-3'>Payment Method</h1>
            <Form onSubmit={submitHandler}>
            <div className='mb-3'>
                <Form.Check
                className='mt-3'
                type='radio'
                id='PayPal'
                label='PayPal'
                value='PayPal'
                checked={paymentMethodName === 'PayPal'}
                onChange={(e)=>{setPaymentMethod(e.target.value)}}
                 />

              <Form.Check
                className='mt-3'
                type='radio'
                id='Strip'
                label='Strip'
                value='Strip'
                checked={paymentMethodName === 'Strip'}
                onChange={(e)=>{setPaymentMethod(e.target.value)}}
                 />
            </div>
            <div className='mb-3'>
                <Button type='submit'> Continue </Button>
            </div>

            </Form>
        </div>
    </div>
  )
}

export default PaymentMethodScreen