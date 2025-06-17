import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { NotificationPanel } from './components/NotificationPanel';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';
import { Task } from './types';

function App() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotifications(user?.id || null);
  
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (activeView === 'create-task') {
      setIsCreateTaskModalOpen(true);
      setActiveView('tasks');
    }
  }, [activeView]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    
    // Add notification for task updates
    if (user && updates.status) {
      addNotification({
        type: 'task_completed',
        title: 'Task Updated',
        message: `Task "${selectedTask?.title}" status changed to ${updates.status}`,
        userId: user.id,
        taskId: taskId,
        read: false,
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTask = createTask(taskData);
    
    // Add notification for task creation
    if (user && taskData.assigneeId) {
      addNotification({
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to "${newTask.title}"`,
        userId: taskData.assigneeId,
        taskId: newTask.id,
        read: false,
      });
    }
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    handleTaskUpdate(taskId, { status });
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            user={user!}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
          />
        );
      case 'tasks':
        return (
          <TaskList
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
            onCreateTask={() => setIsCreateTaskModalOpen(true)}
          />
        );
      case 'notifications':
        return (
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        );
      case 'calendar':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendar View</h2>
              <p className="text-gray-600">Calendar functionality coming soon!</p>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h2>
              <p className="text-gray-600">Team management features coming soon!</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
              <p className="text-gray-600">Analytics and reporting features coming soon!</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon!</p>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            user={user!}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
          />
        );
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden">
            <div className="absolute inset-y-0 left-0 w-64">
              <Sidebar
                user={user!}
                activeView={activeView}
                onViewChange={(view) => {
                  setActiveView(view);
                  setIsMobileSidebarOpen(false);
                }}
                onLogout={logout}
                unreadNotifications={unreadCount}
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="mr-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <Sidebar
              user={user!}
              activeView={activeView}
              onViewChange={setActiveView}
              onLogout={logout}
              unreadNotifications={unreadCount}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

        {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">TF</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
            </div>

            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user!.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>

        {/* Modals */}
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          currentUser={user!}
        />

        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreate={handleCreateTask}
          currentUser={user!}
        />
      </div>
    </div>
  );
}

export default App;