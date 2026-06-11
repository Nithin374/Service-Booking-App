import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
    Zap, Snowflake, Briefcase
} from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="animate-fade-in">
            {/* Hero Banner Section */}
            <section className="bg-transparent relative overflow-hidden flex items-center min-h-[500px] border-b border-border/50">
                {/* Glowing Orbs for Dark Mode Glassmorphism */}
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-secondary/20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="absolute inset-0 opacity-5 flex text-[250px] text-primary rotate-12 justify-center items-center pointer-events-none gap-8">
                    <Snowflake /><Briefcase /><Zap />
                </div>

                <div className="container relative z-10 py-16">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-secondary/10 text-secondary font-bold px-4 py-2 rounded-full mb-6">
                            Empowering Careers, Serving Communities
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Your Skills. <br /><span className="text-primary text-gradient">Your Income.</span>
                        </h1>
                        <p className="text-xl text-muted mb-10 font-medium">
                            Whether you need trusted home services or looking to turn your skills into a reliable job, we are here for you. Join our mission to end unemployment.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {!isAdmin && (
                                <Link to="/partner" className="btn-secondary text-lg">
                                    <Briefcase className="w-5 h-5" /> Get a Job Now
                                </Link>
                            )}
                            <Link to="/services" className="btn-primary text-lg">
                                Book a Service
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
