import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../AuthContext';
import { CheckCircle, AlertCircle, Clock, MapPin, User, Phone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, confirmed, completed
    const [markingFinished, setMarkingFinished] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchBookings();
        const interval = setInterval(fetchBookings, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

    const fetchBookings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Get all bookings where employeeId matches current user
            const response = await api.get('/bookings', config);
            const allBookings = response.data;
            
            // Filter bookings assigned to this employee
            const employeeBookings = allBookings.filter(b => b.employeeId === user._id);
            setBookings(employeeBookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)));
            setLoading(false);
        } catch (err) {
            setError('Failed to load bookings');
            setLoading(false);
        }
    };

    const markWorkFinished = async (bookingId) => {
        try {
            setMarkingFinished(bookingId);
            const response = await api.put(
                `/bookings/${bookingId}/employee-finished`, 
                {}, 
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setBookings(bookings.map(b => b._id === bookingId ? response.data.booking : b));
            alert('✓ Work marked as finished! Customer will be notified.');
            setMarkingFinished(null);
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || err.message));
            setMarkingFinished(null);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Logout as expert?')) {
            logout();
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Filter bookings based on selected status
    let filteredBookings = bookings;
    if (filterStatus === 'pending') {
        filteredBookings = bookings.filter(b => b.status === 'Pending');
    } else if (filterStatus === 'confirmed') {
        filteredBookings = bookings.filter(b => b.status === 'Confirmed' && !b.employeeFinished);
    } else if (filterStatus === 'completed') {
        filteredBookings = bookings.filter(b => b.status === 'Completed' || b.employeeFinished);
    }

    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const activeCount = bookings.filter(b => b.status === 'Confirmed' && !b.employeeFinished).length;
    const completedCount = bookings.filter(b => b.status === 'Completed' || b.employeeFinished).length;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-surface border-b border-border shadow-sm sticky top-0 z-40">
                <div className="container py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-text-main">Expert Dashboard</h1>
                            <p className="text-muted text-sm mt-1">👋 Welcome, {user?.name}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-lg hover:bg-red-500/20 transition font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Pending Card */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-muted font-semibold text-sm">To Be Confirmed</h3>
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-4xl font-extrabold text-text-main">{pendingCount}</p>
                        <p className="text-xs text-muted mt-2">Bookings awaiting confirmation</p>
                    </div>

                    {/* Active Card */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-muted font-semibold text-sm">Active Jobs</h3>
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-4xl font-extrabold text-text-main">{activeCount}</p>
                        <p className="text-xs text-muted mt-2">Confirmed & not yet finished</p>
                    </div>

                    {/* Completed Card */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-muted font-semibold text-sm">Completed</h3>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-4xl font-extrabold text-text-main">{completedCount}</p>
                        <p className="text-xs text-muted mt-2">Jobs finished or confirmed</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filterStatus === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-border text-muted hover:border-primary'
                        }`}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filterStatus === 'pending'
                                ? 'bg-orange-500 text-white'
                                : 'bg-surface border border-border text-muted hover:border-orange-500'
                        }`}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('confirmed')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filterStatus === 'confirmed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-surface border border-border text-muted hover:border-blue-500'
                        }`}
                    >
                        Active ({activeCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('completed')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filterStatus === 'completed'
                                ? 'bg-green-500 text-white'
                                : 'bg-surface border border-border text-muted hover:border-green-500'
                        }`}
                    >
                        Completed ({completedCount})
                    </button>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                            <AlertCircle className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-muted mb-2">No bookings found</h3>
                            <p className="text-sm text-muted">You don't have any bookings in this category.</p>
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <div
                                key={booking._id}
                                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                {/* Header */}
                                <div className="bg-background/50 border-b border-border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-text-main">
                                                #{booking._id.toString().slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-muted">
                                                {booking.serviceId?.title || 'Service'} - {booking.serviceId?.category}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                                booking.status === 'Pending'
                                                    ? 'bg-orange-500/10 text-orange-500'
                                                    : booking.status === 'Confirmed'
                                                    ? 'bg-blue-500/10 text-blue-500'
                                                    : 'bg-green-500/10 text-green-500'
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left: Customer Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-muted uppercase mb-2">Customer</h4>
                                            <div className="bg-background/50 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-primary" />
                                                    <span className="font-bold text-text-main">{booking.userName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                    <span className="text-text-main">{booking.userPhone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <p className="text-text-main">{booking.location}</p>
                                                        <p className="text-xs text-muted">{booking.userAddress}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Appointment & Actions */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-muted uppercase mb-2">Appointment</h4>
                                            <div className="bg-background/50 rounded-lg p-3">
                                                <p className="font-bold text-text-main">
                                                    {new Date(booking.appointmentDate).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted mt-1">
                                                    Amount: ₹{booking.totalAmount}
                                                </p>
                                                {booking.employeeFinished && (
                                                    <p className="text-xs text-green-600 mt-2 font-bold">
                                                        ✓ You marked as finished
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {booking.status === 'Confirmed' && !booking.employeeFinished && (
                                            <button
                                                onClick={() => markWorkFinished(booking._id)}
                                                disabled={markingFinished === booking._id}
                                                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {markingFinished === booking._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                                        Marking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        Mark Work as Finished
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {booking.employeeFinished && booking.status !== 'Completed' && (
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                                                <p className="text-xs font-bold text-blue-600">
                                                    ⏳ Waiting for customer confirmation...
                                                </p>
                                            </div>
                                        )}

                                        {booking.status === 'Completed' && (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                                                <p className="text-xs font-bold text-green-600">
                                                    ✓ Customer confirmed completion
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
