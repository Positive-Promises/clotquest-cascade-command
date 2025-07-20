
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Plus, 
  Calendar,
  AlertTriangle,
  Activity,
  Trash2
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  category: 'symptom' | 'medication' | 'procedure' | 'lab_result';
}

interface SymptomTimelineProps {
  events?: TimelineEvent[];
  onEventAdded?: (event: Omit<TimelineEvent, 'id'>) => void;
  onEventRemoved?: (id: string) => void;
}

export const SymptomTimeline = ({ 
  events = [], 
  onEventAdded, 
  onEventRemoved 
}: SymptomTimelineProps) => {
  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '',
    event: '',
    severity: 'mild' as const,
    category: 'symptom' as const
  });

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.event) {
      onEventAdded?.({
        ...newEvent,
        time: newEvent.time || '00:00'
      });
      setNewEvent({
        date: '',
        time: '',
        event: '',
        severity: 'mild',
        category: 'symptom'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'symptom': return <AlertTriangle className="h-4 w-4" />;
      case 'medication': return <Activity className="h-4 w-4" />;
      case 'procedure': return <Activity className="h-4 w-4" />;
      case 'lab_result': return <Activity className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Symptom Timeline Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Event */}
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-card-foreground">Add Timeline Event</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-card-foreground">Date</label>
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Time</label>
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Event Description</label>
            <Input
              placeholder="e.g., Started experiencing nosebleeds"
              value={newEvent.event}
              onChange={(e) => setNewEvent(prev => ({ ...prev, event: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-card-foreground">Category</label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={newEvent.category}
                onChange={(e) => setNewEvent(prev => ({ 
                  ...prev, 
                  category: e.target.value as typeof newEvent.category 
                }))}
              >
                <option value="symptom">Symptom</option>
                <option value="medication">Medication</option>
                <option value="procedure">Procedure</option>
                <option value="lab_result">Lab Result</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Severity</label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={newEvent.severity}
                onChange={(e) => setNewEvent(prev => ({ 
                  ...prev, 
                  severity: e.target.value as typeof newEvent.severity 
                }))}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAddEvent} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add to Timeline
          </Button>
        </div>

        {/* Timeline Display */}
        <div className="space-y-4">
          <h4 className="font-semibold text-card-foreground">Timeline Events</h4>
          {sortedEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No timeline events added yet</p>
              <p className="text-sm">Add events above to build the patient's symptom timeline</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-4">
                {sortedEvents.map((event, index) => (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-2 border-background">
                      {getCategoryIcon(event.category)}
                    </div>
                    
                    {/* Event Card */}
                    <div className="flex-1 bg-card border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {event.date} {event.time}
                          </Badge>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEventRemoved?.(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-card-foreground">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
