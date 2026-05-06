import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface TourStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  path: string;
  premiumOnly?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'ri-dashboard-line',
    description: 'Your command center. See stock alerts, expiring batches, and recent activity at a glance.',
    path: '/dashboard',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'ri-medicine-bottle-line',
    description: 'Browse all your drugs, check batch details, and monitor stock levels across your pharmacy.',
    path: '/inventory',
  },
  {
    id: 'sell',
    label: 'Sell Flow',
    icon: 'ri-shopping-bag-line',
    description: 'Staff use this to record sales. Search for a drug, enter quantity, and confirm — fast and simple.',
    path: '/sell',
  },
  {
    id: 'restock',
    label: 'Restock Flow',
    icon: 'ri-add-box-line',
    description: 'Add stock to existing drugs. Choose a batch, enter quantity, and confirm with double verification.',
    path: '/restock',
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'ri-bar-chart-2-line',
    description: 'See your top sellers, slow movers, and staff activity analytics to make smarter decisions.',
    path: '/insights',
    premiumOnly: true,
  },
  {
    id: 'audit-log',
    label: 'Audit Log',
    icon: 'ri-file-list-3-line',
    description: 'Full history of every sale, restock, reversal, and reconciliation — with staff attribution.',
    path: '/audit-log',
    premiumOnly: true,
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: 'ri-team-line',
    description: 'Add staff members, assign PINs, and monitor who did what and when.',
    path: '/staff',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'ri-settings-3-line',
    description: 'Configure inventory preferences, run reconciliations, and manage stock reversals.',
    path: '/settings',
  },
];

interface Props {
  onClose: () => void;
}

export default function OnboardingTour({ onClose }: Props) {
  const { subscriptionPlan } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];
  const isLocked = step.premiumOnly && subscriptionPlan === 'starter';
  const totalSteps = TOUR_STEPS.length;

  useEffect(() => {
    // Find the nav element for the current step
    const navEl = document.querySelector(`[data-tour="${step.id}"]`);
    if (navEl) {
      const rect = navEl.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 16,
      });
      // Highlight
      navEl.classList.add('tour-highlight');
      return () => navEl.classList.remove('tour-highlight');
    }
  }, [currentStep, step.id]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('klavora-tour-done', 'true');
    onClose();
  };

  return (
    <>
      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] bg-black/50 pointer-events-none"
      />

      {/* Tooltip card */}
      <div
        className="fixed z-[70] w-72 pointer-events-auto"
        style={{
          top: Math.min(tooltipPos.top - 80, window.innerHeight - 280),
          left: tooltipPos.left,
        }}
      >
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5 relative">
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-3 h-3 bg-surface-light dark:bg-surface-dark border-l border-b border-border-light dark:border-border-dark rotate-45" />

          {/* Step header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${isLocked ? 'bg-gray-100 dark:bg-white/5' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
              <i className={`${step.icon} text-sm ${isLocked ? 'text-gray-400' : 'text-amber-500'}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-heading font-600 text-gray-900 dark:text-white">{step.label}</p>
                {isLocked && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-400/30 text-[9px] font-body font-600 text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    <i className="ri-vip-crown-line text-[9px]"></i>
                    Upgrade to Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className={`text-xs font-body leading-relaxed mb-4 ${isLocked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {isLocked
              ? `${step.description} Unlock this with a Premium plan.`
              : step.description
            }
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${i === currentStep ? 'w-4 h-1.5 bg-amber-500' : 'w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="flex-1 h-8 border border-border-light dark:border-border-dark text-gray-500 dark:text-gray-400 rounded-lg text-xs font-body cursor-pointer whitespace-nowrap hover:border-gray-400 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="flex-1 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-body font-medium cursor-pointer whitespace-nowrap transition-colors"
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Finish'}
              {currentStep < totalSteps - 1 && <i className="ri-arrow-right-line ml-1"></i>}
            </button>
          </div>

          {/* Step counter */}
          <p className="text-center text-[10px] text-gray-300 dark:text-gray-700 font-mono mt-2">{currentStep + 1} / {totalSteps}</p>
        </div>
      </div>
    </>
  );
}
