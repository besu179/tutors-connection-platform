document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            window.location.href = target;
        });
    });

    // Update UI based on authentication status
    function updateAuthUI() {
        const token = localStorage.getItem('auth_token');
        const nav = document.querySelector('.main-nav');
        if (nav) {
            if (token) {
                nav.innerHTML = `
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="profile.html">Profile</a></li>
                        <li><a href="#" id="logout-btn">Logout</a></li>
                    </ul>
                `;

                // Add logout handler
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async function(e) {
                        e.preventDefault();
                        try {
                            await fetch('/api/logout', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            localStorage.removeItem('auth_token');
                            window.location.href = 'login.html';
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    });
                }
            } else {
                nav.innerHTML = `
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="register.html">Register</a></li>
                    </ul>
                `;
            }
        }
    }

    // Initialize
    updateAuthUI();
});
