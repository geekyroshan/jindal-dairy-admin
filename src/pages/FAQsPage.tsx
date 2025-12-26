import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { faqsApi } from '../lib/api';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
    isPublished: boolean;
}

const emptyFaq: Partial<FAQ> = {
    question: '',
    answer: '',
    category: 'general',
    sortOrder: 1,
    isPublished: true,
};

const categories = [
    { value: 'general', label: 'General' },
    { value: 'products', label: 'Products' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'orders', label: 'Orders' },
    { value: 'quality', label: 'Quality' },
];

export default function FAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await faqsApi.getAll();
            setFaqs(res.data);
        } catch (error) {
            toast.error('Failed to load FAQs');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (item?: FAQ) => {
        setEditing(item ? { ...item } : { ...emptyFaq });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleSave = async () => {
        if (!editing?.question || !editing?.answer) {
            toast.error('Question and answer are required');
            return;
        }

        setIsSaving(true);
        try {
            if (editing.id) {
                await faqsApi.update(editing.id, editing);
                toast.success('FAQ updated');
            } else {
                await faqsApi.create(editing);
                toast.success('FAQ added');
            }
            loadData();
            closeModal();
        } catch (error) {
            toast.error('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;
        try {
            await faqsApi.delete(id);
            toast.success('Deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2D5016' }} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ color: '#57534E', margin: 0 }}>Manage frequently asked questions.</p>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={18} />
                    Add FAQ
                </button>
            </div>

            {faqs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', padding: '48px 24px', textAlign: 'center' }}>
                    <HelpCircle size={48} style={{ margin: '0 auto 16px', color: '#D6D3D1' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#292524', marginBottom: '8px' }}>No FAQs yet</h3>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus size={18} />
                        Add FAQ
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid #E7E5E4',
                                overflow: 'hidden',
                                opacity: item.isPublished ? 1 : 0.6,
                            }}
                        >
                            <div
                                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>{item.category}</span>
                                        {!item.isPublished && <span style={{ fontSize: '11px', background: '#F5F5F4', color: '#57534E', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Draft</span>}
                                    </div>
                                    <h3 style={{ fontWeight: 500, fontSize: '16px', color: '#292524', margin: 0 }}>{item.question}</h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(item); }}
                                        className="btn btn-secondary btn-sm btn-icon"
                                        style={{ color: '#78716C' }}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                        className="btn btn-secondary btn-sm btn-icon"
                                        style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {expandedId === item.id ? (
                                        <ChevronUp size={20} style={{ color: '#D6D3D1' }} />
                                    ) : (
                                        <ChevronDown size={20} style={{ color: '#D6D3D1' }} />
                                    )}
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 20px 20px' }}>
                                            <div style={{ padding: '16px', background: '#FAFAF9', borderRadius: '8px', color: '#57534E', lineHeight: 1.6 }}>
                                                {item.answer}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                        }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                maxWidth: '560px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{editing.id ? 'Edit FAQ' : 'Add FAQ'}</h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Question *</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                        value={editing.question || ''}
                                        onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                                        placeholder="e.g., How fresh is your milk?"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Answer *</label>
                                    <textarea
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', minHeight: '120px' }}
                                        value={editing.answer || ''}
                                        onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                                        placeholder="Provide the answer..."
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Category</label>
                                        <select
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', background: 'white' }}
                                            value={editing.category || 'general'}
                                            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Sort Order</label>
                                        <input
                                            type="number"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editing.sortOrder || 1}
                                            onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editing.isPublished || false}
                                        onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                    />
                                    <span>Published</span>
                                </label>
                            </div>

                            <div style={{ padding: '16px 24px', borderTop: '1px solid #E7E5E4', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
