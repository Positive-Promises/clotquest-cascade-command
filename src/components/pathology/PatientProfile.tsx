import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Patient } from '@/types/pathologyTypes';

interface PatientProfileProps {
  patient: Patient;
  isUrgent?: boolean;
  timeRemaining?: number;
}

export const PatientProfile = ({ patient, isUrgent, timeRemaining }: PatientProfileProps) => {
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-card-foreground">
            <User className="h-5 w-5 mr-2 text-primary" />
            Patient Profile
          </CardTitle>
          <div className="flex items-center gap-2">
            {isUrgent && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                URGENT
              </Badge>
            )}
            {timeRemaining !== undefined && (
              <Badge variant="outline" className="text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Basic Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Age:</span> {patient.demographics.age} years</p>
                  <p><span className="font-medium">Sex:</span> {patient.demographics.sex}</p>
                  <p><span className="font-medium">Ethnicity:</span> {patient.demographics.ethnicity}</p>
                  <p><span className="font-medium">Occupation:</span> {patient.demographics.occupation}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Chief Complaint</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {patient.chiefComplaint}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">History of Present Illness</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {patient.historyOfPresentIllness}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Past Medical History</h4>
                  <ul className="text-sm space-y-1">
                    {patient.pastMedicalHistory.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Medications</h4>
                  <ul className="text-sm space-y-1">
                    {patient.medications.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Family History</h4>
                <ul className="text-sm space-y-1">
                  {patient.familyHistory.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="physical" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">General</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.general}</p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Cardiovascular</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.cardiovascular}</p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Pulmonary</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.pulmonary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Extremities</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.extremities}</p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Skin</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.skin}</p>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Neurological</h4>
                <p className="text-sm text-muted-foreground">{patient.physicalExam.neurological}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  <h4 className="font-semibold text-card-foreground">Vital Signs</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{patient.physicalExam.vitalSigns.temperature}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blood Pressure:</span>
                    <span className="font-medium">{patient.physicalExam.vitalSigns.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heart Rate:</span>
                    <span className="font-medium">{patient.physicalExam.vitalSigns.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Respiratory Rate:</span>
                    <span className="font-medium">{patient.physicalExam.vitalSigns.respiratoryRate} /min</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold text-card-foreground mb-2">Review of Systems</h4>
                <ul className="text-sm space-y-1">
                  {patient.reviewOfSystems.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};