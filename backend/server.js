const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'gaushala-fresh-secret-key-2025';

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// File-based database helpers
const getDataFile = (name) => path.join(DATA_DIR, `${name}.json`);

const readData = (name) => {
  const file = getDataFile(name);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

const writeData = (name, data) => {
  fs.writeFileSync(getDataFile(name), JSON.stringify(data, null, 2));
};

// Initialize default data
const initializeData = () => {
  // Default admin user
  if (!fs.existsSync(getDataFile('users'))) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    writeData('users', [{
      id: uuidv4(),
      email: 'admin@gaushalafresh.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    }]);
  }

  // Default categories
  if (!fs.existsSync(getDataFile('categories'))) {
    writeData('categories', [
      { id: uuidv4(), name: 'Milk', slug: 'milk', sortOrder: 1 },
      { id: uuidv4(), name: 'Ghee', slug: 'ghee', sortOrder: 2 },
      { id: uuidv4(), name: 'Dahi', slug: 'dahi', sortOrder: 3 },
      { id: uuidv4(), name: 'Lassi', slug: 'lassi', sortOrder: 4 }
    ]);
  }

  // Default products
  if (!fs.existsSync(getDataFile('products'))) {
    const categories = readData('categories');
    writeData('products', [
      {
        id: uuidv4(),
        name: "Fresh Cow's Milk",
        slug: 'fresh-cows-milk',
        tagline: 'Pure milk from happy cows',
        categoryId: categories.find(c => c.slug === 'milk')?.id,
        shortDescription: 'Farm-fresh cow\'s milk from our grass-fed, free-range cows.',
        longDescription: 'Collected fresh every morning and delivered within 24 hours. No preservatives, no additives, just pure wholesome milk the way nature intended.',
        variants: [
          { id: uuidv4(), size: '500ml', price: 35, unit: 'pouch', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '1 Liter', price: 65, unit: 'pouch', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '2 Liter', price: 125, unit: 'pack', stockStatus: 'in_stock' }
        ],
        images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800'],
        amazonLink: 'https://amazon.in',
        benefits: ['Farm Fresh', 'No Preservatives', 'Rich in Calcium'],
        isFeatured: true,
        isPublished: true,
        stockStatus: 'in_stock',
        rating: 4.9,
        reviewCount: 2340,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Pure Desi Ghee',
        slug: 'pure-desi-ghee',
        tagline: 'The golden essence of tradition',
        categoryId: categories.find(c => c.slug === 'ghee')?.id,
        shortDescription: 'Made using the traditional Bilona method.',
        longDescription: 'Slow-churned to perfection with the rich aroma of grandmother\'s kitchen.',
        variants: [
          { id: uuidv4(), size: '200g', price: 250, unit: 'jar', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '500g', price: 550, unit: 'jar', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '1kg', price: 999, unit: 'jar', stockStatus: 'in_stock' }
        ],
        images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800'],
        amazonLink: 'https://amazon.in',
        benefits: ['Bilona Method', 'High Smoke Point', 'Omega-3 Rich'],
        isFeatured: true,
        isPublished: true,
        stockStatus: 'in_stock',
        rating: 4.95,
        reviewCount: 1856,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Fresh Dahi',
        slug: 'fresh-dahi',
        tagline: 'Set curd with cultured taste',
        categoryId: categories.find(c => c.slug === 'dahi')?.id,
        shortDescription: 'Thick, creamy dahi made from fresh cow\'s milk.',
        longDescription: 'Perfect consistency, mildly tangy, and incredibly smooth.',
        variants: [
          { id: uuidv4(), size: '200g', price: 30, unit: 'cup', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '400g', price: 55, unit: 'cup', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '1kg', price: 120, unit: 'pack', stockStatus: 'in_stock' }
        ],
        images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'],
        amazonLink: 'https://amazon.in',
        benefits: ['Probiotics', 'Aids Digestion', 'No Preservatives'],
        isFeatured: true,
        isPublished: true,
        stockStatus: 'in_stock',
        rating: 4.8,
        reviewCount: 1234,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Fresh Lassi',
        slug: 'fresh-lassi',
        tagline: 'Refreshing tradition in every sip',
        categoryId: categories.find(c => c.slug === 'lassi')?.id,
        shortDescription: 'Signature lassi made fresh from thick dahi.',
        longDescription: 'Churned to creamy perfection. Available in sweet and salted variants.',
        variants: [
          { id: uuidv4(), size: '200ml Sweet', price: 35, unit: 'bottle', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '200ml Salted', price: 35, unit: 'bottle', stockStatus: 'in_stock' },
          { id: uuidv4(), size: '500ml Sweet', price: 75, unit: 'bottle', stockStatus: 'in_stock' }
        ],
        images: ['https://images.unsplash.com/photo-1587304801900-75dee63b6ea0?w=800'],
        amazonLink: 'https://amazon.in',
        benefits: ['Cooling Effect', 'Probiotic Rich', 'Energy Booster'],
        isFeatured: true,
        isPublished: true,
        stockStatus: 'in_stock',
        rating: 4.85,
        reviewCount: 987,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Default testimonials
  if (!fs.existsSync(getDataFile('testimonials'))) {
    writeData('testimonials', [
      {
        id: uuidv4(),
        name: 'Priya Sharma',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        quote: "The taste of GauShala Fresh milk takes me back to my grandmother's village.",
        product: 'Fresh Milk',
        rating: 5,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Rajesh Patel',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        quote: "The ghee is absolutely incredible. The aroma is heavenly!",
        product: 'Pure Desi Ghee',
        rating: 5,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Default banners
  if (!fs.existsSync(getDataFile('banners'))) {
    writeData('banners', [
      {
        id: uuidv4(),
        title: 'Farm Fresh, Heart Blessed',
        subtitle: 'Experience the pure taste of tradition',
        backgroundImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=2000',
        ctaText: 'Explore Products',
        ctaLink: '/products',
        page: 'home',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Default settings
  if (!fs.existsSync(getDataFile('settings'))) {
    writeData('settings', {
      siteName: 'Shudh Dudh',
      tagline: '100% Unadulterated',
      phone: '+91-9815987765',
      phone2: '+91-9988250038',
      email: 'jindal.dairy@gmail.com',
      address: 'House No. 43-A, Gian Colony, Sant Nagar, Patiala, Punjab - 147001',
      whatsappNumber: '919815987765',
      amazonStoreUrl: '',
      fssai: '12125681000197',
      socialLinks: {
        facebook: '',
        instagram: '',
        youtube: '',
        twitter: ''
      }
    });
  }

  // Default FAQs
  if (!fs.existsSync(getDataFile('faqs'))) {
    writeData('faqs', [
      {
        id: uuidv4(),
        question: 'How fresh is your milk?',
        answer: 'Our milk is collected fresh every morning and delivered within 24 hours.',
        category: 'products',
        sortOrder: 1,
        isPublished: true
      },
      {
        id: uuidv4(),
        question: 'Do you deliver to my area?',
        answer: 'We currently deliver across major cities. Contact us on WhatsApp to check availability.',
        category: 'delivery',
        sortOrder: 2,
        isPublished: true
      }
    ]);
  }

  // Initialize inquiries
  if (!fs.existsSync(getDataFile('inquiries'))) {
    writeData('inquiries', []);
  }
};

initializeData();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ================================
//  AUTH ROUTES
// ================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users');
  const user = users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const users = readData('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// ================================
//  PUBLIC API ROUTES
// ================================
app.get('/api/products', (req, res) => {
  const products = readData('products').filter(p => p.isPublished);
  const categories = readData('categories');
  const enriched = products.map(p => ({
    ...p,
    category: categories.find(c => c.id === p.categoryId)
  }));
  res.json(enriched);
});

app.get('/api/products/:slug', (req, res) => {
  const products = readData('products');
  const product = products.find(p => p.slug === req.params.slug && p.isPublished);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const categories = readData('categories');
  res.json({ ...product, category: categories.find(c => c.id === product.categoryId) });
});

app.get('/api/categories', (req, res) => {
  res.json(readData('categories'));
});

app.get('/api/banners', (req, res) => {
  const { page } = req.query;
  let banners = readData('banners').filter(b => b.isActive);
  if (page) banners = banners.filter(b => b.page === page);
  res.json(banners.sort((a, b) => a.sortOrder - b.sortOrder));
});

app.get('/api/testimonials', (req, res) => {
  res.json(readData('testimonials').filter(t => t.isPublished));
});

app.get('/api/faqs', (req, res) => {
  res.json(readData('faqs').filter(f => f.isPublished).sort((a, b) => a.sortOrder - b.sortOrder));
});

app.get('/api/settings', (req, res) => {
  res.json(readData('settings'));
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, subject, message, inquiryType } = req.body;
  const inquiries = readData('inquiries');
  const newInquiry = {
    id: uuidv4(),
    name, email, phone, subject, message, inquiryType,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  inquiries.push(newInquiry);
  writeData('inquiries', inquiries);
  res.status(201).json(newInquiry);
});

// ================================
//  ADMIN API ROUTES
// ================================

// Dashboard Stats
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  res.json({
    products: readData('products').length,
    inquiries: readData('inquiries').length,
    banners: readData('banners').length,
    testimonials: readData('testimonials').length,
    newInquiries: readData('inquiries').filter(i => i.status === 'new').length
  });
});

// Products CRUD
app.get('/api/admin/products', authMiddleware, (req, res) => {
  const products = readData('products');
  const categories = readData('categories');
  res.json(products.map(p => ({ ...p, category: categories.find(c => c.id === p.categoryId) })));
});

app.post('/api/admin/products', authMiddleware, (req, res) => {
  const products = readData('products');
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  writeData('products', products);
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', authMiddleware, (req, res) => {
  const products = readData('products');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData('products', products);
  res.json(products[index]);
});

app.delete('/api/admin/products/:id', authMiddleware, (req, res) => {
  let products = readData('products');
  products = products.filter(p => p.id !== req.params.id);
  writeData('products', products);
  res.json({ success: true });
});

// Banners CRUD
app.get('/api/admin/banners', authMiddleware, (req, res) => {
  res.json(readData('banners'));
});

app.post('/api/admin/banners', authMiddleware, (req, res) => {
  const banners = readData('banners');
  const newBanner = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  banners.push(newBanner);
  writeData('banners', banners);
  res.status(201).json(newBanner);
});

app.put('/api/admin/banners/:id', authMiddleware, (req, res) => {
  const banners = readData('banners');
  const index = banners.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Banner not found' });

  banners[index] = { ...banners[index], ...req.body };
  writeData('banners', banners);
  res.json(banners[index]);
});

app.delete('/api/admin/banners/:id', authMiddleware, (req, res) => {
  let banners = readData('banners');
  banners = banners.filter(b => b.id !== req.params.id);
  writeData('banners', banners);
  res.json({ success: true });
});

// Testimonials CRUD
app.get('/api/admin/testimonials', authMiddleware, (req, res) => {
  res.json(readData('testimonials'));
});

app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  const testimonials = readData('testimonials');
  const newTestimonial = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  testimonials.push(newTestimonial);
  writeData('testimonials', testimonials);
  res.status(201).json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  const testimonials = readData('testimonials');
  const index = testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });

  testimonials[index] = { ...testimonials[index], ...req.body };
  writeData('testimonials', testimonials);
  res.json(testimonials[index]);
});

app.delete('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  let testimonials = readData('testimonials');
  testimonials = testimonials.filter(t => t.id !== req.params.id);
  writeData('testimonials', testimonials);
  res.json({ success: true });
});

// FAQs CRUD
app.get('/api/admin/faqs', authMiddleware, (req, res) => {
  res.json(readData('faqs'));
});

app.post('/api/admin/faqs', authMiddleware, (req, res) => {
  const faqs = readData('faqs');
  const newFaq = { id: uuidv4(), ...req.body };
  faqs.push(newFaq);
  writeData('faqs', faqs);
  res.status(201).json(newFaq);
});

app.put('/api/admin/faqs/:id', authMiddleware, (req, res) => {
  const faqs = readData('faqs');
  const index = faqs.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });

  faqs[index] = { ...faqs[index], ...req.body };
  writeData('faqs', faqs);
  res.json(faqs[index]);
});

app.delete('/api/admin/faqs/:id', authMiddleware, (req, res) => {
  let faqs = readData('faqs');
  faqs = faqs.filter(f => f.id !== req.params.id);
  writeData('faqs', faqs);
  res.json({ success: true });
});

// Inquiries
app.get('/api/admin/inquiries', authMiddleware, (req, res) => {
  res.json(readData('inquiries').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.put('/api/admin/inquiries/:id', authMiddleware, (req, res) => {
  const inquiries = readData('inquiries');
  const index = inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Inquiry not found' });

  inquiries[index] = { ...inquiries[index], ...req.body };
  writeData('inquiries', inquiries);
  res.json(inquiries[index]);
});

app.delete('/api/admin/inquiries/:id', authMiddleware, (req, res) => {
  let inquiries = readData('inquiries');
  inquiries = inquiries.filter(i => i.id !== req.params.id);
  writeData('inquiries', inquiries);
  res.json({ success: true });
});

// Settings
app.get('/api/admin/settings', authMiddleware, (req, res) => {
  res.json(readData('settings'));
});

app.put('/api/admin/settings', authMiddleware, (req, res) => {
  writeData('settings', req.body);
  res.json(req.body);
});

// File Upload
app.post('/api/admin/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

// Categories
app.get('/api/admin/categories', authMiddleware, (req, res) => {
  res.json(readData('categories'));
});

app.post('/api/admin/categories', authMiddleware, (req, res) => {
  const categories = readData('categories');
  const newCategory = { id: uuidv4(), ...req.body };
  categories.push(newCategory);
  writeData('categories', categories);
  res.status(201).json(newCategory);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GauShala Fresh API running on http://localhost:${PORT}`);
  console.log(`📦 Data stored in: ${DATA_DIR}`);
  console.log(`\n🔐 Default Admin Login:`);
  console.log(`   Email: admin@gaushalafresh.com`);
  console.log(`   Password: admin123`);
});
