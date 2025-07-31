import { Award, Check, Crown, Eye, Filter, Heart, Loader, ShoppingCart, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { CATEGORY_TREE } from '../../../../constants';
import { AppDispatch } from '../../../store';
import axiosInstance from '../../../utils/axiosInstance';
import { addToCart } from '../../features/thunks/cartThunks';
import { Product } from '../../types/type';

const CustomImage: React.FC<{ src: string; alt: string; style?: React.CSSProperties; className?: string; }> = ({ src, alt, style, className }) => (
  <img src={src} alt={alt} style={style} className={className} loading="lazy" />
);

const BuyOrnamentsPage = () => {

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMain, setDropdownMain] = useState<string>("All");
  const [dropdownSub, setDropdownSub] = useState<string>("");
  const [dropdownItem, setDropdownItem] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());


  const fetchOrnaments = useCallback(async (pageToFetch: number) => {
    if (pageToFetch === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await axiosInstance.get<Product[]>(`/admin/ornaments?page=${pageToFetch}&size=${itemsPerPage}`);
      const newProducts = response.data || [];

      setAllProducts(prev => pageToFetch === 0 ? newProducts : [...prev, ...newProducts]);

      if (newProducts.length < itemsPerPage) {
        setHasMore(false);
      }
      
      setCurrentPage(pageToFetch + 1);

    } catch (err) {
      console.error("Failed to fetch ornaments:", err);
      setError("Could not load ornaments. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchOrnaments(0);
  }, [fetchOrnaments]);


  const filteredProducts = useMemo(() => {
    let productsToFilter = allProducts;

    if (dropdownMain !== "All") {
      productsToFilter = productsToFilter.filter(product => {
        const categoryMatch = product.category === dropdownMain;
        const subCategoryMatch = dropdownSub ? product.subCategory === dropdownSub : true;
        const itemMatch = dropdownItem ? product.itemType === dropdownItem : true;
        return categoryMatch && subCategoryMatch && itemMatch;
      });
    }

    if (searchTerm.trim()) {
      productsToFilter = productsToFilter.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return productsToFilter;
  }, [allProducts, dropdownMain, dropdownSub, dropdownItem, searchTerm]);
  
  const handleAddToCart = async (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAddingToCart(product.id);
    try {
      await dispatch(addToCart({ ornamentId: product.id, quantity: 1 })).unwrap();
      setAddedToCart(prev => new Set(prev).add(product.id));
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
  
  const getProductWeight = (product: Product) => {
    const goldComponent = product.priceBreakups?.find(pb => pb.component.toLowerCase().includes('gold'));
    return goldComponent ? `${goldComponent.weightG}g` : 'N/A';
  };
  
  const toggleLike = (productId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLikedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) newSet.delete(productId);
        else newSet.add(productId);
        return newSet;
    });
  };

  const getSubCategories = () => CATEGORY_TREE.find(cat => cat.name === dropdownMain)?.children || [];
  const getItems = () => (getSubCategories() as any[]).find(s => s.name === dropdownSub)?.items || [];

  return (

    <div className="bg-[#fafbfc] min-h-screen font-inter">
      {/* Hero Section */}
      <div className="bg-[#7a1335] min-h-[50vh] flex items-center justify-center relative overflow-hidden pt-6 px-2">
        <div className="text-center z-20 max-w-[700px] px-2.5">
          <div className="inline-flex items-center bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/20">
            <Sparkles size={14} color="#ffffff" className="mr-1" />
            <span className="text-white text-[0.7rem] font-medium">Curated Premium Collection</span>
          </div>
          <h1 className="text-white font-extrabold leading-tight mb-3 text-[clamp(1.5rem,4vw,2.2rem)] tracking-tight">
            Exquisite Gold<br />
            <span className="text-white/70 font-light">Ornaments</span>
          </h1>
          <p className="text-white/80 text-sm max-w-[400px] mx-auto mb-6 leading-snug">
            Discover timeless elegance with our handcrafted gold jewelry collection, where tradition meets contemporary design.
          </p>
        </div>
      </div>

      {/* Sticky Filter/Search Bar - below navbar (assume navbar is h-12, so top-12) */}
      <div className="bg-white py-4 px-2 border-b border-[#f0f0f3] sticky top-12 z-30">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Category Dropdown */}
          <div className="min-w-[140px] relative">
            <button
              className="font-semibold text-xs text-[#7a1335] bg-none border border-[#eee] rounded-md px-3 py-1.5 cursor-pointer w-full text-left"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {dropdownMain === "All" ? "Select Category" : `${dropdownMain}${dropdownSub ? ` / ${dropdownSub}` : ""}${dropdownItem ? ` / ${dropdownItem}` : ""}`}
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-[110%] bg-white border border-[#eee] rounded-xl min-w-[260px] z-30 shadow-lg p-2">
                <div>
                  <div className="font-semibold text-[#7a1335] mb-2">Main Category</div>
                  {CATEGORY_TREE.map(main => (
                    <button
                      key={main.name}
                      className={`w-full text-left px-2 py-1.5 rounded-md cursor-pointer font-${dropdownMain === main.name ? 'bold' : 'medium'} text-xs ${dropdownMain === main.name ? 'text-[#7a1335] bg-[#f7f2f5]' : 'text-[#374151] bg-transparent'}`}
                      onClick={() => { setDropdownMain(main.name); setDropdownSub(""); setDropdownItem(""); }}
                    >
                      {main.name}
                    </button>
                  ))}
                </div>
                {dropdownMain !== "All" && getSubCategories().length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold text-[#7a1335] mb-2">Subcategory</div>
                    {getSubCategories().map((sub: any) => (
                      <button
                        key={sub.name}
                        className={`w-full text-left px-2 py-1.5 rounded-md cursor-pointer font-${dropdownSub === sub.name ? 'bold' : 'medium'} text-xs ${dropdownSub === sub.name ? 'text-[#7a1335] bg-[#f7f2f5]' : 'text-[#374151] bg-transparent'}`}
                        onClick={() => { setDropdownSub(sub.name); setDropdownItem(""); }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
                {dropdownMain !== "All" && dropdownSub && getItems().length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold text-[#7a1335] mb-2">Item</div>
                    {getItems().map((item: string) => (
                      <button
                        key={item}
                        className={`w-full text-left px-2 py-1.5 rounded-md cursor-pointer font-${dropdownItem === item ? 'bold' : 'medium'} text-xs ${dropdownItem === item ? 'text-[#7a1335] bg-[#f7f2f5]' : 'text-[#374151] bg-transparent'}`}
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
          {/* Search Input */}
          <div className="flex-1 flex items-center justify-center min-w-[120px]">
            <input
              type="text"
              placeholder="Search ornaments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full max-w-[200px] px-2.5 py-1.5 rounded-md border border-[#eee] text-xs outline-none"
            />
          </div>
          {/* Search Button */}
          <div>
            <button className="bg-[#7a1335] text-white border-none rounded-md px-3.5 py-1.5 font-medium text-xs cursor-pointer flex items-center gap-1.5">
              <Filter size={14} /> Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 8px', maxWidth: '900px', margin: '0 auto' }}>
        <section>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#7a1335', marginBottom: 14, textAlign: 'center' }}>
            Featured Ornaments
          </h2>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Loader size={40} className="animate-spin" style={{ color: '#7a1335', margin: '0 auto' }} />
              <p style={{ marginTop: '16px', color: '#64748b' }}>Loading our finest collection...</p>
            </div>
          )}
          {error && <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444' }}><p>{error}</p></div>}
          {!loading && !error && filteredProducts.length === 0 && <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}><p>No ornaments found. Try adjusting your search or filters.</p></div>}

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`bg-white rounded-xl overflow-hidden border border-[#f7f8fc] flex flex-col relative cursor-pointer transition-all duration-400 w-full max-w-[340px] mx-auto ${hoveredCard === idx ? 'shadow-2xl -translate-y-1.5' : 'shadow-sm translate-y-0'}`}
                    onClick={() => navigate(`/buyornaments/${product.id}`)}
                  >
                    <button
                      onClick={(e) => toggleLike(product.id, e)}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 ${likedItems.has(product.id) ? 'bg-[#7a1335]' : 'bg-white/90'} border-none rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-300 backdrop-blur shadow-md`}
                    >
                      <Heart size={14} fill={likedItems.has(product.id) ? '#ffffff' : 'none'} color={likedItems.has(product.id) ? '#ffffff' : '#7a1335'} />
                    </button>
                    <div className="relative pt-4 px-2 pb-2 bg-[#fafbfc] text-center">
                      <CustomImage
                        src={product.mainImage}
                        alt={product.name}
                        className={`w-full h-[110px] object-contain rounded-lg transition-transform duration-400 ${hoveredCard === idx ? 'scale-[1.04] rotate-1' : 'scale-100 rotate-0'}`}
                      />
                    </div>
                    <div className="px-2 pb-2 flex flex-col flex-1">
                      <h3 className="text-[0.95rem] font-semibold text-[#1a1d29] text-center mb-2 leading-tight min-h-[2.2rem]">
                        {product.name}
                      </h3>
                      <div className="flex justify-center mb-2 p-2 bg-[#f8fafc] rounded-lg border border-[#f1f5f9]">
                        <div className="text-center">
                          <div className="text-[0.65rem] text-[#64748b] mb-0.5 font-medium">PURITY</div>
                          <div className="text-[0.75rem] font-semibold text-[#7a1335]">{product.purity}</div>
                        </div>
                        <div className="w-px bg-[#e2e8f0] mx-2" />
                        <div className="text-center">
                          <div className="text-[0.65rem] text-[#64748b] mb-0.5 font-medium">WEIGHT</div>
                          <div className="text-[0.75rem] font-semibold text-[#7a1335]">{getProductWeight(product)}</div>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="text-center mb-3.5">
                          <div className="text-[1.1rem] font-bold text-[#7a1335] tracking-tight">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(product.price)}
                          </div>
                          <div className="text-[0.7rem] text-[#64748b] mt-0.5">Inclusive of all taxes</div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            className="flex-1 px-3 py-2 bg-[#7a1335] text-white rounded-lg font-medium text-xs cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
                            onClick={(e) => { e.stopPropagation(); navigate(`/buyornaments/${product.id}`); }}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border-2 ${addedToCart.has(product.id) ? 'bg-green-500 text-white border-transparent' : 'bg-[#7a1335]/10 text-[#7a1335] border-[#7a1335]/20'} cursor-pointer`}
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={isAddingToCart === product.id}
                          >
                            {isAddingToCart === product.id ? <Loader size={12} className="animate-spin" /> : addedToCart.has(product.id) ? <Check size={12} /> : <ShoppingCart size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex justify-center items-center gap-3 text-xs">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      fetchOrnaments(currentPage - 2);
                    }
                  }}
                  disabled={currentPage <= 1 || loading}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-150 ${currentPage <= 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#7a1335] text-white hover:bg-[#5e0d26] cursor-pointer'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  Previous
                </button>
                <span className="font-medium text-[#7a1335] text-sm">Page {currentPage || 1}</span>
                <button
                  onClick={() => {
                    if (hasMore && !loadingMore) {
                      fetchOrnaments(currentPage);
                    }
                  }}
                  disabled={!hasMore || loadingMore}
                  className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors duration-150 ${!hasMore ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#7a1335] text-white hover:bg-[#5e0d26] cursor-pointer'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  {loadingMore ? <><Loader size={14} className="animate-spin" /> Loading...</> : 'Next'}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
      {/* Info Section */}
      <div className="bg-[#7a1335] py-10 px-2 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: `url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")`}} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <div className="inline-flex items-center bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/20">
            <Crown size={14} color="#ffffff" className="mr-1" />
            <span className="text-white text-[0.7rem] font-medium">Premium Gold Jewelry</span>
          </div>
          <h2 className="text-white text-[clamp(1.2rem,3vw,1.7rem)] font-bold mb-3 leading-snug tracking-tight">
            Experience Luxury That Lasts Forever
          </h2>
          <p className="text-white/80 text-sm max-w-[400px] mx-auto mb-6 leading-snug">
            Each piece in our collection represents decades of craftsmanship, certified quality, and timeless elegance that transcends generations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: Award, title: 'BIS Hallmarked Gold', description: 'Every piece comes with official BIS certification ensuring 916 & 750 purity standards.' },
              { icon: Crown, title: 'Master Craftsmanship', description: 'Handcrafted by skilled artisans with over 25 years of jewelry-making expertise.' },
              { icon: Sparkles, title: 'Lifetime Guarantee', description: '100% buyback guarantee and lifetime maintenance for all our gold jewelry pieces.' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-3.5 bg-white/5 rounded-lg backdrop-blur border border-white/10">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-white/20">
                  <feature.icon size={16} color="#ffffff" />
                </div>
                <h3 className="text-white text-[0.85rem] font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-white/80 leading-snug text-[0.7rem]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyOrnamentsPage;