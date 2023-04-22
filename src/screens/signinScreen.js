import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import  Axios from "axios"
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../component/util'


function SigninScreen() {
    const {search} = useLocation()
    const navigate = useNavigate();
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : "/"

    

    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")

    const{state, dispatch:ctxDispatch}= useContext(Store)
    const{userInfo} = state

     const submitHandler = async (e)=>{
        e.preventDefault();
        try{
            const { data } = await Axios.post('https://amazoneclonebackend.onrender.com/api/users/signin',{
                email,
                password,
            });
            ctxDispatch({type:"USER_SIGNIN",payload:data})
            localStorage.setItem("userInfo",JSON.stringify(data))
            navigate(redirect || '/')
        } catch (err) {
           toast.error(getError(err));
        }
     }

     useEffect(()=>{
        if(userInfo){
         navigate(redirect)
        }
     },[navigate,redirect,userInfo])

  return (
    <Container id='small-container'>
    <Helmet>
        <title>Sign In</title>
    </Helmet>
    <h1 className='my-3'>Sign In </h1>
    <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='email'>
           <Form.Label>Email</Form.Label>
           <Form.Control type='email' onChange={(e)=>setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
           <Form.Label>Password</Form.Label>
           <Form.Control type='password'  onChange={(e)=>setPassword(e.target.value)} required />
        </Form.Group>
    
    <div className='mb-3'>
        <Button type="submit">Sign In</Button>
    </div>
    <div className='mb-3'>
        New customer ?{" "}
        <Link to={`/signup?redirect=${redirect}`}>Creat your account</Link>
    </div>
    </Form>
    </Container>
  )
}

export default SigninScreen