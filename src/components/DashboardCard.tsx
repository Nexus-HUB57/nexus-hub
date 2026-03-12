import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  value?: string | number;
  unit?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  value,
  unit,
  children,
  variant = 'primary',
  className = '',
}: DashboardCardProps) {
  const variantStyles = {
    primary: 'border-l-4 border-[#FF00C1] bg-[#111827]/50 hover-glow',
    secondary: 'border-l-4 border-[#00FFFF] bg-[#111827]/50 hover-glow',
    success: 'border-l-4 border-[#10B981] bg-[#111827]/50 hover-glow',
    warning: 'border-l-4 border-[#F59E0B] bg-[#111827]/50 hover-glow',
    danger: 'border-l-4 border-[#EF4444] bg-[#111827]/50 hover-glow',
  };

  const titleColorStyles = {
    primary: 'text-[#FF00C1]',
    secondary: 'text-[#00FFFF]',
    success: 'text-[#10B981]',
    warning: 'text-[#F59E0B]',
    danger: 'text-[#EF4444]',
  };

  return (
    <Card className={`${variantStyles[variant]} ${className} border rounded-sm transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {icon && <span className={titleColorStyles[variant]}>{icon}</span>}
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#E5E7EB]">
                {title}
              </CardTitle>
            </div>
            {subtitle && <p className="text-xs text-[#9CA3AF]">{subtitle}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {value !== undefined ? (
          <div className="space-y-1">
            <p className={`text-3xl font-bold font-headline ${titleColorStyles[variant]}`}>
              {value}
            </p>
            {unit && <p className="text-xs text-[#9CA3AF] uppercase tracking-widest">{unit}</p>}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
