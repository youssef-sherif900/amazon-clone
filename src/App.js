
import"./App.css"
import{BrowserRouter,Routes,Route} from "react-router-dom"
import Homescreen from "./screens/Homescreen";
import ProductSceens from "./screens/ProductSceens";
import {Navbar,Container,NavbarBrand, Nav, Badge, NavDropdown} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import { Store } from "./Store";
import { ToastContainer} from "react-toastify"
import"react-toastify/dist/ReactToastify.css"
import { useContext } from "react";
import { Link } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/signinScreen";
import SignupScreen from "./screens/signupScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";

function App() {
  const{state, dispatch:ctxDispatch} = useContext(Store)
  const{cart, userInfo} = state

  const singnoutHnadler = () =>{
    ctxDispatch({type:'USER_SIGNOUT'})
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
  }


  return (
    <BrowserRouter>
    <div  className=" flex-coulmn site-container ">
    <ToastContainer position="bottom-center" limit={1} />
    <header>
     <Navbar bg="dark" varient="dark"  >
      <Container>
      <LinkContainer  to="/">
      <NavbarBrand id="barnd" >Amazon</NavbarBrand>
        </LinkContainer>
        <Nav  className="me-auto">
         <Link id="cart" to='/cart' className='nav-link' >
          Cart
          {
            cart.cartItems.length > 0 && <Badge pill bg="danger">
              {cart.cartItems.reduce((a,c)=>a + c.quantity , 0)}
            </Badge>
          }
         </Link>
         {userInfo
          ? (<NavDropdown id='whiteColor' title={userInfo.name}  >
            <LinkContainer to='/profile'>
              <NavDropdown.Item>User Profile</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to='/orderHistory'>
              <NavDropdown.Item>Order History</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <NavDropdown.Item>
               <Link 
              to='#signout' 
              className="dropdown-item"
              onClick={singnoutHnadler}
              >
                Sign Out
              </Link>
            </NavDropdown.Item>
           
         </NavDropdown>) 
         : (<Link className="nav-link" id='whiteColor' to='/signin'>
          Sign In
         </Link>)}
        </Nav>
      </Container>
     </Navbar>
     </header>
     <main>
     <Container className="mt-3">
     <Routes>
     <Route path="/product/:slug" element={<ProductSceens />} />
     <Route path="/" element={<Homescreen />} />
     <Route path="/cart"  element={<CartScreen />} />
     <Route path="/signin"  element={<SigninScreen />} />
     <Route path="/signup"  element={<SignupScreen />} />
     <Route path="/shipping" element={<ShippingAddressScreen />} />
     <Route path="/payment" element={<PaymentMethodScreen />} />
     <Route path="/placeorder" element={<PlaceOrderScreen />} />
     <Route path="/order/:id" element={<OrderScreen />} />
     
     </Routes>
     </Container>

     </main>
     </div>
     <footer>
      <div className="text-center" >
        all right reserved
      </div>
     </footer>
    
    </BrowserRouter>
  );
}

export default App;
