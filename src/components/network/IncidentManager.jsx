import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';  
import { networkService } from '../../services/api';  
  
const IncidentManager = () => {  
  const [activeTab, setActiveTab] = useState('close-street');  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  const [messageType, setMessageType] = useState('');  
  
  const handleCloseStreet = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    const formData = new FormData(e.target);  
      
    try {  
      await networkService.closeStreet(  
        formData.get('origen'),  
        formData.get('destino')  
      );  
      setMessage('Calle cerrada exitosamente. Simula obras o incidentes.');  
      setMessageType('success');  
    } catch (err) {  
      setMessage('Error al cerrar la calle: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleOpenStreet = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    const formData = new FormData(e.target);  
      
    try {  
      await networkService.openStreet(  
        formData.get('origen'),  
        formData.get('destino')  
      );  
      setMessage('Calle reabierta exitosamente.');  
      setMessageType('success');  
    } catch (err) {  
      setMessage('Error al reabrir la calle: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleAddZone = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    const formData = new FormData(e.target);  
      
    try {  
      const conexiones = [{  
        destino: formData.get('conexionDestino'),  
        tiempo: parseInt(formData.get('conexionTiempo')),  
        trafico: formData.get('conexionTrafico'),  
        capacidad: parseInt(formData.get('conexionCapacidad'))  
      }];  
  
      await networkService.addZone(  
        formData.get('nombre'),  
        formData.get('tipoZona'),  
        conexiones  
      );  
      setMessage('Nueva zona agregada exitosamente.');  
      setMessageType('success');  
    } catch (err) {  
      setMessage('Error al agregar zona: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleUpdateTime = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    const formData = new FormData(e.target);  
      
    try {  
      await networkService.updateStreetTime(  
        formData.get('origen'),  
        formData.get('destino'),  
        parseInt(formData.get('nuevoTiempo'))  
      );  
      setMessage('Tiempo de tránsito actualizado exitosamente.');  
      setMessageType('success');  
    } catch (err) {  
      setMessage('Error al actualizar tiempo: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">🚨 Gestión de Incidentes y Modificaciones</h2>  
        
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">  
        <Tab eventKey="close-street" title="🚧 Cerrar Calle">  
          <Card className="custom-card">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">Simular Cierre Temporal</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleCloseStreet}>  
                <Row>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Origen</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="origen"  
                        placeholder="Ej: Altamira"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Destino</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="destino"  
                        placeholder="Ej: Chacao"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                <Button   
                  type="submit"   
                  variant="warning"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Cerrando...  
                    </>  
                  ) : (  
                    '🚧 Cerrar Calle'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        <Tab eventKey="open-street" title="✅ Abrir Calle">  
          <Card className="custom-card">  
            <Card.Header className="bg-success text-white">  
              <h5 className="mb-0">Reabrir Calle</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleOpenStreet}>  
                <Row>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Origen</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="origen"  
                        placeholder="Ej: Altamira"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Destino</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="destino"  
                        placeholder="Ej: Chacao"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                <Button   
                  type="submit"   
                  variant="success"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Abriendo...  
                    </>  
                  ) : (  
                    '✅ Reabrir Calle'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        <Tab eventKey="add-zone" title="📍 Agregar Zona">  
          <Card className="custom-card">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">Incorporar Nueva Zona</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleAddZone}>  
                <Row>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Nombre de la Zona</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="nombre"  
                        placeholder="Ej: La Urbina"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Tipo de Zona</Form.Label>  
                      <Form.Select name="tipoZona" required>  
                        <option value="">Seleccionar tipo</option>  
                        <option value="residencial">Residencial</option>  
                        <option value="comercial">Comercial</option>  
                      </Form.Select>  
                    </Form.Group>  
                  </Col>  
                </Row>  
                  
                <h6 className="text-secondary mb-3">Conexión Inicial</h6>  
                <Row>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Conectar con</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="conexionDestino"  
                        placeholder="Ej: CD_1"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Tiempo (minutos)</Form.Label>  
                      <Form.Control  
                        type="number"  
                        name="conexionTiempo"  
                        placeholder="15"  
                        min="1"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                <Row>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Nivel de Tráfico</Form.Label>  
                      <Form.Select name="conexionTrafico" required>  
                        <option value="">Seleccionar nivel</option>  
                        <option value="bajo">Bajo</option>  
                        <option value="medio">Medio</option>  
                        <option value="alto">Alto</option>  
                      </Form.Select>  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Capacidad</Form.Label>  
                      <Form.Control  
                        type="number"  
                        name="conexionCapacidad"  
                        placeholder="100"  
                        min="1"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                <Button   
                  type="submit"   
                  variant="info"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Agregando...  
                    </>  
                  ) : (  
                    '📍 Agregar Nueva Zona'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        <Tab eventKey="update-time" title="⏱️ Actualizar Tiempo">  
          <Card className="custom-card">  
            <Card.Header className="bg-secondary text-white">  
              <h5 className="mb-0">Modificar Tiempo de Tránsito</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleUpdateTime}>  
                <Row>  
                  <Col md={4}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Origen</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="origen"  
                        placeholder="Ej: Altamira"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={4}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Zona de Destino</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="destino"  
                        placeholder="Ej: Chacao"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={4}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Nuevo Tiempo (min)</Form.Label>  
                      <Form.Control  
                        type="number"  
                        name="nuevoTiempo"  
                        placeholder="20"  
                        min="1"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                <Button   
                  type="submit"   
                  variant="secondary"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Actualizando...  
                    </>  
                  ) : (  
                    '⏱️ Actualizar Tiempo'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
      </Tabs>  
  
      {message && (  
        <Alert variant={messageType} className="mt-3">  
          {message}  
        </Alert>  
      )}  
    </div>  
  );  
};  
  
export default IncidentManager;