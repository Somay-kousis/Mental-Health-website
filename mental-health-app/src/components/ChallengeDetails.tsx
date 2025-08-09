

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StepTracker from './StepTracker';

type Challenge = {
  title: string;
  emoji: string;
  description: string;
};
type DailyLog = {
  date: string;
  entry: string;
};


const challengeData: Record<string, Challenge>  = {
  "mindful-mornings": {
    title: "Mindful Mornings",
    emoji: "🎯",
    description: "Start your day with 10 minutes of mindfulness for 30 days."
  },

  "fitness-streak": {
    title: "Fitness Streak",
    emoji: "👟",
    description: "Exercise daily and log your progress for 21 days."
  },
  "healthy-eating": {title: "Healthy Eating", emoji: "🍎", description: "Share recipes and tips for a balanced diet for 14 days."},
   "30-day-mindfulness": {
    title: "30-Day Mindfulness Journey",
    emoji: "🌱",
    description: "Day 7 of 30 - Building mindful habits",
   
  },
  "home-workout": {
    title: "Home Workout Challenge",
    emoji: "✊🏻",
    description: "Day 12 of 21 - Keep moving at home",
    
  },
  "gratitude": {
    title: "Daily Gratitude Practice",
    emoji: "🎐",
    description: "Day 7 of 14 - Cultivating gratitude and positivity",
    
  },
  "hydration": {
    title: "Hydration Challenge",
    emoji: "🐳",
    description: "Day 3 of 10 - Drink more water!",
    
  },
  "digital-detox": {
    title: "Digital Detox Challenge",
    emoji: "👀",
    description: "Day 2 of 7 - Less screen time, more me time",
    
  },
  "morning-routine": {
    title: "Morning Routine Challenge",
    emoji: "🌬️",
    description: "Day 5 of 21 - Start your day right",
    
  },
  "kindness": {
    title: "Kindness Challenge",
    emoji: "🐁",
    description: "Day 1 of 7 - Spread kindness daily",
    
  }
};


const ChallengeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const challenge = challengeData[id || ""];
  const [log, setLog] = useState("");
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const token = localStorage.getItem("token"); // Assuming JWT stored here

useEffect(() => {
  const fetchLogs = async () => {
    const token = localStorage.getItem("token"); // Get token fresh
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
const res = await fetch(`http://localhost:5000/api/daily-logs/logs/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});


      if (!res.ok) {
        console.error("Failed to fetch logs:", res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Fetched logs:", data);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  if (id) {
    fetchLogs();
  }
}, [id]);


const handleLogSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  if (!log.trim()) return;

  const token = localStorage.getItem("token"); // Get token fresh
  if (!token) {
    console.error("No token found");
    return;
  }

try {
  console.log("Submitting log:", {
    challengeId: id,
    date: new Date().toISOString().slice(0, 10),
    entry: log
  });

const res = await fetch(`http://localhost:5000/api/daily-logs/log`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    challengeId: id,
    date: new Date().toISOString().slice(0, 10),
    entry: log
  })
});



  console.log("Response status:", res.status);
  const data = await res.json();
  console.log("Response data:", data);

  if (res.ok) {
    alert("✅ Log saved!");
    setLogs(prev => [data.log, ...prev]);
    setLog("");
  } else {
    alert("❌ Failed to save log: " + (data.message || "Unknown error"));
  }
} catch (err) {
  console.error("Error submitting log:", err);
  alert("❌ Something went wrong. Please try again.");
}

};



  if (!challenge) return <p>Challenge not found.</p>;

  return (
    <div className="challenge-details glass">
      <h1>{challenge.emoji} {challenge.title}</h1>
      <p>{challenge.description}</p>
      <p>Track your daily progress here...</p>

      {id === "fitness-streak" && <StepTracker />}

      {/* Daily Log Form */}
      <div className="daily-log-form">
        <h3>Log Today's Activity</h3>
        <textarea
          placeholder="What did you do today?"
          value={log}
          onChange={(e) => setLog(e.target.value)}
        />
        <button onClick={handleLogSubmit}>Submit Log</button>
      </div>

      {/* Display Previous Logs */}
      <div className="log-history">
        <h4>Your Previous Logs:</h4>
        {logs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <ul>
            {logs.map((log, idx) => (
              <li key={idx}>
                <strong>{log.date}:</strong> {log.entry}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


export default ChallengeDetails;
