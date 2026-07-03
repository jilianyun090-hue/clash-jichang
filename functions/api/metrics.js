export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const startAt   = searchParams.get('startAt');
  const endAt     = searchParams.get('endAt');
  let type        = searchParams.get('type') || 'url';
  const limit     = searchParams.get('limit') || '10';
  const shareId   = 'uP64pEjWUtGCCMS3';

  // Map 'url' to 'path' for Umami Cloud v3 compatibility
  if (type === 'url') {
    type = 'path';
  }

  try {
    // 1. Get share token and website ID dynamically
    const shareRes = await fetch(`https://cloud.umami.is/analytics/us/api/share/${shareId}`);
    if (!shareRes.ok) {
      throw new Error(`Failed to fetch share token: ${shareRes.status}`);
    }
    const { token, websiteId } = await shareRes.json();

    // 2. Fetch metrics from Umami Cloud using share headers
    const res = await fetch(
      `https://cloud.umami.is/analytics/us/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=${type}&limit=${limit}`,
      {
        headers: {
          'x-umami-share-token': token,
          'x-umami-share-context': '1'
        }
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Umami API ${res.status}: ${errText}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
