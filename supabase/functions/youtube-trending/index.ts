import { corsHeaders } from '@supabase/supabase-js/cors'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('YOUTUBE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'YOUTUBE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const regionCode = url.searchParams.get('regionCode') || 'IN'
    const maxResults = url.searchParams.get('maxResults') || '12'
    const videoCategoryId = url.searchParams.get('categoryId') || '24' // 24 = Entertainment

    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode,
      maxResults,
      videoCategoryId,
      key: apiKey,
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('YouTube API error:', JSON.stringify(data))
      return new Response(
        JSON.stringify({ error: 'YouTube API error', details: data.error?.message }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform to a lighter format for the frontend
    const videos = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title,
      channelTitle: item.snippet?.channelTitle,
      channelId: item.snippet?.channelId,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
      publishedAt: item.snippet?.publishedAt,
      viewCount: item.statistics?.viewCount,
      likeCount: item.statistics?.likeCount,
      commentCount: item.statistics?.commentCount,
      duration: item.contentDetails?.duration,
      tags: item.snippet?.tags?.slice(0, 5),
    }))

    return new Response(
      JSON.stringify({ videos, totalResults: data.pageInfo?.totalResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
