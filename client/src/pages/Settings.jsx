import React, { useState, useRef, useEffect } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || null);
  const [previewPic, setPreviewPic] = useState(null);
  const fileInputRef = useRef(null);

  // Apply theme and profile pic on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (profilePic) {
      document.querySelectorAll('.user-avatar').forEach(img => {
        img.src = profilePic;
      });
    }
  }, [theme, profilePic]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('profilePic', reader.result);
        setPreviewPic(reader.result);
        // Update all avatars in the app
        document.querySelectorAll('.user-avatar').forEach(img => {
          img.src = reader.result;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-2xl mt-10">
      <h2 className="text-3xl font-extrabold mb-6 text-purple-700 flex items-center gap-2">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 00-6 6c0 1.31.84 3.06 2.62 5.17.79.94 1.74 1.83 2.38 2.37.64-.54 1.59-1.43 2.38-2.37C17.16 13.06 18 11.31 18 10a6 6 0 00-6-6zm0 10a4 4 0 01-4-4c0-.62.13-1.21.36-1.74C9.3 9.53 10.6 10 12 10s2.7-.47 3.64-1.74c.23.53.36 1.12.36 1.74a4 4 0 01-4 4z"/></svg>
        Settings
      </h2>
      <div className="mb-10 flex items-center gap-8">
        <div className="relative group">
          <img
            src={previewPic || profilePic || '/default-avatar.png'}
            alt="Profile Preview"
            className="user-avatar w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-lg transition-all duration-300 group-hover:brightness-75 bg-white"
          />
          <button
            type="button"
            className="absolute bottom-2 right-2 bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-800 transition"
            onClick={() => fileInputRef.current.click()}
            title="Change Profile Picture"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5c-1.1 0-2 .9-2 2v.5H7.5c-.83 0-1.5.67-1.5 1.5V17c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V8.5c0-.83-.67-1.5-1.5-1.5H14v-.5c0-1.1-.9-2-2-2zm0 2c.28 0 .5.22.5.5v.5h-1v-.5c0-.28.22-.5.5-.5zm-4 3h8v1.5H8V9.5zm0 3h8v1.5H8v-1.5zm0 3h5v1.5H8V15.5z"/></svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
        <div>
          <div className="font-semibold text-lg mb-2">Profile Picture</div>
          <div className="text-gray-500 text-sm mb-4">Click the camera icon to change your profile picture. It will update everywhere in the app.</div>
        </div>
      </div>
      <div className="mb-10 flex items-center justify-between bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-purple-700">Appearance</span>
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-2 text-gray-400">☀️</span>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={handleThemeToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 transition-all duration-300 relative">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
            </div>
            <span className="ml-2 text-gray-700">{theme === 'dark' ? '🌙 Dark Mode' : 'Light Mode'}</span>
          </label>
        </div>
      </div>
      {/* Add more settings here as needed */}
    </div>
  );
};

export default Settings;
