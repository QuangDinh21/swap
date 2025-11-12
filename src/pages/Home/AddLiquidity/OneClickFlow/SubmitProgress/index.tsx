import { Card } from '@/components/ui';
import { CheckIcon, ClockIcon } from '@/components/ui/Icons';
import { Step } from '@/types';

export type SubmitProgressProps = {
  steps: Step[];
};

const SubmitProgress = (props: SubmitProgressProps) => {
  const { steps } = props;
  const totalSteps = steps.length;
  const numberOfCompletedSteps = steps.filter(
    (item) => item.status === 'completed'
  ).length;

  const getStepIcon = (step: Step) => {
    if (step.status === 'completed') {
      return <CheckIcon className="w-4 h-4 text-green-600" />;
    } else if (step.status === 'in-progress') {
      return <ClockIcon className="w-4 h-4 text-blue-600 animate-pulse" />;
    } else {
      return <div className="w-4 h-4 rounded-full border-2 border-slate-300" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card variant="compact" className="bg-blue-50/80 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-blue-900">Transaction Progress</h5>
          <div className="text-sm text-blue-700">
            {totalSteps === numberOfCompletedSteps
              ? 'Complete!'
              : `${numberOfCompletedSteps}/${totalSteps} steps`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(numberOfCompletedSteps / totalSteps) * 100}%` }}
          />
        </div>
      </Card>

      {/* Detailed Steps - Mobile Optimized */}
      <Card variant="compact" className="bg-white/90">
        <h6 className="font-semibold text-slate-800 mb-3">Step Details</h6>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                step.status === 'completed'
                  ? 'bg-green-50 border border-green-200'
                  : step.status === 'in-progress'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-slate-50 border border-slate-200'
              }`}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">{getStepIcon(step)}</div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`text-sm font-medium ${
                      step.status === 'completed'
                        ? 'text-green-800'
                        : step.status === 'in-progress'
                        ? 'text-blue-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {index + 1}. {step.label}
                  </div>
                </div>

                <div
                  className={`text-xs ${
                    step.status === 'completed'
                      ? 'text-green-700'
                      : step.status === 'in-progress'
                      ? 'text-blue-700'
                      : 'text-slate-500'
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SubmitProgress;
