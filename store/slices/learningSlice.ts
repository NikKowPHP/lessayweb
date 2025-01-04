import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressMetrics {
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  comprehension: number;
  fluency: number;
}

interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'locked' | 'current' | 'completed';
  progressMetrics?: ProgressMetrics;
}

interface LearningState {
  currentPath: {
    id: string | null;
    steps: LearningStep[];
    progressMetrics: ProgressMetrics;
  };
  currentStepId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  currentPath: {
    id: null,
    steps: [],
    progressMetrics: {
      pronunciation: 0,
      grammar: 0,
      vocabulary: 0,
      comprehension: 0,
      fluency: 0,
    },
  },
  currentStepId: null,
  loading: false,
  error: null,
};

export const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setLearningPath: (state, action: PayloadAction<{ id: string; steps: LearningStep[] }>) => {
      state.currentPath.id = action.payload.id;
      state.currentPath.steps = action.payload.steps;
    },
    updateProgressMetrics: (state, action: PayloadAction<ProgressMetrics>) => {
      state.currentPath.progressMetrics = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStepId = action.payload;
    },
    updateStepStatus: (state, action: PayloadAction<{ stepId: string; status: LearningStep['status'] }>) => {
      const step = state.currentPath.steps.find(s => s.id === action.payload.stepId);
      if (step) {
        step.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLearningPath,
  updateProgressMetrics,
  setCurrentStep,
  updateStepStatus,
  setLoading,
  setError,
} = learningSlice.actions;

export default learningSlice.reducer; 