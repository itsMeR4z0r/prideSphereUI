function removeTooltip() {
    const tooltips = document.querySelectorAll('[role="tooltip"]');
    for (let tooltip of tooltips) {
        tooltip.remove();
    }
    const elementosTooltip = document.querySelectorAll('[aria-describedby*="tooltip"]');

    elementosTooltip.forEach(elemento => {
        elemento.removeAttribute('aria-describedby');
    });
}
$(document).ready(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    for (let tooltip of tooltipList) {
        tooltip._config.offset = [0, 16];
    }
    window.addEventListener("resize", ()=>{
        const span = document.querySelector('span.d-none');
        if (span) {
            if (span.checkVisibility()) {
                for (let tooltip of tooltipList) {
                    tooltip.disable();
                }
            }else{
                for (let tooltip of tooltipList) {
                    tooltip.enable();
                }
            }
        }
    });
    const collapseElementList = document.querySelectorAll('.collapse');
    for (let collapseEl of collapseElementList) {
        collapseEl.addEventListener('show.bs.collapse', function () {
            const link = document.querySelector('[href="#' + collapseEl.id + '"]');
            const icon = link.querySelector('.collapse-icon');
            removeTooltip();
            if (icon) {
                $(icon).animate({deg: 90}, {
                    duration: 250, step: function (now) {
                        $(this).css({transform: 'rotate(' + now + 'deg)'});
                    }
                });
            }

        });
        collapseEl.addEventListener('hide.bs.collapse', function () {
            const link = document.querySelector('[href="#' + collapseEl.id + '"]');
            const icon = link.querySelector('.collapse-icon');
            if (icon) {
                $(icon).animate({deg: 0}, {
                    duration: 250, step: function (now) {
                        $(this).css({transform: 'rotate(' + now + 'deg)'});
                    }
                });
            }
        });
    }
});