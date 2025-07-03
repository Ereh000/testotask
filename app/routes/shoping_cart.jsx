import { useState, useEffect } from 'react';

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [freeGiftApplied, setFreeGiftApplied] = useState(false);
  const freeGiftThreshold = 1000;

  const products = [
    { id: 1, name: 'Laptop', price: 500 },
    { id: 2, name: 'Smartphone', price: 300 },
    { id: 3, name: 'Headphones', price: 100 },
    { id: 4, name: 'Smartwatch', price: 150 },
  ];

  useEffect(() => {
    // Calculate subtotal whenever cart changes
    const newSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    // Check if free gift should be applied
    if (newSubtotal >= freeGiftThreshold && !freeGiftApplied) {
      setFreeGiftApplied(true);
      setCart([...cart, { id: 5, name: 'Wireless Mouse', price: 0, quantity: 1, isFreeGift: true }]);
    } else if (newSubtotal < freeGiftThreshold && freeGiftApplied) {
      setFreeGiftApplied(false);
      setCart(cart.filter(item => !item.isFreeGift));
    }
  }, [cart, freeGiftApplied]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-700 mb-3">₹{product.price}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          
          {!freeGiftApplied && subtotal > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 mb-2">
                Add ₹{freeGiftThreshold - subtotal} more to get a FREE Wireless Mouse!
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (subtotal / freeGiftThreshold) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {freeGiftApplied && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-green-700">You got a free Wireless Mouse!</p>
            </div>
          )}
        </div>
        
        {cart.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b py-4 last:border-0">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} × {item.quantity} =₹{item.price * item.quantity}</p>
                </div>
                
                {item.isFreeGift ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">FREE GIFT</span>
                ) : (
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-red-500 text-white w-8 h-8 rounded-l flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-green-500 text-white w-8 h-8 rounded-r flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Add some products to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
}