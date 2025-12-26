import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ChairDashboard from "./pages/ChairDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/chair" element={<ChairDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
