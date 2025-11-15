import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Tasks = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();

  const handleCompleteTask = (taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };
  
  const dailyTasks = state.tasks.filter(t => t.type === 'daily');
  const engagementTasks = state.tasks.filter(t => t.type === 'engagement');
  const profileTasks = state.tasks.filter(t => t.type === 'profile');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('tasksTitle')}</h1>
        <p className="text-slate-400 mt-1">More tasks, more credits, more creations!</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">Daily Tasks</h2>
        {dailyTasks.map(task => (
          <Card key={task.id} className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-white">{task.title}</h3>
              <p className="text-slate-400">{task.description}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-brand-cyan mb-2">+{task.creditReward} {t('credits')}</p>
                <Button onClick={() => handleCompleteTask(task.id)} disabled={task.isCompleted}>
                    {task.isCompleted ? 'Completed' : 'Complete'}
                </Button>
            </div>
          </Card>
        ))}
      </div>
      
       <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">Engagement Tasks</h2>
        {engagementTasks.map(task => (
          <Card key={task.id} className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-white">{task.title}</h3>
              <p className="text-slate-400">{task.description}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-brand-cyan mb-2">+{task.creditReward} {t('credits')}</p>
                <Button onClick={() => handleCompleteTask(task.id)} disabled={task.isCompleted}>
                    {task.isCompleted ? 'Completed' : 'Complete'}
                </Button>
            </div>
          </Card>
        ))}
      </div>

       <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">Profile Tasks</h2>
        {profileTasks.map(task => (
          <Card key={task.id} className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-white">{task.title}</h3>
              <p className="text-slate-400">{task.description}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-brand-cyan mb-2">+{task.creditReward} {t('credits')}</p>
                <Button onClick={() => handleCompleteTask(task.id)} disabled={task.isCompleted}>
                    {task.isCompleted ? 'Completed' : 'Complete'}
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
