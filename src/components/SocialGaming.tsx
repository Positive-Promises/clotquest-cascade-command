
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Trophy, Star, LogIn, UserPlus } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  score: number;
  lastPlayed: string;
}

interface SocialGamingProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignUp: () => void;
}

const SocialGaming: React.FC<SocialGamingProps> = ({ isLoggedIn, onLogin, onSignUp }) => {
  // Mock data for demonstration
  const friends: Friend[] = [
    { id: '1', name: 'Dr. Sarah Chen', level: 4, score: 2840, lastPlayed: '2 hours ago' },
    { id: '2', name: 'Med Student Alex', level: 3, score: 1920, lastPlayed: '1 day ago' },
    { id: '3', name: 'Prof. Johnson', level: 4, score: 3150, lastPlayed: '3 hours ago' },
    { id: '4', name: 'Emma Wilson', level: 2, score: 1200, lastPlayed: '2 days ago' },
  ];

  if (!isLoggedIn) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/30 backdrop-blur-lg">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Join the Community!</h3>
            <p className="text-gray-300 mb-4">
              Log in to track your progress, compete with friends, and see who's mastering hemostasis!
            </p>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <Button 
              onClick={onLogin}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
            <Button 
              variant="outline"
              onClick={onSignUp}
              className="border-blue-400 text-blue-300 hover:bg-blue-400/10"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Your Friends Played Too!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{friend.name}</p>
                  <p className="text-gray-400 text-sm">{friend.lastPlayed}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                  <Trophy className="h-3 w-3 mr-1" />
                  Level {friend.level}
                </Badge>
                <Badge variant="outline" className="text-blue-300 border-blue-300">
                  <Star className="h-3 w-3 mr-1" />
                  {friend.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-400/30">
          <p className="text-green-300 text-sm text-center">
            🎯 Challenge your friends! Complete levels to climb the leaderboard!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialGaming;
