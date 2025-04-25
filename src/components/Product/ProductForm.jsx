import { useState } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!formData.name)
            errors.name = 'Product name is required';
        if (!formData.price || parseFloat(formData.price) <= 0)
            errors.price = 'Price must be a positive number';
        if (!formData.quantity || parseInt(formData.quantity) <= 0)
            errors.quantity = 'Quantity must be greater than zero';
        return errors;
      };

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
          try {
            await axios.post("http://localhost:5000/products", formData); 
            setShowSuccess(true);
            setFormData({ name: '', price: '', quantity: '' });
          } catch (error) {
            console.error("Failed to add product:", error);
          }
        } else {
          setErrors(errors);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <h3 className="mt-5 mb-4 text-center fw-bold">Add/Edit Product</h3>
                <Form.Group>
                    <Form.Label className="text-white">
                        Name:
                    </Form.Label>
                    <Form.Control type="text" name='name' value={formData.name} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                    {errors.name && <div style={ {color: 'red'}}>{errors.name}</div>}
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label className="text-white">
                        Price:
                    </Form.Label>
                    <Form.Control type="number" name='price' value={formData.price} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                    {errors.price && <div style={ {color: 'red'}}>{errors.price}</div>}
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label className="text-white">
                        Quantity:
                    </Form.Label>
                    <Form.Control type="number" name='quantity' value={formData.quantity} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" />
                    {errors.quantity && <div style={ {color: 'red'}}>{errors.quantity}</div>}
                </Form.Group>
                <br />
                <Button variant="primary" size="md" className="mt-2" type="submit">Submit</Button>
            </form>
            <Modal show={showSuccess} onHide={ () => setShowSuccess(false)}>
                <Modal.Header>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Product has been successfully added!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => {
                        setShowSuccess(false);
                        navigate('/products');}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default ProductForm