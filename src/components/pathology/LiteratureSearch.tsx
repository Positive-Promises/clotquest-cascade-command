
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Clock,
  Users,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { MedicalLiteratureService } from '@/services/medicalLiteratureApi';

interface LiteratureResult {
  title: string;
  authors: string;
  journal: string;
  year: string;
  abstract: string;
  doi?: string;
  relevance: 'High' | 'Medium' | 'Low';
  url?: string;
}

interface LiteratureSearchProps {
  onSearchComplete?: (results: LiteratureResult[]) => void;
}

export const LiteratureSearch = ({ onSearchComplete }: LiteratureSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LiteratureResult[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await MedicalLiteratureService.searchLiterature(
        searchQuery, 
        apiKey || undefined
      );
      
      setResults(response.results);
      setSearchTime(response.searchTime);
      onSearchComplete?.(response.results);
    } catch (error) {
      console.error('Literature search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getRelevanceBadgeColor = (relevance: string) => {
    switch (relevance) {
      case 'High': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          Medical Literature Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input (Optional) */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-xs"
          >
            {showApiKeyInput ? 'Hide' : 'Add'} Perplexity API Key (Optional)
          </Button>
          
          {showApiKeyInput && (
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <Input
                type="password"
                placeholder="Enter Perplexity API key for real-time search..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add your Perplexity API key for real-time research findings. 
                Without it, mock data will be used for demonstration.
              </p>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Search medical literature (e.g., 'hemophilia treatment', 'TTP diagnosis')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-card-foreground">
                Search Results ({results.length})
              </h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {searchTime}ms
              </div>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {results.map((result, index) => (
                  <Card key={index} className="border-muted hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-semibold text-card-foreground text-sm leading-tight">
                            {result.title}
                          </h5>
                          <Badge className={getRelevanceBadgeColor(result.relevance)}>
                            {result.relevance}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {result.authors}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {result.journal}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {result.year}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.abstract}
                        </p>
                        
                        {result.doi && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              DOI: {result.doi}
                            </span>
                            <Button size="sm" variant="ghost" className="h-6 px-2">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold text-card-foreground mb-2 flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search Tips
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Use specific medical terms (e.g., "thrombotic thrombocytopenic purpura")</p>
            <p>• Include pathology keywords (e.g., "diagnosis", "treatment", "pathophysiology")</p>
            <p>• Results prioritize trusted medical databases and journals</p>
            <p>• Add your Perplexity API key for real-time research findings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
