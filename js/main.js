"use strict";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the appropriate page
    if (document.querySelector('#users-container')) {
        initUsersPage();
    } else if (document.querySelector('#contact-form')) {
        initContactPage();
    }
});

// Users Page Functionality
function initUsersPage() {
    const usersContainer = document.getElementById('users-container');
    const loadingElement = document.getElementById('loading');
    const searchInput = document.getElementById('search');
    const genderFilter = document.getElementById('filter-gender');
    const sortSelect = document.getElementById('sort-by');
    
    let allUsers = [];
    
    // Fetch and display users
    async function loadUsers() {
        try {
            loadingElement.style.display = 'block';
            usersContainer.style.display = 'none';
            
            allUsers = await UserAPI.fetchUsers();
            applyFilters();
            
            loadingElement.style.display = 'none';
            usersContainer.style.display = 'grid';
        } catch (error) {
            loadingElement.textContent = 'Failed to load users. Please try again later.';
            console.error(error);
        }
    }
    
    // Apply all filters and sorting
    function applyFilters() {
        const searchTerm = searchInput.value.trim();
        const gender = genderFilter.value;
        const sortBy = sortSelect.value;
        
        let filteredUsers = [...allUsers];
        
        filteredUsers = UserFilters.searchUsers(filteredUsers, searchTerm);
        filteredUsers = UserFilters.filterByGender(filteredUsers, gender);
        filteredUsers = UserFilters.sortUsers(filteredUsers, sortBy);
        
        UserDisplay.displayUsers(filteredUsers, usersContainer);
    }
    
    // Event listeners with debounce for search
    searchInput.addEventListener('input', Utils.debounce(applyFilters, 300));
    genderFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    
    // Initial load
    loadUsers();
}

// Contact Page Functionality
function initContactPage() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        // Validate form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        let isValid = true;
        
        if (!name) {
            document.getElementById('name-error').textContent = 'Name is required';
            isValid = false;
        }
        
        if (!email) {
            document.getElementById('email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        if (!message) {
            document.getElementById('message-error').textContent = 'Message is required';
            isValid = false;
        }
        
        if (isValid) {
            // In a real app, you would send the form data to a server
            document.getElementById('form-feedback').textContent = 'Thank you for your message!';
            document.getElementById('form-feedback').style.color = 'green';
            contactForm.reset();
            
            // Clear feedback after 3 seconds
            setTimeout(() => {
                document.getElementById('form-feedback').textContent = '';
            }, 3000);
        }
    });
}

// jQuery version of event listeners
$(function() {
    if ($('#users-container').length) {
        // Search with debounce
        $('#search').on('input', Utils.debounce(applyFilters, 300));
        
        // Other filters
        $('#filter-gender, #sort-by').change(applyFilters);
        
        // Fade in users
        $('.user-card').hide().fadeIn(500);
    }
    
    if ($('#contact-form').length) {
        $('#contact-form').submit(function(e) {
            e.preventDefault();
            // jQuery form validation here
        });
    }
});