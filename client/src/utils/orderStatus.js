/** Ink tag classes for an order status: teal only once an order is delivered. */
export const orderStatusTag = (status) => `tag capitalize ${status === 'delivered' ? 'tag-in' : status === 'cancelled' ? 'tag-out' : ''}`.trim();
