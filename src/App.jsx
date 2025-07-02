import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { Container } from 'react-bootstrap';  
import Header from './components/common/Header';  
import Dashboard from './components/dashboard/Dashboard';  
import DijkstraCalculator from './components/routes/DijkstraCalculator';  
import AccessibleZones from './components/zones/AccessibleZones';  
import IncidentManager from './components/network/IncidentManager';  
import NetworkAnalysis from './components/network/NetworkAnalysis';  
import GraphVisualization from './components/graph/GraphVisualization';  
import './styles/custom.css';  
   
  
function App() {  
  return (  
    <Router>  
      <div className="app">  
        <Header />  
        <main className="p-4">  
          <Container fluid>  
            
              <Routes>  
                <Route path="/" element={<Dashboard />} />  
                <Route path="/routes" element={<DijkstraCalculator />} />  
                <Route path="/zones" element={<AccessibleZones />} />  
                <Route path="/incidents" element={<IncidentManager />} />  
                <Route path="/analysis" element={<NetworkAnalysis />} />  
                <Route path="/graph" element={<GraphVisualization />} />  
              </Routes>  
             
          </Container>  
        </main>  
      </div>  
    </Router>  
  );  
}
  
export default App;