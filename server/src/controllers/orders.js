import { createError } from '../middleware/errorHandler.js';

const addressFields = ['full_name', 'phone', 'address_line1', 'city', 'state', 'postal_code', 'country'];

function validateAddress(address) {
  if (!address || typeof address !== 'object') throw createError(400, 'Delivery address is required. Please complete all required address fields.');
  for (const field of addressFields) {
    if (!String(address[field] || '').trim()) throw createError(400, `Delivery ${field.replaceAll('_', ' ')} is required. Please complete the address and try again.`);
  }
  return Object.fromEntries([...addressFields, 'address_line2'].map((field) => [field, String(address[field] || '').trim() || null]));
}

function orderNumber() {
  return `HRD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function createOrder(req, res, next) {
  try {
    const shippingAddress = validateAddress(req.body.shipping_address);
    const { data: cartItems, error: cartError } = await req.supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(id, name, price, stock_quantity, is_active)')
      .eq('user_id', req.user.id);

    if (cartError) throw cartError;
    if (!cartItems?.length) throw createError(400, 'Your cart is empty. Add an item before placing an order.');

    for (const item of cartItems) {
      if (!item.products?.is_active || item.quantity > item.products.stock_quantity) {
        throw createError(400, `${item.products?.name || 'An item'} is no longer available in the requested quantity. Review your cart and try again.`);
      }
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.products.price) * item.quantity, 0);
    const { data: order, error: orderError } = await req.supabase
      .from('orders')
      .insert({ user_id: req.user.id, order_number: orderNumber(), subtotal, discount_amount: 0, total: subtotal, payment_method: 'cod', shipping_address: shippingAddress })
      .select()
      .single();

    if (orderError) throw orderError;
    const orderItems = cartItems.map((item) => ({ order_id: order.id, product_id: item.product_id, quantity: item.quantity, unit_price: item.products.price, total_price: Number(item.products.price) * item.quantity }));
    const { error: itemsError } = await req.supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    const { error: clearError } = await req.supabase.from('cart_items').delete().eq('user_id', req.user.id);
    if (clearError) throw clearError;
    res.status(201).json({ order, message: 'Your order has been placed.' });
  } catch (error) { next(error); }
}

export async function getOrders(req, res, next) {
  try {
    const { data, error } = await req.supabase.from('orders').select('*, order_items(id, quantity, unit_price, total_price, products(id, name, slug, images))').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ orders: data || [] });
  } catch (error) { next(error); }
}

export async function getOrder(req, res, next) {
  try {
    const orderId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId)) throw createError(400, 'Order could not be identified. Refresh the page and try again.');
    const { data, error } = await req.supabase.from('orders').select('*, order_items(id, quantity, unit_price, total_price, products(id, name, slug, images))').eq('id', orderId).eq('user_id', req.user.id).single();
    if (error || !data) throw createError(404, 'That order was not found. Check your order history and try again.');
    res.json({ order: data });
  } catch (error) { next(error); }
}
