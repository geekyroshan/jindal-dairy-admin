import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Package,
    Image,
    MessageSquareQuote,
    Mail,
    TrendingUp,
    ArrowRight,
    Loader2,
    Users,
    Star,
} from 'lucide-react';
import { dashboardApi, inquiriesApi } from '../lib/api';

interface Stats {
    products: number;
    inquiries: number;
    banners: number;
    testimonials: number;
    newInquiries: number;
}

interface Inquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
}

const statCards = [
    {
        key: 'products',
        label: 'Products',
        icon: Package,
        color: '#2D5016',
        bgColor: '#E8F5E9',
        link: '/products',
    },
    {
        key: 'testimonials',
        label: 'Testimonials',
        icon: Star,
        color: '#D4A84B',
        bgColor: '#FFF8E7',
        link: '/testimonials',
    },
    {
        key: 'banners',
        label: 'Banners',
        icon: Image,
        color: '#E8733A',
        bgColor: '#FFF3ED',
        link: '/banners',
    },
    {
        key: 'inquiries',
        label: 'Inquiries',
        icon: Mail,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        link: '/inquiries',
    },
];

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, inquiriesRes] = await Promise.all([
                dashboardApi.getStats(),
                inquiriesApi.getAll(),
            ]);
            setStats(statsRes.data);
            setRecentInquiries(inquiriesRes.data.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-forest-green" />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #2D5016 0%, #3D6B1E 100%)',
                    borderRadius: '20px',
                    padding: '32px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '32px',
                    boxShadow: '0 10px 30px -10px rgba(45, 80, 22, 0.3)',
                }}
            >
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', color: 'white', marginTop: 0 }}>Welcome to GauShala Fresh Admin</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', fontSize: '16px', margin: 0 }}>
                        Manage your products, content, and customer inquiries directly from this dashboard.
                    </p>
                </div>
                <div style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', fontSize: '120px', opacity: 0.1, lineHeight: 0 }}>
                    🐄
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            to={card.link}
                            style={{
                                display: 'block',
                                background: 'white',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid #E7E5E4',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = card.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = '#E7E5E4';
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: card.bgColor,
                                    color: card.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px',
                                }}
                            >
                                <card.icon size={24} />
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#292524', lineHeight: 1, marginBottom: '4px' }}>
                                {stats?.[card.key as keyof Stats] ?? 0}
                            </div>
                            <div style={{ color: '#78716C', fontSize: '14px', fontWeight: 500 }}>{card.label}</div>
                            {card.key === 'inquiries' && stats?.newInquiries ? (
                                <div style={{ marginTop: '12px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        padding: '4px 10px',
                                        background: '#DBEAFE',
                                        color: '#1E40AF',
                                        borderRadius: '999px'
                                    }}>
                                        {stats.newInquiries} new
                                    </span>
                                </div>
                            ) : null}
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Recent Inquiries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden', height: '100%' }}
                >
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Mail size={20} style={{ color: '#78716C' }} />
                            Recent Inquiries
                        </h3>
                        <Link
                            to="/inquiries"
                            style={{ fontSize: '14px', color: '#2D5016', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, textDecoration: 'none' }}
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div>
                        {recentInquiries.length === 0 ? (
                            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#78716C' }}>
                                No inquiries yet
                            </div>
                        ) : (
                            recentInquiries.map((inquiry, i) => (
                                <div
                                    key={inquiry.id}
                                    style={{
                                        padding: '16px 24px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '16px',
                                        borderBottom: i < recentInquiries.length - 1 ? '1px solid #F5F5F4' : 'none',
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#F5F5F4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#57534E',
                                        flexShrink: 0
                                    }}>
                                        {inquiry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 500, color: '#292524', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {inquiry.name}
                                            </span>
                                            {inquiry.status === 'new' && (
                                                <span style={{ fontSize: '10px', fontWeight: 600, height: '18px', padding: '0 6px', background: '#DCFCE7', color: '#166534', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}>New</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#78716C', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {inquiry.subject || inquiry.email}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#A8A29E', whiteSpace: 'nowrap' }}>
                                        {formatDate(inquiry.createdAt)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', padding: '24px', height: '100%' }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <TrendingUp size={20} style={{ color: '#78716C' }} />
                            Quick Actions
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { to: '/products', icon: Package, title: 'Add New Product', desc: 'Create a new dairy product listing', color: '#2D5016', bg: 'rgba(45, 80, 22, 0.1)' },
                            { to: '/banners', icon: Image, title: 'Manage Banners', desc: 'Update hero section content', color: '#D4A84B', bg: 'rgba(212, 168, 75, 0.1)' },
                            { to: '/testimonials', icon: MessageSquareQuote, title: 'Add Testimonial', desc: 'Add a new customer review', color: '#88A47C', bg: 'rgba(136, 164, 124, 0.1)' },
                            { to: '/settings', icon: Users, title: 'Site Settings', desc: 'Update contact info & social links', color: '#57534E', bg: '#F5F5F4' },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                to={action.to}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #E7E5E4',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    background: 'white',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = action.color;
                                    e.currentTarget.style.background = '#FAFAF9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#E7E5E4';
                                    e.currentTarget.style.background = 'white';
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: action.bg,
                                    color: action.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <action.icon size={24} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 500, color: '#292524', margin: '0 0 2px' }}>{action.title}</p>
                                    <p style={{ fontSize: '13px', color: '#78716C', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.desc}</p>
                                </div>
                                <ArrowRight size={18} style={{ color: '#D6D3D1', flexShrink: 0 }} />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
