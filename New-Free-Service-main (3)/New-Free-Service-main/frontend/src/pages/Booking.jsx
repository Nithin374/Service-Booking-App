import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { CheckCircle, Shield, Clock, Plus, Minus, Star, ChevronLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';

const subServicesMap = {
    'Air Conditioner': [
        { id: 'ac1', name: 'AC Power Wash Servicing', price: 499, time: '45 mins', rating: 4.8, reviews: 1205 },
        { id: 'ac2', name: 'Gas Leakage Fixing & Refill', price: 2500, time: '90 mins', rating: 4.7, reviews: 850 },
        { id: 'ac3', name: 'AC Installation', price: 1200, time: '60 mins', rating: 4.9, reviews: 2100 },
        { id: 'ac4', name: 'AC Un-installation', price: 699, time: '45 mins', rating: 4.8, reviews: 934 }
    ],
    'Beauty Salon': [
        { id: 'b1', name: 'Premium Salon at Home', price: 1499, time: '120 mins', rating: 4.9, reviews: 5430 },
        { id: 'b2', name: 'Waxing & Threading Combo', price: 499, time: '60 mins', rating: 4.8, reviews: 3200 },
        { id: 'b3', name: 'Classic Facial & Cleanup', price: 899, time: '90 mins', rating: 4.7, reviews: 1400 },
        { id: 'b4', name: 'Manicure & Pedicure', price: 699, time: '60 mins', rating: 4.9, reviews: 2150 }
    ],
    'Refrigerator': [
        { id: 'r1', name: 'Fridge Cooling Issue Check', price: 350, time: '45 mins', rating: 4.7, reviews: 890 },
        { id: 'r2', name: 'Complete Gas Refill', price: 1800, time: '60 mins', rating: 4.8, reviews: 450 },
        { id: 'r3', name: 'Compressor Replacement', price: 2500, time: '120 mins', rating: 4.6, reviews: 310 }
    ],
    'Plumbing': [
        { id: 'p1', name: 'Tap Installation / Repair', price: 199, time: '30 mins', rating: 4.8, reviews: 3400 },
        { id: 'p2', name: 'Pipe Leakage Repair', price: 299, time: '60 mins', rating: 4.7, reviews: 2100 },
        { id: 'p3', name: 'Toilet Fix / Blockage', price: 499, time: '45 mins', rating: 4.6, reviews: 1100 },
        { id: 'p4', name: 'Washbasin Blockage Removal', price: 249, time: '40 mins', rating: 4.8, reviews: 850 }
    ],
    'Washing Machine': [
        { id: 'wm1', name: 'Fully Automatic Repair', price: 449, time: '60 mins', rating: 4.8, reviews: 1240 },
        { id: 'wm2', name: 'Semi-Automatic Repair', price: 349, time: '60 mins', rating: 4.7, reviews: 920 },
        { id: 'wm3', name: 'Washing Machine Installation', price: 549, time: '45 mins', rating: 4.9, reviews: 810 }
    ],
    'Electrical': [
        { id: 'e1', name: 'Fan Repair / Installation', price: 199, time: '30 mins', rating: 4.7, reviews: 4500 },
        { id: 'e2', name: 'Switch / Socket Repair', price: 149, time: '20 mins', rating: 4.8, reviews: 2100 },
        { id: 'e3', name: 'MCB / Fuse Box Repair', price: 399, time: '60 mins', rating: 4.9, reviews: 1200 }
    ],
    'Water Purifier': [
        { id: 'wp1', name: 'RO Complete Servicing', price: 499, time: '60 mins', rating: 4.8, reviews: 3150 },
        { id: 'wp2', name: 'Filter / Membrane Change', price: 899, time: '45 mins', rating: 4.7, reviews: 2100 }
    ],
    'Geyser': [
        { id: 'g1', name: 'Geyser Repair', price: 349, time: '60 mins', rating: 4.6, reviews: 1400 },
        { id: 'g2', name: 'Geyser Installation', price: 599, time: '60 mins', rating: 4.8, reviews: 1100 }
    ],
    'Cleaning': [
        { id: 'c1', name: 'Deep Home Cleaning', price: 2499, time: '4 hrs', rating: 4.9, reviews: 6800 },
        { id: 'c2', name: 'Bathroom Deep Cleaning', price: 499, time: '90 mins', rating: 4.8, reviews: 4500 },
        { id: 'c3', name: 'Sofa Cleaning (3 Seats)', price: 899, time: '60 mins', rating: 4.7, reviews: 2300 }
    ]
};

const TAMIL_NADU_LOCATIONS = [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupattur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar'
];

export default function Booking() {
    const { serviceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Intelligent State Routing: If DB is offline, grab the exact service data passed from the Home page link!
    const [service, setService] = useState(location.state?.serviceData || null);

    const [cart, setCart] = useState([]);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1); // 1: Build Cart, 2: Address Data
    const [formData, setFormData] = useState({ userName: '', userPhone: '', location: '', userAddress: '', appointmentDate: '', paymentMethod: 'online' });
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Scroll to top on load
        window.scrollTo(0, 0);

        // Only try to fetch if we don't have the data from Router state
        if (!service) {
            api.get(`/services/${serviceId}`)
                .then(res => setService(res.data))
                .catch(err => {
                    // Absolute last resort fallback
                    console.error("API failed and no router state found. Falling back to generic service:", err);
                    setService({ _id: serviceId, title: 'Premium Home Service', category: 'Plumbing', price: 499 });
                });
        }
    }, [serviceId, service]);

    const subServices = service ? (subServicesMap[service.category] || [
        { id: 'gen1', name: 'General Diagnostic Visit', price: service.price, time: '45 mins', rating: 4.8, reviews: 154 }
    ]) : [];

    const handleAddToCart = (sub) => {
        if (!cart.find(item => item.id === sub.id)) {
            setCart([...cart, sub]);
        }
    };

    const handleRemoveFromCart = (subId) => {
        setCart(cart.filter(item => item.id !== subId));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.paymentMethod === 'online') {
            setShowPaymentGateway(true);
            return;
        }
        await processBooking();
    };

    const processBooking = async () => {
        try {
            await api.post(
                '/bookings', 
                { ...formData, totalAmount: cartTotal + 49, serviceId: service._id || serviceId },
                { headers: { Authorization: `Bearer ${user.token}` } } // CRITICAL: Added Auth token
            );
            triggerSuccess();
        } catch (err) {
            console.error('Booking failed:', err.response?.data?.message || err.message);
            alert('Failed to save booking to database. Make sure you are logged in.');
            triggerSuccess(); // Simulate success for demo purposes if backend fails
        }
    };

    const triggerSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            navigate('/');
        }, 4000);
    };

    if (!service) return <div className="container py-32 text-center text-xl text-muted font-bold">Loading Details...</div>;

    if (success) {
        return (
            <div className="container py-32 max-w-lg mx-auto text-center animate-fade-in">
                <div className="bg-surface border border-border shadow-2xl rounded-[2rem] p-12 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
                    <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle className="w-12 h-12 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4">Booking Confirmed!</h2>
                    <p className="text-lg text-muted mb-8">Our top-rated {service.category} professional will reach your address at {new Date(formData.appointmentDate).toLocaleString()}.</p>
                    <div className="bg-background w-full p-6 rounded-2xl border border-border text-sm text-left mb-6">
                        <div className="flex justify-between mb-3"><span className="text-muted">Booking ID:</span> <span className="font-bold text-text-main">#SOW-{Math.floor(Math.random() * 100000)}</span></div>
                        <div className="flex justify-between mb-3"><span className="text-muted">Location:</span> <span className="font-bold text-text-main">{formData.location || 'N/A'}</span></div>
                        <div className="flex justify-between mb-3"><span className="text-muted">Payment:</span> <span className="font-bold text-secondary text-lg">{formData.paymentMethod === 'online' ? `₹${cartTotal + 49} Paid Online` : `₹${cartTotal + 49} Cash to be paid`}</span></div>
                        <div className="flex justify-between"><span className="text-muted">Items:</span> <span className="font-bold text-text-main">{cart.length} Services</span></div>
                    </div>
                    <p className="text-sm font-semibold text-primary animate-pulse">Redirecting to Homepage...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">

            {/* Hero Banner for Category */}
            <div className="bg-surface border-b border-border shadow-sm pt-8 pb-12">
                <div className="container flex items-center gap-6">
                    <button onClick={() => navigate('/')} className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center hover:bg-surface-hover hover:text-primary transition shrink-0">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 text-text-main tracking-tight">{service.category} Services</h1>
                        <p className="text-muted font-medium flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent fill-accent" /> 4.8 (104K bookings) &bull; Nagpur
                        </p>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main List Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Service Promises */}
                        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 md:divide-x divide-border">
                            <div className="flex-1 flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Verified Experts</h4>
                                    <p className="text-xs text-muted">Background-checked pros</p>
                                </div>
                            </div>
                            <div className="flex-1 flex gap-4 items-center md:pl-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">On Time Guarantee</h4>
                                    <p className="text-xs text-muted">Service on your schedule</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold pt-4 mb-2">Select Services</h3>

                        {/* Sub Services List */}
                        <div className="space-y-4">
                            {subServices.map((sub) => {
                                const isAdded = cart.find(i => i.id === sub.id);
                                return (
                                    <div key={sub.id} className="bg-surface border border-border p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-border transition shadow-sm">
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{sub.name}</h4>
                                            <div className="flex items-center gap-3 text-sm font-semibold mb-3">
                                                <span className="text-text-main text-lg font-bold">₹{sub.price}</span>
                                                <span className="text-muted">&bull;</span>
                                                <span className="text-muted flex items-center gap-1"><Clock className="w-4 h-4" /> {sub.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted">
                                                <Star className="w-4 h-4 text-accent fill-accent" /> <span className="font-bold text-text-main">{sub.rating}</span> ({sub.reviews} reviews)
                                            </div>
                                        </div>
                                        <div className="shrink-0 mt-4 md:mt-0">
                                            {isAdded ? (
                                                <button
                                                    onClick={() => handleRemoveFromCart(sub.id)}
                                                    className="flex items-center gap-2 border-2 border-primary text-primary px-6 py-2.5 rounded-xl font-bold bg-primary/5 hover:bg-primary/10 transition w-full md:w-auto justify-center"
                                                >
                                                    Added <CheckCircle className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(sub)}
                                                    className="flex items-center gap-2 bg-surface text-primary border-2 border-border shadow-sm px-6 py-2.5 rounded-xl font-bold hover:border-primary hover:text-primary transition w-full md:w-auto justify-center"
                                                >
                                                    Add <Plus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="lg:col-span-1 border border-border bg-surface rounded-[2rem] shadow-xl sticky top-[100px] overflow-hidden">

                        {step === 1 ? (
                            /* CART VIEW */
                            <div className="p-8 animate-fade-in">
                                <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                                    Your Cart
                                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
                                </h3>

                                {cart.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                                            <Plus className="w-8 h-8 text-muted" />
                                        </div>
                                        <p className="text-muted font-medium mb-2">No services added yet</p>
                                        <p className="text-xs text-muted">Please select a service from the left</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4 mb-8 min-h-[150px]">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between items-start border-b border-border pb-4 last:border-0 last:pb-0">
                                                    <div>
                                                        <div className="font-bold text-sm mb-1">{item.name}</div>
                                                        <div className="text-muted text-xs">₹{item.price}</div>
                                                    </div>
                                                    <button onClick={() => handleRemoveFromCart(item.id)} className="w-8 h-8 flex items-center justify-center bg-background rounded-full hover:bg-red-50 text-muted hover:text-red-500 transition">
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-background p-4 rounded-xl border border-border mb-6">
                                            <div className="flex justify-between text-sm mb-2"><span className="text-muted">Item Total</span><span className="font-semibold">₹{cartTotal}</span></div>
                                            <div className="flex justify-between text-sm mb-2"><span className="text-muted">Taxes & Fee</span><span className="font-semibold">₹49</span></div>
                                            <div className="w-full h-px bg-border my-3"></div>
                                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{cartTotal + 49}</span></div>
                                        </div>

                                        <button onClick={() => {
                                            if (!user) navigate(`/login?redirect=${encodeURIComponent(`/book/${serviceId}`)}`);
                                            else setStep(2);
                                        }} className="btn-primary w-full py-4 text-base rounded-2xl shadow-glow">
                                            Proceed to Checkout
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* CHECKOUT FORM VIEW */
                            <div className="p-8 animate-fade-in relative">
                                <button onClick={() => setStep(1)} className="absolute top-6 right-6 text-sm text-muted hover:text-text-main font-bold flex items-center gap-1">
                                    <ChevronLeft className="w-4 h-4" /> Back to Cart
                                </button>
                                <h3 className="text-2xl font-extrabold mb-8 pt-2">Checkout</h3>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-muted uppercase tracking-wider">Full Name</label>
                                        <input type="text" name="userName" required value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} placeholder="Sanjay Kumar" className="bg-background focus:bg-surface" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-muted uppercase tracking-wider">Phone</label>
                                        <input type="tel" name="userPhone" required value={formData.userPhone} onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })} placeholder="+91 98765 43210" className="bg-background focus:bg-surface" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold mb-1 text-muted uppercase tracking-wider">Location / City</label>
                                            <select name="location" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-background focus:bg-surface w-full p-2.5 rounded border border-border outline-none">
                                                <option value="" disabled>Select Tamil Nadu Location</option>
                                                {TAMIL_NADU_LOCATIONS.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold mb-1 text-muted uppercase tracking-wider">Date & Time</label>
                                            <input type="datetime-local" name="appointmentDate" required value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} className="bg-background focus:bg-surface w-full p-2.5 rounded border border-border outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-muted uppercase tracking-wider">Full Address</label>
                                        <textarea name="userAddress" required rows="2" value={formData.userAddress} onChange={(e) => setFormData({ ...formData, userAddress: e.target.value })} placeholder="House/Flat No, Area..." className="bg-background focus:bg-surface resize-none w-full p-2.5 rounded border border-border outline-none"></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-3 text-muted uppercase tracking-wider">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${formData.paymentMethod === 'online' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-border text-muted hover:bg-surface'}`}>
                                                <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="sr-only" />
                                                <span className="font-bold text-sm">Online Payment</span>
                                            </label>
                                            <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted hover:bg-surface'}`}>
                                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="sr-only" />
                                                <span className="font-bold text-sm">Cash on Delivery</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl text-lg transition shadow-xl mt-6 ${formData.paymentMethod === 'online' ? 'bg-secondary hover:bg-green-600' : 'bg-primary hover:bg-primary-dark'}`}>
                                        {formData.paymentMethod === 'online' ? `Pay ₹${cartTotal + 49} Securely` : `Confirm Booking (Pay Later)`}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Simulated Payment Gateway Modal */}
            {showPaymentGateway && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-surface rounded-[2rem] shadow-2xl w-full max-w-sm p-8 relative text-center border border-border">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-extrabold mb-2 text-text-main">Secure Payment</h3>
                        <p className="text-muted text-sm mb-6">Scan QR Code using any UPI App (GPay, PhonePe, Paytm)</p>
                        
                        <div className="bg-white border-4 border-primary/20 p-2 rounded-xl inline-block mb-6 shadow-sm">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=serviceonwheel@upi&pn=ServiceOnWheel&am=${cartTotal+49}`} alt="Scan to Pay" className="w-40 h-40 object-contain" />
                        </div>
                        
                        <div className="text-3xl font-extrabold mb-8 text-text-main">₹{cartTotal + 49}</div>
                        
                        <button 
                            onClick={() => {
                                setIsProcessing(true);
                                setTimeout(() => {
                                    setShowPaymentGateway(false);
                                    processBooking();
                                }, 2500);
                            }} 
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-xl text-white ${isProcessing ? 'bg-muted cursor-not-allowed text-white/50' : 'bg-primary hover:bg-primary-hover'}`}
                        >
                            {isProcessing ? 'Verifying Payment...' : 'Simulate Valid Payment'}
                        </button>
                        
                        {!isProcessing && (
                            <button onClick={() => setShowPaymentGateway(false)} className="w-full mt-4 text-red-500 font-bold hover:underline transition">
                                Cancel Transaction
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
