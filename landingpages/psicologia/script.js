document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add a class to make it visible
                // Re-add the animation class stored in data-animation
                if (entry.target.dataset.animation) {
                    entry.target.classList.add(entry.target.dataset.animation);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate__animated class
    const animatedElements = document.querySelectorAll('.animate__animated');
    animatedElements.forEach(element => {
        // Find the specific animate.css class and store it
        const animationClass = Array.from(element.classList).find(cls => cls.startsWith('animate__'));
        if (animationClass) {
            element.dataset.animation = animationClass; // Store it
            element.classList.remove(animationClass); // Remove initially to control via JS
        }
        observer.observe(element);
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle form submission (client-side only for demo)
    const schedulingForm = document.querySelector('#scheduling-form form');
    if (schedulingForm) {
        schedulingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            const formData = new FormData(this);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            // In a real application, you'd send this data to a backend server.
            console.log('Dados do agendamento:', data);

            alert('Agendamento simulado com sucesso! Entraremos em contato em breve.');
            this.reset(); // Clear the form
        });
    }
    // A lógica do carrossel foi removida daqui
});