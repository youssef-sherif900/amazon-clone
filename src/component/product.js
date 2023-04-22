import axios from 'axios';
import React, { useContext } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

function Product(props){
const {product} = props 

const{state,dispatch: ctxDispatch} = useContext(Store)
const{ cart: {cartItems} } = state;


const addToCartHandler = async (item ) =>{
  const existItem = cartItems.find((x) => x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 :1;
  const {data} = await axios.get(`/api/product/${item._id}`) ;
  if(data.countInStock < quantity){
    window.alert('Sorry. Product is out of stock')
    return;
  }
  ctxDispatch({
    type:'CART_ADD_ITEM',
    payload: {...item,quantity},
  });
}

  return (
    <Card className="product" >
    <Link to={`/product/${product.slug}`}>
      <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>   
      <Card.Body>
      <Link to={`/product/${product.slug}`}>
      <Card.Title>{product.name}</Card.Title>
      </Link> 
      <Rating rating={product.rating} numReviews={product.numReviews} />
      <Card.Text>${product.price}</Card.Text>
      {product.countInStock === 0
       ? <Button varient='light' disabled>Out of Stock </Button>
      : <Button onClick={()=>addToCartHandler(product)}  id='btn-primary'>Add to cart</Button>}
     
      </Card.Body>                                                     
      </Card>
  )
}


export default Product;