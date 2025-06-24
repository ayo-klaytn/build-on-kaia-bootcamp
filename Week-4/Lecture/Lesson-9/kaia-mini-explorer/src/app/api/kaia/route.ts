import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');

  try {
    // Fetch Kaia price data
    const priceResponse = await fetch(`${network}/kaia`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_KAIASCAN_API_KEY}`,
      },
    });
    const priceData = await priceResponse.json();

    return NextResponse.json({
      price: parseFloat(priceData.klay_price.usd_price),
      marketCap: parseFloat(priceData.klay_price.market_cap),
      volume24h: parseFloat(priceData.klay_price.volume),
      totalSupply: parseFloat(priceData.klay_price.total_supply),
    });
  } catch (error) {
    console.error('Error fetching Kaia data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 