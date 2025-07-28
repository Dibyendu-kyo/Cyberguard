import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './styles.css';
import userImg from './images/user.png';
import hackerImg from './images/hacker.png';

import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const MAX_HEALTH = 5;
const QUESTIONS_PER_ROUND = 5;



function App() {
  const [question, setQuestion] = useState(null);
  const [userHealth, setUserHealth] = useState(MAX_HEALTH);
  const [hackerHealth, setHackerHealth] = useState(MAX_HEALTH);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [questionNum, setQuestionNum] = useState(1);
  const [points, setPoints] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const winSound = useRef(null);
  const loseSound = useRef(null);

  // Initialize audio volume when component mounts
  useEffect(() => {
    if (correctSound.current) correctSound.current.volume = 0.8;
    if (wrongSound.current) wrongSound.current.volume = 0.8;
    if (winSound.current) winSound.current.volume = 0.8;
    if (loseSound.current) loseSound.current.volume = 0.8;
  }, []);

  // Generate random anime avatar
  const generateAnimeAvatar = (uid) => {
    const avatarStyles = ['adventurer', 'avataaars', 'big-smile', 'bottts', 'fun-emoji', 'micah', 'miniavs', 'open-peeps', 'personas', 'pixel-art'];
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${uid}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  };

  // Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Add custom anime avatar if Google photo is not available
        const userWithAvatar = {
          ...firebaseUser,
          photoURL: firebaseUser.photoURL || generateAnimeAvatar(firebaseUser.uid)
        };
        setUser(userWithAvatar);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert('Sign in failed.');
    }
    setAuthLoading(false);
  };

  // Sign out
  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Save score to Firestore
  const saveScore = async () => {
    if (!user) return;
    try {
      console.log('Saving score:', { score: points, round: round, user: user.displayName });
      await addDoc(collection(db, 'leaderboard'), {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        score: points,
        round: round,
        timestamp: new Date()
      });
      console.log('Score saved successfully');
      // Refresh leaderboard after saving
      fetchLeaderboard();
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

  // Fetch leaderboard from Firestore
  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      console.log('Fetching leaderboard...');
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Leaderboard data:', leaderboardData);

      // Group by user and keep only the highest score for each user
      const userBestScores = {};
      leaderboardData.forEach(entry => {
        if (!userBestScores[entry.uid] || entry.score > userBestScores[entry.uid].score) {
          userBestScores[entry.uid] = entry;
        }
      });

      // Convert back to array and sort by score
      const uniqueLeaderboard = Object.values(userBestScores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      console.log('Processed leaderboard:', uniqueLeaderboard);
      setLeaderboard(uniqueLeaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard([]);
    }
    setLeaderboardLoading(false);
  };

  // Save score on game over
  useEffect(() => {
    if (gameOver && user) {
      saveScore();
    }
    // eslint-disable-next-line
  }, [gameOver, user]);

  useEffect(() => {
    if (showGame && !showRoundComplete) {
      fetchQuestion();
      fetchLeaderboard();
    }
    // eslint-disable-next-line
  }, [showGame, round, questionNum, showRoundComplete]);

  // Fallback questions in case API fails
  const fallbackQuestions = [
    {
      question: "Which of these is NOT a good password practice?",
      options: [
        "Using a different password for each account",
        "Using a password with at least 12 characters",
        "Using a password that includes numbers and symbols",
        "Using the same password for all your online accounts"
      ],
      answer: "Using the same password for all your online accounts",
      explanation: "Using the same password for multiple accounts is dangerous because if one account gets compromised, all your accounts become vulnerable."
    },
    {
      question: "What should you do if you receive a suspicious email asking for your personal information?",
      options: [
        "Reply with your information immediately",
        "Click on all the links to verify they're safe",
        "Delete the email and report it as spam",
        "Forward it to all your contacts"
      ],
      answer: "Delete the email and report it as spam",
      explanation: "Suspicious emails asking for personal information are likely phishing attempts. Never provide personal information via email and always report such emails."
    },
    {
      question: "Which of these is a sign of a phishing website?",
      options: [
        "HTTPS encryption (padlock icon)",
        "Misspelled URLs or domain names",
        "Professional design and layout",
        "Contact information clearly displayed"
      ],
      answer: "Misspelled URLs or domain names",
      explanation: "Phishing websites often use URLs that look similar to legitimate sites but contain misspellings or different domains to trick users."
    },
    {
      question: "What is two-factor authentication (2FA)?",
      options: [
        "Using two different passwords",
        "An additional security step beyond just a password",
        "Having two email accounts",
        "Using both uppercase and lowercase letters"
      ],
      answer: "An additional security step beyond just a password",
      explanation: "Two-factor authentication adds an extra layer of security by requiring a second form of verification, like a code sent to your phone."
    },
    {
      question: "Which of these is the safest way to connect to the internet in public?",
      options: [
        "Use any available free WiFi",
        "Connect to networks without passwords",
        "Use your mobile data or a VPN",
        "Share your hotspot password with strangers"
      ],
      answer: "Use your mobile data or a VPN",
      explanation: "Public WiFi networks can be insecure. Using your mobile data or a VPN provides better protection for your online activities."
    }
  ];

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setResult(null);
    setExplanation('');

    try {
      let level = 1;
      if (round === 1) level = 1;
      else if (round === 2) level = 2;
      else level = 3;

      // Add timestamp to ensure fresh questions
      const res = await axios.post('/api/quiz', {
        level,
        timestamp: Date.now(),
        excludeQuestions: askedQuestions
      });

      // Check if we got a valid response
      if (res.data && res.data.question && res.data.options && res.data.answer) {
        // Avoid repeating questions in a round
        if (askedQuestions.includes(res.data.question)) {
          // If we've asked too many questions, use fallback
          if (askedQuestions.length >= fallbackQuestions.length) {
            setAskedQuestions([]);
          }
          fetchQuestion();
          return;
        }
        setQuestion(res.data);
        setAskedQuestions((prev) => [...prev, res.data.question]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('API failed, using fallback questions:', err);
      // Use fallback questions if API fails
      const availableQuestions = fallbackQuestions.filter(q => !askedQuestions.includes(q.question));

      if (availableQuestions.length === 0) {
        // Reset asked questions if we've used all fallback questions
        setAskedQuestions([]);
        const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
        setQuestion(randomQuestion);
        setAskedQuestions([randomQuestion.question]);
      } else {
        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        setQuestion(randomQuestion);
        setAskedQuestions((prev) => [...prev, randomQuestion.question]);
      }
    }
    setLoading(false);
  };

  const handleOptionClick = (option) => {
    if (selectedOption || gameOver) return;
    setSelectedOption(option);
    const isCorrect = option === question.answer;
    if (isCorrect) {
      setHackerHealth((h) => Math.max(0, h - 1));
      setResult('correct');
      setPoints((p) => p + 10);
      // Play correct sound with error handling and amplified volume
      if (correctSound.current) {
        correctSound.current.volume = 1.0; // Maximum volume
        correctSound.current.play().catch(e => console.log('Sound play failed:', e));
      }
    } else {
      setUserHealth((h) => Math.max(0, h - 1));
      setResult('wrong');
      // Play wrong sound with error handling and amplified volume
      if (wrongSound.current) {
        wrongSound.current.volume = 1.0; // Maximum volume
        wrongSound.current.play().catch(e => console.log('Sound play failed:', e));
      }
    }
    setExplanation(question.explanation);
  };

  useEffect(() => {
    if (userHealth === 0 || hackerHealth === 0) {
      setGameOver(true);
      setTimeout(() => {
        if (userHealth === 0 && loseSound.current) {
          loseSound.current.play().catch(e => console.log('Lose sound play failed:', e));
        }
        if (hackerHealth === 0 && winSound.current) {
          winSound.current.play().catch(e => console.log('Win sound play failed:', e));
        }
      }, 500);
    }
  }, [userHealth, hackerHealth]);

  const handleNext = () => {
    if (gameOver) return;
    if (questionNum < QUESTIONS_PER_ROUND) {
      setQuestionNum((n) => n + 1);
    } else {
      // End of round
      setShowRoundComplete(true);
    }
  };

  const handleRestart = () => {
    setUserHealth(MAX_HEALTH);
    setHackerHealth(MAX_HEALTH);
    setGameOver(false);
    setSelectedOption(null);
    setResult(null);
    setExplanation('');
    setRound(1);
    setQuestionNum(1);
    setPoints(0);
    setShowRoundComplete(false);
    setAskedQuestions([]);
    fetchQuestion();
  };

  const handleNextRound = () => {
    setRound((r) => r + 1);
    setQuestionNum(1);
    setUserHealth(MAX_HEALTH);
    setHackerHealth(MAX_HEALTH);
    setGameOver(false);
    setShowRoundComplete(false);
    setAskedQuestions([]);
  };

  return (
    <>
      {!showGame ? (
        <div className="hero-standard">
          <div className="hero-overlay"></div>
          <div className="hero-content">

            <h1 className="hero-title-standard">Sense Hacker</h1>
            <p className="hero-desc-standard">Gamified Cybersecurity Awareness Battle</p>
            <div className="hero-why">
              <h2>Why Play This Game?</h2>
              <p>Cyber threats are everywhere, and most attacks succeed because of simple human mistakes. <b>Sense Hacker</b> helps you spot and stop common scams, phishing, and social engineering tricks—while having fun! Sharpen your digital instincts and become your own best defense.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              {!user && (
                <>
                  <button className="site-btn-standard" onClick={handleSignIn} disabled={authLoading}>
                    {authLoading ? 'Signing in...' : 'Sign in with Google'}
                  </button>
                  <div style={{ color: '#f59e42', fontWeight: 500, marginTop: 4, fontSize: '1.05rem' }}>
                    Please sign in to play and appear on the leaderboard.
                  </div>
                </>
              )}
              {user && (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <img src={user.photoURL} alt="avatar" style={{ width: 40, borderRadius: '50%', verticalAlign: 'middle', marginRight: 8 }} />
                    <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{user.displayName}</span>
                    <button className="site-btn-standard" style={{ marginLeft: 16, padding: '8px 18px', fontSize: '1rem' }} onClick={handleSignOut}>Sign Out</button>
                  </div>
                  <button className="site-btn-standard" onClick={() => setShowGame(true)}>
                    Play the Game!
                  </button>
                  <button
                    className="site-btn-standard"
                    onClick={() => {
                      fetchLeaderboard();
                      setShowLeaderboard(true);
                    }}
                    style={{ marginTop: '10px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                  >
                    View Leaderboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="game-bg">
          <div className="game-overlay"></div>
          <div className="game-wrapper">
            {/* Gaming-style header bar with always-visible leaderboard */}
            <div className="game-header-bar">
              <div className="header-left">

                <div className="header-title-glow">Sense Hacker Quiz</div>
                <div className="header-round">Round <span>{round}</span></div>
                <div className="header-question">Q <span>{questionNum}/{QUESTIONS_PER_ROUND}</span></div>
                <div className="header-points">Points <span>{points}</span></div>
              </div>
              <div className="header-center">
                <div className="header-leaderboard">
                  <span className="leaderboard-title">Leaderboard
                    <button
                      onClick={fetchLeaderboard}
                      style={{
                        marginLeft: '10px',
                        padding: '2px 6px',
                        fontSize: '0.8rem',
                        background: 'rgba(59, 130, 246, 0.3)',
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        color: '#3b82f6',
                        cursor: 'pointer'
                      }}
                    >
                      ↻
                    </button>
                  </span>
                  <ul className="header-leaderboard-list">
                    {(() => {
                      // Always show top 5 and the logged-in user (even if not in top 5)
                      let entries = leaderboard.slice(0, 5);
                      let userEntry = user && leaderboard.find(e => e.uid === user.uid);
                      let userInTop = userEntry && entries.some(e => e.uid === user.uid);
                      if (userEntry && !userInTop) entries = [...entries, userEntry];
                      return entries.map((entry, idx) => (
                        <li key={entry.uid || idx} className={user && entry.uid === user.uid ? 'me' : ''}>
                          <img src={entry.photoURL || `/images/user.png`} alt="avatar" className="header-leaderboard-avatar" />
                          <span className="header-leaderboard-name">{entry.displayName || 'Anonymous'}</span>
                          <span className="header-leaderboard-score">{entry.score} pts</span>
                          <span className="header-leaderboard-round">R{entry.round}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>
              </div>
              <div className="header-right">
                {user ? (
                  <>
                    <img src={user.photoURL || `/images/user.png`} alt="avatar" className="header-user-avatar" />
                    <span className="header-user-name">{user.displayName}</span>
                    <button className="header-btn signout" onClick={handleSignOut}>Sign Out</button>
                  </>
                ) : (
                  <button className="header-btn signin" onClick={handleSignIn} disabled={authLoading}>
                    {authLoading ? 'Signing in...' : 'Sign in with Google'}
                  </button>
                )}
              </div>
            </div>
            {showLeaderboard && (
              <div className="leaderboard-modal">
                <h2>Leaderboard</h2>
                {leaderboardLoading ? (
                  <div>Loading...</div>
                ) : (
                  <ul className="leaderboard-list">
                    {leaderboard.length === 0 && <li>No scores yet.</li>}
                    {leaderboard.map((entry, idx) => (
                      <li key={idx} className={user && entry.uid === user.uid ? 'me' : ''}>
                        <span>
                          <img src={entry.photoURL} alt="avatar" style={{ width: 28, borderRadius: '50%', verticalAlign: 'middle', marginRight: 8 }} />
                          {entry.displayName || 'Anonymous'}
                        </span>
                        <span>{entry.score} pts (Round {entry.round})</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="site-btn-standard" style={{ padding: '8px 18px', fontSize: '1rem', marginTop: 18 }} onClick={() => setShowLeaderboard(false)}>Close</button>
              </div>
            )}
            {showRoundComplete ? (
              <div className="round-complete-modal">
                <h2>Round {round} Complete!</h2>
                <p>Great job! Get ready for the next round with harder questions.</p>
                <button className="next-btn-standard" onClick={handleNextRound}>Next Round</button>
              </div>
            ) : (
              <div className="battle-container-standard">
                <div className="side-standard user-standard">
                  <img src={userImg} alt="User" className="avatar-standard" />
                  <div className="name-standard">You</div>
                  <div className="healthbar-outer-standard">
                    <div className="healthbar-inner-standard user" style={{ width: `${(userHealth / MAX_HEALTH) * 100}%` }}></div>
                  </div>
                  <div className="health-label-standard">Health: {userHealth}</div>
                </div>
                <div className="center-standard">
                  <div className="question-card-standard">
                    {loading ? (
                      <div className="loading-standard">Loading...</div>
                    ) : (
                      <>
                        <div className="question-text-standard">{question?.question}</div>
                        <div className="options-standard">
                          {question?.options?.map((opt, idx) => (
                            <button
                              key={idx}
                              className={`option-btn-standard ${selectedOption === opt ? (opt === question.answer ? 'correct' : 'wrong') : ''}`}
                              onClick={() => handleOptionClick(opt)}
                              disabled={!!selectedOption || gameOver}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {selectedOption && (
                    <div className={`result-standard ${result}`}>{result === 'correct' ? 'Correct! Hacker loses health.' : 'Wrong! You lose health.'}</div>
                  )}
                  {explanation && <div className="explanation-standard">{explanation}</div>}
                  {selectedOption && !gameOver && (
                    <button className="next-btn-standard" onClick={handleNext}>Next Question</button>
                  )}
                  {gameOver && (
                    <div className="gameover-standard">
                      <div className="gameover-msg-standard">
                        {userHealth === 0 ? 'Game Over: You got hacked!' : 'You defeated the hacker!'}
                      </div>
                      <button className="restart-btn-standard" onClick={handleRestart}>Restart</button>
                    </div>
                  )}
                </div>
                <div className="side-standard hacker-standard">
                  <img src={hackerImg} alt="Hacker" className="avatar-standard" />
                  <div className="name-standard">Hacker</div>
                  <div className="healthbar-outer-standard">
                    <div className="healthbar-inner-standard hacker" style={{ width: `${(hackerHealth / MAX_HEALTH) * 100}%` }}></div>
                  </div>
                  <div className="health-label-standard">Health: {hackerHealth}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <audio ref={correctSound} src="/sound/_CLICK_%20Nice.mp3" preload="auto" />
      <audio ref={wrongSound} src="/sound/No%20_%20Sound%20Effect.mp3" preload="auto" />
      <audio ref={winSound} src="/sound/_CLICK_%20Nice.mp3" preload="auto" />
      <audio ref={loseSound} src="/sound/No%20_%20Sound%20Effect.mp3" preload="auto" />
    </>
  );
}

export default App;
