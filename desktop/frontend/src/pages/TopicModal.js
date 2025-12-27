import { useState } from "react";
import "./admin.css";
const TopicModal = ({ open, onClose, subject, topics, onSubmit }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  if (!open) return null;

  const handleCheckboxChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics([...topics]);
    }
  };

  const handleSubmit = () => {
    onSubmit(subject, selectedTopics);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{subject} - Select Topics</h2>
        <div className="topics-list">
          <label>
            <input
              type="checkbox"
              checked={selectedTopics.length === topics.length}
              onChange={handleSelectAll}
            />
            Select All
          </label>
          {topics.map((topic, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={() => handleCheckboxChange(topic)}
              />
              {topic}
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
