import { Component } from 'react'
import CustomerList from './components/Customer/CustomerList';
import OrderList from './components/Order/OrderList';
import ProductList from './components/Product/ProductList';
import { Route, Routes } from 'react-router-dom';
import NavigationBar from './components/App/NavigationBar';
import CustomerFormWrapper from './components/Customer/CustomerFormWrapper';
import NotFound from './components/App/NotFound';
import HomePage from './components/App/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css'
import './AppStyles.css'
import ProductFormWrapper from './components/Product/ProductFormWrapper';
import EditProduct from './components/Product/EditProduct';
import OrderFormWrapper from './components/Order/OrderFormWrapper';
import OrderDetails from './components/Order/OrderDetails';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCustomerID: null,
      selectedOrderID: null
    };
  }

  handleCustomerSelect = (customerID) => {
    this.setState({ selectedCustomerID: customerID});
  }

  handleOrderSelect = (orderID) => {
    this.setState({ selectedOrderID: orderID });
  }

  render() {

      return (
        <div className='app-container'>
          <NavigationBar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/users' element= { <CustomerList />} />
            <Route path='/add-users' element= { <CustomerFormWrapper />} />
            <Route path='/edit-user/:id' element= { <CustomerFormWrapper />} />
            <Route path='/products' element= { <ProductList />} />
            <Route path='/add-products' element= { <ProductFormWrapper />} />
            <Route path='/edit-product/:id' element= { <EditProduct />} />
            <Route path='/orders' element= { <OrderList />} />
            <Route path='/add-order' element= { <OrderFormWrapper />} />
            <Route path='/orders/:id' element={ <OrderDetails />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      );

  };
};

export default App