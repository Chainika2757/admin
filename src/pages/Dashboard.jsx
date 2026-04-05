import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { HiOutlineShoppingBag, HiOutlineTag, HiOutlineClock, HiOutlineDatabase } from 'react-icons/hi';

const SEED_CATEGORIES = [
  { name: 'Silk Sarees', description: 'Premium silk sarees with rich textures and traditional designs' },
  { name: 'Cotton Sarees', description: 'Lightweight and comfortable cotton sarees for daily wear' },
  { name: 'Designer Sarees', description: 'Exclusive designer sarees for special occasions' },
  { name: 'Banarasi Sarees', description: 'Handwoven Banarasi sarees with intricate gold and silver brocade' },
];

const SEED_PRODUCTS = [
  {
    name: 'Kanjivaram Pure Silk Saree',
    price: 8999,
    description: 'Exquisite Kanjivaram silk saree with traditional temple border and rich pallu. Handwoven by master artisans from Tamil Nadu.',
    imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'],
    categoryIndex: 0,
  },
  {
    name: 'Chanderi Cotton Saree',
    price: 3499,
    description: 'Elegant Chanderi cotton saree with delicate zari work. Perfect for both casual and semi-formal occasions.',
    imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'],
    categoryIndex: 1,
  },
  {
    name: 'Royal Blue Designer Saree',
    price: 12500,
    description: 'Stunning royal blue designer saree with hand-embroidered threadwork and sequin detailing. A showstopper for weddings.',
    imageUrls: ['https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop'],
    categoryIndex: 2,
  },
  {
    name: 'Banarasi Brocade Saree',
    price: 15000,
    description: 'Authentic Banarasi saree with gold brocade work. Features intricate floral motifs woven by skilled artisans from Varanasi.',
    imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop'],
    categoryIndex: 3,
  },
  {
    name: 'Printed Cotton Daily Wear',
    price: 1299,
    description: 'Comfortable printed cotton saree ideal for daily wear. Soft fabric with vibrant floral patterns.',
    imageUrls: ['https://images.unsplash.com/photo-1614886137944-5f3baa0d2a7f?w=600&h=800&fit=crop'],
    categoryIndex: 1,
  },
  {
    name: 'Embroidered Georgette Saree',
    price: 6999,
    description: 'Lightweight georgette saree with beautiful machine embroidery. Comes with a matching blouse piece.',
    imageUrls: ['https://images.unsplash.com/photo-1604830550433-79a3ccc27ed3?w=600&h=800&fit=crop'],
    categoryIndex: 2,
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setStats((prev) => ({ ...prev, products: snap.size }));
      const items = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);
      setRecentProducts(items);
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      setStats((prev) => ({ ...prev, categories: snap.size }));
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('This will add sample categories and products to your store. Continue?')) return;
    setSeeding(true);

    try {
      // Check if data already exists
      const existingCats = await getDocs(collection(db, 'categories'));
      if (existingCats.size > 0) {
        alert('Data already exists! Delete existing data first if you want to re-seed.');
        setSeeding(false);
        return;
      }

      // Add categories and capture their IDs
      const categoryIds = [];
      for (const cat of SEED_CATEGORIES) {
        const docRef = await addDoc(collection(db, 'categories'), {
          ...cat,
          createdAt: serverTimestamp(),
        });
        categoryIds.push(docRef.id);
      }

      // Add products with real category IDs
      for (const product of SEED_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          name: product.name,
          price: product.price,
          description: product.description,
          imageUrls: product.imageUrls,
          categoryId: categoryIds[product.categoryIndex],
          createdAt: serverTimestamp(),
        });
      }

      alert('Sample data added successfully! 🎉');
    } catch (err) {
      console.error('Seed error:', err);
      alert('Failed to seed data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: HiOutlineShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Categories',
      value: stats.categories,
      icon: HiOutlineTag,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your store</p>
        </div>
        {stats.products === 0 && stats.categories === 0 && (
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50"
          >
            <HiOutlineDatabase className="w-4 h-4" />
            {seeding ? 'Adding data...' : 'Add Sample Data'}
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color.split(' ')[1]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <HiOutlineClock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentProducts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <HiOutlineShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No products yet. Click "Add Sample Data" above or add sarees manually.</p>
            </div>
          ) : (
            recentProducts.map((product) => (
              <div key={product.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiOutlineShoppingBag className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">₹{product.price?.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
