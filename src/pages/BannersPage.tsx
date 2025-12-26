import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Image as ImageIcon, Eye, EyeOff, Upload, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { bannersApi, uploadApi } from '../lib/api';

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
    page: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
}

const emptyBanner: Partial<Banner> = {
    title: '',
    subtitle: '',
    backgroundImage: '',
    ctaText: 'Learn More',
    ctaLink: '/',
    page: 'home',
    sortOrder: 1,
    isActive: true,
};

// API Base URL for constructing proper image URLs
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const response = await bannersApi.getAll();
            setBanners(response.data);
        } catch (error) {
            toast.error('Failed to load banners');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (banner?: Banner) => {
        setEditingBanner(banner ? { ...banner } : { ...emptyBanner });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSave = async () => {
        if (!editingBanner?.title) {
            toast.error('Title is required');
            return;
        }

        setIsSaving(true);
        try {
            if (editingBanner.id) {
                await bannersApi.update(editingBanner.id, editingBanner);
                toast.success('Banner updated');
            } else {
                await bannersApi.create(editingBanner);
                toast.success('Banner created');
            }
            loadBanners();
            closeModal();
        } catch (error) {
            toast.error('Failed to save banner');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this banner?')) return;
        try {
            await bannersApi.delete(id);
            toast.success('Banner deleted');
            loadBanners();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            await bannersApi.update(banner.id, { isActive: !banner.isActive });
            loadBanners();
            toast.success(banner.isActive ? 'Banner hidden' : 'Banner visible');
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 10MB)
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
            setEditingBanner({ ...editingBanner, backgroundImage: imageUrl });
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
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
                <p style={{ color: '#57534E', margin: 0 }}>Manage hero banners and promotional content.</p>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={18} />
                    Add Banner
                </button>
            </div>

            {banners.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', padding: '48px 24px', textAlign: 'center' }}>
                    <ImageIcon size={48} style={{ margin: '0 auto 16px', color: '#D6D3D1' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#292524', marginBottom: '8px' }}>No banners yet</h3>
                    <p style={{ color: '#78716C', marginBottom: '16px' }}>Create your first banner to display on the website.</p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus size={18} />
                        Create Banner
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {banners.map((banner, index) => (
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E7E5E4',
                                overflow: 'hidden',
                                opacity: banner.isActive ? 1 : 0.6,
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '16px' }}>
                                {/* Preview - Fixed aspect ratio and width */}
                                <div style={{ width: '240px', height: '135px', borderRadius: '12px', overflow: 'hidden', background: '#F5F5F4', flexShrink: 0 }}>
                                    {banner.backgroundImage ? (
                                        <img
                                            src={banner.backgroundImage}
                                            alt={banner.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8A29E' }}>
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#292524', margin: '0 0 4px' }}>{banner.title}</h3>
                                            <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>{banner.subtitle}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <span className={`badge ${banner.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                                {banner.isActive ? 'Active' : 'Hidden'}
                                            </span>
                                            <span className="badge badge-info">{banner.page}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '16px' }}>
                                        <button onClick={() => toggleActive(banner)} className="btn btn-secondary btn-sm">
                                            {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                                            {banner.isActive ? 'Hide' : 'Show'}
                                        </button>
                                        <button onClick={() => openModal(banner)} className="btn btn-secondary btn-sm">
                                            <Pencil size={14} />
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(banner.id)} className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && editingBanner && (
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
                                maxWidth: '600px',
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
                                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{editingBanner.id ? 'Edit Banner' : 'Add Banner'}</h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Title *</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                        value={editingBanner.title || ''}
                                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                                        placeholder="e.g., Fresh Organic Milk"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Subtitle</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                        value={editingBanner.subtitle || ''}
                                        onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                                        placeholder="Brief description"
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Background Image</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />

                                    {editingBanner.backgroundImage ? (
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                                            <img
                                                src={editingBanner.backgroundImage}
                                                alt="Banner preview"
                                                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                right: '12px',
                                                display: 'flex',
                                                gap: '8px',
                                            }}>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="btn btn-secondary btn-sm"
                                                    disabled={isUploading}
                                                    style={{ background: 'white' }}
                                                >
                                                    {isUploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                                                    Change
                                                </button>
                                                <button
                                                    onClick={() => setEditingBanner({ ...editingBanner, backgroundImage: '' })}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: '2px dashed #D6D3D1',
                                                borderRadius: '12px',
                                                padding: '32px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                background: '#FAFAF9',
                                            }}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 size={32} style={{ color: '#2D5016', marginBottom: '12px', animation: 'spin 1s linear infinite' }} />
                                                    <p style={{ color: '#57534E', fontWeight: 500 }}>Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <ImagePlus size={32} style={{ color: '#A8A29E', marginBottom: '12px' }} />
                                                    <p style={{ color: '#57534E', fontWeight: 500, marginBottom: '4px' }}>
                                                        Click to upload banner image
                                                    </p>
                                                    <p style={{ color: '#A8A29E', fontSize: '13px' }}>
                                                        Recommended: 1920x1080px, PNG or JPG
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>CTA Text</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editingBanner.ctaText || ''}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                                            placeholder="e.g., Shop Now"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>CTA Link</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editingBanner.ctaLink || ''}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                                            placeholder="/"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Page</label>
                                        <select
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', background: 'white' }}
                                            value={editingBanner.page || 'home'}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, page: e.target.value })}
                                        >
                                            <option value="home">Home</option>
                                            <option value="about">About</option>
                                            <option value="products">Products</option>
                                            <option value="contact">Contact</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Sort Order</label>
                                        <input
                                            type="number"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                            value={editingBanner.sortOrder || 1}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, sortOrder: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editingBanner.isActive || false}
                                        onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                    />
                                    <span>Active (visible on website)</span>
                                </label>
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
