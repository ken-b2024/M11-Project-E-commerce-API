import axios from "axios";
import { number } from "prop-types";
import { useState, useEffect } from "react";
import { Container, Button, ListGroup} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


const OrderList = ({ customerID }) => {
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/orders')
                setOrders(response.data)
            }catch (error) {
                console.error("Error fetching orders:", error)
            }
            
        }
        fetchOrders()

    }, [customerID])

    return (
        <Container>
            <div>
                <h3 className="text-center mt-5 mb-4 fw-bold text-white">Orders</h3>
                <ListGroup>
                    {orders.map(order => (
                        <ListGroup.Item key={order.id} className="order-list shadow-sm mb-4 bg-light rounded">
                        <Link to={`/orders/${order.id}`}>
                            Date: {order.date} | User ID: {order.user_id}
                        </Link>
                        <p><strong>Total Price: </strong>{order.total_price}</p>
                            <Link className="gap-3 mb-1">
                                <Button className=" shadow" variant="danger" size="md" onClick={ () => deleteOrder(order.id)} >Cancel Order</Button>
                            </Link>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <Link to={`/add-order`}>
                <Button variant="outline-primary" className='create-order d-inline-flex shadow mt-3 justify-content-center' size="lg">
                    Create New Order
                </Button>
            </Link>
        </Container>
    );
};

OrderList.propTypes = {
    customerID: number
};
export default OrderList