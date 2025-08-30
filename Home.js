import React, { useState } from "react";
import { Dream } from "@/entities/Dream";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Brain, Moon, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [dreamData, setDreamData] = useState({
    title: "",
    content: "",
    is_anonymous: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeDream = async () => {
    if (!dreamData.title.trim() || !dreamData.content.trim()) {
      setError("Please provide both a title and description for your dream.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisPrompt = `
        Analyze this dream for sentiment, emotions, symbolism, and mental health insights.
        Dream Title: "${dreamData.title}"
        Dream Content: "${dreamData.content}"

        Provide a comprehensive analysis including:
        1. Overall sentiment score (-1 to 1)
        2. Sentiment label (very_negative, negative, neutral, positive, very_positive)
        3. Identified emotions
        4. Dream categories/themes
        5. Symbolic interpretations
        6. Mental health indicators (if any)
        7. Possible correlations with global trends or collective concerns
        
        Be thorough but sensitive in your analysis.
      `;

      const analysis = await InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment_score: { type: "number" },
            sentiment_label: { 
              type: "string",
              enum: ["very_negative", "negative", "neutral", "positive", "very_positive"]
            },
            emotions: {
              type: "array",
              items: { type: "string" }
            },
            categories: {
              type: "array", 
              items: { type: "string" }
            },
            symbolism: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  interpretation: { type: "string" }
                }
              }
            },
            mental_health_indicators: {
              type: "array",
              items: { type: "string" }
            },
            global_trends_correlation: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const dreamRecord = await Dream.create({
        ...dreamData,
        ...analysis
      });

      setAnalysisResult({ ...analysis, id: dreamRecord.id });
      setDreamData({ title: "", content: "", is_anonymous: false });

    } catch (err) {
      setError("Failed to analyze your dream. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "very_positive": return "text-emerald-400 bg-emerald-500/20";
      case "positive": return "text-green-400 bg-green-500/20";
      case "neutral": return "text-blue-400 bg-blue-500/20";
      case "negative": return "text-orange-400 bg-orange-500/20";
      case "very_negative": return "text-red-400 bg-red-500/20";
      default: return "text-purple-400 bg-purple-500/20";
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Dream Engine
              <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Resonator
              </span>
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Share your dreams and discover the collective consciousness. 
              AI-powered analysis reveals hidden patterns and global sentiment trends.
            </p>
          </div>
        </motion.div>

        {error && (
          <Alert className="bg-red-500/20 border-red-500/30 text-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Dream Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <Moon className="w-6 h-6 text-purple-400" />
                Share Your Dream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-purple-200 text-lg font-medium">
                  Dream Title
                </Label>
                <Input
                  id="title"
                  placeholder="A mysterious journey through..."
                  value={dreamData.title}
                  onChange={(e) => setDreamData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-800/50 border-purple-700/30 text-white placeholder-purple-300 text-lg mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-purple-200 text-lg font-medium">
                  Dream Description
                </Label>
                <Textarea
                  id="content"
                  placeholder="Describe your dream in detail. What did you see, feel, or experience? Every detail matters for accurate analysis..."
                  value={dreamData.content}
                  onChange={(e) => setDreamData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-800/50 border-purple-700/30 text-white placeholder-purple-300 min-h-[200px] text-lg mt-2"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="anonymous"
                  checked={dreamData.is_anonymous}
                  onCheckedChange={(checked) => setDreamData(prev => ({ ...prev, is_anonymous: checked }))}
                />
                <Label htmlFor="anonymous" className="text-purple-200">
                  Share anonymously
                </Label>
              </div>

              <Button
                onClick={analyzeDream}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Analyzing Your Dream...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3" />
                    Analyze Dream
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Dream Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sentiment Analysis */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">Sentiment Analysis</h3>
                      <div className={`inline-flex px-4 py-2 rounded-full font-medium ${getSentimentColor(analysisResult.sentiment_label)}`}>
                        {analysisResult.sentiment_label?.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <p className="text-purple-300 mt-2">
                        Score: {analysisResult.sentiment_score?.toFixed(2)} / 1.0
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">Detected Emotions</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.emotions?.map((emotion, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200 mb-3">Dream Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.categories?.map((category, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Symbolism */}
                  {analysisResult.symbolism?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">Dream Symbolism</h3>
                      <div className="space-y-3">
                        {analysisResult.symbolism.map((item, idx) => (
                          <div key={idx} className="bg-slate-800/30 p-4 rounded-lg">
                            <span className="font-medium text-pink-300">{item.symbol}</span>
                            <p className="text-purple-200 mt-1">{item.interpretation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Global Trends */}
                  {analysisResult.global_trends_correlation?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">Global Trends Correlation</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.global_trends_correlation.map((trend, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
