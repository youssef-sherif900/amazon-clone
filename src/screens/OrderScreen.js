import  axios  from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Alert, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams, Link } from 'react-router-dom'
import LoadingBox from "../component/LoadingBox.js"
import {PayPalButtons , usePayPalScriptReducer} from "@paypal/react-paypal-js"
import { getError } from '../component/util.js'
import { Store } from '../Store.js'
import { toast } from 'react-toastify'

const reducer = (state, action)=>{
    switch (action.type) {
        case 'FETCH_REQUEST':
            return{...state,loading:true, error:''}

         case 'FETCH_SUCCESS':
                return{...state,loading:false,order:action.payload,error:''}

        case 'FETCH_FAIL':
                    return{...state,loading:false,error:action.payload}
                  
        case 'PAY_REQUEST':
                    return{...state,loadingPay:true} 

        case 'PAY_SUCCESS':
            return{ ...state, loadingPay: false, successPay: true };

        case 'PAY_FAIL':
                    return{...state,loadingPay:false}

        case 'PAY_REST':
                    return{...state,loadingPay:false,successPay:false}                                    
                    
        default:
            return state
    }
}

function OrderScreen() {
    

    const{state} = useContext(Store)
    const{userInfo} = state
    
    const params = useParams();
    const {id:orderId} = params
    const navigate = useNavigate();

    const[{loading, error, order, successPay , loadingPay}, dispatch] = useReducer(reducer,{
        loading:true,
        order:{},
        error:"",
        successPay:false,
        loadingPay:false
    })

    const[{isPending}, paypalDispatch ] = usePayPalScriptReducer()
    
    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: order.totalPrice
                }
            }]
        });
        
    }


    function onApprove(data, actions) {
        return actions.order.capture() .then(async function (details) {
          try {
            dispatch({ type: 'PAY_REQUEST' });
            const { data } = await axios.put(
              `https://amazoneclonebackend.onrender.com/api/order/${order._id}/pay`,
              details,
              {
                headers: { authorization: `Bearer ${userInfo.token}`},
              }
            );
            dispatch({ type: 'PAY_SUCCESS', payload: data });
            toast.success('Order is paid');
          } catch (err) {
            dispatch({ type: 'PAY_FAIL', payload: getError(err) });
            toast.error(getError(err));
          }
        });
      }

    const onError = (err)=>{
        return toast.error(getError(err))
    }

    useEffect(()=>{
        const fetchOrder = async() =>{
            try {
                dispatch({type:'FETCH_REQUEST'});
                const { data } =  await axios.get(`https://amazoneclonebackend.onrender.com/api/order/${orderId}`
                ,{
                    headers:{
                        authorization:`Bearer ${userInfo.token}`
                    }
                }
                );
                dispatch({type:'FETCH_SUCCESS',payload:data});
            } catch (err) {
                dispatch({type:'FETCH_FAIL',payload:getError(err)});
            }

            
        }
       
  
        
    if(!userInfo){
        return navigate('/login')
    }
    if (!order._id || successPay ||
       ( order._id && order._id !== orderId)) {
        
        fetchOrder()
        if (successPay) {
            dispatch({type:'PAY_REST'})
        }
    } else {
        const loadPaypalScript = async ()=>{
            const {data:clientId} = await axios.get('https://amazoneclonebackend.onrender.com/api/keys/paypal',{
                headers:{
                    authorization:`Bearer ${userInfo.token}`
                }
            })


            paypalDispatch({
                type:"resetOptions",
                value:{
                    'client-id': clientId,
                    currency:'USD'
                }
            })
            paypalDispatch({
                type:'setLoadingStatus',
                value:'pending'
            })
        }
    
        loadPaypalScript();
    }
    
    },[order,orderId,userInfo,navigate,paypalDispatch,successPay])


    


  return (
loading ? (<LoadingBox />  ): (error?
   (
    <Alert variant="danger">
    {error}
    </Alert>
  )

    : 
   ( <div>
   <Helmet>
    <title>
        Order {orderId}
    </title>
   </Helmet>
   <h1 className='my-3'>Order {orderId}</h1>
   <Row>
    <Col md={8}>
        <Card className='mb-3'>
            <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                <strong>Name:</strong>{order.shippingAddress.fullName}
                            <strong>Address:</strong>{order.shippingAddress.address},
                            {order.shippingAddress.city},{order.shippingAddress.postalcode},
                            {order.shippingAddress.country}
                </Card.Text>
                {
                    order.isDelivered ? 


                    <Alert variant="success">
                    Delivered at {order.deliverdAt}
                     </Alert>
                    :
                    <Alert variant="danger">
                    Not Delivered
                     </Alert>            
                }
            </Card.Body>
        </Card>
        <Card className='mb-3'>
            <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                <strong>Name:</strong>{order.paymentMethod}
                           
                </Card.Text>
                {
                    order.isPaid ? 
                    <Alert variant="success">
                    Delivered at {order.paidAt}
                     </Alert>  
                    :
                    <Alert variant="danger">
                    Not Paid
                     </Alert>        
                }
            </Card.Body>
        </Card>

    
        <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Items</Card.Title>
                          <ListGroup variant="flush">
                          {order.orderItems.map( item=>(
                            <ListGroup.Item key={item._id}>
                            <Row className='align-items-center'>
                            <Col md={6}>
                                <img src={item.image} alt={item.name} className='img-fluid rounded' id='img-thumbnail' ></img>
                                {' '}
                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                            </Col>
                            <Col md={3}><span>{item.quantity}</span></Col>
                                <Col md={3}><span>${item.price}</span></Col>
                            </Row>

                            </ListGroup.Item>)
                          )}
                          </ListGroup>
                        <Link to='/payment'>Edit</Link>
                    </Card.Body>
                </Card>
        
    </Col>
    <Col md={4}>
        <Card className='mb-3'>
            <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant='flush' >
                <ListGroup.Item>
                    <Row>
                        <Col>Items</Col>
                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Tax</Col>
                        <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Order Total</Col>
                        <Col>${order.totalPrice.toFixed(2)}</Col>
                    </Row>
                </ListGroup.Item>
                {!order.isPaid && <ListGroup.Item>
                    {isPending ? <LoadingBox />:
                    <div>
                        <PayPalButtons  
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        />
                    </div>
                    }
                    {loadingPay && <LoadingBox />}
                </ListGroup.Item>}

                </ListGroup>
            </Card.Body>
        </Card>
    </Col>
   </Row>

    </div>))

  )
}


export default OrderScreen