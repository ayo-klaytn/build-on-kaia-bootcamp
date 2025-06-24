import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const { address } = await params;
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');

  if (!network) {
    return NextResponse.json({ error: 'Network parameter is required' }, { status: 400 });
  }
console.log(`${network}/accounts/${address}`);
  try {
    const response = await fetch(`${network}/accounts/${address}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_KAIASCAN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching account data:', error);
    return NextResponse.json({ error: 'Failed to fetch account data' }, { status: 500 });
  }
} 