// Blog data
const blogData = {
  "blogPosts": [
    {
      "id": 1,
      "title": "Getting Started with Modern Web Development",
      "excerpt": "A comprehensive guide to starting your journey in web development with the latest technologies and best practices.",
      "content": "Full article content about modern web development...",
      "category": "Technology",
      "author": "John Doe",
      "publishDate": "2025-08-05",
      "readTime": "5 min read",
      "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
    },
    {
      "id": 2,
      "title": "10 Tips for Better Work-Life Balance",
      "excerpt": "Discover practical strategies to maintain a healthy balance between your professional and personal life.",
      "content": "Full article content about work-life balance...",
      "category": "Lifestyle",
      "author": "John Doe",
      "publishDate": "2025-08-03",
      "readTime": "7 min read",
      "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"
    },
    {
      "id": 3,
      "title": "My Journey Through Southeast Asia",
      "excerpt": "A detailed account of my three-month backpacking adventure through Thailand, Vietnam, and Cambodia.",
      "content": "Full article content about travel experiences...",
      "category": "Travel",
      "author": "John Doe",
      "publishDate": "2025-07-28",
      "readTime": "10 min read",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
    },
    {
      "id": 4,
      "title": "The Future of Artificial Intelligence",
      "excerpt": "Exploring the potential impact of AI on various industries and our daily lives in the coming decade.",
      "content": "Full article content about AI future...",
      "category": "Technology",
      "author": "John Doe",
      "publishDate": "2025-07-25",
      "readTime": "8 min read",
      "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop"
    },
    {
      "id": 5,
      "title": "Building Healthy Habits That Stick",
      "excerpt": "Science-backed strategies for creating lasting positive changes in your daily routine.",
      "content": "Full article content about healthy habits...",
      "category": "Health",
      "author": "John Doe",
      "publishDate": "2025-07-20",
      "readTime": "6 min read",
      "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop"
    },
    {
      "id": 6,
      "title": "Creative Photography Techniques",
      "excerpt": "Learn advanced photography techniques to take your creative skills to the next level.",
      "content": "Full article content about photography...",
      "category": "Photography",
      "author": "John Doe",
      "publishDate": "2025-07-15",
      "readTime": "9 min read",
      "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=250&fit=crop"
    },
    {
      "id": 7,
      "title": "Essential JavaScript ES6+ Features",
      "excerpt": "Master the most important modern JavaScript features that every developer should know in 2025.",
      "content": "Full article content about JavaScript features...",
      "category": "Technology",
      "author": "John Doe",
      "publishDate": "2025-07-10",
      "readTime": "12 min read",
      "image": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop"
    },
    {
      "id": 8,
      "title": "Digital Minimalism in Practice",
      "excerpt": "How reducing digital clutter can improve focus, productivity, and overall well-being in our hyper-connected world.",
      "content": "Full article content about digital minimalism...",
      "category": "Lifestyle",
      "author": "John Doe",
      "publishDate": "2025-07-05",
      "readTime": "6 min read",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    }
  ],
  "categories": ["All", "Technology", "Lifestyle", "Travel", "Health", "Photography"]
};

// Global state
let currentPosts = [...blogData.blogPosts];
let displayedPosts = [];
let postsPerPage = 6;
let currentPage = 1;
let currentCategory = 'All';
let searchQuery = '';

// DOM Elements
let themeToggle, mobileMenuToggle, mobileNav, blogGrid, searchInput, categoryFilter, loadMoreBtn, categoriesList, contactForm, newsletterForm, toast;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    themeToggle = document.getElementById('themeToggle');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileNav = document.getElementById('mobileNav');
    blogGrid = document.getElementById('blogGrid');
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    loadMoreBtn = document.getElementById('loadMore');
    categoriesList = document.getElementById('categoriesList');
    contactForm = document.getElementById('contactForm');
    newsletterForm = document.getElementById('newsletterForm');
    toast = document.getElementById('toast');

    // Initialize components
    initializeTheme();
    renderBlogPosts();
    renderCategories();
    setupEventListeners();
    setupSmoothScrolling();
});

// Theme Management
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-color-scheme', theme);
        updateThemeIcon(theme);
    } catch (error) {
        // Fallback to light theme if localStorage fails
        document.documentElement.setAttribute('data-color-scheme', 'light');
        updateThemeIcon('light');
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // localStorage might not be available
        }
        updateThemeIcon(newTheme);
        showToast(`Switched to ${newTheme} mode`, 'success');
    } catch (error) {
        console.error('Theme toggle failed:', error);
    }
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Mobile Menu Management
function toggleMobileMenu() {
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('hidden');
    }
}

function closeMobileMenu() {
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.add('hidden');
    }
}

// Blog Posts Rendering
function renderBlogPosts(reset = false) {
    if (!blogGrid) return;

    if (reset) {
        currentPage = 1;
        displayedPosts = [];
        blogGrid.innerHTML = '';
    }

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = currentPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0 && reset) {
        blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-32); color: var(--color-text-secondary);">
                <i class="fas fa-search" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-16); opacity: 0.5;"></i>
                <p style="font-size: var(--font-size-lg); margin: 0;">No posts found matching your criteria.</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }

    postsToShow.forEach(post => {
        const postElement = createBlogPostElement(post);
        blogGrid.appendChild(postElement);
        displayedPosts.push(post);
    });

    // Update load more button visibility
    const hasMorePosts = endIndex < currentPosts.length;
    if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMorePosts ? 'block' : 'none';
    }
}

function createBlogPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post fade-in-up';
    
    const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    article.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="blog-post__image" loading="lazy">
        <div class="blog-post__content">
            <div class="blog-post__meta">
                <span class="blog-post__category">${post.category}</span>
                <span>•</span>
                <span>${publishDate}</span>
                <span>•</span>
                <span>${post.readTime}</span>
            </div>
            <h3 class="blog-post__title">${post.title}</h3>
            <p class="blog-post__excerpt">${post.excerpt}</p>
            <div class="blog-post__footer">
                <span>By ${post.author}</span>
                <span>Read more →</span>
            </div>
        </div>
    `;

    // Add click handler
    article.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openBlogPost(post);
    });

    return article;
}

function openBlogPost(post) {
    showToast(`Opening "${post.title}"...`, 'success');
    
    setTimeout(() => {
        showToast('This is a demo. In a real blog, this would open the full post.', 'info');
    }, 1500);
}

// Search and Filter Functions
function filterPosts() {
    let filteredPosts = [...blogData.blogPosts];

    // Filter by category
    if (currentCategory !== 'All') {
        filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
    }

    // Filter by search query
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    currentPosts = filteredPosts;
    renderBlogPosts(true);
}

function handleSearch(e) {
    searchQuery = e.target.value.trim();
    filterPosts();
}

function handleCategoryFilter(e) {
    currentCategory = e.target.value;
    filterPosts();
    updateCategoryTags();
}

function handleCategoryClick(category) {
    currentCategory = category;
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    filterPosts();
    updateCategoryTags();
}

// Categories Rendering
function renderCategories() {
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    
    blogData.categories.forEach(category => {
        const tag = document.createElement('span');
        tag.className = 'category-tag';
        tag.textContent = category;
        
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleCategoryClick(category);
        });
        
        if (category === currentCategory) {
            tag.classList.add('active');
        }
        
        categoriesList.appendChild(tag);
    });
}

function updateCategoryTags() {
    if (!categoriesList) return;
    
    const tags = categoriesList.querySelectorAll('.category-tag');
    tags.forEach(tag => {
        tag.classList.toggle('active', tag.textContent === currentCategory);
    });
}

// Load More Posts
function loadMorePosts() {
    currentPage++;
    renderBlogPosts();
}

// Form Handling
function handleContactForm(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return false;
    }

    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
        showToast('Thank you for your message! I\'ll get back to you soon.', 'success');
        e.target.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    }, 1000);

    return false;
}

function handleNewsletterForm(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        showToast('Please enter your email address.', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return false;
    }

    // Simulate newsletter signup
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
    }

    setTimeout(() => {
        showToast('Successfully subscribed to the newsletter!', 'success');
        if (emailInput) emailInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }
    }, 1000);

    return false;
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'info') {
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast__message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    // Remove existing type classes
    toast.classList.remove('success', 'error', 'info', 'hidden');
    
    // Add new type class
    if (type !== 'info') {
        toast.classList.add(type);
    }
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    if (toast) {
        toast.classList.add('hidden');
    }
}

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for anchor links, just close menu
            closeMobileMenu();
        });
    });
    
    // Search functionality with debounce and disable autocomplete
    if (searchInput) {
        // Disable autocomplete to prevent interference
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('spellcheck', 'false');
        
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            loadMorePosts();
        });
    }
    
    // Forms
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Toast close button
    const toastClose = document.querySelector('.toast__close');
    if (toastClose) {
        toastClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideToast();
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenuToggle && mobileNav) {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Close toast when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideToast();
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    // Prevent form submissions from scrolling to top
    document.addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (enhance performance)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img) imageObserver.observe(img);
        });
    }
}

// Add scroll-based animations
function setupScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const elementsToAnimate = document.querySelectorAll('.blog-post, .card');
    elementsToAnimate.forEach(el => {
        if (el) observer.observe(el);
    });
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    setupScrollAnimations();
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Prevent default keyboard shortcuts from interfering
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 't':
                e.preventDefault();
                toggleTheme();
                break;
            case 's':
                e.preventDefault();
                if (searchInput) searchInput.focus();
                break;
            case 'm':
                e.preventDefault();
                toggleMobileMenu();
                break;
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Don't show error toasts to users, just log them
});

// Prevent any unwanted scrolling behaviors
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Initialize everything after DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // DOM is ready, everything should be initialized already
    });
} else {
    // DOM is already ready, initialize immediately
    console.log('DOM already ready');
}