import React, { useState, useRef, useEffect } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! 👋 Welcome to our store. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastContext, setLastContext] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const productDatabase = {
    'maggie': { available: true, price: 12, stock: 150, category: 'Groceries' },
    'noodles': { available: true, price: 12, stock: 150, category: 'Groceries' },
    'shoes': { available: true, price: 450, stock: 80, category: 'Footwear' },
    'sneakers': { available: true, price: 480, stock: 60, category: 'Footwear' },
    'shirt': { available: true, price: 500, stock: 120, category: 'Clothing' },
    't-shirt': { available: true, price: 300, stock: 200, category: 'Clothing' },
    'jeans': { available: true, price: 800, stock: 90, category: 'Clothing' },
    'laptop': { available: true, price: 35000, stock: 15, category: 'Electronics' },
    'phone': { available: true, price: 15000, stock: 40, category: 'Electronics' },
    'headphones': { available: true, price: 1200, stock: 75, category: 'Electronics' },
    'watch': { available: true, price: 2500, stock: 50, category: 'Accessories' },
    'bag': { available: true, price: 600, stock: 85, category: 'Accessories' },
    'rice': { available: true, price: 60, stock: 300, category: 'Groceries' },
    'oil': { available: true, price: 150, stock: 180, category: 'Groceries' },
    'chocolate': { available: true, price: 50, stock: 250, category: 'Snacks' },
    'chips': { available: true, price: 20, stock: 400, category: 'Snacks' },
    'water bottle': { available: true, price: 250, stock: 100, category: 'Accessories' },
    'umbrella': { available: false, price: 0, stock: 0, category: 'Accessories' },
    'sunglasses': { available: true, price: 800, stock: 45, category: 'Accessories' }
  };

  const getBudgetRecommendations = (budget) => {
    const items = [];
    for (const [product, details] of Object.entries(productDatabase)) {
      if (details.available && details.price <= budget) {
        items.push(`${product.charAt(0).toUpperCase() + product.slice(1)} (₹${details.price})`);
      }
    }
    return items.slice(0, 6);
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();

    if (msg.match(/^(yes|yeah|yep|sure|ok|okay|yea)$/)) {
      if (lastContext === 'snacks_combo') {
        setLastContext(null);
        return "Great! 🎉 Here are our combo offers:\n• 2 Chips + 1 Chocolate = ₹60 (Save ₹30!)\n• Family Pack: 5 Chips + 3 Chocolates = ₹180 (Save ₹75!)\n• Snack Box: Chips, Cookies, Biscuits = ₹60 (Save ₹15!)\n\nWhich combo would you like?";
      } else if (lastContext === 'more_info') {
        setLastContext(null);
        return "Sure! I can provide more details. Which product would you like to know more about? Or you can ask about delivery, warranty, or return policies!";
      } else {
        return "Great! How can I help you further? You can ask about products, prices, or place an order! 😊";
      }
    }

    if (msg.match(/^(no|nope|nah|not now)$/)) {
      setLastContext(null);
      return "No problem! Let me know if you need anything else. I'm here to help! 😊";
    }

    if (msg.match(/^(hey|hi|hello|hola|good morning|good evening|namaste)$/)) {
      return "Hello! 😊 How can I assist you today? Are you looking for something specific?";
    }

    if (msg.includes('name') || msg.includes('who are you')) {
      return "I'm ShopBot 🤖, your friendly shopping assistant! I'm here to help you find products and answer questions.";
    }

    if (msg.includes('where') && (msg.includes('footwear') || msg.includes('shoes'))) {
      return "You can find our Footwear section on Aisle 3! 👟\n📍 Ground Floor, near the Sports section.\nWe have shoes, sneakers, sandals, boots, and more!\n\nWould you like to know about specific shoe types or prices?";
    }

    if (msg.includes('where') && (msg.includes('clothing') || msg.includes('clothes') || msg.includes('shirt'))) {
      return "Clothing section is on Floor 1! 👔\n📍 First Floor, Aisle 5-7\nMen's wear (Aisle 5), Women's wear (Aisle 6), Kids wear (Aisle 7)\n\nWhat are you looking for?";
    }

    if (msg.includes('where') && msg.includes('electronics')) {
      return "Electronics department is on Floor 2! 📱💻\n📍 Second Floor, Aisle 10-12\nWe have laptops, phones, headphones, and more!\n\nLooking for something specific?";
    }

    if (msg.includes('where') && (msg.includes('groceries') || msg.includes('food') || msg.includes('maggie'))) {
      return "Groceries section is on Ground Floor! 🛒\n📍 Ground Floor, Aisle 1-2\nDairy, Snacks, Noodles, Rice, Oil - everything you need!\n\nWhat items do you need?";
    }

    if (msg.includes('where') && msg.includes('snacks')) {
      return "Snacks are in the Grocery section! 🍫\n📍 Ground Floor, Aisle 2\nChips, chocolates, cookies, biscuits, and more!\n\nCraving something specific?";
    }

    const budgetMatch = msg.match(/budget.*?(\d+)|(\d+).*?rupees?|i have (\d+)|(\d+).*?budget/i);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]);
      const recommendations = getBudgetRecommendations(budget);
      
      if (budget < 20) {
        return `With ₹${budget}, you can get:\n🍜 Maggie (₹12) ✓\n\nFor other items, you'll need a bit more. Would you like to see items under ₹50?`;
      } else if (budget < 100) {
        return `Great! For ₹${budget}, here are some options:\n${recommendations.slice(0, 3).map(item => '✓ ' + item).join('\n')}\n\nWe have ${recommendations.length} items in your budget range! 🛍️`;
      } else if (budget < 1000) {
        return `Perfect! 🎉 For ₹${budget}, we have many options:\n${recommendations.slice(0, 5).map(item => '✓ ' + item).join('\n')}\n\nSale is going on with up to 40% off! Which category interests you?`;
      } else {
        return `Excellent budget! 💰 For ₹${budget}, you have premium options:\n${recommendations.slice(0, 5).map(item => '✓ ' + item).join('\n')}\n\n...and many more! What are you looking for?`;
      }
    }

    if (msg.match(/^(chips|chocolate|maggie|shoes|shirt|laptop|phone|jeans|bag|watch)\??$/)) {
      const product = msg.replace('?', '');
      const details = productDatabase[product];
      
      if (details && details.available) {
        if (product === 'chips' || product === 'chocolate') {
          setLastContext('snacks_combo');
          return "Craving something? 🍫🥔\n• Chocolates (₹50)\n• Chips (₹20)\n• Cookies (₹30)\n• Biscuits (₹25)\n\nCombo offers available! Want to check them out?";
        }
        setLastContext('more_info');
        return `Yes! ${product.charAt(0).toUpperCase() + product.slice(1)} is available! ✅\n💰 Price: ₹${details.price}\n📦 Stock: ${details.stock}+ units\n🏷️ Category: ${details.category}\n\nWould you like to know more?`;
      }
    }

    const productQuery = msg.match(/(?:is |do you have |got |available |sell |want |need )([a-z\s-]+?)(?:\?|$| available| in stock)/);
    if (productQuery) {
      const product = productQuery[1].trim();
      const foundProduct = Object.keys(productDatabase).find(key => 
        product.includes(key) || key.includes(product)
      );

      if (foundProduct) {
        const details = productDatabase[foundProduct];
        if (details.available) {
          setLastContext('more_info');
          return `Yes! ${foundProduct.charAt(0).toUpperCase() + foundProduct.slice(1)} is available! ✅\n💰 Price: ₹${details.price}\n📦 Stock: ${details.stock}+ units\n🏷️ Category: ${details.category}`;
        } else {
          return `Sorry! ${foundProduct.charAt(0).toUpperCase() + foundProduct.slice(1)} is out of stock. ❌`;
        }
      }
    }

    if (msg.match(/^(thanks|thank you|thx|ty)$/)) {
      setLastContext(null);
      return "You're welcome! 😊 Happy to help!";
    }

    if (msg.match(/^(bye|goodbye|see you)$/)) {
      setLastContext(null);
      return "Goodbye! 👋 Come back soon! 🛍️";
    }

    setLastContext(null);
    return "I'm not sure I understood that. 🤔 You can ask:\n• 'Do you have [product]?'\n• 'Where is [category]?'\n• 'My budget is [amount]'\n• 'What's on sale?'";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255, 107, 53, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animation: 'pulse 2s infinite'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.4)';
          }}
        >
          💬
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '550px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f7f7f7',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#6b7280',
            color: '#ffffff',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>ShopBot</h3>
                <p style={{ margin: 0, fontSize: '11px', opacity: 1, color: '#ffffff' }}>Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  backgroundColor: msg.type === 'user' ? '#ff6b35' : 'white',
                  color: msg.type === 'user' ? 'white' : '#333',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-line',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0s' }}>●</span>
                  <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0.2s' }}>●</span>
                  <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                padding: '10px 16px',
                backgroundColor: input.trim() ? '#ff6b35' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '18px',
                cursor: input.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              📤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4); }
          50% { box-shadow: 0 4px 24px rgba(255, 107, 53, 0.6); }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;