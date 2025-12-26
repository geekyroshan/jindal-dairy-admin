import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, MessageSquareQuote, Star, Upload, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonialsApi, uploadApi } from '../lib/api';

interface Testimonial {
    id: string;
    name: string;
    location: string;
    image: string;
    quote: string;
    product: string;
    rating: number;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
}

const emptyTestimonial: Partial<Testimonial> = {
    name: '',
    location: '',
    image: '',
    quote: '',
    product: '',
    rating: 5,
    isFeatured: false,
    isPublished: true,
};

// API Base URL for constructing proper image URLs
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await testimonialsApi.getAll();
            setTestimonials(res.data);
        } catch (error) {
            toast.error('Failed to load testimonials');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (item?: Testimonial) => {
        setEditing(item ? { ...item } : { ...emptyTestimonial });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const handleSave = async () => {
        if (!editing?.name || !editing?.quote) {
            toast.error('Name and quote are required');
            return;
        }

        setIsSaving(true);
        try {
            if (editing.id) {
                await testimonialsApi.update(editing.id, editing);
                toast.success('Testimonial updated');
            } else {
                await testimonialsApi.create(editing);
                toast.success('Testimonial added');
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
        if (!confirm('Delete this testimonial?')) return;
        try {
            await testimonialsApi.delete(id);
            toast.success('Deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image is too large (max 10MB)');
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadApi.upload(file);
            const imageUrl = response.data.url.startsWith('/')
                ? `${API_BASE}${response.data.url}`
                : response.data.url;
            setEditing({ ...editing, image: imageUrl });
            toast.success('Photo uploaded');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
                <p style={{ color: '#57534E', margin: 0 }}>Manage customer reviews and testimonials.</p>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={18} />
                    Add Testimonial
                </button>
            </div>

            {testimonials.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', padding: '48px 24px', textAlign: 'center' }}>
                    <MessageSquareQuote size={48} style={{ margin: '0 auto 16px', color: '#D6D3D1' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#292524', marginBottom: '8px' }}>No testimonials yet</h3>
                    <p style={{ color: '#78716C', marginBottom: '16px' }}>Add customer reviews to build trust.</p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus size={18} />
                        Add First Testimonial
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E7E5E4',
                                padding: '20px',
                                opacity: item.isPublished ? 1 : 0.6,
                            }}
                        >
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: '#F5F5F4',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <User size={24} style={{ color: '#A8A29E' }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 600, color: '#292524', margin: '0 0 4px' }}>{item.name}</h4>
                                    <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>{item.location}</p>
                                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                style={{
                                                    fill: i < item.rating ? '#EAB308' : '#E7E5E4',
                                                    color: i < item.rating ? '#EAB308' : '#E7E5E4',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                    {item.isFeatured && <span className="badge badge-warning">Featured</span>}
                                    {!item.isPublished && <span className="badge badge-neutral">Draft</span>}
                                </div>
                            </div>

                            <p style={{ fontSize: '14px', color: '#57534E', fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.6 }}>
                                "{item.quote}"
                            </p>

                            {item.product && (
                                <p style={{ fontSize: '13px', color: '#78716C', margin: '0 0 16px' }}>
                                    Product: <strong>{item.product}</strong>
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openModal(item)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                    <Pencil size={14} />
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                                    <Trash2 size={14} />
                                </button>
                            </div>
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
                                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{editing.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Customer Photo */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Customer Photo</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: '#F5F5F4',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px dashed #D6D3D1',
                                            }}
                                        >
                                            {editing.image ? (
                                                <img src={editing.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <User size={32} style={{ color: '#A8A29E' }} />
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="btn btn-secondary btn-sm"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={14} />
                                                        {editing.image ? 'Change Photo' : 'Upload Photo'}
                                                    </>
                                                )}
                                            </button>
                                            {editing.image && (
                                                <button
                                                    onClick={() => setEditing({ ...editing, image: '' })}
                                                    style={{
                                                        marginLeft: '8px',
                                                        color: '#EF4444',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                            <p style={{ fontSize: '12px', color: '#78716C', marginTop: '6px', margin: '6px 0 0 0' }}>
                                                Square image works best
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Customer Name *</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editing.name || ''}
                                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Location</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editing.location || ''}
                                            onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                                            placeholder="e.g., Patiala, Punjab"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Quote *</label>
                                    <textarea
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', minHeight: '80px' }}
                                        value={editing.quote || ''}
                                        onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                                        placeholder="Customer's testimonial..."
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Product</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editing.product || ''}
                                            onChange={(e) => setEditing({ ...editing, product: e.target.value })}
                                            placeholder="e.g., Bilona Ghee"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Rating</label>
                                        <select
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', background: 'white' }}
                                            value={editing.rating || 5}
                                            onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                                        >
                                            {[5, 4, 3, 2, 1].map((n) => (
                                                <option key={n} value={n}>{n} Stars</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editing.isFeatured || false}
                                            onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                        />
                                        <span>Featured</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editing.isPublished || false}
                                            onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                        />
                                        <span>Published</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ padding: '16px 24px', borderTop: '1px solid #E7E5E4', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
                                    {isSaving ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={16} /> : null}
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
