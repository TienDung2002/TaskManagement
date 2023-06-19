import React, { useState, useEffect } from 'react';

function ScrollToTopButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollThreshold = 200; // Độ dài tối thiểu để hiển thị nút scroll to top

            setShowButton(scrollTop > scrollThreshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="scroll_to_top_button">
            <button
                onClick={scrollToTop}
                style={{
                    opacity: showButton ? 1 : 0,
                    transition: 'opacity 3s ease',
                    display: showButton ? 'block' : 'none',
                }}
            >
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    );
}

export default ScrollToTopButton;
