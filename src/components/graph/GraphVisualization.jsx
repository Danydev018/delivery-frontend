import React, { useState, useEffect } from 'react';  
import { Card, Row, Col, Badge, Alert, Button, Spinner } from 'react-bootstrap';  
import { graphService } from '../../services/api';  
  
const GraphVisualization = () => {  
  const [graphData, setGraphData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  
  // Función para convertir Neo4j Integer a número JavaScript  
  const convertNeo4jInteger = (neo4jInt) => {  
    if (neo4jInt && typeof neo4jInt === 'object' && 'low' in neo4jInt) {  
      return neo4jInt.low;  
    }  
    return neo4jInt || 0;  
  };  
  
  const loadGraphData = async () => {  
    setLoading(true);  
    setMessage('');  
    try {  
      const response = await graphService.getAll();  
      setGraphData(response.data);  
      setMessage('Datos del grafo cargados correctamente.');  
    } catch (err) {  
      setMessage('Error al cargar los datos del grafo: ' + err.message);  
      console.error('Error al cargar datos del grafo:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const initializeGraph = async () => {  
    setLoading(true);  
    setMessage('');  
    try {  
      await graphService.migrateAndSeed();  
      setMessage('Modelo de grafos inicializado correctamente en Neo4j');  
      await loadGraphData();  
    } catch (err) {  
      setMessage('Error al inicializar el modelo: ' + err.message);  
      console.error('Error al inicializar el grafo:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    loadGraphData();  
  }, []);  
  
  const getNodeColor = (node) => {  
    if (node.type === 'CentroDistribucion') return 'primary';  
    return node.tipoZona === 'comercial' ? 'info' : 'success';  
  };  
  
  const getTrafficColor = (trafico) => {  
    switch (trafico) {  
      case 'alto': return 'danger';  
      case 'medio': return 'warning';  
      case 'bajo': return 'success';  
      default: return 'secondary';  
    }  
  };  
  
  return (  
    <div>  
      <div className="d-flex justify-content-between align-items-center mb-4">  
        <div>  
          <h2 className="text-primary">🗺️ Modelo de Grafos Neo4j</h2>  
          <p className="text-muted">Visualización del esquema de datos y relaciones del sistema de delivery</p>  
        </div>  
        <Button   
          variant="outline-primary"   
          onClick={initializeGraph}  
          disabled={loading}  
        >  
          {loading ? (  
            <>  
              <Spinner size="sm" className="me-2" />  
              Inicializando...  
            </>  
          ) : (  
            '🔄 Inicializar Modelo'  
          )}  
        </Button>  
      </div>  
  
      {message && (  
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">  
          {message}  
        </Alert>  
      )}  
  
      {loading && !graphData && (  
        <div className="text-center my-5">  
          <Spinner animation="border" role="status" variant="primary">  
            <span className="visually-hidden">Cargando datos del grafo...</span>  
          </Spinner>  
          <p className="mt-2 text-muted">Cargando datos del grafo...</p>  
        </div>  
      )}  
  
      {graphData && (  
        <>  
          {/* Esquema del Modelo (puede ser estático o dinámico si lo obtienes del backend) */}  
          <Row className="mb-4">  
            <Col md={6}>  
              <Card className="custom-card">  
                <Card.Header className="bg-primary text-white">  
                  <h5 className="mb-0">📊 Esquema de Nodos</h5>  
                </Card.Header>  
                <Card.Body>  
                  <div className="mb-3">  
                    <h6>🏢 CentroDistribucion</h6>  
                    <p className="text-muted small">Puntos de partida de los repartidores</p>  
                    <ul className="list-unstyled">  
                      <li><code>nombre</code>: String (identificador)</li>  
                    </ul>  
                  </div>  
                  <div>  
                    <h6>📍 Zona</h6>  
                    <p className="text-muted small">Áreas de entrega en la ciudad</p>  
                    <ul className="list-unstyled">  
                      <li><code>nombre</code>: String (identificador)</li>  
                      <li><code>tipo_zona</code>: "residencial" | "comercial"</li>  
                    </ul>  
                  </div>  
                </Card.Body>  
              </Card>  
            </Col>  
            <Col md={6}>  
              <Card className="custom-card">  
                <Card.Header className="bg-secondary text-white">  
                  <h5 className="mb-0">🔗 Esquema de Relaciones</h5>  
                </Card.Header>  
                <Card.Body>  
                  <div>  
                    <h6>[:CONECTA]</h6>  
                    <p className="text-muted small">Calles/vías que conectan zonas</p>  
                    <ul className="list-unstyled">  
                      <li><code>tiempo_minutos</code>: Integer (tiempo de viaje)</li>  
                      <li><code>trafico_actual</code>: "bajo" | "medio" | "alto"</li>  
                      <li><code>capacidad</code>: Integer (capacidad de la vía)</li>  
                      <li><code>cerrada</code>: Boolean (opcional, para cierres)</li>  
                    </ul>  
                  </div>  
                </Card.Body>  
              </Card>  
            </Col>  
          </Row>  
  
          {/* Visualización de Nodos */}  
          <Card className="custom-card mb-4">  
            <Card.Header className="bg-info text-white">  
              <h5 className="mb-0">🎯 Nodos del Grafo ({graphData.nodes.length})</h5>  
            </Card.Header>  
            <Card.Body>  
              <Row>  
                {graphData.nodes.map((node, index) => (  
                  <Col md={3} key={index} className="mb-3">  
                    <div className="text-center p-3 border rounded">  
                      <div className="mb-2">  
                        {node.type === 'CentroDistribucion' ? '🏢' : '📍'}  
                      </div>  
                      <Badge bg={getNodeColor(node)} className="mb-2">  
                        {node.type}  
                      </Badge>  
                      <div className="fw-bold">{node.nombre}</div>  
                      {node.tipoZona && (  
                        <small className="text-muted">{node.tipoZona}</small>  
                      )}  
                    </div>  
                  </Col>  
                ))}  
              </Row>  
            </Card.Body>  
          </Card>  
  
          {/* Visualización de Relaciones */}  
          <Card className="custom-card">  
            <Card.Header className="bg-warning text-dark">  
              <h5 className="mb-0">🛣️ Relaciones CONECTA ({graphData.relationships.length})</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="table-responsive">  
                <table className="table table-striped">  
                  <thead>  
                    <tr>  
                      <th>Origen</th>  
                      <th>Destino</th>  
                      <th>Tiempo (min)</th>  
                      <th>Tráfico</th>  
                      <th>Capacidad</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {graphData.relationships.map((rel, index) => (  
                      <tr key={index}>  
                        <td>  
                          <Badge bg={rel.from.startsWith('CD_') ? 'primary' : 'secondary'}>  
                            {rel.from}  
                          </Badge>  
                        </td>  
                        <td>  
                          <Badge bg={rel.to.startsWith('CD_') ? 'primary' : 'secondary'}>  
                            {rel.to}  
                          </Badge>  
                        </td>  
                        <td>  
                          <span className="fw-bold text-primary">{convertNeo4jInteger(rel.tiempo_minutos)}</span>  
                        </td>  
                        <td>  
                          <Badge bg={getTrafficColor(rel.trafico_actual)}>  
                            {rel.trafico_actual}  
                          </Badge>  
                        </td>  
                        <td>{convertNeo4jInteger(rel.capacidad)}</td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </table>  
              </div>  
            </Card.Body>  
          </Card>  
  
          {/* Diagrama Conceptual (puede ser estático o dinámico) */}  
          <Card className="custom-card mt-4">  
            <Card.Header className="bg-success text-white">  
              <h5 className="mb-0">🗺️ Diagrama Conceptual de la Red</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>  
                {/* Este diagrama es estático, podrías hacerlo dinámico con librerías de visualización de grafos */}  
                <p className="text-muted">Este es un diagrama conceptual estático. Para una visualización dinámica, se requeriría una librería de grafos.</p>  
              </div>  
            </Card.Body>  
          </Card>  
        </>  
      )}  
    </div>  
  );  
};  
  
export default GraphVisualization;