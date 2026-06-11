import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginRole, setLoginRole] = useState('user'); // Toggle state
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            // Helpful role check based on the selected tab
            if (loginRole === 'admin' && data.role !== 'admin') {
                setError('This email does not have administrator privileges.');
                return;
            }

            login(data);
            const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirectTo);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="bg-surface border border-border p-8 md:p-12 rounded-[2rem] shadow-xl max-w-md w-full animate-fade-in">
                {/* Admin / User Tabs */}
                <div className="flex w-full mb-8 bg-background p-1.5 rounded-xl border border-border gap-2">
                    <button 
                        type="button"
                        onClick={() => { setLoginRole('user'); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'user' ? 'bg-surface shadow text-text-main' : 'text-muted hover:text-text-main'}`}
                    >
                        Customer
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setLoginRole('admin'); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'admin' ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm' : 'text-muted hover:text-red-500'}`}
                    >
                        Administrator
                    </button>
                </div>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${loginRole === 'admin' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-center mb-2">
                    {loginRole === 'admin' ? 'Admin Portal' : 'Welcome Back'}
                </h2>
                <p className="text-muted text-center mb-8">
                    {loginRole === 'admin' ? 'Secure backend access for administrators.' : 'Sign in to book and track services.'}
                </p>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
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
                    <button type="submit" className={`w-full py-4 text-lg mt-4 font-bold rounded-xl transition-all shadow-lg ${loginRole === 'admin' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30' : 'btn-primary shadow-glow'}`}>
                        {loginRole === 'admin' ? 'Sign In As Admin' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-muted">
                    Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Register now</Link>
                </div>
            </div>
        </div>
    );
}
