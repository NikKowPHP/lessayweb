import { SkillType } from '@/lib/types/learningPath'
import { 
  SpeakerWaveIcon, 
  BookOpenIcon,
  PencilIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline'
import { BadgeProps } from '@/components/ui/Badge'

export function getSkillColor(skill: SkillType): BadgeProps['color'] {
  const colors: Record<SkillType, BadgeProps['color']> = {
    pronunciation: 'blue',
    grammar: 'green',
    vocabulary: 'purple',
    comprehension: 'yellow'
  }
  return colors[skill]
}

export function getSkillIcon(skill: SkillType) {
  const icons = {
    pronunciation: SpeakerWaveIcon,
    grammar: PencilIcon,
    vocabulary: BookOpenIcon,
    comprehension: AcademicCapIcon
  }
  return icons[skill]
}