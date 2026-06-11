import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../AuthContext';
import { Users, Plus, Trash2, ToggleRight, ToggleLeft, Edit2, CheckCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SystemAdmin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [employees, setEmployees] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'bookings', or 'applications'
    const [assigningBookingId, setAssigningBookingId] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        experience: '',
        city: ''
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchEmployees();
        fetchBookings();
        fetchApplications();
    }, [user, navigate]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(response.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setApplications(response.data);
        } catch (err) {
            console.error('Error fetching applications:', err);
        }
    };

    const approveApplication = async (appId) => {
        try {
            console.log('Approving application:', appId);
            const response = await api.put(`/applications/${appId}/approve`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log('Approval response:', response.data);
            alert('Application approved! Employee has been added to the system.');
            // Use the full response from backend to include assignedEmployeeId
            setApplications(applications.map(app => app._id === appId ? response.data.application : app));
            await fetchEmployees(); // Refresh employees list to update total count
        } catch (err) {
            console.error('Error approving application:', err);
            alert('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const rejectApplication = async (appId) => {
        try {
            await api.put(`/applications/${appId}/reject`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Application rejected.');
            setApplications(applications.map(app => app._id === appId ? {...app, status: 'Rejected'} : app));
        } catch (err) {
            alert('Error: ' + err.response?.data?.message);
        }
    };

    const addEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/employees', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEmployees([response.data, ...employees]);
            setFormData({ name: '', email: '', phone: '', category: '', experience: '', city: '' });
            setShowForm(false);
            alert('Employee added!');
        } catch (err) {
            alert('Error: ' + err.response?.data?.message);
        }
    };

    const toggleAvailable = async (id) => {
        try {
            const response = await api.put(`/employees/${id}/availability`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEmployees(employees.map(e => e._id === id ? response.data : e));
        } catch (err) {
            alert('Error');
        }
    };

    const deleteEmployee = async (id) => {
        if (window.confirm('Delete this employee?')) {
            try {
                await api.delete(`/employees/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setEmployees(employees.filter(e => e._id !== id));
            } catch (err) {
                alert('Error');
            }
        }
    };

    const assignEmployeeToBooking = async (bookingId) => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }
        try {
            const response = await api.put(`/bookings/${bookingId}/status`, 
                { 
                    status: 'Confirmed',
                    employeeId: selectedEmployee
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );
            setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
            fetchEmployees(); // Refresh employees list to update currentJobs count
            setAssigningBookingId(null);
            setSelectedEmployee('');
            alert('Employee assigned successfully!');
        } catch (err) {
            alert('Error: ' + err.response?.data?.message);
        }
    };

    const completeBooking = async (bookingId) => {
        if (window.confirm('Mark this booking as Completed?')) {
            try {
                const response = await api.put(`/bookings/${bookingId}/status`, 
                    { status: 'Completed' },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
                fetchEmployees();
                alert('Booking marked as completed!');
            } catch (err) {
                alert('Error: ' + err.response?.data?.message);
            }
        }
    };

    const markWorkAsFinished = async (bookingId) => {
        if (window.confirm('Mark work as finished? Customer will see a notification to confirm.')) {
            try {
                const response = await api.put(`/bookings/${bookingId}/employee-finished`, {}, 
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setBookings(bookings.map(b => b._id === bookingId ? response.data.booking : b));
                alert('✓ Work marked as finished! Customer will be notified.');
            } catch (err) {
                alert('Error: ' + err.response?.data?.message);
            }
        }
    };

    const cancelBooking = async (bookingId) => {
        if (window.confirm('Cancel this booking?')) {
            try {
                const response = await api.put(`/bookings/${bookingId}/status`, 
                    { status: 'Cancelled' },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setBookings(bookings.map(b => b._id === bookingId ? response.data : b));
                fetchEmployees();
                alert('Booking cancelled!');
            } catch (err) {
                alert('Error: ' + err.response?.data?.message);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-text-main mb-2 flex items-center gap-3">
                        <Users className="text-primary w-8 h-8" />
                        System Admin Dashboard
                    </h1>
                    <p className="text-muted">Manage employees and assign jobs to pending bookings</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-border">
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={`px-6 py-3 font-bold transition border-b-2 ${activeTab === 'employees' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
                    >
                        Employees
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-3 font-bold transition border-b-2 ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
                    >
                        Applications ({applications.filter(a => a.status === 'Pending').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 font-bold transition border-b-2 ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
                    >
                        All Bookings ({bookings.length})
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-surface p-6 rounded-2xl border border-border">
                        <p className="text-sm font-bold text-muted mb-2">Total Employees</p>
                        <h3 className="text-3xl font-extrabold text-primary">{employees.length}</h3>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border">
                        <p className="text-sm font-bold text-muted mb-2">Pending Applications</p>
                        <h3 className="text-3xl font-extrabold text-orange-600">{applications.filter(a => a.status === 'Pending').length}</h3>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border">
                        <p className="text-sm font-bold text-muted mb-2">Active Bookings</p>
                        <h3 className="text-3xl font-extrabold text-blue-600">{bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length}</h3>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border">
                        <p className="text-sm font-bold text-muted mb-2">Completed Bookings</p>
                        <h3 className="text-3xl font-extrabold text-green-600">{bookings.filter(b => b.status === 'Completed').length}</h3>
                    </div>
                </div>

                {/* Employees Tab */}
                {activeTab === 'employees' && (
                <>
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90"
                    >
                        <Plus className="w-5 h-5" /> Add Employee
                    </button>
                </div>

                {/* Available Employees Section */}
                <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Available Employees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees.filter(e => e.isAvailable && e.status === 'Active').length > 0 ? (
                            employees.filter(e => e.isAvailable && e.status === 'Active').map(emp => (
                                <div key={emp._id} className="bg-background border border-border rounded-lg p-4 hover:border-primary transition">
                                    <h4 className="font-bold text-lg mb-2">{emp.name}</h4>
                                    <p className="text-sm text-muted mb-1">{emp.category}</p>
                                    <p className="text-sm text-muted mb-3">📍 {emp.city}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded font-bold">⭐ {emp.rating.toFixed(1)}</span>
                                        <span className="text-muted">{emp.currentJobs}/{emp.maxJobs} jobs</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted text-center col-span-full">No available employees</p>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
                        <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="p-3 border border-border bg-background rounded-lg" />
                            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="p-3 border border-border bg-background rounded-lg" />
                            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="p-3 border border-border bg-background rounded-lg" />
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="p-3 border border-border bg-background rounded-lg">
                                <option>Select Category</option>
                                <option value="Air Conditioner">Air Conditioner</option>
                                <option value="Beauty Salon">Beauty Salon</option>
                                <option value="Refrigerator">Refrigerator</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Geyser">Geyser</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Washing Machine">Washing Machine</option>
                                <option value="Water Purifier">Water Purifier</option>
                            </select>
                            <input type="number" placeholder="Experience (years)" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required className="p-3 border border-border bg-background rounded-lg" />
                            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required className="p-3 border border-border bg-background rounded-lg" />
                            <button type="submit" className="md:col-span-2 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90">Add Employee</button>
                        </form>
                    </div>
                )}

                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-background/80 text-muted uppercase tracking-wider border-b border-border">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">City</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Availability</th>
                                    <th className="p-4">Jobs</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 && (
                                    <tr><td colSpan="7" className="p-8 text-center text-muted">No employees</td></tr>
                                )}
                                {employees.map(emp => (
                                    <tr key={emp._id} className="border-b border-border hover:bg-background/30 transition">
                                        <td className="p-4 font-bold">{emp.name}</td>
                                        <td className="p-4">{emp.category}</td>
                                        <td className="p-4 text-muted">{emp.city}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${emp.status === 'Active' ? 'bg-green-500/10 text-green-600' : emp.status === 'On Leave' ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => toggleAvailable(emp._id)} className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-xs transition ${emp.isAvailable ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'}`}>
                                                {emp.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                {emp.isAvailable ? 'Available' : 'Unavailable'}
                                            </button>
                                        </td>
                                        <td className="p-4 font-bold">{emp.currentJobs}/{emp.maxJobs}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => deleteEmployee(emp._id)} className="text-red-600 hover:bg-red-500/10 p-2 rounded transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div>
                        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-background/80 text-muted uppercase tracking-wider border-b border-border">
                                            <th className="p-4">Full Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Phone</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Experience</th>
                                            <th className="p-4">City</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.length === 0 && (
                                            <tr><td colSpan="8" className="p-8 text-center text-muted">No applications</td></tr>
                                        )}
                                        {applications.map(app => (
                                            <tr key={app._id} className="border-b border-border hover:bg-background/30 transition">
                                                <td className="p-4 font-bold">{app.fullName}</td>
                                                <td className="p-4 text-muted">{app.email}</td>
                                                <td className="p-4">{app.phone}</td>
                                                <td className="p-4">{app.category}</td>
                                                <td className="p-4">{app.experience} years</td>
                                                <td className="p-4">{app.city}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        app.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                                                        app.status === 'Approved' ? 'bg-green-500/10 text-green-600' :
                                                        'bg-red-500/10 text-red-600'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {app.status === 'Pending' && (
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => approveApplication(app._id)}
                                                                className="text-green-600 hover:bg-green-500/10 px-3 py-1 rounded transition font-bold text-sm"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => rejectApplication(app._id)}
                                                                className="text-red-600 hover:bg-red-500/10 px-3 py-1 rounded transition font-bold text-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    {app.status === 'Approved' && (
                                                        <div className="flex gap-2 justify-end items-center flex-wrap">
                                                            <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">
                                                                ✓ Added to System
                                                            </span>
                                                            {app.assignedEmployeeId && (
                                                                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">
                                                                    ✓ Assigned
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div>
                        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-background/80 text-muted uppercase tracking-wider border-b border-border">
                                            <th className="p-4">Customer Name</th>
                                            <th className="p-4">Service</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Assigned Employee</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length === 0 && (
                                            <tr><td colSpan="7" className="p-8 text-center text-muted">No bookings found</td></tr>
                                        )}
                                        {bookings.map(booking => (
                                            <tr key={booking._id} className="border-b border-border hover:bg-background/30 transition">
                                                <td className="p-4 font-bold">{booking.userName}</td>
                                                <td className="p-4">{booking.serviceId?.category || 'Unknown'}</td>
                                                <td className="p-4 text-muted">{booking.location}</td>
                                                <td className="p-4 text-sm">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        booking.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                                                        booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600' :
                                                        booking.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                                                        'bg-red-500/10 text-red-600'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {booking.employeeId ? (
                                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Assigned
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted text-xs">Not assigned</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex gap-2 justify-end flex-wrap">
                                                        {booking.status === 'Pending' && !booking.employeeId && (
                                                            <button
                                                                onClick={() => setAssigningBookingId(booking._id)}
                                                                className="text-primary hover:bg-primary/10 px-3 py-1 rounded transition font-bold text-xs"
                                                            >
                                                                Assign
                                                            </button>
                                                        )}
                                                        {booking.status === 'Confirmed' && !booking.employeeFinished && (
                                                            <button
                                                                onClick={() => markWorkAsFinished(booking._id)}
                                                                className="text-blue-600 hover:bg-blue-500/10 px-3 py-1 rounded transition font-bold text-xs"
                                                            >
                                                                Mark Finished
                                                            </button>
                                                        )}
                                                        {(booking.status === 'Confirmed' || booking.status === 'Pending') && !booking.employeeFinished && (
                                                            <button
                                                                onClick={() => completeBooking(booking._id)}
                                                                className="text-green-600 hover:bg-green-500/10 px-3 py-1 rounded transition font-bold text-xs"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                        {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                                                            <button
                                                                onClick={() => cancelBooking(booking._id)}
                                                                className="text-red-600 hover:bg-red-500/10 px-3 py-1 rounded transition font-bold text-xs"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Assignment Modal */}
                        {assigningBookingId && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full">
                                    {(() => {
                                        const currentBooking = bookings.find(b => b._id === assigningBookingId);
                                        const serviceCategory = currentBooking?.serviceId?.category;
                                        
                                        // Filter employees by service category
                                        const matchingEmployees = employees.filter(emp => emp.category === serviceCategory);
                                        
                                        return (
                                            <>
                                                <h3 className="text-2xl font-bold mb-2">Assign Employee</h3>
                                                <p className="text-sm text-muted mb-6">
                                                    Service: <span className="font-bold text-primary">{serviceCategory}</span>
                                                </p>
                                                
                                                <div className="mb-4 text-sm text-muted">
                                                    <p>Available {serviceCategory} experts: <span className="font-bold text-text-main">{matchingEmployees.length}</span></p>
                                                </div>
                                                
                                                {matchingEmployees.length === 0 ? (
                                                    <div className="bg-orange-500/10 text-orange-600 p-4 rounded-lg mb-6 text-center font-bold">
                                                        No {serviceCategory} experts available
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={selectedEmployee}
                                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                                        className="w-full p-3 border border-border bg-background rounded-lg mb-6"
                                                    >
                                                        <option value="">Select an employee...</option>
                                                        {matchingEmployees
                                                            .sort((a, b) => b.bookingCount - a.bookingCount)
                                                            .map(emp => (
                                                            <option key={emp._id} value={emp._id}>
                                                                {emp.name} - ⭐{emp.rating.toFixed(1)} - {emp.city} ({emp.currentJobs}/{emp.maxJobs} jobs)
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => assignEmployeeToBooking(assigningBookingId)}
                                                        disabled={matchingEmployees.length === 0}
                                                        className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Assign
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAssigningBookingId(null);
                                                            setSelectedEmployee('');
                                                        }}
                                                        className="flex-1 bg-background text-muted font-bold py-2 rounded-lg border border-border hover:bg-surface transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
