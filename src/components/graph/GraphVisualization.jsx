import React, { useState, useEffect } from 'react';  
import { Card, Row, Col, Badge, Alert, Button } from 'react-bootstrap';  
import { graphService } from '../../services/api';  
  
const GraphVisualization = () => {  
  const [graphData, setGraphData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState('');  
  
  // Datos del modelo basados en tu backend  
  const modelData = {  
    nodes: [  
      { id: 'CD_1', type: 'CentroDistribucion', label: 'CD_1' },  
      { id: 'CD_2', type: 'CentroDistribucion', label: 'CD_2' },  
      { id: 'Altamira', type: 'Zona', subtype: 'residencial', label: 'Altamira' },  
      { id: 'Chacao', type: 'Zona', subtype: 'comercial', label: 'Chacao' },  
      { id: 'Las Mercedes', type: 'Zona', subtype: 'comercial', label: 'Las Mercedes' },  
      { id: 'La Urbina', type: 'Zona', subtype: 'residencial', label: 'La Urbina' },  
      { id: 'Petare', type: 'Zona', subtype: 'residencial', label: 'Petare' },  
      { id: 'El Rosal', type: 'Zona', subtype: 'comercial', label: 'El Rosal' },  
      { id: 'Los Palos Grandes', type: 'Zona', subtype: 'residencial', label: 'Los Palos Grandes' },  
      { id: 'El Cafetal', type: 'Zona', subtype: 'residencial', label: 'El Cafetal' }  
    ],  
    relationships: [  
      { from: 'CD_1', to: 'Altamira', tiempo: 5, trafico: 'medio', capacidad: 3 },  
      { from: 'Altamira', to: 'Chacao', tiempo: 4, trafico: 'bajo', capacidad: 2 },  
      { from: 'Chacao', to: 'Las Mercedes', tiempo: 6, trafico: 'alto', capacidad: 2 },  
      { from: 'Las Mercedes', to: 'La Urbina', tiempo: 7, trafico: 'medio', capacidad: 2 },  
      { from: 'La Urbina', to: 'Petare', tiempo: 8, trafico: 'bajo', capacidad: 2 },  
      { from: 'Petare', to: 'El Rosal', tiempo: 9, trafico: 'medio', capacidad: 3 },  
      { from: 'El Rosal', to: 'Los Palos Grandes', tiempo: 3, trafico: 'bajo', capacidad: 2 },  
      { from: 'Los Palos Grandes', to: 'El Cafetal', tiempo: 4, trafico: 'alto', capacidad: 2 },  
      { from: 'CD_2', to: 'Las Mercedes', tiempo: 6, trafico: 'medio', capacidad: 3 }  
    ]  
  };  
  
  const initializeGraph = async () => {  
    setLoading(true);  
    try {  
      await graphService.migrateAndSeed();  
      setMessage('Modelo de grafos inicializado correctamente en Neo4j');  
      setGraphData(modelData);  
    } catch (err) {  
      setMessage('Error al inicializar el modelo: ' + err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    setGraphData(modelData);  
  }, []);  
  
  const getNodeColor = (node) => {  
    if (node.type === 'CentroDistribucion') return 'primary';  
    return node.subtype === 'comercial' ? 'info' : 'success';  
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
          {loading ? 'Inicializando...' : '🔄 Inicializar Modelo'}  
        </Button>  
      </div>  
  
      {message && (  
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">  
          {message}  
        </Alert>  
      )}  
  
      {graphData && (  
        <>  
          {/* Esquema del Modelo */}  
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
                      <div className="fw-bold">{node.label}</div>  
                      {node.subtype && (  
                        <small className="text-muted">{node.subtype}</small>  
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
                          <span className="fw-bold text-primary">{rel.tiempo}</span>  
                        </td>  
                        <td>  
                          <Badge bg={getTrafficColor(rel.trafico)}>  
                            {rel.trafico}  
                          </Badge>  
                        </td>  
                        <td>{rel.capacidad}</td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </table>  
              </div>  
            </Card.Body>  
          </Card>  
  
          {/* Diagrama Conceptual */}  
          <Card className="custom-card mt-4">  
            <Card.Header className="bg-success text-white">  
              <h5 className="mb-0">🗺️ Diagrama Conceptual de la Red</h5>  
            </Card.Header>  
            <Card.Body>  
              <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>  
                <div className="mb-3">  
                  <span className="badge bg-primary me-2">🏢 CD_1</span>  
                  <span className="text-muted">→ (5min) →</span>  
                  <span className="badge bg-success ms-2">📍 Altamira</span>  
                </div>  
                <div className="mb-3">  
                  <span className="badge bg-success me-2">📍 Altamira</span>  
                  <span className="text-muted">→ (4min) →</span>  
                  <span className="badge bg-info ms-2">📍 Chacao</span>  
                </div>  
                <div className="mb-3">  
                  <span className="badge bg-info me-2">📍 Chacao</span>  
                  <span className="text-muted">→ (6min) →</span>  
                  <span className="badge bg-info ms-2">📍 Las Mercedes</span>  
                </div>  
                <div className="mb-3">  
                  <span className="badge bg-primary me-2">🏢 CD_2</span>  
                  <span className="text-muted">→ (6min) →</span>  
                  <span className="badge bg-info ms-2">📍 Las Mercedes</span>  
                </div>  
                <div className="text-muted small mt-3">  
                  <strong>Leyenda:</strong>   
                  <span className="badge bg-primary ms-2">Centro Distribución</span>  
                  <span className="badge bg-info ms-2">Zona Comercial</span>  
                  <span className="badge bg-success ms-2">Zona Residencial</span>  
                </div>  
              </div>  
            </Card.Body>  
          </Card>  
        </>  
      )}  
    </div>  
  );  
};  
  
export default GraphVisualization;