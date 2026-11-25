/**
 * BINIYAM ADEMASU AFEWORK - CYBERSECURITY PORTFOLIO JAVASCRIPT
 * Features:
 *  - Interactive Cyber Canvas Particle / Constellation Network
 *  - Dynamic Typing Effect with Rotating Security Titles
 *  - IntersectionObserver Scroll Reveal & Animated Skill Fill Bars
 *  - Interactive Terminal Shell Emulator with Commands, History & CTF Easter Eggs
 *  - Sticky Nav with Active ScrollSpy & Responsive Mobile Drawer
 *  - Project Category Filter System
 *  - Copy-to-Clipboard with Toast Feedback
 *  - Contact Form Dispatch Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initTypewriter();
  initScrollRevealAndSkills();
  initNavigation();
  initProjectFilters();
  initInteractiveTerminal();
  initCopyButtons();
  initContactForm();
  initFooterYear();
});

/* ==========================================================================
   1. Interactive Cyber Canvas Particle Network
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
  const connectionDistance = 140;
  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.35 ? '#00d4ff' : '#00ff88';
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction (gentle repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse cursor
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    'Cybersecurity Analyst',
    'Security Engineer',
    'Defensive Network Architect',
    'Full-Stack Developer',
    'Intrusion Detection Specialist',
    'Penetration Testing Researcher'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing current role
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting current role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Scroll Reveal & Skill Progress Bar Animation
   ========================================================================== */
function initScrollRevealAndSkills() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  const skillBars = document.querySelectorAll('.progress-bar-fill');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // If this element contains skill bars, animate them
          const barsInside = entry.target.querySelectorAll('.progress-bar-fill');
          barsInside.forEach((bar) => {
            const level = bar.getAttribute('data-level');
            if (level) {
              bar.style.width = `${level}%`;
            }
          });

          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   4. Navigation & Active ScrollSpy
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header background blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link update
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   5. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';

        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Cybersecurity Terminal CLI
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalScreen = document.getElementById('terminal-screen');
  const clearBtn = document.getElementById('clear-term-btn');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  if (!terminalInput || !terminalHistory) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
Available Commands:
  <span class="text-cyan">whoami</span>          - Display identity and engineering profile
  <span class="text-cyan">skills</span>          - List programming, security & tooling proficiencies
  <span class="text-cyan">projects</span>        - Detailed summary of prominent engineering projects
  <span class="text-cyan">experience</span>      - IT internship & professional background
  <span class="text-cyan">education</span>       - Degree, Bahir Dar University & academic achievements
  <span class="text-cyan">certifications</span>  - Industry job simulation credentials
  <span class="text-cyan">contact</span>         - Communication channels (Email, LinkedIn, GitHub)
  <span class="text-cyan">clear</span>           - Clear the terminal screen
  <span class="text-cyan">matrix</span>          - Initiate binary rain telemetry
  <span class="text-cyan">cat flag.txt</span>    - Access CTF verification flag
`,

    whoami: () => `
Name:        Biniyam Ademasu Afework
Title:       Cybersecurity Analyst | Security Engineer | Full-Stack Developer
Education:   B.Sc. Cyber Security, Bahir Dar University
Location:    Ethiopia (Open to remote worldwide & on-site opportunities)
Mission:     Engineering robust defensive architectures, resilient code, and automated threat detection.
`,

    skills: () => `
[+] Programming Languages:
    - Python (90%), Go / Golang (85%), JavaScript (85%), Java (80%), C++ (75%), HTML/CSS (92%)

[+] Cybersecurity Disciplines:
    - Defensive Network Security, Vulnerability Disclosure (VDP), PTaaS Frameworks
    - Intrusion Detection Systems (ML-based), Applied Cryptography (RSA/AES-256)
    - Security Awareness (Gophish), Penetration Testing Concepts, OWASP Top 10

[+] Tools & Platforms:
    - Kali Linux, Ubuntu, Docker, Wireshark, Burp Suite, Cisco Packet Tracer, Git, Jupyter
`,

    projects: () => `
1. Next-Gen Crowdsourced Pentesting Platform [Capstone 2026]
   - 8 modular microservices: VDP, PTaaS, Bug Bounty, AI Red Teaming, Code Review, etc.
   - Built with Go, Docker, REST APIs.
   - Repo: https://github.com/bini576

2. AI-Based Intrusion Detection System [ML / Python]
   - Supervised ML models trained on network flow records for anomaly classification.
   - Repo: https://github.com/bini576/AI-based-intrusion-detection-System

3. Secure Campus Network Design [Cisco Packet Tracer]
   - Enterprise multi-VLAN campus network architecture for Jinka Polytechnic College.
   - Repo: https://github.com/bini576/Secure-compuse-network-design

4. Phishing Awareness Demonstration [Social Engineering Defense]
   - Educational site cloning analysis & security awareness training.
   - Demo: https://bini576.github.io/phishing-awaireness-project

5. RSA & AES Cryptography Project [Java & Python]
   - Asymmetric RSA key pair engine & symmetric AES-256 research tools.
   - Repo: https://github.com/bini576/AsymmetricEncryption

6. Soldier Management System [C++ / OOP]
   - High-performance personnel tracking with custom data structures and binary storage.
   - Repo: https://github.com/bini576/Soldier-Management-System
`,

    experience: () => `
[+] Information Technology Intern
    Organization: Jinka Polytechnic College — ICT Directorate
    Timeline:     Jul 2025 – Sep 2025 | Jinka, Ethiopia
    Key Impacts:
    - Administered enterprise network infrastructure & provided direct troubleshooting.
    - Designed simulated secure campus network with VLAN segmentation in Cisco Packet Tracer.
    - Hardened switch ports, access control lists (ACLs), and traffic isolation policies.
    - Led cybersecurity awareness initiatives for institutional staff.
`,

    education: () => `
[+] Bachelor of Science in Cyber Security
    Institution:  Bahir Dar University (Faculty of Computing)
    Graduation:   June 2026
    Key Focus:    Network Defense, Cryptography, Secure Software Architecture,
                  Ethical Hacking, Distributed Systems, ML for Security.
`,

    certifications: () => `
[+] Mastercard Cybersecurity Job Simulation (Forage, 2025)
    - Threat analysis, phishing examination, corporate incident response.
[+] Tata Cybersecurity Analyst Job Simulation (Forage, 2025)
    - SOC analysis, IAM policy engineering, vulnerability remediation.
[+] Employability, Job Readiness & Design Thinking (BDiT CDC, 2026)
    - Strategic problem solving, technical communication, teamwork.
`,

    contact: () => `
Email:     admasubiniyam96@gmail.com
Phone:     +251 91 654 5839
LinkedIn:  https://linkedin.com/in/biniyam-ademasu
GitHub:    https://github.com/bini576
Location:  Ethiopia
`,

    matrix: () => `
<span class="text-green">
01000010 01001001 01001110 01001001 01011001 01000001 01001101
01010011 01000101 01000011 01010101 01010010 01001001 01010100 01011001
[+] Cyber monitoring routines operational. Integrity verified.
</span>
`,

    'cat flag.txt': () => `
<span class="text-green">[!] CTF CHALLENGE SOLVED!</span>
Flag: <span class="text-cyan font-bold">FLAG{b1n1y4m_defens1ve_sec_eng_2026}</span>
Verification: Hash matching Biniyam Ademasu Afework's defensive security credentials.
`
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const lowerCmd = trimmed.toLowerCase();

    // Append user command line
    const entryDiv = document.createElement('div');
    entryDiv.className = 'terminal-entry';
    entryDiv.innerHTML = `
      <div class="terminal-entry-command">
        <span class="term-prompt font-mono text-cyan">guest@bini576:~$</span>
        <span>${escapeHtml(trimmed)}</span>
      </div>
    `;

    // Process output
    const responseDiv = document.createElement('div');
    responseDiv.className = 'terminal-entry-response font-mono';

    if (lowerCmd === 'clear') {
      terminalHistory.innerHTML = '';
      terminalInput.value = '';
      return;
    } else if (lowerCmd.startsWith('sudo')) {
      responseDiv.innerHTML = `<span class="text-red">[!] Incident logged: User is not in sudoers file. This incident will be reported to /var/log/bini_sec.log</span>`;
    } else if (lowerCmd.startsWith('rm') || lowerCmd.startsWith('format')) {
      responseDiv.innerHTML = `<span class="text-yellow">[!] Permission Denied: System files protected under immutable integrity policies.</span>`;
    } else if (commands[lowerCmd]) {
      responseDiv.innerHTML = commands[lowerCmd]();
    } else {
      responseDiv.innerHTML = `Command not recognized: '<span class="text-yellow">${escapeHtml(trimmed)}</span>'. Type <span class="text-green font-bold">help</span> to view supported commands.`;
    }

    entryDiv.appendChild(responseDiv);
    terminalHistory.appendChild(entryDiv);

    terminalInput.value = '';
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  // Keyboard navigation for terminal input
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalHistory.innerHTML = '';
      terminalInput.focus();
    });
  }

  // Command chip clicks
  cmdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });
}

/* ==========================================================================
   7. Copy-to-Clipboard & Toast Feedback
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast(`Copied: "${textToCopy}"`);
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-check text-green';
            setTimeout(() => {
              icon.className = 'fa-regular fa-copy';
            }, 2000);
          }
        })
        .catch(() => {
          showToast('Failed to copy text.');
        });
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-shield-halved text-cyan"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3500);
}

/* ==========================================================================
   8. Contact Form Real Email Dispatch (FormSubmit)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please fill out all required fields before transmission.';
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    try {
      const response = await fetch('https://formsubmit.co/ajax/admasubiniyam96@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `[Portfolio] ${subject}`,
          _replyto: email,
          message: message
        })
      });

      const data = await response.json();
      if (!response.ok || (data.success !== 'true' && data.success !== true)) {
        throw new Error(data.message || 'Failed to send message');
      }

      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message sent successfully! Thank you ${escapeHtml(name)}, I will respond promptly.`;
      showToast('Message sent to inbox!');
      contactForm.reset();
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Could not send automatically. Please email me directly at <a href="mailto:admasubiniyam96@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}">admasubiniyam96@gmail.com</a>.`;
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   9. Footer Dynamic Year
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --- Escape HTML Utility --- */
function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}
