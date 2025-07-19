import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { LabResult } from '@/types/pathologyTypes';

interface LaboratoryResultsProps {
  labResults: LabResult[];
  onResultClick?: (result: LabResult) => void;
}

export const LaboratoryResults = ({ labResults, onResultClick }: LaboratoryResultsProps) => {
  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'High':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'Low':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Check className="h-4 w-4 text-green-500" />;
    }
  };

  const getSignificanceBadge = (significance: string) => {
    switch (significance) {
      case 'Critical':
        return <Badge variant="destructive" className="animate-pulse">Critical</Badge>;
      case 'High':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-green-600">Normal</Badge>;
    }
  };

  const criticalResults = labResults.filter(result => result.significance === 'Critical');
  const abnormalResults = labResults.filter(result => result.isAbnormal && result.significance !== 'Critical');
  const normalResults = labResults.filter(result => !result.isAbnormal);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Laboratory Results
          {criticalResults.length > 0 && (
            <Badge variant="destructive" className="ml-2 animate-pulse">
              {criticalResults.length} Critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Critical Results */}
        {criticalResults.length > 0 && (
          <div>
            <h4 className="font-semibold text-destructive mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Critical Values
            </h4>
            <div className="space-y-2">
              {criticalResults.map((result) => (
                <div 
                  key={result.id}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 cursor-pointer hover:bg-destructive/20 transition-colors"
                  onClick={() => onResultClick?.(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {getSignificanceIcon(result.significance)}
                        <span className="font-medium ml-2">{result.name}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-destructive">
                          {result.value} {result.unit}
                        </span>
                        <span className="ml-2">
                          (Normal: {result.referenceRange})
                        </span>
                      </div>
                    </div>
                    {getSignificanceBadge(result.significance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abnormal Results */}
        {abnormalResults.length > 0 && (
          <div>
            <h4 className="font-semibold text-orange-600 mb-3">Abnormal Values</h4>
            <div className="space-y-2">
              {abnormalResults.map((result) => (
                <div 
                  key={result.id}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => onResultClick?.(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {getSignificanceIcon(result.significance)}
                        <span className="font-medium ml-2">{result.name}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-orange-600">
                          {result.value} {result.unit}
                        </span>
                        <span className="ml-2">
                          (Normal: {result.referenceRange})
                        </span>
                      </div>
                    </div>
                    {getSignificanceBadge(result.significance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Results */}
        {normalResults.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 mb-3">Normal Values</h4>
            <div className="grid grid-cols-2 gap-2">
              {normalResults.map((result) => (
                <div 
                  key={result.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-2 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => onResultClick?.(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {getSignificanceIcon(result.significance)}
                        <span className="text-sm font-medium ml-1">{result.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.value} {result.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Laboratory Interpretation Help */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold text-card-foreground mb-2">Laboratory Interpretation</h4>
          <p className="text-sm text-muted-foreground">
            Click on any lab result for detailed interpretation and clinical significance. 
            Critical values require immediate attention and may guide urgent treatment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};