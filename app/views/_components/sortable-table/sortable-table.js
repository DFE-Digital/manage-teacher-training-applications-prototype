AppFrontend.SortableTable = function(params) {
	this.table = $(params.table);
	this.setupOptions(params);
	this.body = this.table.find('tbody');
	this.createHeadingButtons();
	this.createStatusBox();
	this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'));
};

AppFrontend.SortableTable.prototype.setupOptions = function(params) {
	params = params || {};
	this.statusMessage = params.statusMessage || 'Sort by %heading% (%direction%)';
	this.ascendingText = params.ascendingText || 'ascending';
	this.descendingText = params.descendingText || 'descending';
};

AppFrontend.SortableTable.prototype.createHeadingButtons = function() {
	var headings = this.table.find('thead th');
	var heading;
	for(var i = 0; i < headings.length; i++) {
		heading = $(headings[i]);
		if(heading.attr('aria-sort')) {
			this.createHeadingButton(heading, i);
		}
	}
};

AppFrontend.SortableTable.prototype.createHeadingButton = function(heading, i) {
	var text = heading.text();
	var button = $('<button type="button" data-index="'+i+'">'+text+'</button>');
	heading.text('');
	heading.append(button);
};

AppFrontend.SortableTable.prototype.createStatusBox = function() {
	this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />');
	this.table.parent().append(this.status);
};

AppFrontend.SortableTable.prototype.onSortButtonClick = function(e) {
	var columnNumber = e.currentTarget.getAttribute('data-index');
	var sortDirection = $(e.currentTarget).parent().attr('aria-sort');
	var newSortDirection;
	if(sortDirection === 'none' || sortDirection === 'descending') {
		newSortDirection = 'ascending';
	} else {
		newSortDirection = 'descending';
	}
	var rows = this.getTableRowsArray();
	var sortedRows = this.sort(rows, columnNumber, newSortDirection);
	this.addRows(sortedRows);
	this.removeButtonStates();
	this.updateButtonState($(e.currentTarget), newSortDirection);
};

AppFrontend.SortableTable.prototype.updateButtonState = function(button, direction) {
	button.parent().attr('aria-sort', direction);
	var message = this.statusMessage;
	message = message.replace(/%heading%/, button.text());
	message = message.replace(/%direction%/, this[direction+'Text']);
	this.status.text(message);
};

AppFrontend.SortableTable.prototype.removeButtonStates = function() {
	this.table.find('thead th').attr('aria-sort', 'none');
};

AppFrontend.SortableTable.prototype.addRows = function(rows) {
	for(var i = 0; i < rows.length; i++) {
		this.body.append(rows[i]);
	}
};

AppFrontend.SortableTable.prototype.getTableRowsArray = function() {
	var rows = [];
	var trs = this.body.find('tr');
	for (var i = 0; i < trs.length; i++) {
		rows.push(trs[i]);
	}
    return rows;
};

AppFrontend.SortableTable.prototype.sort = function(rows, columnNumber, sortDirection) {
	var newRows = rows.sort($.proxy(function(rowA, rowB) {
		var tdA = $(rowA).find('td').eq(columnNumber);
		var tdB = $(rowB).find('td').eq(columnNumber);
		var valueA = this.getCellValue(tdA);
		var valueB = this.getCellValue(tdB);
		if(sortDirection === 'ascending') {
			if(valueA < valueB) {
				return -1;
			}
			if(valueA > valueB) {
				return 1;
			}
			return 0;
		} else {
			if(valueB < valueA) {
				return -1;
			}
			if(valueB > valueA) {
				return 1;
			}
			return 0;
		}
	}, this));
	return newRows;
};

AppFrontend.SortableTable.prototype.getCellValue = function(cell) {
	var val = cell.attr('data-sort-value');
	val = val || cell.html();
	if($.isNumeric(val)) {
		val = parseInt(val, 10);
	}
	return val;
};
