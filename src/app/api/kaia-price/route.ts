// src/app/api/kaia-price/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.KAIASCAN_API_TOKEN) {
      console.error('KAIASCAN_API_TOKEN is not configured in environment variables');
      throw new Error('KAIASCAN_API_TOKEN is not configured');
    }

    console.log('Attempting to fetch KAIA price from Kaiascan API...');

    const response = await fetch('https://mainnet-oapi.kaiascan.io/api/v1/kaia', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${process.env.KAIASCAN_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Kaiascan API HTTP Error: ${response.status} - ${errorText}`);
      throw new Error(`Kaiascan API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Kaiascan API Raw Response:', JSON.stringify(data, null, 2));
    
    const price = data.klay_price.usd_price;
    
    if (price === undefined || price === null) {
      console.error('Price field (usd_price) is missing from API response');
      throw new Error('Price field (usd_price) is missing from API response');
    }
    
    if (isNaN(price) || price <= 0) {
      console.error(`Invalid price value: ${price}`);
      throw new Error(`Invalid price data: ${price}`);
    }
    
    const validatedPrice = parseFloat(price);
    console.log(`✅ Successfully fetched KAIA price: $${validatedPrice} from Kaiascan`);
    
    return NextResponse.json({ 
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
    });
    
  } catch (error) {
    console.error('❌ Error fetching KAIA price from Kaiascan:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch KAIA price',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        source: 'error',
        timestamp: new Date().toISOString(),
        debug_info: {
          has_api_token: !!process.env.KAIASCAN_API_TOKEN,
          api_endpoint: 'https://mainnet-oapi.kaiascan.io/api/v1/kaia'
        }
      },
      { status: 500 }
    );
  }
}