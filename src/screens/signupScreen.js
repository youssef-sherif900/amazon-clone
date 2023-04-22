import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import  Axios from "axios"
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../component/util'


function SignupScreen() {
    const {search} = useLocation()
    const navigate = useNavigate();
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : "/"

    
    const[name, setName] = useState("")
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[confirmPassword, setConfirmPassword] = useState("")

    const{state, dispatch:ctxDispatch}= useContext(Store)
    const{userInfo} = state

     const submitHandler = async (e)=>{
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error('Password don not match')
            return;
        }
        try{
            const { data } = await Axios.post('/api/users/signup',{
                name,
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
        <title>Sign Up</title>
    </Helmet>
    <h1 className='my-3'>Sign Up </h1>
    <Form onSubmit={submitHandler}>

    <Form.Group className='mb-3' controlId='name'>
           <Form.Label>Name</Form.Label>
           <Form.Control type='name' onChange={(e)=>setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className='mb-3' controlId='email'>
           <Form.Label>Email</Form.Label>
           <Form.Control type='email' onChange={(e)=>setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
           <Form.Label>Password</Form.Label>
           <Form.Control type='password'  onChange={(e)=>setPassword(e.target.value)} required />
        </Form.Group>

        
    <Form.Group className='mb-3' controlId='confirmPassword'>
           <Form.Label>confirm password</Form.Label>
           <Form.Control type='confirmPassword' onChange={(e)=>setConfirmPassword(e.target.value)} required />
        </Form.Group>
    
    <div className='mb-3'>
        <Button type="submit">Sign Up</Button>
    </div>
    <div className='mb-3'>
        Arleady have new account{" "}
        <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
    </div>
    </Form>
    </Container>
  )
}

export default SignupScreen