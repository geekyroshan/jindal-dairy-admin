import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, Globe, Phone, Mail, MapPin, MessageCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '../lib/api';

interface SiteSettings {
    siteName: string;
    tagline: string;
    phone: string;
    phone2?: string;
    email: string;
    address: string;
    whatsappNumber: string;
    amazonStoreUrl: string;
    fssai?: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        youtube: string;
        twitter: string;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsApi.get();
            setSettings(res.data);
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        setIsSaving(true);
        try {
            await settingsApi.update(settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof SiteSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    const updateSocialLink = (platform: string, value: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            socialLinks: { ...settings.socialLinks, [platform]: value },
        });
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2D5016' }} />
            </div>
        );
    }

    if (!settings) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <p style={{ color: '#57534E', margin: 0, fontSize: '15px' }}>Manage your website settings and contact information.</p>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* General Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}
                >
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#292524' }}>
                            <Globe size={18} style={{ color: '#78716C' }} />
                            General Settings
                        </h3>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Site Name</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.siteName}
                                    onChange={(e) => updateField('siteName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Tagline</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.tagline}
                                    onChange={(e) => updateField('tagline', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}
                >
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#292524' }}>
                            <Phone size={18} style={{ color: '#78716C' }} />
                            Contact Information
                        </h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                    <Phone size={14} style={{ color: '#78716C' }} />
                                    Phone Number (Primary)
                                </label>
                                <input
                                    type="tel"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    placeholder="+91-9815987765"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                    <Phone size={14} style={{ color: '#78716C' }} />
                                    Phone Number (Secondary)
                                </label>
                                <input
                                    type="tel"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.phone2 || ''}
                                    onChange={(e) => updateField('phone2', e.target.value)}
                                    placeholder="+91-9988250038"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                    <Mail size={14} style={{ color: '#78716C' }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="jindal.dairy@gmail.com"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                    FSSAI License Number
                                </label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.fssai || ''}
                                    onChange={(e) => updateField('fssai', e.target.value)}
                                    placeholder="12125681000197"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                <MapPin size={14} style={{ color: '#78716C' }} />
                                Address
                            </label>
                            <textarea
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px', minHeight: '80px' }}
                                value={settings.address}
                                onChange={(e) => updateField('address', e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Integrations */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}
                >
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#292524' }}>
                            <MessageCircle size={18} style={{ color: '#78716C' }} />
                            Integrations
                        </h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                <MessageCircle size={14} style={{ color: '#22c55e' }} />
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                value={settings.whatsappNumber}
                                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                                placeholder="919999999999 (without +)"
                            />
                            <p style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>
                                Enter number with country code, without + sign (e.g., 919999999999)
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Amazon Store URL</label>
                            <input
                                type="url"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                value={settings.amazonStoreUrl}
                                onChange={(e) => updateField('amazonStoreUrl', e.target.value)}
                                placeholder="https://amazon.in/your-store"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #E7E5E4', overflow: 'hidden' }}
                >
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#292524' }}>
                            <Share2 size={18} style={{ color: '#78716C' }} />
                            Social Media Links
                        </h3>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Facebook</label>
                                <input
                                    type="url"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.socialLinks?.facebook || ''}
                                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Instagram</label>
                                <input
                                    type="url"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.socialLinks?.instagram || ''}
                                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>YouTube</label>
                                <input
                                    type="url"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.socialLinks?.youtube || ''}
                                    onChange={(e) => updateSocialLink('youtube', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Twitter/X</label>
                                <input
                                    type="url"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '10px' }}
                                    value={settings.socialLinks?.twitter || ''}
                                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
