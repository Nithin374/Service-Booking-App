import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../AuthContext';
import { UserPlus, Mail, User } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="bg-surface border border-border p-8 md:p-12 rounded-[2rem] shadow-xl max-w-md w-full animate-fade-in">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-center mb-2">Create Account</h2>
                <p className="text-muted text-center mb-8">Join ServiceOnWheel today.</p>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Sanjay Kumar" className="pl-12 bg-background focus:bg-surface" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="pl-12 bg-background focus:bg-surface" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-background focus:bg-surface" />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold rounded-xl py-4 text-lg mt-4 shadow-xl hover:bg-green-600 transition">Create Account</button>
                </form>

                <div className="mt-8 text-center text-sm text-muted">
                    Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
