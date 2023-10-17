$(document).ready(function () {
    const collapseElementList = document.querySelectorAll('.collapse');
    for (let collapseEl of collapseElementList) {
        collapseEl.addEventListener('show.bs.collapse', function () {
            const link = document.querySelector('[href="#' + collapseEl.id + '"]');
            const icon = link.querySelector('.collapse-icon');
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
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});