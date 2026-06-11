import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Zap, Snowflake, Droplets, Briefcase, Scissors, Waves, CheckCircle } from 'lucide-react';

const icons = {
    'Air Conditioner': <Snowflake className="w-10 h-10 text-blue-500" />,
    'Beauty Salon': <Scissors className="w-10 h-10 text-pink-500" />,
    'Refrigerator': <Snowflake className="w-10 h-10 text-indigo-400" />,
    'Plumbing': <Droplets className="w-10 h-10 text-teal-500" />,
    'Electrical': <Zap className="w-10 h-10 text-yellow-500" />,
    'Geyser': <Waves className="w-10 h-10 text-orange-500" />,
    'Cleaning': <Briefcase className="w-10 h-10 text-green-500" />,
    'Washing Machine': <CheckCircle className="w-10 h-10 text-purple-500" />,
    'Water Purifier': <Droplets className="w-10 h-10 text-cyan-500" />
};

const serviceImages = {
    'Air Conditioner': '/images/ac_repair.png',
    'Plumbing': '/images/plumber.png',
    'Beauty Salon': '/images/beauty_salon.png',
    'Cleaning': '/images/cleaning.png',
    'Refrigerator': '/images/refrigerator.png',
    'Electrical': '/images/electrical.png',
    'Geyser': '/images/geyser.png',
    'Washing Machine': '/images/washing_machine.png'
};

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brokenImageCategories, setBrokenImageCategories] = useState({});
    const [searchInput, setSearchInput] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const searchQuery = new URLSearchParams(location.search).get('search') || '';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/services?search=${encodeURIComponent(searchInput)}`);
        }
    };

    useEffect(() => {
        api.get('/services')
            .then(res => {
                setServices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('API Error:', err);
                setServices([
                    { _id: '1', title: 'Air Conditioner', category: 'Air Conditioner', price: 999 },
                    { _id: '2', title: 'Beauty Salon at Home', category: 'Beauty Salon', price: 1499 },
                    { _id: '3', title: 'Refrigerator', category: 'Refrigerator', price: 1200 },
                    { _id: '4', title: 'Plumber', category: 'Plumbing', price: 499 },
                    { _id: '5', title: 'Electrician', category: 'Electrical', price: 399 },
                    { _id: '6', title: 'Geyser', category: 'Geyser', price: 699 },
                    { _id: '7', title: 'Home Cleaning', category: 'Cleaning', price: 2499 },
                    { _id: '8', title: 'Washing Machine', category: 'Washing Machine', price: 899 },
                    { _id: '9', title: 'Water Purifier', category: 'Water Purifier', price: 599 }
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container py-20 text-center text-xl text-muted">Loading Services...</div>;

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="container py-24 animate-fade-in">
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Book Trusted Services'}
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mt-8 flex gap-2 justify-center max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-border bg-background rounded-lg focus:outline-none focus:border-primary transition text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition font-bold text-sm"
                    >
                        Search
                    </button>
                </form>
            </div>

            {filteredServices.length === 0 ? (
                <div className="text-center py-12 text-muted">No services found. Try searching for something else.</div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredServices.map(service => (
                        <div
                            key={service._id}
                            onClick={() => navigate(`/book/${service._id}`, { state: { serviceData: service } })}
                            className="bg-surface border border-border rounded-2xl flex flex-col overflow-hidden text-center transition group shadow-sm hover-lift hover:border-primary cursor-pointer"
                        >
                            <div className="w-full h-56 bg-background flex items-center justify-center relative border-b border-border">
                                {serviceImages[service.category] && !brokenImageCategories[service.category] ? (
                                    <img
                                        src={serviceImages[service.category]}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={() => setBrokenImageCategories(prev => ({ ...prev, [service.category]: true }))}
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-110 transition duration-300">
                                        {icons[service.category] || <Zap className="w-8 h-8 text-primary" />}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col items-center flex-grow">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{service.title}</h3>
                                <p className="text-muted text-sm mb-4 line-clamp-2">{service.description}</p>
                                <div className="mt-auto w-full pt-4">
                                    <button className="btn-secondary w-full text-base py-3 pointer-events-none">
                                        View Details • <span className="text-primary font-bold">₹{service.price}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
