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
          className="fixed top-4 left-4 z-40 w-10 h-10 rounded-sm bg-white border border-stone-line flex items-center justify-center text-ink-40 hover:text-ink transition-all lg:hidden shadow-sm"
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
              className="fixed inset-0 bg-black/20 z-30 lg:hidden"
              onClick={onToggle}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:relative lg:z-0 flex flex-col"
            >
              <div className="flex-1 bg-white border-r border-stone-line m-2 lg:m-0 lg:rounded-none flex flex-col overflow-hidden shadow-sm">
                {/* Profile header */}
                <div className="p-4 border-b border-stone-line">
                  <div className="flex items-center gap-3">
                    <Avatar src={user?.image} alt={user?.username || 'User'} size="xs" status="online" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink text-body truncate">
                        {user?.username || 'User'}
                      </h3>
                      <p className="text-caption text-ink-70 truncate">
                        {user?.native ? `Native ${langName(user.native_id)}` : 'Set your language'}
                      </p>
                    </div>
                    <motion.button
                      onClick={onOpenSettings}
                      className="w-8 h-8 flex items-center justify-center rounded-sm bg-white border border-stone-line text-ink-40 hover:text-ink hover:bg-paper/50 transition-all flex-shrink-0"
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
                <div className="px-4 pt-3 pb-2">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search users... (Ctrl+K)"
                      className="w-full pl-10 pr-3 py-2.5 rounded-sm border border-stone-line bg-paper text-body text-ink placeholder-ink-40 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition-all"
                    />
                  </div>
                </div>

                {/* Users list */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                  {loading ? (
                    <div className="space-y-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                          <Skeleton variant="avatar" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : profiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 mx-auto rounded-sm bg-paper border border-stone-line flex items-center justify-center mb-3">
                        <svg className="w-7 h-7 text-ink-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-caption text-ink-70">No users found</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {profiles
                        .filter((p) =>
                          p.username?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((profile) => (
                          <motion.button
                            key={profile.id}
                            onClick={() => onSelectProfile(profile)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 text-left
                              ${activeProfile?.id === profile.id
                                ? 'bg-marigold-tint border border-marigold/30'
                                : 'hover:bg-paper border border-transparent'
                              }
                            `}
                            whileHover={{ x: 2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Avatar src={profile.image} alt={profile.username} size="xs" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-ink text-[14px] truncate leading-snug">{profile.username}</p>
                              <p className="text-[12px] text-ink-70 truncate leading-snug mt-0.5">
                                Native in {langName(profile.native_language_id)}
                              </p>
                            </div>
                            {activeProfile?.id === profile.id && (
                              <div className="w-2 h-2 rounded-full bg-marigold flex-shrink-0" />
                            )}
                          </motion.button>
                        ))}
                    </div>
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
