import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { addToCart } from "../../features/thunks/cartThunks";
import { fetchWishlist, removeFromWishlist } from "../../features/thunks/wishlistThunks";
import { WishlistItem } from "../../types/type";

// WishlistItemCard and SkeletonCard components remain the same...
const WishlistItemCard = ({ 
  item, 
  onRemove,
  onAddToCart
}: { 
  item: WishlistItem;
  onRemove: (id: number) => void;
  onAddToCart: (id: number) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col group relative border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <img
        src={item.mainImage}
        alt={item.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <div className="flex-grow flex flex-col">
        <h3 className="font-bold text-sm text-gray-800 mb-1 truncate group-hover:text-[#7a1335]" title={item.name}>
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
        <div className="mt-auto">
          <p className="font-semibold text-lg text-[#bf7e1a] mb-3">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.totalPrice)}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onAddToCart(item.ornamentId)}
              className="w-full flex items-center justify-center gap-2 bg-[#7a1335] text-white rounded-md px-3 py-2 font-semibold text-xs transition-colors hover:bg-[#991616]"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
            <button
              onClick={() => onRemove(item.ornamentId)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-red-600 rounded-md px-3 py-2 font-semibold text-xs transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 animate-pulse">
        <div className="bg-gray-200 w-full h-40 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
);


const Wishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ***** THE BULLETPROOF FIX IS HERE *****
  // 1. Select the entire state slice.
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  console.log(wishlistState,'wish')
  // 2. Destructure from the selected slice, providing a fallback empty object `{}`.
  // This ensures that even if `wishlistState` is `undefined` on the first render,
  // `items` will default to `[]`, `status` to `'idle'`, etc., preventing any crashes.
  const {
    items = [],
    status = 'idle',
    count = 0,
    error = null,
    currentPage = 0,
    isLastPage = true
  } = wishlistState || {}; // The crucial fallback

  // Fetch initial wishlist items on component load
  useEffect(() => {
    // This is the most reliable condition for an initial fetch.
    if (status === 'idle') {
      dispatch(fetchWishlist({ page: 0, size: 12 }));
    }
  }, [dispatch, status]); // The dependency array is now safe because `status` is guaranteed to be a string.

  const handleRemoveFromWishlist = (ornamentId: number) => {
    dispatch(removeFromWishlist({ ornamentId }));
  };

  const handleAddToCart = (ornamentId: number) => {
    dispatch(addToCart({ ornamentId, quantity: 1 }));
  };

  const handleLoadMore = () => {
    if (!isLastPage && status !== 'loading') {
      dispatch(fetchWishlist({ page: currentPage + 1, size: 12 }));
    }
  };

  const renderContent = () => {
    // Show skeleton loaders only on the very first load
    if (status === 'loading' && items.length === 0) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    // Show error message if fetching fails
    if (status === 'failed' && items.length === 0) {
      return (
        <div className="text-center py-20 text-red-500">
          <p>Error: {error || 'Could not load your wishlist.'}</p>
        </div>
      );
    }
    
    // Show empty state only if the fetch has completed and there are no items
    if (status === 'succeeded' && items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-gray-500">
          <Heart size={48} className="mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
          <p className="mb-6">Looks like you haven’t added anything to your wishlist yet.</p>
          <button
            onClick={() => navigate('/buyornaments')}
            className="bg-[#7a1335] text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      );
    }

    // Otherwise, render the items we have
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <WishlistItemCard 
              key={item.ornamentId} 
              item={item} 
              onRemove={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        {!isLastPage && (
            <div className="mt-8 text-center">
                <button
                    onClick={handleLoadMore}
                    disabled={status === 'loading'}
                    className="bg-white text-[#7a1335] border border-[#7a1335] font-bold py-2 px-8 rounded-lg transition-colors hover:bg-[#7a1335] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Load More'}
                </button>
            </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            My Wishlist
            <span className="ml-3 text-lg font-medium text-gray-500">
              ({count} {count === 1 ? 'Item' : 'Items'})
            </span>
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Wishlist;