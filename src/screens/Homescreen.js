import React, {  useEffect, useReducer } from 'react'
import axios from "axios"
import { Col, Row } from 'react-bootstrap'
import Product from "../component/product"
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../component/LoadingBox'
import {MessageBox} from '../component/MessageBox'



function Homescreen() {
  // const [products, setProducts]= useState([])

const reducer =(state,action)=>{
  switch (action.type) {
    case "FETCH_REQUEST":
      return{...state,loading:true}
      case "FETCH_SUCCESS":
      return{...state,loading:false,products:action.payload}
      case "FETCH_FAILED":
        return{...state,err:action.payload,loading:false}
    default:
      return state
  }
}

const [{loading,err,products},dispatch] = useReducer(reducer,{
  loading:true,
  err:"",
  product:[]
})

  useEffect(()=>{
    const fetchData = async() =>{
      dispatch({type:"FETCH_REQUEST"})
      try {
        const results = await axios.get("/api/product");
        dispatch({type:"FETCH_SUCCESS",payload:results.data})
      } catch (error) {
        dispatch({type:"FETCH_FAILED",payload:error.message})
      }
      
    };
    fetchData(); 
  },[])



  return (
    <div>
    <Helmet>
      <title>
        Amazon
      </title>
    </Helmet>
              <h1>Featured Products</h1>
      <div className="products">
      {loading?
      <div><LoadingBox /></div>
      :
      
      err?
      <MessageBox variant="danger" childern={err} />:
      <Row>
 {       products.map(product=>(
          <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3" >
    <Product product={product} ></Product> 
          </Col>
        ))}
        </Row>
      }
   
      </div>
    </div>
  )
}

export default Homescreen