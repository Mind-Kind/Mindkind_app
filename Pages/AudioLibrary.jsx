import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Headphones, Play, Search, Filter, Clock, 
  Heart, Sparkles, Users, Star, Pause 
} from "lucide-react";
import { AUDIO_LIBRARY, MOOD_CATEGORIES, GOAL_CATEGORIES } from "@/components/audio/audioData";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "@/components/audio/AudioPlayerContext";

export default function AudioLibraryPage() {
  const [audioTracks, setAudioTracks] = useState(AUDIO_LIBRARY);
  const [filteredTracks, setFilteredTracks] = useState(AUDIO_LIBRARY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const filterTracks = useCallback(() => {
    let filtered = audioTracks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(track => track.category === selectedCategory);
    }

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter(track =>
        track.mood_tags.some(tag => tag.toLowerCase().includes(selectedMood.toLowerCase()))
      );
    }

    // Filter by goal
    if (selectedGoal) {
      filtered = filtered.filter(track =>
        track.goal_tags.some(tag => tag.toLowerCase().includes(selectedGoal.toLowerCase()))
      );
    }

    setFilteredTracks(filtered);
  }, [audioTracks, searchQuery, selectedMood, selectedGoal, selectedCategory]);

  useEffect(() => {
    filterTracks();
  }, [filterTracks]);

  const clearFilters = () => {
    setSelectedMood(null);
    setSelectedGoal(null);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const getCategoryIcon = (category) => {
    const icons = {
      affirmations: Sparkles,
      healing: Heart,
      "self-love": Heart,
      sleep: Clock,
      meditation: Users,
      breathing: Users
    };
    return icons[category] || Headphones;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white/50 to-blue-50/30 p-6 md:p-8">
      <div className="max-w-6xl mx-auto pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
            Mindful Audio Library
          </h1>
          <p className="text-blue-600 text-lg">
            Healing sounds, affirmations, and guided content for your well-being
          </p>
        </div>

        {/* Quick Mood Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-800">How are you feeling right now?</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="border-blue-200 hover:bg-blue-50 rounded-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              {selectedMood ? `Feeling ${selectedMood}` : "Select Mood"}
            </Button>
          </div>

          <AnimatePresence>
            {(showMoodSelector || selectedMood) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
              >
                {MOOD_CATEGORIES.map((mood) => (
                  <motion.button
                    key={mood.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedMood(selectedMood === mood.name.toLowerCase() ? null : mood.name.toLowerCase());
                      setShowMoodSelector(false);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                      selectedMood === mood.name.toLowerCase()
                        ? `bg-gradient-to-br ${mood.color} text-white border-transparent shadow-lg`
                        : "border-blue-200 hover:border-blue-300 hover:bg-blue-50 bg-white"
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium">{mood.name}</div>
                    <div className="text-xs opacity-75 mt-1">{mood.description}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Goal Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-800">What's your goal today?</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGoalSelector(!showGoalSelector)}
              className="border-green-200 hover:bg-green-50 rounded-full"
            >
              <Star className="w-4 h-4 mr-2" />
              {selectedGoal ? selectedGoal : "Select Goal"}
            </Button>
          </div>

          <AnimatePresence>
            {(showGoalSelector || selectedGoal) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
              >
                {GOAL_CATEGORIES.map((goal) => (
                  <motion.button
                    key={goal.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGoal(selectedGoal === goal.name.toLowerCase() ? null : goal.name.toLowerCase());
                      setShowGoalSelector(false);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                      selectedGoal === goal.name.toLowerCase()
                        ? `bg-gradient-to-br ${goal.color} text-white border-transparent shadow-lg`
                        : "border-green-200 hover:border-green-300 hover:bg-green-50 bg-white"
                    }`}
                  >
                    <div className="text-3xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-medium">{goal.name}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <Input
              placeholder="Search for affirmations, healing tracks, self-love content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400 rounded-xl"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-blue-200 rounded-xl bg-white focus:border-blue-400 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="affirmations">Affirmations</option>
              <option value="healing">Healing</option>
              <option value="self-love">Self-Love</option>
              <option value="breathing">Breathing</option>
              <option value="sleep">Sleep</option>
            </select>
            
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-blue-200 hover:bg-blue-50 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {(selectedMood || selectedGoal || searchQuery || selectedCategory !== "all") && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
            <p className="text-blue-700">
              Found <span className="font-semibold">{filteredTracks.length}</span> track{filteredTracks.length !== 1 ? 's' : ''} 
              {selectedMood && <span> for when you're feeling <span className="font-semibold">{selectedMood}</span></span>}
              {selectedGoal && <span> to help with <span className="font-semibold">{selectedGoal}</span></span>}
            </p>
          </div>
        )}

        {/* Audio Tracks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredTracks.map((track) => {
              const IconComponent = getCategoryIcon(track.category);
              const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
              const isSelected = currentTrack?.id === track.id;

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className={`glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col ${isSelected ? 'border-2 border-purple-300' : ''}`}>
                    <div className="relative">
                      <img 
                        src={track.cover_image} 
                        alt={track.title} 
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/80 text-blue-700 border-0">
                          <IconComponent className="w-3 h-3 mr-1" />
                          {track.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="secondary" className="bg-black/60 text-white border-0">
                          <Clock className="w-3 h-3 mr-1" />
                          {track.duration_minutes}min
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-lg text-blue-800 leading-tight">{track.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-2">{track.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {track.mood_tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">by {track.narrator}</span>
                        <Button 
                          size="sm" 
                          onClick={() => playTrack(track)}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full px-4"
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {isCurrentlyPlaying ? "Pause" : isSelected ? "Resume" : "Listen"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎧</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">No tracks found</h3>
            <p className="text-blue-500 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full px-6">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}