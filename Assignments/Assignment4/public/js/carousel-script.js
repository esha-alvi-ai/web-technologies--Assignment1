document.addEventListener('DOMContentLoaded', function() {
    // Handle main navigation dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close all other dropdowns
            dropdownMenus.forEach(menu => {
                if (menu !== this.nextElementSibling) {
                    menu.style.display = 'none';
                }
            });

            // Toggle current dropdown
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.style.display = 
                dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Handle user dropdown
    const userIcon = document.getElementById('userIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const closeDropdown = document.getElementById('closeDropdown');

    userIcon.addEventListener('click', function() {
        dropdownMenu.style.display = 'block';
    });

    closeDropdown.addEventListener('click', function() {
        dropdownMenu.style.display = 'none';
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && !e.target.closest('.user-dropdown')) {
            dropdownMenus.forEach(menu => {
                menu.style.display = 'none';
            });
            dropdownMenu.style.display = 'none';
        }
    });

    // Handle search button click
    const searchButton = document.querySelector('.search-container button');
    const searchInput = document.querySelector('.search-container input');

    searchButton.addEventListener('click', function() {
        if (searchInput.value.trim() !== '') {
            console.log('Searching for:', searchInput.value);
            // Implement search functionality here
        }
    });
});