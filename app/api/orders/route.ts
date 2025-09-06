import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/database/supabase-server';
import { OrderSchema } from '@/types/types';
import { createOrderNotification } from '@/lib/utils/notifications';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const orderData = OrderSchema.parse(json);

    const orderNumber = `RH${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const { data: product, error: productError } = await supabaseServer
      .from('products')
      .select('id, name, price')
      .eq('id', orderData.productId)
      .single();

    if (productError) throw productError;
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const shippingCharge = 0;
    const unitPrice = Number(product.price);
    const totalAmount = unitPrice * orderData.quantity + shippingCharge;

    // Check if customer exists
    let { data: existingCustomer } = await supabaseServer
      .from('customers')
      .select('*')
      .eq('mobile_number', orderData.mobileNumber)
      .single();

    let isNewCustomer = false;

    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabaseServer
        .from('customers')
        .update({
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + totalAmount,
          last_order_date: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select('*')
        .single();

      if (updateError) throw updateError;
      existingCustomer = updatedCustomer;
    } else {
      // Create new customer
      isNewCustomer = true;
      const { data: newCustomer, error: customerError } = await supabaseServer
        .from('customers')
        .insert({
          full_name: orderData.fullName,
          mobile_number: orderData.mobileNumber,
          full_address: orderData.fullAddress,
          total_orders: 1,
          total_spent: totalAmount,
          last_order_date: new Date().toISOString()
        })
        .select('*')
        .single();

      if (customerError) throw customerError;
      existingCustomer = newCustomer;
    }

    // Create order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        order_number: orderNumber,
        full_name: orderData.fullName,
        mobile_number: orderData.mobileNumber,
        full_address: orderData.fullAddress,
        product_name: product.name,
        product_id: orderData.productId,
        quantity: orderData.quantity,
        unit_price: unitPrice,
        shipping_charge: shippingCharge,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select('*')
      .single();

    if (orderError) throw orderError;

    // Create notification
    await createOrderNotification(order, existingCustomer, isNewCustomer);

    return NextResponse.json({
      orderNumber,
      order: order,
      customer: existingCustomer
    });
  } catch (e) {
    console.error('Order creation failed:', e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

