import React, { useState, useEffect } from "react";
import { Challenge, User } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Trophy, Zap, Star, Sparkles } from "lucide-react";
import { getAvailableChallenges, getChallengeTemplate } from "@/Components/challenges/challengeData";
import { format } from "date-fns";

export default function ChallengesPage() {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
    setAvailableChallenges(getAvailableChallenges());
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const challenges = await Challenge.filter({ created_by: user.email, is_active: true });
      setActiveChallenges(challenges);
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startChallenge = async (templateId) => {
    const template = getChallengeTemplate(templateId);
    if (!template) return;

    try {
      await Challenge.create({
        ...template,
        challenge_template_id: template.id,
        started_date: format(new Date(), "yyyy-MM-dd"),
        is_active: true,
        is_completed: false,
        completed_days: []
      });
      await loadChallenges();
    } catch (error) {
      console.error("Error starting challenge:", error);
    }
  };
  
  const userHasChallenge = (templateId) => {
    return activeChallenges.some(c => c.challenge_template_id === templateId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white/50 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-purple-500 to-orange-600 bg-clip-text text-transparent">
            Mental Glow-Up Challenges
          </h1>
          <p className="text-purple-600 text-lg">
            Commit to your growth with guided journeys.
          </p>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
              <Zap className="text-yellow-500" />
              Your Active Journeys
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeChallenges.map(challenge => (
                <Link to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)} key={challenge.id}>
                  <Card className="group glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <img src={challenge.image_url} alt={challenge.name} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <Badge variant="secondary" className="absolute top-4 left-4 bg-white/80 text-purple-700">
                        Day {challenge.current_day} / {challenge.duration_days}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-800">{challenge.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <p className="text-sm text-gray-600 mb-4 flex-grow">{challenge.description}</p>
                      <div className="w-full bg-purple-100 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-purple-500 h-2.5 rounded-full" 
                          style={{ width: `${(challenge.completed_days.length / challenge.duration_days) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-purple-500 mt-2 text-right">
                        {challenge.completed_days.length} of {challenge.duration_days} days completed
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div>
          <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
            <Sparkles className="text-purple-500" />
            Choose Your Next Journey
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {availableChallenges.map(template => (
              <Card key={template.id} className="glass-effect rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  <img src={template.image_url} alt={template.name} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Badge variant="secondary" className="absolute top-4 left-4 bg-white/80 text-purple-700">
                    <Trophy className="w-3 h-3 mr-1.5" />
                    {template.duration_days} Days
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">{template.name}</CardTitle>
                  <Badge variant="outline" className="border-purple-200 text-purple-500 capitalize w-fit">{template.category}</Badge>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-gray-600 mb-6 flex-grow">{template.description}</p>
                  <Button
                    onClick={() => startChallenge(template.id)}
                    disabled={userHasChallenge(template.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {userHasChallenge(template.id) ? (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        In Progress
                      </>
                    ) : (
                      "Start this Journey"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}