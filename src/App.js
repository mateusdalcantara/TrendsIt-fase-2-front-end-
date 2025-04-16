import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';


function App() {
  React.useEffect(() => {
    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);
    
    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase credentials!');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    </Router>
  );
}

export default App;