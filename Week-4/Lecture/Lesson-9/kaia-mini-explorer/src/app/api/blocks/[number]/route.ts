import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { number: string } }
) {
  const { number: blockNumber } = await params
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');

  try {
    const response = await fetch(`${network}/blocks/${blockNumber}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_KAIASCAN_API_KEY}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching block data:', error);
    return NextResponse.json({ error: 'Failed to fetch block data' }, { status: 500 });
  }
} 