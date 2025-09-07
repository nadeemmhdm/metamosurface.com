document.addEventListener('DOMContentLoaded', function() {
    // Theme-based logo switching
    const logoImg = document.getElementById('navbar-logo');
    function updateTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            logoImg.src = 'logo1.jpg';
            document.querySelectorAll('.navbar, .nav-link, .search-form, .back-arrow, .color-item, .product-card, .testimonial-card, .contact-info, .contact-form, .privacy-content, .footer-links, .social-icons, #back-to-top, .product-details-content, .inspiration-content, .product-specs').forEach(el => el.classList.add('dark-mode'));
        } else {
            document.body.classList.remove('dark-mode');
            logoImg.src = 'logo.jpg';
            document.querySelectorAll('.navbar, .nav-link, .search-form, .back-arrow, .color-item, .product-card, .testimonial-card, .contact-info, .contact-form, .privacy-content, .footer-links, .social-icons, #back-to-top, .product-details-content, .inspiration-content, .product-specs').forEach(el => el.classList.remove('dark-mode'));
        }
    }
    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    // Page navigation
    const pageLinks = document.querySelectorAll('[data-page]');
    const pageContents = document.querySelectorAll('.page-content');
    const productTitle = document.getElementById('product-title');
    const productDescription = document.getElementById('product-description');
    const productMainImg = document.getElementById('product-main-img');
    const productFeatures = document.getElementById('product-features');
    const colorCode = document.getElementById('color-code');
    const productMaterial = document.getElementById('product-material');
    const buyNowBtn = document.getElementById('buy-now');
    const colorOptions = document.getElementById('color-options');
    function showPage(pageId, productType = null) {
        pageContents.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        if (pageId === 'product-details' && productType) {
            updateProductDetails(productType);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function updateProductDetails(productType) {
        if (productData[productType]) {
            productTitle.textContent = productData[productType].title;
            productDescription.textContent = productData[productType].description;
            productMainImg.src = productData[productType].mainImg;
            productFeatures.textContent = 'Click a color to view its features';
            productMaterial.textContent = productData[productType].material;
            colorCode.textContent = '';
            // Update color options
            colorOptions.innerHTML = productData[productType].colors.map((color, index) => `
                <div class="col-4 color-item animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.2}s;">
                    <div class="product-details-img">
                        <img src="${color.img}" alt="Color ${index + 1}" class="img-fluid color-img" data-color-code="${color.code}" data-features="${color.features}" data-product="${productType}">
                    </div>
                    <div class="color-code-label" data-color-code="${color.code}">${color.code}</div>
                </div>
            `).join('');
            buyNowBtn.onclick = () => {
                const message = `I'm interested in purchasing ${productData[productType].title}. Please provide more details.`;
                window.open(`https://wa.me/919846955954?text=${encodeURIComponent(message)}`, '_blank');
            };
            const shareButtons = document.querySelectorAll('.share-btn');
            shareButtons.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    const type = btn.getAttribute('data-type');
                    const url = window.location.href.split('?')[0] + `?product=${productType}`;
                    let shareUrl = '';
                    if (type === 'facebook') {
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    } else if (type === 'twitter') {
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out ${productData[productType].title} from Metamo Surface Studio!`;
                    } else if (type === 'whatsapp') {
                        shareUrl = `https://wa.me/?text=Check out ${productData[productType].title} from Metamo Surface Studio: ${url}`;
                    } else if (type === 'linkedin') {
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    } else if (type === 'pinterest') {
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(productData[productType].mainImg)}&description=${encodeURIComponent(productData[productType].title)}`;
                    }
                    window.open(shareUrl, '_blank');
                };
            });
            // Add event listeners to new color images
            const colorImgs = document.querySelectorAll('.color-img');
            colorImgs.forEach(img => {
                img.addEventListener('click', handleColorClick);
                img.addEventListener('touchstart', handleColorClick);
            });
            if (colorImgs.length > 0) {
                colorImgs[0].classList.add('active');
                colorImgs[0].closest('.color-item').classList.add('active');
                productMainImg.src = colorImgs[0].src;
                productFeatures.textContent = colorImgs[0].getAttribute('data-features');
                colorCode.textContent = colorImgs[0].getAttribute('data-color-code');
            }
        }
    }
    function handleColorClick(e) {
        e.preventDefault();
        const colorImgs = document.querySelectorAll('.color-img');
        const colorItems = document.querySelectorAll('.color-item');
        colorImgs.forEach(img => img.classList.remove('active'));
        colorItems.forEach(item => item.classList.remove('active'));
        const img = e.target;
        img.classList.add('active');
        img.closest('.color-item').classList.add('active');
        productMainImg.src = img.src;
        productFeatures.textContent = img.getAttribute('data-features');
        colorCode.textContent = img.getAttribute('data-color-code');
    }
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            const productType = link.getAttribute('data-product');
            showPage(pageId, productType);
        });
    });
    // Search functionality
    const searchInputs = document.querySelectorAll('#searchInput, #productSearchInput');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    // Back to top button - Make it always visible (fixed error by removing conditional show/hide and adding 'show' class immediately)
    const backToTop = document.getElementById('back-to-top');
    backToTop.classList.add('show'); // Always show the button
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Handle URL parameters for direct product access
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('product');
    if (productType && productData[productType]) {
        showPage('product-details', productType);
    }
});
