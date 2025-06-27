
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, AlertTriangle, Target, Scissors, Shield } from 'lucide-react';

const PathwayLegend: React.FC = () => {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mt-4 shadow-xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
      <CardContent className="p-4">
        <h4 className="text-white dark:text-white light:text-black font-bold mb-3 text-lg">Enhanced Pathway Guide</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 transform hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-blue-400 mr-2 animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Intrinsic</div>
              <div className="text-blue-200 text-xs">XII, XI, IX, VIII</div>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 transform hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4 text-green-400 mr-2 animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Extrinsic</div>
              <div className="text-green-200 text-xs">TF, VII</div>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 transform hover:scale-105 transition-transform">
            <Target className="w-4 h-4 text-purple-400 mr-2 animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Common</div>
              <div className="text-purple-200 text-xs">X, V, II, I, XIII</div>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/30 transform hover:scale-105 transition-transform">
            <Scissors className="w-4 h-4 text-orange-400 mr-2 animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Fibrinolysis</div>
              <div className="text-orange-200 text-xs">tPA, Plasminogen</div>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30 transform hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-cyan-400 mr-2 animate-pulse" />
            <div>
              <div className="text-white font-semibold text-sm">Regulatory</div>
              <div className="text-cyan-200 text-xs">ATIII, Protein C</div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
          <div className="text-yellow-200 text-xs font-medium">
            💡 Tip: Cofactors work with enzymes to enhance reactions!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PathwayLegend;
