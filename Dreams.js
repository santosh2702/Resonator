
import React, { useState, useEffect, useCallback } from "react";
import { Dream } from "@/entities/Dream";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Search, Filter, Sparkles, Heart, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Dreams() {
  const [dreams, setDreams] = useState([]);
  const [filteredDreams, setFilteredDreams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const dreamData = await Dream.list("-created_date", 50);
      setDreams(dreamData);
    } catch (error) {
      console.error("Failed to load dreams:", error);
    }
    setIsLoading(false);
  };

  const filterDreams = useCallback(() => {
    let filtered = dreams;

    if (searchTerm.trim()) {
      filtered = filtered.filter(dream => 
        dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter(dream => dream.sentiment_label === sentimentFilter);
    }

    setFilteredDreams(filtered);
  }, [dreams, searchTerm, sentimentFilter]);

  useEffect(() => {
    filterDreams();
  }, [filterDreams]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "very_positive": return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
      case "positive": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "neutral": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "negative": return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "very_negative": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-purple-400 bg-purple-500/20 border-purple-500/30";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "very_positive":
      case "positive":
        return <Heart className="w-4 h-4" />;
      case "neutral":
        return <Brain className="w-4 h-4" />;
      default:
        return <Moon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Dream
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"> Gallery</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Explore the collective unconscious through shared dreams and their AI-powered analysis.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <Input
              placeholder="Search dreams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-700/30 text-white placeholder-purple-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-purple-400 w-5 h-5" />
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-purple-700/30 text-white">
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-700/30">
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="very_positive">Very Positive</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="very_negative">Very Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Dreams Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-6 bg-purple-800/30 rounded"></div>
                    <div className="h-4 bg-purple-800/20 rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-purple-800/20 rounded"></div>
                      <div className="h-4 bg-purple-800/20 rounded"></div>
                      <div className="h-4 bg-purple-800/20 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              key="dreams-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-slate-900/50 border-purple-800/30 backdrop-blur-xl hover:bg-slate-900/70 transition-all duration-300 h-full">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                          {dream.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(dream.sentiment_label)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getSentimentColor(dream.sentiment_label)} border`}>
                          {dream.sentiment_label?.replace(/_/g, ' ')}
                        </Badge>
                        {dream.sentiment_score && (
                          <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                            {(dream.sentiment_score * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-purple-200 text-sm line-clamp-3">
                        {dream.content}
                      </p>

                      {/* Emotions */}
                      {dream.emotions && dream.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dream.emotions.slice(0, 3).map((emotion, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                              {emotion}
                            </span>
                          ))}
                          {dream.emotions.length > 3 && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              +{dream.emotions.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Categories */}
                      {dream.categories && dream.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dream.categories.slice(0, 2).map((category, idx) => (
                            <span key={idx} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-purple-800/20">
                        <span className="text-xs text-purple-400">
                          {format(new Date(dream.created_date), "MMM d, yyyy")}
                        </span>
                        {dream.symbolism && dream.symbolism.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-yellow-400">
                            <Sparkles className="w-3 h-3" />
                            {dream.symbolism.length} symbols
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredDreams.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Moon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Dreams Found</h3>
            <p className="text-purple-300">
              {searchTerm || sentimentFilter !== "all" 
                ? "Try adjusting your filters to see more dreams." 
                : "Be the first to share a dream and contribute to the collective consciousness."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
