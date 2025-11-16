import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { Task } from '../types';
import { 
    UploadIcon,
    CalendarDaysIcon,
    ArrowUpRightIcon,
    IdentificationIcon,
    VideoIcon,
    UserPlusIcon,
    ShareIcon,
    DevicePhoneMobileIcon
} from '../constants';

interface ProofSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (proof: string) => void;
    taskTitle: string;
}

const ProofSubmissionModal: React.FC<ProofSubmissionModalProps> = ({ isOpen, onClose, onSubmit, taskTitle }) => {
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const clearProof = () => {
        setProofFile(null);
        setProofPreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (proofPreview) {
            onSubmit(proofPreview);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Submit Proof for: ${taskTitle}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="proof" className="block text-sm font-medium text-slate-300 mb-2">
                        Upload proof of completion (e.g., a screenshot).
                    </label>
                    {proofPreview ? (
                        <div className="relative group">
                            <img src={proofPreview} alt="Proof preview" className="w-full max-w-sm mx-auto rounded-lg border border-slate-700" />
                            <button type="button" onClick={clearProof} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-brand-cyan hover:text-brand-cyan transition cursor-pointer"
                        >
                            <UploadIcon className="w-10 h-10 mb-2" />
                            <span>Click to upload file</span>
                            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                        </div>
                    )}
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!proofFile}>Submit for Review</Button>
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

  const getTaskIcon = (taskType: Task['type']) => {
    const iconClass = "w-6 h-6 text-slate-500";
    switch (taskType) {
        case 'daily':
            return <CalendarDaysIcon className={iconClass} />;
        case 'profile':
            return <IdentificationIcon className={iconClass} />;
        case 'youtube_subscribe':
            return <VideoIcon className={iconClass} />;
        case 'social_follow':
            return <UserPlusIcon className={iconClass} />;
        case 'social_share':
            return <ShareIcon className={iconClass} />;
        case 'app_download':
            return <DevicePhoneMobileIcon className={iconClass} />;
        case 'engagement':
        default:
            return <ArrowUpRightIcon className={iconClass} />;
    }
  };

  const renderTaskCard = (task: Task, isSponsored: boolean = false) => (
      <Card key={task.id} className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0 flex items-start space-x-4">
              <div className="flex-shrink-0 pt-1">{getTaskIcon(task.type)}</div>
              <div>
                  <h3 className="font-semibold text-lg text-white">{task.title}</h3>
                  <p className="text-slate-400 text-sm">{task.description}</p>
              </div>
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
    
  const filterBySearch = (tasks: Task[]) => tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const taskCategories = {
      'Sponsored': filterBySearch(sponsoredTasks),
      'Daily': filterBySearch(availableSystemTasks.filter(t => t.type === 'daily')),
      'Engagement': filterBySearch(availableSystemTasks.filter(t => ['engagement', 'social_follow', 'social_share', 'youtube_subscribe'].includes(t.type))),
      'Profile': filterBySearch(availableSystemTasks.filter(t => t.type === 'profile')),
      'Special Offers': filterBySearch(availableSystemTasks.filter(t => ['app_download'].includes(t.type))),
  };


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