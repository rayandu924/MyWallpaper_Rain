const defaultConfig = {
    density: 100,
    length: 5,
    size: 2,
    wind_speed: 0,
    dance: 0.1,
    speed: 2,
    color: '#00aaff'
};

let config = { ...defaultConfig };
let animationId;

function parseConfigValues(config) {
    return {
        density: parseFloat(config.density),
        length: parseFloat(config.length),
        size: parseFloat(config.size),
        wind_speed: parseFloat(config.wind_speed),
        dance: parseFloat(config.dance),
        speed: parseFloat(config.speed),
        color: config.color // Color remains a string
    };
}

function initAnimation(currentConfig) {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Parse les valeurs numériques avant de les utiliser
    config = parseConfigValues({ ...defaultConfig, ...currentConfig });

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    let particles = [];
    let maxParts = config.density;

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParts; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                l: Math.random() * config.length,
                size: Math.random() * config.size + config.size,
                xs: config.wind_speed + (-config.dance + Math.random() * config.dance * 2),
                ys: Math.random() * config.speed + config.speed + (-config.dance + Math.random() * config.dance * 2)
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = config.color;
        ctx.lineCap = 'round';

        particles.forEach(p => {
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
        });

        move();
    }

    function move() {
        particles.forEach(p => {
            p.x += p.xs;
            p.y += p.ys;

            if (p.x > w || p.y > h) {
                p.x = Math.random() * w;
                p.y = -20;
            }
        });
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    // Initialiser les particules et démarrer l'animation
    initParticles();
    animate();

    window.onresize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        initParticles();
    };
}

// Initialiser l'animation avec la configuration par défaut
initAnimation();

// Écouter l'événement personnalisé pour mettre à jour la configuration
document.addEventListener('MyWallpaperContentLoaded', (event) => {
    console.log("MyWallpaperContentLoaded", event.detail);
    const newConfig = event.detail;
    initAnimation(newConfig);
});
