var eikochain = {

    load: function () {

        this.getEikoChainSupply();

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

        setTimeout(function () {
            document.removeEventListener('click', eikochain.handleOutModalClick);
        }, 500)
    },
    showOverlay: function () {
        document.querySelector("#modal-contact-dark-overlay").style.display =
            "block";
    },
    showModal: function () {

        var refThis = this;

        setTimeout(function () {
            document.addEventListener('click', eikochain.handleOutModalClick);
        }, 500)

        document.querySelector("#PreviewDialog").style.display = "block";
    },

    handleOutModalClick: function (event) {
        var refThis = this;
        var ignoreClickOnMeElement = document.getElementById('PreviewDialogObj');

        var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
        if (!isClickInsideElement) {
            eikochain.hideModal();
            eikochain.hideOverlay();
        }
    },
    addButton: function (targetElement) {
        var elementToAddInto = document.getElementById(targetElement)

        var el = document.createElement("div");
        el.setAttribute("id", "eikochainContainer");
        el.innerHTML =
            `<button class="eikochainEmbedBtn" id="open-modal" >
        Our Sustainability Story
        <div style="margin-top: -10px; max-height: 18px;">
            <span style="font-size: .65rem; letter-spacing: 0.5px;">
                Powered By
                <img style="width: 85px; height: 17px;" id="eikochainEmbedBtnLogo" src="https://app.eikochain.com/eikochainlogo5.png" alt="Eikochain">
            </span>
        </div>
    </button>`;
        el.style = "text-align: center;";
        elementToAddInto.append(el);
    },
    addStyles: function (targetElement) {
        let styleBlock = `
    
    <style>
  
      #eikochainContainer .bootmodal {
        position: fixed;

        position: fixed;
        top: 25%;
        left: 25%;
        z-index: 1055;
        display: none;
        width: 700px;
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
        pointer-events: auto;
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
      
      #eikochainContainer .action-btn{
        text-transform: uppercase;
    vertical-align: bottom;
    border: 0;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%), 0 2px 10px 0 rgb(0 0 0 / 10%);
    font-weight: 500;
    padding: 0.625rem 1.5rem 0.5rem;
    font-size: .75rem;
    line-height: 1.5;
    margin-top: 10px;
      }

      #eikochainContainer .eikochainEmbedBtn {
        width: 100%;
        line-height: 1.5;
        padding: 0.5rem 1.5rem 0.6rem;
        border: 0;
        box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%), 0 2px 10px 0 rgb(0 0 0 / 10%);
        font-family: Lato,sans-serif;
        border-radius: 5rem;
        text-transform: none;
        font-size: 1.075rem;
        font-weight: 700;
        background-color: #FDF9F0;
        color: #174C4F;
        letter-spacing: 1px;
    }
    #eikochainContainer button {
        cursor: pointer;
    }
    #eikochainContainer .eikochainEmbedBtn:focus:not(:focus-visible) {
        outline: 0;
    }
    #eikochainContainer #eikochainEmbedBtnLogo {
        vertical-align: middle;
    }
      </style>`;

        var elementToAddInto = document.getElementById("eikochainContainer")

        var el = document.createElement("div");
        el.innerHTML = styleBlock;
        elementToAddInto.append(el);
    },
    addModal: function (targetElement, productId) {
        var elementToAddInto = document.getElementById("eikochainContainer")

        var el = document.createElement("div");
        el.innerHTML = `<div id="modal-contact-dark-overlay"></div>
    <div class="bootmodal" id="PreviewDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" style="display: none;">
    <div class="bootmodal-dialog bootstrap-wrapper" id="PreviewDialogObj" role="document">
        <div class="bootmodal-content" id="previewModalContent">
            <div class="row" id="viewModalRow" style="height:500px">
            <iframe width="100%" height="100%" src="https://eikochainv1.azurewebsites.net/supplychains/IframeView?id=${productId}"></iframe>
            </div>
        </div>
    </div>
</div>`;

        elementToAddInto.append(el);

        var refThis = this;
        document.querySelector("#open-modal").onclick = function () {
            refThis.showOverlay();
            refThis.showModal();
        };
    },

    getEikoChainSupply: function () {
        var refThis = this;

        window.onload = (event) => {
            console.log("Loading Eikochain Script")
            var targetProductId = document.getElementById("eikochainjs").getAttribute("data-productid");
            var targetElement = document.getElementById("eikochainjs").getAttribute("data-target");
            refThis.addButton(targetElement);
            refThis.addModal(targetElement, targetProductId);
            refThis.addStyles(targetElement);
        };
    },
};

eikochain.load();
