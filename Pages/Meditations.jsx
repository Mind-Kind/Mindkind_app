
import React, { useState, useEffect, useCallback } from "react";
import { MeditationSession, User } from "@/Entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { 
  Sparkles, Play, Clock, Search, Filter, 
  Heart, Users, Moon, Zap, Pause, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "@/Components/audio/AudioPlayerContext";
import { MEDITATION_LIBRARY } from "@/Components/meditations/meditationData";
import { format } from "date-fns";

export default function MeditationsPage() {
  const [meditations, setMeditations] = useState(MEDITATION_LIBRARY);
  const [filteredMeditations, setFilteredMeditations] = useState(MEDITATION_LIBRARY);
  const [sessions, setSessions] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const loadSessions = async () => {
    try {
      const user = await User.me();
      const userSessions = await MeditationSession.filter({ created_by: user.email }, "-created_date", 10);
      setSessions(userSessions);
    } catch (error) {
      console.error("Error loading meditation sessions:", error);
    }
  };

  const filterMeditations = useCallback(() => {
    let filtered = meditations;

    if (searchQuery) {
      filtered = filtered.filter(meditation =>
        meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meditation.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(meditation => meditation.type === selectedType);
    }

    if (selectedDuration !== "all") {
      const durationRanges = {
        short: [1, 10],
        medium: [11, 20],
        long: [21, 60]
      };
      const [min, max] = durationRanges[selectedDuration] || [0, 999];
      filtered = filtered.filter(meditation => 
        meditation.duration >= min && meditation.duration <= max
      );
    }

    setFilteredMeditations(filtered);
  }, [meditations, searchQuery, selectedType, selectedDuration]); // Dependencies for useCallback

  useEffect(() => {
    loadSessions();
    filterMeditations();
  }, [filterMeditations]); // Now depends on the memoized filterMeditations callback

  const startMeditation = async (meditation) => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      await MeditationSession.create({
        session_type: meditation.type,
        duration_minutes: meditation.duration,
        completed: false,
        mood_before: "😌",
        date: today
      });
      
      // Play the meditation audio
      playTrack({
        id: `med-${meditation.id}`,
        title: meditation.title,
        audio_url: meditation.audio_url,
        cover_image: meditation.cover_image,
        duration_minutes: meditation.duration,
        narrator: meditation.instructor
      });
      
      await loadSessions();
    } catch (error) {
      console.error("Error starting meditation session:", error);
    }
  };

  const getDurationBadgeColor = (duration) => {
    if (duration <= 10) return "bg-green-100 text-green-700";
    if (duration <= 20) return "bg-blue-100 text-blue-700";
    return "bg-purple-100 text-purple-700";
  };

  const getTypeIcon = (type) => {
    const icons = {
      breathing: Zap,
      mindfulness: Sparkles,
      sleep: Moon,
      anxiety: Heart,
      focus: Users,
      "self-love": Heart,
      healing: Sparkles
    };
    return icons[type] || Sparkles;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white/50 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-6xl mx-auto pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Guided Meditations
          </h1>
          <p className="text-purple-600 text-lg">
            Find peace, clarity, and inner calm through mindful practice
          </p>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card className="glass-effect rounded-2xl border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-800 capitalize">{session.session_type}</span>
                      {session.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-purple-600">
                      {session.duration_minutes} min • {format(new Date(session.date), "MMM d")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <Input
              placeholder="Search meditations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-xl bg-white focus:border-purple-400 outline-none"
            >
              <option value="all">All Types</option>
              <option value="breathing">Breathing</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="sleep">Sleep</option>
              <option value="anxiety">Anxiety Relief</option>
              <option value="focus">Focus</option>
              <option value="self-love">Self-Love</option>
              <option value="healing">Healing</option>
            </select>
            
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-xl bg-white focus:border-purple-400 outline-none"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (1-10 min)</option>
              <option value="medium">Medium (11-20 min)</option>
              <option value="long">Long (21+ min)</option>
            </select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSelectedType("all");
                setSelectedDuration("all");
                setSearchQuery("");
              }}
              className="border-purple-200 hover:bg-purple-50 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Meditation Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredMeditations.map((meditation) => {
              const IconComponent = getTypeIcon(meditation.type);
              const isCurrentlyPlaying = currentTrack?.id === `med-${meditation.id}` && isPlaying;
              const isSelected = currentTrack?.id === `med-${meditation.id}`;

              return (
                <motion.div
                  key={meditation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className={`glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col ${isSelected ? 'border-2 border-purple-300' : ''}`}>
                    <div className="relative">
                      <img 
                        src={meditation.cover_image} 
                        alt={meditation.title} 
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/80 text-purple-700 border-0">
                          <IconComponent className="w-3 h-3 mr-1" />
                          {meditation.type}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Badge className={`${getDurationBadgeColor(meditation.duration)} border-0`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {meditation.duration}min
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-lg text-purple-800 leading-tight">{meditation.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-2">{meditation.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {meditation.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-600">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">with {meditation.instructor}</span>
                        <Button 
                          size="sm" 
                          onClick={() => startMeditation(meditation)}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full px-4"
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {isCurrentlyPlaying ? "Pause" : isSelected ? "Resume" : "Begin"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredMeditations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">No meditations found</h3>
            <p className="text-purple-500 mb-6">Try adjusting your filters or search terms</p>
            <Button 
              onClick={() => {
                setSelectedType("all");
                setSelectedDuration("all");
                setSearchQuery("");
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6"
            >
              View All Meditations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
