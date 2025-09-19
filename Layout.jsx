import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, BookOpen, Heart, Headphones, MessageCircle, 
  Trophy, Calendar, Settings, Sparkles 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/ui/sidebar";
import { AudioPlayerProvider } from "@/Components/audio/AudioPlayerContext";
import AudioPlayer from "@/Components/audio/AudioPlayer";

const navigationItems = [
  {
    title: "Sanctuary",
    url: createPageUrl("Dashboard"),
    icon: Home,
    description: "Your personal space"
  },
  {
    title: "Mood Tracker", 
    url: createPageUrl("MoodTracker"),
    icon: Heart,
    description: "Track your emotions"
  },
  {
    title: "Journal",
    url: createPageUrl("Journal"),
    icon: BookOpen,
    description: "Reflect and write"
  },
  {
    title: "Meditations",
    url: createPageUrl("Meditations"), 
    icon: Sparkles,
    description: "Guided sessions"
  },
  {
    title: "Audio Library",
    url: createPageUrl("AudioLibrary"),
    icon: Headphones,
    description: "Healing sounds"
  },
  {
    title: "AI Chat",
    url: createPageUrl("AIChat"),
    icon: MessageCircle,
    description: "Inner conversations"
  },
  {
    title: "Challenges",
    url: createPageUrl("Challenges"),
    icon: Trophy,
    description: "Growth journeys"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <AudioPlayerProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <style>
            {`
              :root {
                --background: #FAFAF9;
                --card: #FFFFFF;
                --primary: #E879F9;
                --primary-soft: #F3E8FF;
                --secondary: #8B5CF6;
                --accent: #F97316;
                --muted: #F8FAFC;
                --text: #1E293B;
                --text-muted: #64748B;
                --border: #E2E8F0;
                --sage: #84CC16;
                --ocean: #0EA5E9;
              }
              
              body {
                background: linear-gradient(135deg, #FAFAF9 0%, #F1F5F9 100%);
              }
              
              .glass-effect {
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }
              
              .glow-soft {
                box-shadow: 0 4px 20px rgba(232, 121, 249, 0.15);
              }
            `}
          </style>
          
          <Sidebar className="border-r-0 bg-gradient-to-b from-white to-purple-50/30">
            <SidebarHeader className="border-b border-purple-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    MindKind
                  </h2>
                  <p className="text-xs text-purple-500">Your mental wellness sanctuary</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-3 py-3">
                  Wellness Journey
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group transition-all duration-300 rounded-xl mx-1 ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm border border-purple-200' 
                              : 'hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className={`w-5 h-5 transition-colors ${
                              location.pathname === item.url ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-500'
                            }`} />
                            <div className="flex-1">
                              <span className="font-medium text-sm">{item.title}</span>
                              <p className="text-xs text-purple-400 opacity-80">{item.description}</p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-purple-100 p-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white font-semibold">
                  🌸
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-purple-700 text-sm truncate">Welcome back!</p>
                  <p className="text-xs text-purple-500 truncate">Keep growing 💜</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100/50 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  MindKind
                </h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-gradient-to-br from-purple-50/30 via-white/50 to-pink-50/30">
              {children}
            </div>
            
            <AudioPlayer />
          </main>
        </div>
      </SidebarProvider>
    </AudioPlayerProvider>
  );
}