
import React, { useState, useEffect, useCallback } from "react";
import { Dream, GlobalTrend } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Globe, Brain, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from "recharts";

export default function Analytics() {
  const [dreams, setDreams] = useState([]);
  const [globalTrends, setGlobalTrends] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // generateAnalytics is an internal helper, but since it's called by useCallback'd loadData,
  // and it uses state setters, it should either be memoized itself or ensure its dependencies are stable.
  // For now, let's keep it as is, assuming setAnalytics is stable.
  const generateAnalytics = (dreamData) => {
    if (!dreamData.length) return;

    // Sentiment distribution
    const sentimentCounts = dreamData.reduce((acc, dream) => {
      const sentiment = dream.sentiment_label || "neutral";
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
      sentiment: sentiment.replace(/_/g, ' '),
      count,
      percentage: ((count / dreamData.length) * 100).toFixed(1)
    }));

    // Average sentiment over time
    const avgSentiment = dreamData.reduce((sum, dream) => sum + (dream.sentiment_score || 0), 0) / dreamData.length;

    // Top emotions
    const allEmotions = dreamData.flatMap(dream => dream.emotions || []);
    const emotionCounts = allEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([emotion, count]) => ({ emotion, count }));

    // Categories distribution
    const allCategories = dreamData.flatMap(dream => dream.categories || []);
    const categoryData = allCategories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    setAnalytics({
      totalDreams: dreamData.length,
      avgSentiment: avgSentiment.toFixed(3),
      sentimentData,
      topEmotions,
      categoryData: Object.entries(categoryData).map(([category, count]) => ({ category, count })),
      mentalHealthIndicators: dreamData.filter(d => d.mental_health_indicators?.length > 0).length
    });
  };

  const loadData = useCallback(async () => {
    try {
      const [dreamData, trendData] = await Promise.all([
        Dream.list("-created_date", 100),
        GlobalTrend.list("-created_date", 20)
      ]);
      
      setDreams(dreamData);
      setGlobalTrends(trendData);
      // generateAnalytics depends on the latest dreamData, which is passed as an argument.
      // It also uses state setters (setAnalytics), which React guarantees to be stable.
      // So, generateAnalytics itself doesn't need to be in the dependency array of useCallback.
      generateAnalytics(dreamData);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    }
    setIsLoading(false);
  }, []); // Dependencies: empty array as it doesn't depend on any props or state from its scope that would change.
          // setDreams, setGlobalTrends, setIsLoading are state setters and stable. Dream.list, GlobalTrend.list are external functions.

  useEffect(() => {
    loadData();
  }, [loadData]); // Now loadData is a stable function reference due to useCallback

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "purple" }) => (
    <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-300 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {subtitle && <p className="text-sm text-purple-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-500/20`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Global
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"> Insights</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Discover patterns in the collective unconscious and global mental health trends.
          </p>
        </motion.div>

        {!isLoading && analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Dreams Analyzed"
                value={analytics.totalDreams}
                subtitle="Shared by dreamers worldwide"
                icon={Brain}
                color="purple"
              />
              <StatCard
                title="Global Sentiment"
                value={analytics.avgSentiment}
                subtitle="Average sentiment score"
                icon={TrendingUp}
                color="blue"
              />
              <StatCard
                title="Active Dreamers"
                value={new Set(dreams.map(d => d.created_by)).size}
                subtitle="Unique contributors"
                icon={Users}
                color="green"
              />
              <StatCard
                title="Mental Health Flags"
                value={analytics.mentalHealthIndicators}
                subtitle="Dreams with indicators"
                icon={Activity}
                color="orange"
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sentiment Distribution */}
              <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Sentiment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="sentiment" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #6366f1',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Emotions */}
              <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-pink-400" />
                    Most Common Emotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.topEmotions.slice(0, 6)}
                        dataKey="count"
                        nameKey="emotion"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ emotion, percent }) => `${emotion}: ${(percent * 100).toFixed(0)}%`} // Fixed label property
                      >
                        {analytics.topEmotions.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #ec4899',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Dream Categories */}
            <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Dream Categories & Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.categoryData.slice(0, 10)} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis type="category" dataKey="category" stroke="#9ca3af" width={120} /> {/* Increased width for categories */}
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #3b82f6',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Global Trends Correlation */}
            {globalTrends.length > 0 && (
              <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    Global Trends & Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {globalTrends.slice(0, 8).map((trend, index) => (
                      <motion.div
                        key={trend.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-800/30 rounded-lg"
                      >
                        <h4 className="font-semibold text-white mb-2">{trend.event_name}</h4>
                        <p className="text-sm text-purple-300 mb-2">{trend.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {trend.event_type}
                          </span>
                          <span className={`text-sm font-medium ${
                            trend.sentiment_impact > 0 ? 'text-green-400' : 
                            trend.sentiment_impact < 0 ? 'text-red-400' : 'text-blue-400'
                          }`}>
                            {trend.sentiment_impact > 0 ? '+' : ''}{(trend.sentiment_impact * 100).toFixed(0)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-purple-800/30 rounded w-2/3"></div>
                    <div className="h-8 bg-purple-800/30 rounded w-1/2"></div>
                    <div className="h-3 bg-purple-800/20 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
