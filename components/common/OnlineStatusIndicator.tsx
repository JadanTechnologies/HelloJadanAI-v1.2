import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiIcon, WifiSlashIcon } from '../../constants';

const OnlineStatusIndicator: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
    const isOnline = useOnlineStatus();

    const baseClasses = "flex items-center text-xs font-medium transition-colors";
    const onlineClasses = "text-slate-400";
    const offlineClasses = "text-red-400 animate-pulse";
    
    const containerClasses = `p-2 rounded-lg ${isOnline ? 'bg-slate-700/50' : 'bg-red-500/10 border border-red-500/30'}`;

    if (isCollapsed) {
        return (
            <div className={containerClasses} title={isOnline ? 'Online' : 'Offline'}>
                {isOnline ? (
                    <WifiIcon className="w-5 h-5 text-green-400" />
                ) : (
                    <WifiSlashIcon className="w-5 h-5 text-red-400" />
                )}
            </div>
        );
    }
    
    return (
        <div className={`${baseClasses} ${isOnline ? onlineClasses : offlineClasses}`}>
            {isOnline ? (
                <WifiIcon className="w-5 h-5 mr-2 text-green-400" />
            ) : (
                <WifiSlashIcon className="w-5 h-5 mr-2" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
    );
};

export default OnlineStatusIndicator;
