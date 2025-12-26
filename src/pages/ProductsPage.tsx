import { useEffect, useState, useRef } from 'react';

// UUID generator - fallback for non-secure contexts (HTTP) where crypto.randomUUID is unavailable
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for non-secure contexts
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Search,
    X,
    ImagePlus,
    Package,
    Upload,
    GripVertical,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi, categoriesApi, uploadApi } from '../lib/api';

interface Variant {
    id: string;
    size: string;
    price: number;
    unit: string;
    stockStatus: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    categoryId: string;
    category?: { name: string };
    shortDescription: string;
    longDescription: string;
    variants: Variant[];
    images: string[];
    amazonLink: string;
    benefits: string[];
    isFeatured: boolean;
    isPublished: boolean;
    stockStatus: string;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

const emptyProduct: Partial<Product> = {
    name: '',
    tagline: '',
    categoryId: '',
    shortDescription: '',
    longDescription: '',
    variants: [{ id: generateUUID(), size: '', price: 0, unit: '', stockStatus: 'in_stock' }],
    images: [],
    amazonLink: '',
    benefits: [''],
    isFeatured: false,
    isPublished: true,
    stockStatus: 'in_stock',
};

// API Base URL for constructing proper image URLs
const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsApi.getAll(),
                categoriesApi.getAll(),
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct({ ...product });
        } else {
            setEditingProduct({ ...emptyProduct });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSave = async () => {
        if (!editingProduct?.name) {
            toast.error('Product name is required');
            return;
        }

        setIsSaving(true);
        try {
            const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, '-');
            const data = { ...editingProduct, slug };

            if (editingProduct.id) {
                await productsApi.update(editingProduct.id, data);
                toast.success('Product updated successfully');
            } else {
                await productsApi.create(data);
                toast.success('Product created successfully');
            }
            loadData();
            closeModal();
        } catch (error) {
            toast.error('Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productsApi.delete(id);
            toast.success('Product deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        if (!editingProduct) return;
        const variants = [...(editingProduct.variants || [])];
        variants[index] = { ...variants[index], [field]: value };
        setEditingProduct({ ...editingProduct, variants });
    };

    const addVariant = () => {
        if (!editingProduct) return;
        setEditingProduct({
            ...editingProduct,
            variants: [
                ...(editingProduct.variants || []),
                { id: generateUUID(), size: '', price: 0, unit: '', stockStatus: 'in_stock' },
            ],
        });
    };

    const removeVariant = (index: number) => {
        if (!editingProduct) return;
        const variants = [...(editingProduct.variants || [])];
        variants.splice(index, 1);
        setEditingProduct({ ...editingProduct, variants });
    };

    // Image handling functions
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (const file of Array.from(files)) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} is not an image`);
                    continue;
                }

                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    toast.error(`${file.name} is too large (max 10MB)`);
                    continue;
                }

                const response = await uploadApi.upload(file);
                // Create full URL from response
                const imageUrl = response.data.url.startsWith('/')
                    ? `${API_BASE}${response.data.url}`
                    : response.data.url;
                uploadedUrls.push(imageUrl);
            }

            if (uploadedUrls.length > 0) {
                setEditingProduct({
                    ...editingProduct,
                    images: [...(editingProduct?.images || []), ...uploadedUrls],
                });
                toast.success(`${uploadedUrls.length} image(s) uploaded`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        if (!editingProduct) return;
        const images = [...(editingProduct.images || [])];
        images.splice(index, 1);
        setEditingProduct({ ...editingProduct, images });
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        if (!editingProduct) return;
        const images = [...(editingProduct.images || [])];
        const [removed] = images.splice(fromIndex, 1);
        images.splice(toIndex, 0, removed);
        setEditingProduct({ ...editingProduct, images });
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2D5016' }} />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 40px',
                            border: '1px solid #D6D3D1',
                            borderRadius: '10px',
                            fontSize: '15px',
                            outline: 'none',
                        }}
                    />
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', textAlign: 'center', padding: '48px 24px' }}>
                    <Package size={48} style={{ margin: '0 auto 16px', color: '#D6D3D1' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#57534E', marginBottom: '8px' }}>No products found</h3>
                    <p style={{ color: '#78716C', marginBottom: '16px' }}>Get started by adding your first product.</p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E7E5E4',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Image */}
                            <div style={{ aspectRatio: '16/9', background: '#F5F5F4', position: 'relative', overflow: 'hidden' }}>
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8A29E' }}>
                                        <ImagePlus size={32} />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                                    {product.isFeatured && (
                                        <span className="badge badge-warning">Featured</span>
                                    )}
                                    {!product.isPublished && (
                                        <span className="badge badge-neutral">Draft</span>
                                    )}
                                </div>
                                {/* Image count badge */}
                                {product.images?.length > 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}>
                                        <ImagePlus size={12} />
                                        {product.images.length}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: '#292524', margin: 0 }}>{product.name}</h3>
                                        <p style={{ fontSize: '14px', color: '#78716C', margin: '4px 0 0' }}>{product.category?.name || 'No category'}</p>
                                    </div>
                                    <span
                                        className={`badge ${product.stockStatus === 'in_stock'
                                            ? 'badge-success'
                                            : product.stockStatus === 'limited'
                                                ? 'badge-warning'
                                                : 'badge-error'
                                            }`}
                                    >
                                        {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited' : 'Out'}
                                    </span>
                                </div>

                                <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.shortDescription}
                                </p>

                                {/* Variants Preview */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                                    {product.variants?.slice(0, 3).map((v) => (
                                        <span key={v.id} style={{ fontSize: '12px', background: '#F5F5F4', padding: '4px 8px', borderRadius: '4px' }}>
                                            {v.size} - ₹{v.price}
                                        </span>
                                    ))}
                                    {product.variants?.length > 3 && (
                                        <span style={{ fontSize: '12px', background: '#F5F5F4', padding: '4px 8px', borderRadius: '4px' }}>
                                            +{product.variants.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => openModal(product)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn btn-danger btn-sm"
                                        style={{ padding: '6px 12px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {isModalOpen && editingProduct && (
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
                                maxWidth: '700px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                                    {editingProduct.id ? 'Edit Product' : 'Add Product'}
                                </h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                                {/* Basic Info */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Product Name *</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px' }}
                                            value={editingProduct.name || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            placeholder="e.g., Fresh Cow's Milk"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Category</label>
                                        <select
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px', background: 'white' }}
                                            value={editingProduct.categoryId || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Tagline</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px' }}
                                            value={editingProduct.tagline || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                                            placeholder="e.g., Pure milk from happy cows"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Short Description</label>
                                    <textarea
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px', minHeight: '80px', resize: 'vertical' }}
                                        value={editingProduct.shortDescription || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                                        placeholder="Brief description (max 200 chars)"
                                        maxLength={200}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                        Long Description
                                        <span style={{ color: '#78716C', fontWeight: 400, marginLeft: '8px', fontSize: '13px' }}>(shown on product detail page)</span>
                                    </label>
                                    <textarea
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
                                        value={editingProduct.longDescription || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                                        placeholder="Detailed product description, benefits, usage instructions..."
                                    />
                                </div>

                                {/* Product Images Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: 500 }}>
                                            Product Images
                                            <span style={{ color: '#78716C', fontWeight: 400, marginLeft: '8px', fontSize: '13px' }}>
                                                (First image is the main display)
                                            </span>
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
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
                                                    Upload Images
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Images Grid */}
                                    {(editingProduct.images?.length ?? 0) > 0 ? (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                            gap: '12px',
                                            marginBottom: '12px',
                                        }}>
                                            {editingProduct.images?.map((image, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '1',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        border: index === 0 ? '3px solid #2D5016' : '1px solid #E7E5E4',
                                                        background: '#F5F5F4',
                                                    }}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Product ${index + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />

                                                    {/* Main image badge */}
                                                    {index === 0 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '8px',
                                                            left: '8px',
                                                            background: '#2D5016',
                                                            color: 'white',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                        }}>
                                                            MAIN
                                                        </div>
                                                    )}

                                                    {/* Image controls overlay */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(0,0,0,0.5)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                    }}
                                                        className="image-overlay"
                                                    >
                                                        {/* Move left button */}
                                                        {index > 0 && (
                                                            <button
                                                                onClick={() => moveImage(index, index - 1)}
                                                                style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '6px',
                                                                    background: 'white',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                                title="Move left"
                                                            >
                                                                <ChevronLeft size={16} />
                                                            </button>
                                                        )}

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            style={{
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '6px',
                                                                background: '#EF4444',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                            }}
                                                            title="Remove image"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>

                                                        {/* Move right button */}
                                                        {index < (editingProduct.images?.length ?? 0) - 1 && (
                                                            <button
                                                                onClick={() => moveImage(index, index + 1)}
                                                                style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '6px',
                                                                    background: 'white',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                                title="Move right"
                                                            >
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
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
                                            <ImagePlus size={32} style={{ color: '#A8A29E', marginBottom: '12px' }} />
                                            <p style={{ color: '#57534E', fontWeight: 500, marginBottom: '4px' }}>
                                                Click to upload product images
                                            </p>
                                            <p style={{ color: '#A8A29E', fontSize: '13px' }}>
                                                PNG, JPG up to 10MB each. Upload multiple images for carousel.
                                            </p>
                                        </div>
                                    )}

                                    <p style={{ fontSize: '12px', color: '#78716C', marginTop: '8px' }}>
                                        💡 Tip: Upload clear product photos from different angles. First image will be shown as the main display.
                                    </p>
                                </div>

                                {/* Variants */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: 500 }}>Variants (Sizes & Prices)</label>
                                        <button onClick={addVariant} className="btn btn-secondary btn-sm">
                                            <Plus size={14} />
                                            Add Variant
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {editingProduct.variants?.map((variant, index) => (
                                            <div key={variant.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <GripVertical size={16} style={{ color: '#A8A29E', cursor: 'grab' }} />
                                                <input
                                                    type="text"
                                                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '14px' }}
                                                    placeholder="Size (e.g., 500ml, 1kg)"
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    style={{ width: '100px', padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '14px' }}
                                                    placeholder="Price ₹"
                                                    value={variant.price || ''}
                                                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                                                />
                                                <input
                                                    type="text"
                                                    style={{ width: '100px', padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '14px' }}
                                                    placeholder="Unit"
                                                    value={variant.unit}
                                                    onChange={(e) => updateVariant(index, 'unit', e.target.value)}
                                                />
                                                <button
                                                    onClick={() => removeVariant(index)}
                                                    style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}
                                                    disabled={(editingProduct.variants?.length || 0) <= 1}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Amazon Link */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Amazon Link (Optional)</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', fontSize: '15px' }}
                                        value={editingProduct.amazonLink || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, amazonLink: e.target.value })}
                                        placeholder="https://amazon.in/your-product"
                                    />
                                </div>

                                {/* Toggles */}
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editingProduct.isFeatured || false}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                        />
                                        <span>Featured Product</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editingProduct.isPublished || false}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: '#2D5016' }}
                                        />
                                        <span>Published</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ padding: '16px 24px', borderTop: '1px solid #E7E5E4', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
                                    {isSaving ? (
                                        <>
                                            <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={16} />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Product'
                                    )}
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
                .image-overlay:hover {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
