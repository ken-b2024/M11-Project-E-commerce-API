import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return <Container><p className="text-white">Loading order details...</p></Container>;
  }

  return (
    <Container className="d-flex flex-column align-items-start fs-4 shadow-lg mt-5 rounded">
        <div className="text-white p-4">
        <h4>Order ID: {order.id}</h4>
        <p>Date: {order.date}</p>
        <p>User ID: {order.user_id}</p>
        <p>Total Price: {order.total_price}</p>
        <h5>Products:</h5>
        <ul>
            {order.order_products?.map((item, index) => (
            <li key={index} className="bg-dark">
                {item.product.name} - ${item.product.price}<br /> Qty: {item.product.quantity}
            </li>
            ))}
        </ul>
        </div>
    </Container>
  );
};

export default OrderDetails;