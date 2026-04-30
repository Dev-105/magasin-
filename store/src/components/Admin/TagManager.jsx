import React, { useState, useEffect } from 'react';
import { getTags, createTag, updateTag, deleteTag } from '../../api';
import Alert from '../Common/Alert';
import { Edit2, Trash2, Plus } from 'lucide-react';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingTag) {
        await updateTag(editingTag.id, { name: tagName });
        setAlert({ type: 'success', message: 'Tag updated successfully' });
      } else {
        await createTag({ name: tagName });
        setAlert({ type: 'success', message: 'Tag created successfully' });
      }
      await fetchTags();
      resetForm();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save tag' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    
    try {
      await deleteTag(id);
      await fetchTags();
      setAlert({ type: 'success', message: 'Tag deleted successfully' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete tag' });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTag(null);
    setTagName('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Tags</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tag
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            {editingTag ? 'Edit Tag' : 'New Tag'}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Tag name"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map(tag => (
          <div key={tag.id} className="border rounded-lg p-4 flex justify-between items-center">
            <span className="text-lg">{tag.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(tag.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;