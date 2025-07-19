import React, { useState, useEffect } from 'react';  
import { Card, Form, Button, Row, Col, Alert, Tab, Tabs, Spinner, Badge } from 'react-bootstrap';  
import { routeService } from '../../services/api';  
  
const NetworkAnalysis = () => {  
  const [activeTab, setActiveTab] = useState('congested-streets');  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  const [messageType, setMessageType] = useState('');  
  
  // Estados para las diferentes secciones  
  const [congestedStreets, setCongestedStreets] = useState([]);  
  const [inaccessibleZones, setInaccessibleZones] = useState([]);  
  const [isolatedZones, setIsolatedZones] = useState([]);  
  const [isolatedZoneName, setIsolatedZoneName] = useState('');  
  
  // Función para convertir Neo4j Integer a número JavaScript  
  const convertNeo4jInteger = (neo4jInt) => {  
    if (neo4jInt && typeof neo4jInt === 'object' && 'low' in neo4jInt) {  
      return neo4jInt.low;  
    }  
    return neo4jInt || 0;  
  };  
  
  // Función para convertir cualquier valor de manera segura  
  const safeRender = (value) => {  
    if (value && typeof value === 'object' && 'low' in value) {  
      return convertNeo4jInteger(value);  
    }  
    return value || 'N/A';  
  };  
  
  const getTrafficColor = (trafico) => {  
    switch (trafico) {  
      case 'alto': return 'danger';  
      case 'medio': return 'warning';  
      case 'bajo': return 'success';  
      default: return 'secondary';  
    }  
  };  
  
  // Manejadores de eventos  
  const handleGetCongestedStreets = async () => {  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await routeService.getCongestedStreets();  
      setCongestedStreets(response.data);  
      if (response.data.length > 0) {  
        setMessage('Calles congestionadas cargadas exitosamente.');  
        setMessageType('success');  
      } else {  
        setMessage('No se encontraron calles congestionadas en este momento.');  
        setMessageType('info');  
      }  
    } catch (err) {  
      setMessage('Error al obtener calles congestionadas: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleGetInaccessibleZones = async () => {  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await routeService.getInaccessibleZones();  
      setInaccessibleZones(response.data);  
      if (response.data.length > 0) {  
        setMessage('Zonas no accesibles detectadas.');  
        setMessageType('warning');  
      } else {  
        setMessage('Todas las zonas son accesibles desde al menos un centro de distribución.');  
        setMessageType('success');  
      }  
    } catch (err) {  
      setMessage('Error al verificar conectividad: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleGetIsolatedZones = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setMessage('');  
    setMessageType('');  
    try {  
      const response = await routeService.getIsolatedZones(isolatedZoneName);  
      setIsolatedZones(response.data);  
      if (response.data.length > 0) {  
        setMessage(`Zonas que se aislarían si se cierra ${isolatedZoneName}.`);  
        setMessageType('warning');  
      } else {  
        setMessage(`Ninguna zona se aislaría si se cierra ${isolatedZoneName}.`);  
        setMessageType('info');  
      }  
    } catch (err) {  
      setMessage('Error al simular cierre: ' + err.message);  
      setMessageType('danger');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Efecto para cargar datos al cambiar de pestaña si es necesario  
  useEffect(() => {  
    if (activeTab === 'congested-streets') {  
      handleGetCongestedStreets();  
    } else if (activeTab === 'inaccessible-zones') {  
      handleGetInaccessibleZones();  
    }  
  }, [activeTab]);  
  
  return (  
    <div>  
      <h2 className="mb-4 text-primary">📈 Análisis de Red y Conectividad</h2>  
        
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">  
        {/* Pestaña Calles Congestionadas */}  
        <Tab eventKey="congested-streets" title="🚦 Calles Congestionadas">  
          <Card className="custom-card">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">Análisis de Congestión</h5>  
            </Card.Header>  
            <Card.Body>  
              <p className="text-muted">Identifica las calles con alto tráfico o baja capacidad.</p>  
              <Button   
                variant="warning"   
                onClick={handleGetCongestedStreets}   
                disabled={loading}  
                className="w-100 mb-3"  
              >  
                {loading ? (  
                  <>  
                    <Spinner size="sm" className="me-2" />  
                    Analizando...  
                  </>  
                ) : (  
                  '📊 Analizar Congestión'  
                )}  
              </Button>  
  
              {message && activeTab === 'congested-streets' && (  
                <Alert variant={messageType} className="mt-3">  
                  {message}  
                </Alert>  
              )}  
  
              {congestedStreets.length > 0 && (  
                <div className="table-responsive mt-3">  
                  <table className="table table-striped">  
                    <thead>  
                      <tr>  
                        <th>Origen</th>  
                        <th>Destino</th>  
                        <th>Tráfico</th>  
                        <th>Capacidad</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {congestedStreets.map((street, index) => (  
                        <tr key={index}>  
                          <td><strong>{safeRender(street._fields?.[0])}</strong></td>  
                          <td><strong>{safeRender(street._fields?.[1])}</strong></td>  
                          <td>  
                            <Badge bg={getTrafficColor(safeRender(street._fields?.[2]))}>  
                              {safeRender(street._fields?.[2])}  
                            </Badge>  
                          </td>  
                          <td>{safeRender(street._fields?.[3])}</td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
                </div>  
              )}  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        {/* Pestaña Zonas No Accesibles */}  
        <Tab eventKey="inaccessible-zones" title="🚫 Zonas No Accesibles">  
          <Card className="custom-card">  
            <Card.Header className="bg-danger text-white">  
              <h5 className="mb-0">Verificar Conectividad</h5>  
            </Card.Header>  
            <Card.Body>  
              <p className="text-muted">Identifica zonas que no son accesibles desde ningún centro de distribución.</p>  
              <Button   
                variant="danger"   
                onClick={handleGetInaccessibleZones}   
                disabled={loading}  
                className="w-100 mb-3"  
              >  
                {loading ? (  
                  <>  
                    <Spinner size="sm" className="me-2" />  
                    Verificando...  
                  </>  
                ) : (  
                  '🌐 Verificar Conectividad'  
                )}  
              </Button>  
  
              {message && activeTab === 'inaccessible-zones' && (  
                <Alert variant={messageType} className="mt-3">  
                  {message}  
                </Alert>  
              )}  
  
              {inaccessibleZones.length > 0 && (  
                <div className="table-responsive mt-3">  
                  <table className="table table-striped">  
                    <thead>  
                      <tr>  
                        <th>Zona No Accesible</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {inaccessibleZones.map((zone, index) => (  
                        <tr key={index}>  
                          <td><strong>{safeRender(zone._fields?.[0])}</strong></td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
                </div>  
              )}  
            </Card.Body>  
          </Card>  
        </Tab>  
  
        {/* Pestaña Zonas Aisladas por Cierre */}  
        <Tab eventKey="isolated-zones" title="🚨 Zonas Aisladas por Cierre">  
          <Card className="custom-card">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">Simular Cierre de Zona</h5>  
            </Card.Header>  
            <Card.Body>  
              <Form onSubmit={handleGetIsolatedZones}>  
                <Form.Group className="mb-3">  
                  <Form.Label>Nombre de la Zona a Simular Cierre</Form.Label>  
                  <Form.Control  
                    type="text"  
                    value={isolatedZoneName}  
                    onChange={(e) => setIsolatedZoneName(e.target.value)}  
                    placeholder="Ej: Core8"  
                    required  
                  />  
                </Form.Group>  
                <Button   
                  type="submit"   
                  variant="info"   
                  disabled={loading}  
                  className="w-100"  
                >  
                  {loading ? (  
                    <>  
                      <Spinner size="sm" className="me-2" />  
                      Simulando...  
                    </>  
                  ) : (  
                    '⚠️ Simular Impacto'  
                  )}  
                </Button>  
              </Form>  
  
              {message && activeTab === 'isolated-zones' && (  
                <Alert variant={messageType} className="mt-3">  
                  {message}  
                </Alert>  
              )}  
  
              {isolatedZones.length > 0 && (  
                <div className="table-responsive mt-3">  
                  <table className="table table-striped">  
                    <thead>  
                      <tr>  
                        <th>Zona Aislada</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {isolatedZones.map((zone, index) => (  
                        <tr key={index}>  
                          <td><strong>{safeRender(zone._fields?.[0])}</strong></td>  
                        </tr>  
                      ))}  
                    </tbody>  
                  </table>  
                </div>  
              )}  
            </Card.Body>  
          </Card>  
        </Tab>  
      </Tabs>  
    </div>  
  );  
};  
  
export default NetworkAnalysis;