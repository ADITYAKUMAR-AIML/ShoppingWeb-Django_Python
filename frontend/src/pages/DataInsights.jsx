import React, { useMemo } from 'react';
import './DataInsights.css';
import {
  LineChart, Line,
  PieChart, Pie,
  BarChart, Bar,
  RadarChart, Radar, // Add RadarChart and Radar
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid, // Add PolarGrid
  PolarAngleAxis, // Add PolarAngleAxis
  PolarRadiusAxis // Add PolarRadiusAxis
} from 'recharts';

const DataInsights = ({ products = [], orders = [], categories = [] }) => {
// Demo revenue data for line chart
const demoRevenueData = [
  { date: 'Jan 1', revenue: 1200, avgOrderValue: 85, orders: 14 },
  { date: 'Jan 2', revenue: 1800, avgOrderValue: 92, orders: 19 },
  { date: 'Jan 3', revenue: 1500, avgOrderValue: 88, orders: 17 },
  { date: 'Jan 4', revenue: 2200, avgOrderValue: 95, orders: 23 },
  { date: 'Jan 5', revenue: 1900, avgOrderValue: 90, orders: 21 },
  { date: 'Jan 6', revenue: 2500, avgOrderValue: 98, orders: 25 },
  { date: 'Jan 7', revenue: 2100, avgOrderValue: 94, orders: 22 }
];

// Spider chart data for performance metrics
const spiderData = [
  { subject: 'Sales', A: 85, fullMark: 100 },
  { subject: 'Revenue', A: 92, fullMark: 100 },
  { subject: 'Orders', A: 78, fullMark: 100 },
  { subject: 'Customers', A: 65, fullMark: 100 },
  { subject: 'Products', A: 88, fullMark: 100 },
  { subject: 'Growth', A: 95, fullMark: 100 }
];
    

  // Debug: Check what data we're receiving
  console.log('DataInsights received:', {
    productsCount: products.length,
    ordersCount: orders.length,
    categoriesCount: categories.length,
    sampleProduct: products[0],
    sampleOrder: orders[0]
  });

  // ============================================
  // DATA PROCESSING FUNCTIONS
  // ============================================

  // 1. Process Revenue Over Time Data with Average Order Value
  const revenueData = useMemo(() => {
    if (!orders || orders.length === 0) {
      console.log('No orders data for revenue chart');
      // Return sample data for demo
      return [
        { date: 'Jan 1', revenue: 0, avgOrderValue: 0, orders: 0 },
        { date: 'Jan 2', revenue: 0, avgOrderValue: 0, orders: 0 },
        { date: 'Jan 3', revenue: 0, avgOrderValue: 0, orders: 0 }
      ];
    }

    // Group orders by date
    const revenueByDate = {};
    
    orders.forEach(order => {
      // Handle different date field names
      const dateField = order.created_at || order.date || order.orderDate;
      const amount = order.total_amount || order.total || order.amount || 0;
      
      if (dateField && !isNaN(amount)) {
        try {
          // Extract date (without time)
          const dateObj = new Date(dateField);
          const date = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          
          if (!revenueByDate[date]) {
            revenueByDate[date] = { total: 0, count: 0 };
          }
          revenueByDate[date].total += Number(amount);
          revenueByDate[date].count += 1;
        } catch (error) {
          console.error('Error parsing date:', dateField);
        }
      }
    });

    // Convert to array format for Recharts
    const result = Object.entries(revenueByDate)
      .map(([date, data]) => ({
        date,
        revenue: Number(data.total.toFixed(2)),
        avgOrderValue: data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 0,
        orders: data.count
      }))
      .slice(-10); // Show last 10 dates
    
    console.log('Processed Revenue Data:', result);
    return result.length > 0 ? result : [
      { date: 'Today', revenue: 0, avgOrderValue: 0, orders: 0 }
    ];
  }, [orders]);

    // 2. Process Products by Category Data
    const categoryData = useMemo(() => {
    if (!products || products.length === 0) {
        return [
        { name: 'No Data', value: 1 }
        ];
    }

    const categoryCount = {
        'Fashion': 0,
        'Electronics': 0,
        'Food': 0,
        'Home': 0,
        'Gaming': 0,
        'Uncategorized': 0
    };
    
    products.forEach(product => {
        // Prefer server-provided category name, fallback to slug or id
        const raw = (product.category_name || product.category_slug || product.category || 'Uncategorized');
        const category = String(raw);
        
        // Map to fixed category names
        let fixedCategory = 'Uncategorized';
        const categoryLower = category.toLowerCase();
        
        if (categoryLower.includes('fashion') || categoryLower.includes('cloth')) {
        fixedCategory = 'Fashion';
        } else if (categoryLower.includes('electron') || categoryLower.includes('tech')) {
        fixedCategory = 'Electronics';
        } else if (categoryLower.includes('food') || categoryLower.includes('grocery')) {
        fixedCategory = 'Food';
        } else if (categoryLower.includes('home') || categoryLower.includes('furniture')) {
        fixedCategory = 'Home';
        } else if (categoryLower.includes('game') || categoryLower.includes('console')) {
        fixedCategory = 'Gaming';
        } else if (['fashion', 'electronics', 'food', 'home', 'gaming'].includes(categoryLower)) {
        // If it's already one of our fixed categories (case insensitive)
        fixedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        } else {
        fixedCategory = 'Uncategorized';
        }
        
        categoryCount[fixedCategory] = (categoryCount[fixedCategory] || 0) + 1;
    });

    // Remove categories with 0 count and convert to array
    const result = Object.entries(categoryCount)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({
        name,
        value
        }));

    return result.length > 0 ? result : [
        { name: 'Fashion', value: 1 },
        { name: 'Electronics', value: 1 },
        { name: 'Food', value: 1 },
        { name: 'Home', value: 1 },
        { name: 'Gaming', value: 1 }
    ];
    }, [products]);
  // 3. Process Order Status Distribution
  const orderStatusData = useMemo(() => {
    if (!orders || orders.length === 0) {
      console.log('No orders data for status chart');
      // Return sample data for demo
      return [
        { status: 'Pending', count: 1 },
        { status: 'Completed', count: 1 },
        { status: 'Processing', count: 1 }
      ];
    }

    const statusCount = {
      'Pending': 0,
      'Completed': 0, 
      'Processing': 0,
      'Cancelled': 0,
      'Shipped': 0
    };

    orders.forEach(order => {
      const status = order.status ? order.status.toString().toLowerCase() : 'pending';
      let statusKey = 'Pending';
      
      if (status.includes('complete') || status.includes('deliver')) statusKey = 'Completed';
      else if (status.includes('process') || status.includes('confirm')) statusKey = 'Processing';
      else if (status.includes('cancel') || status.includes('refund')) statusKey = 'Cancelled';
      else if (status.includes('ship')) statusKey = 'Shipped';
      else statusKey = 'Pending';
      
      statusCount[statusKey] = (statusCount[statusKey] || 0) + 1;
    });

    const result = Object.entries(statusCount)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count
      }));
    
    console.log('Processed Order Status Data:', result);
    return result.length > 0 ? result : [{ status: 'No Data', count: 1 }];
  }, [orders]);

  // 4. Process Stock Levels Data
  const stockLevelsData = useMemo(() => {
    if (!products || products.length === 0) {
      return [
        { name: 'No Products', stock: 0, fill: '#6b7280' }
      ];
    }

    const productsWithStock = products
      .filter(p => typeof p.stock !== 'undefined' && p.stock !== null)
      .map(product => ({
        ...product,
        stock: Number(product.stock) || 0
      }));

    if (productsWithStock.length === 0) {
      return [{ name: 'No Stock Data', stock: 0, fill: '#6b7280' }];
    }

    return productsWithStock
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 10)
      .map(product => ({
        name: product.name && product.name.length > 15 
          ? product.name.substring(0, 15) + '...' 
          : product.name || 'Unnamed Product',
        stock: product.stock || 0,
        fill: (product.stock || 0) < 10 ? '#ef4444' : 
              (product.stock || 0) < 50 ? '#f59e0b' : '#10b981'
      }));
  }, [products]);

  // 5. Process Top 5 Most Expensive Products
  const topExpensiveProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [
        { name: 'No Products', price: 0 }
      ];
    }

    const productsWithPrice = products
      .filter(p => p.price !== undefined && p.price !== null && !isNaN(p.price))
      .map(product => ({
        ...product,
        price: Number(product.price) || 0
      }));

    if (productsWithPrice.length === 0) {
      return [{ name: 'No Price Data', price: 0 }];
    }

    return productsWithPrice
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 5)
      .map(product => ({
        name: product.name && product.name.length > 20 
          ? product.name.substring(0, 20) + '...' 
          : product.name || 'Unnamed Product',
        price: Number(product.price) || 0
      }));
  }, [products]);

  // 6. Process Revenue by Category
  const revenueByCategoryData = useMemo(() => {
    if (!orders || orders.length === 0 || !products || products.length === 0) {
      return [
        { category: 'No Data', revenue: 0 }
      ];
    }

    const revenueByCategory = {};

    orders.forEach(order => {
      const orderAmount = order.total_amount || order.total || order.amount || 0;
      
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = (item.product && item.product.id) || item.product_id;
          const product = products.find(p => p.id === productId);
          const category = product?.category_name || product?.category_slug || 'Uncategorized';
          revenueByCategory[category] = (revenueByCategory[category] || 0) + Number(orderAmount);
        });
      } else {
        // If no items array, distribute total amount across categories
        const category = 'General';
        revenueByCategory[category] = (revenueByCategory[category] || 0) + Number(orderAmount);
      }
    });

    const result = Object.entries(revenueByCategory)
      .map(([category, revenue]) => ({
        category,
        revenue: Number(revenue.toFixed(2))
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return result.length > 0 ? result : [{ category: 'No Revenue Data', revenue: 0 }];
  }, [orders, products]);

  // 7. Process Revenue by Status
  const revenueByStatusData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [
        { status: 'No Data', revenue: 0 }
      ];
    }

    const revenueByStatus = {};

    orders.forEach(order => {
      const status = order.status ? order.status.toString().toLowerCase() : 'pending';
      let statusKey = 'Pending';
      
      if (status.includes('complete') || status.includes('deliver')) statusKey = 'Completed';
      else if (status.includes('process') || status.includes('confirm')) statusKey = 'Processing';
      else if (status.includes('cancel') || status.includes('refund')) statusKey = 'Cancelled';
      else if (status.includes('ship')) statusKey = 'Shipped';
      else statusKey = 'Pending';
      
      const amount = order.total_amount || order.total || order.amount || 0;
      revenueByStatus[statusKey] = (revenueByStatus[statusKey] || 0) + Number(amount);
    });

    const result = Object.entries(revenueByStatus)
      .map(([status, revenue]) => ({
        status,
        revenue: Number(revenue.toFixed(2))
      }));

    return result.length > 0 ? result : [{ status: 'No Data', revenue: 0 }];
  }, [orders]);

  // ============================================
  // CHART COLOR SCHEMES
  // ============================================

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  const STATUS_COLORS = {
    Pending: '#f59e0b',
    Completed: '#10b981',
    Cancelled: '#ef4444',
    Processing: '#3b82f6',
    Shipped: '#8b5cf6'
  };

  // ============================================
  // SUMMARY STATISTICS
  // ============================================

  const summaryStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => 
      sum + Number(order.total_amount || order.total || order.amount || 0), 0);
    
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalProducts,
      totalOrders, 
      avgOrderValue: Number(avgOrderValue.toFixed(2))
    };
  }, [products, orders]);

  // ============================================
  // RENDER CHARTS
  // ============================================

  return (
    <div className="data-insights">
      <h2 className="insights-title">Data Insights & Analytics</h2>
      
      {/* Summary Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
        <h3>Total Revenue</h3>
        <p className="stat-value">${summaryStats.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{summaryStats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{summaryStats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Order Value</h3>
          <p className="stat-value">${summaryStats.avgOrderValue}</p>
        </div>
      </div>
      
      <div className="charts-grid">
        
        {/* Chart 1: Revenue & Average Order Value Over Time */}
        <div className="chart-card large">
          <h3 className="chart-title">Revenue & Avg Order Value Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => {
                  if (name === 'Orders') return [value, name];
                  return [`$${value}`, name];
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Total Revenue"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgOrderValue" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                strokeDasharray="5 5"
                name="Avg Order Value"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Products by Category */}
        <div className="chart-card">
          <h3 className="chart-title">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Order Status Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="status" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Orders">
                {orderStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status] || '#6b7280'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Stock Levels Alert */}
        <div className="chart-card">
          <h3 className="chart-title">Stock Levels Alert</h3>
          <div className="stock-legend">
            <span className="legend-item">
              <span className="legend-dot low"></span> Low (&lt;10)
            </span>
            <span className="legend-item">
              <span className="legend-dot medium"></span> Medium (10-50)
            </span>
            <span className="legend-item">
              <span className="legend-dot high"></span> High (&gt;50)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={stockLevelsData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                width={90}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} units`, 'Stock']}
              />
              <Bar dataKey="stock" name="Stock Level">
                {stockLevelsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Top 5 Most Expensive Products */}
        <div className="chart-card large">
          <h3 className="chart-title">Top 5 Most Expensive Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={topExpensiveProducts}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }}
                stroke="#6b7280"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`$${value}`, 'Price']}
              />
              <Legend />
              <Bar 
                dataKey="price" 
                fill="#8b5cf6" 
                name="Price ($)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataInsights;