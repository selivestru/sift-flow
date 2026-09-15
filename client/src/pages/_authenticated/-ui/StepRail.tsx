import { cn } from '@heroui/styles'
import { Check, CircleHalfDottedCheck } from 'reicon-react'

import { ONBOARDING_STEPS, type OnboardingStepId } from '../-model/steps'

interface StepRailProps {
  currentStep: OnboardingStepId
}

export const StepRail = ({ currentStep }: StepRailProps) => {
  const currentIndex = ONBOARDING_STEPS.findIndex((step) => step.id === currentStep)

  return (
    <ol className="border-border grid grid-cols-2 border">
      {ONBOARDING_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex
        const isComplete = index < currentIndex

        return (
          <li
            key={step.id}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'border-border relative flex flex-col gap-2 p-4',
              index > 0 && 'border-l',
              isCurrent ? 'bg-surface' : 'bg-background-secondary',
            )}
          >
            {isCurrent && <span aria-hidden className="bg-accent absolute inset-x-0 top-0 h-0.5" />}

            <div className="flex items-end gap-2">
              <div
                className="flex flex-col items-center gap-0.5"
                data-state={isComplete ? 'b' : 'a'}
              >
                <span
                  className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted',
                  )}
                >
                  {step.number}
                </span>
                {isCurrent && (
                  <CircleHalfDottedCheck strokeWidth={2} className="text-success size-5" />
                )}
                {isComplete && (
                  <span className="bg-success text-success-foreground flex size-5 items-center justify-center rounded-full">
                    <Check strokeWidth={2} className="size-3" />
                  </span>
                )}
                {!isCurrent && !isComplete && (
                  <span className="border-muted size-5 rounded-full border-2" />
                )}
              </div>
              <p
                className={cn(
                  'text-sm font-semibold tracking-tight',
                  isCurrent || isComplete ? 'text-foreground' : 'text-muted',
                )}
              >
                {step.title}
              </p>
            </div>
            <span className="text-muted text-sm">{step.description}</span>
          </li>
        )
      })}
    </ol>
  )
}
