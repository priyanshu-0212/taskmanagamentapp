import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, Tag, MessageCircle, Clock, Edit, Save, Trash2 } from 'lucide-react';
import { Task, User as UserType, Comment } from '../types';
import { format } from 'date-fns';
import { mockUsers } from '../utils/mockData';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  currentUser: UserType;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  currentUser 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        tags: task.tags,
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      taskId: task.id,
      userId: currentUser.id,
      user: currentUser,
      content: newComment,
      createdAt: new Date(),
    };

    const updatedComments = [...(task.comments || []), comment];
    onUpdate(task.id, { comments: updatedComments });
    setNewComment('');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'text-gray-700 bg-gray-50';
      case 'in-progress': return 'text-blue-700 bg-blue-50';
      case 'review': return 'text-purple-700 bg-purple-50';
      case 'completed': return 'text-green-700 bg-green-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-indigo-500 focus:ring-0 bg-transparent pb-2"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.tags?.join(', ') || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }))}
                  placeholder="Enter tags separated by commas"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments ({task.comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {comment.user?.name.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{comment.user?.name || 'Unknown User'}</span>
                          <span className="text-xs text-gray-500">{format(comment.createdAt, 'MMM d, yyyy HH:mm')}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={editedTask.status || task.status}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    value={editedTask.priority || task.priority}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-4 h-4 mr-1" />
                    {task.priority}
                  </span>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                {isEditing ? (
                  <select
                    value={editedTask.assigneeId || ''}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, assigneeId: e.target.value || undefined }))}
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-3">
                    {task.assignee ? (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{task.assignee.name}</p>
                          <p className="text-sm text-gray-500">{task.assignee.email}</p>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedTask.dueDate ? format(editedTask.dueDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, dueDate: e.target.value ? new Date(e.target.value) : undefined }))}
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>{task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : 'No due date'}</span>
                  </div>
                )}
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {task.creator?.name.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.creator?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{format(task.createdAt, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Created: {format(task.createdAt, 'MMM d, yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {format(task.updatedAt, 'MMM d, yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};