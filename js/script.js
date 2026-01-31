document.addEventListener('DOMContentLoaded', () => {
    // Reveal body once script is active
    document.body.classList.remove('no-js');
    document.body.classList.add('js-enabled');

    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navList) {
                navList.classList.remove('active');
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '20px 0';
        }
    });

    // Fade In Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // FAQ Accordion
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', () => {
            // Toggle active class
            accordion.classList.toggle('active');

            // Toggle panel visibility
            const panel = accordion.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
    // Contact Form Submission
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Add custom subject and disable captcha for cleaner experience
            data._subject = "Nuevo mensaje desde el sitio web SUPRA LEGIS";
            data._captcha = "false";
            data._template = "table";

            // Visual feedback for sending
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            // Send to FormSubmit via AJAX
            fetch("https://formsubmit.co/ajax/juridicosupralegis@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(res => {
                    // Hide form and show success message
                    const parent = contactForm.parentElement;
                    contactForm.style.opacity = '0';

                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        const successMsg = document.createElement('div');
                        successMsg.className = 'form-success-message fade-in visible';
                        successMsg.innerHTML = `
                        <div class="success-icon">✅</div>
                        <h3>¡Mensaje enviado con éxito!</h3>
                        <p>Gracias por contactarnos. Un especialista se pondrá en contacto con usted a la brevedad.</p>
                        <button class="btn btn-primary" style="margin-top: 20px;" onclick="location.reload()">Enviar otro mensaje</button>
                    `;
                        parent.appendChild(successMsg);
                    }, 300);
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    alert('Hubo un error al enviar el mensaje. Por favor intente de nuevo o contáctenos directamente por WhatsApp.');
                });
        });
    }
    // Labor Calculator
    const btnCalcular = document.getElementById('btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', () => {
            const fechaIngresoVal = document.getElementById('fecha-ingreso').value;
            const fechaSalidaVal = document.getElementById('fecha-salida').value;
            const salarioMensual = parseFloat(document.getElementById('salario-mensual').value);
            const motivo = document.getElementById('motivo').value;

            if (!fechaIngresoVal || !fechaSalidaVal || !salarioMensual) {
                alert('Por favor complete todos los campos.');
                return;
            }

            const fechaIngreso = new Date(fechaIngresoVal);
            const fechaSalida = new Date(fechaSalidaVal);

            if (fechaSalida < fechaIngreso) {
                alert('La fecha de salida no puede ser anterior a la de ingreso.');
                return;
            }

            const diffTime = Math.abs(fechaSalida - fechaIngreso);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffYears = diffDays / 365;

            const dailySalary = salarioMensual / 30;

            // 1. Indemnización (90 days) - Only for dismissal
            let indemnizacion = 0;
            if (motivo === 'despido') {
                indemnizacion = dailySalary * 90;
            }

            // 2. Aguinaldo (Proportional to days worked in current year)
            const manualAguinaldoDias = parseFloat(document.getElementById('aguinaldo-dias').value);
            const aguinaldoDiasTotal = (!isNaN(manualAguinaldoDias) && manualAguinaldoDias > 0) ? manualAguinaldoDias : 15;

            const currentYear = fechaSalida.getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const daysInCurrentYear = Math.ceil((fechaSalida - startOfYear) / (1000 * 60 * 60 * 24)) || 1;
            const aguinaldo = (dailySalary * aguinaldoDiasTotal) * (daysInCurrentYear / 365);

            // 3. Vacaciones & Prima (Simplified based on LFT 2023)
            function getVacationDays(years) {
                if (years < 1) return 12;
                if (years < 2) return 12;
                if (years < 3) return 14;
                if (years < 4) return 16;
                if (years < 5) return 18;
                if (years < 6) return 20;
                return 22 + (Math.floor((years - 5) / 5) * 2);
            }

            const yearsCompleted = Math.floor(diffYears);
            const manualVacationDays = parseFloat(document.getElementById('vacaciones-anuales').value);
            const vacationDaysTotal = (!isNaN(manualVacationDays) && manualVacationDays > 0)
                ? manualVacationDays
                : getVacationDays(yearsCompleted + 1);

            const daysSinceAnniversary = diffDays % 365;
            const vacations = (dailySalary * vacationDaysTotal) * (daysSinceAnniversary / 365);
            const primaVacacional = vacations * 0.25;

            // 4. Prima de Antigüedad (12 days per year, capped at 2x min wage)
            const minWage = 248.93; // 2024 general
            const capSalary = Math.min(dailySalary, minWage * 2);
            const primaAntiguedad = capSalary * 12 * diffYears;

            // Update UI
            document.getElementById('res-indemnizacion').textContent = `$${indemnizacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
            document.getElementById('res-aguinaldo').textContent = `$${aguinaldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
            document.getElementById('res-vacaciones').textContent = `$${(vacations + primaVacacional).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
            document.getElementById('res-prima-antiguedad').textContent = `$${primaAntiguedad.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

            const total = indemnizacion + aguinaldo + vacations + primaVacacional + primaAntiguedad;
            document.getElementById('res-total').textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

            const resultsDiv = document.getElementById('calculator-results');
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }


    // --- Count Up Animation for Statistics ---
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);

            // Special formatting for "15+" or other non-pure numbers
            if (obj.textContent.includes('+')) {
                obj.textContent = currentValue + '+';
            } else {
                obj.textContent = currentValue;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target') || target.textContent);

                // Set initial to 0 but keep suffix if it exists
                const hasPlus = target.textContent.includes('+');
                target.textContent = hasPlus ? '0+' : '0';

                animateValue(target, 0, endValue, 2000); // 2 seconds duration
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    // Apply to main stats and footer counter
    document.querySelectorAll('.stat-number, .visit-counter-num').forEach(stat => {
        // Store the target number in an attribute for safer reading
        const targetVal = stat.textContent.replace('+', '').trim();
        stat.setAttribute('data-target', targetVal);
        statsObserver.observe(stat);
    });

    // Handle Visit Counter in Footer specifically
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        visitCounter.innerHTML = `Casos atendidos: <span class="visit-counter-num" data-target="302">0</span>`;
        const numSpan = visitCounter.querySelector('.visit-counter-num');
        statsObserver.observe(numSpan);
    }

    // Discreet Visitor Counter Logic
    const visitorStats = document.getElementById('visitor-stats');
    if (visitorStats) {
        // We simulate a real count starting from a professional base number
        let baseCount = 1420;
        let currentVisits = parseInt(localStorage.getItem('sl_visit_count') || baseCount);

        // Increment once per session to make it feel "real"
        if (!sessionStorage.getItem('sl_session_active')) {
            currentVisits += Math.floor(Math.random() * 5) + 1; // Add 1-5 visits
            localStorage.setItem('sl_visit_count', currentVisits);
            sessionStorage.setItem('sl_session_active', 'true');
        }

        visitorStats.innerHTML = `Visitas: <span class="visitor-stats-num" data-target="${currentVisits}">0</span>`;
        const visitSpan = visitorStats.querySelector('.visitor-stats-num');
        statsObserver.observe(visitSpan);
    }
});

