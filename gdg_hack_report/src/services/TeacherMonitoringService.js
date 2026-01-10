// Teacher Monitoring Service - Monitors what teacher is teaching
// Uses Web Speech API (works offline in Chrome) for speech recognition
// Compares with expected curriculum topics

class TeacherMonitoringService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.currentTopic = '';
    this.sessionData = [];
    this.onTopicScore = 0;
    this.offTopicSegments = [];
    this.suggestions = [];
    this.dbName = 'EduPulseTeacherDB';
  }

  // Curriculum topics database (can be expanded)
  curriculumTopics = {
    mathematics: {
      'quadratic equations': [
        'quadratic', 'equation', 'ax squared', 'bx', 'polynomial', 'degree 2',
        'factorization', 'roots', 'discriminant', 'formula', 'parabola',
        'coefficient', 'variable', 'solution', 'factor', 'completing the square'
      ],
      'linear equations': [
        'linear', 'straight line', 'slope', 'intercept', 'y equals mx plus b',
        'gradient', 'coordinate', 'axis', 'graph', 'variable', 'constant'
      ],
      'trigonometry': [
        'sine', 'cosine', 'tangent', 'angle', 'triangle', 'hypotenuse',
        'opposite', 'adjacent', 'degree', 'radian', 'pythagoras', 'ratio'
      ],
      'algebra': [
        'variable', 'expression', 'equation', 'polynomial', 'factor',
        'simplify', 'solve', 'substitute', 'coefficient', 'term'
      ],
      'geometry': [
        'angle', 'triangle', 'circle', 'square', 'rectangle', 'polygon',
        'area', 'perimeter', 'volume', 'congruent', 'similar', 'parallel'
      ]
    },
    science: {
      'photosynthesis': [
        'chlorophyll', 'sunlight', 'carbon dioxide', 'oxygen', 'glucose',
        'plant', 'leaf', 'chloroplast', 'energy', 'water', 'stoma'
      ],
      'newton laws': [
        'force', 'mass', 'acceleration', 'inertia', 'motion', 'action',
        'reaction', 'velocity', 'momentum', 'friction', 'newton'
      ],
      'atoms': [
        'electron', 'proton', 'neutron', 'nucleus', 'orbit', 'element',
        'atomic number', 'mass number', 'isotope', 'ion', 'charge'
      ]
    },
    english: {
      'grammar': [
        'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition',
        'conjunction', 'sentence', 'clause', 'phrase', 'tense', 'subject', 'object'
      ],
      'literature': [
        'poem', 'story', 'character', 'plot', 'theme', 'metaphor',
        'simile', 'imagery', 'author', 'narrative', 'setting'
      ]
    },
    history: {
      'independence': [
        'freedom', 'british', 'gandhi', 'nehru', 'partition', 'struggle',
        'movement', 'salt march', 'quit india', 'independence', 'colony'
      ],
      'ancient india': [
        'indus valley', 'harappa', 'mohenjo daro', 'vedic', 'maurya',
        'gupta', 'ashoka', 'civilization', 'empire', 'dynasty'
      ]
    }
  };

  // Initialize speech recognition
  initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported, using simulation mode');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN'; // Indian English
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        this.transcript += finalTranscript;
        this.analyzeSegment(finalTranscript);
      }
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.transcript, interimTranscript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onError) {
        this.onError(event.error);
      }
    };
    
    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart recognition if it stopped unexpectedly
        this.recognition.start();
      }
    };
    
    return true;
  }

  // Start monitoring
  startMonitoring(topic, subject, callbacks = {}) {
    this.currentTopic = topic.toLowerCase();
    this.currentSubject = subject.toLowerCase();
    this.transcript = '';
    this.sessionData = [];
    this.onTopicScore = 0;
    this.offTopicSegments = [];
    this.suggestions = [];
    this.sessionStartTime = new Date();
    
    this.onTranscriptUpdate = callbacks.onTranscript;
    this.onAnalysisUpdate = callbacks.onAnalysis;
    this.onError = callbacks.onError;
    
    if (this.recognition) {
      try {
        this.recognition.start();
        this.isListening = true;
        return { success: true, mode: 'live' };
      } catch (error) {
        console.error('Failed to start recognition:', error);
        this.isListening = true;
        this.startSimulation();
        return { success: true, mode: 'simulation' };
      }
    } else {
      // Start simulation mode
      this.isListening = true;
      this.startSimulation();
      return { success: true, mode: 'simulation' };
    }
  }

  // Stop monitoring
  stopMonitoring() {
    this.isListening = false;
    
    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    
    return this.generateReport();
  }

  // Analyze a speech segment
  analyzeSegment(text) {
    const words = text.toLowerCase().split(/\s+/);
    const topicKeywords = this.getTopicKeywords();
    
    let matchCount = 0;
    let totalWords = words.length;
    const matchedKeywords = [];
    
    words.forEach(word => {
      if (topicKeywords.includes(word) || this.isRelatedWord(word, topicKeywords)) {
        matchCount++;
        matchedKeywords.push(word);
      }
    });
    
    const segmentScore = totalWords > 0 ? (matchCount / Math.max(totalWords * 0.3, 1)) * 100 : 0;
    const isOnTopic = segmentScore >= 30 || matchCount >= 2;
    
    const segmentAnalysis = {
      text,
      timestamp: new Date().toISOString(),
      score: Math.min(segmentScore, 100),
      isOnTopic,
      matchedKeywords,
      wordCount: totalWords
    };
    
    this.sessionData.push(segmentAnalysis);
    
    if (!isOnTopic && totalWords > 5) {
      this.offTopicSegments.push({
        text: text.substring(0, 100),
        timestamp: segmentAnalysis.timestamp
      });
    }
    
    // Update overall score
    this.calculateOverallScore();
    
    if (this.onAnalysisUpdate) {
      this.onAnalysisUpdate(this.getAnalysis());
    }
    
    return segmentAnalysis;
  }

  // Get keywords for current topic
  getTopicKeywords() {
    const subject = this.curriculumTopics[this.currentSubject];
    if (!subject) return [];
    
    // Find matching topic
    for (const [topic, keywords] of Object.entries(subject)) {
      if (this.currentTopic.includes(topic) || topic.includes(this.currentTopic)) {
        return keywords;
      }
    }
    
    // Return general subject keywords
    return Object.values(subject).flat();
  }

  // Check if word is related to keywords
  isRelatedWord(word, keywords) {
    return keywords.some(keyword => {
      return word.includes(keyword.substring(0, 4)) || 
             keyword.includes(word.substring(0, 4));
    });
  }

  // Calculate overall on-topic score
  calculateOverallScore() {
    if (this.sessionData.length === 0) {
      this.onTopicScore = 0;
      return;
    }
    
    const totalScore = this.sessionData.reduce((sum, seg) => sum + seg.score, 0);
    const onTopicCount = this.sessionData.filter(seg => seg.isOnTopic).length;
    
    this.onTopicScore = Math.round((onTopicCount / this.sessionData.length) * 100);
  }

  // Get current analysis
  getAnalysis() {
    const totalDuration = this.sessionStartTime 
      ? Math.round((new Date() - this.sessionStartTime) / 1000 / 60) 
      : 0;
    
    const onTopicMinutes = Math.round(totalDuration * (this.onTopicScore / 100));
    const offTopicMinutes = totalDuration - onTopicMinutes;
    
    return {
      onTopicPercentage: this.onTopicScore,
      offTopicPercentage: 100 - this.onTopicScore,
      totalDuration,
      onTopicMinutes,
      offTopicMinutes,
      segmentsAnalyzed: this.sessionData.length,
      offTopicInstances: this.offTopicSegments.length,
      status: this.getStatus(),
      transcript: this.transcript
    };
  }

  // Get status based on score
  getStatus() {
    if (this.onTopicScore >= 85) return 'Excellent';
    if (this.onTopicScore >= 75) return 'Exemplary';
    if (this.onTopicScore >= 60) return 'Good';
    if (this.onTopicScore >= 45) return 'Needs Improvement';
    return 'Off Track';
  }

  // Generate suggestions for improvement
  generateSuggestions() {
    const suggestions = [];
    
    if (this.onTopicScore < 75) {
      suggestions.push({
        type: 'focus',
        message: 'Try to stay more focused on the main topic keywords',
        priority: 'high'
      });
    }
    
    if (this.offTopicSegments.length > 3) {
      suggestions.push({
        type: 'digression',
        message: 'Reduce off-topic digressions to improve lecture clarity',
        priority: 'medium'
      });
    }
    
    const topicKeywords = this.getTopicKeywords();
    const usedKeywords = new Set(this.sessionData.flatMap(s => s.matchedKeywords));
    const unusedKeywords = topicKeywords.filter(k => !usedKeywords.has(k)).slice(0, 5);
    
    if (unusedKeywords.length > 0) {
      suggestions.push({
        type: 'coverage',
        message: `Consider covering these concepts: ${unusedKeywords.join(', ')}`,
        priority: 'low'
      });
    }
    
    if (this.sessionData.length > 0) {
      const avgWordsPerSegment = this.sessionData.reduce((sum, s) => sum + s.wordCount, 0) / this.sessionData.length;
      if (avgWordsPerSegment < 10) {
        suggestions.push({
          type: 'pacing',
          message: 'Try to speak in longer, more complete sentences',
          priority: 'low'
        });
      }
    }
    
    return suggestions;
  }

  // Generate final report
  generateReport() {
    const analysis = this.getAnalysis();
    const suggestions = this.generateSuggestions();
    
    return {
      ...analysis,
      topic: this.currentTopic,
      subject: this.currentSubject,
      sessionEnd: new Date().toISOString(),
      sessionStart: this.sessionStartTime?.toISOString(),
      suggestions,
      offTopicSegments: this.offTopicSegments.slice(0, 5),
      grade: this.calculateGrade(),
      detailedAnalysis: this.sessionData.slice(-10) // Last 10 segments
    };
  }

  // Calculate grade
  calculateGrade() {
    if (this.onTopicScore >= 90) return 'A+';
    if (this.onTopicScore >= 85) return 'A';
    if (this.onTopicScore >= 80) return 'B+';
    if (this.onTopicScore >= 75) return 'B';
    if (this.onTopicScore >= 70) return 'C+';
    if (this.onTopicScore >= 60) return 'C';
    if (this.onTopicScore >= 50) return 'D';
    return 'F';
  }

  // Simulation mode for demo/offline
  startSimulation() {
    const samplePhrases = [
      "Let's start with quadratic equations today",
      "A quadratic equation has the form ax squared plus bx plus c equals zero",
      "The discriminant helps us find the nature of roots",
      "We can solve this using the quadratic formula",
      "Let me give you a real world example",
      "Remember to factor the polynomial first",
      "The coefficient of x squared must not be zero",
      "Now let's practice some problems",
      "Can anyone tell me the formula for roots",
      "The parabola opens upward when a is positive",
      "Let's take a short break here",
      "Now back to our main topic",
      "The roots can be real or complex",
      "By the way, did you watch yesterday's match?",
      "Coming back to mathematics...",
      "Factorization is another method to solve quadratics"
    ];
    
    let index = 0;
    
    this.simulationInterval = setInterval(() => {
      if (!this.isListening) {
        clearInterval(this.simulationInterval);
        return;
      }
      
      const phrase = samplePhrases[index % samplePhrases.length];
      this.transcript += phrase + '. ';
      this.analyzeSegment(phrase);
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.transcript, '');
      }
      
      index++;
    }, 3000);
  }

  // Store session data offline
  async saveSession(sessionData) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('teacherSessions')) {
          db.createObjectStore('teacherSessions', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['teacherSessions'], 'readwrite');
        const store = transaction.objectStore('teacherSessions');
        
        store.add({
          ...sessionData,
          savedAt: new Date().toISOString()
        });
        
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }
}

export const teacherMonitoringService = new TeacherMonitoringService();
export default TeacherMonitoringService;
