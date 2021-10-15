(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "./assets/js/theme/cart.js":
/*!*********************************!*\
  !*** ./assets/js/theme/cart.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Cart; });
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_bind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/bind */ "./node_modules/lodash/bind.js");
/* harmony import */ var lodash_bind__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_bind__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _common_gift_certificate_validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/gift-certificate-validator */ "./assets/js/theme/common/gift-certificate-validator.js");
/* harmony import */ var _common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils/translations-utils */ "./assets/js/theme/common/utils/translations-utils.js");
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* harmony import */ var _cart_shipping_estimator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cart/shipping-estimator */ "./assets/js/theme/cart/shipping-estimator.js");
/* harmony import */ var _global_modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./global/modal */ "./assets/js/theme/global/modal.js");
/* harmony import */ var _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./global/sweet-alert */ "./assets/js/theme/global/sweet-alert.js");
/* harmony import */ var _common_cart_item_details__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/cart-item-details */ "./assets/js/theme/common/cart-item-details.js");



function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










var Cart = /*#__PURE__*/function (_PageManager) {
  _inheritsLoose(Cart, _PageManager);

  function Cart() {
    return _PageManager.apply(this, arguments) || this;
  }

  var _proto = Cart.prototype;

  _proto.onReady = function onReady() {
    this.$modal = null;
    this.$cartPageContent = $('[data-cart]');
    this.$cartContent = $('[data-cart-content]');
    this.$cartMessages = $('[data-cart-status]');
    this.$cartTotals = $('[data-cart-totals]');
    this.$cartAdditionalCheckoutBtns = $('[data-cart-additional-checkout-buttons]');
    this.$overlay = $('[data-cart] .loadingOverlay').hide(); // TODO: temporary until roper pulls in his cart components

    this.$activeCartItemId = null;
    this.$activeCartItemBtnAction = null;
    this.setApplePaySupport();
    this.bindEvents();
  };

  _proto.setApplePaySupport = function setApplePaySupport() {
    if (window.ApplePaySession) {
      this.$cartPageContent.addClass('apple-pay-supported');
    }
  };

  _proto.cartUpdate = function cartUpdate($target) {
    var _this = this;

    var itemId = $target.data('cartItemid');
    this.$activeCartItemId = itemId;
    this.$activeCartItemBtnAction = $target.data('action');
    var $el = $("#qty-" + itemId);
    var oldQty = parseInt($el.val(), 10);
    var maxQty = parseInt($el.data('quantityMax'), 10);
    var minQty = parseInt($el.data('quantityMin'), 10);
    var minError = $el.data('quantityMinError');
    var maxError = $el.data('quantityMaxError');
    var newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1; // Does not quality for min/max quantity

    if (newQty < minQty) {
      return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: minError,
        icon: 'error'
      });
    } else if (maxQty > 0 && newQty > maxQty) {
      return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: maxError,
        icon: 'error'
      });
    }

    this.$overlay.show();
    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.itemUpdate(itemId, newQty, function (err, response) {
      _this.$overlay.hide();

      if (response.data.status === 'succeed') {
        // if the quantity is changed "1" from "0", we have to remove the row.
        var remove = newQty === 0;

        _this.refreshContent(remove);
      } else {
        $el.val(oldQty);
        _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
          text: response.data.errors.join('\n'),
          icon: 'error'
        });
      }
    });
  };

  _proto.cartUpdateQtyTextChange = function cartUpdateQtyTextChange($target, preVal) {
    var _this2 = this;

    if (preVal === void 0) {
      preVal = null;
    }

    var itemId = $target.data('cartItemid');
    var $el = $("#qty-" + itemId);
    var maxQty = parseInt($el.data('quantityMax'), 10);
    var minQty = parseInt($el.data('quantityMin'), 10);
    var oldQty = preVal !== null ? preVal : minQty;
    var minError = $el.data('quantityMinError');
    var maxError = $el.data('quantityMaxError');
    var newQty = parseInt(Number($el.val()), 10);
    var invalidEntry; // Does not quality for min/max quantity

    if (!newQty) {
      invalidEntry = $el.val();
      $el.val(oldQty);
      return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: this.context.invalidEntryMessage.replace('[ENTRY]', invalidEntry),
        icon: 'error'
      });
    } else if (newQty < minQty) {
      $el.val(oldQty);
      return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: minError,
        icon: 'error'
      });
    } else if (maxQty > 0 && newQty > maxQty) {
      $el.val(oldQty);
      return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: maxError,
        icon: 'error'
      });
    }

    this.$overlay.show();
    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.itemUpdate(itemId, newQty, function (err, response) {
      _this2.$overlay.hide();

      if (response.data.status === 'succeed') {
        // if the quantity is changed "1" from "0", we have to remove the row.
        var remove = newQty === 0;

        _this2.refreshContent(remove);
      } else {
        $el.val(oldQty);
        _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
          text: response.data.errors.join('\n'),
          icon: 'error'
        });
      }
    });
  };

  _proto.cartRemoveItem = function cartRemoveItem(itemId) {
    var _this3 = this;

    this.$overlay.show();
    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.itemRemove(itemId, function (err, response) {
      if (response.data.status === 'succeed') {
        _this3.refreshContent(true);
      } else {
        _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
          text: response.data.errors.join('\n'),
          icon: 'error'
        });
      }
    });
  };

  _proto.cartEditOptions = function cartEditOptions(itemId, productId) {
    var _this4 = this;

    var context = Object.assign({
      productForChangeId: productId
    }, this.context);
    var modal = Object(_global_modal__WEBPACK_IMPORTED_MODULE_7__["defaultModal"])();

    if (this.$modal === null) {
      this.$modal = $('#modal');
    }

    var options = {
      template: 'cart/modals/configure-product'
    };
    modal.open();
    this.$modal.find('.modal-content').addClass('hide-content');
    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.productAttributes.configureInCart(itemId, options, function (err, response) {
      modal.updateContent(response.content);

      var optionChangeHandler = function optionChangeHandler() {
        var $productOptionsContainer = $('[data-product-attributes-wrapper]', _this4.$modal);
        var modalBodyReservedHeight = $productOptionsContainer.outerHeight();

        if ($productOptionsContainer.length && modalBodyReservedHeight) {
          $productOptionsContainer.css('height', modalBodyReservedHeight);
        }
      };

      if (_this4.$modal.hasClass('open')) {
        optionChangeHandler();
      } else {
        _this4.$modal.one(_global_modal__WEBPACK_IMPORTED_MODULE_7__["ModalEvents"].opened, optionChangeHandler);
      }

      _this4.productDetails = new _common_cart_item_details__WEBPACK_IMPORTED_MODULE_9__["default"](_this4.$modal, context);

      _this4.bindGiftWrappingForm();
    });
    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].hooks.on('product-option-change', function (event, currentTarget) {
      var $form = $(currentTarget).find('form');
      var $submit = $('input.button', $form);
      var $messageBox = $('.alertMessageBox');
      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.productAttributes.optionChange(productId, $form.serialize(), function (err, result) {
        var data = result.data || {};

        if (err) {
          _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
            text: err,
            icon: 'error'
          });
          return false;
        }

        if (data.purchasing_message) {
          $('p.alertBox-message', $messageBox).text(data.purchasing_message);
          $submit.prop('disabled', true);
          $messageBox.show();
        } else {
          $submit.prop('disabled', false);
          $messageBox.hide();
        }

        if (!data.purchasable || !data.instock) {
          $submit.prop('disabled', true);
        } else {
          $submit.prop('disabled', false);
        }
      });
    });
  };

  _proto.refreshContent = function refreshContent(remove) {
    var _this5 = this;

    var $cartItemsRows = $('[data-item-row]', this.$cartContent);
    var $cartPageTitle = $('[data-cart-page-title]');
    var options = {
      template: {
        content: 'cart/content',
        totals: 'cart/totals',
        pageTitle: 'cart/page-title',
        statusMessages: 'cart/status-messages',
        additionalCheckoutButtons: 'cart/additional-checkout-buttons'
      }
    };
    this.$overlay.show(); // Remove last item from cart? Reload

    if (remove && $cartItemsRows.length === 1) {
      return window.location.reload();
    }

    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.getContent(options, function (err, response) {
      _this5.$cartContent.html(response.content);

      _this5.$cartTotals.html(response.totals);

      _this5.$cartMessages.html(response.statusMessages);

      _this5.$cartAdditionalCheckoutBtns.html(response.additionalCheckoutButtons);

      $cartPageTitle.replaceWith(response.pageTitle);

      _this5.bindEvents();

      _this5.$overlay.hide();

      var quantity = $('[data-cart-quantity]', _this5.$cartContent).data('cartQuantity') || 0;
      $('body').trigger('cart-quantity-update', quantity);
      $("[data-cart-itemid='" + _this5.$activeCartItemId + "']", _this5.$cartContent).filter("[data-action='" + _this5.$activeCartItemBtnAction + "']").trigger('focus');
    });
  };

  _proto.bindCartEvents = function bindCartEvents() {
    var _this6 = this;

    var debounceTimeout = 400;

    var cartUpdate = lodash_bind__WEBPACK_IMPORTED_MODULE_1___default()(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(this.cartUpdate, debounceTimeout), this);

    var cartUpdateQtyTextChange = lodash_bind__WEBPACK_IMPORTED_MODULE_1___default()(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(this.cartUpdateQtyTextChange, debounceTimeout), this);

    var cartRemoveItem = lodash_bind__WEBPACK_IMPORTED_MODULE_1___default()(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(this.cartRemoveItem, debounceTimeout), this);

    var preVal; // cart update

    $('[data-cart-update]', this.$cartContent).on('click', function (event) {
      var $target = $(event.currentTarget);
      event.preventDefault(); // update cart quantity

      cartUpdate($target);
    }); // cart qty manually updates

    $('.cart-item-qty-input', this.$cartContent).on('focus', function onQtyFocus() {
      preVal = this.value;
    }).change(function (event) {
      var $target = $(event.currentTarget);
      event.preventDefault(); // update cart quantity

      cartUpdateQtyTextChange($target, preVal);
    });
    $('.cart-remove', this.$cartContent).on('click', function (event) {
      var itemId = $(event.currentTarget).data('cartItemid');
      var string = $(event.currentTarget).data('confirmDelete');
      _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
        text: string,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: _this6.context.cancelButtonText
      }).then(function (result) {
        if (result.value) {
          // remove item from cart
          cartRemoveItem(itemId);
        }
      });
      event.preventDefault();
    });
    $('[data-item-edit]', this.$cartContent).on('click', function (event) {
      var itemId = $(event.currentTarget).data('itemEdit');
      var productId = $(event.currentTarget).data('productId');
      event.preventDefault(); // edit item in cart

      _this6.cartEditOptions(itemId, productId);
    });
  };

  _proto.bindPromoCodeEvents = function bindPromoCodeEvents() {
    var _this7 = this;

    var $couponContainer = $('.coupon-code');
    var $couponForm = $('.coupon-form');
    var $codeInput = $('[name="couponcode"]', $couponForm);
    $('.coupon-code-add').on('click', function (event) {
      event.preventDefault();
      $(event.currentTarget).hide();
      $couponContainer.show();
      $('.coupon-code-cancel').show();
      $codeInput.trigger('focus');
    });
    $('.coupon-code-cancel').on('click', function (event) {
      event.preventDefault();
      $couponContainer.hide();
      $('.coupon-code-cancel').hide();
      $('.coupon-code-add').show();
    });
    $couponForm.on('submit', function (event) {
      var code = $codeInput.val();
      event.preventDefault(); // Empty code

      if (!code) {
        return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
          text: $codeInput.data('error'),
          icon: 'error'
        });
      }

      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.applyCode(code, function (err, response) {
        if (response.data.status === 'success') {
          _this7.refreshContent();
        } else {
          _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
            html: response.data.errors.join('\n'),
            icon: 'error'
          });
        }
      });
    });
  };

  _proto.bindGiftCertificateEvents = function bindGiftCertificateEvents() {
    var _this8 = this;

    var $certContainer = $('.gift-certificate-code');
    var $certForm = $('.cart-gift-certificate-form');
    var $certInput = $('[name="certcode"]', $certForm);
    $('.gift-certificate-add').on('click', function (event) {
      event.preventDefault();
      $(event.currentTarget).toggle();
      $certContainer.toggle();
      $('.gift-certificate-cancel').toggle();
    });
    $('.gift-certificate-cancel').on('click', function (event) {
      event.preventDefault();
      $certContainer.toggle();
      $('.gift-certificate-add').toggle();
      $('.gift-certificate-cancel').toggle();
    });
    $certForm.on('submit', function (event) {
      var code = $certInput.val();
      event.preventDefault();

      if (!Object(_common_gift_certificate_validator__WEBPACK_IMPORTED_MODULE_3__["default"])(code)) {
        var validationDictionary = Object(_common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_4__["createTranslationDictionary"])(_this8.context);
        return _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
          text: validationDictionary.invalid_gift_certificate,
          icon: 'error'
        });
      }

      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.applyGiftCertificate(code, function (err, resp) {
        if (resp.data.status === 'success') {
          _this8.refreshContent();
        } else {
          _global_sweet_alert__WEBPACK_IMPORTED_MODULE_8__["default"].fire({
            html: resp.data.errors.join('\n'),
            icon: 'error'
          });
        }
      });
    });
  };

  _proto.bindGiftWrappingEvents = function bindGiftWrappingEvents() {
    var _this9 = this;

    var modal = Object(_global_modal__WEBPACK_IMPORTED_MODULE_7__["defaultModal"])();
    $('[data-item-giftwrap]').on('click', function (event) {
      var itemId = $(event.currentTarget).data('itemGiftwrap');
      var options = {
        template: 'cart/modals/gift-wrapping-form'
      };
      event.preventDefault();
      modal.open();
      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_5__["default"].api.cart.getItemGiftWrappingOptions(itemId, options, function (err, response) {
        modal.updateContent(response.content);

        _this9.bindGiftWrappingForm();
      });
    });
  };

  _proto.bindGiftWrappingForm = function bindGiftWrappingForm() {
    $('.giftWrapping-select').on('change', function (event) {
      var $select = $(event.currentTarget);
      var id = $select.val();
      var index = $select.data('index');

      if (!id) {
        return;
      }

      var allowMessage = $select.find("option[value=" + id + "]").data('allowMessage');
      $(".giftWrapping-image-" + index).hide();
      $("#giftWrapping-image-" + index + "-" + id).show();

      if (allowMessage) {
        $("#giftWrapping-message-" + index).show();
      } else {
        $("#giftWrapping-message-" + index).hide();
      }
    });
    $('.giftWrapping-select').trigger('change');

    function toggleViews() {
      var value = $('input:radio[name ="giftwraptype"]:checked').val();
      var $singleForm = $('.giftWrapping-single');
      var $multiForm = $('.giftWrapping-multiple');

      if (value === 'same') {
        $singleForm.show();
        $multiForm.hide();
      } else {
        $singleForm.hide();
        $multiForm.show();
      }
    }

    $('[name="giftwraptype"]').on('click', toggleViews);
    toggleViews();
  };

  _proto.bindEvents = function bindEvents() {
    this.bindCartEvents();
    this.bindPromoCodeEvents();
    this.bindGiftWrappingEvents();
    this.bindGiftCertificateEvents(); // initiate shipping estimator module

    var shippingErrorMessages = {
      country: this.context.shippingCountryErrorMessage,
      province: this.context.shippingProvinceErrorMessage
    };
    this.shippingEstimator = new _cart_shipping_estimator__WEBPACK_IMPORTED_MODULE_6__["default"]($('[data-shipping-estimator]'), shippingErrorMessages);
  };

  return Cart;
}(_page_manager__WEBPACK_IMPORTED_MODULE_2__["default"]);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/cart/shipping-estimator.js":
/*!****************************************************!*\
  !*** ./assets/js/theme/cart/shipping-estimator.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ShippingEstimator; });
/* harmony import */ var _common_state_country__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/state-country */ "./assets/js/theme/common/state-country.js");
/* harmony import */ var _common_nod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* harmony import */ var _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* harmony import */ var _common_collapsible__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/collapsible */ "./assets/js/theme/common/collapsible.js");
/* harmony import */ var _global_sweet_alert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../global/sweet-alert */ "./assets/js/theme/global/sweet-alert.js");







var ShippingEstimator = /*#__PURE__*/function () {
  function ShippingEstimator($element, shippingErrorMessages) {
    this.$element = $element;
    this.$state = $('[data-field-type="State"]', this.$element);
    this.isEstimatorFormOpened = false;
    this.shippingErrorMessages = shippingErrorMessages;
    this.initFormValidation();
    this.bindStateCountryChange();
    this.bindEstimatorEvents();
  }

  var _proto = ShippingEstimator.prototype;

  _proto.initFormValidation = function initFormValidation() {
    var _this = this;

    var shippingEstimatorAlert = $('.shipping-quotes');
    this.shippingEstimator = 'form[data-shipping-estimator]';
    this.shippingValidator = Object(_common_nod__WEBPACK_IMPORTED_MODULE_1__["default"])({
      submit: this.shippingEstimator + " .shipping-estimate-submit",
      tap: _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_3__["announceInputErrorMessage"]
    });
    $('.shipping-estimate-submit', this.$element).on('click', function (event) {
      // estimator error messages are being injected in html as a result
      // of user submit; clearing and adding role on submit provides
      // regular announcement of these error messages
      if (shippingEstimatorAlert.attr('role')) {
        shippingEstimatorAlert.removeAttr('role');
      }

      shippingEstimatorAlert.attr('role', 'alert'); // When switching between countries, the state/region is dynamic
      // Only perform a check for all fields when country has a value
      // Otherwise areAll('valid') will check country for validity

      if ($(_this.shippingEstimator + " select[name=\"shipping-country\"]").val()) {
        _this.shippingValidator.performCheck();
      }

      if (_this.shippingValidator.areAll('valid')) {
        return;
      }

      event.preventDefault();
    });
    this.bindValidation();
    this.bindStateValidation();
    this.bindUPSRates();
  };

  _proto.bindValidation = function bindValidation() {
    this.shippingValidator.add([{
      selector: this.shippingEstimator + " select[name=\"shipping-country\"]",
      validate: function validate(cb, val) {
        var countryId = Number(val);
        var result = countryId !== 0 && !Number.isNaN(countryId);
        cb(result);
      },
      errorMessage: this.shippingErrorMessages.country
    }]);
  };

  _proto.bindStateValidation = function bindStateValidation() {
    var _this2 = this;

    this.shippingValidator.add([{
      selector: $(this.shippingEstimator + " select[name=\"shipping-state\"]"),
      validate: function validate(cb) {
        var result;
        var $ele = $(_this2.shippingEstimator + " select[name=\"shipping-state\"]");

        if ($ele.length) {
          var eleVal = $ele.val();
          result = eleVal && eleVal.length && eleVal !== 'State/province';
        }

        cb(result);
      },
      errorMessage: this.shippingErrorMessages.province
    }]);
  }
  /**
   * Toggle between default shipping and ups shipping rates
   */
  ;

  _proto.bindUPSRates = function bindUPSRates() {
    var UPSRateToggle = '.estimator-form-toggleUPSRate';
    $('body').on('click', UPSRateToggle, function (event) {
      var $estimatorFormUps = $('.estimator-form--ups');
      var $estimatorFormDefault = $('.estimator-form--default');
      event.preventDefault();
      $estimatorFormUps.toggleClass('u-hiddenVisually');
      $estimatorFormDefault.toggleClass('u-hiddenVisually');
    });
  };

  _proto.bindStateCountryChange = function bindStateCountryChange() {
    var _this3 = this;

    var $last; // Requests the states for a country with AJAX

    Object(_common_state_country__WEBPACK_IMPORTED_MODULE_0__["default"])(this.$state, this.context, {
      useIdForStates: true
    }, function (err, field) {
      if (err) {
        _global_sweet_alert__WEBPACK_IMPORTED_MODULE_5__["default"].fire({
          text: err,
          icon: 'error'
        });
        throw new Error(err);
      }

      var $field = $(field);

      if (_this3.shippingValidator.getStatus(_this3.$state) !== 'undefined') {
        _this3.shippingValidator.remove(_this3.$state);
      }

      if ($last) {
        _this3.shippingValidator.remove($last);
      }

      if ($field.is('select')) {
        $last = field;

        _this3.bindStateValidation();
      } else {
        $field.attr('placeholder', 'State/province');
        _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_3__["Validators"].cleanUpStateValidation(field);
      } // When you change a country, you swap the state/province between an input and a select dropdown
      // Not all countries require the province to be filled
      // We have to remove this class when we swap since nod validation doesn't cleanup for us


      $(_this3.shippingEstimator).find('.form-field--success').removeClass('form-field--success');
    });
  };

  _proto.toggleEstimatorFormState = function toggleEstimatorFormState(toggleButton, buttonSelector, $toggleContainer) {
    var changeAttributesOnToggle = function changeAttributesOnToggle(selectorToActivate) {
      $(toggleButton).attr('aria-labelledby', selectorToActivate);
      $(buttonSelector).text($("#" + selectorToActivate).text());
    };

    if (!this.isEstimatorFormOpened) {
      changeAttributesOnToggle('estimator-close');
      $toggleContainer.removeClass('u-hidden');
    } else {
      changeAttributesOnToggle('estimator-add');
      $toggleContainer.addClass('u-hidden');
    }

    this.isEstimatorFormOpened = !this.isEstimatorFormOpened;
  };

  _proto.bindEstimatorEvents = function bindEstimatorEvents() {
    var _this4 = this;

    var $estimatorContainer = $('.shipping-estimator');
    var $estimatorForm = $('.estimator-form');
    Object(_common_collapsible__WEBPACK_IMPORTED_MODULE_4__["default"])();
    $estimatorForm.on('submit', function (event) {
      var params = {
        country_id: $('[name="shipping-country"]', $estimatorForm).val(),
        state_id: $('[name="shipping-state"]', $estimatorForm).val(),
        city: $('[name="shipping-city"]', $estimatorForm).val(),
        zip_code: $('[name="shipping-zip"]', $estimatorForm).val()
      };
      event.preventDefault();
      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_2__["default"].api.cart.getShippingQuotes(params, 'cart/shipping-quotes', function (err, response) {
        $('.shipping-quotes').html(response.content); // bind the select button

        $('.select-shipping-quote').on('click', function (clickEvent) {
          var quoteId = $('.shipping-quote:checked').val();
          clickEvent.preventDefault();
          _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_2__["default"].api.cart.submitShippingQuote(quoteId, function () {
            window.location.reload();
          });
        });
      });
    });
    $('.shipping-estimate-show').on('click', function (event) {
      event.preventDefault();

      _this4.toggleEstimatorFormState(event.currentTarget, '.shipping-estimate-show__btn-name', $estimatorContainer);
    });
  };

  return ShippingEstimator;
}();


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/common/cart-item-details.js":
/*!*****************************************************!*\
  !*** ./assets/js/theme/common/cart-item-details.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CartItemDetails; });
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isEmpty */ "./node_modules/lodash/isEmpty.js");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* harmony import */ var _product_details_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product-details-base */ "./assets/js/theme/common/product-details-base.js");
/* harmony import */ var _utils_ie_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/ie-helpers */ "./assets/js/theme/common/utils/ie-helpers.js");


function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var CartItemDetails = /*#__PURE__*/function (_ProductDetailsBase) {
  _inheritsLoose(CartItemDetails, _ProductDetailsBase);

  function CartItemDetails($scope, context, productAttributesData) {
    var _this;

    if (productAttributesData === void 0) {
      productAttributesData = {};
    }

    _this = _ProductDetailsBase.call(this, $scope, context) || this;
    var $form = $('#CartEditProductFieldsForm', _this.$scope);
    var $productOptionsElement = $('[data-product-attributes-wrapper]', $form);
    var hasOptions = $productOptionsElement.html().trim().length;
    var hasDefaultOptions = $productOptionsElement.find('[data-default]').length;
    $productOptionsElement.on('change', function () {
      _this.setProductVariant();
    });
    var optionChangeCallback = _product_details_base__WEBPACK_IMPORTED_MODULE_2__["optionChangeDecorator"].call(_assertThisInitialized(_this), hasDefaultOptions); // Update product attributes. Also update the initial view in case items are oos
    // or have default variant properties that change the view

    if ((lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default()(productAttributesData) || hasDefaultOptions) && hasOptions) {
      var productId = _this.context.productForChangeId;
      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_1__["default"].api.productAttributes.optionChange(productId, $form.serialize(), 'products/bulk-discount-rates', optionChangeCallback);
    } else {
      _this.updateProductAttributes(productAttributesData);
    }

    return _this;
  }

  var _proto = CartItemDetails.prototype;

  _proto.setProductVariant = function setProductVariant() {
    var unsatisfiedRequiredFields = [];
    var options = [];
    $.each($('[data-product-attribute]'), function (index, value) {
      var optionLabel = value.children[0].innerText;
      var optionTitle = optionLabel.split(':')[0].trim();
      var required = optionLabel.toLowerCase().includes('required');
      var type = value.getAttribute('data-product-attribute');

      if ((type === 'input-file' || type === 'input-text' || type === 'input-number') && value.querySelector('input').value === '' && required) {
        unsatisfiedRequiredFields.push(value);
      }

      if (type === 'textarea' && value.querySelector('textarea').value === '' && required) {
        unsatisfiedRequiredFields.push(value);
      }

      if (type === 'date') {
        var isSatisfied = Array.from(value.querySelectorAll('select')).every(function (select) {
          return select.selectedIndex !== 0;
        });

        if (isSatisfied) {
          var dateString = Array.from(value.querySelectorAll('select')).map(function (x) {
            return x.value;
          }).join('-');
          options.push(optionTitle + ":" + dateString);
          return;
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }

      if (type === 'set-select') {
        var select = value.querySelector('select');
        var selectedIndex = select.selectedIndex;

        if (selectedIndex !== 0) {
          options.push(optionTitle + ":" + select.options[selectedIndex].innerText);
          return;
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }

      if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch' || type === 'input-checkbox' || type === 'product-list') {
        var checked = value.querySelector(':checked');

        if (checked) {
          var getSelectedOptionLabel = function getSelectedOptionLabel() {
            var productVariantslist = Object(_utils_ie_helpers__WEBPACK_IMPORTED_MODULE_3__["convertIntoArray"])(value.children);

            var matchLabelForCheckedInput = function matchLabelForCheckedInput(inpt) {
              return inpt.dataset.productAttributeValue === checked.value;
            };

            return productVariantslist.filter(matchLabelForCheckedInput)[0];
          };

          if (type === 'set-rectangle' || type === 'set-radio' || type === 'product-list') {
            var label = _utils_ie_helpers__WEBPACK_IMPORTED_MODULE_3__["isBrowserIE"] ? getSelectedOptionLabel().innerText.trim() : checked.labels[0].innerText;

            if (label) {
              options.push(optionTitle + ":" + label);
            }
          }

          if (type === 'swatch') {
            var _label = _utils_ie_helpers__WEBPACK_IMPORTED_MODULE_3__["isBrowserIE"] ? getSelectedOptionLabel().children[0] : checked.labels[0].children[0];

            if (_label) {
              options.push(optionTitle + ":" + _label.title);
            }
          }

          if (type === 'input-checkbox') {
            options.push(optionTitle + ":Yes");
          }

          return;
        }

        if (type === 'input-checkbox') {
          options.push(optionTitle + ":No");
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }
    });
    var productVariant = unsatisfiedRequiredFields.length === 0 ? options.sort().join(', ') : 'unsatisfied';
    var view = $('.modal-header-title');

    if (productVariant) {
      productVariant = productVariant === 'unsatisfied' ? '' : productVariant;

      if (view.attr('data-event-type')) {
        view.attr('data-product-variant', productVariant);
      } else {
        var productName = view.html().match(/'(.*?)'/)[1];
        var card = $("[data-name=\"" + productName + "\"]");
        card.attr('data-product-variant', productVariant);
      }
    }
  }
  /**
   * Hide or mark as unavailable out of stock attributes if enabled
   * @param  {Object} data Product attribute data
   */
  ;

  _proto.updateProductAttributes = function updateProductAttributes(data) {
    _ProductDetailsBase.prototype.updateProductAttributes.call(this, data);

    this.$scope.find('.modal-content').removeClass('hide-content');
  };

  return CartItemDetails;
}(_product_details_base__WEBPACK_IMPORTED_MODULE_2__["default"]);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/common/gift-certificate-validator.js":
/*!**************************************************************!*\
  !*** ./assets/js/theme/common/gift-certificate-validator.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (cert) {
  if (typeof cert !== 'string' || cert.length === 0) {
    return false;
  } // Add any custom gift certificate validation logic here


  return true;
});

/***/ }),

/***/ "./assets/js/theme/common/state-country.js":
/*!*************************************************!*\
  !*** ./assets/js/theme/common/state-country.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var lodash_each__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/each */ "./node_modules/lodash/each.js");
/* harmony import */ var lodash_each__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_each__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEmpty */ "./node_modules/lodash/isEmpty.js");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_transform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/transform */ "./node_modules/lodash/transform.js");
/* harmony import */ var lodash_transform__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_transform__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* harmony import */ var _utils_form_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* harmony import */ var _global_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../global/modal */ "./assets/js/theme/global/modal.js");






/**
 * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
 * @returns {jQuery|HTMLElement}
 */

function makeStateRequired(stateElement, context) {
  var attrs = lodash_transform__WEBPACK_IMPORTED_MODULE_2___default()(stateElement.prop('attributes'), function (result, item) {
    var ret = result;
    ret[item.name] = item.value;
    return ret;
  });

  var replacementAttributes = {
    id: attrs.id,
    'data-label': attrs['data-label'],
    "class": 'form-select',
    name: attrs.name,
    'data-field-type': attrs['data-field-type']
  };
  stateElement.replaceWith($('<select></select>', replacementAttributes));
  var $newElement = $('[data-field-type="State"]');
  var $hiddenInput = $('[name*="FormFieldIsText"]');

  if ($hiddenInput.length !== 0) {
    $hiddenInput.remove();
  }

  if ($newElement.prev().find('small').length === 0) {
    // String is injected from localizer
    $newElement.prev().append("<small>" + context.required + "</small>");
  } else {
    $newElement.prev().find('small').show();
  }

  return $newElement;
}
/**
 * If a country with states is the default, a select will be sent,
 * In this case we need to be able to switch to an input field and hide the required field
 */


function makeStateOptional(stateElement) {
  var attrs = lodash_transform__WEBPACK_IMPORTED_MODULE_2___default()(stateElement.prop('attributes'), function (result, item) {
    var ret = result;
    ret[item.name] = item.value;
    return ret;
  });

  var replacementAttributes = {
    type: 'text',
    id: attrs.id,
    'data-label': attrs['data-label'],
    "class": 'form-input',
    name: attrs.name,
    'data-field-type': attrs['data-field-type']
  };
  stateElement.replaceWith($('<input />', replacementAttributes));
  var $newElement = $('[data-field-type="State"]');

  if ($newElement.length !== 0) {
    Object(_utils_form_utils__WEBPACK_IMPORTED_MODULE_4__["insertStateHiddenField"])($newElement);
    $newElement.prev().find('small').hide();
  }

  return $newElement;
}
/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param {Object} statesArray
 * @param {jQuery} $selectElement
 * @param {Object} options
 */


function addOptions(statesArray, $selectElement, options) {
  var container = [];
  container.push("<option value=\"\">" + statesArray.prefix + "</option>");

  if (!lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default()($selectElement)) {
    lodash_each__WEBPACK_IMPORTED_MODULE_0___default()(statesArray.states, function (stateObj) {
      if (options.useIdForStates) {
        container.push("<option value=\"" + stateObj.id + "\">" + stateObj.name + "</option>");
      } else {
        container.push("<option value=\"" + stateObj.name + "\">" + (stateObj.label ? stateObj.label : stateObj.name) + "</option>");
      }
    });

    $selectElement.html(container.join(' '));
  }
}
/**
 *
 * @param {jQuery} stateElement
 * @param {Object} context
 * @param {Object} options
 * @param {Function} callback
 */


/* harmony default export */ __webpack_exports__["default"] = (function (stateElement, context, options, callback) {
  if (context === void 0) {
    context = {};
  }

  /**
   * Backwards compatible for three parameters instead of four
   *
   * Available options:
   *
   * useIdForStates {Bool} - Generates states dropdown using id for values instead of strings
   */
  if (typeof options === 'function') {
    /* eslint-disable no-param-reassign */
    callback = options;
    options = {};
    /* eslint-enable no-param-reassign */
  }

  $('select[data-field-type="Country"]').on('change', function (event) {
    var countryName = $(event.currentTarget).val();

    if (countryName === '') {
      return;
    }

    _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_3__["default"].api.country.getByName(countryName, function (err, response) {
      if (err) {
        Object(_global_modal__WEBPACK_IMPORTED_MODULE_5__["showAlertModal"])(context.state_error);
        return callback(err);
      }

      var $currentInput = $('[data-field-type="State"]');

      if (!lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default()(response.data.states)) {
        // The element may have been replaced with a select, reselect it
        var $selectElement = makeStateRequired($currentInput, context);
        addOptions(response.data, $selectElement, options);
        callback(null, $selectElement);
      } else {
        var newElement = makeStateOptional($currentInput, context);
        callback(null, newElement);
      }
    });
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./assets/js/theme/common/utils/translations-utils.js":
/*!************************************************************!*\
  !*** ./assets/js/theme/common/utils/translations-utils.js ***!
  \************************************************************/
/*! exports provided: createTranslationDictionary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTranslationDictionary", function() { return createTranslationDictionary; });
var TRANSLATIONS = 'translations';

var isTranslationDictionaryNotEmpty = function isTranslationDictionaryNotEmpty(dictionary) {
  return !!Object.keys(dictionary[TRANSLATIONS]).length;
};

var chooseActiveDictionary = function chooseActiveDictionary() {
  for (var i = 0; i < arguments.length; i++) {
    var dictionary = JSON.parse(i < 0 || arguments.length <= i ? undefined : arguments[i]);

    if (isTranslationDictionaryNotEmpty(dictionary)) {
      return dictionary;
    }
  }
};
/**
 * defines Translation Dictionary to use
 * @param context provides access to 3 validation JSONs from en.json:
 * validation_messages, validation_fallback_messages and default_messages
 * @returns {Object}
 */


var createTranslationDictionary = function createTranslationDictionary(context) {
  var validationDictionaryJSON = context.validationDictionaryJSON,
      validationFallbackDictionaryJSON = context.validationFallbackDictionaryJSON,
      validationDefaultDictionaryJSON = context.validationDefaultDictionaryJSON;
  var activeDictionary = chooseActiveDictionary(validationDictionaryJSON, validationFallbackDictionaryJSON, validationDefaultDictionaryJSON);
  var localizations = Object.values(activeDictionary[TRANSLATIONS]);
  var translationKeys = Object.keys(activeDictionary[TRANSLATIONS]).map(function (key) {
    return key.split('.').pop();
  });
  return translationKeys.reduce(function (acc, key, i) {
    acc[key] = localizations[i];
    return acc;
  }, {});
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvY2FydC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvY2FydC9zaGlwcGluZy1lc3RpbWF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9jYXJ0LWl0ZW0tZGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL2dpZnQtY2VydGlmaWNhdGUtdmFsaWRhdG9yLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vc3RhdGUtY291bnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL3V0aWxzL3RyYW5zbGF0aW9ucy11dGlscy5qcyJdLCJuYW1lcyI6WyJDYXJ0Iiwib25SZWFkeSIsIiRtb2RhbCIsIiRjYXJ0UGFnZUNvbnRlbnQiLCIkIiwiJGNhcnRDb250ZW50IiwiJGNhcnRNZXNzYWdlcyIsIiRjYXJ0VG90YWxzIiwiJGNhcnRBZGRpdGlvbmFsQ2hlY2tvdXRCdG5zIiwiJG92ZXJsYXkiLCJoaWRlIiwiJGFjdGl2ZUNhcnRJdGVtSWQiLCIkYWN0aXZlQ2FydEl0ZW1CdG5BY3Rpb24iLCJzZXRBcHBsZVBheVN1cHBvcnQiLCJiaW5kRXZlbnRzIiwid2luZG93IiwiQXBwbGVQYXlTZXNzaW9uIiwiYWRkQ2xhc3MiLCJjYXJ0VXBkYXRlIiwiJHRhcmdldCIsIml0ZW1JZCIsImRhdGEiLCIkZWwiLCJvbGRRdHkiLCJwYXJzZUludCIsInZhbCIsIm1heFF0eSIsIm1pblF0eSIsIm1pbkVycm9yIiwibWF4RXJyb3IiLCJuZXdRdHkiLCJzd2FsIiwiZmlyZSIsInRleHQiLCJpY29uIiwic2hvdyIsInV0aWxzIiwiYXBpIiwiY2FydCIsIml0ZW1VcGRhdGUiLCJlcnIiLCJyZXNwb25zZSIsInN0YXR1cyIsInJlbW92ZSIsInJlZnJlc2hDb250ZW50IiwiZXJyb3JzIiwiam9pbiIsImNhcnRVcGRhdGVRdHlUZXh0Q2hhbmdlIiwicHJlVmFsIiwiTnVtYmVyIiwiaW52YWxpZEVudHJ5IiwiY29udGV4dCIsImludmFsaWRFbnRyeU1lc3NhZ2UiLCJyZXBsYWNlIiwiY2FydFJlbW92ZUl0ZW0iLCJpdGVtUmVtb3ZlIiwiY2FydEVkaXRPcHRpb25zIiwicHJvZHVjdElkIiwicHJvZHVjdEZvckNoYW5nZUlkIiwibW9kYWwiLCJkZWZhdWx0TW9kYWwiLCJvcHRpb25zIiwidGVtcGxhdGUiLCJvcGVuIiwiZmluZCIsInByb2R1Y3RBdHRyaWJ1dGVzIiwiY29uZmlndXJlSW5DYXJ0IiwidXBkYXRlQ29udGVudCIsImNvbnRlbnQiLCJvcHRpb25DaGFuZ2VIYW5kbGVyIiwiJHByb2R1Y3RPcHRpb25zQ29udGFpbmVyIiwibW9kYWxCb2R5UmVzZXJ2ZWRIZWlnaHQiLCJvdXRlckhlaWdodCIsImxlbmd0aCIsImNzcyIsImhhc0NsYXNzIiwib25lIiwiTW9kYWxFdmVudHMiLCJvcGVuZWQiLCJwcm9kdWN0RGV0YWlscyIsIkNhcnRJdGVtRGV0YWlscyIsImJpbmRHaWZ0V3JhcHBpbmdGb3JtIiwiaG9va3MiLCJvbiIsImV2ZW50IiwiY3VycmVudFRhcmdldCIsIiRmb3JtIiwiJHN1Ym1pdCIsIiRtZXNzYWdlQm94Iiwib3B0aW9uQ2hhbmdlIiwic2VyaWFsaXplIiwicmVzdWx0IiwicHVyY2hhc2luZ19tZXNzYWdlIiwicHJvcCIsInB1cmNoYXNhYmxlIiwiaW5zdG9jayIsIiRjYXJ0SXRlbXNSb3dzIiwiJGNhcnRQYWdlVGl0bGUiLCJ0b3RhbHMiLCJwYWdlVGl0bGUiLCJzdGF0dXNNZXNzYWdlcyIsImFkZGl0aW9uYWxDaGVja291dEJ1dHRvbnMiLCJsb2NhdGlvbiIsInJlbG9hZCIsImdldENvbnRlbnQiLCJodG1sIiwicmVwbGFjZVdpdGgiLCJxdWFudGl0eSIsInRyaWdnZXIiLCJmaWx0ZXIiLCJiaW5kQ2FydEV2ZW50cyIsImRlYm91bmNlVGltZW91dCIsInByZXZlbnREZWZhdWx0Iiwib25RdHlGb2N1cyIsInZhbHVlIiwiY2hhbmdlIiwic3RyaW5nIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNhbmNlbEJ1dHRvblRleHQiLCJ0aGVuIiwiYmluZFByb21vQ29kZUV2ZW50cyIsIiRjb3Vwb25Db250YWluZXIiLCIkY291cG9uRm9ybSIsIiRjb2RlSW5wdXQiLCJjb2RlIiwiYXBwbHlDb2RlIiwiYmluZEdpZnRDZXJ0aWZpY2F0ZUV2ZW50cyIsIiRjZXJ0Q29udGFpbmVyIiwiJGNlcnRGb3JtIiwiJGNlcnRJbnB1dCIsInRvZ2dsZSIsImNoZWNrSXNHaWZ0Q2VydFZhbGlkIiwidmFsaWRhdGlvbkRpY3Rpb25hcnkiLCJjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkiLCJpbnZhbGlkX2dpZnRfY2VydGlmaWNhdGUiLCJhcHBseUdpZnRDZXJ0aWZpY2F0ZSIsInJlc3AiLCJiaW5kR2lmdFdyYXBwaW5nRXZlbnRzIiwiZ2V0SXRlbUdpZnRXcmFwcGluZ09wdGlvbnMiLCIkc2VsZWN0IiwiaWQiLCJpbmRleCIsImFsbG93TWVzc2FnZSIsInRvZ2dsZVZpZXdzIiwiJHNpbmdsZUZvcm0iLCIkbXVsdGlGb3JtIiwic2hpcHBpbmdFcnJvck1lc3NhZ2VzIiwiY291bnRyeSIsInNoaXBwaW5nQ291bnRyeUVycm9yTWVzc2FnZSIsInByb3ZpbmNlIiwic2hpcHBpbmdQcm92aW5jZUVycm9yTWVzc2FnZSIsInNoaXBwaW5nRXN0aW1hdG9yIiwiU2hpcHBpbmdFc3RpbWF0b3IiLCJQYWdlTWFuYWdlciIsIiRlbGVtZW50IiwiJHN0YXRlIiwiaXNFc3RpbWF0b3JGb3JtT3BlbmVkIiwiaW5pdEZvcm1WYWxpZGF0aW9uIiwiYmluZFN0YXRlQ291bnRyeUNoYW5nZSIsImJpbmRFc3RpbWF0b3JFdmVudHMiLCJzaGlwcGluZ0VzdGltYXRvckFsZXJ0Iiwic2hpcHBpbmdWYWxpZGF0b3IiLCJub2QiLCJzdWJtaXQiLCJ0YXAiLCJhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIiwiYXR0ciIsInJlbW92ZUF0dHIiLCJwZXJmb3JtQ2hlY2siLCJhcmVBbGwiLCJiaW5kVmFsaWRhdGlvbiIsImJpbmRTdGF0ZVZhbGlkYXRpb24iLCJiaW5kVVBTUmF0ZXMiLCJhZGQiLCJzZWxlY3RvciIsInZhbGlkYXRlIiwiY2IiLCJjb3VudHJ5SWQiLCJpc05hTiIsImVycm9yTWVzc2FnZSIsIiRlbGUiLCJlbGVWYWwiLCJVUFNSYXRlVG9nZ2xlIiwiJGVzdGltYXRvckZvcm1VcHMiLCIkZXN0aW1hdG9yRm9ybURlZmF1bHQiLCJ0b2dnbGVDbGFzcyIsIiRsYXN0Iiwic3RhdGVDb3VudHJ5IiwidXNlSWRGb3JTdGF0ZXMiLCJmaWVsZCIsIkVycm9yIiwiJGZpZWxkIiwiZ2V0U3RhdHVzIiwiaXMiLCJWYWxpZGF0b3JzIiwiY2xlYW5VcFN0YXRlVmFsaWRhdGlvbiIsInJlbW92ZUNsYXNzIiwidG9nZ2xlRXN0aW1hdG9yRm9ybVN0YXRlIiwidG9nZ2xlQnV0dG9uIiwiYnV0dG9uU2VsZWN0b3IiLCIkdG9nZ2xlQ29udGFpbmVyIiwiY2hhbmdlQXR0cmlidXRlc09uVG9nZ2xlIiwic2VsZWN0b3JUb0FjdGl2YXRlIiwiJGVzdGltYXRvckNvbnRhaW5lciIsIiRlc3RpbWF0b3JGb3JtIiwiY29sbGFwc2libGVGYWN0b3J5IiwicGFyYW1zIiwiY291bnRyeV9pZCIsInN0YXRlX2lkIiwiY2l0eSIsInppcF9jb2RlIiwiZ2V0U2hpcHBpbmdRdW90ZXMiLCJjbGlja0V2ZW50IiwicXVvdGVJZCIsInN1Ym1pdFNoaXBwaW5nUXVvdGUiLCIkc2NvcGUiLCJwcm9kdWN0QXR0cmlidXRlc0RhdGEiLCIkcHJvZHVjdE9wdGlvbnNFbGVtZW50IiwiaGFzT3B0aW9ucyIsInRyaW0iLCJoYXNEZWZhdWx0T3B0aW9ucyIsInNldFByb2R1Y3RWYXJpYW50Iiwib3B0aW9uQ2hhbmdlQ2FsbGJhY2siLCJvcHRpb25DaGFuZ2VEZWNvcmF0b3IiLCJjYWxsIiwidXBkYXRlUHJvZHVjdEF0dHJpYnV0ZXMiLCJ1bnNhdGlzZmllZFJlcXVpcmVkRmllbGRzIiwiZWFjaCIsIm9wdGlvbkxhYmVsIiwiY2hpbGRyZW4iLCJpbm5lclRleHQiLCJvcHRpb25UaXRsZSIsInNwbGl0IiwicmVxdWlyZWQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwidHlwZSIsImdldEF0dHJpYnV0ZSIsInF1ZXJ5U2VsZWN0b3IiLCJwdXNoIiwiaXNTYXRpc2ZpZWQiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiZXZlcnkiLCJzZWxlY3QiLCJzZWxlY3RlZEluZGV4IiwiZGF0ZVN0cmluZyIsIm1hcCIsIngiLCJjaGVja2VkIiwiZ2V0U2VsZWN0ZWRPcHRpb25MYWJlbCIsInByb2R1Y3RWYXJpYW50c2xpc3QiLCJjb252ZXJ0SW50b0FycmF5IiwibWF0Y2hMYWJlbEZvckNoZWNrZWRJbnB1dCIsImlucHQiLCJkYXRhc2V0IiwicHJvZHVjdEF0dHJpYnV0ZVZhbHVlIiwibGFiZWwiLCJpc0Jyb3dzZXJJRSIsImxhYmVscyIsInRpdGxlIiwicHJvZHVjdFZhcmlhbnQiLCJzb3J0IiwidmlldyIsInByb2R1Y3ROYW1lIiwibWF0Y2giLCJjYXJkIiwiUHJvZHVjdERldGFpbHNCYXNlIiwiY2VydCIsIm1ha2VTdGF0ZVJlcXVpcmVkIiwic3RhdGVFbGVtZW50IiwiYXR0cnMiLCJpdGVtIiwicmV0IiwibmFtZSIsInJlcGxhY2VtZW50QXR0cmlidXRlcyIsIiRuZXdFbGVtZW50IiwiJGhpZGRlbklucHV0IiwicHJldiIsImFwcGVuZCIsIm1ha2VTdGF0ZU9wdGlvbmFsIiwiaW5zZXJ0U3RhdGVIaWRkZW5GaWVsZCIsImFkZE9wdGlvbnMiLCJzdGF0ZXNBcnJheSIsIiRzZWxlY3RFbGVtZW50IiwiY29udGFpbmVyIiwicHJlZml4Iiwic3RhdGVzIiwic3RhdGVPYmoiLCJjYWxsYmFjayIsImNvdW50cnlOYW1lIiwiZ2V0QnlOYW1lIiwic2hvd0FsZXJ0TW9kYWwiLCJzdGF0ZV9lcnJvciIsIiRjdXJyZW50SW5wdXQiLCJuZXdFbGVtZW50IiwiVFJBTlNMQVRJT05TIiwiaXNUcmFuc2xhdGlvbkRpY3Rpb25hcnlOb3RFbXB0eSIsImRpY3Rpb25hcnkiLCJPYmplY3QiLCJrZXlzIiwiY2hvb3NlQWN0aXZlRGljdGlvbmFyeSIsImkiLCJKU09OIiwicGFyc2UiLCJ2YWxpZGF0aW9uRGljdGlvbmFyeUpTT04iLCJ2YWxpZGF0aW9uRmFsbGJhY2tEaWN0aW9uYXJ5SlNPTiIsInZhbGlkYXRpb25EZWZhdWx0RGljdGlvbmFyeUpTT04iLCJhY3RpdmVEaWN0aW9uYXJ5IiwibG9jYWxpemF0aW9ucyIsInZhbHVlcyIsInRyYW5zbGF0aW9uS2V5cyIsImtleSIsInBvcCIsInJlZHVjZSIsImFjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQSxJOzs7Ozs7Ozs7U0FDakJDLE8sR0FBQSxtQkFBVTtBQUNOLFNBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JDLENBQUMsQ0FBQyxhQUFELENBQXpCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQkQsQ0FBQyxDQUFDLHFCQUFELENBQXJCO0FBQ0EsU0FBS0UsYUFBTCxHQUFxQkYsQ0FBQyxDQUFDLG9CQUFELENBQXRCO0FBQ0EsU0FBS0csV0FBTCxHQUFtQkgsQ0FBQyxDQUFDLG9CQUFELENBQXBCO0FBQ0EsU0FBS0ksMkJBQUwsR0FBbUNKLENBQUMsQ0FBQyx5Q0FBRCxDQUFwQztBQUNBLFNBQUtLLFFBQUwsR0FBZ0JMLENBQUMsQ0FBQyw2QkFBRCxDQUFELENBQ1hNLElBRFcsRUFBaEIsQ0FQTSxDQVFPOztBQUNiLFNBQUtDLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsU0FBS0Msd0JBQUwsR0FBZ0MsSUFBaEM7QUFFQSxTQUFLQyxrQkFBTDtBQUNBLFNBQUtDLFVBQUw7QUFDSCxHOztTQUVERCxrQixHQUFBLDhCQUFxQjtBQUNqQixRQUFJRSxNQUFNLENBQUNDLGVBQVgsRUFBNEI7QUFDeEIsV0FBS2IsZ0JB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QUFELENBQTlCLENBQXRCO0FBQ0EsTUFBTWUsZUFBZSxHQUFHWixNQUFNLENBQUNDLElBQVAsQ0FBWVEsZ0JBQWdCLENBQUNaLFlBQUQsQ0FBNUIsRUFBNENqRCxHQUE1QyxDQUFnRCxVQUFBaUUsR0FBRztBQUFBLFdBQUlBLEdBQUcsQ0FBQ2pGLEtBQUosQ0FBVSxHQUFWLEVBQWVrRixHQUFmLEVBQUo7QUFBQSxHQUFuRCxDQUF4QjtBQUVBLFNBQU9GLGVBQWUsQ0FBQ0csTUFBaEIsQ0FBdUIsVUFBQ0MsR0FBRCxFQUFNSCxHQUFOLEVBQVdWLENBQVgsRUFBaUI7QUFDM0NhLE9BQUcsQ0FBQ0gsR0FBRCxDQUFILEdBQVdILGFBQWEsQ0FBQ1AsQ0FBRCxDQUF4QjtBQUNBLFdBQU9hLEdBQVA7QUFDSCxHQUhNLEVBR0osRUFISSxDQUFQO0FBSUgsQ0FWTSxDIiwiZmlsZSI6InRoZW1lLWJ1bmRsZS5jaHVuay44LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VNYW5hZ2VyIGZyb20gJy4vcGFnZS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgYmluZCwgZGVib3VuY2UgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgY2hlY2tJc0dpZnRDZXJ0VmFsaWQgZnJvbSAnLi9jb21tb24vZ2lmdC1jZXJ0aWZpY2F0ZS12YWxpZGF0b3InO1xyXG5pbXBvcnQgeyBjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkgfSBmcm9tICcuL2NvbW1vbi91dGlscy90cmFuc2xhdGlvbnMtdXRpbHMnO1xyXG5pbXBvcnQgdXRpbHMgZnJvbSAnQGJpZ2NvbW1lcmNlL3N0ZW5jaWwtdXRpbHMnO1xyXG5pbXBvcnQgU2hpcHBpbmdFc3RpbWF0b3IgZnJvbSAnLi9jYXJ0L3NoaXBwaW5nLWVzdGltYXRvcic7XHJcbmltcG9ydCB7IGRlZmF1bHRNb2RhbCwgTW9kYWxFdmVudHMgfSBmcm9tICcuL2dsb2JhbC9tb2RhbCc7XHJcbmltcG9ydCBzd2FsIGZyb20gJy4vZ2xvYmFsL3N3ZWV0LWFsZXJ0JztcclxuaW1wb3J0IENhcnRJdGVtRGV0YWlscyBmcm9tICcuL2NvbW1vbi9jYXJ0LWl0ZW0tZGV0YWlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYXJ0IGV4dGVuZHMgUGFnZU1hbmFnZXIge1xyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICB0aGlzLiRtb2RhbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy4kY2FydFBhZ2VDb250ZW50ID0gJCgnW2RhdGEtY2FydF0nKTtcclxuICAgICAgICB0aGlzLiRjYXJ0Q29udGVudCA9ICQoJ1tkYXRhLWNhcnQtY29udGVudF0nKTtcclxuICAgICAgICB0aGlzLiRjYXJ0TWVzc2FnZXMgPSAkKCdbZGF0YS1jYXJ0LXN0YXR1c10nKTtcclxuICAgICAgICB0aGlzLiRjYXJ0VG90YWxzID0gJCgnW2RhdGEtY2FydC10b3RhbHNdJyk7XHJcbiAgICAgICAgdGhpcy4kY2FydEFkZGl0aW9uYWxDaGVja291dEJ0bnMgPSAkKCdbZGF0YS1jYXJ0LWFkZGl0aW9uYWwtY2hlY2tvdXQtYnV0dG9uc10nKTtcclxuICAgICAgICB0aGlzLiRvdmVybGF5ID0gJCgnW2RhdGEtY2FydF0gLmxvYWRpbmdPdmVybGF5JylcclxuICAgICAgICAgICAgLmhpZGUoKTsgLy8gVE9ETzogdGVtcG9yYXJ5IHVudGlsIHJvcGVyIHB1bGxzIGluIGhpcyBjYXJ0IGNvbXBvbmVudHNcclxuICAgICAgICB0aGlzLiRhY3RpdmVDYXJ0SXRlbUlkID0gbnVsbDtcclxuICAgICAgICB0aGlzLiRhY3RpdmVDYXJ0SXRlbUJ0bkFjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0QXBwbGVQYXlTdXBwb3J0KCk7XHJcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXBwbGVQYXlTdXBwb3J0KCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuQXBwbGVQYXlTZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGNhcnRQYWdlQ29udGVudC5hZGRDbGFzcygnYXBwbGUtcGF5LXN1cHBvcnRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYXJ0VXBkYXRlKCR0YXJnZXQpIHtcclxuICAgICAgICBjb25zdCBpdGVtSWQgPSAkdGFyZ2V0LmRhdGEoJ2NhcnRJdGVtaWQnKTtcclxuICAgICAgICB0aGlzLiRhY3RpdmVDYXJ0SXRlbUlkID0gaXRlbUlkO1xyXG4gICAgICAgIHRoaXMuJGFjdGl2ZUNhcnRJdGVtQnRuQWN0aW9uID0gJHRhcmdldC5kYXRhKCdhY3Rpb24nKTtcclxuXHJcbiAgICAgICAgY29uc3QgJGVsID0gJChgI3F0eS0ke2l0ZW1JZH1gKTtcclxuICAgICAgICBjb25zdCBvbGRRdHkgPSBwYXJzZUludCgkZWwudmFsKCksIDEwKTtcclxuICAgICAgICBjb25zdCBtYXhRdHkgPSBwYXJzZUludCgkZWwuZGF0YSgncXVhbnRpdHlNYXgnKSwgMTApO1xyXG4gICAgICAgIGNvbnN0IG1pblF0eSA9IHBhcnNlSW50KCRlbC5kYXRhKCdxdWFudGl0eU1pbicpLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWluRXJyb3IgPSAkZWwuZGF0YSgncXVhbnRpdHlNaW5FcnJvcicpO1xyXG4gICAgICAgIGNvbnN0IG1heEVycm9yID0gJGVsLmRhdGEoJ3F1YW50aXR5TWF4RXJyb3InKTtcclxuICAgICAgICBjb25zdCBuZXdRdHkgPSAkdGFyZ2V0LmRhdGEoJ2FjdGlvbicpID09PSAnaW5jJyA/IG9sZFF0eSArIDEgOiBvbGRRdHkgLSAxO1xyXG4gICAgICAgIC8vIERvZXMgbm90IHF1YWxpdHkgZm9yIG1pbi9tYXggcXVhbnRpdHlcclxuICAgICAgICBpZiAobmV3UXR5IDwgbWluUXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogbWluRXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1heFF0eSA+IDAgJiYgbmV3UXR5ID4gbWF4UXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogbWF4RXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJG92ZXJsYXkuc2hvdygpO1xyXG5cclxuICAgICAgICB1dGlscy5hcGkuY2FydC5pdGVtVXBkYXRlKGl0ZW1JZCwgbmV3UXR5LCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRvdmVybGF5LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcXVhbnRpdHkgaXMgY2hhbmdlZCBcIjFcIiBmcm9tIFwiMFwiLCB3ZSBoYXZlIHRvIHJlbW92ZSB0aGUgcm93LlxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gKG5ld1F0eSA9PT0gMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29udGVudChyZW1vdmUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsLnZhbChvbGRRdHkpO1xyXG4gICAgICAgICAgICAgICAgc3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiByZXNwb25zZS5kYXRhLmVycm9ycy5qb2luKCdcXG4nKSxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjYXJ0VXBkYXRlUXR5VGV4dENoYW5nZSgkdGFyZ2V0LCBwcmVWYWwgPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbUlkID0gJHRhcmdldC5kYXRhKCdjYXJ0SXRlbWlkJyk7XHJcbiAgICAgICAgY29uc3QgJGVsID0gJChgI3F0eS0ke2l0ZW1JZH1gKTtcclxuICAgICAgICBjb25zdCBtYXhRdHkgPSBwYXJzZUludCgkZWwuZGF0YSgncXVhbnRpdHlNYXgnKSwgMTApO1xyXG4gICAgICAgIGNvbnN0IG1pblF0eSA9IHBhcnNlSW50KCRlbC5kYXRhKCdxdWFudGl0eU1pbicpLCAxMCk7XHJcbiAgICAgICAgY29uc3Qgb2xkUXR5ID0gcHJlVmFsICE9PSBudWxsID8gcHJlVmFsIDogbWluUXR5O1xyXG4gICAgICAgIGNvbnN0IG1pbkVycm9yID0gJGVsLmRhdGEoJ3F1YW50aXR5TWluRXJyb3InKTtcclxuICAgICAgICBjb25zdCBtYXhFcnJvciA9ICRlbC5kYXRhKCdxdWFudGl0eU1heEVycm9yJyk7XHJcbiAgICAgICAgY29uc3QgbmV3UXR5ID0gcGFyc2VJbnQoTnVtYmVyKCRlbC52YWwoKSksIDEwKTtcclxuICAgICAgICBsZXQgaW52YWxpZEVudHJ5O1xyXG5cclxuICAgICAgICAvLyBEb2VzIG5vdCBxdWFsaXR5IGZvciBtaW4vbWF4IHF1YW50aXR5XHJcbiAgICAgICAgaWYgKCFuZXdRdHkpIHtcclxuICAgICAgICAgICAgaW52YWxpZEVudHJ5ID0gJGVsLnZhbCgpO1xyXG4gICAgICAgICAgICAkZWwudmFsKG9sZFF0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb250ZXh0LmludmFsaWRFbnRyeU1lc3NhZ2UucmVwbGFjZSgnW0VOVFJZXScsIGludmFsaWRFbnRyeSksXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5ld1F0eSA8IG1pblF0eSkge1xyXG4gICAgICAgICAgICAkZWwudmFsKG9sZFF0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogbWluRXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1heFF0eSA+IDAgJiYgbmV3UXR5ID4gbWF4UXR5KSB7XHJcbiAgICAgICAgICAgICRlbC52YWwob2xkUXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBtYXhFcnJvcixcclxuICAgICAgICAgICAgICAgIGljb246ICdlcnJvcicsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5zaG93KCk7XHJcbiAgICAgICAgdXRpbHMuYXBpLmNhcnQuaXRlbVVwZGF0ZShpdGVtSWQsIG5ld1F0eSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kb3ZlcmxheS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09ICdzdWNjZWVkJykge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHF1YW50aXR5IGlzIGNoYW5nZWQgXCIxXCIgZnJvbSBcIjBcIiwgd2UgaGF2ZSB0byByZW1vdmUgdGhlIHJvdy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IChuZXdRdHkgPT09IDApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQocmVtb3ZlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbC52YWwob2xkUXR5KTtcclxuICAgICAgICAgICAgICAgIHN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogcmVzcG9uc2UuZGF0YS5lcnJvcnMuam9pbignXFxuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2Vycm9yJyxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FydFJlbW92ZUl0ZW0oaXRlbUlkKSB7XHJcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5zaG93KCk7XHJcbiAgICAgICAgdXRpbHMuYXBpLmNhcnQuaXRlbVJlbW92ZShpdGVtSWQsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gJ3N1Y2NlZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hDb250ZW50KHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiByZXNwb25zZS5kYXRhLmVycm9ycy5qb2luKCdcXG4nKSxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjYXJ0RWRpdE9wdGlvbnMoaXRlbUlkLCBwcm9kdWN0SWQpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0geyBwcm9kdWN0Rm9yQ2hhbmdlSWQ6IHByb2R1Y3RJZCwgLi4udGhpcy5jb250ZXh0IH07XHJcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkZWZhdWx0TW9kYWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJG1vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG1vZGFsID0gJCgnI21vZGFsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ2NhcnQvbW9kYWxzL2NvbmZpZ3VyZS1wcm9kdWN0JyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtb2RhbC5vcGVuKCk7XHJcbiAgICAgICAgdGhpcy4kbW9kYWwuZmluZCgnLm1vZGFsLWNvbnRlbnQnKS5hZGRDbGFzcygnaGlkZS1jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIHV0aWxzLmFwaS5wcm9kdWN0QXR0cmlidXRlcy5jb25maWd1cmVJbkNhcnQoaXRlbUlkLCBvcHRpb25zLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBtb2RhbC51cGRhdGVDb250ZW50KHJlc3BvbnNlLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25DaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHByb2R1Y3RPcHRpb25zQ29udGFpbmVyID0gJCgnW2RhdGEtcHJvZHVjdC1hdHRyaWJ1dGVzLXdyYXBwZXJdJywgdGhpcy4kbW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWxCb2R5UmVzZXJ2ZWRIZWlnaHQgPSAkcHJvZHVjdE9wdGlvbnNDb250YWluZXIub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHByb2R1Y3RPcHRpb25zQ29udGFpbmVyLmxlbmd0aCAmJiBtb2RhbEJvZHlSZXNlcnZlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRwcm9kdWN0T3B0aW9uc0NvbnRhaW5lci5jc3MoJ2hlaWdodCcsIG1vZGFsQm9keVJlc2VydmVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLiRtb2RhbC5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25DaGFuZ2VIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRtb2RhbC5vbmUoTW9kYWxFdmVudHMub3BlbmVkLCBvcHRpb25DaGFuZ2VIYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9kdWN0RGV0YWlscyA9IG5ldyBDYXJ0SXRlbURldGFpbHModGhpcy4kbW9kYWwsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5iaW5kR2lmdFdyYXBwaW5nRm9ybSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1dGlscy5ob29rcy5vbigncHJvZHVjdC1vcHRpb24tY2hhbmdlJywgKGV2ZW50LCBjdXJyZW50VGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJChjdXJyZW50VGFyZ2V0KS5maW5kKCdmb3JtJyk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRzdWJtaXQgPSAkKCdpbnB1dC5idXR0b24nLCAkZm9ybSk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRtZXNzYWdlQm94ID0gJCgnLmFsZXJ0TWVzc2FnZUJveCcpO1xyXG5cclxuICAgICAgICAgICAgdXRpbHMuYXBpLnByb2R1Y3RBdHRyaWJ1dGVzLm9wdGlvbkNoYW5nZShwcm9kdWN0SWQsICRmb3JtLnNlcmlhbGl6ZSgpLCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQuZGF0YSB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXJyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wdXJjaGFzaW5nX21lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdwLmFsZXJ0Qm94LW1lc3NhZ2UnLCAkbWVzc2FnZUJveCkudGV4dChkYXRhLnB1cmNoYXNpbmdfbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN1Ym1pdC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlQm94LnNob3coKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN1Ym1pdC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZUJveC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhLnB1cmNoYXNhYmxlIHx8ICFkYXRhLmluc3RvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAkc3VibWl0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzdWJtaXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hDb250ZW50KHJlbW92ZSkge1xyXG4gICAgICAgIGNvbnN0ICRjYXJ0SXRlbXNSb3dzID0gJCgnW2RhdGEtaXRlbS1yb3ddJywgdGhpcy4kY2FydENvbnRlbnQpO1xyXG4gICAgICAgIGNvbnN0ICRjYXJ0UGFnZVRpdGxlID0gJCgnW2RhdGEtY2FydC1wYWdlLXRpdGxlXScpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnY2FydC9jb250ZW50JyxcclxuICAgICAgICAgICAgICAgIHRvdGFsczogJ2NhcnQvdG90YWxzJyxcclxuICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogJ2NhcnQvcGFnZS10aXRsZScsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNZXNzYWdlczogJ2NhcnQvc3RhdHVzLW1lc3NhZ2VzJyxcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDaGVja291dEJ1dHRvbnM6ICdjYXJ0L2FkZGl0aW9uYWwtY2hlY2tvdXQtYnV0dG9ucycsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5zaG93KCk7XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBsYXN0IGl0ZW0gZnJvbSBjYXJ0PyBSZWxvYWRcclxuICAgICAgICBpZiAocmVtb3ZlICYmICRjYXJ0SXRlbXNSb3dzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbHMuYXBpLmNhcnQuZ2V0Q29udGVudChvcHRpb25zLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRjYXJ0Q29udGVudC5odG1sKHJlc3BvbnNlLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLiRjYXJ0VG90YWxzLmh0bWwocmVzcG9uc2UudG90YWxzKTtcclxuICAgICAgICAgICAgdGhpcy4kY2FydE1lc3NhZ2VzLmh0bWwocmVzcG9uc2Uuc3RhdHVzTWVzc2FnZXMpO1xyXG4gICAgICAgICAgICB0aGlzLiRjYXJ0QWRkaXRpb25hbENoZWNrb3V0QnRucy5odG1sKHJlc3BvbnNlLmFkZGl0aW9uYWxDaGVja291dEJ1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGNhcnRQYWdlVGl0bGUucmVwbGFjZVdpdGgocmVzcG9uc2UucGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG92ZXJsYXkuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcXVhbnRpdHkgPSAkKCdbZGF0YS1jYXJ0LXF1YW50aXR5XScsIHRoaXMuJGNhcnRDb250ZW50KS5kYXRhKCdjYXJ0UXVhbnRpdHknKSB8fCAwO1xyXG5cclxuICAgICAgICAgICAgJCgnYm9keScpLnRyaWdnZXIoJ2NhcnQtcXVhbnRpdHktdXBkYXRlJywgcXVhbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgJChgW2RhdGEtY2FydC1pdGVtaWQ9JyR7dGhpcy4kYWN0aXZlQ2FydEl0ZW1JZH0nXWAsIHRoaXMuJGNhcnRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihgW2RhdGEtYWN0aW9uPScke3RoaXMuJGFjdGl2ZUNhcnRJdGVtQnRuQWN0aW9ufSddYClcclxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRDYXJ0RXZlbnRzKCkge1xyXG4gICAgICAgIGNvbnN0IGRlYm91bmNlVGltZW91dCA9IDQwMDtcclxuICAgICAgICBjb25zdCBjYXJ0VXBkYXRlID0gYmluZChkZWJvdW5jZSh0aGlzLmNhcnRVcGRhdGUsIGRlYm91bmNlVGltZW91dCksIHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGNhcnRVcGRhdGVRdHlUZXh0Q2hhbmdlID0gYmluZChkZWJvdW5jZSh0aGlzLmNhcnRVcGRhdGVRdHlUZXh0Q2hhbmdlLCBkZWJvdW5jZVRpbWVvdXQpLCB0aGlzKTtcclxuICAgICAgICBjb25zdCBjYXJ0UmVtb3ZlSXRlbSA9IGJpbmQoZGVib3VuY2UodGhpcy5jYXJ0UmVtb3ZlSXRlbSwgZGVib3VuY2VUaW1lb3V0KSwgdGhpcyk7XHJcbiAgICAgICAgbGV0IHByZVZhbDtcclxuXHJcbiAgICAgICAgLy8gY2FydCB1cGRhdGVcclxuICAgICAgICAkKCdbZGF0YS1jYXJ0LXVwZGF0ZV0nLCB0aGlzLiRjYXJ0Q29udGVudCkub24oJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB1cGRhdGUgY2FydCBxdWFudGl0eVxyXG4gICAgICAgICAgICBjYXJ0VXBkYXRlKCR0YXJnZXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBjYXJ0IHF0eSBtYW51YWxseSB1cGRhdGVzXHJcbiAgICAgICAgJCgnLmNhcnQtaXRlbS1xdHktaW5wdXQnLCB0aGlzLiRjYXJ0Q29udGVudCkub24oJ2ZvY3VzJywgZnVuY3Rpb24gb25RdHlGb2N1cygpIHtcclxuICAgICAgICAgICAgcHJlVmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB9KS5jaGFuZ2UoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBjYXJ0IHF1YW50aXR5XHJcbiAgICAgICAgICAgIGNhcnRVcGRhdGVRdHlUZXh0Q2hhbmdlKCR0YXJnZXQsIHByZVZhbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5jYXJ0LXJlbW92ZScsIHRoaXMuJGNhcnRDb250ZW50KS5vbignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1JZCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YSgnY2FydEl0ZW1pZCcpO1xyXG4gICAgICAgICAgICBjb25zdCBzdHJpbmcgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2NvbmZpcm1EZWxldGUnKTtcclxuICAgICAgICAgICAgc3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLmNvbnRleHQuY2FuY2VsQnV0dG9uVGV4dCxcclxuICAgICAgICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSBjYXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydFJlbW92ZUl0ZW0oaXRlbUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLWl0ZW0tZWRpdF0nLCB0aGlzLiRjYXJ0Q29udGVudCkub24oJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtSWQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW1FZGl0Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YSgncHJvZHVjdElkJyk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vIGVkaXQgaXRlbSBpbiBjYXJ0XHJcbiAgICAgICAgICAgIHRoaXMuY2FydEVkaXRPcHRpb25zKGl0ZW1JZCwgcHJvZHVjdElkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kUHJvbW9Db2RlRXZlbnRzKCkge1xyXG4gICAgICAgIGNvbnN0ICRjb3Vwb25Db250YWluZXIgPSAkKCcuY291cG9uLWNvZGUnKTtcclxuICAgICAgICBjb25zdCAkY291cG9uRm9ybSA9ICQoJy5jb3Vwb24tZm9ybScpO1xyXG4gICAgICAgIGNvbnN0ICRjb2RlSW5wdXQgPSAkKCdbbmFtZT1cImNvdXBvbmNvZGVcIl0nLCAkY291cG9uRm9ybSk7XHJcblxyXG4gICAgICAgICQoJy5jb3Vwb24tY29kZS1hZGQnKS5vbignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmhpZGUoKTtcclxuICAgICAgICAgICAgJGNvdXBvbkNvbnRhaW5lci5zaG93KCk7XHJcbiAgICAgICAgICAgICQoJy5jb3Vwb24tY29kZS1jYW5jZWwnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICRjb2RlSW5wdXQudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmNvdXBvbi1jb2RlLWNhbmNlbCcpLm9uKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICRjb3Vwb25Db250YWluZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKCcuY291cG9uLWNvZGUtY2FuY2VsJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKCcuY291cG9uLWNvZGUtYWRkJykuc2hvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkY291cG9uRm9ybS5vbignc3VibWl0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2RlID0gJGNvZGVJbnB1dC52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBFbXB0eSBjb2RlXHJcbiAgICAgICAgICAgIGlmICghY29kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJGNvZGVJbnB1dC5kYXRhKCdlcnJvcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdlcnJvcicsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuYXBwbHlDb2RlKGNvZGUsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogcmVzcG9uc2UuZGF0YS5lcnJvcnMuam9pbignXFxuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdlcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRHaWZ0Q2VydGlmaWNhdGVFdmVudHMoKSB7XHJcbiAgICAgICAgY29uc3QgJGNlcnRDb250YWluZXIgPSAkKCcuZ2lmdC1jZXJ0aWZpY2F0ZS1jb2RlJyk7XHJcbiAgICAgICAgY29uc3QgJGNlcnRGb3JtID0gJCgnLmNhcnQtZ2lmdC1jZXJ0aWZpY2F0ZS1mb3JtJyk7XHJcbiAgICAgICAgY29uc3QgJGNlcnRJbnB1dCA9ICQoJ1tuYW1lPVwiY2VydGNvZGVcIl0nLCAkY2VydEZvcm0pO1xyXG5cclxuICAgICAgICAkKCcuZ2lmdC1jZXJ0aWZpY2F0ZS1hZGQnKS5vbignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICRjZXJ0Q29udGFpbmVyLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAkKCcuZ2lmdC1jZXJ0aWZpY2F0ZS1jYW5jZWwnKS50b2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmdpZnQtY2VydGlmaWNhdGUtY2FuY2VsJykub24oJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkY2VydENvbnRhaW5lci50b2dnbGUoKTtcclxuICAgICAgICAgICAgJCgnLmdpZnQtY2VydGlmaWNhdGUtYWRkJykudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICQoJy5naWZ0LWNlcnRpZmljYXRlLWNhbmNlbCcpLnRvZ2dsZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkY2VydEZvcm0ub24oJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29kZSA9ICRjZXJ0SW5wdXQudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjaGVja0lzR2lmdENlcnRWYWxpZChjb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvbkRpY3Rpb25hcnkgPSBjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkodGhpcy5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHZhbGlkYXRpb25EaWN0aW9uYXJ5LmludmFsaWRfZ2lmdF9jZXJ0aWZpY2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWxzLmFwaS5jYXJ0LmFwcGx5R2lmdENlcnRpZmljYXRlKGNvZGUsIChlcnIsIHJlc3ApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IHJlc3AuZGF0YS5lcnJvcnMuam9pbignXFxuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdlcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRHaWZ0V3JhcHBpbmdFdmVudHMoKSB7XHJcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkZWZhdWx0TW9kYWwoKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtaXRlbS1naWZ0d3JhcF0nKS5vbignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1JZCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YSgnaXRlbUdpZnR3cmFwJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ2NhcnQvbW9kYWxzL2dpZnQtd3JhcHBpbmctZm9ybScsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbW9kYWwub3BlbigpO1xyXG5cclxuICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuZ2V0SXRlbUdpZnRXcmFwcGluZ09wdGlvbnMoaXRlbUlkLCBvcHRpb25zLCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW9kYWwudXBkYXRlQ29udGVudChyZXNwb25zZS5jb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRHaWZ0V3JhcHBpbmdGb3JtKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRHaWZ0V3JhcHBpbmdGb3JtKCkge1xyXG4gICAgICAgICQoJy5naWZ0V3JhcHBpbmctc2VsZWN0Jykub24oJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gJHNlbGVjdC52YWwoKTtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSAkc2VsZWN0LmRhdGEoJ2luZGV4Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFsbG93TWVzc2FnZSA9ICRzZWxlY3QuZmluZChgb3B0aW9uW3ZhbHVlPSR7aWR9XWApLmRhdGEoJ2FsbG93TWVzc2FnZScpO1xyXG5cclxuICAgICAgICAgICAgJChgLmdpZnRXcmFwcGluZy1pbWFnZS0ke2luZGV4fWApLmhpZGUoKTtcclxuICAgICAgICAgICAgJChgI2dpZnRXcmFwcGluZy1pbWFnZS0ke2luZGV4fS0ke2lkfWApLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhbGxvd01lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICQoYCNnaWZ0V3JhcHBpbmctbWVzc2FnZS0ke2luZGV4fWApLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoYCNnaWZ0V3JhcHBpbmctbWVzc2FnZS0ke2luZGV4fWApLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuZ2lmdFdyYXBwaW5nLXNlbGVjdCcpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVWaWV3cygpIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSAkKCdpbnB1dDpyYWRpb1tuYW1lID1cImdpZnR3cmFwdHlwZVwiXTpjaGVja2VkJykudmFsKCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRzaW5nbGVGb3JtID0gJCgnLmdpZnRXcmFwcGluZy1zaW5nbGUnKTtcclxuICAgICAgICAgICAgY29uc3QgJG11bHRpRm9ybSA9ICQoJy5naWZ0V3JhcHBpbmctbXVsdGlwbGUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ3NhbWUnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2luZ2xlRm9ybS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkbXVsdGlGb3JtLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRzaW5nbGVGb3JtLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICRtdWx0aUZvcm0uc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCdbbmFtZT1cImdpZnR3cmFwdHlwZVwiXScpLm9uKCdjbGljaycsIHRvZ2dsZVZpZXdzKTtcclxuXHJcbiAgICAgICAgdG9nZ2xlVmlld3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMuYmluZENhcnRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmJpbmRQcm9tb0NvZGVFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmJpbmRHaWZ0V3JhcHBpbmdFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmJpbmRHaWZ0Q2VydGlmaWNhdGVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhdGUgc2hpcHBpbmcgZXN0aW1hdG9yIG1vZHVsZVxyXG4gICAgICAgIGNvbnN0IHNoaXBwaW5nRXJyb3JNZXNzYWdlcyA9IHtcclxuICAgICAgICAgICAgY291bnRyeTogdGhpcy5jb250ZXh0LnNoaXBwaW5nQ291bnRyeUVycm9yTWVzc2FnZSxcclxuICAgICAgICAgICAgcHJvdmluY2U6IHRoaXMuY29udGV4dC5zaGlwcGluZ1Byb3ZpbmNlRXJyb3JNZXNzYWdlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zaGlwcGluZ0VzdGltYXRvciA9IG5ldyBTaGlwcGluZ0VzdGltYXRvcigkKCdbZGF0YS1zaGlwcGluZy1lc3RpbWF0b3JdJyksIHNoaXBwaW5nRXJyb3JNZXNzYWdlcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHN0YXRlQ291bnRyeSBmcm9tICcuLi9jb21tb24vc3RhdGUtY291bnRyeSc7XHJcbmltcG9ydCBub2QgZnJvbSAnLi4vY29tbW9uL25vZCc7XHJcbmltcG9ydCB1dGlscyBmcm9tICdAYmlnY29tbWVyY2Uvc3RlbmNpbC11dGlscyc7XHJcbmltcG9ydCB7IFZhbGlkYXRvcnMsIGFubm91bmNlSW5wdXRFcnJvck1lc3NhZ2UgfSBmcm9tICcuLi9jb21tb24vdXRpbHMvZm9ybS11dGlscyc7XHJcbmltcG9ydCBjb2xsYXBzaWJsZUZhY3RvcnkgZnJvbSAnLi4vY29tbW9uL2NvbGxhcHNpYmxlJztcclxuaW1wb3J0IHN3YWwgZnJvbSAnLi4vZ2xvYmFsL3N3ZWV0LWFsZXJ0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXBwaW5nRXN0aW1hdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKCRlbGVtZW50LCBzaGlwcGluZ0Vycm9yTWVzc2FnZXMpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuJHN0YXRlID0gJCgnW2RhdGEtZmllbGQtdHlwZT1cIlN0YXRlXCJdJywgdGhpcy4kZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5pc0VzdGltYXRvckZvcm1PcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNoaXBwaW5nRXJyb3JNZXNzYWdlcyA9IHNoaXBwaW5nRXJyb3JNZXNzYWdlcztcclxuICAgICAgICB0aGlzLmluaXRGb3JtVmFsaWRhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuYmluZFN0YXRlQ291bnRyeUNoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMuYmluZEVzdGltYXRvckV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRGb3JtVmFsaWRhdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzaGlwcGluZ0VzdGltYXRvckFsZXJ0ID0gJCgnLnNoaXBwaW5nLXF1b3RlcycpO1xyXG5cclxuICAgICAgICB0aGlzLnNoaXBwaW5nRXN0aW1hdG9yID0gJ2Zvcm1bZGF0YS1zaGlwcGluZy1lc3RpbWF0b3JdJztcclxuICAgICAgICB0aGlzLnNoaXBwaW5nVmFsaWRhdG9yID0gbm9kKHtcclxuICAgICAgICAgICAgc3VibWl0OiBgJHt0aGlzLnNoaXBwaW5nRXN0aW1hdG9yfSAuc2hpcHBpbmctZXN0aW1hdGUtc3VibWl0YCxcclxuICAgICAgICAgICAgdGFwOiBhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuc2hpcHBpbmctZXN0aW1hdGUtc3VibWl0JywgdGhpcy4kZWxlbWVudCkub24oJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAvLyBlc3RpbWF0b3IgZXJyb3IgbWVzc2FnZXMgYXJlIGJlaW5nIGluamVjdGVkIGluIGh0bWwgYXMgYSByZXN1bHRcclxuICAgICAgICAgICAgLy8gb2YgdXNlciBzdWJtaXQ7IGNsZWFyaW5nIGFuZCBhZGRpbmcgcm9sZSBvbiBzdWJtaXQgcHJvdmlkZXNcclxuICAgICAgICAgICAgLy8gcmVndWxhciBhbm5vdW5jZW1lbnQgb2YgdGhlc2UgZXJyb3IgbWVzc2FnZXNcclxuICAgICAgICAgICAgaWYgKHNoaXBwaW5nRXN0aW1hdG9yQWxlcnQuYXR0cigncm9sZScpKSB7XHJcbiAgICAgICAgICAgICAgICBzaGlwcGluZ0VzdGltYXRvckFsZXJ0LnJlbW92ZUF0dHIoJ3JvbGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hpcHBpbmdFc3RpbWF0b3JBbGVydC5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XHJcbiAgICAgICAgICAgIC8vIFdoZW4gc3dpdGNoaW5nIGJldHdlZW4gY291bnRyaWVzLCB0aGUgc3RhdGUvcmVnaW9uIGlzIGR5bmFtaWNcclxuICAgICAgICAgICAgLy8gT25seSBwZXJmb3JtIGEgY2hlY2sgZm9yIGFsbCBmaWVsZHMgd2hlbiBjb3VudHJ5IGhhcyBhIHZhbHVlXHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSBhcmVBbGwoJ3ZhbGlkJykgd2lsbCBjaGVjayBjb3VudHJ5IGZvciB2YWxpZGl0eVxyXG4gICAgICAgICAgICBpZiAoJChgJHt0aGlzLnNoaXBwaW5nRXN0aW1hdG9yfSBzZWxlY3RbbmFtZT1cInNoaXBwaW5nLWNvdW50cnlcIl1gKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwcGluZ1ZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hpcHBpbmdWYWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZFZhbGlkYXRpb24oKTtcclxuICAgICAgICB0aGlzLmJpbmRTdGF0ZVZhbGlkYXRpb24oKTtcclxuICAgICAgICB0aGlzLmJpbmRVUFNSYXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRWYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2hpcHBpbmdWYWxpZGF0b3IuYWRkKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGAke3RoaXMuc2hpcHBpbmdFc3RpbWF0b3J9IHNlbGVjdFtuYW1lPVwic2hpcHBpbmctY291bnRyeVwiXWAsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb3VudHJ5SWQgPSBOdW1iZXIodmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjb3VudHJ5SWQgIT09IDAgJiYgIU51bWJlci5pc05hTihjb3VudHJ5SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5zaGlwcGluZ0Vycm9yTWVzc2FnZXMuY291bnRyeSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kU3RhdGVWYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2hpcHBpbmdWYWxpZGF0b3IuYWRkKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICQoYCR7dGhpcy5zaGlwcGluZ0VzdGltYXRvcn0gc2VsZWN0W25hbWU9XCJzaGlwcGluZy1zdGF0ZVwiXWApLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRlbGUgPSAkKGAke3RoaXMuc2hpcHBpbmdFc3RpbWF0b3J9IHNlbGVjdFtuYW1lPVwic2hpcHBpbmctc3RhdGVcIl1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZVZhbCA9ICRlbGUudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBlbGVWYWwgJiYgZWxlVmFsLmxlbmd0aCAmJiBlbGVWYWwgIT09ICdTdGF0ZS9wcm92aW5jZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5zaGlwcGluZ0Vycm9yTWVzc2FnZXMucHJvdmluY2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUb2dnbGUgYmV0d2VlbiBkZWZhdWx0IHNoaXBwaW5nIGFuZCB1cHMgc2hpcHBpbmcgcmF0ZXNcclxuICAgICAqL1xyXG4gICAgYmluZFVQU1JhdGVzKCkge1xyXG4gICAgICAgIGNvbnN0IFVQU1JhdGVUb2dnbGUgPSAnLmVzdGltYXRvci1mb3JtLXRvZ2dsZVVQU1JhdGUnO1xyXG5cclxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgVVBTUmF0ZVRvZ2dsZSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlc3RpbWF0b3JGb3JtVXBzID0gJCgnLmVzdGltYXRvci1mb3JtLS11cHMnKTtcclxuICAgICAgICAgICAgY29uc3QgJGVzdGltYXRvckZvcm1EZWZhdWx0ID0gJCgnLmVzdGltYXRvci1mb3JtLS1kZWZhdWx0Jyk7XHJcblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgJGVzdGltYXRvckZvcm1VcHMudG9nZ2xlQ2xhc3MoJ3UtaGlkZGVuVmlzdWFsbHknKTtcclxuICAgICAgICAgICAgJGVzdGltYXRvckZvcm1EZWZhdWx0LnRvZ2dsZUNsYXNzKCd1LWhpZGRlblZpc3VhbGx5Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYmluZFN0YXRlQ291bnRyeUNoYW5nZSgpIHtcclxuICAgICAgICBsZXQgJGxhc3Q7XHJcblxyXG4gICAgICAgIC8vIFJlcXVlc3RzIHRoZSBzdGF0ZXMgZm9yIGEgY291bnRyeSB3aXRoIEFKQVhcclxuICAgICAgICBzdGF0ZUNvdW50cnkodGhpcy4kc3RhdGUsIHRoaXMuY29udGV4dCwgeyB1c2VJZEZvclN0YXRlczogdHJ1ZSB9LCAoZXJyLCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsLmZpcmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGVycixcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRmaWVsZCA9ICQoZmllbGQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hpcHBpbmdWYWxpZGF0b3IuZ2V0U3RhdHVzKHRoaXMuJHN0YXRlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcHBpbmdWYWxpZGF0b3IucmVtb3ZlKHRoaXMuJHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXBwaW5nVmFsaWRhdG9yLnJlbW92ZSgkbGFzdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkZmllbGQuaXMoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdCA9IGZpZWxkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kU3RhdGVWYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZmllbGQuYXR0cigncGxhY2Vob2xkZXInLCAnU3RhdGUvcHJvdmluY2UnKTtcclxuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMuY2xlYW5VcFN0YXRlVmFsaWRhdGlvbihmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFdoZW4geW91IGNoYW5nZSBhIGNvdW50cnksIHlvdSBzd2FwIHRoZSBzdGF0ZS9wcm92aW5jZSBiZXR3ZWVuIGFuIGlucHV0IGFuZCBhIHNlbGVjdCBkcm9wZG93blxyXG4gICAgICAgICAgICAvLyBOb3QgYWxsIGNvdW50cmllcyByZXF1aXJlIHRoZSBwcm92aW5jZSB0byBiZSBmaWxsZWRcclxuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byByZW1vdmUgdGhpcyBjbGFzcyB3aGVuIHdlIHN3YXAgc2luY2Ugbm9kIHZhbGlkYXRpb24gZG9lc24ndCBjbGVhbnVwIGZvciB1c1xyXG4gICAgICAgICAgICAkKHRoaXMuc2hpcHBpbmdFc3RpbWF0b3IpLmZpbmQoJy5mb3JtLWZpZWxkLS1zdWNjZXNzJykucmVtb3ZlQ2xhc3MoJ2Zvcm0tZmllbGQtLXN1Y2Nlc3MnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVFc3RpbWF0b3JGb3JtU3RhdGUodG9nZ2xlQnV0dG9uLCBidXR0b25TZWxlY3RvciwgJHRvZ2dsZUNvbnRhaW5lcikge1xyXG4gICAgICAgIGNvbnN0IGNoYW5nZUF0dHJpYnV0ZXNPblRvZ2dsZSA9IChzZWxlY3RvclRvQWN0aXZhdGUpID0+IHtcclxuICAgICAgICAgICAgJCh0b2dnbGVCdXR0b24pLmF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIHNlbGVjdG9yVG9BY3RpdmF0ZSk7XHJcbiAgICAgICAgICAgICQoYnV0dG9uU2VsZWN0b3IpLnRleHQoJChgIyR7c2VsZWN0b3JUb0FjdGl2YXRlfWApLnRleHQoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRXN0aW1hdG9yRm9ybU9wZW5lZCkge1xyXG4gICAgICAgICAgICBjaGFuZ2VBdHRyaWJ1dGVzT25Ub2dnbGUoJ2VzdGltYXRvci1jbG9zZScpO1xyXG4gICAgICAgICAgICAkdG9nZ2xlQ29udGFpbmVyLnJlbW92ZUNsYXNzKCd1LWhpZGRlbicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoYW5nZUF0dHJpYnV0ZXNPblRvZ2dsZSgnZXN0aW1hdG9yLWFkZCcpO1xyXG4gICAgICAgICAgICAkdG9nZ2xlQ29udGFpbmVyLmFkZENsYXNzKCd1LWhpZGRlbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzRXN0aW1hdG9yRm9ybU9wZW5lZCA9ICF0aGlzLmlzRXN0aW1hdG9yRm9ybU9wZW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRXN0aW1hdG9yRXZlbnRzKCkge1xyXG4gICAgICAgIGNvbnN0ICRlc3RpbWF0b3JDb250YWluZXIgPSAkKCcuc2hpcHBpbmctZXN0aW1hdG9yJyk7XHJcbiAgICAgICAgY29uc3QgJGVzdGltYXRvckZvcm0gPSAkKCcuZXN0aW1hdG9yLWZvcm0nKTtcclxuICAgICAgICBjb2xsYXBzaWJsZUZhY3RvcnkoKTtcclxuICAgICAgICAkZXN0aW1hdG9yRm9ybS5vbignc3VibWl0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudHJ5X2lkOiAkKCdbbmFtZT1cInNoaXBwaW5nLWNvdW50cnlcIl0nLCAkZXN0aW1hdG9yRm9ybSkudmFsKCksXHJcbiAgICAgICAgICAgICAgICBzdGF0ZV9pZDogJCgnW25hbWU9XCJzaGlwcGluZy1zdGF0ZVwiXScsICRlc3RpbWF0b3JGb3JtKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIGNpdHk6ICQoJ1tuYW1lPVwic2hpcHBpbmctY2l0eVwiXScsICRlc3RpbWF0b3JGb3JtKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHppcF9jb2RlOiAkKCdbbmFtZT1cInNoaXBwaW5nLXppcFwiXScsICRlc3RpbWF0b3JGb3JtKS52YWwoKSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB1dGlscy5hcGkuY2FydC5nZXRTaGlwcGluZ1F1b3RlcyhwYXJhbXMsICdjYXJ0L3NoaXBwaW5nLXF1b3RlcycsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2hpcHBpbmctcXVvdGVzJykuaHRtbChyZXNwb25zZS5jb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBiaW5kIHRoZSBzZWxlY3QgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAkKCcuc2VsZWN0LXNoaXBwaW5nLXF1b3RlJykub24oJ2NsaWNrJywgY2xpY2tFdmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVvdGVJZCA9ICQoJy5zaGlwcGluZy1xdW90ZTpjaGVja2VkJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYXBpLmNhcnQuc3VibWl0U2hpcHBpbmdRdW90ZShxdW90ZUlkLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLnNoaXBwaW5nLWVzdGltYXRlLXNob3cnKS5vbignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRXN0aW1hdG9yRm9ybVN0YXRlKGV2ZW50LmN1cnJlbnRUYXJnZXQsICcuc2hpcHBpbmctZXN0aW1hdGUtc2hvd19fYnRuLW5hbWUnLCAkZXN0aW1hdG9yQ29udGFpbmVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnQGJpZ2NvbW1lcmNlL3N0ZW5jaWwtdXRpbHMnO1xyXG5pbXBvcnQgUHJvZHVjdERldGFpbHNCYXNlLCB7IG9wdGlvbkNoYW5nZURlY29yYXRvciB9IGZyb20gJy4vcHJvZHVjdC1kZXRhaWxzLWJhc2UnO1xyXG5pbXBvcnQgeyBpc0VtcHR5IH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgaXNCcm93c2VySUUsIGNvbnZlcnRJbnRvQXJyYXkgfSBmcm9tICcuL3V0aWxzL2llLWhlbHBlcnMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FydEl0ZW1EZXRhaWxzIGV4dGVuZHMgUHJvZHVjdERldGFpbHNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgY29udGV4dCwgcHJvZHVjdEF0dHJpYnV0ZXNEYXRhID0ge30pIHtcclxuICAgICAgICBzdXBlcigkc2NvcGUsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICBjb25zdCAkZm9ybSA9ICQoJyNDYXJ0RWRpdFByb2R1Y3RGaWVsZHNGb3JtJywgdGhpcy4kc2NvcGUpO1xyXG4gICAgICAgIGNvbnN0ICRwcm9kdWN0T3B0aW9uc0VsZW1lbnQgPSAkKCdbZGF0YS1wcm9kdWN0LWF0dHJpYnV0ZXMtd3JhcHBlcl0nLCAkZm9ybSk7XHJcbiAgICAgICAgY29uc3QgaGFzT3B0aW9ucyA9ICRwcm9kdWN0T3B0aW9uc0VsZW1lbnQuaHRtbCgpLnRyaW0oKS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgaGFzRGVmYXVsdE9wdGlvbnMgPSAkcHJvZHVjdE9wdGlvbnNFbGVtZW50LmZpbmQoJ1tkYXRhLWRlZmF1bHRdJykubGVuZ3RoO1xyXG5cclxuICAgICAgICAkcHJvZHVjdE9wdGlvbnNFbGVtZW50Lm9uKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvZHVjdFZhcmlhbnQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBvcHRpb25DaGFuZ2VEZWNvcmF0b3IuY2FsbCh0aGlzLCBoYXNEZWZhdWx0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBwcm9kdWN0IGF0dHJpYnV0ZXMuIEFsc28gdXBkYXRlIHRoZSBpbml0aWFsIHZpZXcgaW4gY2FzZSBpdGVtcyBhcmUgb29zXHJcbiAgICAgICAgLy8gb3IgaGF2ZSBkZWZhdWx0IHZhcmlhbnQgcHJvcGVydGllcyB0aGF0IGNoYW5nZSB0aGUgdmlld1xyXG4gICAgICAgIGlmICgoaXNFbXB0eShwcm9kdWN0QXR0cmlidXRlc0RhdGEpIHx8IGhhc0RlZmF1bHRPcHRpb25zKSAmJiBoYXNPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9IHRoaXMuY29udGV4dC5wcm9kdWN0Rm9yQ2hhbmdlSWQ7XHJcblxyXG4gICAgICAgICAgICB1dGlscy5hcGkucHJvZHVjdEF0dHJpYnV0ZXMub3B0aW9uQ2hhbmdlKHByb2R1Y3RJZCwgJGZvcm0uc2VyaWFsaXplKCksICdwcm9kdWN0cy9idWxrLWRpc2NvdW50LXJhdGVzJywgb3B0aW9uQ2hhbmdlQ2FsbGJhY2spO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZHVjdEF0dHJpYnV0ZXMocHJvZHVjdEF0dHJpYnV0ZXNEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvZHVjdFZhcmlhbnQoKSB7XHJcbiAgICAgICAgY29uc3QgdW5zYXRpc2ZpZWRSZXF1aXJlZEZpZWxkcyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICAgICAgJC5lYWNoKCQoJ1tkYXRhLXByb2R1Y3QtYXR0cmlidXRlXScpLCAoaW5kZXgsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gdmFsdWUuY2hpbGRyZW5bMF0uaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25UaXRsZSA9IG9wdGlvbkxhYmVsLnNwbGl0KCc6JylbMF0udHJpbSgpO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1aXJlZCA9IG9wdGlvbkxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3JlcXVpcmVkJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB2YWx1ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdC1hdHRyaWJ1dGUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgodHlwZSA9PT0gJ2lucHV0LWZpbGUnIHx8IHR5cGUgPT09ICdpbnB1dC10ZXh0JyB8fCB0eXBlID09PSAnaW5wdXQtbnVtYmVyJykgJiYgdmFsdWUucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZSA9PT0gJycgJiYgcmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgIHVuc2F0aXNmaWVkUmVxdWlyZWRGaWVsZHMucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAndGV4dGFyZWEnICYmIHZhbHVlLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJykudmFsdWUgPT09ICcnICYmIHJlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNhdGlzZmllZFJlcXVpcmVkRmllbGRzLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1NhdGlzZmllZCA9IEFycmF5LmZyb20odmFsdWUucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0JykpLmV2ZXJ5KChzZWxlY3QpID0+IHNlbGVjdC5zZWxlY3RlZEluZGV4ICE9PSAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNTYXRpc2ZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gQXJyYXkuZnJvbSh2YWx1ZS5xdWVyeVNlbGVjdG9yQWxsKCdzZWxlY3QnKSkubWFwKCh4KSA9PiB4LnZhbHVlKS5qb2luKCctJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wdXNoKGAke29wdGlvblRpdGxlfToke2RhdGVTdHJpbmd9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB1bnNhdGlzZmllZFJlcXVpcmVkRmllbGRzLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3NldC1zZWxlY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3QgPSB2YWx1ZS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBzZWxlY3Quc2VsZWN0ZWRJbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChgJHtvcHRpb25UaXRsZX06JHtzZWxlY3Qub3B0aW9uc1tzZWxlY3RlZEluZGV4XS5pbm5lclRleHR9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB1bnNhdGlzZmllZFJlcXVpcmVkRmllbGRzLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3NldC1yZWN0YW5nbGUnIHx8IHR5cGUgPT09ICdzZXQtcmFkaW8nIHx8IHR5cGUgPT09ICdzd2F0Y2gnIHx8IHR5cGUgPT09ICdpbnB1dC1jaGVja2JveCcgfHwgdHlwZSA9PT0gJ3Byb2R1Y3QtbGlzdCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSB2YWx1ZS5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRTZWxlY3RlZE9wdGlvbkxhYmVsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0VmFyaWFudHNsaXN0ID0gY29udmVydEludG9BcnJheSh2YWx1ZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoTGFiZWxGb3JDaGVja2VkSW5wdXQgPSBpbnB0ID0+IGlucHQuZGF0YXNldC5wcm9kdWN0QXR0cmlidXRlVmFsdWUgPT09IGNoZWNrZWQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWN0VmFyaWFudHNsaXN0LmZpbHRlcihtYXRjaExhYmVsRm9yQ2hlY2tlZElucHV0KVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnc2V0LXJlY3RhbmdsZScgfHwgdHlwZSA9PT0gJ3NldC1yYWRpbycgfHwgdHlwZSA9PT0gJ3Byb2R1Y3QtbGlzdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBpc0Jyb3dzZXJJRSA/IGdldFNlbGVjdGVkT3B0aW9uTGFiZWwoKS5pbm5lclRleHQudHJpbSgpIDogY2hlY2tlZC5sYWJlbHNbMF0uaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChgJHtvcHRpb25UaXRsZX06JHtsYWJlbH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdzd2F0Y2gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gaXNCcm93c2VySUUgPyBnZXRTZWxlY3RlZE9wdGlvbkxhYmVsKCkuY2hpbGRyZW5bMF0gOiBjaGVja2VkLmxhYmVsc1swXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnB1c2goYCR7b3B0aW9uVGl0bGV9OiR7bGFiZWwudGl0bGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQtY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChgJHtvcHRpb25UaXRsZX06WWVzYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dC1jaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnB1c2goYCR7b3B0aW9uVGl0bGV9Ok5vYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5zYXRpc2ZpZWRSZXF1aXJlZEZpZWxkcy5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgcHJvZHVjdFZhcmlhbnQgPSB1bnNhdGlzZmllZFJlcXVpcmVkRmllbGRzLmxlbmd0aCA9PT0gMCA/IG9wdGlvbnMuc29ydCgpLmpvaW4oJywgJykgOiAndW5zYXRpc2ZpZWQnO1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSAkKCcubW9kYWwtaGVhZGVyLXRpdGxlJyk7XHJcblxyXG4gICAgICAgIGlmIChwcm9kdWN0VmFyaWFudCkge1xyXG4gICAgICAgICAgICBwcm9kdWN0VmFyaWFudCA9IHByb2R1Y3RWYXJpYW50ID09PSAndW5zYXRpc2ZpZWQnID8gJycgOiBwcm9kdWN0VmFyaWFudDtcclxuICAgICAgICAgICAgaWYgKHZpZXcuYXR0cignZGF0YS1ldmVudC10eXBlJykpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuYXR0cignZGF0YS1wcm9kdWN0LXZhcmlhbnQnLCBwcm9kdWN0VmFyaWFudCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0TmFtZSA9IHZpZXcuaHRtbCgpLm1hdGNoKC8nKC4qPyknLylbMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkID0gJChgW2RhdGEtbmFtZT1cIiR7cHJvZHVjdE5hbWV9XCJdYCk7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmF0dHIoJ2RhdGEtcHJvZHVjdC12YXJpYW50JywgcHJvZHVjdFZhcmlhbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGlkZSBvciBtYXJrIGFzIHVuYXZhaWxhYmxlIG91dCBvZiBzdG9jayBhdHRyaWJ1dGVzIGlmIGVuYWJsZWRcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBQcm9kdWN0IGF0dHJpYnV0ZSBkYXRhXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVByb2R1Y3RBdHRyaWJ1dGVzKGRhdGEpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVQcm9kdWN0QXR0cmlidXRlcyhkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy4kc2NvcGUuZmluZCgnLm1vZGFsLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnaGlkZS1jb250ZW50Jyk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNlcnQpIHtcclxuICAgIGlmICh0eXBlb2YgY2VydCAhPT0gJ3N0cmluZycgfHwgY2VydC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGFueSBjdXN0b20gZ2lmdCBjZXJ0aWZpY2F0ZSB2YWxpZGF0aW9uIGxvZ2ljIGhlcmVcclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbiIsImltcG9ydCB1dGlscyBmcm9tICdAYmlnY29tbWVyY2Uvc3RlbmNpbC11dGlscyc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IGluc2VydFN0YXRlSGlkZGVuRmllbGQgfSBmcm9tICcuL3V0aWxzL2Zvcm0tdXRpbHMnO1xyXG5pbXBvcnQgeyBzaG93QWxlcnRNb2RhbCB9IGZyb20gJy4uL2dsb2JhbC9tb2RhbCc7XHJcblxyXG4vKipcclxuICogSWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgZnJvbSBiY2FwcCwgYSB0ZXh0IGZpZWxkIHdpbGwgYmUgc2VudC4gVGhpcyB3aWxsIGNyZWF0ZSBhIHNlbGVjdCBlbGVtZW50IHRvIGhvbGQgb3B0aW9ucyBhZnRlciB0aGUgcmVtb3RlIHJlcXVlc3QuXHJcbiAqIEByZXR1cm5zIHtqUXVlcnl8SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlU3RhdGVSZXF1aXJlZChzdGF0ZUVsZW1lbnQsIGNvbnRleHQpIHtcclxuICAgIGNvbnN0IGF0dHJzID0gXy50cmFuc2Zvcm0oc3RhdGVFbGVtZW50LnByb3AoJ2F0dHJpYnV0ZXMnKSwgKHJlc3VsdCwgaXRlbSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcclxuICAgICAgICByZXRbaXRlbS5uYW1lXSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlcGxhY2VtZW50QXR0cmlidXRlcyA9IHtcclxuICAgICAgICBpZDogYXR0cnMuaWQsXHJcbiAgICAgICAgJ2RhdGEtbGFiZWwnOiBhdHRyc1snZGF0YS1sYWJlbCddLFxyXG4gICAgICAgIGNsYXNzOiAnZm9ybS1zZWxlY3QnLFxyXG4gICAgICAgIG5hbWU6IGF0dHJzLm5hbWUsXHJcbiAgICAgICAgJ2RhdGEtZmllbGQtdHlwZSc6IGF0dHJzWydkYXRhLWZpZWxkLXR5cGUnXSxcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGVFbGVtZW50LnJlcGxhY2VXaXRoKCQoJzxzZWxlY3Q+PC9zZWxlY3Q+JywgcmVwbGFjZW1lbnRBdHRyaWJ1dGVzKSk7XHJcblxyXG4gICAgY29uc3QgJG5ld0VsZW1lbnQgPSAkKCdbZGF0YS1maWVsZC10eXBlPVwiU3RhdGVcIl0nKTtcclxuICAgIGNvbnN0ICRoaWRkZW5JbnB1dCA9ICQoJ1tuYW1lKj1cIkZvcm1GaWVsZElzVGV4dFwiXScpO1xyXG5cclxuICAgIGlmICgkaGlkZGVuSW5wdXQubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgJGhpZGRlbklucHV0LnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkbmV3RWxlbWVudC5wcmV2KCkuZmluZCgnc21hbGwnKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAvLyBTdHJpbmcgaXMgaW5qZWN0ZWQgZnJvbSBsb2NhbGl6ZXJcclxuICAgICAgICAkbmV3RWxlbWVudC5wcmV2KCkuYXBwZW5kKGA8c21hbGw+JHtjb250ZXh0LnJlcXVpcmVkfTwvc21hbGw+YCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRuZXdFbGVtZW50LnByZXYoKS5maW5kKCdzbWFsbCcpLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG5ld0VsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJZiBhIGNvdW50cnkgd2l0aCBzdGF0ZXMgaXMgdGhlIGRlZmF1bHQsIGEgc2VsZWN0IHdpbGwgYmUgc2VudCxcclxuICogSW4gdGhpcyBjYXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBzd2l0Y2ggdG8gYW4gaW5wdXQgZmllbGQgYW5kIGhpZGUgdGhlIHJlcXVpcmVkIGZpZWxkXHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlU3RhdGVPcHRpb25hbChzdGF0ZUVsZW1lbnQpIHtcclxuICAgIGNvbnN0IGF0dHJzID0gXy50cmFuc2Zvcm0oc3RhdGVFbGVtZW50LnByb3AoJ2F0dHJpYnV0ZXMnKSwgKHJlc3VsdCwgaXRlbSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcclxuICAgICAgICByZXRbaXRlbS5uYW1lXSA9IGl0ZW0udmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXBsYWNlbWVudEF0dHJpYnV0ZXMgPSB7XHJcbiAgICAgICAgdHlwZTogJ3RleHQnLFxyXG4gICAgICAgIGlkOiBhdHRycy5pZCxcclxuICAgICAgICAnZGF0YS1sYWJlbCc6IGF0dHJzWydkYXRhLWxhYmVsJ10sXHJcbiAgICAgICAgY2xhc3M6ICdmb3JtLWlucHV0JyxcclxuICAgICAgICBuYW1lOiBhdHRycy5uYW1lLFxyXG4gICAgICAgICdkYXRhLWZpZWxkLXR5cGUnOiBhdHRyc1snZGF0YS1maWVsZC10eXBlJ10sXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRlRWxlbWVudC5yZXBsYWNlV2l0aCgkKCc8aW5wdXQgLz4nLCByZXBsYWNlbWVudEF0dHJpYnV0ZXMpKTtcclxuXHJcbiAgICBjb25zdCAkbmV3RWxlbWVudCA9ICQoJ1tkYXRhLWZpZWxkLXR5cGU9XCJTdGF0ZVwiXScpO1xyXG5cclxuICAgIGlmICgkbmV3RWxlbWVudC5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkKCRuZXdFbGVtZW50KTtcclxuICAgICAgICAkbmV3RWxlbWVudC5wcmV2KCkuZmluZCgnc21hbGwnKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRuZXdFbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyB0aGUgYXJyYXkgb2Ygb3B0aW9ucyBmcm9tIHRoZSByZW1vdGUgcmVxdWVzdCB0byB0aGUgbmV3bHkgY3JlYXRlZCBzZWxlY3QgYm94LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVzQXJyYXlcclxuICogQHBhcmFtIHtqUXVlcnl9ICRzZWxlY3RFbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGRPcHRpb25zKHN0YXRlc0FycmF5LCAkc2VsZWN0RWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gW107XHJcblxyXG4gICAgY29udGFpbmVyLnB1c2goYDxvcHRpb24gdmFsdWU9XCJcIj4ke3N0YXRlc0FycmF5LnByZWZpeH08L29wdGlvbj5gKTtcclxuXHJcbiAgICBpZiAoIV8uaXNFbXB0eSgkc2VsZWN0RWxlbWVudCkpIHtcclxuICAgICAgICBfLmVhY2goc3RhdGVzQXJyYXkuc3RhdGVzLCAoc3RhdGVPYmopID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudXNlSWRGb3JTdGF0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKGA8b3B0aW9uIHZhbHVlPVwiJHtzdGF0ZU9iai5pZH1cIj4ke3N0YXRlT2JqLm5hbWV9PC9vcHRpb24+YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaChgPG9wdGlvbiB2YWx1ZT1cIiR7c3RhdGVPYmoubmFtZX1cIj4ke3N0YXRlT2JqLmxhYmVsID8gc3RhdGVPYmoubGFiZWwgOiBzdGF0ZU9iai5uYW1lfTwvb3B0aW9uPmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzZWxlY3RFbGVtZW50Lmh0bWwoY29udGFpbmVyLmpvaW4oJyAnKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0ge2pRdWVyeX0gc3RhdGVFbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoc3RhdGVFbGVtZW50LCBjb250ZXh0ID0ge30sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICAvKipcclxuICAgICAqIEJhY2t3YXJkcyBjb21wYXRpYmxlIGZvciB0aHJlZSBwYXJhbWV0ZXJzIGluc3RlYWQgb2YgZm91clxyXG4gICAgICpcclxuICAgICAqIEF2YWlsYWJsZSBvcHRpb25zOlxyXG4gICAgICpcclxuICAgICAqIHVzZUlkRm9yU3RhdGVzIHtCb29sfSAtIEdlbmVyYXRlcyBzdGF0ZXMgZHJvcGRvd24gdXNpbmcgaWQgZm9yIHZhbHVlcyBpbnN0ZWFkIG9mIHN0cmluZ3NcclxuICAgICAqL1xyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cclxuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cclxuICAgIH1cclxuXHJcbiAgICAkKCdzZWxlY3RbZGF0YS1maWVsZC10eXBlPVwiQ291bnRyeVwiXScpLm9uKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgY29uc3QgY291bnRyeU5hbWUgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoY291bnRyeU5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWxzLmFwaS5jb3VudHJ5LmdldEJ5TmFtZShjb3VudHJ5TmFtZSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgc2hvd0FsZXJ0TW9kYWwoY29udGV4dC5zdGF0ZV9lcnJvcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgJGN1cnJlbnRJbnB1dCA9ICQoJ1tkYXRhLWZpZWxkLXR5cGU9XCJTdGF0ZVwiXScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkocmVzcG9uc2UuZGF0YS5zdGF0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudCBtYXkgaGF2ZSBiZWVuIHJlcGxhY2VkIHdpdGggYSBzZWxlY3QsIHJlc2VsZWN0IGl0XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkc2VsZWN0RWxlbWVudCA9IG1ha2VTdGF0ZVJlcXVpcmVkKCRjdXJyZW50SW5wdXQsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFkZE9wdGlvbnMocmVzcG9uc2UuZGF0YSwgJHNlbGVjdEVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgJHNlbGVjdEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RWxlbWVudCA9IG1ha2VTdGF0ZU9wdGlvbmFsKCRjdXJyZW50SW5wdXQsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0VsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJjb25zdCBUUkFOU0xBVElPTlMgPSAndHJhbnNsYXRpb25zJztcclxuY29uc3QgaXNUcmFuc2xhdGlvbkRpY3Rpb25hcnlOb3RFbXB0eSA9IChkaWN0aW9uYXJ5KSA9PiAhIU9iamVjdC5rZXlzKGRpY3Rpb25hcnlbVFJBTlNMQVRJT05TXSkubGVuZ3RoO1xyXG5jb25zdCBjaG9vc2VBY3RpdmVEaWN0aW9uYXJ5ID0gKC4uLmRpY3Rpb25hcnlKc29uTGlzdCkgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWN0aW9uYXJ5SnNvbkxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBkaWN0aW9uYXJ5ID0gSlNPTi5wYXJzZShkaWN0aW9uYXJ5SnNvbkxpc3RbaV0pO1xyXG4gICAgICAgIGlmIChpc1RyYW5zbGF0aW9uRGljdGlvbmFyeU5vdEVtcHR5KGRpY3Rpb25hcnkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkaWN0aW9uYXJ5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBkZWZpbmVzIFRyYW5zbGF0aW9uIERpY3Rpb25hcnkgdG8gdXNlXHJcbiAqIEBwYXJhbSBjb250ZXh0IHByb3ZpZGVzIGFjY2VzcyB0byAzIHZhbGlkYXRpb24gSlNPTnMgZnJvbSBlbi5qc29uOlxyXG4gKiB2YWxpZGF0aW9uX21lc3NhZ2VzLCB2YWxpZGF0aW9uX2ZhbGxiYWNrX21lc3NhZ2VzIGFuZCBkZWZhdWx0X21lc3NhZ2VzXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlVHJhbnNsYXRpb25EaWN0aW9uYXJ5ID0gKGNvbnRleHQpID0+IHtcclxuICAgIGNvbnN0IHsgdmFsaWRhdGlvbkRpY3Rpb25hcnlKU09OLCB2YWxpZGF0aW9uRmFsbGJhY2tEaWN0aW9uYXJ5SlNPTiwgdmFsaWRhdGlvbkRlZmF1bHREaWN0aW9uYXJ5SlNPTiB9ID0gY29udGV4dDtcclxuICAgIGNvbnN0IGFjdGl2ZURpY3Rpb25hcnkgPSBjaG9vc2VBY3RpdmVEaWN0aW9uYXJ5KHZhbGlkYXRpb25EaWN0aW9uYXJ5SlNPTiwgdmFsaWRhdGlvbkZhbGxiYWNrRGljdGlvbmFyeUpTT04sIHZhbGlkYXRpb25EZWZhdWx0RGljdGlvbmFyeUpTT04pO1xyXG4gICAgY29uc3QgbG9jYWxpemF0aW9ucyA9IE9iamVjdC52YWx1ZXMoYWN0aXZlRGljdGlvbmFyeVtUUkFOU0xBVElPTlNdKTtcclxuICAgIGNvbnN0IHRyYW5zbGF0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGFjdGl2ZURpY3Rpb25hcnlbVFJBTlNMQVRJT05TXSkubWFwKGtleSA9PiBrZXkuc3BsaXQoJy4nKS5wb3AoKSk7XHJcblxyXG4gICAgcmV0dXJuIHRyYW5zbGF0aW9uS2V5cy5yZWR1Y2UoKGFjYywga2V5LCBpKSA9PiB7XHJcbiAgICAgICAgYWNjW2tleV0gPSBsb2NhbGl6YXRpb25zW2ldO1xyXG4gICAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=