import { SkillType } from '@/lib/types/learningPath'
import { 
  SpeakerWaveIcon, 
  BookOpenIcon,
  PencilIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'

export function getSkillColor(skill: SkillType): string {
  const colors = {
    pronunciation: 'blue',
    grammar: 'green',
    vocabulary: 'purple',
    comprehension: 'orange'
  }
  return colors[skill]
}

export function getSkillIcon(skill: SkillType) {
  const icons = {
    pronunciation: SpeakerWaveIcon,
    grammar: PencilIcon,
    vocabulary: BookOpenIcon,
    comprehension: MusicalNoteIcon
  }
  return icons[skill]

  
}