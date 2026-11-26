/* Terminal interaction powered by self-hosted jQuery Terminal 2.48.1 (MIT). */
(() => {
  const host = document.querySelector('#portfolio-terminal');
  if (!host || !window.jQuery || !window.jQuery.fn.terminal) return;
  const $ = window.jQuery;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const descriptions = {
    help: 'Available: aboutme  resume  skills  contact  linkedin  clear',
    aboutme: 'I am an Engineering Manager for Data & Lab Ops and a platform engineer. Scroll down for the full career details.',
    resume: [
      '2013–2018  McGill University — B.Sc. Software Engineering',
      '2015–2017  McGill Arts Undergraduate Society — Publications Commissioner',
      '≈2016      Amadeus — Software Engineer Intern',
      '2017       Amadeus — Software Engineer Intern',
      '2018–2021  Ceridian — Software Developer in Test',
      '2019–2020  Ceridian — Scrum Master',
      '2021–2022  Veeva — Associate Software Engineer',
      '2022–2023  Veeva — Software Engineer',
      '2023–2024  Helix — Tech Lead & Software Engineer III, Infrastructure',
      '2024–2025  Helix — Tech Lead & Senior Software Engineer I',
      '2025–2026  Helix — Tech Lead & Senior Software Engineer II',
      '2026–now   Helix — Software Engineering Manager'
    ].join('\n'),
    skills: 'Engineering leadership · Platform engineering · AWS · Observability · Agentic AI · LLM evaluation\n\nGo · TypeScript · Java · Python · Airflow · React · Bash\nExplore the field guide below.',
    contact: 'Email: farazoman@gmail.com',
    linkedin: 'LinkedIn: https://www.linkedin.com/in/farazoman'
  };
  const introLines = [
    '[[;#eda585;]faraz@portfolio:~$] ./hello',
    '',
    ...[
      String.raw` _____  _    ____      _    _____`,
      String.raw`|  ___|/ \  |  _ \    / \  |__  /`,
      String.raw`| |_  / _ \ | |_) |  / _ \   / /`,
      String.raw`|  _|/ ___ \|  _ <  / ___ \ / /_`,
      String.raw`|_| /_/   \_\_| \_\/_/   \_\____|`
    ].map(line => `[[;#eda585;;terminal-ascii]${line}]`),
    '',
    "Hello, world. I'm Faraz Oman.",
    'Software engineer. Engineering leader. Curious human.',
    '',
    '[[;#eda585;]faraz@portfolio:~$] cat welcome.txt',
    'Welcome to my little corner of the web.',
    'I build tools and systems that help people do their best work.',
    'Explore my career below, or use a command.',
    '',
    '[[;#eda585;]faraz@portfolio:~$] help',
    descriptions.help
  ];
  const markDecorativeArt = () => {
    host.querySelectorAll('.terminal-ascii').forEach(line => {
      line.setAttribute('aria-hidden', 'true');
      line.parentElement?.classList.add('terminal-art-row');
    });
  };
  const fallback = host.querySelector('.terminal-fallback')?.cloneNode(true);
  host.replaceChildren();
  let terminal;
  try {
    terminal = $(host).terminal((input, term) => {
      const command = input.trim().toLowerCase();
      if (!command) return;
      if (command === 'clear') {
        term.clear();
        return;
      }
      term.echo(Object.prototype.hasOwnProperty.call(descriptions, command)
        ? descriptions[command]
        : 'Command not found. Type help to see available commands.', {keepWords: true});
    }, {
      prompt: 'faraz@portfolio:~$ ',
      greetings: false,
      enabled: false,
      tabindex: 0,
      memory: true,
      execHash: false,
      historyState: false,
      completion: Object.keys(descriptions).concat('clear'),
      checkArity: false,
      // jQuery Terminal redraws its output when its character grid changes.
      onResize: markDecorativeArt,
      onInit: (term) => {
        // Startup text and later command results share the terminal's scrollable history.
        // Keep prose readable on narrow screens; ASCII art must retain its grid spacing.
        introLines.forEach(line => term.echo(line, {keepWords: !line.includes('terminal-ascii')}));
        // The page heading already names Faraz; avoid reading the decorative ASCII character by character.
        markDecorativeArt();
        // Do not take focus from the page; label the library's input for assistive technology.
        term.find('textarea, [contenteditable]').attr('aria-label', 'Terminal command');
        host.closest('.terminal-content').classList.add('terminal-ready');
      }
    });
  } catch (error) {
    host.closest('.terminal-content').classList.remove('terminal-ready');
    host.replaceChildren();
    if (fallback) host.append(fallback);
    console.error('The portfolio terminal could not initialize.', error);
    return;
  }
  // jQuery Terminal follows new output by default; start at the top of the welcome
  // so the ASCII introduction is visible before the visitor runs a command.
  requestAnimationFrame(() => {
    const scroller = host.querySelector('.terminal-scroller');
    if (scroller) scroller.scrollTop = 0;
  });
  // The library reserves Tab for completion; allow normal focus navigation instead.
  host.addEventListener('keydown', event => {
    if (event.key === 'Tab') event.stopImmediatePropagation();
  }, true);
  host.addEventListener('focusin', event => {
    if (event.target.matches('textarea, [contenteditable]') && !terminal.enabled()) terminal.focus(true);
  });
  host.addEventListener('focusout', event => {
    if (!host.contains(event.relatedTarget)) terminal.focus(false);
  });
  // When a visitor scrolls from the terminal into the timeline, hand keyboard
  // control to the timeline without requiring an extra click. Only move focus
  // if it was actually inside the terminal, and never move the page to do so.
  const terminalWindow = host.closest('.terminal-shell');
  const timeline = document.querySelector('#timeline-scroll');
  let lastPageScrollY = window.scrollY;
  let focusCheckScheduled = false;
  window.addEventListener('scroll', () => {
    const scrollingDown = window.scrollY > lastPageScrollY;
    lastPageScrollY = window.scrollY;
    if (!scrollingDown || !terminalWindow || !timeline ||
        !host.contains(document.activeElement) || focusCheckScheduled) return;
    focusCheckScheduled = true;
    requestAnimationFrame(() => {
      focusCheckScheduled = false;
      if (!host.contains(document.activeElement)) return;
      const terminalRect = terminalWindow.getBoundingClientRect();
      const timelineRect = timeline.getBoundingClientRect();
      const visibleHeight = Math.max(0,
        Math.min(terminalRect.bottom, window.innerHeight) - Math.max(terminalRect.top, 0));
      const timelineVisible = timelineRect.bottom > 0 && timelineRect.top < window.innerHeight &&
        timelineRect.right > 0 && timelineRect.left < window.innerWidth;
      if (terminalRect.height > 0 && visibleHeight / terminalRect.height < 0.5 && timelineVisible) {
        timeline.focus({preventScroll: true});
      }
    });
  }, {passive: true});
  document.querySelectorAll('[data-terminal-command]').forEach(button => {
    button.addEventListener('click', () => {
      const command = button.dataset.terminalCommand;
      // jQuery Terminal animates the command before submitting; omit animation for reduced motion.
      terminal.exec(command, {typing: !reduceMotion.matches, delay: 50});
    });
  });
})();
