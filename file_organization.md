src/
├── app
│   ├── auth
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── learning
│   │   ├── assessment
│   │   │   └── page.tsx
│   │   └── path
│   │       └── page.tsx
│   ├── onboarding
│   │   ├── assessment
│   │   │   ├── complete
│   │   │   │   └── page.tsx
│   │   │   ├── intro
│   │   │   │   └── page.tsx
│   │   │   └── question
│   │   │       └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
├── components
│   ├── assessment
│   │   ├── AssessmentProgress.tsx
│   │   ├── ComprehensionAssessment.tsx
│   │   ├── GrammarAssessment.tsx
│   │   ├── Progress.tsx
│   │   ├── PronunciationAssessment.tsx
│   │   ├── Question.tsx
│   │   ├── Recording.tsx
│   │   ├── Result.tsx
│   │   └── VocabularyAssessment.tsx
│   ├── auth
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── SocialLogin.tsx
│   ├── Footer.tsx
│   ├── layout
│   │   └── Layout.tsx
│   ├── learning
│   │   ├── Exercise.tsx
│   │   ├── LearningPath.tsx
│   │   ├── LearningStep.tsx
│   │   └── Progress.tsx
│   ├── Navbar.tsx
│   └── ui
│       ├── Alert.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       ├── Modal.tsx
│       └── Select.tsx
├── config
│   └── navigation.ts
├── constants
│   ├── api.ts
│   ├── languages.ts
│   └── routes.ts
├── context
│   ├── AuthContext.ts
│   ├── LearningContext.ts
│   └── UserContext.ts
├── hooks
│   ├── useAuth.ts
│   ├── useLearning.ts
│   ├── useOnboarding.ts
│   └── useRecording.ts
├── lib
│   ├── api
│   │   ├── Api.ts
│   │   ├── AuthApi.ts
│   │   ├── interfaces
│   │   │   ├── IAuthApi.ts
│   │   │   ├── ILearningApi.ts
│   │   │   ├── IOnboardingApi.ts
│   │   │   └── IUserApi.ts
│   │   ├── LearningApi.ts
│   │   ├── mock
│   │   │   ├── MockAuthApi.ts
│   │   │   ├── MockLearningApi.ts
│   │   │   ├── MockOnboardingApi.ts
│   │   │   └── MockUserApi.ts
│   │   ├── MockAuthApi.ts
│   │   ├── MockOnboardingApi.ts
│   │   ├── OnboardingApi.ts
│   │   └── UserApi.ts
│   ├── models
│   │   ├── assessments
│   │   │   ├── AssessmentBase.ts
│   │   │   ├── ComprehensionAssessment.ts
│   │   │   ├── GrammarAssessment.ts
│   │   │   ├── PronunciationAssessment.ts
│   │   │   └── VocabularyAssessment.ts
│   │   ├── requests
│   │   │   ├── assessments
│   │   │   │   ├── ComprehensionRequest.ts
│   │   │   │   ├── GrammarRequest.ts
│   │   │   │   ├── PronunciationRequest.ts
│   │   │   │   └── VocabularyRequest.ts
│   │   │   ├── AuthRequests.ts
│   │   │   ├── LearningRequests.ts
│   │   │   ├── OnboardingRequests.ts
│   │   │   └── UserRequests.ts
│   │   └── responses
│   │       ├── assessments
│   │       │   ├── ComprehensionResponse.ts
│   │       │   ├── GrammarResponse.ts
│   │       │   ├── PronunciationResponse.ts
│   │       │   └── VocabularyResponse.ts
│   │       ├── AuthResponses.ts
│   │       ├── LearningResponses.ts
│   │       ├── OnboardingResponses.ts
│   │       └── UserResponses.ts
│   ├── types
│   │   ├── assessment.ts
│   │   ├── auth.ts
│   │   ├── languages.ts
│   │   ├── learning.ts
│   │   └── user.ts
│   └── utils
│       └── cn.ts
├── pages
│   └── _app.tsx
├── providers
│   └── ErrorProvider.tsx
├── services
│   ├── authService.ts
│   ├── learningService.ts
│   ├── onboardingService.ts
│   └── userService.ts
├── store
│   ├── hooks.ts
│   ├── index.ts
│   ├── provider.tsx
│   └── slices
│       ├── authSlice.ts
│       ├── learningSlice.ts
│       ├── onboardingSlice.ts
│       └── userSlice.ts
├── styles
│   └── globals.css
├── types
│   └── auth.ts
└── utils
    ├── api.ts
    ├── formatting.ts
    ├── storage.ts
    └── validation.ts