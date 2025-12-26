import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            {/* Left Side - Branding */}
            <div
                style={{
                    display: 'none',
                    width: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1E370F 0%, #2D5016 50%, #3D6B1E 100%)',
                    padding: '64px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                className="login-branding"
            >
                {/* Animated Background Elements */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: '25%',
                        left: '25%',
                        width: '384px',
                        height: '384px',
                        background: 'rgba(212, 168, 75, 0.1)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                    }}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        bottom: '25%',
                        right: '25%',
                        width: '320px',
                        height: '320px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                🐄
                            </div>
                            <div>
                                <h1
                                    style={{
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '28px',
                                        fontWeight: 700,
                                        color: 'white',
                                        margin: 0,
                                    }}
                                >
                                    GauShala Fresh
                                </h1>
                                <p style={{ color: '#E4C06B', fontWeight: 500, margin: 0 }}>Admin Portal</p>
                            </div>
                        </div>

                        <h2
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: '40px',
                                fontWeight: 700,
                                color: 'white',
                                lineHeight: 1.2,
                                marginBottom: '16px',
                            }}
                        >
                            Manage Your
                            <br />
                            <span style={{ color: '#D4A84B' }}>Dairy Business</span>
                        </h2>

                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '400px' }}>
                            Control products, content, testimonials, and more from one powerful dashboard.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ marginTop: '48px', display: 'flex', gap: '32px' }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>4</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Products</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>50K+</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Customers</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>38</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Years</div>
                        </div>
                    </motion.div>
                </div>

                {/* Pattern Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Right Side - Login Form */}
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    background: '#FAFAF9',
                }}
                className="login-form-container"
            >
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '420px' }}
                >
                    {/* Mobile Logo */}
                    <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#2D5016',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                            }}
                        >
                            🐄
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontFamily: 'Playfair Display, serif',
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#292524',
                                    margin: 0,
                                }}
                            >
                                GauShala Fresh
                            </h1>
                            <p style={{ fontSize: '14px', color: '#D4A84B', fontWeight: 500, margin: 0 }}>
                                Admin Portal
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#292524', marginBottom: '8px' }}>
                            Welcome back!
                        </h2>
                        <p style={{ color: '#78716C', margin: 0 }}>
                            Please enter your credentials to access the admin portal.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginBottom: '24px',
                                padding: '16px',
                                borderRadius: '12px',
                                background: '#FEE2E2',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                            }}
                        >
                            <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '14px', color: '#EF4444', margin: 0 }}>{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#44403C',
                                    marginBottom: '6px',
                                }}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@gaushalafresh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #D6D3D1',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#44403C',
                                    marginBottom: '6px',
                                }}
                            >
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        paddingRight: '48px',
                                        border: '1px solid #D6D3D1',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#A8A29E',
                                        padding: 0,
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                background: 'linear-gradient(135deg, #2D5016 0%, #1E370F 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div
                        style={{
                            marginTop: '32px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: '#FFF8E7',
                            border: '1px solid rgba(212, 168, 75, 0.2)',
                        }}
                    >
                        <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '8px', fontWeight: 500 }}>
                            Demo Credentials:
                        </p>
                        <p style={{ fontSize: '14px', color: '#78716C', marginBottom: '4px' }}>
                            Email:{' '}
                            <code
                                style={{
                                    background: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                }}
                            >
                                admin@gaushalafresh.com
                            </code>
                        </p>
                        <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>
                            Password:{' '}
                            <code
                                style={{
                                    background: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                }}
                            >
                                admin123
                            </code>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* CSS for responsive layout */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .login-branding {
            display: flex !important;
          }
          .login-form-container {
            width: 50% !important;
          }
          .mobile-logo {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
