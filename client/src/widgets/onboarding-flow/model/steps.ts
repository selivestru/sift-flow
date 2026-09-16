export const ONBOARDING_STEPS = [
  {
    id: 'workspace',
    number: '01',
    title: 'Workspace',
    description: 'Name and slug',
  },
  {
    id: 'members',
    number: '02',
    title: 'Invite members',
    description: 'Bring your team in',
  },
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id']
