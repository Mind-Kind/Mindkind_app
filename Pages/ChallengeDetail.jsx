
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Challenge } from "@/Entities/all";
import { getChallengeTemplate } from "@/Components/challenges/challengeData";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ArrowLeft, CheckCircle, Zap, BookOpen, Repeat, Star } from "lucide-react";
import { createPageUrl } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Confetti } from "@/Components/ui/confetti";

export default function ChallengeDetailPage() {
  const location = useLocation();
  const [challenge, setChallenge] = useState(null);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const challengeId = new URLSearchParams(location.search).get("id");

  const loadChallenge = useCallback(async () => {
    if (!challengeId) return; // Only load if challengeId is present
    setIsLoading(true);
    try {
      const currentChallenge = await Challenge.get(challengeId);
      const challengeTemplate = getChallengeTemplate(currentChallenge.challenge_template_id);
      setChallenge(currentChallenge);
      setTemplate(challengeTemplate);
    } catch (error) {
      console.error("Error loading challenge details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]); // Depend on challengeId

  useEffect(() => {
    loadChallenge(); // Call the memoized function
  }, [loadChallenge]); // Depend on the memoized loadChallenge function

  const markDayAsComplete = async () => {
    if (!challenge || isDayCompleted(challenge.current_day)) return;
    
    const newCompletedDays = [...challenge.completed_days, challenge.current_day];
    let newCurrentDay = challenge.current_day + 1;
    let isCompleted = false;

    if (newCurrentDay > challenge.duration_days) {
      newCurrentDay = challenge.duration_days;
      isCompleted = true;
    }

    try {
      const updatedChallenge = await Challenge.update(challenge.id, {
        completed_days: newCompletedDays,
        current_day: newCurrentDay,
        is_completed: isCompleted,
        is_active: !isCompleted,
      });
      setChallenge(updatedChallenge);
      
      if(isCompleted) {
        setShowConfetti(true);
      }
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  };

  const isDayCompleted = (day) => {
    return challenge?.completed_days?.includes(day);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading your challenge...</div>;
  }

  if (!challenge || !template) {
    return <div className="p-8 text-center">Challenge not found.</div>;
  }
  
  const todayTask = template.daily_tasks.find(t => t.day === challenge.current_day);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white/50 to-orange-50/30 p-6 md:p-8">
      {showConfetti && <Confetti />}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={createPageUrl("Challenges")}>
            <Button variant="outline" className="rounded-full border-purple-200 hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Challenges
            </Button>
          </Link>
        </div>

        <header className="mb-8">
          <img src={challenge.image_url} alt={challenge.name} className="w-full h-48 md:h-64 object-cover rounded-3xl shadow-2xl shadow-purple-200 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">{challenge.name}</h1>
          <Badge variant="secondary" className="bg-purple-100 text-purple-600">{challenge.category}</Badge>
        </header>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 text-sm font-medium text-purple-600">
            <span>Progress</span>
            <span>Day {challenge.current_day} of {challenge.duration_days}</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-orange-400 to-purple-500 h-3 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${(challenge.completed_days.length / challenge.duration_days) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        <AnimatePresence mode="wait">
        {challenge.is_completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="glass-effect rounded-2xl border-0 shadow-lg text-center p-8">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-800 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">You've completed the {challenge.name}. You should be incredibly proud of your commitment to your growth!</p>
                <Link to={createPageUrl("Challenges")}>
                    <Button className="bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-full px-8">
                        Choose a New Challenge
                    </Button>
                </Link>
              </Card>
            </motion.div>
        ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {todayTask && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-purple-800">Day {todayTask.day}: {todayTask.title}</h2>
                  
                  {/* Today's Task */}
                  <Card className="glass-effect rounded-2xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Today's Task
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{todayTask.task}</p>
                    </CardContent>
                  </Card>
      
                  {/* Quote & Prompt */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-purple-200">
                      <CardContent className="p-6">
                        <p className="text-purple-700 italic mb-2">"{todayTask.quote}"</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border-blue-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-800">
                          <BookOpen className="w-4 h-4" />
                          Reflection Prompt
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-700">{todayTask.prompt}</p>
                      </CardContent>
                    </Card>
                  </div>
      
                  {/* Action Button */}
                  <div className="text-center pt-4">
                    <Button
                      size="lg"
                      onClick={markDayAsComplete}
                      disabled={isDayCompleted(challenge.current_day)}
                      className={`rounded-full px-12 py-6 text-lg font-bold shadow-lg transition-all duration-300 ${
                        isDayCompleted(challenge.current_day)
                          ? "bg-green-500 text-white"
                          : "bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white hover:shadow-xl"
                      }`}
                    >
                      <CheckCircle className="w-6 h-6 mr-3" />
                      {isDayCompleted(challenge.current_day) ? "Day Complete!" : "Mark as Complete"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
