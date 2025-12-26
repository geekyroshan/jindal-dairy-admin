import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, Clock, Eye, Trash2, Archive, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { inquiriesApi } from '../lib/api';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    inquiryType: string;
    status: string;
    createdAt: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await inquiriesApi.getAll();
            setInquiries(res.data);
        } catch (error) {
            toast.error('Failed to load inquiries');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await inquiriesApi.update(id, { status });
            toast.success('Status updated');
            loadData();
            if (selectedInquiry?.id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this inquiry?')) return;
        try {
            await inquiriesApi.delete(id);
            toast.success('Deleted');
            if (selectedInquiry?.id === id) setSelectedInquiry(null);
            loadData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2D5016' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 140px)', alignItems: 'stretch' }}>
            {/* List */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', minWidth: '320px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#57534E', margin: 0, fontSize: '14px', fontWeight: 500 }}>
                        {inquiries.length} inquiries • {inquiries.filter((i) => i.status === 'new').length} new
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', flex: 1 }}>
                        <Mail size={48} style={{ color: '#D6D3D1', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#292524', marginBottom: '8px' }}>No inquiries yet</h3>
                        <p style={{ color: '#78716C', textAlign: 'center' }}>Customer inquiries will appear here.</p>
                    </div>
                ) : (
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
                        {inquiries.map((inquiry, index) => (
                            <motion.div
                                key={inquiry.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => setSelectedInquiry(inquiry)}
                                style={{
                                    background: selectedInquiry?.id === inquiry.id ? '#F0FDF4' : 'white',
                                    borderRadius: '12px',
                                    border: selectedInquiry?.id === inquiry.id ? '1px solid #2D5016' : '1px solid #E7E5E4',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            flexShrink: 0,
                                            background: inquiry.status === 'new' ? '#2D5016' : '#F5F5F4',
                                            color: inquiry.status === 'new' ? 'white' : '#57534E',
                                        }}
                                    >
                                        {inquiry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 500, color: '#292524', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inquiry.name}</span>
                                            {inquiry.status === 'new' && (
                                                <span style={{ width: '8px', height: '8px', background: '#2D5016', borderRadius: '50%' }}></span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#57534E', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {inquiry.subject || inquiry.message?.substring(0, 50)}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '11px',
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                fontWeight: 500,
                                                background: inquiry.status === 'new' ? '#DCFCE7' : inquiry.status === 'replied' ? '#DBEAFE' : '#F5F5F4',
                                                color: inquiry.status === 'new' ? '#166534' : inquiry.status === 'replied' ? '#1E40AF' : '#57534E'
                                            }}>
                                                {inquiry.status}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={10} />
                                                {formatDate(inquiry.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail View */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {selectedInquiry ? (
                    <motion.div
                        key={selectedInquiry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #E7E5E4',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px', color: '#292524' }}>{selectedInquiry.name}</h3>
                                <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>{selectedInquiry.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => updateStatus(selectedInquiry.id, 'replied')}
                                    className="btn btn-secondary btn-sm"
                                    disabled={selectedInquiry.status === 'replied'}
                                >
                                    <CheckCircle size={14} />
                                    Replied
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedInquiry.id, 'archived')}
                                    className="btn btn-secondary btn-sm"
                                >
                                    <Archive size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedInquiry.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#A8A29E', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase' }}>Phone</p>
                                    <p style={{ fontSize: '15px', color: '#292524', margin: 0 }}>{selectedInquiry.phone || 'Not provided'}</p>
                                </div>

                                {selectedInquiry.subject && (
                                    <div>
                                        <p style={{ fontSize: '13px', color: '#A8A29E', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase' }}>Subject</p>
                                        <p style={{ fontSize: '15px', color: '#292524', margin: 0 }}>{selectedInquiry.subject}</p>
                                    </div>
                                )}

                                {selectedInquiry.inquiryType && (
                                    <div>
                                        <p style={{ fontSize: '13px', color: '#A8A29E', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase' }}>Type</p>
                                        <span className="badge badge-info">{selectedInquiry.inquiryType}</span>
                                    </div>
                                )}

                                <div>
                                    <p style={{ fontSize: '13px', color: '#A8A29E', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase' }}>Message</p>
                                    <div style={{ padding: '16px', background: '#FAFAF9', borderRadius: '12px', color: '#44403C', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {selectedInquiry.message}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: '13px', color: '#A8A29E', fontWeight: 500, margin: '0 0 6px', textTransform: 'uppercase' }}>Received</p>
                                    <p style={{ fontSize: '14px', color: '#57534E', margin: 0 }}>{formatDate(selectedInquiry.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                            <a
                                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || 'Your Inquiry'}`}
                                className="btn btn-primary"
                                style={{ width: '100%', textDecoration: 'none' }}
                            >
                                <Mail size={18} />
                                Reply via Email
                            </a>
                        </div>
                    </motion.div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div>
                            <Eye size={48} style={{ color: '#D6D3D1', marginBottom: '16px', margin: '0 auto' }} />
                            <p style={{ color: '#78716C' }}>Select an inquiry to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
