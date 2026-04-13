const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Fetch the public spotifycharts.com page
    const response = await fetch('https://charts.spotify.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch charts page:', response.status)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Spotify Charts', status: response.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const html = await response.text()

    // Parse chart entries from the HTML
    // The page has a structured list with album art, rank, song name, artist, and Spotify links
    const tracks: any[] = []

    // Match patterns like: track entries with images, titles, artists, and spotify links
    // Pattern: album art img -> rank number -> movement -> song title -> artist links
    const trackPattern = /<img[^>]*src="(https:\/\/i\.scdn\.co\/image\/[^"]+)"[^>]*>[\s\S]*?<\/a>\s*<\/td>\s*<td[^>]*>\s*(\d+)\s*<\/td>[\s\S]*?<td[^>]*>[\s\S]*?<a[^>]*href="(https:\/\/open\.spotify\.com\/track\/[^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<a[^>]*href="(https:\/\/open\.spotify\.com\/artist\/[^"]+)"[^>]*>([^<]+)<\/a>/gi

    let match
    while ((match = trackPattern.exec(html)) !== null) {
      tracks.push({
        albumArt: match[1],
        rank: parseInt(match[2]),
        trackUrl: match[3],
        title: match[4].trim(),
        artistUrl: match[5],
        artist: match[6].trim(),
      })
    }

    // If regex didn't work on the rendered HTML, try a simpler approach
    // Parse from meta/JSON data or simpler patterns
    if (tracks.length === 0) {
      // Try to find Next.js/React hydration data
      const jsonMatch = html.match(/__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/i)
      if (jsonMatch) {
        try {
          const nextData = JSON.parse(jsonMatch[1])
          console.log('Found Next.js data')
        } catch (e) {
          console.log('Could not parse Next.js data')
        }
      }

      // Fallback: extract from simpler HTML patterns
      // Look for spotify track/artist URLs and nearby text
      const simplePattern = /href="(https:\/\/open\.spotify\.com\/track\/[^"]+)"[^>]*>\s*([^<]+)/gi
      const artistPattern = /href="(https:\/\/open\.spotify\.com\/artist\/[^"]+)"[^>]*>\s*([^<]+)/gi
      const imgPattern = /src="(https:\/\/i\.scdn\.co\/image\/ab67616d00001e02[^"]+)"/gi

      const songMatches = [...html.matchAll(/href="(https:\/\/open\.spotify\.com\/track\/[^"]+)"[^>]*>/gi)]
      const artistMatches = [...html.matchAll(/href="(https:\/\/open\.spotify\.com\/artist\/[^"]+)"[^>]*>\s*([^<]+)/gi)]
      const imgMatches = [...html.matchAll(/src="(https:\/\/i\.scdn\.co\/image\/ab67616d00001e02[^"]+)"/gi)]

      // Build tracks from positional matching
      for (let i = 0; i < Math.min(songMatches.length, 10); i++) {
        const trackUrl = songMatches[i][1]
        const artist = artistMatches[i] ? artistMatches[i][2].trim() : 'Unknown'
        const artistUrl = artistMatches[i] ? artistMatches[i][1] : ''
        const albumArt = imgMatches[i] ? imgMatches[i][1] : ''

        // Try to extract song title near the track link
        const trackIndex = songMatches[i].index || 0
        const nearbyText = html.substring(Math.max(0, trackIndex - 200), trackIndex + 200)
        
        // Look for visible text that could be the title
        const titleMatch = nearbyText.match(/>([^<]{2,60})<\//)
        
        tracks.push({
          rank: i + 1,
          albumArt,
          trackUrl,
          title: titleMatch ? titleMatch[1].trim() : `Track ${i + 1}`,
          artist,
          artistUrl,
        })
      }
    }

    // If still no tracks, return the raw structure info for debugging
    if (tracks.length === 0) {
      // Extract whatever structured data we can find
      const allSpotifyLinks = [...html.matchAll(/https:\/\/open\.spotify\.com\/(track|artist)\/([a-zA-Z0-9]+)/g)]
      console.log(`Found ${allSpotifyLinks.length} Spotify links total in page`)
      
      // Return a helpful error
      return new Response(
        JSON.stringify({ 
          tracks: [],
          chartTitle: 'Weekly Top Songs Global',
          source: 'charts.spotify.com',
          note: 'Chart data requires authentication for detailed access',
          linksFound: allSpotifyLinks.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        tracks,
        chartTitle: 'Weekly Top Songs Global',
        source: 'charts.spotify.com',
        updatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Spotify charts error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
