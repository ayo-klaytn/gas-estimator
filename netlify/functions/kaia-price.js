// netlify/functions/kaia-price.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!process.env.KAIASCAN_API_TOKEN) {
      throw new Error('KAIASCAN_API_TOKEN is not configured');
    }

    const response = await fetch('https://mainnet-oapi.kaiascan.io/api/v1/kaia', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${process.env.KAIASCAN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kaiascan API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const price = data.klay_price.usd_price;
    
    if (!price || isNaN(price) || price <= 0) {
      throw new Error(`Invalid price data: ${price}`);
    }
    
    const validatedPrice = parseFloat(price);
    console.log(`✅ KAIA price: $${validatedPrice}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        price: validatedPrice,
        source: 'kaiascan',
        timestamp: new Date().toISOString(),
        success: true,
        market_data: {
          usd_price: data.usd_price,
          btc_price: data.btc_price,
          usd_price_changes: data.usd_price_changes,
          market_cap: data.market_cap,
          volume: data.volume,
          total_supply: data.total_supply
        }
      }),
    };
    
  } catch (error) {
    console.error('❌ Error fetching KAIA price:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch KAIA price',
        message: error.message,
        source: 'error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};