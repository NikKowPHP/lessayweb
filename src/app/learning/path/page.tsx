'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { 
  selectCurrentPath, 
  selectCurrentExercise,
  selectSkillLevels,
  selectUIState,
  selectIsLoading,
  setCurrentExercise,
  toggleSectionExpanded,
  toggleExerciseBookmark
} from '@/store/slices/learningSlice'
import { SkillProgress } from './components/SkillProgress'
import { ExerciseCard } from './components/ExerciseCard'
import { ChallengeCard } from './components/ChallengeCard'
import { ProgressOverview } from './components/ProgressOverview'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Section } from '@/components/ui/Section'
import { SkillType } from '@/lib/types/learningPath'

export default function LearningPathPage() {
  const dispatch = useAppDispatch()
  const currentPath = useAppSelector(selectCurrentPath)
  const currentExercise = useAppSelector(selectCurrentExercise)
  const skillLevels = useAppSelector(selectSkillLevels)
  const uiState = useAppSelector(selectUIState)
  const isLoading = useAppSelector(selectIsLoading)

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Handle no path state
  if (!currentPath) {
    return (
      <ErrorAlert 
        title="No Learning Path Found"
        message="Please complete the assessment to generate your personalized learning path."
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Learning Journey
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Current Level: {currentPath.currentLevel} → Target Level: {currentPath.targetLevel}
        </p>
      </header>

      {/* Skills Overview */}
      <Section
        title="Skills Progress"
        expanded={uiState.expandedSections.includes('skills')}
        onToggle={() => dispatch(toggleSectionExpanded('skills'))}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(currentPath.skills).map(([skill, data]) => (
            <SkillProgress
              key={skill}
              skill={skill as SkillType}
              currentLevel={data.currentLevel}
              targetLevel={data.targetLevel}
              criticalPoints={data.criticalPoints}
            />
          ))}
        </div>
      </Section>

      {/* Current Progress */}
      <Section
        title="Progress Overview"
        expanded={uiState.expandedSections.includes('progress')}
        onToggle={() => dispatch(toggleSectionExpanded('progress'))}
      >
        <ProgressOverview
          overall={currentPath.progress.overall}
          bySkill={currentPath.progress.bySkill}
          exercises={currentPath.progress.exercises}
          streak={currentPath.progress.streak}
        />
      </Section>

      {/* Critical Exercises */}
      <Section
        title="Critical Focus Areas"
        expanded={uiState.expandedSections.includes('critical')}
        onToggle={() => dispatch(toggleSectionExpanded('critical'))}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPath.exercises.critical.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isBookmarked={uiState.bookmarkedExercises.includes(exercise.id)}
              isActive={currentExercise?.id === exercise.id}
              onSelect={() => dispatch(setCurrentExercise(exercise))}
              onBookmark={() => dispatch(toggleExerciseBookmark(exercise.id))}
            />
          ))}
        </div>
      </Section>

      {/* Current Challenges */}
      <Section
        title="Active Challenges"
        expanded={uiState.expandedSections.includes('challenges')}
        onToggle={() => dispatch(toggleSectionExpanded('challenges'))}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentPath.challenges.current.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              skillLevels={skillLevels}
            />
          ))}
        </div>
      </Section>

      {/* Recommended Practice */}
      <Section
        title="Recommended Practice"
        expanded={uiState.expandedSections.includes('recommended')}
        onToggle={() => dispatch(toggleSectionExpanded('recommended'))}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPath.exercises.recommended.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isBookmarked={uiState.bookmarkedExercises.includes(exercise.id)}
              isActive={currentExercise?.id === exercise.id}
              onSelect={() => dispatch(setCurrentExercise(exercise))}
              onBookmark={() => dispatch(toggleExerciseBookmark(exercise.id))}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}