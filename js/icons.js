window.KP = window.KP || {};
KP.icon = (name, cls = '') => {
  const paths = {
    message:'<path d="M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z"/><path d="M7 9h9m-9 4h6"/>',
    send:'<path d="m3 3 19 9-19 9 4-9Zm4 9h15"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9Z"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
    settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--white)"/><circle cx="15" cy="17" r="3" fill="var(--white)"/>',
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 13H3v7h4v-7Zm16 0h1v7h-4v-7Z"/>',
    recipes:'<path d="M6 3v6m-3-6v5a3 3 0 0 0 6 0V3M6 11v10M18 21V3c-5 3-5 10 0 10"/>',
    video:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
    feed:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',back:'<path d="m14 5-7 7 7 7"/>',
    play:'<path d="m9 5 11 7-11 7Z"/>',pause:'<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    drop:'<path d="M12 2c-2 4-7 8-7 13a7 7 0 0 0 14 0c0-5-5-9-7-13Z"/>',
    glass:'<path d="m5 3 2 18h10l2-18ZM6 9h12"/>',
    bell:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Zm5 4h4M12 2v2"/>',
    scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 7v10M10 7v10m4-10v10m3-10v10"/>',
    camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 4 4L19 6"/>',
    search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    file:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 4v3"/>',
    moon:'<path d="M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10Z"/>',
    steps:'<ellipse cx="8" cy="8" rx="3" ry="5" transform="rotate(-20 8 8)"/><ellipse cx="16" cy="16" rx="3" ry="5" transform="rotate(20 16 16)"/>',
    logout:'<path d="M9 3H3v18h6m5-15 6 6-6 6m-7-6h13"/>'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
KP.extra = '<span class="extra">доп. функция</span>';
KP.escape = value => String(value).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
