import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, ListGroup, Form, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        };
        fetchProducts();
    }, []);

    const handleFormSubmit = (productId) => {
        preventDefault();
        console.log("Submitted Product ID:", productId, "Quantity:", formData.quantity);
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/products/${id}`)
            console.log("Product deleted:", response.data);
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
            setShowDelete(true)
        }catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    return (
        <Container>
        <h3 className="text-center mt-5 mb-4 fw-bold text-white">Products</h3>
        <ListGroup>
            {products.map((product) => (
            <ListGroup.Item key={product.id} className="flex-column align-items-start shadow-sm mb-3 bg-light rounded"
                onClick={() => setSelectedProductId(
                    selectedProductId === product.id ? null : product.id)}>
                    <div className="d-inline-flex justify-content-between w-100 align-items-end">
                        <div>
                            <strong>{product.name}</strong><br />
                            Price<strong>:</strong> ${product.price}
                        </div>
                        <div className="d-flex justify-content-md-end gap-3 mb-1">
                            <Link to={`/edit-product/${product.id}`}>
                                <Button className="shadow" variant="secondary" size="md">Edit Product</Button>
                            </Link>
                            <Link>
                            <Button className="shadow" variant="danger" size="md" onClick={ () => deleteProduct(product.id)} >Delete</Button>
                            </Link>
                        </div>
                    </div>
                {selectedProductId === product.id && (
                <Form onSubmit={(e) => handleFormSubmit(e, product.id)} className="mt-3 w-100">
                    <Form.Group controlId={`quantity-${product.id}`} className="mb-2 ">
                    <Form.Label><strong>Product ID:</strong> {product.id}<br />
                    Quantity<strong>:</strong> {product.quantity}</Form.Label> 
                    </Form.Group>
                </Form>
                )}
            </ListGroup.Item>
            ))}
                <Link to={`/add-products`}>
                    <Button variant="outline-primary" className='shadow mt-3' style={{maxWidth:'250px', marginLeft:'580px'}} size="lg">
                        Add New Product
                    </Button>
                </Link>
        </ListGroup>
        <Modal show={showDelete} onHide={ () => setShowDelete(false)}>
            <Modal.Header>
                <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Product has been successfully deleted
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

export default ProductList;