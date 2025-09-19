
import React, { useState, useEffect } from "react";
import { JournalEntry, User } from "@/Entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { BookOpen, Sparkles, Heart, Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const WRITING_PROMPTS = [
  "What made you smile today?",
  "What's heavy on your heart right now?", 
  "What are you grateful for in this moment?",
  "What would you tell your younger self?",
  "What's something beautiful you noticed today?",
  "How did you grow as a person today?",
  "What's a challenge you're facing and how might you overcome it?",
  "What's something you're looking forward to?",
  "How did you show kindness to yourself or others today?",
  "What emotions are you feeling right now and why?"
];

const MOOD_EMOJIS = ["😊", "😌", "😢", "😤", "🤗", "😰", "🥰", "😴", "🤔", "✨"];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [moodBefore, setMoodBefore] = useState("");
  const [moodAfter, setMoodAfter] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userEntries = await JournalEntry.filter({ created_by: user.email }, "-created_date", 20);
      setEntries(userEntries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const entryData = {
        title: title.trim() || "Untitled Entry",
        content: content.trim(),
        prompt: selectedPrompt,
        mood_before: moodBefore,
        mood_after: moodAfter,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: format(new Date(), "yyyy-MM-dd")
      };

      await JournalEntry.create(entryData);

      // Update user journal streak
      const user = await User.me();
      await User.updateMyUserData({
        journal_streak: (user.journal_streak || 0) + 1
      });

      // Reset form
      setTitle("");
      setContent("");
      setSelectedPrompt("");
      setMoodBefore("");
      setMoodAfter("");
      setTags("");
      setShowNewEntry(false);
      
      await loadEntries();
    } catch (error) {
      console.error("Error saving journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setContent(prompt + "\n\n");
    document.getElementById("journal-content-textarea")?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Your Sacred Journal
          </h1>
          <p className="text-purple-600 text-lg">
            A safe space for your thoughts, dreams, and reflections
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-purple-600">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">{entries.length} entries written</span>
          </div>
          <Button
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>

        <AnimatePresence>
          {showNewEntry && (
            <motion.div
              
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              
            >
              <Card className="glass-effect rounded-2xl border-0 shadow-lg mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    New Journal Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Writing Prompts */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      Need inspiration? Try a prompt:
                    </label>
                    <div className="grid gap-2">
                      {WRITING_PROMPTS.slice(0, 3).map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectPrompt(prompt)}
                          className="text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-blue-200 text-sm text-blue-700 transition-all duration-200"
                        >
                          ✨ {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Before Writing */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      How are you feeling before writing?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setMoodBefore(emoji)}
                          className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                            moodBefore === emoji 
                              ? "bg-blue-100 border-2 border-blue-300 scale-110" 
                              : "hover:bg-blue-50"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Entry Title (Optional)
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your entry a title..."
                      className="border-purple-200 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Your Thoughts
                    </label>
                    <Textarea
                      id="journal-content-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Pour your heart out here... What's on your mind?"
                      className="border-purple-200 focus:border-purple-400 rounded-xl min-h-[200px]"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Tags (Optional)
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="work, family, dreams, growth (comma separated)"
                      className="border-purple-200 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  {/* Mood After Writing */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-3">
                      How do you feel after writing?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setMoodAfter(emoji)}
                          className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                            moodAfter === emoji 
                              ? "bg-purple-100 border-2 border-purple-300 scale-110" 
                              : "hover:bg-purple-50"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowNewEntry(false)}
                      variant="outline"
                      className="flex-1 border-purple-200 hover:bg-purple-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !content.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                    >
                      {isSubmitting ? "Saving..." : "Save Entry"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Entries */}
        <div className="space-y-6">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                
              >
                <Card className="glass-effect rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-purple-800">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-purple-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.mood_before && (
                          <div className="flex items-center gap-1 text-sm bg-blue-50 px-2 py-1 rounded-full">
                            <span>{entry.mood_before}</span>
                            <span className="text-blue-600">→</span>
                            <span>{entry.mood_after || "✨"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entry.prompt && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl mb-4 border border-blue-100">
                        <p className="text-sm text-blue-700 italic">
                          Prompt: {entry.prompt}
                        </p>
                      </div>
                    )}
                    <div className="prose prose-purple max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {entry.content || ""}
                      </p>
                    </div>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {entry.tags.map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Your Journal Awaits</h3>
              <p className="text-purple-500 mb-6">Start your first entry and begin your journey of self-reflection</p>
              <Button
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-8 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Write Your First Entry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
