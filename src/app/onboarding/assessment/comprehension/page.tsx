'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AssessmentType } from '@/lib/types/onboardingTypes'
import { submitAssessment } from '@/store/slices/onboardingSlice'
import { ComprehensionAssessmentRequest, QuestionAnswer } from '@/lib/models/requests/assessments/AssessmentRequests'
import { ComprehensionQuestion } from '@/lib/models/responses/prompts/PromptResponses'
import AssessmentWrapper from '@/components/layout/AssessmentWrapper'
import YouTube, { YouTubePlayer } from 'react-youtube'
import { Icon } from '@iconify/react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ComprehensionAssessmentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { prompts, assessmentId } = useAppSelector((state) => state.onboarding)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoStartTime, setVideoStartTime] = useState<Date | null>(null)
  const [replayCount, setReplayCount] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(1)
  const playerRef = useRef<YouTubePlayer>(null)

  const prompt = prompts[AssessmentType.Comprehension]

  // Default video options with safe fallbacks
  const videoOptions = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      cc_load_policy: prompt?.video_settings?.show_subtitles ? 1 : 0,
      controls: prompt?.video_settings?.can_pause ? 1 : 0,
      enablejsapi: 1,
    },
  }

  // Loading state check
  if (!prompt) {
    return (
      <AssessmentWrapper type={AssessmentType.Comprehension}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading comprehension assessment...</p>
        </div>
      </AssessmentWrapper>
    )
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleVideoStart = () => {
    if (!videoStartTime) {
      setVideoStartTime(new Date())
    }
    setReplayCount(prev => prev + 1)
  }

  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed)
    if (playerRef.current?.internalPlayer) {
      playerRef.current.internalPlayer.setPlaybackRate(speed)
    }
  }

  const jumpToTimestamp = (seconds: number) => {
    if (playerRef.current?.getInternalPlayer()) {
      playerRef.current.getInternalPlayer().seekTo(seconds, true)
      playerRef.current.getInternalPlayer().playVideo()
    }
  }

  const isValidSubmission = () => {
    return prompt.questions.every((q: ComprehensionQuestion) => 
      answers[q.id]?.trim().length >= 20
    )
  }

  const handleSubmit = async () => {
    if (!isValidSubmission() || !prompt || !videoStartTime) {
      throw new Error('Invalid submission')
    }

    try {
      setIsSubmitting(true)

      const questionAnswers: QuestionAnswer[] = prompt.questions.map((question: ComprehensionQuestion) => ({
        questionId: question.id,
        answer: answers[question.id]
      }))

      const comprehensionRequest: ComprehensionAssessmentRequest = {
        assessmentId: assessmentId!,
        timestamp: new Date().toISOString(),
        difficulty_level: prompt.difficulty_level,
        youtube_video_id: prompt.youtube_video_id,
        duration: Math.floor((new Date().getTime() - videoStartTime.getTime()) / 1000),
        responses: questionAnswers,
      }

       dispatch(submitAssessment({
        type: AssessmentType.Comprehension,
        data: comprehensionRequest
      })).unwrap()

      router.push('/onboarding/assessment/complete')
    } catch (error) {
      console.error('Failed to submit comprehension assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AssessmentWrapper type={AssessmentType.Comprehension}>
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Instructions</h3>
          <p className="mt-1 text-sm text-blue-600">{prompt.instructions.before_video}</p>
        </div>

        {/* Video Section */}
        <div className="space-y-3">
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <YouTube
                videoId={prompt.youtube_video_id}
                opts={videoOptions}
                onReady={(event) => {
                  playerRef.current = event.target
                }}
                onPlay={handleVideoStart}
                className="w-full"
              />
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {prompt.questions.map((q: ComprehensionQuestion, index: number) => (
              <button
                key={q.id}
                onClick={() => jumpToTimestamp(q.timestamp_seconds)}
                className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 
                  rounded-full text-sm whitespace-nowrap"
              >
                <Icon icon="mdi:play-circle" className="mr-1" />
                Question {index + 1}
              </button>
            ))}
          </div>

          {/* Video Controls */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Playback Speed */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Speed:</span>
                <select 
                  value={currentSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {prompt.video_settings.playback_speed_options.map((speed: number) => (
                    <option key={speed} value={speed}>{speed}x</option>
                  ))}
                </select>
              </div>

              {/* Transcript Toggle */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Icon icon={showTranscript ? "mdi:text-box-minus" : "mdi:text-box-plus"} />
                <span>Transcript</span>
              </button>
            </div>

            {/* Replay Counter */}
            <div className="text-gray-600">
              Replays: {replayCount}/{prompt.video_settings.max_replays}
            </div>
          </div>

          {/* Transcript Panel */}
          {showTranscript && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              {prompt.transcript_segments.map((segment: { start_time: number; end_time: number; text: string }, index: number) => (
                <div 
                  key={index}
                  className="py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => jumpToTimestamp(segment.start_time)}
                >
                  <span className="text-sm text-gray-500">
                    {new Date(segment.start_time * 1000).toISOString().substr(14, 5)}
                  </span>
                  <p className="ml-2 text-gray-800">{segment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Questions with Progress */}
        <div className="space-y-6">
          {prompt.questions.map((question: ComprehensionQuestion, index: number) => (
            <div 
              key={question.id} 
              className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Question {index + 1} of {prompt.questions.length}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {question.difficulty}
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                {/* Question Input based on type */}
                {question.question_type === 'open_ended' && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 
                      focus:ring-primary focus:border-transparent min-h-[120px]"
                    placeholder="Write your answer here..."
                    disabled={isSubmitting}
                  />
                )}
                
                {/* Validation Message */}
                {answers[question.id]?.length > 0 && 
                 answers[question.id]?.length < 20 && (
                  <p className="text-sm text-yellow-600">
                    Please write a complete answer (minimum 20 characters)
                  </p>
                )}

                {/* Hint Section */}
                <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <Icon icon="mdi:lightbulb" className="inline mr-1" />
                    Hint: {question.hint}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValidSubmission() || isSubmitting || replayCount > prompt.video_settings.max_replays}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm 
            text-white bg-primary hover:bg-primary-dark focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary 
            disabled:bg-gray-400 disabled:cursor-not-allowed 
            transition-colors duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </AssessmentWrapper>
  )
}