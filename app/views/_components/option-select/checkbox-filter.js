/* eslint-env jquery */

AppFrontend.CheckboxFilter = function(params) {
  this.container = $(params.container)
  this.$options = this.container.find("input[type='checkbox']")
  this.$optionsContainer = this.container.find('.app-option-select__container')
  this.$optionList = this.$optionsContainer.children('.js-auto-height-inner')
  this.$allCheckboxes = this.$optionsContainer.find('.govuk-checkboxes__item')

  // to do - inject HTML here, not from Nunjucks?
  this.filterInputHtml = this.container.data('filter-element')
  this.checkedCheckboxes = []

  var filterEl = document.createElement('div')
  filterEl.innerHTML = this.filterInputHtml

  $('<div class="app-option-select__filter"/>')
    .html(filterEl.childNodes[0].nodeValue)
    .insertBefore(this.$optionsContainer)

  this.$filter = this.container.find('input[name="option-select-filter"]')
  this.$filterCount = $('#' + this.$filter.attr('aria-describedby'))
  this.checkboxLabels = []

  // this actually sets a property
  // clean this whole section up
  this.getAllCheckedCheckboxes()
  this.$allCheckboxes.each($.proxy(function (index, checkbox) {
    this.checkboxLabels.push(this.cleanString($(checkbox).text()))
  }, this))

  this.$filter.on('keyup', $.proxy(this, 'onTextBoxKeyUp'))

  this.setupHeight()

  // inject status
  this.setupStatusBox();
}

AppFrontend.CheckboxFilter.prototype.setupStatusBox = function() {
  this.statusBox = $('<div class="govuk-visually-hidde" role="status" id="'+this.container[0].id+'-checkboxes-status"></div>')
  this.updateStatusBox({
    foundCount: this.getCheckboxesCount(),
    checkedCount: this.getCheckedCheckboxesCount()
  })
  this.container.append(this.statusBox);
}

AppFrontend.CheckboxFilter.prototype.updateStatusBox = function(params) {
  var status = '%found% options found, %selected% selected';
  status = status.replace(/%found%/, params.foundCount);
  status = status.replace(/%selected%/, params.checkedCount);
  this.statusBox.html(status);
}

AppFrontend.CheckboxFilter.prototype.onTextBoxKeyUp = function onTextBoxKeyUp(e) {
  var ENTER_KEY = 13
  if (e.keyCode === ENTER_KEY) {
    e.preventDefault();
  } else {
    this.filterCheckboxes()
  }
}

AppFrontend.CheckboxFilter.prototype.cleanString = function cleanString (text) {
  text = text.replace(/&/g, 'and')
  text = text.replace(/[’',:–-]/g, '') // remove punctuation characters
  text = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape special characters
  return text.trim().replace(/\s\s+/g, ' ').toLowerCase() // replace multiple spaces with one
}

AppFrontend.CheckboxFilter.prototype.getAllCheckedCheckboxes = function getAllCheckedCheckboxes () {
  this.checkedCheckboxes = []
  var that = this

  this.$allCheckboxes.each(function (i) {
    if ($(this).find('input[type=checkbox]').is(':checked')) {
      that.checkedCheckboxes.push(i)
    }
  })
}

AppFrontend.CheckboxFilter.prototype.filterCheckboxes = function filterCheckboxes() {
  var filterBy = this.cleanString(this.$filter.val())
  var showCheckboxes = this.checkedCheckboxes.slice()

  for (var i = 0; i < this.$allCheckboxes.length; i++) {
    if (showCheckboxes.indexOf(i) === -1 && this.checkboxLabels[i].search(filterBy) !== -1) {
      showCheckboxes.push(i)
    }
  }

  this.$allCheckboxes.hide()
  for (var j = 0; j < showCheckboxes.length; j++) {
    this.$allCheckboxes.eq(showCheckboxes[j]).show()
  }

  var checkboxesFound = showCheckboxes.length || 0
  var checkboxesChecked = this.$optionsContainer.find('.govuk-checkboxes__input:checked').length
  this.updateStatusBox({
    foundCount: checkboxesFound,
    checkedCount: checkboxesChecked
  })
}

AppFrontend.CheckboxFilter.prototype.getCheckboxesCount = function() {
  var checkboxes = this.$optionsContainer.find('.govuk-checkboxes__input')

  var checkboxesShowing = checkboxes.filter(function(i, el) {
    if(el.parentNode.style.display && el.parentNode.style.display == 'none') {
      return false
    } else {
      return true
    }
  })

  return checkboxesShowing.length;
}

AppFrontend.CheckboxFilter.prototype.getCheckedCheckboxesCount = function() {
  return this.$optionsContainer.find('.govuk-checkboxes__input:checked').filter(function(index, el) {
    if(el.parentNode.style.display && el.parentNode.style.display == 'none') {
      return false
    } else {
      return true
    }
  }).length
}

AppFrontend.CheckboxFilter.prototype.setContainerHeight = function setContainerHeight (height) {
  this.$optionsContainer.css({
    height: height
  })
}

AppFrontend.CheckboxFilter.prototype.isCheckboxVisible = function isCheckboxVisible (index, option) {
  var $checkbox = $(option)
  var initialOptionContainerHeight = this.$optionsContainer.height()
  var optionListOffsetTop = this.$optionList.offset().top
  var distanceFromTopOfContainer = $checkbox.offset().top - optionListOffsetTop
  return distanceFromTopOfContainer < initialOptionContainerHeight
}

AppFrontend.CheckboxFilter.prototype.getVisibleCheckboxes = function getVisibleCheckboxes () {
  var visibleCheckboxes = this.$options.filter(this.isCheckboxVisible.bind(this))
  // add an extra checkbox, if the label of the first is too long it collapses onto itself
  visibleCheckboxes = visibleCheckboxes.add(this.$options[visibleCheckboxes.length])
  return visibleCheckboxes
}

AppFrontend.CheckboxFilter.prototype.setupHeight = function setupHeight () {
  var initialOptionContainerHeight = this.$optionsContainer.height()
  var height = this.$optionList.outerHeight(true)

  // check whether this is hidden by progressive disclosure,
  // because height calculations won't work
  if (this.$optionsContainer[0].offsetParent === null) {
    initialOptionContainerHeight = 200
    height = 200
  }

  // Resize if the list is only slightly bigger than its container
  if (height < initialOptionContainerHeight + 50) {
    this.setContainerHeight(height + 1)
    return
  }

  // Resize to cut last item cleanly in half
  var lastVisibleCheckbox = this.getVisibleCheckboxes().last()
  var position = lastVisibleCheckbox.parent()[0].offsetTop // parent element is relative
  this.setContainerHeight(position + (lastVisibleCheckbox.height() / 1.5))
}
