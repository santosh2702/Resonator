
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, Moon, TrendingUp, Sparkles, Home, BarChart3 } from "lucide-react";
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
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dream Portal",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Dream Gallery",
    url: createPageUrl("Dreams"),
    icon: Moon,
  },
  {
    title: "Global Insights",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style jsx>{`
        :root {
          --cosmic-purple: #6366f1;
          --deep-space: #0f0f23;
          --aurora-blue: #3b82f6;
          --dream-pink: #ec4899;
          --nebula-purple: #8b5cf6;
          --star-white: #f8fafc;
          --cosmic-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --aurora-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <Sidebar className="border-r border-purple-800/30 bg-slate-950/90 backdrop-blur-xl">
          <SidebarHeader className="border-b border-purple-800/30 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">Dream Engine</h2>
                <p className="text-xs text-purple-300">Resonator</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-300 rounded-xl mb-2 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                            : 'text-slate-300 hover:bg-purple-800/50 hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-2 py-2">
                Cosmic Insights
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-purple-200">Dreams Analyzed</span>
                    <span className="ml-auto font-semibold text-white">∞</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-purple-200">Global Sentiment</span>
                    <span className="ml-auto font-semibold text-green-400">+0.3</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-800/30 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">∂</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">Dream Explorer</p>
                <p className="text-xs text-purple-300 truncate">Mapping the collective unconscious</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Cosmic Background Effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-20 right-10 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-20 w-56 h-56 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>

          {/* Header with mobile trigger */}
          <header className="bg-slate-950/80 backdrop-blur-xl border-b border-purple-800/30 px-6 py-4 md:hidden relative z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-800/50 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-bold text-white">Dream Engine</h1>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
