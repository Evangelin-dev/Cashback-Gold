import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { products } from "../../../../constants"; // adjust path if needed

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    const ids = stored ? JSON.parse(stored) : [];
    setWishlist(ids);
    setWishlistProducts(products.filter((p) => ids.includes(p.id)));
  }, []);

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((pid) => pid !== id);
    setWishlist(updated);
    setWishlistProducts(products.filter((p) => updated.includes(p.id)));
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="py-4 min-h-[80vh] bg-[#fafbfc] font-sans">
      <div className="max-w-[900px] mx-auto px-2">
        <h1 className="text-[1.2rem] font-bold text-[#7a1335] mb-4 text-center tracking-[0.1px]">Your Wishlist</h1>
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-[#888] text-sm">
            <span className="text-2xl block mb-2">💔</span>
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[10px] shadow-md p-3 flex flex-col items-center relative border border-[#f9e9c7] min-h-[180px] transition-shadow"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-[60px] h-[60px] object-contain rounded-[6px] mb-2 bg-[#fafbfc]"
                />
                <div className="font-bold text-[13px] text-[#7a1335] mb-1 text-center">{product.title}</div>
                <div className="text-[#888] text-[11px] mb-1 text-center">{product.category}</div>
                <div className="font-bold text-[#bf7e1a] text-[14px] mb-1.5">{product.price}</div>
                <div className="flex gap-1.5 mt-auto">
                  <button
                    className="bg-[#7a1335] text-white border-none rounded-[6px] px-2 py-1 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    // onClick={() => { /* Add to cart logic here */ }}
                  >
                    <ShoppingCart size={13} className="mr-0.5" />
                    Add to Cart
                  </button>
                  <button
                    className="bg-white text-[#991313] border border-[#f0e3d1] rounded-[6px] px-2 py-1 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 size={13} className="mr-0.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
