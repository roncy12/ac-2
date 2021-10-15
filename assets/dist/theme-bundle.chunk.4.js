(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./assets/js/theme/product.js":
/*!************************************!*\
  !*** ./assets/js/theme/product.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Product; });
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _product_reviews__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./product/reviews */ "./assets/js/theme/product/reviews.js");
/* harmony import */ var _common_collapsible__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/collapsible */ "./assets/js/theme/common/collapsible.js");
/* harmony import */ var _common_product_details__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/product-details */ "./assets/js/theme/common/product-details.js");
/* harmony import */ var _product_video_gallery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./product/video-gallery */ "./assets/js/theme/product/video-gallery.js");
/* harmony import */ var _roots_product__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./roots/product */ "./assets/js/theme/roots/product.js");
/* harmony import */ var _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* harmony import */ var _global_modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./global/modal */ "./assets/js/theme/global/modal.js");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
 Import all product specific js
 */









var Product = /*#__PURE__*/function (_PageManager) {
  _inheritsLoose(Product, _PageManager);

  function Product(context) {
    var _this;

    _this = _PageManager.call(this, context) || this;
    _this.url = window.location.href;
    _this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    _this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
    _this.reviewModal = Object(_global_modal__WEBPACK_IMPORTED_MODULE_7__["default"])('#modal-review-form')[0];
    return _this;
  }

  var _proto = Product.prototype;

  _proto.onReady = function onReady() {
    var _this2 = this;

    // Listen for foundation modal close events to sanitize URL after review.
    $(document).on('close.fndtn.reveal', function () {
      if (_this2.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    });
    var validator; // Init collapsible

    Object(_common_collapsible__WEBPACK_IMPORTED_MODULE_2__["default"])();
    this.productDetails = new _common_product_details__WEBPACK_IMPORTED_MODULE_3__["default"]($('.productView'), this.context, window.BCData.product_attributes);
    this.productDetails.setProductVariant();
    Object(_product_video_gallery__WEBPACK_IMPORTED_MODULE_4__["default"])();
    this.bulkPricingHandler();
    var $reviewForm = Object(_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_6__["classifyForm"])('.writeReview-form');
    if ($reviewForm.length === 0) return;
    var review = new _product_reviews__WEBPACK_IMPORTED_MODULE_1__["default"]({
      $reviewForm: $reviewForm
    });
    $('body').on('click', '[data-reveal-id="modal-review-form"]', function () {
      validator = review.registerValidation(_this2.context);

      _this2.ariaDescribeReviewInputs($reviewForm);
    });
    $reviewForm.on('submit', function () {
      if (validator) {
        validator.performCheck();
        return validator.areAll('valid');
      }

      return false;
    });
    Object(_roots_product__WEBPACK_IMPORTED_MODULE_5__["default"])();
    this.productReviewHandler();
  };

  _proto.ariaDescribeReviewInputs = function ariaDescribeReviewInputs($form) {
    $form.find('[data-input]').each(function (_, input) {
      var $input = $(input);
      var msgSpanId = $input.attr('name') + "-msg";
      $input.siblings('span').attr('id', msgSpanId);
      $input.attr('aria-describedby', msgSpanId);
    });
  };

  _proto.productReviewHandler = function productReviewHandler() {
    if (this.url.indexOf('#write_review') !== -1) {
      this.$reviewLink.trigger('click');
    }
  };

  _proto.bulkPricingHandler = function bulkPricingHandler() {
    if (this.url.indexOf('#bulk_pricing') !== -1) {
      this.$bulkPricingLink.trigger('click');
    }
  };

  return Product;
}(_page_manager__WEBPACK_IMPORTED_MODULE_0__["default"]);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/product/video-gallery.js":
/*!**************************************************!*\
  !*** ./assets/js/theme/product/video-gallery.js ***!
  \**************************************************/
/*! exports provided: VideoGallery, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoGallery", function() { return VideoGallery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return videoGallery; });
var VideoGallery = /*#__PURE__*/function () {
  function VideoGallery($element) {
    this.$player = $element.find('[data-video-player]');
    this.$videos = $element.find('[data-video-item]');
    this.currentVideo = {};
    this.bindEvents();
  }

  var _proto = VideoGallery.prototype;

  _proto.selectNewVideo = function selectNewVideo(e) {
    e.preventDefault();
    var $target = $(e.currentTarget);
    this.currentVideo = {
      id: $target.data('videoId'),
      $selectedThumb: $target
    };
    this.setMainVideo();
    this.setActiveThumb();
  };

  _proto.setMainVideo = function setMainVideo() {
    this.$player.attr('src', "//www.youtube.com/embed/" + this.currentVideo.id);
  };

  _proto.setActiveThumb = function setActiveThumb() {
    this.$videos.removeClass('is-active');
    this.currentVideo.$selectedThumb.addClass('is-active');
  };

  _proto.bindEvents = function bindEvents() {
    this.$videos.on('click', this.selectNewVideo.bind(this));
  };

  return VideoGallery;
}();
function videoGallery() {
  var pluginKey = 'video-gallery';
  var $videoGallery = $("[data-" + pluginKey + "]");
  $videoGallery.each(function (index, element) {
    var $el = $(element);
    var isInitialized = $el.data(pluginKey) instanceof VideoGallery;

    if (isInitialized) {
      return;
    }

    $el.data(pluginKey, new VideoGallery($el));
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/roots/product.js":
/*!******************************************!*\
  !*** ./assets/js/theme/roots/product.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loaded; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

function loaded() {
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()('#tab-specifications').text().trim() !== '') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.tab-heading--specs').show();
  } // bulk pricing


  function formatBulkTable() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.productView-info-bulkPricing li').each(function formatRule() {
      var priceRules = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text().trim().replace(/\r?\n|\r/g, '').split(/(.*)(and get | and pay only)/gi);
      var formattedRule = "<strong>" + priceRules[1] + "</strong>" + priceRules[2] + "<strong><span>" + priceRules[3] + "</span></strong>";
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).html(formattedRule);
    });
  }

  formatBulkTable();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).ajaxComplete(function () {
    formatBulkTable();
  });
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('#form-action-addToCart').on('click', function () {
    var formTop = jquery__WEBPACK_IMPORTED_MODULE_0___default()('.productView-options form').offset().top;
    var headerHeight = jquery__WEBPACK_IMPORTED_MODULE_0___default()('.header').height();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).scrollTop(formTop - headerHeight);
  });
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvcHJvZHVjdC92aWRlby1nYWxsZXJ5LmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy90aGVtZS9yb290cy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbIlByb2R1Y3QiLCJjb250ZXh0IiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJHJldmlld0xpbmsiLCIkIiwiJGJ1bGtQcmljaW5nTGluayIsInJldmlld01vZGFsIiwibW9kYWxGYWN0b3J5Iiwib25SZWFkeSIsImRvY3VtZW50Iiwib24iLCJpbmRleE9mIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsInRpdGxlIiwicGF0aG5hbWUiLCJ2YWxpZGF0b3IiLCJjb2xsYXBzaWJsZUZhY3RvcnkiLCJwcm9kdWN0RGV0YWlscyIsIlByb2R1Y3REZXRhaWxzIiwiQkNEYXRhIiwicHJvZHVjdF9hdHRyaWJ1dGVzIiwic2V0UHJvZHVjdFZhcmlhbnQiLCJ2aWRlb0dhbGxlcnkiLCJidWxrUHJpY2luZ0hhbmRsZXIiLCIkcmV2aWV3Rm9ybSIsImNsYXNzaWZ5Rm9ybSIsImxlbmd0aCIsInJldmlldyIsIlJldmlldyIsInJlZ2lzdGVyVmFsaWRhdGlvbiIsImFyaWFEZXNjcmliZVJldmlld0lucHV0cyIsInBlcmZvcm1DaGVjayIsImFyZUFsbCIsInJvb3RzTG9hZGVkIiwicHJvZHVjdFJldmlld0hhbmRsZXIiLCIkZm9ybSIsImZpbmQiLCJlYWNoIiwiXyIsImlucHV0IiwiJGlucHV0IiwibXNnU3BhbklkIiwiYXR0ciIsInNpYmxpbmdzIiwidHJpZ2dlciIsIlBhZ2VNYW5hZ2VyIiwiVmlkZW9HYWxsZXJ5IiwiJGVsZW1lbnQiLCIkcGxheWVyIiwiJHZpZGVvcyIsImN1cnJlbnRWaWRlbyIsImJpbmRFdmVudHMiLCJzZWxlY3ROZXdWaWRlbyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIiR0YXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiaWQiLCJkYXRhIiwiJHNlbGVjdGVkVGh1bWIiLCJzZXRNYWluVmlkZW8iLCJzZXRBY3RpdmVUaHVtYiIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJiaW5kIiwicGx1Z2luS2V5IiwiJHZpZGVvR2FsbGVyeSIsImluZGV4IiwiZWxlbWVudCIsIiRlbCIsImlzSW5pdGlhbGl6ZWQiLCJsb2FkZWQiLCJ0ZXh0IiwidHJpbSIsInNob3ciLCJmb3JtYXRCdWxrVGFibGUiLCJmb3JtYXRSdWxlIiwicHJpY2VSdWxlcyIsInJlcGxhY2UiLCJzcGxpdCIsImZvcm1hdHRlZFJ1bGUiLCJodG1sIiwiYWpheENvbXBsZXRlIiwiZm9ybVRvcCIsIm9mZnNldCIsInRvcCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInNjcm9sbFRvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFFcUJBLE87OztBQUNqQixtQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNqQixvQ0FBTUEsT0FBTjtBQUNBLFVBQUtDLEdBQUwsR0FBV0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUEzQjtBQUNBLFVBQUtDLFdBQUwsR0FBbUJDLENBQUMsQ0FBQyxzQ0FBRCxDQUFwQjtBQUNBLFVBQUtDLGdCQUFMLEdBQXdCRCxDQUFDLENBQUMsdUNBQUQsQ0FBekI7QUFDQSxVQUFLRSxXQUFMLEdBQW1CQyw2REFBWSxDQUFDLG9CQUFELENBQVosQ0FBbUMsQ0FBbkMsQ0FBbkI7QUFMaUI7QUFNcEI7Ozs7U0FFREMsTyxHQUFBLG1CQUFVO0FBQUE7O0FBQ047QUFDQUosS0FBQyxDQUFDSyxRQUFELENBQUQsQ0FBWUMsRUFBWixDQUFlLG9CQUFmLEVBQXFDLFlBQU07QUFDdkMsVUFBSSxNQUFJLENBQUNYLEdBQUwsQ0FBU1ksT0FBVCxDQUFpQixlQUFqQixNQUFz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Q0FBQyxDQUFDLHdCQUFELENBQUQsQ0FBNEJNLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDLFlBQU07QUFDMUMsUUFBTTBFLE9BQU8sR0FBR2hGLDZDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQmlGLE1BQS9CLEdBQXdDQyxHQUF4RDtBQUNBLFFBQU1DLFlBQVksR0FBR25GLDZDQUFDLENBQUMsU0FBRCxDQUFELENBQWFvRixNQUFiLEVBQXJCO0FBQ0FwRixpREFBQyxDQUFDSixNQUFELENBQUQsQ0FBVXlGLFNBQVYsQ0FBb0JMLE9BQU8sR0FBR0csWUFBOUI7QUFDSCxHQUpEO0FBS0gsQyIsImZpbGUiOiJ0aGVtZS1idW5kbGUuY2h1bmsuNC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBJbXBvcnQgYWxsIHByb2R1Y3Qgc3BlY2lmaWMganNcclxuICovXHJcbmltcG9ydCBQYWdlTWFuYWdlciBmcm9tICcuL3BhZ2UtbWFuYWdlcic7XHJcbmltcG9ydCBSZXZpZXcgZnJvbSAnLi9wcm9kdWN0L3Jldmlld3MnO1xyXG5pbXBvcnQgY29sbGFwc2libGVGYWN0b3J5IGZyb20gJy4vY29tbW9uL2NvbGxhcHNpYmxlJztcclxuaW1wb3J0IFByb2R1Y3REZXRhaWxzIGZyb20gJy4vY29tbW9uL3Byb2R1Y3QtZGV0YWlscyc7XHJcbmltcG9ydCB2aWRlb0dhbGxlcnkgZnJvbSAnLi9wcm9kdWN0L3ZpZGVvLWdhbGxlcnknO1xyXG5pbXBvcnQgcm9vdHNMb2FkZWQgZnJvbSAnLi9yb290cy9wcm9kdWN0JztcclxuaW1wb3J0IHsgY2xhc3NpZnlGb3JtIH0gZnJvbSAnLi9jb21tb24vdXRpbHMvZm9ybS11dGlscyc7XHJcbmltcG9ydCBtb2RhbEZhY3RvcnkgZnJvbSAnLi9nbG9iYWwvbW9kYWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZHVjdCBleHRlbmRzIFBhZ2VNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihjb250ZXh0KTtcclxuICAgICAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIHRoaXMuJHJldmlld0xpbmsgPSAkKCdbZGF0YS1yZXZlYWwtaWQ9XCJtb2RhbC1yZXZpZXctZm9ybVwiXScpO1xyXG4gICAgICAgIHRoaXMuJGJ1bGtQcmljaW5nTGluayA9ICQoJ1tkYXRhLXJldmVhbC1pZD1cIm1vZGFsLWJ1bGstcHJpY2luZ1wiXScpO1xyXG4gICAgICAgIHRoaXMucmV2aWV3TW9kYWwgPSBtb2RhbEZhY3RvcnkoJyNtb2RhbC1yZXZpZXctZm9ybScpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciBmb3VuZGF0aW9uIG1vZGFsIGNsb3NlIGV2ZW50cyB0byBzYW5pdGl6ZSBVUkwgYWZ0ZXIgcmV2aWV3LlxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbG9zZS5mbmR0bi5yZXZlYWwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVybC5pbmRleE9mKCcjd3JpdGVfcmV2aWV3JykgIT09IC0xICYmIHR5cGVvZiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgdmFsaWRhdG9yO1xyXG5cclxuICAgICAgICAvLyBJbml0IGNvbGxhcHNpYmxlXHJcbiAgICAgICAgY29sbGFwc2libGVGYWN0b3J5KCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZHVjdERldGFpbHMgPSBuZXcgUHJvZHVjdERldGFpbHMoJCgnLnByb2R1Y3RWaWV3JyksIHRoaXMuY29udGV4dCwgd2luZG93LkJDRGF0YS5wcm9kdWN0X2F0dHJpYnV0ZXMpO1xyXG4gICAgICAgIHRoaXMucHJvZHVjdERldGFpbHMuc2V0UHJvZHVjdFZhcmlhbnQoKTtcclxuXHJcbiAgICAgICAgdmlkZW9HYWxsZXJ5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVsa1ByaWNpbmdIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0ICRyZXZpZXdGb3JtID0gY2xhc3NpZnlGb3JtKCcud3JpdGVSZXZpZXctZm9ybScpO1xyXG5cclxuICAgICAgICBpZiAoJHJldmlld0Zvcm0ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IHJldmlldyA9IG5ldyBSZXZpZXcoeyAkcmV2aWV3Rm9ybSB9KTtcclxuXHJcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1yZXZlYWwtaWQ9XCJtb2RhbC1yZXZpZXctZm9ybVwiXScsICgpID0+IHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yID0gcmV2aWV3LnJlZ2lzdGVyVmFsaWRhdGlvbih0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgICAgICB0aGlzLmFyaWFEZXNjcmliZVJldmlld0lucHV0cygkcmV2aWV3Rm9ybSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRyZXZpZXdGb3JtLm9uKCdzdWJtaXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcm9vdHNMb2FkZWQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9kdWN0UmV2aWV3SGFuZGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFyaWFEZXNjcmliZVJldmlld0lucHV0cygkZm9ybSkge1xyXG4gICAgICAgICRmb3JtLmZpbmQoJ1tkYXRhLWlucHV0XScpLmVhY2goKF8sIGlucHV0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoaW5wdXQpO1xyXG4gICAgICAgICAgICBjb25zdCBtc2dTcGFuSWQgPSBgJHskaW5wdXQuYXR0cignbmFtZScpfS1tc2dgO1xyXG5cclxuICAgICAgICAgICAgJGlucHV0LnNpYmxpbmdzKCdzcGFuJykuYXR0cignaWQnLCBtc2dTcGFuSWQpO1xyXG4gICAgICAgICAgICAkaW5wdXQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIG1zZ1NwYW5JZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvZHVjdFJldmlld0hhbmRsZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyN3cml0ZV9yZXZpZXcnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy4kcmV2aWV3TGluay50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWxrUHJpY2luZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXJsLmluZGV4T2YoJyNidWxrX3ByaWNpbmcnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy4kYnVsa1ByaWNpbmdMaW5rLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBWaWRlb0dhbGxlcnkge1xyXG4gICAgY29uc3RydWN0b3IoJGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLiRwbGF5ZXIgPSAkZWxlbWVudC5maW5kKCdbZGF0YS12aWRlby1wbGF5ZXJdJyk7XHJcbiAgICAgICAgdGhpcy4kdmlkZW9zID0gJGVsZW1lbnQuZmluZCgnW2RhdGEtdmlkZW8taXRlbV0nKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlbyA9IHt9O1xyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE5ld1ZpZGVvKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFZpZGVvID0ge1xyXG4gICAgICAgICAgICBpZDogJHRhcmdldC5kYXRhKCd2aWRlb0lkJyksXHJcbiAgICAgICAgICAgICRzZWxlY3RlZFRodW1iOiAkdGFyZ2V0LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWFpblZpZGVvKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVUaHVtYigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1haW5WaWRlbygpIHtcclxuICAgICAgICB0aGlzLiRwbGF5ZXIuYXR0cignc3JjJywgYC8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyR7dGhpcy5jdXJyZW50VmlkZW8uaWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZlVGh1bWIoKSB7XHJcbiAgICAgICAgdGhpcy4kdmlkZW9zLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlby4kc2VsZWN0ZWRUaHVtYi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYmluZEV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLiR2aWRlb3Mub24oJ2NsaWNrJywgdGhpcy5zZWxlY3ROZXdWaWRlby5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmlkZW9HYWxsZXJ5KCkge1xyXG4gICAgY29uc3QgcGx1Z2luS2V5ID0gJ3ZpZGVvLWdhbGxlcnknO1xyXG4gICAgY29uc3QgJHZpZGVvR2FsbGVyeSA9ICQoYFtkYXRhLSR7cGx1Z2luS2V5fV1gKTtcclxuXHJcbiAgICAkdmlkZW9HYWxsZXJ5LmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGVsID0gJChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBpc0luaXRpYWxpemVkID0gJGVsLmRhdGEocGx1Z2luS2V5KSBpbnN0YW5jZW9mIFZpZGVvR2FsbGVyeTtcclxuXHJcbiAgICAgICAgaWYgKGlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGVsLmRhdGEocGx1Z2luS2V5LCBuZXcgVmlkZW9HYWxsZXJ5KCRlbCkpO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRlZCgpIHtcclxuICAgIGlmICgkKCcjdGFiLXNwZWNpZmljYXRpb25zJykudGV4dCgpLnRyaW0oKSAhPT0gJycpIHtcclxuICAgICAgICAkKCcudGFiLWhlYWRpbmctLXNwZWNzJykuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJ1bGsgcHJpY2luZ1xyXG4gICAgZnVuY3Rpb24gZm9ybWF0QnVsa1RhYmxlKCkge1xyXG4gICAgICAgICQoJy5wcm9kdWN0Vmlldy1pbmZvLWJ1bGtQcmljaW5nIGxpJykuZWFjaChmdW5jdGlvbiBmb3JtYXRSdWxlKCkge1xyXG4gICAgICAgICAgICBjb25zdCBwcmljZVJ1bGVzID0gJCh0aGlzKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csICcnKS5zcGxpdCgvKC4qKShhbmQgZ2V0IHwgYW5kIHBheSBvbmx5KS9naSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFJ1bGUgPSBgPHN0cm9uZz4ke3ByaWNlUnVsZXNbMV19PC9zdHJvbmc+JHtwcmljZVJ1bGVzWzJdfTxzdHJvbmc+PHNwYW4+JHtwcmljZVJ1bGVzWzNdfTwvc3Bhbj48L3N0cm9uZz5gO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmh0bWwoZm9ybWF0dGVkUnVsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZvcm1hdEJ1bGtUYWJsZSgpO1xyXG4gICAgXHJcbiAgICAkKCBkb2N1bWVudCApLmFqYXhDb21wbGV0ZSgoKSA9PiB7XHJcbiAgICAgICAgZm9ybWF0QnVsa1RhYmxlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjZm9ybS1hY3Rpb24tYWRkVG9DYXJ0Jykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1Ub3AgPSAkKCcucHJvZHVjdFZpZXctb3B0aW9ucyBmb3JtJykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckhlaWdodCA9ICQoJy5oZWFkZXInKS5oZWlnaHQoKTtcclxuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKGZvcm1Ub3AgLSBoZWFkZXJIZWlnaHQpO1xyXG4gICAgfSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==