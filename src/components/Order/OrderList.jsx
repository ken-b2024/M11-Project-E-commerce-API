import axios from "axios";
import { number } from "prop-types";
import { useState, useEffect } from "react";
import { Container, Button, ListGroup, Modal} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


const OrderList = ({ customerID }) => {
    const [orders, setOrders] = useState([]);
    const [showDelete, setShowDelete] = useState(false);


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

    const deleteOrder = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/orders/${id}`)
            console.log("Order deleted:", response.data);
            setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));
            setShowDelete(true)
        }catch (error) {
            console.error("Error deleting order:", error)
        }
    }

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
            <Modal show={showDelete} onHide={ () => setShowDelete(false)}>
                <Modal.Header>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your order has been successfully deleted
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={ () => {
                        setShowDelete(false)
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

OrderList.propTypes = {
    customerID: number
};
export default OrderList