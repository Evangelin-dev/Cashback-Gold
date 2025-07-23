import { Award, Crown, Eye, Filter, Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


import { CATEGORY_TREE, products } from '../../../../constants'; 


type CustomImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
};

const CustomImage = ({ src, alt, width, height, style, className }: CustomImageProps) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    style={style}
    className={className}
  />
);

const BuyOrnamentsPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
  const [openGender, setOpenGender] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{ [cat: string]: Set<string> }>({
    Men: new Set(),
    Women: new Set(),
    Kids: new Set(),
    Unisex: new Set()
  });
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [selectedDropdown, setSelectedDropdown] = useState<{
    main: string;
    sub: string;
    item: string;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const toggleFilter = (cat: string, sub: string) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (!updated[cat]) updated[cat] = new Set();
      if (updated[cat].has(sub)) {
        updated[cat].delete(sub);
      } else {
        updated[cat].add(sub);
      }
      return { ...updated };
    });
  };

  const isAnyFilterSelected = Object.values(selectedFilters).some(set => set.size > 0);
  const filteredProducts = isAnyFilterSelected
    ? products.filter(product => {
        
        return Object.entries(selectedFilters).some(([cat, set]) =>
          product.category === cat && (set.size === 0 || set.has(product.details))
        );
      })
    : products;

  
  const toggleLike = (productId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(productId)) {
      newLikedItems.delete(productId);
    } else {
      newLikedItems.add(productId);
    }
    setLikedItems(newLikedItems);
  };

  
  function simpleShuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const getRandomProducts = (count: number) => simpleShuffle(products).slice(0, count);

  
  
  const getCategoryProducts = (cat: string, sub: string) =>
    products.filter(
      (p: any) => p.category === cat && p.details === sub 
    ).slice(0, 5);

  
  const handleDropdownSelect = (main: string, sub: string, item: string) => {
    setSelectedDropdown(prev => {
      const exists = prev.some(sel => sel.main === main && sel.sub === sub && sel.item === item);
      if (exists) {
        return prev.filter(sel => !(sel.main === main && sel.sub === sub && sel.item === item));
      } else {
        return [...prev, { main, sub, item }];
      }
    });
  };

  

  

  
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [mainCategory, setMainCategory] = useState<string>("All");
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);
  const [subCategory, setSubCategory] = useState<string>("");
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [itemCategory, setItemCategory] = useState<string>("");

  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMain, setDropdownMain] = useState<string>("All");
  const [dropdownSub, setDropdownSub] = useState<string>("");
  const [dropdownItem, setDropdownItem] = useState<string>("");

  
  const getSubCategories = () => {
    const found = CATEGORY_TREE.find(cat => cat.name === dropdownMain);
    return found && found.children ? found.children : [];
  };

  
  const getItems = () => {
    const subs = getSubCategories();
    const found = subs.find((s: any) => s.name === dropdownSub);
    
    if (
      found &&
      found.name === "Gold Coin" &&
      Array.isArray(found.items) &&
      found.items.every((item: any) => typeof item === "object" && "name" in item && "items" in item)
    ) {
      return (found.items as { name: string; items: string[] }[]).map((item) => item.name);
    }
    return found && Array.isArray(found.items) ? found.items : [];
  };

  
  const getGramVariations = () => {
    const subs = getSubCategories();
    const goldCoinSub = subs.find((s: any) => s.name === "Gold Coin");
    if (
      goldCoinSub &&
      Array.isArray(goldCoinSub.items) &&
      goldCoinSub.items.every((item: any) => typeof item === "object" && "name" in item && "items" in item)
    ) {
      const coinType = (goldCoinSub.items as { name: string; items: string[] }[]).find(
        (i) => i.name === dropdownItem
      );
      return coinType && Array.isArray(coinType.items) ? coinType.items : [];
    }
    return [];
  };

  
  const filteredProductsDropdown =
    dropdownMain === "All"
      ? products
      : products.filter(product =>
          product.category === dropdownMain &&
          (dropdownSub ? product.details === dropdownSub : true) &&
          (dropdownItem ? product.details === dropdownItem : true)
        );

  const finalFilteredProducts = searchTerm.trim()
    ? filteredProductsDropdown.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.details?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProductsDropdown;

  return (
    <div style={{ backgroundColor: '#fafbfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Modern Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, 
          rgba(122, 19, 53, 0.95) 0%, 
          rgba(122, 19, 53, 0.8) 50%, 
          rgba(122, 19, 53, 0.9) 100%),
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="1000" height="1000" fill="url(%23grain)"/></svg>')`,
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 1rem 0 1rem',
      }}>
        {/* Floating geometric shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '30px',
          transform: 'rotate(45deg)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
        
        <div style={{ textAlign: 'center', zIndex: 2, maxWidth: '900px', padding: '0 20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '50px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={20} color="#ffffff" style={{ marginRight: '8px' }} />
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500' }}>
              Curated Premium Collection
            </span>
          </div>
          
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            Exquisite Gold
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '300'
            }}>
              Ornaments
            </span>
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Discover timeless elegance with our handcrafted gold jewelry collection, 
            where tradition meets contemporary design.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: Award, text: 'BIS Hallmarked', desc: '916 & 750' },
              { icon: Crown, text: 'Handcrafted', desc: 'Artisan Made' },
              { icon: Sparkles, text: 'Lifetime Buy Back', desc: '100% Value' }
            ].map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                opacity: '0.9'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <item.icon size={28} color="#ffffff" />
                </div>
                <h3 style={{ 
                  color: '#ffffff', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0' 
                }}>
                  {item.text}
                </h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.85rem', 
                  margin: 0 
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Filter/Search Bar Row --- */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '32px 20px',
        borderBottom: '1px solid #f0f0f3'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          {/* Full Dropdown */}
          <div style={{ minWidth: 220, position: 'relative' }}>
            <button
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#7a1335",
                background: "none",
                border: "1px solid #eee",
                borderRadius: 8,
                padding: "10px 24px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left"
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {dropdownMain === "All"
                ? "Select Category"
                : dropdownMain +
                  (dropdownSub ? " / " + dropdownSub : "") +
                  (dropdownItem ? " / " + dropdownItem : "")}
            </button>
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "110%",
                left: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 10,
                minWidth: 260,
                zIndex: 30,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: 8
              }}>
                {/* Main Categories */}
                <div>
                  <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Main Category</div>
                  {CATEGORY_TREE.map(main => (
                    <button
                      key={main.name}
                      style={{
                        fontWeight: dropdownMain === main.name ? 700 : 500,
                        color: dropdownMain === main.name ? "#7a1335" : "#374151",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 8px",
                        borderRadius: 6,
                        backgroundColor: dropdownMain === main.name ? "#f7f2f5" : "transparent"
                      }}
                      onClick={() => {
                        setDropdownMain(main.name);
                        setDropdownSub("");
                        setDropdownItem("");
                      }}
                    >
                      {main.name}
                    </button>
                  ))}
                </div>
                {/* Subcategories */}
                {dropdownMain !== "All" && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Subcategory</div>
                    {getSubCategories().map((sub: any) => (
                      <button
                        key={sub.name}
                        style={{
                          fontWeight: dropdownSub === sub.name ? 700 : 500,
                          color: dropdownSub === sub.name ? "#7a1335" : "#374151",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: 6,
                          backgroundColor: dropdownSub === sub.name ? "#f7f2f5" : "transparent"
                        }}
                        onClick={() => {
                          setDropdownSub(sub.name);
                          setDropdownItem("");
                        }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
                {/* Items */}
                {dropdownMain !== "All" && dropdownSub && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>
                      {dropdownSub === "Gold Coin" ? "Coin Type" : "Item"}
                    </div>
                    {/* If Gold Coin, show 22k/24k, else show normal items */}
                    {dropdownSub === "Gold Coin"
                      ? (() => {
                          // getItems() returns string[] for Gold Coin, but the original items are objects
                          const subs = getSubCategories();
                          const found = subs.find((s: any) => s.name === "Gold Coin");
                          if (
                            found &&
                            Array.isArray(found.items) &&
                            found.items.every((item: any) => typeof item === "object" && "name" in item && "items" in item)
                          ) {
                            return (found.items as { name: string; items: string[] }[]).map((item) => (
                              <button
                                key={item.name}
                                style={{
                                  fontWeight: dropdownItem === item.name ? 700 : 500,
                                  color: dropdownItem === item.name ? "#7a1335" : "#374151",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  backgroundColor: dropdownItem === item.name ? "#f7f2f5" : "transparent"
                                }}
                                onClick={() => {
                                  setDropdownItem(item.name);
                                  // Don't close dropdown yet, show gram variations
                                }}
                              >
                                {item.name}
                              </button>
                            ));
                          }
                          return null;
                        })()
                      : getItems()
                          .filter((item: any) => typeof item === "string")
                          .map((item: string) => (
                            <button
                              key={item}
                              style={{
                                fontWeight: dropdownItem === item ? 700 : 500,
                                color: dropdownItem === item ? "#7a1335" : "#374151",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                textAlign: "left",
                                padding: "6px 8px",
                                borderRadius: 6,
                                backgroundColor: dropdownItem === item ? "#f7f2f5" : "transparent"
                              }}
                              onClick={() => {
                                setDropdownItem(item);
                                setDropdownOpen(false);
                              }}
                            >
                              {item}
                            </button>
                          ))}
                  </div>
                )}
                {/* Gram variations for Gold Coin */}
                {dropdownMain !== "All" && dropdownSub === "Gold Coin" && dropdownItem && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, color: "#7a1335", marginBottom: 8 }}>Gram Variation</div>
                    {getGramVariations().map((gram: string) => (
                      <button
                        key={gram}
                        style={{
                          fontWeight: 500,
                          color: "#374151",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: 6
                        }}
                        onClick={() => {
                          // You can set a new state for selected gram if needed
                          setDropdownOpen(false);
                        }}
                      >
                        {gram}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Center: Search Bar */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 220
          }}>
            <input
              type="text"
              placeholder="Search ornaments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                maxWidth: 400,
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #eee",
                fontSize: 16,
                outline: "none"
              }}
            />
          </div>
          {/* Right: Search Button */}
          <div>
            <button
              style={{
                background: "#7a1335",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              onClick={() => {/* Optionally trigger search/filter here */}}
            >
              <Filter size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* --- Product Listing Structure --- */}
      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Common Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: '2rem', fontWeight: 800, color: '#7a1335', marginBottom: 24, textAlign: 'center'
          }}>
            Featured Ornaments
          </h2>
          <div className="grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {finalFilteredProducts.slice(0, 10).map((product: any, idx: number) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: hoveredCard === idx 
                    ? '0 32px 64px rgba(122, 19, 53, 0.15)' 
                    : '0 4px 24px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === idx ? 'translateY(-12px)' : 'translateY(0)',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid #f7f8fc'
                }}
              >
                {/* Discount Badge */}
                {product.discount && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: '#7a1335',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    zIndex: 3,
                    boxShadow: '0 4px 12px rgba(122, 19, 53, 0.3)'
                  }}>
                    {product.discount}
                  </div>
                )}

                {/* Heart Icon */}
                <button
                  onClick={(e) => toggleLike(product.id, e)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '44px',
                    height: '44px',
                    backgroundColor: likedItems.has(product.id) ? '#7a1335' : 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 3,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  <Heart 
                    size={20} 
                    fill={likedItems.has(product.id) ? '#ffffff' : 'none'} 
                    color={likedItems.has(product.id) ? '#ffffff' : '#7a1335'} 
                  />
                </button>

                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  padding: '40px 32px 24px 32px',
                  background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    <CustomImage
                      src={product.img}
                      alt={product.title}
                      width={220}
                      height={220}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '20px',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: hoveredCard === idx ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)'
                      }}
                    />
                    {/* Modern shine effect */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(122, 19, 53, 0.1), transparent)',
                      transform: hoveredCard === idx ? 'translateX(300%)' : 'translateX(-100%)',
                      transition: 'transform 0.8s ease',
                      borderRadius: '20px'
                    }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '0 32px 32px 32px' }}>
                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '3px', marginRight: '12px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(product.rating) ? '#7a1335' : 'none'}
                          color={i < Math.floor(product.rating) ? '#7a1335' : '#cbd5e1'}
                          style={{ transition: 'all 0.2s ease' }}
                        />
                      ))}
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {product.rating} Rating
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#1a1d29',
                    textAlign: 'center',
                    marginBottom: '20px',
                    lineHeight: '1.3',
                    letterSpacing: '-0.01em'
                  }}>
                    {product.title}
                  </h3>

                  {/* Product Details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#64748b', 
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        PURITY
                      </div>
                      <div style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '700', 
                        color: '#7a1335' 
                      }}>
                        {product.purity}
                      </div>
                    </div>
                    <div style={{ 
                      width: '1px', 
                      backgroundColor: '#e2e8f0' 
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#64748b', 
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        WEIGHT
                      </div>
                      <div style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '700', 
                        color: '#7a1335' 
                      }}>
                        {product.weight}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '28px'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: '#7a1335',
                      letterSpacing: '-0.02em'
                    }}>
                      {product.price}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginTop: '4px'
                    }}>
                      Inclusive of all taxes
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '16px 24px',
                        background: '#7a1335',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                        (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(122, 19, 53, 0.9)';
                        (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(122, 19, 53, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                        (e.target as HTMLButtonElement).style.backgroundColor = '#7a1335';
                        (e.target as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                      onClick={() => navigate(`/buyornaments/${product.id}`)}
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                    
                    <button
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: 'rgba(122, 19, 53, 0.1)',
                        color: '#7a1335',
                        border: '2px solid rgba(122, 19, 53, 0.2)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#7a1335';
                        (e.target as HTMLButtonElement).style.color = '#ffffff';
                        (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                        (e.target as HTMLButtonElement).style.borderColor = '#7a1335';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(122, 19, 53, 0.1)';
                        (e.target as HTMLButtonElement).style.color = '#7a1335';
                       (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                        (e.target as HTMLButtonElement).style.borderColor = 'rgba(122, 19, 53, 0.2)';
                      }}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category-wise Sections */}
        {CATEGORY_TREE.filter(cat => cat.children && cat.children.length > 0).map(cat => (
          <section key={cat.name} style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 700, color: '#1a1d29', margin: '32px 0 16px 0'
            }}>
              {cat.name}
            </h2>
            <div>
              {(cat.children as { name: string; items: string[] }[]).map((sub: { name: string; items: string[] }) => {
                const subProducts = getCategoryProducts(cat.name, sub.name);
                if (subProducts.length === 0) return null;
                return (
                  <div key={sub.name} style={{ marginBottom: 32 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
                    }}>
                      <h3 style={{
                        fontSize: '1.15rem', fontWeight: 600, color: '#7a1335', margin: 0
                      }}>{sub.name}</h3>
                      <button
                        style={{
                          background: 'none', border: 'none', color: '#7a1335', fontWeight: 600,
                          cursor: 'pointer', fontSize: 14, textDecoration: 'underline'
                        }}
                        onClick={() => navigate(`/category/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`)}
                      >
                        See More
                      </button>
                    </div>
                    <div className="grid-responsive" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px'
                    }}>
                      {subProducts.map((product: any, idx: number) => (
                        <div
                          key={product.id}
                          onMouseEnter={() => setHoveredCard(idx)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: hoveredCard === idx 
                              ? '0 32px 64px rgba(122, 19, 53, 0.15)' 
                              : '0 4px 24px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: hoveredCard === idx ? 'translateY(-12px)' : 'translateY(0)',
                            cursor: 'pointer',
                            position: 'relative',
                            border: '1px solid #f7f8fc'
                          }}
                        >
                          {/* Discount Badge */}
                          {product.discount && (
                            <div style={{
                              position: 'absolute',
                              top: '20px',
                              left: '20px',
                              backgroundColor: '#7a1335',
                              color: '#ffffff',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              zIndex: 3,
                              boxShadow: '0 4px 12px rgba(122, 19, 53, 0.3)'
                            }}>
                              {product.discount}
                            </div>
                          )}

                          {/* Heart Icon */}
                          <button
                            onClick={(e) => toggleLike(product.id, e)}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              width: '44px',
                              height: '44px',
                              backgroundColor: likedItems.has(product.id) ? '#7a1335' : 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 3,
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                            }}
                          >
                            <Heart 
                              size={20} 
                              fill={likedItems.has(product.id) ? '#ffffff' : 'none'} 
                              color={likedItems.has(product.id) ? '#ffffff' : '#7a1335'} 
                            />
                          </button>

                          {/* Image Container */}
                          <div style={{
                            position: 'relative',
                            padding: '40px 32px 24px 32px',
                            background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              position: 'relative',
                              display: 'inline-block'
                            }}>
                              <CustomImage
                                src={product.img}
                                alt={product.title}
                                width={220}
                                height={220}
                                style={{
                                  objectFit: 'contain',
                                  borderRadius: '20px',
                                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                  transform: hoveredCard === idx ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)'
                                }}
                              />
                              {/* Modern shine effect */}
                              <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(122, 19, 53, 0.1), transparent)',
                                transform: hoveredCard === idx ? 'translateX(300%)' : 'translateX(-100%)',
                                transition: 'transform 0.8s ease',
                                borderRadius: '20px'
                              }} />
                            </div>
                          </div>

                          {/* Content */}
                          <div style={{ padding: '0 32px 32px 32px' }}>
                            {/* Rating */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '16px'
                            }}>
                              <div style={{ display: 'flex', gap: '3px', marginRight: '12px' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.floor(product.rating) ? '#7a1335' : 'none'}
                                    color={i < Math.floor(product.rating) ? '#7a1335' : '#cbd5e1'}
                                    style={{ transition: 'all 0.2s ease' }}
                                  />
                                ))}
                              </div>
                              <span style={{
                                fontSize: '0.9rem',
                                color: '#64748b',
                                fontWeight: '500'
                              }}>
                                {product.rating} Rating
                              </span>
                            </div>

                            {/* Title */}
                            <h3 style={{
                              fontSize: '1.4rem',
                              fontWeight: '700',
                              color: '#1a1d29',
                              textAlign: 'center',
                              marginBottom: '20px',
                              lineHeight: '1.3',
                              letterSpacing: '-0.01em'
                            }}>
                              {product.title}
                            </h3>

                            {/* Product Details */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '24px',
                              padding: '16px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '12px',
                              border: '1px solid #f1f5f9'
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#64748b', 
                                  marginBottom: '4px',
                                  fontWeight: '500'
                                }}>
                                  PURITY
                                </div>
                                <div style={{ 
                                  fontSize: '0.95rem', 
                                  fontWeight: '700', 
                                  color: '#7a1335' 
                                }}>
                                  {product.purity}
                                </div>
                              </div>
                              <div style={{ 
                                width: '1px', 
                                backgroundColor: '#e2e8f0' 
                              }} />
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#64748b', 
                                  marginBottom: '4px',
                                  fontWeight: '500'
                                }}>
                                  WEIGHT
                                </div>
                                <div style={{ 
                                  fontSize: '0.95rem', 
                                  fontWeight: '700', 
                                  color: '#7a1335' 
                                }}>
                                  {product.weight}
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div style={{
                              textAlign: 'center',
                              marginBottom: '28px'
                            }}>
                              <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#7a1335',
                                letterSpacing: '-0.02em'
                              }}>
                                {product.price}
                              </div>
                              <div style={{
                                fontSize: '0.85rem',
                                color: '#64748b',
                                marginTop: '4px'
                              }}>
                                Inclusive of all taxes
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                              display: 'flex',
                              gap: '12px'
                            }}>
                              <button
                                style={{
                                  flex: 1,
                                  padding: '16px 24px',
                                  background: '#7a1335',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '16px',
                                  fontWeight: '600',
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '10px',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                  (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(122, 19, 53, 0.9)';
                                  (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(122, 19, 53, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                                  (e.target as HTMLButtonElement).style.backgroundColor = '#7a1335';
                                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                                }}
                                onClick={() => navigate(`/buyornaments/${product.id}`)}
                              >
                                <Eye size={18} />
                                View Details
                              </button>
                              
                              <button
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  backgroundColor: 'rgba(122, 19, 53, 0.1)',
                                  color: '#7a1335',
                                  border: '2px solid rgba(122, 19, 53, 0.2)',
                                  borderRadius: '16px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  (e.target as HTMLButtonElement).style.backgroundColor = '#7a1335';
                                  (e.target as HTMLButtonElement).style.color = '#ffffff';
                                  (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                                  (e.target as HTMLButtonElement).style.borderColor = '#7a1335';
                                }}
                                onMouseLeave={(e) => {
                                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(122, 19, 53, 0.1)';
                                  (e.target as HTMLButtonElement).style.color = '#7a1335';
                                 (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                                  (e.target as HTMLButtonElement).style.borderColor = 'rgba(122, 19, 53, 0.2)';
                                }}
                              >
                                <ShoppingCart size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Modern Footer CTA */}
      <div style={{
        backgroundColor: '#7a1335',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '50px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Crown size={20} color="#ffffff" style={{ marginRight: '8px' }} />
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500' }}>
              Premium Gold Jewelry
            </span>
          </div>
          
          <h2 style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
            Experience Luxury That Lasts Forever
          </h2>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Each piece in our collection represents decades of craftsmanship, 
            certified quality, and timeless elegance that transcends generations.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            marginTop: '60px'
          }}>
            {[
              {
                icon: Award,
                title: 'BIS Hallmarked Gold',
                description: 'Every piece comes with official BIS certification ensuring 916 & 750 purity standards.'
              },
              {
                icon: Crown,
                title: 'Master Craftsmanship',
                description: 'Handcrafted by skilled artisans with over 25 years of jewelry-making expertise.'
              },
              {
                icon: Sparkles,
                title: 'Lifetime Guarantee',
                description: '100% buyback guarantee and lifetime maintenance for all our gold jewelry pieces.'
              }
            ].map((feature, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '32px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <feature.icon size={32} color="#ffffff" />
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '16px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          .grid-responsive {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
          @media (max-width: 768px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }
          label:hover {
            background: #f7f2f5;
          }
        `}
      </style>
    </div>
  );
};

export default BuyOrnamentsPage;