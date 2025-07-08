import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, BookOpen, Globe, CheckCircle, XCircle, Trophy } from 'lucide-react';
import * as XLSX from 'xlsx';

const VocabularyGame = () => {
  const [words, setWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState('enToHeb'); // 'enToHeb' or 'hebToEn'
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState(null);

  // Load words from Excel file
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/word.xlsx');
        if (!response.ok) {
          throw new Error('File not found');
        }
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and convert to word objects
        const wordPairs = jsonData.slice(1).map(row => ({
          english: row[0]?.toString().trim(),
          hebrew: row[1]?.toString().trim()
        })).filter(pair => pair.english && pair.hebrew);
        
        setWords(wordPairs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading file:', error);
        setFileError('לא ניתן לטעון את הקובץ. אנא ודא שהקובץ word.xlsx נמצא בתיקיית public.');
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  // Generate a new question
  const generateQuestion = () => {
    if (words.length === 0) return;

    const randomIndex = Math.floor(Math.random() * words.length);
    const correctAnswer = words[randomIndex];
    
    // Get 3 random wrong answers
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const randomWrongIndex = Math.floor(Math.random() * words.length);
      const wrongAnswer = words[randomWrongIndex];
      
      if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    // Create options array and shuffle
    const options = [correctAnswer, ...wrongAnswers];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setCurrentQuestion({
      word: gameMode === 'enToHeb' ? correctAnswer.english : correctAnswer.hebrew,
      correct: correctAnswer,
      options: options,
      language: gameMode === 'enToHeb' ? 'english' : 'hebrew'
    });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    setShowResult(true);
    setQuestionsAnswered(prev => prev + 1);
    
    if (option === currentQuestion.correct) {
      setScore(prev => prev + 1);
    }
  };

  // Start new game
  const startNewGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    generateQuestion();
  };

  // Switch game mode
  const switchGameMode = (mode) => {
    setGameMode(mode);
    setScore(0);
    setQuestionsAnswered(0);
    setCurrentQuestion(null);
  };

  // Initialize first question when words are loaded
  useEffect(() => {
    if (words.length > 0 && !currentQuestion) {
      generateQuestion();
    }
  }, [words]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">טוען את קובץ המילים...</p>
        </div>
      </div>
    );
  }

  if (fileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">שגיאה בטעינת הקובץ</h2>
          <p className="text-red-600">{fileError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">משחק אוצר מילים</h1>
          </div>
          
          {/* Score */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">
                {score} / {questionsAnswered}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              סה"כ מילים: {words.length}
            </div>
          </div>

          {/* Game Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => switchGameMode('enToHeb')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                gameMode === 'enToHeb'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              אנגלית → עברית
            </button>
            <button
              onClick={() => switchGameMode('hebToEn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                gameMode === 'hebToEn'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className="w-4 h-4" />
              עברית → אנגלית
            </button>
          </div>
        </div>

        {/* Game Area */}
        {currentQuestion ? (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {/* Question */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-4">
                {gameMode === 'enToHeb' ? 'מהי התרגום של המילה:' : 'What is the translation of:'}
              </p>
              <div className="text-4xl font-bold text-gray-800 bg-gray-50 rounded-lg py-4 px-6">
                {currentQuestion.word}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correct;
                const isSelected = selectedAnswer === option;
                let buttonClass = 'w-full p-4 rounded-lg border-2 font-medium transition-all text-lg ';
                
                if (!showResult) {
                  buttonClass += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white text-gray-700';
                } else if (isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-700';
                } else if (isSelected) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-700';
                } else {
                  buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{gameMode === 'enToHeb' ? option.hebrew : option.english}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {showResult && (
              <div className="text-center">
                <div className={`text-xl font-bold mb-4 ${
                  selectedAnswer === currentQuestion.correct ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedAnswer === currentQuestion.correct ? '✅ נכון!' : '❌ טעות'}
                </div>
                <button
                  onClick={generateQuestion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  מילה הבאה
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={startNewGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all"
            >
              התחל משחק חדש
            </button>
          </div>
        )}

        {/* Statistics */}
        {questionsAnswered > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">סטטיסטיקות</h3>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((score / questionsAnswered) * 100)}%
            </div>
            <p className="text-gray-600">דיוק כולל</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyGame;