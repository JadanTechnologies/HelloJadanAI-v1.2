import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Task } from '../types';

interface ProofSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (proof: string) => void;
    taskTitle: string;
}

const ProofSubmissionModal: React.FC<ProofSubmissionModalProps> = ({ isOpen, onClose, onSubmit, taskTitle }) => {
    const [proof, setProof] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(proof);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Submit Proof for: ${taskTitle}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="proof" className="block text-sm font-medium text-slate-300 mb-1">
                        Provide proof of completion (e.g., your username, a link to the shared post).
                    </label>
                    <textarea
                        id="proof"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        rows={3}
                        required
                    />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit for Review</Button>
                </div>
            </form>
        </Modal>
    );
};


const Tasks = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCompleteTask = (task: Task) => {
    if (task.status !== 'incomplete') return;
    
    if (task.requiresProof) {
        setSelectedTask(task);
        setIsProofModalOpen(true);
    } else {
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: task.id, status: 'completed' } });
    }
  };
  
  const handleProofSubmit = (proof: string) => {
    if (selectedTask) {
        console.log(`Submitting proof for task ${selectedTask.id}: ${proof}`);
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: selectedTask.id, status: 'pending' } });
    }
    setIsProofModalOpen(false);
    setSelectedTask(null);
  };

  const getTaskButton = (task: Task) => {
      switch (task.status) {
          case 'completed':
              return <Button disabled>Completed</Button>;
          case 'pending':
              return <Button disabled variant="secondary">Pending Review</Button>;
          case 'incomplete':
              return <Button onClick={() => handleCompleteTask(task)}>Complete</Button>;
      }
  };

  const renderTaskCard = (task: Task) => (
      <Card key={task.id} className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0">
              <h3 className="font-semibold text-lg text-white">{task.title}</h3>
              <p className="text-slate-400 text-sm">{task.description}</p>
          </div>
          <div className="flex items-center space-x-4">
              {task.targetUrl && (
                  <a href={task.targetUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary">Go to Task</Button>
                  </a>
              )}
              <div className="text-right">
                  <p className="font-bold text-lg text-brand-cyan mb-2">+{task.creditReward} {t('credits')}</p>
                  {getTaskButton(task)}
              </div>
          </div>
      </Card>
  );

  const taskCategories = {
      'Daily': state.tasks.filter(t => t.type === 'daily'),
      'Engagement': state.tasks.filter(t => ['engagement', 'social_follow', 'social_share', 'youtube_subscribe'].includes(t.type)),
      'Special': state.tasks.filter(t => ['profile', 'app_download'].includes(t.type)),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('tasksTitle')}</h1>
        <p className="text-slate-400 mt-1">More tasks, more credits, more creations!</p>
      </div>

      {Object.entries(taskCategories).map(([category, tasks]) => (
        tasks.length > 0 && (
          <div className="space-y-6" key={category}>
            <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">{category} Tasks</h2>
            {tasks.map(renderTaskCard)}
          </div>
        )
      ))}
      
      {selectedTask && (
        <ProofSubmissionModal 
            isOpen={isProofModalOpen}
            onClose={() => setIsProofModalOpen(false)}
            onSubmit={handleProofSubmit}
            taskTitle={selectedTask.title}
        />
      )}
    </div>
  );
};

export default Tasks;