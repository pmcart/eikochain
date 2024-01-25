var eikochain = {
  targetElement : '',

  load: function () {
    if (meta) {
      console.log(meta);
      targetElement = document.getElementById("eikochainjs").getAttribute("data-target");
      this.getEikoChainSupply();
    }
  },
  insertAfter: function (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  },

  hideOverlay: function () {
    document.querySelector("#modal-contact-dark-overlay").style.display =
      "none";
  },
  hideModal: function () {
    document.querySelector("#PreviewDialog").style.display = "none";

    setTimeout(function(){
      document.removeEventListener('click',eikochain.handleOutModalClick);
    },500)
  },
  showOverlay: function () {
    document.querySelector("#modal-contact-dark-overlay").style.display =
      "block";
  },
  showModal: function () {
  
    var refThis = this;

    setTimeout(function(){
      document.addEventListener('click',eikochain.handleOutModalClick);
    },500)

    document.querySelector("#PreviewDialog").style.display = "block";
  },
    
  handleOutModalClick:function(event){
    var refThis = this;
    var ignoreClickOnMeElement = document.getElementById('PreviewDialogObj');

    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    if (!isClickInsideElement) {
      eikochain.hideModal();
      eikochain.hideOverlay();
    }
  },
  addButton: function () {
    var sections = document.getElementsByClassName("shopify-section");
    var firstSection = sections[1];

    var el = document.createElement("div");
    el.innerHTML =
      '<button class="btn" id="open-modal">View our Supply Chain</button>';
    el.style = "text-align: center;";
    this.insertAfter(firstSection, el);
  },
  addStyles: function () {
    let styleBlock = `
    
    <style>
    @keyframes "drop-in" {
        from {
          top: 10%;
        }
        to {
          top: 25%;
        }
      }
      @keyframes "animateopacity" {
        from {
          background-color: rgba(0, 0, 0, 0);
        }
        to {
          background-color: rgba(0, 0, 0, 0.7);
        }
      }
      #eikochainContainer .nav {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
      }
      #eikochainContainer .nav-link {
        display: block;
        padding: 0.5rem 1rem;
        color: #1266f1;
        text-decoration: none;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
      }
      #eikochainContainer .nav-link:focus {
        color: #0e52c1;
      }
      #eikochainContainer .nav-link:hover {
        color: #0e52c1;
      }
      #eikochainContainer .nav-link.disabled {
        color: #757575;
        pointer-events: none;
        cursor: default;
      }
      #eikochainContainer .nav-tabs {
        border-bottom: 1px solid #e0e0e0;
        border-bottom: 0;
      }
      #eikochainContainer .nav-tabs .nav-link {
        margin-bottom: -1px;
        background: none;
        border: 1px solid transparent;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        border: solid transparent;
        border-width: 0 0 2px;
        border-radius: 0;
        text-transform: uppercase;
        line-height: 1;
        font-weight: 500;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        padding: 17px 29px 16px;
      }
      #eikochainContainer .nav-tabs .nav-link:focus {
        border-color: #eee #eee #e0e0e0;
        isolation: isolate;
        border-color: transparent;
      }
      #eikochainContainer .nav-tabs .nav-link:hover {
        border-color: #eee #eee #e0e0e0;
        isolation: isolate;
        background-color: #f5f5f5;
        border-color: transparent;
      }
      #eikochainContainer .nav-tabs .nav-link.disabled {
        color: #757575;
        background-color: transparent;
        border-color: transparent;
      }
      #eikochainContainer .nav-tabs .nav-item.show .nav-link {
        color: #616161;
        background-color: #fff;
        border-color: #e0e0e0 #e0e0e0 #fff;
        color: #1266f1;
        border-color: #1266f1;
      }
      #eikochainContainer .nav-tabs .nav-link.active {
        color: #616161;
        background-color: #fff;
        border-color: #e0e0e0 #e0e0e0 #fff;
        color: #1266f1;
        border-color: #1266f1;
      }
      #eikochainContainer .nav-tabs .dropdown-menu {
        margin-top: -1px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
      #eikochainContainer .nav-pills {
        margin-left: -0.5rem;
      }
      #eikochainContainer .nav-pills .nav-link {
        background: none;
        border: 0;
        border-radius: 0.25rem;
        font-size: 12px;
        text-transform: uppercase;
        padding: 17px 29px 16px;
        line-height: 1;
        background-color: #f5f5f5;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
        margin: 0.5rem;
      }
      #eikochainContainer .nav-pills .nav-link.active {
        color: #fff;
        background-color: #1266f1;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      }
      #eikochainContainer .nav-pills .show > .nav-link {
        color: #fff;
        background-color: #1266f1;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      }
      #eikochainContainer .nav-fill .nav-item {
        flex: 1 1 auto;
        text-align: center;
      }
      #eikochainContainer .nav-fill .nav-item .nav-link {
        width: 100%;
        width: auto;
      }
      #eikochainContainer .nav-fill > .nav-link {
        flex: 1 1 auto;
        text-align: center;
      }
      #eikochainContainer .nav-justified .nav-item {
        flex-basis: 0;
        flex-grow: 1;
        text-align: center;
      }
      #eikochainContainer .nav-justified .nav-item .nav-link {
        width: 100%;
        width: auto;
      }
      #eikochainContainer .nav-justified > .nav-link {
        flex-basis: 0;
        flex-grow: 1;
        text-align: center;
      }
      #eikochainContainer .navbar {
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
        padding-top: 0.5625rem;
      }
      #eikochainContainer .navbar-toggler {
        border: 0;
      }
      #eikochainContainer .navbar-toggler:focus {
        box-shadow: none;
      }
      #eikochainContainer .navbar-dark .navbar-toggler {
        border: 0;
      }
      #eikochainContainer .navbar-dark .navbar-toggler-icon {
        background-image: none;
      }
      #eikochainContainer .navbar-light .navbar-toggler {
        border: 0;
      }
      #eikochainContainer .navbar-light .navbar-toggler-icon {
        background-image: none;
      }
      #eikochainContainer .navbar-brand {
        display: flex;
        align-items: center;
      }
      #eikochainContainer .navbar-brand img {
        margin-right: 0.25rem;
      }
      #eikochainContainer .navbar-nav .dropdown-menu {
        position: absolute;
      }
      #eikochainContainer .tab-content > .tab-pane {
        display: none;
      }
      #eikochainContainer .tab-content > .active {
        display: block;
      }
      #eikochainContainer .bootmodal {
        position: fixed;
        top: 50px;
        left: 0;
        z-index: 1055;
        display: none;
        width: 100%;
        height: 100%;
        outline: 0;
      }
      #eikochainContainer .bootmodal-dialog {
        position: relative;
        width: auto;
        margin: 0.5rem;
        pointer-events: none;
      }
      #eikochainContainer .bootmodal.fade .bootmodal-dialog {
        transition: transform 0.3s ease-out;
        transform: translateY(-50px);
      }
      #eikochainContainer .bootmodal.show .bootmodal-dialog {
        transform: none;
      }
      #eikochainContainer .bootmodal.modal-static .bootmodal-dialog {
        transform: scale(1.02);
      }
      #eikochainContainer .bootmodal-dialog-scrollable {
        height: calc(100% - 1rem);
      }
      #eikochainContainer .bootmodal-dialog-scrollable .bootmodal-content {
        max-height: 100%;
        overflow: hidden;
      }
      #eikochainContainer .bootmodal-dialog-scrollable .bootmodal-body {
        overflow-y: auto;
      }
      #eikochainContainer .bootmodal-dialog-centered {
        display: flex;
        align-items: center;
        min-height: calc(100% - 1rem);
      }
      #eikochainContainer .bootmodal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 0.5rem;
        outline: 0;
      }
      #eikochainContainer .bootmodal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1050;
        width: 100vw;
        height: 100vh;
        background-color: #000;
      }
      #eikochainContainer .bootmodal-backdrop.fade {
        opacity: 0;
      }
      #eikochainContainer .bootmodal-backdrop.show {
        opacity: 0.5;
      }
      #eikochainContainer .bootmodal-header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #e0e0e0;
        border-top-left-radius: calc(.5rem - 1px);
        border-top-right-radius: calc(.5rem - 1px);
      }
      #eikochainContainer .bootmodal-header .btn-close {
        padding: 0.5rem;
        margin: -0.5rem -0.5rem -0.5rem auto;
      }
      #eikochainContainer .bootmodal-title {
        margin-bottom: 0;
        line-height: 1.6;
      }
      #eikochainContainer .bootmodal-body {
        position: relative;
        flex: 1 1 auto;
        padding: 1rem;
      }
      #eikochainContainer .bootmodal-footer {
        display: flex;
        flex-wrap: wrap;
        flex-shrink: 0;
        align-items: center;
        justify-content: flex-end;
        padding: 0.75rem;
        border-top: 1px solid #e0e0e0;
        border-bottom-right-radius: calc(.5rem - 1px);
        border-bottom-left-radius: calc(.5rem - 1px);
      }
      #eikochainContainer .bootmodal-footer > * {
        margin: 0.25rem;
      }
      #eikochainContainer #contact-modal-exit {
        position: absolute;
        right: 20px;
        border: none;
        background: none;
        font-size: 18px;
      }
      #eikochainContainer .hide-modal-content {
        display: none;
      }
      #eikochainContainer #contact-modal-button {
        position: relative;
        background: black;
        left: 5px;
        top: -8px;
        min-width: 34%;
      }
      #eikochainContainer .txtItem {
        display: inline-block;
        height: min-content !important;
      }
      #eikochainContainer #modal-contact-dark-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.7);
        overflow: auto;
        animation-name: animateopacity;
        animation-duration: 0.5s;
      }
      #eikochainContainer input#ContactFormArtwork {
        background-color: #F5F5F5;
        font-style: italic;
      }
      #eikochainContainer input#ContactFormArtwork:focus {
        outline: none;
      }
      #eikochainContainer input#ContactFormSku {
        background-color: #F5F5F5;
        font-style: italic;
      }
      #eikochainContainer input#ContactFormSku:focus {
        outline: none;
      }
      #eikochainContainer .bootstrap-wrapper {
        height: 100%;
      }
      #eikochainContainer .bootstrap-wrapper .row {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-1 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-2 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-3 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-4 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-5 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-6 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-7 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-8 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-10 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-11 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-12 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-auto {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-1 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-2 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-3 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-4 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-5 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-6 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-7 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-8 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-10 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-11 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-12 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-sm-auto {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-1 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 8.3333333333%;
        -ms-flex: 0 0 8.3333333333%;
        flex: 0 0 8.3333333333%;
        max-width: 8.3333333333%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-2 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 16.6666666667%;
        -ms-flex: 0 0 16.6666666667%;
        flex: 0 0 16.6666666667%;
        max-width: 16.6666666667%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-3 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 25%;
        -ms-flex: 0 0 25%;
        flex: 0 0 25%;
        max-width: 25%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-4 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 33.3333333333%;
        -ms-flex: 0 0 33.3333333333%;
        flex: 0 0 33.3333333333%;
        max-width: 33.3333333333%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-5 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 41.6666666667%;
        -ms-flex: 0 0 41.6666666667%;
        flex: 0 0 41.6666666667%;
        max-width: 41.6666666667%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-6 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 50%;
        -ms-flex: 0 0 50%;
        flex: 0 0 50%;
        max-width: 50%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-7 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 58.3333333333%;
        -ms-flex: 0 0 58.3333333333%;
        flex: 0 0 58.3333333333%;
        max-width: 58.3333333333%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-8 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 66.6666666667%;
        -ms-flex: 0 0 66.6666666667%;
        flex: 0 0 66.6666666667%;
        max-width: 66.6666666667%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 75%;
        -ms-flex: 0 0 75%;
        flex: 0 0 75%;
        max-width: 75%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-10 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 83.3333333333%;
        -ms-flex: 0 0 83.3333333333%;
        flex: 0 0 83.3333333333%;
        max-width: 83.3333333333%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-11 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 91.6666666667%;
        -ms-flex: 0 0 91.6666666667%;
        flex: 0 0 91.6666666667%;
        max-width: 91.6666666667%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-12 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 100%;
        -ms-flex: 0 0 100%;
        flex: 0 0 100%;
        max-width: 100%;
      }
      #eikochainContainer .bootstrap-wrapper .col-md {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-md-auto {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 auto;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-1 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-2 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-3 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-4 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-5 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-6 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-7 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-8 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-10 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-11 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-12 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-lg-auto {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-1 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-2 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-3 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-4 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-5 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-6 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-7 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-8 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-10 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-11 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-12 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .bootstrap-wrapper .col-xl-auto {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
      }
      #eikochainContainer .row {
        --mdb-gutter-x: 1.5rem;
        --mdb-gutter-y: 0;
        display: flex;
        flex-wrap: wrap;
        margin-top: calc(var(--mdb-gutter-y)*-1);
        margin-right: calc(var(--mdb-gutter-x)*-0.5);
        margin-left: calc(var(--mdb-gutter-x)*-0.5);
      }
      #eikochainContainer .row > * {
        flex-shrink: 0;
        width: 100%;
        max-width: 100%;
        padding-right: calc(var(--mdb-gutter-x)*0.5);
        padding-left: calc(var(--mdb-gutter-x)*0.5);
        margin-top: var(--mdb-gutter-y);
      }
      #eikochainContainer .col {
        flex: 1 0 0%;
      }
      #eikochainContainer .row-cols-auto > * {
        flex: 0 0 auto;
        width: auto;
      }
      #eikochainContainer .row-cols-1 > * {
        flex: 0 0 auto;
        width: 100%;
      }
      #eikochainContainer .row-cols-2 > * {
        flex: 0 0 auto;
        width: 50%;
      }
      #eikochainContainer .row-cols-3 > * {
        flex: 0 0 auto;
        width: 33.3333333333%;
      }
      #eikochainContainer .row-cols-4 > * {
        flex: 0 0 auto;
        width: 25%;
      }
      #eikochainContainer .row-cols-5 > * {
        flex: 0 0 auto;
        width: 20%;
      }
      #eikochainContainer .row-cols-6 > * {
        flex: 0 0 auto;
        width: 16.6666666667%;
      }
      #eikochainContainer .col-auto {
        flex: 0 0 auto;
        width: auto;
      }
      #eikochainContainer .col-1 {
        flex: 0 0 auto;
        width: 8.33333333%;
      }
      #eikochainContainer .col-2 {
        flex: 0 0 auto;
        width: 16.66666667%;
      }
      #eikochainContainer .col-3 {
        flex: 0 0 auto;
        width: 25%;
      }
      #eikochainContainer .col-4 {
        flex: 0 0 auto;
        width: 33.33333333%;
      }
      #eikochainContainer .col-5 {
        flex: 0 0 auto;
        width: 41.66666667%;
      }
      #eikochainContainer .col-6 {
        flex: 0 0 auto;
        width: 50%;
      }
      #eikochainContainer .col-7 {
        flex: 0 0 auto;
        width: 58.33333333%;
      }
      #eikochainContainer .col-8 {
        flex: 0 0 auto;
        width: 66.66666667%;
      }
      #eikochainContainer .col-9 {
        flex: 0 0 auto;
        width: 75%;
      }
      #eikochainContainer .col-10 {
        flex: 0 0 auto;
        width: 83.33333333%;
      }
      #eikochainContainer .col-11 {
        flex: 0 0 auto;
        width: 91.66666667%;
      }
      #eikochainContainer .col-12 {
        flex: 0 0 auto;
        width: 100%;
      }
      #eikochainContainer .stepContainerRow {
        min-height: 100px;
        margin-left: 0px;
        max-width: 100%;
        margin-bottom: 10px;
        display: flex;
        overflow: auto;
        overflow-y: hidden;
        overflow-x: hidden;
      }
      #eikochainContainer #titleText {
        display: table;
        margin: 0 auto;
        padding-bottom: 10px;
        font-size: 20px;
        font-family: system-ui;
      }
      #eikochainContainer .stepContainerCol {
        padding: 2px;
        height: auto !important;
      }
      #eikochainContainer .stepColInner {
        position: relative;
        height: auto;
        overflow-wrap: break-word;
      }
      #eikochainContainer .resizable {
        transition: width 1s ease-in-out;
      }
      #eikochainContainer .stepContainer {
        padding-left: 0px;
        padding-right: 0px;
      }
      #eikochainContainer .step-card {
        min-height: 400px;
      }
      #eikochainContainer #previewModalContent {
        border-radius: 0px;
        width: 700px;
      }
      #eikochainContainer #previewModalContent .stepColInner {
        border: none !important;
      }
      #eikochainContainer #previewModalContent .stepContainerRow {
        border: none !important;
      }
      #eikochainContainer #stepsContainer {
        width: 600px;
      }
      #eikochainContainer #stepsContainerLogo {
        width: 100%;
      }
      #eikochainContainer .stepsContainerSide {
        background: linear-gradient(to right top, #051937, #002d3e, #1d3d3f, #3e4c45, #595a57);
      }
      #eikochainContainer #stepTabs .nav-link {
        color: white;
        background-color: transparent !important;
        position: relative;
        overflow-wrap: break-word;
        text-transform: none !important;
      }
      #eikochainContainer .stepsContainerMain {
        padding-left: 0px;
        padding-right: 0px;
        border: 1px solid #eee;
        max-height: 550px;
        overflow-y: scroll;
        overflow-x: clip;
      }
      #eikochainContainer .nopadding {
        padding: 0 !important;
        margin: 0 !important;
      }
      #eikochainContainer .step-img {
        width: 100%;
      }
      #eikochainContainer .resizableImg {
        width: 100%;
        height: 100%;
      }
      #eikochainContainer .step-video {
        width: 100%;
      }
      #eikochainContainer .topBanner {
        background-image: url(../images/layoutimages/cups.jpg);
        background-size: cover;
        width: 100%;
        height: 100%;
        position: relative;
      }
      #eikochainContainer .editIcon {
        position: absolute;
        top: 5px;
        right: 0px;
      }
      #eikochainContainer .editIconAbs {
        position: absolute;
        top: 0px;
        right: 0px;
      }
      #eikochainContainer .topBannerImg {
        height: 100%;
        width: 100%;
      }
      #eikochainContainer .bottomBanner {
        background-image: url(../images/layoutimages/city.jpg);
        background-size: cover;
        width: 100%;
        height: 100%;
      }
      #eikochainContainer .layoutBlock {
        padding: 10px;
        font-size: 12px;
        margin-bottom: 10px;
      }
      #eikochainContainer .layout-img-selected {
        border: 1px solid blue;
      }
      #eikochainContainer .logoImg {
        width: 140px;
        height: 80px;
        padding: 10px;
      }
      #eikochainContainer .modal-editcolors {
        width: 20%;
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 0;
      }
      #eikochainContainer .addToRowBtn {
        float: right;
        font-size: 36px;
        color: red;
        margin-left: 520px;
        position: absolute;
      }
      #eikochainContainer .rowDeleteBtn {
        float: right;
        font-size: 36px;
        color: red;
        margin-left: 565px;
        position: absolute;
      }
      #eikochainContainer .arrowRowBtnUp {
        float: right;
        font-size: 24px;
        color: black;
        margin-left: 530px;
        margin-top: 42px;
        position: absolute;
        cursor: pointer;
      }
      #eikochainContainer .arrowRowBtnDown {
        float: right;
        font-size: 24px;
        color: black;
        margin-left: 530px;
        margin-top: 70px;
        position: absolute;
        cursor: pointer;
      }
      #eikochainContainer #mainBodySection {
        max-width: 700px;
        min-height: 500px;
        margin-left: 5px;
      }
      #eikochainContainer .mainBodySection {
        max-width: 100% !important;
        min-height: auto !important;
        margin-left: 0px !important;
      }
      #eikochainContainer .previewModal {
        top: 50px;
        height: 600px;
      }
      #eikochainContainer .previewModal h1 {
        text-align: center;
        font-size: 3rem;
        margin-top: 2rem;
        margin-bottom: 1.5rem;
      }
      #eikochainContainer .previewModal .card {
        background: none;
      }
      #eikochainContainer .previewModal section {
        padding: 0 15px 0 15px;
      }
      #eikochainContainer .previewModal .logo {
        display: inline;
        margin-right: 15px;
      }
      #eikochainContainer .previewModal #trash {
        background-color: #cc6857;
      }
      #eikochainContainer .previewModal .navbar {
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: justify;
        justify-content: space-between;
        padding: 0rem 0rem;
      }
      #eikochainContainer .previewModal .nav > li > a {
        position: relative;
        display: block;
        padding: 0px 15px;
      }
      #eikochainContainer #iframeSupplyChain {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        height: 500px !important;
      }
      #eikochainContainer .modal-preview-content {
        background-color: transparent;
        border: 0px;
      }
      #eikochainContainer .grid-stack-item {
        border: 0;
      }
      #eikochainContainer .grid-stack-item-content {
        background-color: white;
        text-align: center;
        left: 3px;
        right: 3px;
      }
      #eikochainContainer #previewModalRow {
        min-height: 500px;
      }
      #eikochainContainer .grid-stack-item-removing {
        opacity: 0.8;
        filter: blur(5px);
      }
      #eikochainContainer .newWidget > .grid-stack-item-content {
        background-color: #6cad84;
        left: 0px;
        right: 0px;
      }
      #eikochainContainer body {
        height: 1500px;
      }
      #eikochainContainer #gridContainer {
        width: 500px;
        height: 500px;
      }
      #eikochainContainer .btn-floating {
        border-radius: 50%;
        padding: 0;
        position: relative;
        width: 3.3125rem;
        height: 3.3125rem;
        text-align: center;
      }
      #eikochainContainer .stepImg {
        height: 100%;
        width: 100%;
      }
      #eikochainContainer .editor-menu {
        background-color: white;
        height: 100%;
      }
      #eikochainContainer .editor-menu-action {
        font-size: 18px;
      }
      #eikochainContainer .editor-action-row-text {
        text-align: left;
        align-self: center;
      }
      #eikochainContainer .editor-menu-row {
        margin-bottom: 20px;
        text-align: center;
      }
      #eikochainContainer .editor-menu-row .btn {
        margin-bottom: 20px;
      }
      #eikochainContainer .resize-drag {
        width: 120px;
        border-radius: 8px;
        margin: 1rem;
        font-size: 20px;
        font-family: sans-serif;
        touch-action: none;
        box-sizing: border-box;
      }
      #eikochainContainer .drop-outer {
        height: 100%;
      }
      #eikochainContainer .drop-inner {
        height: 80px;
      }
      #eikochainContainer .modal .dropzone {
        border: dashed 4px transparent;
        border-radius: 4px;
        margin: 10px auto 30px;
        padding: 10px;
        width: 100%;
        background-image: none;
        overflow-y: hidden;
      }
      #eikochainContainer .modal .drag-drop {
        border: none !important;
      }
      #eikochainContainer .modal #sideMenu {
        background-color: darkcyan;
      }
      #eikochainContainer .dropzone {
        border: dashed 4px transparent;
        border-radius: 4px;
        margin: 10px auto 30px;
        padding: 10px;
        width: 100%;
        transition: background-color 0.3s;
        background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
        background-size: 66px 70px;
      }
      #eikochainContainer .drop-active {
        border-color: #aaa;
      }
      #eikochainContainer .drop-target {
        background-color: #29e;
        border-color: #fff;
        border-style: solid;
      }
      #eikochainContainer .drag-drop {
        height: 200px;
        min-width: 80px;
        margin: 1rem 0 0 1rem;
        border: solid 2px grey;
        touch-action: none;
        transform: translate(0px, 0px);
        transition: background-color 0.3s;
        overflow-wrap: break-word;
      }
      #eikochainContainer .drag-drop.can-drop {
        color: #000;
      }
      #eikochainContainer .delete-item-icon {
        cursor: pointer;
      }
      #eikochainContainer #sideMenu {
        max-width: 200px;
      }
      #eikochainContainer .previewMenuItem {
        list-style: none;
        color: white;
        font-size: 24px;
        margin-bottom: 10px;
        margin-left: 10px;
        cursor: pointer;
      }
      #eikochainContainer .previewMenuItem:hover {
        color: grey;
        font-size: 25px;
        text-shadow: 2px 2px 5px fuchsia;
      }
      @media prefers-reduced-motion:reduce) {
        #eikochainContainer .nav-link {
          transition: none;
        }
        #eikochainContainer .bootmodal.fade .bootmodal-dialog {
          transition: none;
        }
      }
      @media min-width: 576px) {
        #eikochainContainer .bootmodal-dialog {
          max-width: 500px;
          margin: 1.75rem auto;
        }
        #eikochainContainer .bootmodal-dialog-scrollable {
          height: calc(100% - 3.5rem);
        }
        #eikochainContainer .bootmodal-dialog-centered {
          min-height: calc(100% - 3.5rem);
        }
        #eikochainContainer .bootmodal-sm {
          max-width: 300px;
        }
      }
      @media min-width: 992px) {
        #eikochainContainer .bootmodal-lg {
          max-width: 800px;
        }
        #eikochainContainer .bootmodal-xl {
          max-width: 800px;
        }
      }
      
      @media min-width: 1200px) {
        #eikochainContainer .bootmodal-xl {
          max-width: 1140px;
        }
      }
      
      @media max-width: 770px) {
        #eikochainContainer #contact-modal-button {
          position: static;
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
      @media (max-width: 575px) {
        #eikochainContainer .previewModal #hero {
          margin-top: 32px;
        }
      }
      @media (min-width: 768px) {
        #eikochainContainer .previewModal .navbar-right {
          float: right !important;
          margin-right: 0px;
        }
      }
      
      
      </style>`;

    var sections = document.getElementsByClassName("shopify-section");
    var firstSection = sections[0];

    var el = document.createElement("div");
    el.innerHTML = styleBlock;
    this.insertAfter(firstSection, el);
  },
  addModal: function () {
    var sections = document.getElementsByClassName("shopify-section");
    var firstSection = sections[0];

    var el = document.createElement("div");
    el.setAttribute("id", "eikochainContainer");
    el.innerHTML = `<div id="modal-contact-dark-overlay"></div>
    <div class="bootmodal fade" id="PreviewDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" style="display: none;">
    <div class="bootmodal-dialog bootstrap-wrapper" id="PreviewDialogObj" role="document">
        <div class="bootmodal-content" id="previewModalContent">
            <div class="row" id="previewModalRow"></div>
        </div>
    </div>
</div>`;

    this.insertAfter(firstSection, el);
    var refThis = this;
    document.querySelector("#open-modal").onclick = function () {
      refThis.showOverlay();
      refThis.showModal();
    };
  },

  getEikoChainSupply: function () {
      var refThis = this;
    var eikochain = {
      url: "",
      productId: "",
      data: {},
      supplyChainData: {},
    };
    eikochain.url = window.location.hostname;
    eikochain.url = eikochain.url.replace(/^www?:\/\//, "");
    window.onload = (event) => {
      var xmlhttp = new XMLHttpRequest();

      eikochain.productId = meta.product.id;


      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          // XMLHttpRequest.DONE == 4
          if (xmlhttp.status == 200) {

            eikochain.data = JSON.parse(xmlhttp.responseText);
            eikochain.supplyChainData = JSON.parse(
              eikochain.data.supplyChainData
            );
            //console.log(eikochain.supplyChainData)

            if (eikochain.data.supplyChainData != "{}") {
              
              refThis.addButton();
              refThis.addModal();
              refThis.addStyles();

      document.querySelector("#open-modal").style.visibility = "visible";
      document.querySelector("#open-modal").style.display =
        "inline-block";


              console.log(eikochain.supplyChainData)
              var Obj = document.getElementById('previewModalRow'); //any element to be fully replaced
              console.log(Obj)
              Obj.innerHTML=eikochain.supplyChainData.stepsHtml; ///it's simple replacement of whole element with contents of str var

              //console.log(firstTabId)
              var divsToHide = document.getElementsByClassName("tab-pane"); //divsToHide is an array
              for (var j = 0; j < divsToHide.length; j++) {
                divsToHide[j].style.visibility = "hidden"; // or
                divsToHide[j].style.display = "none"; // depending on what you're doing
              }
     
              divsToHide[0].style.visibility = "visible";
              divsToHide[0].style.display = "block";
              //$("#PreviewDialog").modal("show");
              var menuItems =
                document.getElementsByClassName("tabItem");
              var tabItems = document.getElementsByClassName("tab-pane");

              var myFunction = function (element) {
                console.log(element)
                var dataTarg = element.target.dataset.bsTarget;
                for (var li = 0; li < tabItems.length; li++) {
                  tabItems[li].style.display = "none";
                  tabItems[li].style.visibility = "hidden";
                }
                for (var mi = 0; mi < menuItems.length; mi++) {
                  menuItems[mi].classList.remove("active");
                }

                element.target.classList.add('active')
                console.log("dataTarg IS " + dataTarg)
                document.querySelector(
                  dataTarg
                ).style.visibility = "visible";
                document.querySelector(dataTarg).style.display =
                  "block";
              };

              for (var mi = 0; mi < menuItems.length; mi++) {
                menuItems[mi].classList.remove("active");
              }
              menuItems[0].classList.add("active");
              for (var k = 0; k < menuItems.length; k++) {
                menuItems[k].addEventListener("click", myFunction, false);
              }

         

              // var exitButton = document.getElementById("modal-contact-dark-overlay");
              // exitButton.addEventListener(
              //   "click",
              //   function () {
              //       refThis.hideOverlay();
              //       refThis.hideModal();
              //   },
              //   false
              // );
            } else {
              document.querySelector("#open-modal").style.visibility = "hidden";
              document.querySelector("#open-modal").style.display = "none";
            }
          } else {
            document.querySelector("#open-modal").style.visibility = "hidden";
            document.querySelector("#open-modal").style.display = "none";
          }
        }
      };

      xmlhttp.open(
        "GET",
        "https://eikochainv1.azurewebsites.net/products/GetProductSupplyChain?id=" +
          eikochain.productId +
          "&orgUrl=" +
          eikochain.url,
        true
      );
      xmlhttp.send();
    };
  },
};

eikochain.load();
