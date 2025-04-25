import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Modal } from "react-bootstrap";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
    });
    const [showSuccess, setShowSuccess] = useState(false)
    const isEdit = !!id;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
                setFormData({
                    name: response.data.name,
                    price: response.data.price,
                    quantity: response.data.quantity,
                });
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://127.0.0.1:5000/products/${id}`, formData)
            }
            else {
                await axios.post(`http://localhost:5000/products`, formData)
            }
            setShowSuccess(true)
        }catch (error) {
            console.error("Failed to submit:", error)
        }
    };

    return (
        <Container className="mt-5">
            <h3 className="text-center mt-5 mb-4 fw-bold">Edit Product</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-5">
                    <Form.Label className="text-white">Name:</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label className="text-white">Price:</Form.Label>
                    <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" required />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label className="text-white">Quantity:</Form.Label>
                    <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="d-flex flex-column align-items-start shadow mb-3 rounded" required />
                </Form.Group>
                <Button type="submit" variant="primary" className="shadow mt-2" >Submit</Button>
            </Form>
            <Modal show={showSuccess} onHide={ () => setShowSuccess(false)}>
                <Modal.Header>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The product has been successfully updated!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => {
                        setShowSuccess(false);
                        navigate('/products');
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EditProduct;