const app = document.getElementById('app')

export function createHomePage () {
  app.innerHTML = ''
  document.body.classList.remove('bg-[#0b1220]')
  document.body.classList.add('bg-gray-50')

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  // مستخدم واحد
  const state = {
    activeId: 1,
    profiles: [
      { id: 1, name: 'Alice Martin', avatar: 'https://i.pravatar.cc/64?img=1', online: true, lastSeen: 'Online', language: 'en' }
    ],
    chats: {
      1: [
        { id: 1, author: 'them', text: 'Hello! How can I help you today?', time: '12:40' },
        { id: 2, author: 'them', text: "I\'m good, how about you?", time: '12:45' },
        { id: 3, author: 'me', text: 'أنا بخير، شكرًا لك', time: '12:46' }
      ]
    }
  }

  const main = createElement('main', ['min-h-screen','w-full','p-0'])
  const board = createElement('div', [
    'w-full','min-h-screen','grid','grid-cols-12','bg-white','ring-1','ring-gray-200','shadow-2xl'
  ])

  // ===== Sidebar =====
  const sidebar = createElement('aside', [
    'col-span-12','md:col-span-3','bg-white','border-r','border-gray-200',
    'p-4','space-y-4','sticky','top-0','self-start'
  ])
  const brand = createElement('h1', ['px-2','text-xl','font-semibold','tracking-wide','text-gray-900'], 'ChatLingua')

  const searchWrap = createElement('div', ['relative'])
  const searchInput = createElement('input', [
    'w-full','rounded-2xl','bg-gray-100','placeholder-gray-400',
    'px-10','py-2.5','outline-none','ring-1','ring-gray-200','focus:ring-indigo-500/30'
  ])
  searchInput.placeholder = 'Search'
  const searchIcon = createElement('span', ['absolute','left-3','top-1/2','-translate-y-1/2','text-gray-400'], '🔍')
  appendToParent(searchWrap, [searchInput, searchIcon])

  const list = createElement('div', [
    'space-y-2','mt-2','pr-1','max-h-[calc(100vh-180px)]','overflow-y-auto'
  ])

  const buildSidebarItem = (profile) => {
    const active = state.activeId === profile.id
    const item = createElement('button', [
      'group','relative','w-full','rounded-2xl','px-3','py-2.5','text-left','transition',
      active ? 'bg-gray-100' : 'hover:bg-gray-50'
    ])

    const row = createElement('div', ['flex','items-center','gap-3'])
    const avatar = createElement('img', ['h-10','w-10','rounded-full','ring-1','ring-gray-200'])
    avatar.src = profile.avatar
    avatar.alt = profile.name

    const meta = createElement('div', ['min-w-0'])
    const name = createElement('div', ['text-sm','font-medium','text-gray-900','truncate'], profile.name)
    const status = createElement('div', ['text-xs','text-gray-500'], profile.lastSeen)

    const dot = createElement('span', [
      'absolute','right-4','top-1/2','-translate-y-1/2','h-2.5','w-2.5','rounded-full',
      profile.online ? 'bg-emerald-500' : 'bg-gray-400'
    ])

    appendToParent(meta, [name, status])
    appendToParent(row, [avatar, meta])
    appendToParent(item, [row, dot])

    item.addEventListener('click', () => {
      state.activeId = profile.id
      headerName.textContent = profile.name
      headerAvatar.src = profile.avatar
      headerStatus.textContent = profile.lastSeen
      if (smallAvatarEl) smallAvatarEl.src = profile.avatar
      renderList()
      renderChat()
    })

    return item
  }

  const renderList = () => {
    list.innerHTML = ''
    const q = searchInput.value.toLowerCase()
    state.profiles
      .filter(p => p.name.toLowerCase().includes(q))
      .forEach(p => list.appendChild(buildSidebarItem(p)))
  }

  appendToParent(sidebar, [brand, searchWrap, list])

  const chatPanel = createElement('section', [
    'col-span-12','md:col-span-9','p-4','md:p-6','flex','flex-col','min-h-screen','bg-white'
  ])

  const header = createElement('div', [
    'flex','items-center','gap-3','pb-4','border-b','border-gray-200','sticky','top-0','bg-white','z-10'
  ])
  const headerAvatar = createElement('img', ['h-10','w-10','rounded-full','ring-1','ring-gray-200'])
  headerAvatar.src = state.profiles[0].avatar
  const headerMeta = createElement('div')
  const headerName = createElement('div', ['font-semibold','text-gray-900'])
  const headerStatus = createElement('div', ['text-xs','text-gray-500'])
  headerName.textContent = state.profiles[0].name
  headerStatus.textContent = state.profiles[0].lastSeen
  appendToParent(headerMeta, [headerName, headerStatus])
  appendToParent(header, [headerAvatar, headerMeta])

  const msgList = createElement('div', [
    'flex-1','pt-4','space-y-1','overflow-y-auto','min-h-[50vh]','pb-28' 
  ])
  const msgBubble = (m) => {
    const isMe = m.author === 'me'
    const row = createElement('div', ['flex', isMe ? 'justify-end' : 'justify-start'])
    const bubble = createElement('div', [
      'mt-2','max-w-[70%]','rounded-2xl','px-4','py-2.5',
      isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
    ])
    bubble.innerHTML = escapeHtml(m.text)
    appendToParent(row, [bubble])
    return row
  }
  const renderChat = () => {
    msgList.innerHTML = ''
    const arr = state.chats[state.activeId] || []
    arr.forEach(m => msgList.appendChild(msgBubble(m)))
  }

  const bottomBar = createElement('div', [
    'sticky','bottom-0','bg-white','border-t','border-gray-200','p-2','z-10'
  ])
  const bottomRow = createElement('div', [
    'flex','items-center','gap-3','flex-nowrap'
  ])

  let smallAvatarEl
  const smallCard = createElement('div', [
    'flex','items-center','gap-2',
    'w-[230px]','sm:w-[240px]','shrink-0',             
    'rounded-2xl','bg-gray-50','ring-1','ring-gray-200','px-3','py-2','shadow-sm'
  ])
  const avatarWrap = createElement('div', ['relative'])
  smallAvatarEl = createElement('img', ['h-12','w-12','rounded-full','ring-1','ring-gray-200'])
  smallAvatarEl.src = state.profiles[0].avatar
  smallAvatarEl.alt = state.profiles[0].name
  const onlineDot = createElement('span', ['absolute','bottom-0','right-0','h-3','w-3','rounded-full','bg-emerald-500','ring-2','ring-white'])
  avatarWrap.appendChild(smallAvatarEl)
  avatarWrap.appendChild(onlineDot)

  const editBtnSmall = createElement('button', [
    'ml-auto','rounded-lg','p-2','hover:bg-white','ring-1','ring-gray-200'
  ])
  editBtnSmall.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 0 0-2.828 0L6.5 10.672V13.5h2.828l8.086-8.086a2 2 0 0 0 0-2.828Z"/>
      <path fill-rule="evenodd" d="M5.5 16a.5.5 0 0 1-.5-.5V10l9-9 3 3-9 9H5.5V16a.5.5 0 0 1-.5.5h-.5Z" clip-rule="evenodd"/>
    </svg>
  `
  editBtnSmall.addEventListener('click', () => openEditModal(state.profiles[0]))
  appendToParent(smallCard, [avatarWrap, editBtnSmall])

  const inputRow = createElement('div', ['flex','items-center','gap-3','flex-1','min-w-0'])
  const input = createElement('input', [
    'w-full','rounded-2xl','bg-gray-100','px-4','py-3','outline-none',
    'ring-1','ring-gray-200','placeholder-gray-400','focus:ring-indigo-500/30'
  ])
  input.placeholder = 'Type a message…'
  const send = createElement('button', [
    'rounded-2xl','px-5','py-3','bg-indigo-600','hover:bg-indigo-700',
    'transition','font-medium','text-white','shrink-0'
  ], 'Send')

  send.addEventListener('click', () => {
    const val = (input.value || '').trim()
    if (!val) return
    const entry = { id: Date.now(), author: 'me', text: val, time: '' }
    if (!state.chats[state.activeId]) state.chats[state.activeId] = []
    state.chats[state.activeId].push(entry)
    input.value = ''
    renderChat()
    msgList.scrollTop = msgList.scrollHeight
  })
  appendToParent(inputRow, [input, send])

  appendToParent(bottomRow, [smallCard, inputRow])
  appendToParent(bottomBar, [bottomRow])

  appendToParent(chatPanel, [header, msgList, bottomBar])

  appendToParent(board, [sidebar, chatPanel])
  appendToParent(main, [board])
  appendToParent(app, [main])

  renderList()
  renderChat()

  function openEditModal (profile) {
    const form = createElement('form', ['space-y-3'])
    const nameDiv = createDivForm('Full Name')
    const avatarDiv = createDivForm('Avatar URL')
    const langDiv = createDivForm('Language')

    nameDiv.querySelector('input').value = profile.name
    avatarDiv.querySelector('input').value = profile.avatar
    langDiv.querySelector('input').value = profile.language

    const actions = createElement('div', ['flex','justify-end','gap-2','pt-2'])
    const cancel = createElement('button', ['rounded-xl','px-4','py-2','bg-gray-100','hover:bg-gray-200','text-gray-700'], 'Cancel')
    const save = createElement('button', ['rounded-xl','px-4','py-2','bg-indigo-600','hover:bg-indigo-700','text-white','font-medium'], 'Save')

    cancel.type = 'button'; save.type = 'submit'
    appendToParent(actions, [cancel, save])
    appendToParent(form, [nameDiv, avatarDiv, langDiv, actions])

    const overlay = createElement('div', ['fixed','inset-0','bg-black/50','backdrop-blur-sm','z-50','flex','items-center','justify-center','p-4'])
    const modal = createElement('div', ['w-full','max-w-md','rounded-2xl','bg-white','text-gray-900','shadow-2xl','ring-1','ring-gray-200','p-6','space-y-4'])
    const head = createElement('div', ['flex','items-center','justify-between'])
    const title = createElement('h3', ['text-lg','font-semibold'], 'Edit Profile')
    const closeBtn = createElement('button', ['p-1','rounded-lg','hover:bg-gray-100'])
    closeBtn.innerHTML = '<span class="text-xl leading-none">×</span>'

    appendToParent(head, [title, closeBtn])
    appendToParent(modal, [head, form])
    overlay.appendChild(modal)

    const close = () => overlay.remove()
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
    closeBtn.addEventListener('click', close)

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const updated = {
        ...profile,
        name: nameDiv.querySelector('input').value.trim() || profile.name,
        avatar: avatarDiv.querySelector('input').value.trim() || profile.avatar,
        language: langDiv.querySelector('input').value.trim() || profile.language
      }
      const idx = state.profiles.findIndex(p => p.id === profile.id)
      if (idx !== -1) state.profiles[idx] = updated
      if (state.activeId === profile.id) {
        headerName.textContent = updated.name
        headerAvatar.src = updated.avatar
      }
      if (smallAvatarEl) smallAvatarEl.src = updated.avatar
      renderList()
      overlay.remove()
      toast('Profile updated')
    })

    document.body.appendChild(overlay)
  }

  function toast (text) {
    const t = createElement('div', [
      'fixed','bottom-6','left-1/2','-translate-x-1/2','z-50','rounded-xl',
      'bg-gray-900','text-white','px-4','py-2','backdrop-blur','ring-1','ring-gray-900/20','shadow-xl'
    ], text)
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 1800)
  }
}

export default createHomePage
