import '../styles/components/Breadcrumb.css';

function Breadcrumb({ steps, currentStep }) {
  return (
    <div className="breadcrumb-nav">
      {steps.map((step, index) => (
        <div key={step.id} className={`breadcrumb-item ${currentStep > step.id ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}>
          <div className={`breadcrumb-step ${currentStep > step.id ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}>
            {currentStep > step.id ? '✓' : step.id}
          </div>
          <div className="breadcrumb-info">
            <span className="breadcrumb-title">{step.title}</span>
            <span className="breadcrumb-description">{step.description}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`breadcrumb-arrow ${currentStep > step.id ? 'active' : ''}`}>
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Breadcrumb;
