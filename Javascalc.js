// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupScrollEffects();
    setupMobileMenu();
    setupSmoothScrolling();
    setupFormValidation();
    setupAnimations();
}

// Scroll effects for header
function setupScrollEffects() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarCollapse.classList.remove('show');
        });
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation setup
function setupFormValidation() {
    const inputs = document.querySelectorAll('#length, #width, #height');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearError);
    });
}

// Setup scroll animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.product-card, .stat-item, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Input validation
function validateInput(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const value = parseFloat(input.value);
    
    if (!input.value || value <= 0 || isNaN(value)) {
        formGroup.classList.add('error');
        return false;
    } else {
        formGroup.classList.remove('error');
        return true;
    }
}

// Clear error state
function clearError(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    
    if (input.value && parseFloat(input.value) > 0) {
        formGroup.classList.remove('error');
    }
}

// Material Calculator Function
function calculateMaterials() {
    // Get input values
    const projectType = document.getElementById('project-type').value;
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    
    // Validate inputs
    if (!validateAllInputs()) {
        showError('Por favor, completa todos los campos correctamente.');
        return;
    }
    
    // Calculate based on project type
    let materials = {};
    
    switch(projectType) {
        case 'losa':
            materials = calculateLosa(length, width, height);
            break;
        case 'muro':
            materials = calculateMuro(length, width, height);
            break;
        case 'firme':
            materials = calculateFirme(length, width, height);
            break;
        case 'columna':
            materials = calculateColumna(length, width, height);
            break;
        default:
            showError('Tipo de proyecto no válido.');
            return;
    }
    
    displayResults(materials);
}

// Validate all inputs
function validateAllInputs() {
    const inputs = document.querySelectorAll('#length, #width, #height');
    let isValid = true;
    
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const value = parseFloat(input.value);
        
        if (!input.value || value <= 0 || isNaN(value)) {
            formGroup.classList.add('error');
            isValid = false;
        } else {
            formGroup.classList.remove('error');
        }
    });
    
    return isValid;
}

// Calculate materials for concrete slab
function calculateLosa(length, width, height) {
    const volume = length * width * height;
    const area = length * width;
    
    // Standard ratios for concrete slab
    const concreteRatio = 1.05; // 5% waste factor
    const cementBags = volume * 6.5; // bags per m³
    const sandM3 = volume * 0.5;
    const gravelM3 = volume * 0.7;
    const steelKg = area * 8; // kg per m²
    const armexM2 = area * 1.1; // 10% overlap
    
    return {
        'Concreto': `${(volume * concreteRatio).toFixed(2)} m³`,
        'Cemento': `${Math.ceil(cementBags)} sacos`,
        'Arena': `${sandM3.toFixed(2)} m³`,
        'Grava': `${gravelM3.toFixed(2)} m³`,
        'Varilla': `${steelKg.toFixed(0)} kg`,
        'Armex': `${armexM2.toFixed(2)} m²`
    };
}

// Calculate materials for block wall
function calculateMuro(length, width, height) {
    const area = length * height;
    
    // Standard calculations for block wall
    const blocks = Math.ceil(area * 13); // blocks per m²
    const mortarM3 = area * 0.02;
    const cementBags = Math.ceil(mortarM3 * 8);
    const sandM3 = mortarM3 * 4;
    const steelKg = (length / 3) * height * 4; // vertical reinforcement
    
    return {
        'Blocks': `${blocks} piezas`,
        'Cemento': `${cementBags} sacos`,
        'Arena': `${sandM3.toFixed(2)} m³`,
        'Varilla': `${steelKg.toFixed(0)} kg`,
        'Alambre recocido': `${Math.ceil(blocks / 50)} kg`
    };
}

// Calculate materials for concrete floor
function calculateFirme(length, width, height) {
    const volume = length * width * height;
    const area = length * width;
    
    // Standard ratios for concrete floor
    const concreteRatio = 1.05;
    const cementBags = volume * 5.5; // less cement for floor
    const sandM3 = volume * 0.6;
    const gravelM3 = volume * 0.8;
    
    return {
        'Concreto': `${(volume * concreteRatio).toFixed(2)} m³`,
        'Cemento': `${Math.ceil(cementBags)} sacos`,
        'Arena': `${sandM3.toFixed(2)} m³`,
        'Grava': `${gravelM3.toFixed(2)} m³`,
        'Polietileno': `${(area * 1.1).toFixed(2)} m²`
    };
}

// Calculate materials for column
function calculateColumna(length, width, height) {
    const volume = length * width * height;
    
    // Standard ratios for column
    const concreteRatio = 1.05;
    const cementBags = volume * 7; // more cement for column
    const sandM3 = volume * 0.45;
    const gravelM3 = volume * 0.65;
    const steelKg = volume * 120; // high steel ratio for column
    const stirrupsKg = height * 2; // stirrups
    
    return {
        'Concreto': `${(volume * concreteRatio).toFixed(2)} m³`,
        'Cemento': `${Math.ceil(cementBags)} sacos`,
        'Arena': `${sandM3.toFixed(2)} m³`,
        'Grava': `${gravelM3.toFixed(2)} m³`,
        'Varilla longitudinal': `${steelKg.toFixed(0)} kg`,
        'Estribos': `${stirrupsKg.toFixed(0)} kg`,
        'Alambre recocido': `${Math.ceil(steelKg / 100)} kg`
    };
}

// Display calculation results
function displayResults(materials) {
    const resultDiv = document.getElementById('calc-result');
    const materialList = document.getElementById('material-list');
    
    // Clear previous results
    materialList.innerHTML = '';
    
    // Create material list
    Object.entries(materials).forEach(([material, quantity]) => {
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        materialItem.innerHTML = `
            <span class="fw-bold">${material}:</span>
            <span class="text-gold">${quantity}</span>
        `;
        materialList.appendChild(materialItem);
    });
    
    // Show results with animation
    resultDiv.classList.add('show');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Add success message
    showSuccess('Cálculo completado exitosamente.');
}

// Show error message
function showError(message) {
    // Remove any existing messages
    removeMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${message}`;
    
    const calcButton = document.querySelector('.calc-button');
    calcButton.parentNode.insertBefore(errorDiv, calcButton.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show success message
function showSuccess(message) {
    // Remove any existing messages
    removeMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    
    const calcButton = document.querySelector('.calc-button');
    calcButton.parentNode.insertBefore(successDiv, calcButton.nextSibling);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// Remove existing messages
function removeMessages() {
    const existingMessages = document.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
}

// Utility function to format numbers
function formatNumber(number, decimals = 2) {
    return number.toLocaleString('es-MX', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Add loading state to calculate button
function setButtonLoading(isLoading) {
    const button = document.querySelector('.calc-button');
    
    if (isLoading) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculando...';
        button.disabled = true;
    } else {
        button.innerHTML = 'Calcular Materiales';
        button.disabled = false;
    }
}

// Contact form handling (if you add a contact form later)
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to your server
    console.log('Contact form data:', data);
    
    showSuccess('Mensaje enviado exitosamente. Te contactaremos pronto.');
    event.target.reset();
}

// Initialize AOS (Animate On Scroll) if you want to add it later
function initAOS() {
    // This would be used if you include AOS library
    // AOS.init({
    //     duration: 1000,
    //     easing: 'ease-in-out',
    //     once: true
    // });
}

// Google Analytics tracking (add your tracking ID)
function initGA() {
    // Add your Google Analytics code here
    // gtag('config', 'GA_TRACKING_ID');
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.loading !== 'lazy') {
            img.loading = 'lazy';
        }
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateMaterials,
        calculateLosa,
        calculateMuro,
        calculateFirme,
        calculateColumna
    };
}