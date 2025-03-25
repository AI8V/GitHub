  // This JavaScript would normally be in a separate file,
  // but is included here for the sake of the example
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    });
    
    // Reading progress
    window.addEventListener('scroll', function() {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      document.getElementById("readingProgress").style.width = scrolled + "%";
      document.getElementById("readingProgress").setAttribute("aria-valuenow", scrolled);
    });
    
    // Copy button functionality
    document.getElementById('copyButton').addEventListener('click', function() {
      var urlInput = this.previousElementSibling;
      urlInput.select();
      document.execCommand('copy');
      
      var tooltip = new bootstrap.Tooltip(this, {
        title: 'تم النسخ!',
        trigger: 'manual'
      });
      
      tooltip.show();
      
      setTimeout(function() {
        tooltip.hide();
      }, 2000);
    });
  });
