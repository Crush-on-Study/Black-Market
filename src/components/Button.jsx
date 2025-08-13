import "../styles/components/Button.css";

const Button = ({
  as: Component = "button",
  className = "",
  color = "#ff00ff",
  speed = "3s",
  thickness = 1,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  children,
  ...rest
}) => {
  // variant와 size에 따른 추가 클래스
  const variantClass = variant ? `btn--${variant}` : '';
  const sizeClass = size ? `btn--${size}` : '';
  const fullWidthClass = fullWidth ? 'btn--full-width' : '';
  
  return (
    <Component 
      className={`star-border-container ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`} 
      style={{
        padding: `${thickness}px 0`,
        ...rest.style
      }}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default Button;
