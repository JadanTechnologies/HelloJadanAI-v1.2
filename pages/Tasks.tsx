import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleCompleteTask = (task: Task, isSponsored: boolean = false) => {
    if (task.status !== 'incomplete' || !state.user) return;
    
     if (isSponsored) {
        const campaign = state.campaigns.find(c => c.id === task.id);
        if (!campaign) return;

        // Sponsored tasks only give credits in this implementation
        dispatch({ type: 'UPDATE_CREDITS', payload: state.credits + task.rewardAmount });
        dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-camp-${Date.now()}`, description: `Sponsored Task: ${task.title}`, amount: task.rewardAmount, date: new Date().toISOString() } });
        
        const updatedCampaign = { 
            ...campaign, 
            budget: campaign.budget - campaign.cpa,
            completedActions: (campaign.completedActions || 0) + 1,
        };
        if (updatedCampaign.budget <= 0) {
            updatedCampaign.status = 'completed';
        }
        dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });

        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `You earned ${task.rewardAmount} credits for completing a sponsored task!`, type: 'success' } });
        
        if (task.targetUrl) {
            window.open(task.targetUrl, '_blank');
        }

    } else {
        if (task.requiresProof) {
            setSelectedTask(task);
            setIsProofModalOpen(true);
        } else {
            dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: task.id, userId: state.user.id, status: 'completed' } });
        }
    }
  };
  
  const handleProofSubmit = (proof: string) => {
    if (selectedTask && state.user) {
        console.log(`Submitting proof for task ${selectedTask.id}: ${proof}`);
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: selectedTask.id, userId: state.user.id, status: 'pending' } });
    }
    setIsProofModalOpen(false);
    setSelectedTask(null);
  };

  const getTaskButton = (task: Task, isSponsored: boolean = false) => {
      // For sponsored tasks, we assume they are always completable for this demo.
      if (isSponsored) {
          return <Button onClick={() => handleCompleteTask(task, true)}>Complete Task</Button>
      }

      switch (task.status) {
          case 'completed':
              return <Button disabled>Completed</Button>;
          case 'pending':
              return <Button disabled variant="secondary">Pending Review</Button>;
          case 'incomplete':
              return <Button onClick={() => handleCompleteTask(task)}>Complete</Button>;
      }
  };
  
  const renderReward = (task: Task) => {
    switch (task.rewardType) {
        case 'credits': return `+${task.rewardAmount} ${t('credits')}`;
        case 'data': return `+${task.rewardAmount} MB Data`;
        case 'airtime': return `+₦${task.rewardAmount} Airtime`;
        default: return '';
    }
  };

  const renderTaskCard = (task: Task, isSponsored: boolean = false) => (
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
                  <p className="font-bold text-lg text-brand-cyan mb-2">{renderReward(task)}</p>
                  {getTaskButton(task, isSponsored)}
              </div>
          </div>
      </Card>
  );

  const nonStudent = state.user?.role === 'content_creator' || state.user?.role === 'startup';

  const sponsoredTasks: Task[] = state.systemSettings.sponsoredTasksEnabled
    ? state.campaigns
        .filter(c => c.status === 'active')
        .map(c => ({
            id: c.id,
            title: c.productName,
            description: c.taskDescription,
            rewardAmount: c.userCreditReward,
            rewardType: 'credits',
            status: 'incomplete', // Assumed for all users in this demo
            type: 'engagement',
            targetUrl: c.targetUrl,
            requiresProof: c.taskType === 'signup',
        }))
    : [];
    
  const availableSystemTasks = nonStudent
    ? state.tasks.filter(t => t.rewardType === 'credits')
    : state.tasks;
    
  const allTasks = [...sponsoredTasks, ...availableSystemTasks];
  const filteredTasks = allTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const taskCategories = {
      'Sponsored': filteredTasks.filter(t => sponsoredTasks.some(st => st.id === t.id)),
      'Daily': filteredTasks.filter(t => t.type === 'daily'),
      'Engagement': filteredTasks.filter(t => ['engagement', 'social_follow', 'social_share', 'youtube_subscribe'].includes(t.type)),
      'Special': filteredTasks.filter(t => ['profile', 'app_download'].includes(t.type)),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('tasksTitle')}</h1>
        <p className="text-slate-400 mt-1">More tasks, more rewards, more creations!</p>
      </div>

      <Card>
        <Input 
            type="text"
            placeholder={t('searchTasks')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {Object.entries(taskCategories).map(([category, tasks]) => (
        tasks.length > 0 && (
          <div className="space-y-6" key={category}>
            <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">{category} Tasks</h2>
            {tasks.map(task => renderTaskCard(task, category === 'Sponsored'))}
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
