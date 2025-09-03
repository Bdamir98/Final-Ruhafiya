// GTM Events and Triggers Utility
// This file contains custom GTM events and triggers for better tracking

// GTM dataLayer safe push
const dataLayerPush = (data: any) => {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push(data);
    }
  } catch (error) {
    console.warn('GTM dataLayer push failed:', error);
  }
};

// E-commerce Events
export const gtmEvents = {
  // Product View Events
  viewProduct: (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    dataLayerPush({
      event: 'view_item',
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          category: product.category || 'product',
          quantity: 1
        }]
      }
    });
  },

  // Add to Cart Events
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }) => {
    dataLayerPush({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'BDT',
        value: product.price * (product.quantity || 1),
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1
        }]
      }
    });
  },

  // Checkout Events
  beginCheckout: (items: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>) => {
    const totalValue = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    dataLayerPush({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'BDT',
        value: totalValue,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        }))
      }
    });
  },

  // Purchase Events
  purchase: (orderData: {
    transactionId: string;
    value: number;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity?: number;
    }>;
  }) => {
    dataLayerPush({
      event: 'purchase',
      ecommerce: {
        transaction_id: orderData.transactionId,
        currency: 'BDT',
        value: orderData.value,
        items: orderData.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        }))
      }
    });
  },

  // Lead Generation Events
  leadGeneration: (leadData: {
    method: string;
    formType?: string;
    value?: number;
  }) => {
    dataLayerPush({
      event: 'generate_lead',
      lead_method: leadData.method,
      form_type: leadData.formType || 'contact',
      lead_value: leadData.value || 0
    });
  },

  // User Engagement Events
  userEngagement: (engagementData: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }) => {
    dataLayerPush({
      event: 'user_engagement',
      event_category: engagementData.category,
      event_action: engagementData.action,
      event_label: engagementData.label,
      event_value: engagementData.value
    });
  },

  // Scroll Tracking
  scrollDepth: (depth: number) => {
    dataLayerPush({
      event: 'scroll',
      scroll_depth: depth
    });
  },

  // Time on Page
  timeOnPage: (timeSpent: number, pagePath: string) => {
    dataLayerPush({
      event: 'time_on_page',
      time_spent: timeSpent,
      page_path: pagePath
    });
  },

  // Social Media Interactions
  socialInteraction: (network: string, action: string, target: string) => {
    dataLayerPush({
      event: 'social_interaction',
      social_network: network,
      social_action: action,
      social_target: target
    });
  },

  // Video Tracking
  videoInteraction: (videoData: {
    action: 'play' | 'pause' | 'complete';
    video_title: string;
    video_url?: string;
    video_duration?: number;
    video_current_time?: number;
  }) => {
    dataLayerPush({
      event: 'video_interaction',
      video_action: videoData.action,
      video_title: videoData.video_title,
      video_url: videoData.video_url,
      video_duration: videoData.video_duration,
      video_current_time: videoData.video_current_time
    });
  }
};

// Custom Triggers (these can be used with GTM triggers)
export const gtmTriggers = {
  // Form interaction triggers
  formStart: (formId: string, formName: string) => {
    dataLayerPush({
      event: 'form_start',
      form_id: formId,
      form_name: formName
    });
  },

  formSubmit: (formId: string, formName: string) => {
    dataLayerPush({
      event: 'form_submit',
      form_id: formId,
      form_name: formName
    });
  },

  formAbandon: (formId: string, formName: string, step: number) => {
    dataLayerPush({
      event: 'form_abandon',
      form_id: formId,
      form_name: formName,
      form_step: step
    });
  },

  // Button click triggers
  buttonClick: (buttonData: {
    button_text: string;
    button_location: string;
    button_type?: string;
  }) => {
    dataLayerPush({
      event: 'button_click',
      button_text: buttonData.button_text,
      button_location: buttonData.button_location,
      button_type: buttonData.button_type || 'primary'
    });
  },

  // Error tracking
  errorEvent: (errorData: {
    error_type: string;
    error_message: string;
    error_location?: string;
  }) => {
    dataLayerPush({
      event: 'error_occurred',
      error_type: errorData.error_type,
      error_message: errorData.error_message,
      error_location: errorData.error_location
    });
  },

  // Search tracking
  searchPerformed: (searchData: {
    search_term: string;
    search_results_count?: number;
    search_type?: string;
  }) => {
    dataLayerPush({
      event: 'search',
      search_term: searchData.search_term,
      search_results_count: searchData.search_results_count,
      search_type: searchData.search_type || 'general'
    });
  }
};

export default { gtmEvents, gtmTriggers };
