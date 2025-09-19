import React, { useState, useEffect } from "react";
import { User, MoodEntry, JournalEntry, MeditationSession } from "@/Entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, BookOpen, Sparkles, Trophy, Calendar, 
  TrendingUp, Moon, Sun, Zap, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { format, isToday } from "date-fns";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [weeklyMoods, setWeeklyMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Get today's mood
      const today = format(new Date(), "yyyy-MM-dd");
      const todayMoods = await MoodEntry.filter({ date: today, created_by: userData.email });
      setTodayMood(todayMoods[0] || null);

      // Get recent journal entries
      const journals = await JournalEntry.filter({ created_by: userData.email }, "-created_date", 3);
      setRecentEntries(journals);

      // Get this week's moods
      const moods = await MoodEntry.filter({ created_by: userData.email }, "-date", 7);
      setWeeklyMoods(moods);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const greetingMessage = () => {
    const hour = new Date().getHours();
    const name = user?.preferred_name || "Beautiful Soul";
    
    if (hour < 12) return `Good Morning, ${name} ☀️`;
    if (hour < 17) return `Good Afternoon, ${name} 🌤️`;
    return `Good Evening, ${name} 🌙`;
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "✨";
    if (streak >= 7) return "🌟";
    if (streak >= 3) return "💫";
    return "🌱";
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-purple-100 rounded-lg w-1/2"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-purple-50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white/50 to-pink-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="relative p-6 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {greetingMessage()}
              </h1>
              <p className="text-purple-600 text-lg font-medium mb-6">
                Welcome to your sanctuary of peace and growth
              </p>
              
              {!todayMood && (
                <Link to={createPageUrl("MoodTracker")}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    <Heart className="w-5 h-5 mr-2" />
                    Log Your Mood Today
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 -mt-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <span className="text-2xl">{getStreakEmoji(user?.mood_streak || 0)}</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">Mood Streak</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600">{user?.mood_streak || 0}</span>
                  <span className="text-sm text-purple-400">days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">Journal Streak</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">{user?.journal_streak || 0}</span>
                  <span className="text-sm text-blue-400">days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-2xl">🧘‍♀️</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">Meditation</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">{user?.meditation_minutes || 0}</span>
                  <span className="text-sm text-green-400">minutes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
                    <Trophy className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">Challenges</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">{user?.current_challenges?.length || 0}</span>
                  <span className="text-sm text-orange-400">active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Today's Mood */}
            <Card className="glass-effect rounded-2xl border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Today's Feeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayMood ? (
                  <div className="text-center py-4">
                    <div className="text-6xl mb-3">{todayMood.mood_emoji}</div>
                    <h3 className="font-semibold text-lg capitalize mb-2">{todayMood.mood_name}</h3>
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < todayMood.intensity ? 'text-pink-400' : 'text-gray-200'}`}>
                          ❤️
                        </span>
                      ))}
                    </div>
                    {todayMood.notes && (
                      <p className="text-sm text-gray-600 bg-purple-50 rounded-lg p-3">
                        {todayMood.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💫</div>
                    <p className="text-gray-500 mb-4">How are you feeling today?</p>
                    <Link to={createPageUrl("MoodTracker")}>
                      <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-6">
                        Log Your Mood
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mood Trend */}
            <Card className="glass-effect rounded-2xl border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  This Week's Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyMoods.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Recent</span>
                      <span>Earlier</span>
                    </div>
                    <div className="flex justify-center gap-2 py-4">
                      {weeklyMoods.slice(0, 7).map((mood, index) => (
                        <div key={mood.id} className="text-center">
                          <div className="text-2xl mb-1">{mood.mood_emoji}</div>
                          <div className="w-2 h-8 bg-gradient-to-t from-purple-200 to-purple-400 rounded-full mx-auto"
                               style={{ height: `${mood.intensity * 6 + 8}px` }} />
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-purple-600">
                      You've logged {weeklyMoods.length} mood{weeklyMoods.length !== 1 ? 's' : ''} this week! 🎉
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-500 mb-4">Start tracking to see your emotional patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect rounded-2xl border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("Journal")} className="block">
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl">
                    <BookOpen className="w-4 h-4 mr-3 text-purple-500" />
                    Write in Journal
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Meditations")} className="block">
                  <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl">
                    <Sparkles className="w-4 h-4 mr-3 text-blue-500" />
                    Start Meditation
                  </Button>
                </Link>
                
                <Link to={createPageUrl("AIChat")} className="block">
                  <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50 hover:border-green-300 rounded-xl">
                    <Heart className="w-4 h-4 mr-3 text-green-500" />
                    Chat with AI
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Challenges")} className="block">
                  <Button variant="outline" className="w-full justify-start border-orange-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl">
                    <Trophy className="w-4 h-4 mr-3 text-orange-500" />
                    View Challenges
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Journal Entries */}
          {recentEntries.length > 0 && (
            <Card className="glass-effect rounded-2xl border-0 shadow-lg mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Recent Reflections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-purple-800">{entry.title || "Untitled Entry"}</h4>
                        <span className="text-xs text-purple-500">
                          {format(new Date(entry.date), "MMM d")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {entry.content.substring(0, 120)}...
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {entry.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Link to={createPageUrl("Journal")}>
                    <Button variant="outline" className="border-purple-200 hover:bg-purple-50 rounded-full">
                      View All Entries
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}