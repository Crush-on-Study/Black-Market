import '../styles/components/Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false, 
  error = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''}`}
        {...props}
      />
      
      {error && (
        <div className="input-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
