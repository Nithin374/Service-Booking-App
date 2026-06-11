import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SystemAdmin from './pages/SystemAdmin';
import Partner from './pages/Partner';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { AuthProvider, useAuth } from './AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Wait for auth to load
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const UserOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

const AdminOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/services" replace />;
    return children;
};

const EmployeeOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'provider' && user.role !== 'employee') return <Navigate to="/services" replace />;
    return children;
};

// Layout component to use auth context downstream
const AppLayout = () => {
    const { user, loading } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {user && <Navbar />}
            <main className="flex-grow flex flex-col">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes - Users & Admin */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    
                    {/* Protected Routes - Admin Only */}
                    <Route path="/system-admin" element={<AdminOnlyRoute><SystemAdmin /></AdminOnlyRoute>} />
                    
                    {/* Protected Routes - Employee Only */}
                    <Route path="/employee-dashboard" element={<EmployeeOnlyRoute><EmployeeDashboard /></EmployeeOnlyRoute>} />
                    
                    {/* Protected Routes - Users Only */}
                    <Route path="/" element={<UserOnlyRoute><Home /></UserOnlyRoute>} />
                    <Route path="/services" element={<UserOnlyRoute><Services /></UserOnlyRoute>} />
                    <Route path="/partner" element={<UserOnlyRoute><Partner /></UserOnlyRoute>} />
                    <Route path="/book/:serviceId" element={<UserOnlyRoute><Booking /></UserOnlyRoute>} />
                    
                    {/* Redirect /admin to dashboard */}
                    <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
            {user && (
                <footer className="mt-auto py-6 text-center text-gray-500 text-sm bg-white border-t border-gray-200">
                    <div className="container">
                        <p>&copy; {new Date().getFullYear()} Premium Services. All rights reserved.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppLayout />
        </AuthProvider>
    );
}

export default App;
