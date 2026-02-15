/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App*/
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Legislations from './pages/Legislations';
import LegislationDetail from './pages/LegislationDetail';
import SubmitFeedback from './pages/SubmitFeedback';
import UploadCSV from './pages/UploadCSV';
import Analytics from './pages/Analytics';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/legislations" element={<Legislations />} />
              <Route path="/legislation/:id" element={<LegislationDetail />} />
              
              {/* Submit Feedback - Only for viewers and analysts */}
              <Route 
                path="/submit-feedback" 
                element={
                  <PrivateRoute allowedRoles={['viewer', 'analyst']}>
                    <SubmitFeedback />
                  </PrivateRoute>
                } 
              />
              
              {/* Upload CSV - Only for admins */}
              <Route 
                path="/upload-csv" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <UploadCSV />
                  </PrivateRoute>
                } 
              />
              
              {/* Analytics - For admins and analysts */}
              <Route 
                path="/analytics/:id" 
                element={
                  <PrivateRoute allowedRoles={['admin', 'analyst']}>
                    <Analytics />
                  </PrivateRoute>
                } 
              />
            </Route>
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;