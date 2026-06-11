import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../AuthContext';
import { Users, CalendarCheck, Briefcase, LayoutDashboard, CheckCircle, IndianRupee, X, Check, AlertCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmingBookingId, setConfirmingBookingId] = useState(null);
    const [feedbackingBookingId, setFeedbackingBookingId] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackData, setFeedbackData] = useState({});
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    
    // Keep a safe default until auth context is hydrated.
    const [activeTab, setActiveTab] = useState('my_bookings');

    useEffect(() => {
        if (!user) return;
        setActiveTab(user.role === 'admin' ? 'revenue' : 'my_bookings');
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                if (user.role === 'admin') {
                    const [bookingsData, usersData, appsData] = await Promise.all([
                        api.get('/bookings', config),
                        api.get('/users', config),
                        api.get('/applications', config)
                    ]);
                    setBookings(bookingsData.data);
                    setUsers(usersData.data);
                    setApplications(appsData.data);
                } else {
                    const myBookingsData = await api.get('/bookings/mybookings', config);
                    setMyBookings(myBookingsData.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load data from database.');
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const updateBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Update local state smoothly without reload
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (err) {
            alert('Failed to update booking status.');
        }
    };

    const approveApplication = async (appId) => {
        try {
            const response = await api.put(`/applications/${appId}/approve`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setApplications(applications.map(a => a._id === appId ? response.data.application : a));
            alert('Application approved successfully!');
        } catch (err) {
            alert('Failed to approve application: ' + (err.response?.data?.message || err.message));
        }
    };

    const rejectApplication = async (appId) => {
        try {
            await api.put(`/applications/${appId}/reject`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setApplications(applications.map(a => a._id === appId ? { ...a, status: 'Rejected' } : a));
            alert('Application rejected.');
        } catch (err) {
            alert('Failed to reject application.');
        }
    };

    const confirmWorkCompletion = async (bookingId) => {
        try {
            const response = await api.put(`/bookings/${bookingId}/confirm-completion`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMyBookings(myBookings.map(b => b._id === bookingId ? response.data.booking : b));
            setConfirmingBookingId(null);
            
            // Prepare feedback data
            const booking = myBookings.find(b => b._id === bookingId);
            setFeedbackData({
                bookingId: bookingId,
                employeeId: booking.employeeId?._id || booking.employeeId,
                employeeName: booking.employeeId?.name || 'Expert',
                serviceId: booking.serviceId?._id || booking.serviceId,
                serviceName: booking.serviceId?.title || 'Service'
            });
            
            // Show feedback form
            setFeedbackingBookingId(bookingId);
            setFeedbackRating(5);
            setFeedbackComment('');
        } catch (err) {
            alert('Failed to confirm completion: ' + (err.response?.data?.message || err.message));
        }
    };

    const submitFeedback = async () => {
        if (!feedbackData.bookingId) return;
        
        try {
            setSubmittingFeedback(true);
            await api.post('/feedback', {
                bookingId: feedbackData.bookingId,
                employeeId: feedbackData.employeeId,
                serviceId: feedbackData.serviceId,
                rating: feedbackRating,
                comment: feedbackComment
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            alert('✓ Thank you! Your feedback has been submitted.');
            setFeedbackingBookingId(null);
            setFeedbackRating(5);
            setFeedbackComment('');
            setSubmittingFeedback(false);
        } catch (err) {
            alert('Failed to submit feedback: ' + (err.response?.data?.message || err.message));
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-bold p-4">{error}</div>;
    }

    // Filter data based on search term
    const filteredBookings = bookings.filter(b =>
        String(b._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.serviceId?.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMyBookings = myBookings.filter(b =>
        String(b._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.serviceId?.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        String(u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(u.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApplications = applications.filter(app =>
        String(app.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(app.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4">
                
                {/* Header Profile / Stats Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-text-main mb-2 tracking-tight flex items-center gap-3">
                        <LayoutDashboard className="text-primary w-8 h-8" />
                        {user.role === 'admin' ? 'Admin Dashboard' : 'My Account Dashboard'}
                    </h1>
                    <p className="text-muted">
                        {user.role === 'admin' ? 'Overview of all database metrics and requests.' : `Welcome back, ${user.name}. View your activity.`}
                    </p>
                </div>

                {user.role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted uppercase tracking-wider">Total Revenue</p>
                                <h3 className="text-3xl font-extrabold text-text-main">
                                    ₹{bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed').reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
                                </h3>
                            </div>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted uppercase tracking-wider">Pending Applications</p>
                                <h3 className="text-3xl font-extrabold text-text-main">{applications.filter(a => a.status === 'Pending').length}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs & Table Section */}
                <div className="bg-surface rounded-2xl border border-border shadow-md flex flex-col md:flex-row min-h-[500px]">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-background/50 p-4">
                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 px-2">Data Categories</h4>
                        <div className="space-y-2">
                            {user.role === 'admin' ? (
                                <>
                                    <button onClick={() => setActiveTab('revenue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition ${activeTab === 'revenue' ? 'bg-primary text-white shadow-glow' : 'text-text-main hover:bg-surface-hover'}`}>
                                        <IndianRupee className="w-5 h-5" /> Revenue Details
                                    </button>
                                    <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition ${activeTab === 'applications' ? 'bg-primary text-white shadow-glow' : 'text-text-main hover:bg-surface-hover'}`}>
                                        <Briefcase className="w-5 h-5" /> Job Applications
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setActiveTab('my_bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition ${activeTab === 'my_bookings' ? 'bg-primary text-white shadow-glow' : 'text-text-main hover:bg-surface-hover'}`}>
                                    <CalendarCheck className="w-5 h-5" /> My Bookings
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Data Display */}
                    <div className="flex-1 p-6 flex flex-col">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                            <h3 className="text-xl font-bold">
                                {activeTab === 'revenue' && 'Revenue Analytics'}
                                {activeTab === 'applications' && 'Partner Job Applications'}
                                {activeTab === 'my_bookings' && 'My Service History'}
                            </h3>
                            <div className="relative w-full md:w-64">
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-4 pr-4 py-2 text-sm rounded-lg border border-border bg-background h-[38px] m-0 focus:outline-none focus:border-primary transition" 
                                />
                            </div>
                        </div>

                        {/* Responsive Table Wrapper */}
                        <div className="overflow-x-auto border border-border rounded-xl flex-1">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-background/80 text-muted uppercase tracking-wider border-b border-border">
                                        {activeTab === 'revenue' && (
                                            <>
                                                <th className="p-4 font-bold">Booking ID</th>
                                                <th className="p-4 font-bold">Customer</th>
                                                <th className="p-4 font-bold">Service</th>
                                                <th className="p-4 font-bold">Amount</th>
                                                <th className="p-4 font-bold">Date</th>
                                                <th className="p-4 font-bold">Status</th>
                                            </>
                                        )}
                                        {activeTab === 'my_bookings' && (
                                            <>
                                                <th className="p-4 font-bold">Booking ID</th>
                                                <th className="p-4 font-bold">Service Details</th>
                                                <th className="p-4 font-bold">Payment Info</th>
                                                <th className="p-4 font-bold">Appointment</th>
                                                <th className="p-4 font-bold text-right">Status</th>
                                            </>
                                        )}
                                        {activeTab === 'applications' && (
                                            <><th className="p-4">Applicant</th><th className="p-4">Details</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Revenue Details Tab */}
                                    {activeTab === 'revenue' && filteredBookings.length === 0 && (
                                        <tr><td colSpan="6" className="p-8 text-center text-muted">No revenue data found.</td></tr>
                                    )}
                                    {activeTab === 'revenue' && filteredBookings.map(b => (
                                        <tr key={b._id} className="border-b border-border hover:bg-background/30 transition">
                                            <td className="p-4 font-bold text-muted">#{b._id.toString().slice(-6).toUpperCase()}</td>
                                            <td className="p-4">
                                                <div className="font-semibold">{b.userName}</div>
                                                <div className="text-xs text-muted">{b.userPhone}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold">{b.serviceId?.title || 'Unknown'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-extrabold text-primary text-lg">₹{b.totalAmount || 0}</div>
                                            </td>
                                            <td className="p-4 text-muted">
                                                {new Date(b.appointmentDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Completed' ? 'bg-green-500/10 text-green-500' : b.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Customer My Bookings Tab */}
                                    {activeTab === 'my_bookings' && filteredMyBookings.length === 0 && (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted">You have no booking history.</td></tr>
                                    )}
                                    {activeTab === 'my_bookings' && filteredMyBookings.map(b => (
                                        <>
                                            {/* Notification Row: Employee Finished */}
                                            {b.employeeFinished && b.status === 'Confirmed' && (
                                                <tr key={`notification-${b._id}`} className="border-b border-green-500/50 bg-green-500/5">
                                                    <td colSpan="5" className="p-4">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                                            <div className="flex items-center gap-3">
                                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                                <div>
                                                                    <p className="font-bold text-green-600">Expert has finished the work!</p>
                                                                    <p className="text-xs text-green-600/70">Please confirm that the work is completed satisfactorily</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 md:ml-auto">
                                                                <button
                                                                    onClick={() => confirmWorkCompletion(b._id)}
                                                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition text-sm flex items-center gap-2 whitespace-nowrap"
                                                                >
                                                                    <Check className="w-4 h-4" /> Confirm Complete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            
                                            {/* Booking Row */}
                                            <tr key={b._id} className="border-b border-border hover:bg-background/30 transition">
                                                <td className="p-4 font-bold text-muted">#{b._id.toString().slice(-6).toUpperCase()}</td>
                                                <td className="p-4 font-bold">{b.serviceId?.title || 'Service Details Deleted'}</td>
                                                <td className="p-4 text-xs font-bold uppercase">{b.paymentMethod}</td>
                                                <td className="p-4 text-muted">{new Date(b.appointmentDate).toLocaleString()}</td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${b.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : b.status === 'Confirmed' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        </>
                                    ))}

                                    {/* Admin Users Tab */}
                                    {/* Removed: Users tab no longer shown in admin view */}

                                    {/* Admin Applications Tab */}
                                    {activeTab === 'applications' && applications.length === 0 && (
                                        <tr><td colSpan="4" className="p-8 text-center text-muted">No applications found.</td></tr>
                                    )}
                                    {activeTab === 'applications' && filteredApplications.map(app => (
                                        <tr key={app._id} className="border-b border-border hover:bg-background/30 transition">
                                            <td className="p-4 border-b">
                                                <div className="font-semibold">{app.fullName}</div>
                                                <div className="text-xs text-muted">{app.phone}</div>
                                            </td>
                                            <td className="p-4 border-b">
                                                <div className="font-bold">{app.category}</div>
                                                <div className="text-xs text-muted">{app.experience} years &bull; {app.city}</div>
                                            </td>
                                            <td className="p-4 border-b">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : app.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' : app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b text-right">
                                                {app.status === 'Pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => approveApplication(app._id)} 
                                                            className="bg-green-500 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1 hover:bg-green-600"
                                                        >
                                                            <Check className="w-4 h-4" /> Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => rejectApplication(app._id)} 
                                                            className="bg-red-500 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1 hover:bg-red-600"
                                                        >
                                                            <X className="w-4 h-4" /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {app.status === 'Approved' && (
                                                    <span className="text-xs font-bold text-green-600">✓ Added to System</span>
                                                )}
                                                {app.status === 'Rejected' && (
                                                    <span className="text-xs font-bold text-red-600">Rejected</span>
                                                )}
                                                {app.assignedEmployeeId && (
                                                    <span className="text-xs font-bold text-green-600 block bg-green-50 rounded-full px-2 py-1 text-center border border-green-200">
                                                        ✓ Assigned
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div>

            {/* Feedback Modal */}
            {feedbackingBookingId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-2">Rate Your Experience</h3>
                        <p className="text-sm text-muted mb-6">Help us improve our service</p>
                        
                        <div className="mb-6 p-4 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted font-bold mb-1">EXPERT</p>
                            <p className="font-bold text-text-main mb-3">{feedbackData.employeeName}</p>
                            <p className="text-xs text-muted font-bold mb-1">SERVICE</p>
                            <p className="font-bold text-text-main">{feedbackData.serviceName}</p>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <p className="text-sm font-bold text-muted mb-3">Rating</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setFeedbackRating(star)}
                                        className="transition"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= feedbackRating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-border'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted mt-2">{feedbackRating} star{feedbackRating !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <p className="text-sm font-bold text-muted mb-2">Additional Feedback (Optional)</p>
                            <textarea
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full p-3 border border-border bg-background rounded-lg text-text-main placeholder-muted text-sm resize-none"
                                rows="4"
                                maxLength="500"
                            />
                            <p className="text-xs text-muted mt-1">{feedbackComment.length}/500</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setFeedbackingBookingId(null);
                                    setFeedbackRating(5);
                                    setFeedbackComment('');
                                }}
                                className="flex-1 bg-background text-muted font-bold py-2 rounded-lg border border-border hover:bg-surface transition"
                            >
                                Skip
                            </button>
                            <button
                                onClick={submitFeedback}
                                disabled={submittingFeedback}
                                className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
