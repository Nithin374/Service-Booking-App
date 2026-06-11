import { useState } from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function Partner() {
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        category: '',
        experience: '',
        city: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/applications', formData);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert('Failed to submit application. Please try again.');
        }
    };

    if (success) {
        return (
            <div className="container py-32 text-center animate-fade-in flex flex-col items-center">
                <CheckCircle className="w-20 h-20 text-secondary mb-6" />
                <h2 className="text-4xl font-extrabold mb-4">Application Submitted!</h2>
                <p className="text-xl text-muted max-w-lg mx-auto">
                    Thank you for applying to join the network. Our onboarding team will review your application and allocate a job slot to you shortly. Visit your dashboard updates or wait for our call!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="bg-primary text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container relative z-10 text-center">
                    <div className="inline-block bg-white/20 text-white font-bold px-4 py-2 rounded-full mb-6">
                        Stop Searching. Start Earning.
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get a Job</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">Are you skilled but struggling to find consistent work? Partner with us, get daily bookings, and secure a steady income right in your city.</p>
                </div>
            </div>

            <div className="container mt-[-40px] relative z-20">
                <div className="bg-surface rounded-2xl shadow-xl border border-border max-w-3xl mx-auto p-8 md:p-12 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Simplified Application</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold mb-2 text-sm text-text-main">Full Name</label>
                                <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Sanjay Kumar" className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-sm text-text-main">Email Address</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="sanjay@example.com" className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold mb-2 text-sm text-text-main">Phone Number</label>
                                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 8888 888 888" className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold mb-2 text-sm text-text-main">Primary Skill / Category</label>
                                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none">
                                    <option value="" disabled>Select Category</option>
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
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-sm text-text-main">Years of Experience</label>
                                <input type="number" required min="0" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 5" className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-sm text-text-main">City</label>
                            <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none">
                                <option value="" disabled>Select City</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Salem">Salem</option>
                                <option value="Tiruchirappalli">Tiruchirappalli</option>
                                <option value="Erode">Erode</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Tiruppur">Tiruppur</option>
                                <option value="Kanchipuram">Kanchipuram</option>
                                <option value="Cuddalore">Cuddalore</option>
                                <option value="Villupuram">Villupuram</option>
                                <option value="Ranipet">Ranipet</option>
                                <option value="Kanyakumari">Kanyakumari</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Thoothukudi">Thoothukudi</option>
                                <option value="Pudukottai">Pudukottai</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Tenkasi">Tenkasi</option>
                                <option value="Karur">Karur</option>
                                <option value="Nilgiris">Nilgiris</option>
                                <option value="Dharmapuri">Dharmapuri</option>
                                <option value="Krishnagiri">Krishnagiri</option>
                                <option value="Perambalur">Perambalur</option>
                                <option value="Namakkal">Namakkal</option>
                                <option value="Ariyalur">Ariyalur</option>
                                <option value="Kallakurichi">Kallakurichi</option>
                                <option value="Mayiladuthurai">Mayiladuthurai</option>
                                <option value="Nagapattinam">Nagapattinam</option>
                                <option value="Ramanathapuram">Ramanathapuram</option>
                                <option value="Sivaganga">Sivaganga</option>
                                <option value="Tirupattur">Tirupattur</option>
                                <option value="Tiruvallur">Tiruvallur</option>
                                <option value="Tiruvannamalai">Tiruvannamalai</option>
                                <option value="Tiruvarur">Tiruvarur</option>
                                <option value="Theni">Theni</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Chengalpattu">Chengalpattu</option>
                            </select>
                        </div>

                        {/* File upload removed as per user request to simplify the "Get a job" segment entirely! */}

                        <div className="pt-4">
                            <button type="submit" className="btn-primary w-full py-4 text-lg">
                                Submit Job Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
