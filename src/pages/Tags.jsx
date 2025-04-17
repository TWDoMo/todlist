import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Tags.css';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('未分類');
  const [search, setSearch] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingCategory, setEditingCategory] = useState('未分類');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTags(data);
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name: newTag.trim(), category }])
      .select();

    if (!error) {
      setTags([data[0], ...tags]);
      setNewTag('');
      setCategory('未分類');
    }
  };

  const deleteTag = async (id) => {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (!error) {
      setTags(tags.filter(tag => tag.id !== id));
    }
  };

  const startEdit = (tag) => {
    setEditingTagId(tag.id);
    setEditingName(tag.name);
    setEditingCategory(tag.category);
  };

  const saveEdit = async (id) => {
    const { data, error } = await supabase
      .from('tags')
      .update({ name: editingName, category: editingCategory })
      .eq('id', id)
      .select();

    if (!error) {
      const updated = tags.map(tag =>
        tag.id === id ? data[0] : tag
      );
      setTags(updated);
      setEditingTagId(null);
      setEditingName('');
      setEditingCategory('未分類');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tags-container">
      <h2>標籤管理</h2>

      {/* 新增標籤區塊 */}
      <div className="tag-input-group">
        <input
          type="text"
          placeholder="輸入新標籤名稱，例如 #報告"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="學業">學業</option>
          <option value="生活">生活</option>
          <option value="工作">工作</option>
          <option value="未分類">未分類</option>
        </select>
        <button onClick={addTag}>新增標籤</button>
      </div>

      {/* 搜尋欄位 */}
      <input
        className="tag-search"
        type="text"
        placeholder="🔍 搜尋標籤..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 標籤清單 */}
      <ul className="tag-list">
        {filteredTags.map(tag => (
          <li key={tag.id}>
            {editingTagId === tag.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <select
                  value={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                >
                  <option value="學業">學業</option>
                  <option value="生活">生活</option>
                  <option value="工作">工作</option>
                  <option value="未分類">未分類</option>
                </select>
                <button onClick={() => saveEdit(tag.id)}>💾</button>
              </>
            ) : (
              <>
                <span>{tag.name}</span>
                <span className="tag-category">📂 {tag.category}</span>
                <button onClick={() => startEdit(tag)}>✏️</button>
                <button onClick={() => deleteTag(tag.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
