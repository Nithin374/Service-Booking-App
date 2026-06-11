import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <nav className="bg-surface sticky top-0 z-50 border-b border-border shadow-sm">
            <div className="container py-3 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-primary font-extrabold text-2xl tracking-tight shrink-0">
                    <span className="hidden sm:inline text-text-main">
                        Service<span className="text-primary">On</span>Wheel
                    </span>
                    <span className="sm:hidden text-text-main ">SOW</span>
                </Link>

                <div className="hidden md:block flex-1"></div>

                {/* Right Section */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    {user?.role !== 'admin' && user?.role !== 'provider' && (
                        <Link to="/services" className="font-semibold text-text-main hover:text-primary transition text-sm">Book Services</Link>
                    )}
                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' ? (
                                <>
                                    <Link to="/dashboard" className="font-bold text-sm text-primary hover:underline flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-md">
                                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                                    </Link>
                                    <Link to="/system-admin" className="font-bold text-sm text-primary hover:underline flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-md">
                                        <Settings className="w-4 h-4" /> System Admin
                                    </Link>
                                </>
                            ) : user.role === 'provider' ? (
                                <Link to="/employee-dashboard" className="font-bold text-sm text-secondary hover:underline flex items-center gap-1 bg-secondary/5 px-3 py-1.5 rounded-md">
                                    <LayoutDashboard className="w-4 h-4" /> My Jobs
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="font-bold text-sm text-primary hover:underline flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-md">
                                    <LayoutDashboard className="w-4 h-4" /> My Bookings
                                </Link>
                            )}
                            <div className="flex items-center gap-2 font-bold text-sm bg-surface py-2 px-4 rounded-full border border-border shadow-sm">
                                {!isAdmin && (
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">{user.name.charAt(0)}</div>
                                )}
                                {user.name}
                            </div>
                            <button onClick={logout} className="text-muted hover:text-red-500 transition" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-md font-bold transition">
                            <User className="w-4 h-4" /> Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-text-main rounded-md hover:bg-background"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-surface border-t border-border p-4 flex flex-col gap-4 shadow-xl pb-6">
                    <div className="w-full h-px bg-border my-2"></div>
                    {user?.role !== 'admin' && user?.role !== 'provider' && (
                        <Link to="/services" className="font-semibold px-2 py-2 text-text-main text-center hover:text-primary">Book Services</Link>
                    )}
                    {user ? (
                        <>
                            {user.role === 'provider' && (
                                <Link to="/employee-dashboard" className="font-bold px-2 py-2 text-secondary text-center hover:text-secondary/80">
                                    My Jobs
                                </Link>
                            )}
                            <button onClick={logout} className="w-full bg-surface border border-border text-red-500 py-3 rounded-md font-bold shadow-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="block w-full bg-primary text-white py-3 rounded-md font-bold shadow-md text-center">
                            Login / Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
