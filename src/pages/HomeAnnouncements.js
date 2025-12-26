import React, { useState } from 'react';

function HomeAnnouncements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [info, setInfo] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setInfo('Title and message are required.');
      return;
    }
    // Handle actual posting logic here (e.g., API call)
    setTitle('');
    setMessage('');
    setImageFile(null);
    setImagePreviewUrl(null);
    setInfo('Announcement posted (simulate backend storage).');
  };

  return (
    <div
      style={{
        background: '#020617',
        borderRadius: '1rem',
        padding: '1.4rem 1.6rem',
        border: '1px solid #1f2937',
        marginBottom: '1rem',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* Logo centered at top */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '0.8rem',
        }}
      >
        {/* Make sure logo.jpg is in the public folder */}
        <img
          src="/logo.jpg"
          alt="Task Portal Logo"
          style={{
            width: 56,
            height: 56,
            objectFit: 'contain',
            borderRadius: '0.9rem',
          }}
        />
      </div>

      <h3
        style={{
          color: '#e5e7eb',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '1.1rem',
        }}
      >
        Post Announcement
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '0.6rem',
            padding: '0.55rem',
            borderRadius: '0.6rem',
            border: '1px solid #4b5563',
            background: '#020617',
            color: '#e5e7eb',
            fontSize: '1rem',
          }}
        />
        <textarea
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '0.6rem',
            padding: '0.55rem',
            borderRadius: '0.6rem',
            border: '1px solid #4b5563',
            background: '#020617',
            color: '#e5e7eb',
            fontSize: '1rem',
            resize: 'vertical',
          }}
        />
        <label
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            marginBottom: '0.6rem',
            borderRadius: '0.7rem',
            border: '1px solid #4b5563',
            background: '#0f172a',
            color: '#e5e7eb',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>

        {imagePreviewUrl && (
          <div
            style={{
              marginBottom: '0.8rem',
              maxHeight: '200px',
              overflow: 'hidden',
              borderRadius: '1rem',
              border: '1px solid #374151',
              textAlign: 'center',
            }}
          >
            <img
              src={imagePreviewUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '0.7rem',
            border: 'none',
            background: '#8b5cf6',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            fontSize: '1rem',
          }}
        >
          Post Announcement
        </button>
      </form>

      {info && (
        <div
          style={{
            marginTop: '0.8rem',
            color: '#a5b4fc',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          {info}
        </div>
      )}
    </div>
  );
}

export default HomeAnnouncements;
