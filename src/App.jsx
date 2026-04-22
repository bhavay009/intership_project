import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import { Dashboard, GenericPage } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<GenericPage title="Leads" />} />
        <Route path="properties" element={<GenericPage title="Properties" />} />
        <Route path="clients" element={<GenericPage title="Clients" />} />
        <Route path="deals" element={<GenericPage title="Deals" />} />
        <Route path="reports" element={<GenericPage title="Reports" />} />
        <Route path="users" element={<GenericPage title="Users" />} />
        <Route path="settings" element={<GenericPage title="Settings" />} />
      </Route>
    </Routes>
  );
}

export default App;
