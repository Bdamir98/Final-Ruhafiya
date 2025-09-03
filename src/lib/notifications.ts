import { supabaseServer } from '@/lib/supabase-server';

// Notification utility functions
export async function createNotification(type: string, title: string, message: string, data?: any) {
  try {
    const { data: notification, error } = await supabaseServer
      .from('notifications')
      .insert({
        type,
        title,
        message,
        data,
        is_read: false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating notification:', error);
    } else {
      console.log('Notification created:', notification);
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export async function createOrderNotification(orderData: any, customerData: any, isNewCustomer: boolean) {
  const title = `নতুন অর্ডার #${orderData.order_number}`;
  const customerInfo = `${customerData.full_name} - ${customerData.mobile_number}`;
  const productInfo = `পণ্য: ${orderData.product_name} - ${orderData.quantity} টি`;
  const amountInfo = `মোট: ৳${orderData.total_amount}`;
  const addressInfo = `ঠিকানা: ${customerData.full_address}`;
  const customerStatus = isNewCustomer ? 'নতুন গ্রাহক' : `গ্রাহক #${customerData.id} (${customerData.total_orders}টি অর্ডার)`;

  const message = `${customerInfo}\n${productInfo}\n${amountInfo}\n${addressInfo}\n${customerStatus}`;

  return await createNotification('order', title, message, {
    order_id: orderData.id,
    customer_id: customerData.id,
    order_number: orderData.order_number,
    total_amount: orderData.total_amount
  });
}

export async function createProductNotification(action: 'created' | 'updated' | 'deleted', productData: any) {
  let title, message;

  switch (action) {
    case 'created':
      title = `নতুন পণ্য যোগ করা হয়েছে`;
      message = `পণ্য: ${productData.name}\nমূল্য: ৳${productData.price}\nস্টক: ${productData.stock_quantity} টি`;
      break;
    case 'updated':
      title = `পণ্য আপডেট করা হয়েছে`;
      message = `পণ্য: ${productData.name}\nনতুন মূল্য: ৳${productData.price}\nস্টক: ${productData.stock_quantity} টি`;
      break;
    case 'deleted':
      title = `পণ্য মুছে ফেলা হয়েছে`;
      message = `পণ্য: ${productData.name}`;
      break;
  }

  return await createNotification('product', title, message, {
    product_id: productData.id,
    action
  });
}

export async function createUserNotification(action: 'created' | 'updated' | 'deleted', userData: any) {
  let title, message;

  switch (action) {
    case 'created':
      title = `নতুন অ্যাডমিন ব্যবহারকারী যোগ করা হয়েছে`;
      message = `নাম: ${userData.name}\nইমেইল: ${userData.email}`;
      break;
    case 'updated':
      title = `অ্যাডমিন ব্যবহারকারী আপডেট করা হয়েছে`;
      message = `নাম: ${userData.name}\nইমেইল: ${userData.email}`;
      break;
    case 'deleted':
      title = `অ্যাডমিন ব্যবহারকারী মুছে ফেলা হয়েছে`;
      message = `নাম: ${userData.name || 'Unknown'}\nইমেইল: ${userData.email || 'Unknown'}`;
      break;
  }

  return await createNotification('user', title, message, {
    user_id: userData.id,
    action
  });
}
