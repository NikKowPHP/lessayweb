ziro-health/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (marketing)/
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   └── contact/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   └── input/
│   │   ├── layout/                # Layout components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── navigation/
│   │   └── sections/              # Page sections
│   │       ├── hero/
│   │       ├── services/
│   │       └── testimonials/
│   │
│   ├── lib/                       # Utility functions
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── constants/
│   │
│   ├── styles/                    # Global styles
│   │   ├── animations.css
│   │   └── globals.css
│   │
│   ├── types/                     # TypeScript types
│   │   ├── common.ts
│   │   └── api.ts
│   │
│   ├── config/                    # Configuration files
│   │   ├── site.ts
│   │   └── navigation.ts
│   │
│   ├── services/                  # API services
│   │   ├── api.ts
│   │   └── endpoints.ts
│   │
│   └── context/                   # React Context
│       └── theme/
│
├── public/                        # Static files
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                         # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                       # GitHub specific files
│   └── workflows/                 # CI/CD workflows
│
├── scripts/                       # Build scripts
│
├── docs/                          # Documentation
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .env.local
├── .env.example
├── .gitignore
└── README.md