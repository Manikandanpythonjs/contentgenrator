import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Loader2, Calendar } from 'lucide-react';
import { PlatformSelector } from './components/PlatformSelector';
import DatePicker from 'react-datepicker';
import type { Platform, ContentType, GeneratedContent } from './types';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('post');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [schedule, setSchedule] = useState<Date | null>(null); // State for the schedule

  const generateContent = async () => {
    if (!topic) return;

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Generate a ${contentType} for ${platform} about: ${topic}. 
        Make it engaging, using appropriate hashtags and formatting for the platform.
        Keep it within the platform's character limits if applicable.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setGeneratedContent({
        platform,
        type: contentType,
        content: text,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (date: Date | null) => {
    setSchedule(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              AI Social Media Content Generator
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Platform
              </label>
              <PlatformSelector
                selectedPlatform={platform}
                onSelect={setPlatform}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="flex gap-4">
                {(['post', 'thread', 'article'] as ContentType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={`px-4 py-2 rounded-lg capitalize ${contentType === type
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule (Optional)
              </label>
              <div className="flex items-center gap-4">
                <DatePicker
                  selected={schedule}
                  onChange={handleScheduleChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholderText="Select a date and time"
                />
                <Calendar className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic or Prompt
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your topic or what you want to post about..."
              />
            </div>



            <button
              onClick={generateContent}
              disabled={loading || !topic}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>

            {generatedContent && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
                <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                  {generatedContent.content}
                </div>
                {schedule && (
                  <p className="mt-4 text-sm text-gray-600">
                    Scheduled for: {schedule.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
