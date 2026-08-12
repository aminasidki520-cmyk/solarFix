import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import TicketsPage from "./pages/Tickets/TicketsPage";
import TicketDetailsPage from "./pages/Tickets/TicketDetailsPage"; 
import CreateTicketPage from "./pages/Tickets/CreateTicketPage";
import TechniciansPage from "./pages/Technicians/TechniciansPage";
import Layout from "./components/layout/Layout";
import { theme } from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Route publique */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Routes protégées */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="tickets/:id" element={<TicketDetailsPage />} />
                            <Route path="tickets" element={<TicketsPage />} />
                            <Route path="/tickets/new" element={<CreateTicketPage />} />
                            <Route path="technicians" element={<TechniciansPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;