'use client';

import React from 'react';

interface BookingStepperProps {
  currentStep: number;
  steps?: string[];
  className?: string;
}

const defaultSteps = ['選美容師', '選服務', '選寵物', '選時間', '確認'];

export default function BookingStepper({
  currentStep,
  steps = defaultSteps,
  className = '',
}: BookingStepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <React.Fragment key={label}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors
                    ${isCompleted ? 'bg-[#4884B8] text-white' : ''}
                    ${isCurrent ? 'border-2 border-[#4884B8] text-[#4884B8] bg-white' : ''}
                    ${!isCompleted && !isCurrent ? 'border-2 border-gray-200 text-gray-400 bg-white' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-1.5 text-[11px] font-medium text-center max-w-[72px]
                    ${isCompleted ? 'text-[#4884B8]' : ''}
                    ${isCurrent ? 'text-[#4884B8]' : ''}
                    ${!isCompleted && !isCurrent ? 'text-gray-400' : ''}
                  `}
                >
                  {label}
                </span>
              </div>

              {/* Connecting line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-2 mb-6 h-[1.5px] flex-1
                    ${index < currentStep ? 'bg-[#4884B8]' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
