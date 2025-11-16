import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { ExclamationTriangleIcon } from '../../constants';
import Button from './Button';

const InsufficientCreditsError: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg text-center space-y-3 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                <p>{message}</p>
            </div>
            <Link to="/app/tasks">
                <Button variant="secondary" className="!bg-red-500/20 hover:!bg-red-500/40 !text-red-300 !py-1 !px-3 !text-xs">
                    {t('navTasks')}
                </Button>
            </Link>
        </div>
    );
};

export default InsufficientCreditsError;
