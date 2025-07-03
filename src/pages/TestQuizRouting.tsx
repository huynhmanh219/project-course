import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const TestQuizRouting: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Routing Test</h1>
      
      <div className="space-y-4">
        <Button onClick={() => navigate('/student/quiz')}>
          Go to Quiz List
        </Button>
        
        <Button onClick={() => navigate('/student/quiz/9/take')}>
          Take Quiz 9
        </Button>
        
        <Button onClick={() => navigate('/student/quiz/9/result')}>
          Quiz 9 Result
        </Button>
        
        <Button onClick={() => navigate('/student/quiz/history')}>
          Quiz History
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3>Debug Info</h3>
        <p>Current URL: {window.location.href}</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TestQuizRouting; 