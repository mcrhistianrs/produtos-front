module.exports = (req, res, next) => {
  // POST /orders endpoint needs special handling for stock validation
  if (req.method === 'POST' && req.path === '/orders') {
    const db = req.app.db;
    const { items } = req.body;

    // Check if we have items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Orders must have at least one item' });
    }

    // Check stock for each product
    for (const item of items) {
      const product = db.get('products').find({ id: item.productId }).value();
      
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      if (product.quantityInStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }
    }
    
    // Update stock for each product
    for (const item of items) {
      const product = db.get('products').find({ id: item.productId }).value();
      db.get('products')
        .find({ id: item.productId })
        .assign({ quantityInStock: product.quantityInStock - item.quantity })
        .write();
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Add custom fields to the order
    req.body.total = total;
    req.body.status = 'pending';
    req.body.createdAt = new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
  }

  // Handle PATCH /orders/:id/status separately
  if (req.method === 'PATCH' && /^\/orders\/\w+\/status$/.test(req.path)) {
    const orderIdMatch = req.path.match(/^\/orders\/(\w+)\/status$/);
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      const db = req.app.db;
      const order = db.get('orders').find({ id: orderId }).value();
      
      if (!order) {
        return res.status(404).json({ message: `Order with ID ${orderId} not found` });
      }
      
      const { status } = req.body;
      
      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      
      // Update the order status
      const updatedOrder = { 
        ...order,
        status,
        updatedAt: new Date().toISOString()
      };
      
      db.get('orders')
        .find({ id: orderId })
        .assign(updatedOrder)
        .write();
      
      return res.json(updatedOrder);
    }
  }

  // Continue normal processing for other routes
  next();
}; 