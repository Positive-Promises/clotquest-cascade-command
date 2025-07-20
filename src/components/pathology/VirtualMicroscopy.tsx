
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Microscope, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Eye,
  FileImage,
  Info
} from 'lucide-react';

interface MicroscopyImage {
  id: string;
  title: string;
  type: 'blood_smear' | 'bone_marrow' | 'tissue_section';
  magnification: string;
  stain: string;
  findings: string[];
  description: string;
  imageUrl: string;
}

interface VirtualMicroscopyProps {
  images: MicroscopyImage[];
  onFindingSelected?: (finding: string) => void;
}

export const VirtualMicroscopy = ({ images, onFindingSelected }: VirtualMicroscopyProps) => {
  const [selectedImage, setSelectedImage] = useState<MicroscopyImage | null>(images[0] || null);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [showFindings, setShowFindings] = useState(false);

  const handleFindingClick = (finding: string) => {
    onFindingSelected?.(finding);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blood_smear': return 'bg-red-100 text-red-800';
      case 'bone_marrow': return 'bg-yellow-100 text-yellow-800';
      case 'tissue_section': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <Microscope className="h-5 w-5 mr-2 text-primary" />
          Virtual Microscopy Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Selection */}
        <div className="space-y-2">
          <h4 className="font-semibold text-card-foreground">Available Specimens</h4>
          <div className="grid grid-cols-1 gap-2">
            {images.map((image) => (
              <Button
                key={image.id}
                variant={selectedImage?.id === image.id ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => setSelectedImage(image)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <FileImage className="h-4 w-4" />
                    <span className="text-sm font-medium">{image.title}</span>
                  </div>
                  <Badge className={getTypeColor(image.type)} variant="outline">
                    {image.type.replace('_', ' ')}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {selectedImage && (
          <>
            {/* Microscope Controls */}
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold">Microscope Controls</h5>
                <Badge variant="outline">{selectedImage.magnification} | {selectedImage.stain}</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium min-w-16">Zoom:</span>
                  <div className="flex-1">
                    <Slider
                      value={zoomLevel}
                      onValueChange={setZoomLevel}
                      max={400}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-12">{zoomLevel[0]}%</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom In
                  </Button>
                  <Button size="sm" variant="outline">
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom Out
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate
                  </Button>
                  <Button 
                    size="sm" 
                    variant={showFindings ? "default" : "outline"}
                    onClick={() => setShowFindings(!showFindings)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Findings
                  </Button>
                </div>
              </div>
            </div>

            {/* Microscopy Viewer */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <div 
                className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel[0] / 100})` }}
              >
                <div className="text-center space-y-2">
                  <Microscope className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Virtual microscopy view: {selectedImage.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedImage.magnification} magnification, {selectedImage.stain} stain
                  </p>
                </div>
              </div>
              
              {showFindings && (
                <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg max-w-xs">
                  <h6 className="font-semibold mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Key Findings
                  </h6>
                  <ul className="text-sm space-y-1">
                    {selectedImage.findings.map((finding, index) => (
                      <li 
                        key={index}
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleFindingClick(finding)}
                      >
                        • {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Image Description */}
            <div className="bg-muted p-4 rounded-lg">
              <h5 className="font-semibold text-card-foreground mb-2">Clinical Significance</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedImage.description}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
