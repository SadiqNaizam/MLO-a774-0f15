import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'; // Example trend icons

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral' | number; // Number for percentage change
  trendDirection?: 'positive' | 'negative'; // To color trend icon if value is number
  unit?: string; // e.g., "$", "%"
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection,
  unit,
  className,
}) => {
  console.log("Rendering KPICard:", title, value);

  const renderTrend = () => {
    if (trend === undefined) return null;

    let TrendIcon = Minus;
    let trendText = '';
    let trendColor = 'text-muted-foreground';

    if (typeof trend === 'number') {
      trendText = `${Math.abs(trend).toFixed(1)}%`;
      if (trend > 0) {
        TrendIcon = ArrowUp;
        trendColor = trendDirection === 'negative' ? 'text-red-500' : 'text-green-500';
      } else if (trend < 0) {
        TrendIcon = ArrowDown;
        trendColor = trendDirection === 'negative' ? 'text-green-500' : 'text-red-500';
      }
    } else {
      if (trend === 'up') {
        TrendIcon = ArrowUp;
        trendColor = 'text-green-500';
      } else if (trend === 'down') {
        TrendIcon = ArrowDown;
        trendColor = 'text-red-500';
      }
    }

    return (
      <p className={cn('text-xs text-muted-foreground flex items-center', trendColor)}>
        <TrendIcon className="mr-1 h-4 w-4" />
        {trendText}
      </p>
    );
  };

  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {unit && unit === '$' && '$'}
          {value}
          {unit && unit !== '$' && unit}
        </div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {renderTrend()}
      </CardContent>
    </Card>
  );
};

export default KPICard;