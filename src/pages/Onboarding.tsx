
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, ChartBar, BookmarkCheck, MessageSquare, BarChart3, Flag } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to AI Trading Platform</h1>
        <p className="text-lg text-muted-foreground">
          Let's get you started with our powerful AI-driven trading tools
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              AI Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Train and deploy AI models for market prediction:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access pre-trained models</li>
              <li>Customize model parameters</li>
              <li>Monitor performance metrics</li>
              <li>View detailed analytics</li>
            </ul>
            <Button onClick={() => navigate("/models")} className="w-full">
              Explore Models
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Market Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Get real-time market predictions:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View price forecasts</li>
              <li>Analyze market trends</li>
              <li>Track forecast accuracy</li>
              <li>Customize timeframes</li>
            </ul>
            <Button onClick={() => navigate("/forecast")} className="w-full">
              View Forecasts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBar className="mr-2 h-5 w-5 text-primary" />
              Model Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Compare different AI models:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Side-by-side performance metrics</li>
              <li>Historical accuracy comparison</li>
              <li>Strategy evaluation</li>
              <li>Risk assessment</li>
            </ul>
            <Button onClick={() => navigate("/ai-model-comparison")} className="w-full">
              Compare Models
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookmarkCheck className="mr-2 h-5 w-5 text-primary" />
              Strategy Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Access and manage trading strategies:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Browse strategy templates</li>
              <li>Customize parameters</li>
              <li>Backtest performance</li>
              <li>Deploy strategies</li>
            </ul>
            <Button onClick={() => navigate("/strategy-library")} className="w-full">
              View Strategies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Get help from our AI chatbot:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ask trading questions</li>
              <li>Get market insights</li>
              <li>Analyze strategies</li>
              <li>Receive recommendations</li>
            </ul>
            <Button onClick={() => navigate("/chatbot")} className="w-full">
              Chat with AI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Quick tips to get started:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Visit the Dashboard for an overview</li>
              <li>Train your first AI model</li>
              <li>Create a trading strategy</li>
              <li>Monitor performance</li>
            </ul>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => navigate("/dashboard")} size="lg" className="bg-primary">
          Start Trading
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Need help? Visit our AI chatbot for assistance or check the feature flags for experimental features.</p>
      </div>
    </div>
  );
};

export default Onboarding;
