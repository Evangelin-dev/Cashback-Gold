import { Bell, ChevronRight, Clock, X } from 'lucide-react';
import React, { useState } from 'react';

type Notification = {
  id: number;
  type: 'offer' | 'update' | 'reminder';
  title: string;
  description: string;
  time: string;
  avatar: string;
  unread: boolean;
};

const LNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'offer',
      title: 'Tanishq Digital Gold offers..',
      description:
        'over to it since the jewellery at Tanishq is already way to expensive therefor hallmarking the jewelry could',
      time: '9 months ago',
      avatar: '💰',
      unread: true,
    },
    {
      id: 2,
      type: 'update',
      title: 'New Features Available',
      description:
        'Check out the latest updates and improvements to your dashboard experience',
      time: '2 days ago',
      avatar: '🚀',
      unread: true,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Monthly Report Due',
      description:
        'Your monthly analytics report is ready for review and needs your attention',
      time: '1 week ago',
      avatar: '📊',
      unread: false,
    },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <div className="w-8 h-8 bg-[#6a0822] rounded flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              {notifications.some((n) => n.unread) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#6a0822]">Notifications</h1>
              <p className="text-gray-600 text-xs">
                {notifications.filter((n) => n.unread).length} unread notifications
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">All caught up!</h3>
              <p className="text-gray-500 text-xs">No new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`group relative overflow-hidden rounded-lg border border-[#6a0822] bg-white hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer ${notification.unread ? 'ring-2 ring-[#6a0822]/20' : ''}`}
                onClick={() => markAsRead(notification.id)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards',
                }}
              >
                {/* Unread indicator */}
                {notification.unread && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#6a0822]"></div>
                )}

                <div className="p-3">
                  <div className="flex items-start gap-2">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">
                        {notification.avatar}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-gray-900 text-sm truncate ${notification.unread ? 'font-bold' : ''}`}>{notification.title}</h3>
                        <div className="flex items-center gap-1 ml-2">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 text-xs leading-snug mb-2 line-clamp-2">{notification.description}</p>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {notification.unread && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#6a0822] text-white">New</span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize bg-gray-100 text-[#6a0822]`}>{notification.type}</span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                          <ChevronRight className="w-3 h-3 text-[#6a0822]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear All */}
        {notifications.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setNotifications([])}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6a0822] text-white font-medium rounded-lg hover:shadow-md hover:bg-[#4a0617] transition-all duration-200 hover:scale-105 text-xs"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LNotification;
