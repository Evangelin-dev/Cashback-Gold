import { Award, Eye, Heart, ShoppingCart, Sparkles, Star, Loader, Filter, Crown, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { CATEGORY_TREE } from '../../../../constants';
import { Product } from '../../types/type';


const CustomImage: React.FC<{ src: string; alt: string; style?: React.CSSProperties; className?: string; }> = ({ src, alt, style, className }) => (
  <img src={src} alt={alt} style={style} className={className} loading="lazy" />
);

const BuyOrnamentsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMain, setDropdownMain] = useState<string>("All");
  const [dropdownSub, setDropdownSub] = useState<string>("");
  const [dropdownItem, setDropdownItem] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // State for Add to Cart functionality
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchOrnaments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/admin/ornaments?page=0&size=20');
        setProducts(response.data || []);
      } catch (err) {
        console.error("Failed to fetch ornaments:", err);
        setError("Could not load ornaments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrnaments();
  }, []);

  const toggleLike = (productId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newLikedItems = new Set(likedItems);
    newLikedItems.has(productId) ? newLikedItems.delete(productId) : newLikedItems.add(productId);
    setLikedItems(newLikedItems);
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents navigating to the product page
    setIsAddingToCart(product.id);

    try {
      // Assuming quantity is 1 when adding from the product list page
      await axiosInstance.post(`/api/cart/add?ornamentId=${product.id}&qty=1`);
      
      const newAdded = new Set(addedToCart);
      newAdded.add(product.id);
      setAddedToCart(newAdded);

      // Revert the icon back to the cart after 2 seconds
      setTimeout(() => {
        setAddedToCart(prev => {
          const updated = new Set(prev);
          updated.delete(product.id);
          return updated;
        });
      }, 2000);

    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(`Could not add "${product.name}" to cart. Please try again.`);
    } finally {
      setIsAddingToCart(null);
    }
  };

  const filteredProductsDropdown =
    dropdownMain === "All"
      ? products
      : products.filter(product =>
        product.category === dropdownMain &&
        (dropdownSub ? product.subCategory === dropdownSub : true) &&
        (dropdownItem ? product.details === dropdownItem : true)
      );

  const finalFilteredProducts = searchTerm.trim()
    ? filteredProductsDropdown.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.details?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : filteredProductsDropdown;

  const getProductWeight = (product: Product) => {
    const goldComponent = product.priceBreakups?.find(pb => pb.component.toLowerCase() === 'gold');
    return goldComponent ? `${goldComponent.weightG}g` : 'N/A';
  };

  const getSubCategories = () => {
    const found = CATEGORY_TREE.find(cat => cat.name === dropdownMain);
    return found?.children || [];
  };

  const getItems = () => {
    const subs = getSubCategories() as any[];
    const found = subs.find(s => s.name === dropdownSub);
    return found?.items || [];
  };

  return (
    <div style={{ backgroundColor: '#fafbfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(122, 19, 53, 0.95) 0%, rgba(122, 19, 53, 0.8) 50%, rgba(122, 19, 53, 0.9) 100%)`,
        minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '48px 1rem 0 1rem',
      }}>
        <div style={{ textAlign: 'center', zIndex: 2, maxWidth: '900px', padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: '50px', marginBottom: '32px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Sparkles size={20} color="#ffffff" style={{ marginRight: '8px' }} />
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500' }}>Curated Premium Collection</span>
          </div>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Exquisite Gold<br /><span style={{ background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '300' }}>Ornaments</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
            Discover timeless elegance with our handcrafted gold jewelry collection, where tradition meets contemporary design.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '32px 20px', borderBottom: '1px solid #f0f0f3' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220, position: 'relative' }}>
            <button
              style={{ fontWeight: 700, fontSize: 16, color: "#7a1335", background: "none", border: "1px solid #eee", borderRadius: 8, padding: "10px 24px", cursor: "pointer", width: "100%", textAlign: "left" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {dropdownMain === "All" ? "Select Category" : `${dropdownMain}${dropdownSub ? ` / ${dropdownSub}` : ""}${dropdownItem ? ` / ${dropdownItem}` : ""}`}
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", top: "110%", left: 0, background: "#fff", border: "1px solid #eee", borderRadius: 10, minWidth: 260, zIndex: 30, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Main Category</div>
                  {CATEGORY_TREE.map(main => (
                    <button key={main.name} style={{ fontWeight: dropdownMain === main.name ? 700 : 500, color: dropdownMain === main.name ? "#7a1335" : "#374151", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 6, backgroundColor: dropdownMain === main.name ? "#f7f2f5" : "transparent" }}
                      onClick={() => { setDropdownMain(main.name); setDropdownSub(""); setDropdownItem(""); }}
                    >
                      {main.name}
                    </button>
                  ))}
                </div>
                {dropdownMain !== "All" && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Subcategory</div>
                    {getSubCategories().map((sub: any) => (
                      <button key={sub.name} style={{ fontWeight: dropdownSub === sub.name ? 700 : 500, color: dropdownSub === sub.name ? "#7a1335" : "#374151", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 6, backgroundColor: dropdownSub === sub.name ? "#f7f2f5" : "transparent" }}
                        onClick={() => { setDropdownSub(sub.name); setDropdownItem(""); }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
                {dropdownMain !== "All" && dropdownSub && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Item</div>
                    {getItems().map((item: string) => (
                      <button key={item} style={{ fontWeight: dropdownItem === item ? 700 : 500, color: dropdownItem === item ? "#7a1335" : "#374151", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 6, backgroundColor: dropdownItem === item ? "#f7f2f5" : "transparent" }}
                        onClick={() => { setDropdownItem(item); setDropdownOpen(false); }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 220 }}>
            <input type="text" placeholder="Search ornaments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: "100%", maxWidth: 400, padding: "12px 16px", borderRadius: 8, border: "1px solid #eee", fontSize: 16, outline: "none" }} />
          </div>
          <div>
            <button style={{ background: "#7a1335", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={20} /> Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#7a1335', marginBottom: 24, textAlign: 'center' }}>
            Featured Ornaments
          </h2>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Loader size={40} className="animate-spin" style={{ color: '#7a1335', margin: '0 auto' }} />
              <p style={{ marginTop: '16px', color: '#64748b' }}>Loading our finest collection...</p>
            </div>
          )}
          {error && <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444' }}><p>{error}</p></div>}
          {!loading && !error && finalFilteredProducts.length === 0 && <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}><p>No ornaments found. Try adjusting your search or filters.</p></div>}

          {!loading && !error && finalFilteredProducts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
              {finalFilteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: hoveredCard === idx ? '0 32px 64px rgba(122, 19, 53, 0.15)' : '0 4px 24px rgba(0, 0, 0, 0.04)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredCard === idx ? 'translateY(-12px)' : 'translateY(0)', cursor: 'pointer', position: 'relative', border: '1px solid #f7f8fc', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(`/buyornaments/${product.id}`)}
                >
                  <button onClick={(e) => toggleLike(product.id, e)} style={{ position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px', backgroundColor: likedItems.has(product.id) ? '#7a1335' : 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, transition: 'all 0.3s ease', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Heart size={20} fill={likedItems.has(product.id) ? '#ffffff' : 'none'} color={likedItems.has(product.id) ? '#ffffff' : '#7a1335'} />
                  </button>

                  <div style={{ position: 'relative', padding: '40px 32px 24px 32px', background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)', textAlign: 'center' }}>
                    <CustomImage src={product.mainImage} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'contain', borderRadius: '20px', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredCard === idx ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)' }} />
                  </div>

                  <div style={{ padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1d29', textAlign: 'center', marginBottom: '20px', lineHeight: '1.3', minHeight: '3.9rem' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>PURITY</div><div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#7a1335' }}>{product.purity}</div></div>
                      <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>WEIGHT</div><div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#7a1335' }}>{getProductWeight(product)}</div></div>
                    </div>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7a1335', letterSpacing: '-0.02em' }}>
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(product.price)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Inclusive of all taxes</div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ flex: 1, padding: '16px 24px', background: '#7a1335', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={(e) => { e.stopPropagation(); navigate(`/buyornaments/${product.id}`); }}>
                          <Eye size={18} /> View Details
                        </button>
                        <button 
                          style={{ 
                            width: '56px', height: '56px', 
                            backgroundColor: addedToCart.has(product.id) ? '#22c55e' : 'rgba(122, 19, 53, 0.1)', 
                            color: addedToCart.has(product.id) ? '#ffffff' : '#7a1335', 
                            border: '2px solid',
                            borderColor: addedToCart.has(product.id) ? 'transparent' : 'rgba(122, 19, 53, 0.2)',
                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                          }}
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={isAddingToCart === product.id}
                        >
                          {isAddingToCart === product.id ? <Loader size={20} className="animate-spin" /> : addedToCart.has(product.id) ? <Check size={20} /> : <ShoppingCart size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div style={{ backgroundColor: '#7a1335', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, opacity: 0.3 }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: '50px', marginBottom: '32px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Crown size={20} color="#ffffff" style={{ marginRight: '8px' }} />
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500' }}>Premium Gold Jewelry</span>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            Experience Luxury That Lasts Forever
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
            Each piece in our collection represents decades of craftsmanship, certified quality, and timeless elegance that transcends generations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '60px' }}>
            {[
              { icon: Award, title: 'BIS Hallmarked Gold', description: 'Every piece comes with official BIS certification ensuring 916 & 750 purity standards.' },
              { icon: Crown, title: 'Master Craftsmanship', description: 'Handcrafted by skilled artisans with over 25 years of jewelry-making expertise.' },
              { icon: Sparkles, title: 'Lifetime Guarantee', description: '100% buyback guarantee and lifetime maintenance for all our gold jewelry pieces.' }
            ].map((feature, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '32px 24px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <feature.icon size={32} color="#ffffff" />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px' }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', fontSize: '0.95rem' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyOrnamentsPage;