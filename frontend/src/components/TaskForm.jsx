import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({name: '', price: '',url: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.name,
        price: editingTask.price,
        url: editingTask.url,
      });
    } else {
      setFormData({name: '', price: '',url: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({name: '', price: '',url: '' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit in cart: Edit Operation' : 'Add to cart: Edit operation'}</h1>
      <input
        type="text"
        placeholder="Item name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData,name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData,price: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
        <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData,url: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
        />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default TaskForm;
