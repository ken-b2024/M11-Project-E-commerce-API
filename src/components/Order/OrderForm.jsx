import { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
    const getLocalDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
        return localISOTime;
    };

    const [orderData, setOrderData] = useState({ date: getLocalDateTime(), userId: '', totalPrice: '' });
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!orderData.date)
            errors.date = 'Date is required';
        if (!orderData.userId || parseInt(orderData.userId) <= 0)
            errors.userId = 'ID must be greater than zero';
        return errors;
    };


    useEffect(() => {
    const fetchProducts = async () => {
        try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
        } catch (error) {
        console.error("Error fetching products:", error);
        }
    };
    
    fetchProducts();
    }, []);

    useEffect(() => {
        const total = selectedProducts.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
        setOrderData(prev => ({ ...prev, totalPrice: total.toFixed(2) }));
    }, [selectedProducts, products]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
          try {
            const payload = {
                date: orderData.date,
                user_id: parseInt(orderData.userId),
                items: selectedProducts.map(p => ({
                  product_id: p.id,
                  quantity: p.quantity
            }))
          }
            await axios.post("http://localhost:5000/new-order", payload); 
            setShowSuccess(true);
            setOrderData({
                date: getLocalDateTime(),
                userId: '',
                totalPrice: ''
            });
          } catch (error) {
            console.error("Failed to create order:", error);
          }
        } else {
          setErrors(errors);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit} className="order-form">
                <h3 className="mt-5 mb-4 text-center fw-bold text-white">Create New Order</h3>
                <Form.Group>
                    <Form.Label className="text-white">
                        Date and Time:
                    </Form.Label>
                    <Form.Control type="datetime-local" name="date" value={orderData.date} disabled className="d-flex flex-column align-items-start shadow mb-3 rounded date-box" />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label className="text-white">
                        User ID:
                    </Form.Label>
                    <Form.Control type="number" name='userId' value={orderData.userId} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded id-box" />
                    {errors.userId && <div style={ {color: 'red'}}>{errors.userId}</div>}
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label className="text-white">Select Products:</Form.Label>
                    {products.map(product => (
                        <div key={product.id} className="mb-2">
                            <Form.Check className="text-white" type="checkbox" label={product.name}
                            checked={selectedProducts.some(p => p.id === product.id)}
                            onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, { id: product.id, quantity: 1 }]);
                            } else {
                                setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                            }
                            }}/>
                            {selectedProducts.some(p => p.id === product.id) && (
                            <Form.Control type="number" min="1" max={product.quantity} className="mt-1 quantity-box" value={selectedProducts.find(p => p.id === product.id)?.quantity || 1}
                            onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            setSelectedProducts(prev =>
                            prev.map(p =>
                                p.id === product.id ? { ...p, quantity: newQuantity } : p
                              )
                            );
                          }}/>
                        )}
                        </div>
                    ))}
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label className="text-white">
                        Total Price:
                    </Form.Label>
                    <div className="text-white fw-bold fs-5">${orderData.totalPrice}</div>
                </Form.Group>
                <br />
                <Button variant="primary" size="md" className="mt-2" type="submit">Place Order</Button>
            </form>
            <Modal show={showSuccess} onHide={ () => setShowSuccess(false)}>
                <Modal.Header>
                    <Modal.Title>Congrats!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your order has been successfully placed!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => {
                        setShowSuccess(false);
                        navigate('/orders');}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default OrderForm