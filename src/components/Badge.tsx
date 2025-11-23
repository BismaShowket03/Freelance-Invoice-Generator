import React from 'react';

interface BadgeProps {
  status: 'paid' | 'pending';
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  
  const statusClasses = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default Badge;

