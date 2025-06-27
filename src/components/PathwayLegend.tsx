
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PathwayLegend: React.FC = () => {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mt-4 shadow-xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
      <CardContent className="p-4">
        <h4 className="text-white dark:text-white light:text-black font-bold mb-3 text-lg">Pathway Guide</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 transform hover:scale-105 transition-transform">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded mr-3 flex-shrink-0 animate-pulse"></div>
            <div>
              <div className="text-white font-semibold">Intrinsic Pathway</div>
              <div className="text-blue-200 text-xs">Contact activation (XII, XI, IX)</div>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 transform hover:scale-105 transition-transform">
            <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded mr-3 flex-shrink-0 animate-pulse"></div>
            <div>
              <div className="text-white font-semibold">Extrinsic Pathway</div>
              <div className="text-green-200 text-xs">Tissue factor activation (VII, TF)</div>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 transform hover:scale-105 transition-transform">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded mr-3 flex-shrink-0 animate-pulse"></div>
            <div>
              <div className="text-white font-semibold">Common Pathway</div>
              <div className="text-purple-200 text-xs">Final clot formation (X, V, II, I)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PathwayLegend;
