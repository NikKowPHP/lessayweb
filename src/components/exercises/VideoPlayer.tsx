'use client'

import { useEffect, useRef } from 'react'
import YouTube, { YouTubePlayer } from 'react-youtube'
import { VideoContent } from '@/lib/types/exercises'
import { Icon } from '@iconify/react'

interface VideoPlayerProps {
  video: VideoContent
  onProgress: (time: number) => void
  playbackSpeed: number
}

export function VideoPlayer({ video, onProgress, playbackSpeed }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer>(null)

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(playbackSpeed)
    }
  }, [playbackSpeed])

  const videoOptions = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      enablejsapi: 1,
    },
  }

  const handleReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
    event.target.setPlaybackRate(playbackSpeed)
  }

  const handleStateChange = (event: { target: YouTubePlayer; data: number }) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      const updateProgress = () => {
        if (playerRef.current) {
          onProgress(playerRef.current.getCurrentTime())
        }
      }
      // Update progress every second while playing
      const intervalId = setInterval(updateProgress, 1000)
      return () => clearInterval(intervalId)
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <YouTube
        videoId={video.videoId}
        opts={videoOptions}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="w-full aspect-video"
      />
      
      {/* Highlights indicator */}
      {video.highlights.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/75 text-white p-2">
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:lightbulb" className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">
              {video.highlights.length} key moments highlighted
            </span>
          </div>
        </div>
      )}
    </div>
  )
}