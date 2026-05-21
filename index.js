

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-EGP7H1GZ6K');


			document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
		

document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       POPUP HANDLING
       ============================================ */
    const menuIcon = document.getElementById('menu-icon');
    const searchIcon = document.getElementById('search-icon');
    const menuPopup = document.getElementById('menu-popup');
    const searchPopup = document.getElementById('search-popup');
    const closeButtons = document.querySelectorAll('.close-popup');

    function showPopup(popup) {
        if (!popup) return;
        hideAllPopups();
        popup.style.display = 'block';
    }

    function hideAllPopups() {
        const allPopups = document.querySelectorAll('.popup');
        allPopups.forEach(popup => {
            popup.style.display = 'none';
        });
    }

    if (menuIcon) {
        menuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(menuPopup);
        });
    }

    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(searchPopup);
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.display = 'none';
        });
    });

    /* ============================================
       SHARE POPUP
       ============================================ */
    window.showSharePopup = function(event, postId) {
        event.preventDefault();
        const sharePopup = document.getElementById('share-popup');
        const shareOptionsContainer = document.getElementById('share-options-container');
        
        // Get permalink from data attribute or fetch via AJAX
        const permalink = event.currentTarget.getAttribute('data-url') || window.location.href;

        shareOptionsContainer.innerHTML = `
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(permalink)}" class="share-wa share-link" onclick="trackShare(event, ${postId})" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(permalink)}" class="share-fb share-link" onclick="trackShare(event, ${postId})" target="_blank"><i class="fab fa-facebook"></i> Facebook</a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(permalink)}" class="share-twitter share-link" onclick="trackShare(event, ${postId})" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
        `;

        showPopup(sharePopup);
    };

    window.closeSharePopup = function() {
        hideAllPopups();
    };

    window.trackShare = function(event, postId) {
        event.preventDefault();
        updateShareCount(postId);

        const targetHref = event.currentTarget.href;
        if (targetHref) {
            setTimeout(function() {
                window.open(targetHref, '_blank');
            }, 100);
        } else {
            console.error('The href property was not found on the clicked element.');
        }
    };

    function updateShareCount(postId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://langgar.co/wp-admin/admin-ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        var shareCountSpan = document.querySelector(`#share-icon-${postId} .share-count`);
                        if (shareCountSpan) {
                            shareCountSpan.textContent = response.data.share_count;
                        }
                    }
                } catch(e) {
                    console.error('Error parsing response:', e);
                }
            }
        };
        xhr.send('action=update_share_count&post_id=' + postId);
    }

    /* ============================================
       LIKE FUNCTIONALITY
       ============================================ */
    const likeIcons = document.querySelectorAll('.action-item .fa-heart, .action-item-single .fa-heart, .popliked-single .fa-heart');

    likeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeCount = this.nextElementSibling;

            fetch('https://langgar.co/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=add_like&post_id=' + postId,
            })
            .then(response => response.text())
            .then(data => {
                if (likeCount) {
                    likeCount.textContent = data;
                }
                icon.style.color = 'red';
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    /* ============================================
       POPUP CLOSE ON OUTSIDE CLICK
       ============================================ */
    window.onclick = function(event) {
        var popups = document.getElementsByClassName('popup');
        for (var i = 0; i < popups.length; i++) {
            if (event.target == popups[i]) {
                popups[i].style.display = 'none';
            }
        }
    };

    /* ============================================
       HEADER SCROLL
       ============================================ */
    const header = document.querySelector('.header-site');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

});

/* ============================================
   COMMENT FUNCTIONS
   ============================================ */
function showCommentPopup(event, postId) {
    event.preventDefault();
    var popup = document.getElementById('comment-popup-' + postId);
    if (popup) {
        popup.style.display = 'block';
    }
}

function closePopup(postId) {
    var popup = document.getElementById('comment-popup-' + postId);
    if (popup) {
        popup.style.display = 'none';
    }
}

function submitComment(postId) {
    var name = document.getElementById('name-' + postId);
    var comment = document.getElementById('comment-' + postId);

    if (name && comment && name.value && comment.value) {
        var data = {
            action: 'save_comment',
            post_id: postId,
            name: name.value,
            comment: comment.value
        };

        fetch('https://langgar.co/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var commentsDiv = document.getElementById('comments-' + postId);
                if (commentsDiv) {
                    commentsDiv.innerHTML += '<div class="comment pending"><strong>' + name.value + ':</strong> ' + comment.value + ' <em>(pending approval)</em></div>';
                }
                var form = document.getElementById('comment-form-' + postId);
                if (form) {
                    form.reset();
                }
            } else {
                alert('Failed to save comment');
            }
        });
    }
}

/* ============================================
   READ MORE / VIEW COUNT
   ============================================ */
function handleReadMore(event, postId) {
    event.preventDefault();
    const screenWidth = window.innerWidth;
    const postUrl = event.currentTarget.getAttribute('data-url');

    if (screenWidth <= 634) {
        const content = document.getElementById('content-' + postId);
        if (content) {
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        }
    } else if (postUrl) {
        window.location.href = postUrl;
    }

    // Update view count via AJAX
    fetch('https://langgar.co/wp-admin/admin-ajax.php?action=update_post_views&post_id=' + postId)
        .then(response => response.text())
        .then(data => {
            if (data) {
                const readMoreButton = event.target.closest('.read-more-button');
                if (readMoreButton) {
                    const viewCountElement = readMoreButton.querySelector('.view-count');
                    if (viewCountElement) {
                        viewCountElement.textContent = data;
                    }
                }
            }
        })
        .catch(error => console.error('Error:', error));
}


/* <![CDATA[ */
var themeData = {"ajaxurl":"https://langgar.co/wp-admin/admin-ajax.php","nonce":"59f8a5098c","homeUrl":"https://langgar.co/","themeUrl":"https://langgar.co/wp-content/themes/temajobnas","isDebug":""};
//# sourceURL=tema-core-js-extra
/* ]]> */


/* <![CDATA[ */
var smushLazyLoadOptions = {"autoResizingEnabled":false,"autoResizeOptions":{"precision":5,"skipAutoWidth":true}};
//# sourceURL=smush-lazy-load-js-before
/* ]]> */



