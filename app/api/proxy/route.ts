import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json({ error: 'Feed URL is required' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Frontpage-Reader/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
     
      throw new Error(`Feed fetch failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);

    return NextResponse.json(feed);
  } catch (error) {
    console.error('RSS Proxy Error:', error);
    
    const errorMessage = error instanceof Error && error.name === 'AbortError' 
      ? 'Feed request timed out' 
      : 'Failed to fetch or parse feed';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}