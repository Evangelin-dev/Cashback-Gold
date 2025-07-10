import { Award, Crown, Eye, Filter, Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { products } from '../../../../constants'; // Assuming products is an array of product objects

// Type for CustomImage props (if not already present)
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

const LBuyOrnamentsPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [likedItems, setLikedItems] = useState<Set<number>>(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [cartItems, setCartItems] = useState<number[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();

  const categories = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Rings', 'Chains', 'Pendants'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Add types for parameters
  const toggleLike = (productId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(productId)) {
      newLikedItems.delete(productId);
    } else {
      newLikedItems.add(productId);
    }
    setLikedItems(newLikedItems);
    localStorage.setItem("wishlist", JSON.stringify(Array.from(newLikedItems)));
  };

  const addToCart = (productId: number) => {
    const updated = [...cartItems, productId];
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

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

      {/* Modern Filter Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '48px 20px',
        borderBottom: '1px solid #f0f0f3'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <Filter size={24} color="#7a1335" style={{ marginRight: '12px' }} />
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1a1d29',
              margin: 0
            }}>
              Browse Collections
            </h2>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '14px 28px',
                  border: selectedCategory === category ? 'none' : '1px solid #e2e8f0',
                  backgroundColor: selectedCategory === category ? '#7a1335' : 'transparent',
                  color: selectedCategory === category ? '#ffffff' : '#64748b',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.backgroundColor = 'rgba(122, 19, 53, 0.05)';
                    btn.style.color = '#7a1335';
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.borderColor = '#7a1335';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#64748b';
                    btn.style.transform = 'translateY(0)';
                    btn.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Product Grid */}
      <div style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '32px'
        }}>
          {filteredProducts.map((product, idx) => (
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
                border: '1px solid #f7f8fc',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 540 // ensure enough height for bottom actions
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
              <div style={{ padding: '0 32px 32px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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

                {/* Spacer to push actions to bottom */}
                <div style={{ flex: 1 }}></div>

                {/* Action Buttons at bottom */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: 'auto'
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
                    onClick={() => navigate(`/lbuyornaments/${product.id}`)}
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
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          
          @media (max-width: 768px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LBuyOrnamentsPage;