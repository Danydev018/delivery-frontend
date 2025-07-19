import React, { useState } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';  
import { networkService } from '../../services/api';  
  
const IncidentManager = () => {  
  const [activeTab, setActiveTab] = useState('close-street'); // Pestaña inicial  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  const [messageType, setMessageType] = useState('');  
  
  // Estados para los formularios  
  const [closeStreetData, setCloseStreetData] = useState({ origen: '', destino: '' });  
  const [openStreetData, setOpenStreetData] = useState({ origen: '', destino: '' });  
  const [updateTimeData, setUpdateTimeData] = useState({ origen: '', destino: '', nuevoTiempo: '' });  
  const [addZoneData, setAddZoneData] = useState({ nombre: '', tipoZona: '', conexionDestino: '', conexionTiempo: '', conexionTrafico: '', conexionCapacidad: '' });  
  
  
  const handleCloseStreet = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await networkService.closeStreet(closeStreetData.origen, closeStreetData.destino);  
      if (response.data.success) {  
        setMessage(response.data.message);  
        setMessageType('success');  
      } else {  
        setMessage(response.data.message);  
        setMessageType('danger');  
      }  
    } catch (err) {  
      setMessage('Error al cerrar calle: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleOpenStreet = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await networkService.openStreet(openStreetData.origen, openStreetData.destino);  
      if (response.data.success) {  
        setMessage(response.data.message);  
        setMessageType('success');  
      } else {  
        setMessage(response.data.message);  
        setMessageType('danger');  
      }  
    } catch (err) {  
      setMessage('Error al reabrir calle: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleUpdateTime = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await networkService.updateStreetTime(  
        updateTimeData.origen,  
        updateTimeData.destino,  
        parseInt(updateTimeData.nuevoTiempo)  
      );  
      if (response.data.success) {  
        setMessage(response.data.message);  
        setMessageType('success');  
      } else {  
        setMessage(response.data.message);  
        setMessageType('danger');  
      }  
    } catch (err) {  
      setMessage('Error al actualizar tiempo: ' + err.message);  
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
      
    try {  
      const conexiones = [{  
        destino: addZoneData.conexionDestino,  
        tiempo: parseInt(addZoneData.conexionTiempo),  
        trafico: addZoneData.conexionTrafico,  
        capacidad: parseInt(addZoneData.conexionCapacidad)  
      }];  
  
      const response = await networkService.addZone(  
        addZoneData.nombre,  
        addZoneData.tipoZona,  
        conexiones  
      );  
  
      if (response.data.success) {  
        setMessage(response.data.message);  
        setMessageType('success');  
      } else {  
        setMessage(response.data.message);  
        setMessageType('warning');   
      }  
    } catch (err) {  
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
        {/* Pestaña Cerrar Calle */}  
        <Tab eventKey="close-street" title="🚧 Cerrar Calle">  
          <Card className="custom-card">  
            <Card.Header className="bg-danger text-white">  
              <h5 className="mb-0">Cerrar Calle Temporalmente</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleCloseStreet}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Origen</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={closeStreetData.origen}  
                    onChange={(e) => setCloseStreetData({ ...closeStreetData, origen: e.target.value })}  
                    placeholder="Ej: LasAmericas"  
                    required  
                  />  
                </Form.Group>  
                <Form.Group className="mb-3">  
                  <Form.Label>Destino</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={closeStreetData.destino}  
                    onChange={(e) => setCloseStreetData({ ...closeStreetData, destino: e.target.value })}  
                    placeholder="Ej: LosPinos"  
                    required  
                  />  
                </Form.Group>  
                <Button   
                  type="submit"   
                  variant="danger"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Cerrando...  
                    </>  
                  ) : (  
                    '🚫 Cerrar Calle'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        {/* Pestaña Reabrir Calle */}  
        <Tab eventKey="open-street" title="✅ Reabrir Calle">  
          <Card className="custom-card">  
            <Card.Header className="bg-success text-white">  
              <h5 className="mb-0">Reabrir Calle</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleOpenStreet}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Origen</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={openStreetData.origen}  
                    onChange={(e) => setOpenStreetData({ ...openStreetData, origen: e.target.value })}  
                    placeholder="Ej: LasPeonias"  
                    required  
                  />  
                </Form.Group>  
                <Form.Group className="mb-3">  
                  <Form.Label>Destino</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={openStreetData.destino}  
                    onChange={(e) => setOpenStreetData({ ...openStreetData, destino: e.target.value })}  
                    placeholder="Ej: VillaAsia"  
                    required  
                  />  
                </Form.Group>  
                <Button   
                  type="submit"   
                  variant="success"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Reabriendo...  
                    </>  
                  ) : (  
                    '✅ Reabrir Calle'  
                  )}  
                </Button>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        {/* Pestaña Actualizar Tiempo */}  
        <Tab eventKey="update-time" title="⏱️ Actualizar Tiempo">  
          <Card className="custom-card">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">Actualizar Tiempo de Tránsito</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleUpdateTime}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Origen</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={updateTimeData.origen}  
                    onChange={(e) => setUpdateTimeData({ ...updateTimeData, origen: e.target.value })}  
                    placeholder="Ej: Core8"  
                    required  
                  />  
                </Form.Group>  
                <Form.Group className="mb-3">  
                  <Form.Label>Destino</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={updateTimeData.destino}  
                    onChange={(e) => setUpdateTimeData({ ...updateTimeData, destino: e.target.value })}  
                    placeholder="Ej: LasAmericas"  
                    required  
                  />  
                </Form.Group>  
                <Form.Group className="mb-3">  
                  <Form.Label>Nuevo Tiempo (minutos)</Form.Label>  
                  <Form.Control  
                    type="number"  
                    value={updateTimeData.nuevoTiempo}  
                    onChange={(e) => setUpdateTimeData({ ...updateTimeData, nuevoTiempo: e.target.value })}  
                    placeholder="Ej: 10"  
                    min="1"  
                    required  
                  />  
                </Form.Group>  
                <Button   
                  type="submit"   
                  variant="warning"   
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
  
        {/* Pestaña Agregar Zona (ya existente) */}  
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
                        value={addZoneData.nombre}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, nombre: e.target.value })}  
                        placeholder="Ej: VillaUniversitaria"  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  <Col md={6}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>Tipo de Zona</Form.Label>  
                      <Form.Select  
                        name="tipoZona"  
                        value={addZoneData.tipoZona}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, tipoZona: e.target.value })}  
                        required  
                      >  
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
                        value={addZoneData.conexionDestino}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, conexionDestino: e.target.value })}  
                        placeholder="Ej: CD_PuertoOrdaz"  
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
                        value={addZoneData.conexionTiempo}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, conexionTiempo: e.target.value })}  
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
                      <Form.Select  
                        name="conexionTrafico"  
                        value={addZoneData.conexionTrafico}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, conexionTrafico: e.target.value })}  
                        required  
                      >  
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
                        value={addZoneData.conexionCapacidad}  
                        onChange={(e) => setAddZoneData({ ...addZoneData, conexionCapacidad: e.target.value })}  
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