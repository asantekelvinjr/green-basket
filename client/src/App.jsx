import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import AllProducts from './pages/AllProducts';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import VerifyPayment from './pages/VerifyPayment';
import { useState ,useEffect} from 'react';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import NotFound from './pages/NotFound';
import DeliveryInformation from './pages/Delivery-Information';
import RefundPolicy from './pages/RefundPolicy';
import PaymentMethods from './pages/PaymentMethods';
import TrackOrders from './pages/TrackOrders';
import OrderSupport from './pages/OrderSupport';





const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {loading && <Loading />}

      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}

      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/my-orders/:orderId/verify-payment' element={<VerifyPayment />} />
          <Route path='/my-orders/verify-payment' element={<VerifyPayment />} />
          <Route path='/contact-us' element={<Contact />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/delivery-information' element={<DeliveryInformation />} />
          <Route path='/refund-policy' element={<RefundPolicy />} />
          <Route path='/payment-methods' element={<PaymentMethods />} />
          <Route path='/track-orders' element={<TrackOrders />} />
          <Route path='/order-support' element={<OrderSupport />} />





           {/* CATCH-ALL 404 ROUTE */}
  <Route path='*' element={<NotFound />} />



          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;