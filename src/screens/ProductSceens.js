import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import{useNavigate, useParams} from "react-router-dom"
import LoadingBox from '../component/LoadingBox';
import {MessageBox} from '../component/MessageBox';
import Rating from '../component/Rating';
import { getError } from '../component/util';
import { Store } from '../Store';

function ProductSceens() {
 
    const params = useParams();
    const navigate = useNavigate()
    const{slug} = params


    const reducer =(state,action)=>{
      switch (action.type) {
        case "FETCH_REQUEST":
          return{...state,loading:true}
          case "FETCH_SUCCESS":
          return{...state,loading:false,product:action.payload}
          case "FETCH_FAILED":
            return{...state,err:action.payload,loading:false}
        default:
          return state
      }
    }
    
    const [{loading,err,product},dispatch] = useReducer(reducer,{
      loading:true,
      err:"",
      product:[]
    })
    
      useEffect(()=>{
        const fetchData = async() =>{
          dispatch({type:"FETCH_REQUEST"})
          try {
            const results = await axios.get(`https://amazoneclonebackend.onrender.com/api/product/slug/${slug}`);
            dispatch({type:"FETCH_SUCCESS",payload:results.data})
          } catch (err) {
            dispatch({type:"FETCH_FAILED",payload:getError(err)})
          }
          
        };
        fetchData(); 
      },[slug])
  
      const{state,dispatch: ctxDispatch} = useContext(Store)
      const {cart} = state;
      const addToCartHandler = async ()=>{
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 :1;
        const {data} = await axios.get(`https://amazoneclonebackend.onrender.com/api/product/${product._id}`);
        if(data.countInStock < quantity){
          window.alert('Sorry. Product is out of stock')
          return;
        }
        ctxDispatch({
          type:'CART_ADD_ITEM',
          payload: {...product,quantity},
        });
        navigate('/cart')
      }

    

  return (
    <div>
      {loading?
      <div><LoadingBox /></div>
      :err?
      <MessageBox variant="danger" childern={err} />:
      <div>
      <Row>
        <Col md={6}>
          <img className='img-large'
          src={product.image}
          alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
              <title>{product.name}</title>
              </Helmet>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
              rating={product.rating} 
                numReviews={product.numReviews}
              />
            </ListGroup.Item>
            <ListGroup.Item>
            Price : ${product.price}
            </ListGroup.Item>
            <ListGroup.Item>
            Description : <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup  variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{product.countInStock>0?
                    <Badge  bg="success" >In Stock</Badge>:
                    <Badge  bg="danger" >Unavailble</Badge>
                    }</Col>
                  </Row>
                </ListGroup.Item>
                 {product.countInStock > 0 &&
                  <ListGroup.Item>
                 <div className='d-grid'>
                  <Button
                   onClick={addToCartHandler}
                    id='btn-primary' varient='primary'>
                    Add to Cart
                  </Button>
                 </div>
                  </ListGroup.Item>}
               
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>}
    </div>
  )
}

export default ProductSceens