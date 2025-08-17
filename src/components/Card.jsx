import '../styles/components/Card.css';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'medium', 
  className = '', 
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
