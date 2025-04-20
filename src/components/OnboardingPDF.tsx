
import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bullet: {
    marginLeft: 10,
  },
});

export const OnboardingPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>AI Trading Platform Onboarding Guide</Text>
      
      <Text style={styles.heading}>1. Dashboard Overview</Text>
      <View style={styles.bullet}>
        <Text style={styles.text}>• Your central hub for monitoring AI trading performance</Text>
        <Text style={styles.text}>• Real-time market insights and model performance metrics</Text>
        <Text style={styles.text}>• Quick access to key trading tools and strategies</Text>
      </View>

      <Text style={styles.heading}>2. AI Models</Text>
      <Text style={styles.subheading}>Features:</Text>
      <View style={styles.bullet}>
        <Text style={styles.text}>• Train and deploy custom AI models</Text>
        <Text style={styles.text}>• Customize model parameters</Text>
        <Text style={styles.text}>• Monitor performance metrics</Text>
        <Text style={styles.text}>• View detailed analytics</Text>
      </View>

      <Text style={styles.heading}>3. Market Forecasting</Text>
      <Text style={styles.subheading}>Key capabilities:</Text>
      <View style={styles.bullet}>
        <Text style={styles.text}>• View price forecasts</Text>
        <Text style={styles.text}>• Analyze market trends</Text>
        <Text style={styles.text}>• Track forecast accuracy</Text>
        <Text style={styles.text}>• Customize timeframes</Text>
      </View>

      <Text style={styles.heading}>4. Strategy Library</Text>
      <View style={styles.bullet}>
        <Text style={styles.text}>• Browse strategy templates</Text>
        <Text style={styles.text}>• Customize trading parameters</Text>
        <Text style={styles.text}>• Backtest performance</Text>
        <Text style={styles.text}>• Deploy strategies</Text>
      </View>

      <Text style={styles.heading}>Best Practices</Text>
      <View style={styles.bullet}>
        <Text style={styles.text}>• Start with small, controlled trades</Text>
        <Text style={styles.text}>• Continuously monitor and adjust strategies</Text>
        <Text style={styles.text}>• Use backtesting to validate approach</Text>
        <Text style={styles.text}>• Leverage AI insights, but maintain human oversight</Text>
      </View>

      <Text style={styles.heading}>Disclaimer</Text>
      <Text style={styles.text}>Trading involves financial risk. Always conduct thorough research and consider consulting with a financial advisor.</Text>
    </Page>
  </Document>
);

export default OnboardingPDF;

