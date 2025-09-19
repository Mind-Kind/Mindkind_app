import React, { useState, useEffect } from "react";
import { MoodEntry, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp, Tag } from "lucide-react";
import { format, isToday, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const MOODS = [
  { emoji: "😊", name: "joyful", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
  { emoji: "🙏", name: "grateful", color: "bg-green-100 border-green-300 text-green-800" },
  { emoji: "😌", name: "calm", color: "bg-blue-100 border-blue-300 text-blue-800" },
  { emoji: "😰", name: "anxious", color: "bg-orange-100 border-orange-300 text-orange-800" },
  { emoji: "😢", name: "sad", color: "bg-indigo-100 border-indigo-300 text-indigo-800" },
  { emoji: "😤", name: "frustrated", color: "bg-red-100 border-red-300 text-red-800" },
  { emoji: "🤩", name: "excited", color: "bg-purple-100 border-purple-300 text-purple-800" },
  { emoji: "☮️", name: "peaceful", color: "bg-teal-100 border-teal-300 text-teal-800" },
  { emoji: "😵", name: "overwhelmed", color: "bg-gray-100 border-gray-300 text-gray-800" },
  { emoji: "😄", name: "content", color: "bg-pink-100 border-pink-300 text-pink-800" }
];

const MOOD_TAGS = [
  "work", "relationships", "family", "health", "sleep", "exercise", 
  "social", "creativity", "money", "goals", "weather", "food"
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);

  useEffect(() => {
    loadRecentMoods();
    checkTodayEntry();
  }, []);

  const loadRecentMoods = async () => {
    try {
      const user = await User.me();
      const moods = await MoodEntry.filter({ created_by: user.email }, "-date", 14);
      setRecentMoods(moods);
    } catch (error) {
      console.error("Error loading moods:", error);
    }
  };

  const checkTodayEntry = async () => {
    try {
      const user = await User.me();
      const today = format(new Date(), "yyyy-MM-dd");
      const todayMoods = await MoodEntry.filter({ 
        date: today, 
        created_by: user.email 
      });
      setTodayEntry(todayMoods[0] || null);
    } catch (error) {
      console.error("Error checking today's entry:", error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      const moodData = {
        mood_emoji: selectedMood.emoji,
        mood_name: selectedMood.name,
        intensity: intensity,
        tags: selectedTags,
        notes: notes.trim(),
        date: today
      };

      if (todayEntry) {
        await MoodEntry.update(todayEntry.id, moodData);
      } else {
        await MoodEntry.create(moodData);
        
        // Update user streak
        const user = await User.me();
        await User.updateMyUserData({
          mood_streak: (user.mood_streak || 0) + 1
        });
      }

      // Reset form
      setSelectedMood(null);
      setIntensity(3);
      setNotes("");
      setSelectedTags([]);
      
      await loadRecentMoods();
      await checkTodayEntry();
      
    } catch (error) {
      console.error("Error saving mood:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white/50 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
            How are you feeling today?
          </h1>
          <p className="text-purple-600 text-lg">
            Your emotions matter. Let's track your journey together.
          </p>
        </div>

        {todayEntry && (
          <Card className="glass-effect rounded-2xl border-0 shadow-lg mb-8">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-3">{todayEntry.mood_emoji}</div>
              <h3 className="text-xl font-semibold capitalize text-purple-700 mb-2">
                You felt {todayEntry.mood_name} today
              </h3>
              <p className="text-purple-500">You can update your mood anytime!</p>
            </CardContent>
          </Card>
        )}

        {/* Mood Selection */}
        <Card className="glass-effect rounded-2xl border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-6 h-6 text-pink-500" />
              Choose Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.name}
                  
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMood?.name === mood.name 
                      ? `${mood.color} border-current shadow-lg` 
                      : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium capitalize">{mood.name}</div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  
                  className="space-y-6"
                >
                  {/* Intensity Slider */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      How intense is this feeling? ({intensity}/5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => setIntensity(level)}
                          className={`text-2xl transition-all duration-200 ${
                            level <= intensity ? "text-pink-500 scale-110" : "text-gray-300"
                          }`}
                        >
                          ❤️
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      What's influencing this mood?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                            selectedTags.includes(tag)
                              ? "bg-purple-500 text-white shadow-md"
                              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      Any thoughts to share? (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What's on your mind right now?"
                      className="border-purple-200 focus:border-purple-400 rounded-xl"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleMoodSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? "Saving..." : todayEntry ? "Update Mood" : "Save Mood"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Recent Moods */}
        {recentMoods.length > 0 && (
          <Card className="glass-effect rounded-2xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Your Mood Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMoods.map((mood) => (
                  <div key={mood.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-3xl">{mood.mood_emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{mood.mood_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < mood.intensity ? 'text-pink-400' : 'text-gray-300'}`}>
                              ❤️
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(mood.date), "MMM d, yyyy")}</span>
                        {isToday(new Date(mood.date)) && (
                          <Badge className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xs">
                            Today
                          </Badge>
                        )}
                      </div>
                      {mood.tags && mood.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {mood.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-600">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {mood.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-white/60 rounded-lg p-2">
                          "{mood.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}