import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Tags from './Tags';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);

  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('學業');
  const [priority, setPriority] = useState('次要');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [customTagCategory, setCustomTagCategory] = useState('未分類');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showTagManager, setShowTagManager] = useState(false);

  useEffect(() => {
    fetchTags();
    fetchTasks();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: false });
    if (!error) setTags(data);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('todos').select('*').order('id', { ascending: false });
    if (!error) setTasks(data);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setShowCustomTagInput(true);
      setTag('');
    } else {
      setTag(value);
      setShowCustomTagInput(false);
      setCustomTag('');
    }
  };

  const addTask = async () => {
    if (text.trim() === '') return;

    let finalTag = tag;

    if (showCustomTagInput && customTag.trim() !== '') {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: customTag.trim(), category: customTagCategory }])
        .select();

      if (!error && data.length > 0) {
        finalTag = data[0].name;
        setTags([data[0], ...tags]);
      }
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, time, note, category, priority, location, tag: finalTag, completed: false }])
      .select();

    if (!error) {
      setTasks([data[0], ...tasks]);
      setText(''); setTime(''); setNote('');
      setCategory('學業'); setPriority('次要');
      setLocation(''); setTag(''); setCustomTag('');
      setShowCustomTagInput(false);
      setCustomTagCategory('未分類');
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    const { data, error } = await supabase.from('todos').update({ completed: !currentStatus }).eq('id', id).select();
    if (!error) setTasks(tasks.map(task => task.id === id ? data[0] : task));
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditForm({ ...task });
  };

  const saveEdit = async (id) => {
    const { data, error } = await supabase.from('todos').update(editForm).eq('id', id).select();
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? data[0] : t));
      setEditingTaskId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({});
  };

  return (
    <div className="tasks-container">
      <h2>待辦事項清單</h2>
      <div className="input-form">
        <input type="text" placeholder="任務名稱" value={text} onChange={(e) => setText(e.target.value)} />
        <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
        <input type="text" placeholder="備註" value={note} onChange={(e) => setNote(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="學業">學業</option>
          <option value="生活">生活</option>
          <option value="工作">工作</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="重要">重要</option>
          <option value="次要">次要</option>
        </select>
        <input type="text" placeholder="地點" value={location} onChange={(e) => setLocation(e.target.value)} />
        {!showCustomTagInput && (
          <select value={tag} onChange={handleTagChange}>
            <option value="">請選擇標籤</option>
            {tags.map(t => (
              <option key={t.id} value={t.name}>{t.name}（{t.category}）</option>
            ))}
            <option value="__custom__">➕ 自訂標籤...</option>
          </select>
        )}
        {showCustomTagInput && (
          <>
            <div className="custom-tag-preview">✔️ 使用新標籤：{customTag || '（尚未輸入）'}（{customTagCategory}）</div>
            <input type="text" placeholder="輸入新標籤名稱" value={customTag} onChange={(e) => setCustomTag(e.target.value)} />
            <select value={customTagCategory} onChange={(e) => setCustomTagCategory(e.target.value)}>
              <option value="學業">學業</option>
              <option value="生活">生活</option>
              <option value="工作">工作</option>
              <option value="未分類">未分類</option>
            </select>
          </>
        )}
        <button onClick={addTask}>➕ 新增任務</button>
        <button className="go-manage-tags" onClick={() => setShowTagManager(!showTagManager)}>🔧 管理標籤</button>
      </div>

      {showTagManager && (
        <div className="modal">
          <div className="modal-content">
            <Tags />
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '40px', textAlign: 'center' }}>📋 目前的代辦事項</h3>
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>✔️</th>
              <th>任務名稱</th>
              <th>時間</th>
              <th>地點</th>
              <th>備註</th>
              <th>分類</th>
              <th>標籤</th>
              <th>重要性</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={task.completed ? 'completed-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id, task.completed)}
                  />
                </td>
                {editingTaskId === task.id ? (
                  <>
                    <td><input value={editForm.text} onChange={e => setEditForm({ ...editForm, text: e.target.value })} /></td>
                    <td><input type="datetime-local" value={editForm.time || ''} onChange={e => setEditForm({ ...editForm, time: e.target.value })} /></td>
                    <td><input value={editForm.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} /></td>
                    <td><input value={editForm.note || ''} onChange={e => setEditForm({ ...editForm, note: e.target.value })} /></td>
                    <td>
                      <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                        <option value="學業">學業</option>
                        <option value="生活">生活</option>
                        <option value="工作">工作</option>
                      </select>
                    </td>
                    <td>
                      <select value={editForm.tag} onChange={e => setEditForm({ ...editForm, tag: e.target.value })}>
                        {tags.map(t => (
                          <option key={t.id} value={t.name}>{t.name}（{t.category}）</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}>
                        <option value="重要">重要</option>
                        <option value="次要">次要</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => saveEdit(task.id)}>💾</button>
                      <button onClick={cancelEdit}>❌</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{task.text}</td>
                    <td>{task.time ? new Date(task.time).toLocaleString() : '未設定'}</td>
                    <td>{task.location || '-'}</td>
                    <td>{task.note || '-'}</td>
                    <td>{task.category || '-'}</td>
                    <td>{task.tag || '-'}</td>
                    <td><span className={`priority ${task.priority === '重要' ? 'high' : 'low'}`}>{task.priority}</span></td>
                    <td>
                      <button onClick={() => startEdit(task)}>✏️</button>
                      <button onClick={() => deleteTask(task.id)}>🗑️</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;