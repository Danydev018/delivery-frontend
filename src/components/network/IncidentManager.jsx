import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';  
import { networkService } from '../../services/api';  
  
const IncidentManager = () => {  
  const [activeTab, setActiveTab] = useState('add-zone'); // Puedes cambiar la pestaña inicial para probar  
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
    setMessage(''); // Limpiar mensajes anteriores  
    setMessageType('');  
    const formData = new FormData(e.target);  
      
    try {  
      const conexiones = [{  
        destino: formData.get('conexionDestino'),  
        tiempo: parseInt(formData.get('conexionTiempo')),  
        trafico: formData.get('conexionTrafico'),  
        capacidad: parseInt(formData.get('conexionCapacidad'))  
      }];  
  
      const response = await networkService.addZone(  
        formData.get('nombre'),  
        formData.get('tipoZona'),  
        conexiones  
      );  
  
      if (response.data.success) {  
        setMessage(response.data.message);  
        setMessageType('success');  
      } else {  
        // Manejar el mensaje específico de zona existente  
        setMessage(response.data.message);  
        setMessageType('warning'); // O 'danger' si prefieres un color más fuerte para este tipo de mensaje  
      }  
    } catch (err) {  
      // Capturar errores de red o del servidor que no son manejados por el backend  
      if (err.response && err.response.data && err.response.data.message) {  
        setMessage('Error al agregar zona: ' + err.response.data.message);  
      } else {  
        setMessage('Error al agregar zona: ' + err.message);  
      }  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">🚨 Gestión de Incidentes y Modificaciones</h2>  
        
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">  
        {/* ... (Tabs para close-street, open-street, update-time - permanecen iguales) */}  
  
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