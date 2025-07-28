import express from 'express';
import gemini from '../gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("🔁 Generating quiz question...");

    // Get level from request, default to 1
    const level = req.body.level || 1;
    const excludeQuestions = req.body.excludeQuestions || [];
    const timestamp = req.body.timestamp || Date.now();
    
    // Add randomization topics to ensure variety
    const topics = [
      'password security', 'phishing attacks', 'social engineering', 'malware protection',
      'network security', 'data privacy', 'two-factor authentication', 'secure browsing',
      'email security', 'mobile security', 'ransomware', 'identity theft',
      'secure communication', 'backup strategies', 'software updates', 'public WiFi safety'
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    let prompt;
    if (level === 1) {
      prompt = `Generate a unique, beginner-friendly multiple-choice question about ${randomTopic} in cybersecurity. Focus on practical, everyday scenarios that beginners can relate to. Include 4 options, the correct answer, and a short, friendly explanation. Make sure this is different from previous questions. Current timestamp: ${timestamp}. Return JSON: {question, options, answer, explanation}`;
    } else if (level === 2) {
      prompt = `Generate a unique, intermediate multiple-choice question about ${randomTopic} in cybersecurity. Focus on more technical concepts and real-world applications. Include 4 options, the correct answer, and a detailed explanation. Make sure this is different from previous questions. Current timestamp: ${timestamp}. Return JSON: {question, options, answer, explanation}`;
    } else {
      prompt = `Generate a unique, advanced multiple-choice question about ${randomTopic} in cybersecurity. Focus on complex scenarios, advanced threats, or technical implementations. Include 4 options, the correct answer, and a comprehensive explanation. Make sure this is different from previous questions. Current timestamp: ${timestamp}. Return JSON: {question, options, answer, explanation}`;
    }
    
    // Add excluded questions to prompt if any
    if (excludeQuestions.length > 0) {
      prompt += ` Avoid generating questions similar to these already asked: ${excludeQuestions.slice(-3).join(', ')}`;
    }

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let content = result.response.text();
    // Remove all code block markers (``` and ```json) from anywhere in the string
    content = content.replace(/```[a-zA-Z]*\n?|```/g, '').trim();
    console.log("✅ Gemini response:", content);

    // Robust JSON parsing and validation
    let data;
    try {
      data = JSON.parse(content);
      // Ensure options is an array of 4 unique strings
      if (!Array.isArray(data.options)) throw new Error("Options is not an array");
      data.options = [...new Set(data.options)].slice(0, 4);
      if (data.options.length < 4) throw new Error("Not enough unique options");
    } catch (err) {
      console.error("❌ Gemini JSON Parse/Validation Error:", err, content);
      return res.status(500).json({ error: 'Failed to generate valid quiz question.' });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    
    // Fallback: return random questions for development/demo
    const fallbackQuestions = [
      {
        question: "What is phishing?",
        options: [
          "A type of cyber attack to steal information",
          "A way to catch fish",
          "A programming language",
          "A secure login method"
        ],
        answer: "A type of cyber attack to steal information",
        explanation: "Phishing is a cyber attack where attackers trick users into revealing sensitive information."
      },
      {
        question: "Which password is the strongest?",
        options: [
          "password123",
          "MyP@ssw0rd!2024",
          "123456789",
          "qwerty"
        ],
        answer: "MyP@ssw0rd!2024",
        explanation: "Strong passwords should be long, include mixed characters, numbers, and symbols, and be unique."
      },
      {
        question: "What should you do before clicking a link in an email?",
        options: [
          "Click it immediately",
          "Verify the sender and hover over the link",
          "Forward it to friends",
          "Reply to the email"
        ],
        answer: "Verify the sender and hover over the link",
        explanation: "Always verify suspicious emails and check where links actually lead before clicking them."
      },
      {
        question: "What is two-factor authentication?",
        options: [
          "Using two passwords",
          "An extra security layer beyond passwords",
          "Having two email accounts",
          "Using both hands to type"
        ],
        answer: "An extra security layer beyond passwords",
        explanation: "Two-factor authentication adds an extra layer of security by requiring a second form of verification."
      },
      {
        question: "Which is the safest way to use public WiFi?",
        options: [
          "Connect to any open network",
          "Use a VPN or mobile data",
          "Share your password with others",
          "Never use any security"
        ],
        answer: "Use a VPN or mobile data",
        explanation: "Public WiFi can be insecure. Using a VPN or mobile data provides better protection."
      }
    ];
    
    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    return res.json(randomQuestion);
  }
});

export default router;