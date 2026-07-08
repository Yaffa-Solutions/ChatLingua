import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../ui/Avatar';
import Skeleton from '../ui/Skeleton';
import { LANGS } from '../../lib/constants';

export default function Sidebar({
  user,
  profiles,
  loading,
  activeProfile,
  onSelectProfile,
  onOpenSettings,
  searchQuery,
  onSearchChange,
  isOpen,
  onToggle,
}) {
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const langName = useCallback((id) => LANGS[id] || 'Unknown', []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-40 w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white transition-all lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={onToggle}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:relative lg:z-0 flex flex-col"
            >
              <div className="flex-1 glass rounded-2xl m-2 lg:m-0 lg:rounded-none lg:rounded-r-2xl flex flex-col overflow-hidden">
                {/* Profile header */}
                <div className="relative overflow-hidden p-4 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-400/50" />
                  <div className="relative z-10 flex items-center gap-3">
                    <Avatar src={user?.image} alt={user?.username || 'User'} size="lg" status="online" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-100 text-sm truncate">
                        {user?.username || 'User'}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.native ? `Native ${langName(user.native_id)}` : 'Set your language'}
                      </p>
                    </div>
                    <motion.button
                      onClick={onOpenSettings}
                      className="w-9 h-9 flex items-center justify-center rounded-xl glass text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Search */}
                <div className="p-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search users... (Ctrl+K)"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Users list */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton variant="avatar" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))
                  ) : profiles.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">No users found</p>
                    </div>
                  ) : (
                    profiles
                      .filter((p) =>
                        p.username?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((profile) => (
                        <motion.button
                          key={profile.id}
                          onClick={() => onSelectProfile(profile)}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left
                            ${activeProfile?.id === profile.id
                              ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30'
                              : 'hover:bg-white/5 border border-transparent'
                            }
                          `}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Avatar src={profile.image} alt={profile.username} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-100 text-sm truncate">{profile.username}</p>
                            <p className="text-xs text-gray-400 truncate">
                              Native in {langName(profile.native_language_id)}
                            </p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        </motion.button>
                      ))
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
