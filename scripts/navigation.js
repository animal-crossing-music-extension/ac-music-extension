$(function() {
  var body = $('body');
  $('.menu a').click(function(ev) {
    ev.preventDefault();
    var selected = 'selected';

    $('.mainview > *, .menu li').removeClass(selected);
    setTimeout(function() {
      $('.mainview > *').not('.selected').css('display', 'none');
    }, 100);

    $(ev.currentTarget).parent().addClass(selected);
    var currentView = $($(ev.currentTarget).attr('href')).css('display', 'block');
    setTimeout(function() {
      currentView.addClass(selected);
    }, 0);

    setTimeout(function() {
      body[0].scrollTop = 0;
    }, 200);
  });

  $('#launch_modal').click(function(ev) {
    ev.preventDefault();
    var modal = $('.overlay').clone();
    var modalPage = modal.find('.page');
    modal.removeAttr('style').find('button, .close-button').click(function() {
      modal.addClass('transparent');
      setTimeout(function() {
        modal.remove();
      }, 1000);
    });

    modal.click(function() {
      modalPage.addClass('pulse').on('webkitAnimationEnd', function() {
        $(this).removeClass('pulse');
      });
    });
    modalPage.click(function(ev) {
      ev.stopPropagation();
    });
    body.append(modal);
  });
  
  $('.mainview > *').not('.selected').css('display', 'none');
});
