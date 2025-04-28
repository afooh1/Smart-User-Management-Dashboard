"use strict";

// API Functions
const UserAPI = {
    async fetchUsers() {
        try {
            const response = await fetch('https://dummyjson.com/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    async fetchUserDetails(userId) {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user details');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    }
};

// Display Functions
const UserDisplay = {
    createUserCard(user) {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <img src="${user.image}" alt="${user.firstName} ${user.lastName}">
            <h3>${user.firstName} ${user.lastName}</h3>
            <p>Age: ${user.age}</p>
            <p>Gender: ${user.gender}</p>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
        `;
        return card;
    },

    displayUsers(users, container) {
        container.innerHTML = '';
        if (users.length === 0) {
            container.innerHTML = '<p>No users found matching your criteria.</p>';
            return;
        }
        
        users.forEach(user => {
            const card = this.createUserCard(user);
            container.appendChild(card);
        });
    }
};

// Utility Functions
const Utils = {
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    formatPhoneNumber(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
};

// Filter/Sort Functions
const UserFilters = {
    filterByGender(users, gender) {
        if (!gender) return users;
        return users.filter(user => user.gender.toLowerCase() === gender);
    },

    searchUsers(users, query) {
        if (!query) return users;
        const lowerQuery = query.toLowerCase();
        return users.filter(user => 
            user.firstName.toLowerCase().includes(lowerQuery) ||
            user.lastName.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery) ||
            user.phone.includes(query)
        );
    },

    sortUsers(users, sortBy) {
        const usersCopy = [...users];
        switch (sortBy) {
            case 'name-asc':
                return usersCopy.sort((a, b) => 
                    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
            case 'name-desc':
                return usersCopy.sort((a, b) => 
                    `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
            case 'age-asc':
                return usersCopy.sort((a, b) => a.age - b.age);
            case 'age-desc':
                return usersCopy.sort((a, b) => b.age - a.age);
            default:
                return usersCopy;
        }
    }
};
