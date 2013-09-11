// Generated by CoffeeScript 1.6.3
/*
TableView
---------
*/


/*
A View that can be used with any backbone collection, and draws a table with it.
Optionally it supports pagination, search, and any number of filters
("inputs", "button", "option"). Eg (Users is a Backbone.Collection):

    class UserTableView extends Backbone.TableView
        title: "My Users Table"
        collection: new Users()
        columns:
            name:
                header: "My Name"
            type:
                header: "Type"
            last_login:
                header: "Last Login Time"
                draw: (model) ->
                    new Date(model.get 'time')
        pagination: true
        search:
            query: "name"
            detail: "Search by Name"
        filters:
            from:
                type: "input"
                className: "date"
                init: new Date()
                get: (val) ->
                    ... process the date val ...
            my_button:
                type: "button"
            status:
                type: "option"
                options: ["all", "valid", "invalid"]
*/


(function() {
  var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Backbone.TableView = (function(_super) {
    __extends(TableView, _super);

    function TableView() {
      this.hideLoading = __bind(this.hideLoading, this);
      this.showLoadingNow = __bind(this.showLoadingNow, this);
      this.showLoading = __bind(this.showLoading, this);
      this.render = __bind(this.render, this);
      this.toggleSort = __bind(this.toggleSort, this);
      this.nextPage = __bind(this.nextPage, this);
      this.prevPage = __bind(this.prevPage, this);
      this.toPage = __bind(this.toPage, this);
      this.changeSize = __bind(this.changeSize, this);
      this.renderData = __bind(this.renderData, this);
      this.refreshPagination = __bind(this.refreshPagination, this);
      this.update = __bind(this.update, this);
      this.updateUrl = __bind(this.updateUrl, this);
      this.updateSearch = __bind(this.updateSearch, this);
      this.createFilter = __bind(this.createFilter, this);
      this.setData = __bind(this.setData, this);
      _ref = TableView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TableView.prototype.tagName = "div";

    TableView.prototype.titleTemplate = _.template("<div class=\"<%= classSize %>\">\n    <h4 class=\"<%= model.className || \"\" %>\"><%= model.name || model %></h4>\n</div>");

    TableView.prototype.filtersTemplate = _.template("<div class=\"filters controls tableview-center <%= classSize %>\" />");

    TableView.prototype.searchTemplate = _.template("<div class=\"<%= classSize %> form-group\">\n    <input type=\"text\" class=\"search-query form-control input-block-level pull-right\" placeholder=\"<%= model.detail || model %>\" value=\"<%- data[model.query || \"q\"] || \"\" %>\"></input>\n</div>");

    TableView.prototype.paginationTemplate = _.template("<div class=\"row\">\n    <div class=\"span3 col-lg-3\">\n        <div class=\"tableview-info\">Showing <%= from %> to <%= to %><%= total %></div>\n    </div>\n    <div class=\"span9 col-lg-9\">\n        <div class=\"pagination tableview-pagination\">\n            <ul class=\"pagination\">\n                <li class=\"pager-prev <%= prevDisabled %>\"><a href=\"javascript:void(0)\">← Previous</a></li>\n                <% _.each(pages, function (page) { %>\n                    <li class=\"pager-page <%= page.active %>\"><a href=\"javascript:void(0)\"><%= page.value %></a></li>\n                <% }) %>\n                <li class=\"pager-next <%= nextDisabled %>\"><a href=\"javascript:void(0)\">Next → </a></li>\n            </ul>\n        </div>\n        <div class=\"pagination tableview-size\">\n            <ul class=\"pagination\">\n                <li class=\"disabled\"><a>Size</a></li>\n                <% _.each(sizes, function (size) { %>\n                    <li class=\"pager-size <%= size.active %>\"><a href=\"javascript:void(0)\"><%= size.value %></a></li>\n                <% }) %>\n            </ul>\n        </div>\n    </div>\n</div>");

    TableView.prototype.emptyTemplate = _.template("<tr><td colspan=\"10\"><%= text %></td></tr>");

    TableView.prototype.columnsTemplate = _.template("<% _.each(model, function (col, key) { %>\n    <% if (!col.noshow) { %>\n        <th abbr=\"<%= key || col %>\"\n         class=\"<%= !col.nosort && !self.nosort ? \"tableview-sorting\" : \"\" %> <%= ((key || col) == data.sort_col) ? \"tableview-sorting-\" + data.sort_dir : \"\" %> <%= col.className || \"\" %>\">\n            <%= col.header || key %>\n        </th>\n    <% } %>\n<% }) %>");

    TableView.prototype.template = _.template("<div class=\"tableview-container\">\n    <div class=\"row\">\n        <%= title %>\n\n        <%= filters %>\n\n        <%= search %>\n    </div>\n\n    <div class=\"tableview-table-wrapper\">\n        <span class=\"tableview-loading-spinner hide\">Loading...</span>\n        <table class=\"table table-striped tableview-table\">\n            <thead>\n                <tr>\n                    <%= columns %>\n                </tr>\n            </thead>\n            <tbody class=\"fade in\" />\n        </table>\n    </div>\n\n    <div id=\"pagination-main\" />\n</div>");

    TableView.prototype.search = false;

    TableView.prototype.pagination = false;

    TableView.prototype.loading = true;

    TableView.prototype.fetch = true;

    TableView.prototype.myEvents = {
      "change .search-query": "updateSearch",
      "click  th": "toggleSort",
      "click  .pager-size:not(.active)": "changeSize",
      "click  .pager-page:not(.active)": "toPage",
      "click  .pager-prev:not(.disabled)": "prevPage",
      "click  .pager-next:not(.disabled)": "nextPage"
    };

    TableView.prototype.initialize = function() {
      var key, myFilters, val, _ref1, _ref2, _ref3;
      _ref1 = this.options;
      for (key in _ref1) {
        val = _ref1[key];
        this[key] = val;
      }
      myFilters = {
        option: Backbone.TableView.ButtonOptionFilter,
        dropdown: Backbone.TableView.DropdownFilter,
        input: Backbone.TableView.InputFilter,
        button: Backbone.TableView.ButtonFilter,
        buttongroup: Backbone.TableView.ButtonGroupFilter
      };
      this.filterClasses = _.extend(myFilters, this.filterClasses);
      this.events = _.extend(_.clone(this.myEvents), this.events);
      this.data = _.extend({}, this.initialData);
      if (this.router) {
        this.data = _.extend(this.data, this.parseQueryString(Backbone.history.fragment));
        this.on("updating", this.updateUrl);
      }
      if (this.pagination) {
        this.data.page = (_ref2 = parseInt(this.data.page) || this.page) != null ? _ref2 : 1;
        this.data.size = (_ref3 = parseInt(this.data.size) || this.size) != null ? _ref3 : 10;
        this.on("updated", this.refreshPagination);
      }
      if (this.loading) {
        this.listenTo(this.collection, "request", this.showLoading);
        this.listenTo(this.collection, "sync", this.hideLoading);
      }
      this.listenTo(this.collection, "sync", this.renderData);
      return this;
    };

    TableView.prototype.prettyName = function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(\w)/g, function(match, p1) {
        return " " + p1.toUpperCase();
      });
    };

    TableView.prototype.parseQueryString = function(uri) {
      var decode, i, match, ret, search;
      ret = {};
      if (uri && (i = uri.indexOf("?")) >= 0) {
        uri = uri.substring(i + 1);
        search = /([^&=]+)=?([^&]*)/g;
        decode = function(s) {
          return decodeURIComponent(s.replace(/\+/g, " "));
        };
        while (match = search.exec(uri)) {
          ret[decode(match[1])] = decode(match[2]);
        }
      }
      return ret;
    };

    TableView.prototype.applyTemplate = function(template, model, size) {
      if (size == null) {
        size = 12;
      }
      return (model && size && template({
        data: this.data,
        model: model,
        classSize: "span" + size + " col-lg-" + size,
        self: this
      })) || "";
    };

    TableView.prototype.setData = function() {
      var args, key, val, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.pagination) {
        this.data.page = 1;
      }
      while (args.length > 1) {
        _ref1 = args, key = _ref1[0], val = _ref1[1], args = 3 <= _ref1.length ? __slice.call(_ref1, 2) : [];
        if (val || val === false || val === 0) {
          this.data[key] = val;
        } else {
          delete this.data[key];
        }
      }
      return this.update();
    };

    TableView.prototype.createFilter = function(name, filter) {
      var _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      return new this.filterClasses[filter.type]({
        id: name,
        extraId: filter.extraId,
        name: (_ref1 = filter.name) != null ? _ref1 : this.prettyName(name),
        off: (_ref2 = filter.off) != null ? _ref2 : "false",
        on: (_ref3 = filter.on) != null ? _ref3 : "true",
        filterClass: (_ref4 = filter.className) != null ? _ref4 : "",
        options: filter.options,
        init: ((_ref9 = filter.set) != null ? _ref9 : _.identity)((_ref5 = (_ref6 = this.data[name]) != null ? _ref6 : filter.init) != null ? _ref5 : "", (_ref7 = (_ref8 = this.data[filter.extraId]) != null ? _ref8 : filter.extraInit) != null ? _ref7 : ""),
        setData: this.setData,
        get: (_ref10 = filter.get) != null ? _ref10 : _.identity,
        getExtraId: (_ref11 = filter.getExtraId) != null ? _ref11 : _.identity
      });
    };

    TableView.prototype.updateSearch = function(e) {
      return this.setData(this.search.query || "q", e.currentTarget.value);
    };

    TableView.prototype.updateUrl = function(first) {
      var i, param, uri;
      uri = Backbone.history.fragment;
      if ((i = uri.indexOf("?")) >= 0) {
        uri = uri.substring(0, i);
      }
      param = $.param(this.data);
      if (param) {
        uri += "?" + param;
      }
      this.router.navigate(uri, {
        replace: first
      });
      return this;
    };

    TableView.prototype.update = function(first) {
      this.trigger("updating", first);
      if (first && this.skipInitialFetch) {
        this.renderData();
      } else if (this.fetch) {
        this.collection.fetch({
          data: (typeof this.filterData === "function" ? this.filterData(_.clone(this.data)) : void 0) || this.data
        });
      }
      return this;
    };

    TableView.prototype.refreshPagination = function() {
      var from, i, max, maxPage, pageFrom, pageTo, pages, sizes, to, total, _base, _base1;
      this.data.page = parseInt(typeof (_base = this.collection).getData === "function" ? _base.getData("page") : void 0) || this.data.page;
      this.data.size = parseInt(typeof (_base1 = this.collection).getData === "function" ? _base1.getData("size") : void 0) || this.data.size;
      from = (this.data.page - 1) * this.data.size;
      to = from + this.collection.size();
      if (this.collection.size() > 0) {
        from++;
      }
      max = this.collection.count != null ? _.result(this.collection, "count") : -1;
      if (max < 0) {
        maxPage = 1;
        pageFrom = this.data.page;
        pageTo = this.data.page;
        total = "";
      } else {
        maxPage = Math.ceil(max / this.data.size) || 1;
        pageFrom = _.max([1, this.data.page - 2 - _.max([0, 2 + this.data.page - maxPage])]);
        pageTo = _.min([maxPage, this.data.page + 2 + _.max([0, 3 - this.data.page])]);
        total = " of " + max + " entries";
      }
      pages = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = _.range(pageFrom, pageTo + 1);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          _results.push({
            value: i,
            active: (i === this.data.page && "active") || ""
          });
        }
        return _results;
      }).call(this);
      sizes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = [10, 20, 50, 200];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          _results.push({
            value: i,
            active: (i === this.data.size && "active") || ""
          });
        }
        return _results;
      }).call(this);
      this.$("#pagination-main").html(this.paginationTemplate({
        from: from,
        to: to,
        total: total,
        prevDisabled: this.data.page === 1 ? "disabled" : "",
        nextDisabled: to === max ? "disabled" : "",
        pages: pages,
        sizes: sizes
      }));
      return this;
    };

    TableView.prototype.renderData = function() {
      var body, col, column, model, name, row, _i, _len, _ref1, _ref2, _ref3, _ref4, _ref5;
      body = this.$("tbody");
      if (this.collection.models.length === 0) {
        body.html(this.emptyTemplate({
          text: (_ref1 = this.empty) != null ? _ref1 : "No records to show"
        }));
      } else {
        body.html("");
        _ref2 = this.collection.models;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          model = _ref2[_i];
          row = $("<tr>");
          _ref3 = this.columns;
          for (name in _ref3) {
            column = _ref3[name];
            if (!column.noshow) {
              col = $("<td>").addClass(column.className).addClass(column.tdClass);
              if (column.draw != null) {
                col.html(column.draw(model, this));
              } else {
                col.text((_ref4 = model.get(name)) != null ? _ref4 : "");
              }
              row.append(col);
            }
          }
          body.append((_ref5 = typeof this.rowTransformer === "function" ? this.rowTransformer(row, model) : void 0) != null ? _ref5 : row);
        }
      }
      this.trigger("updated");
      return this;
    };

    TableView.prototype.changeSize = function(e) {
      return this.setData("size", parseInt(e.currentTarget.childNodes[0].text));
    };

    TableView.prototype.toPage = function(e) {
      return this.setData("page", parseInt(e.currentTarget.childNodes[0].text));
    };

    TableView.prototype.prevPage = function() {
      if (this.data.page > 1) {
        return this.setData("page", this.data.page - 1);
      }
    };

    TableView.prototype.nextPage = function() {
      return this.setData("page", this.data.page + 1);
    };

    TableView.prototype.toggleSort = function(e) {
      var cl, el, sort_dir;
      el = e.currentTarget;
      cl = el.className;
      sort_dir = "";
      if (cl.indexOf("tableview-sorting-asc") >= 0) {
        sort_dir = "desc";
      } else if (cl.indexOf("tableview-sorting") >= 0) {
        sort_dir = "asc";
      } else {
        return this;
      }
      this.$("th").removeClass("tableview-sorting-desc tableview-sorting-asc");
      this.$(el).addClass("tableview-sorting-" + sort_dir);
      return this.setData("sort_col", el.abbr, "sort_dir", sort_dir);
    };

    TableView.prototype.render = function() {
      var filter, filters, filtersDiv, filtersSize, searchSize, titleSize, _i, _len,
        _this = this;
      titleSize = 3;
      filtersSize = 6;
      searchSize = 3;
      if (!this.search) {
        filtersSize += searchSize;
        searchSize = 0;
      }
      if (this.title == null) {
        filtersSize += titleSize;
        titleSize = 0;
      } else if (this.filters == null) {
        titleSize += filtersSize;
        filtersSize = 0;
      }
      this.$el.html(this.template({
        title: this.applyTemplate(this.titleTemplate, this.title, titleSize),
        search: this.applyTemplate(this.searchTemplate, this.search, searchSize),
        filters: this.applyTemplate(this.filtersTemplate, this.filters, filtersSize),
        columns: this.applyTemplate(this.columnsTemplate, this.columns)
      }));
      filters = _.compact(_.map(this.filters, function(filter, name) {
        return _this.createFilter(name, filter);
      }));
      filtersDiv = this.$(".filters");
      for (_i = 0, _len = filters.length; _i < _len; _i++) {
        filter = filters[_i];
        filtersDiv.append(filter.render().el);
      }
      return this.update(true);
    };

    TableView.prototype.showLoading = function() {
      if (this.showLoadingTimeout) {
        clearTimeout(this.showLoadingTimeout);
      }
      return this.showLoadingTimeout = _.delay(this.showLoadingNow, 500);
    };

    TableView.prototype.showLoadingNow = function() {
      this.showLoadingTimeout = void 0;
      this.$("tbody").removeClass("in");
      return this.$(".tableview-loading-spinner").removeClass("hide");
    };

    TableView.prototype.hideLoading = function() {
      if (this.showLoadingTimeout) {
        clearTimeout(this.showLoadingTimeout);
      }
      this.$("tbody").addClass("in");
      return this.$(".tableview-loading-spinner").addClass("hide");
    };

    return TableView;

  })(Backbone.View);

  /*
  Filters
  -------
  */


  Backbone.TableView.Filter = (function(_super) {
    __extends(Filter, _super);

    function Filter() {
      this.render = __bind(this.render, this);
      _ref1 = Filter.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Filter.prototype.tagName = "div";

    Filter.prototype.className = "pull-left tableview-filterbox";

    Filter.prototype.initialize = function() {
      var _this = this;
      this.id = this.options.id;
      this.extraId = this.options.extraId;
      this.setData = this.options.setData;
      return this.options.options = _.map(_.result(this.options, "options"), function(option) {
        var value;
        value = option;
        if (_.isArray(value)) {
          value = {
            name: value[0],
            value: value[1]
          };
        } else if (!_.isObject(value)) {
          value = {
            name: value,
            value: value
          };
        }
        return value;
      });
    };

    Filter.prototype.render = function() {
      this.$el.html(this.template(this.options));
      return this;
    };

    return Filter;

  })(Backbone.View);

  Backbone.TableView.InputFilter = (function(_super) {
    __extends(InputFilter, _super);

    function InputFilter() {
      this.update = __bind(this.update, this);
      _ref2 = InputFilter.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    InputFilter.prototype.template = _.template("<span class=\"input-group-addon add-on\"><%= name %></span><input type=\"text\" class=\"form-control filter <%= filterClass %>\" value=\"<%= init %>\"></input>");

    InputFilter.prototype.className = "input-group col-lg-3 input-prepend pull-left tableview-filterbox";

    InputFilter.prototype.events = {
      "change .filter": "update"
    };

    InputFilter.prototype.update = function(e) {
      if (this.extraId) {
        return this.setData(this.id, this.options.get(e.currentTarget.value), this.extraId, this.options.getExtraId(e.currentTarget.value));
      } else {
        return this.setData(this.id, this.options.get(e.currentTarget.value));
      }
    };

    return InputFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonFilter = (function(_super) {
    __extends(ButtonFilter, _super);

    function ButtonFilter() {
      this.update = __bind(this.update, this);
      _ref3 = ButtonFilter.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    ButtonFilter.prototype.template = _.template("<button type=\"button\" class=\"filter btn <%= init == on ? \"active\" : \"\" %> <%= filterClass %>\"><%= name %></button>");

    ButtonFilter.prototype.events = {
      "click .filter": "update"
    };

    ButtonFilter.prototype.initialize = function() {
      ButtonFilter.__super__.initialize.apply(this, arguments);
      this.values = [this.options.off, this.options.on];
      return this.current = this.options.init === this.options.on ? 1 : 0;
    };

    ButtonFilter.prototype.update = function(e) {
      this.$(e.currentTarget).toggleClass("active");
      this.current = 1 - this.current;
      return this.setData(this.id, this.values[this.current]);
    };

    return ButtonFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonGroupFilter = (function(_super) {
    __extends(ButtonGroupFilter, _super);

    function ButtonGroupFilter() {
      this.update = __bind(this.update, this);
      _ref4 = ButtonGroupFilter.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    ButtonGroupFilter.prototype.template = _.template("<% _.each(options, function (el, i) { %>\n    <button type=\"button\" class=\"btn <%= _.contains(init, el.value) ? \"active\" : \"\" %> <%= !_.isUndefined(el.className) ? el.className : \"\" %>\" value=\"<%= el.value %>\"><%= el.name %></button>\n<% }) %>");

    ButtonGroupFilter.prototype.className = "btn-group pull-left tableview-filterbox";

    ButtonGroupFilter.prototype.events = {
      "click .btn": "update"
    };

    ButtonGroupFilter.prototype.update = function(e) {
      var values,
        _this = this;
      this.$(e.currentTarget).toggleClass("active");
      values = _.compact(_.map(this.$(".btn"), function(btn) {
        if (_this.$(btn).hasClass("active")) {
          return _this.$(btn).attr("value");
        } else {
          return null;
        }
      }));
      return this.setData(this.id, this.options.get(values));
    };

    return ButtonGroupFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonOptionFilter = (function(_super) {
    __extends(ButtonOptionFilter, _super);

    function ButtonOptionFilter() {
      this.update = __bind(this.update, this);
      _ref5 = ButtonOptionFilter.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    ButtonOptionFilter.prototype.template = _.template("<% _.each(options, function (el, i) { %>\n    <button type=\"button\" class=\"btn <%= init == el.value ? \"active\" : \"\" %>\" value=\"<%= el.value %>\"><%= el.name %></button>\n<% }) %>");

    ButtonOptionFilter.prototype.className = "btn-group pull-left tableview-filterbox";

    ButtonOptionFilter.prototype.events = {
      "click .btn": "update"
    };

    ButtonOptionFilter.prototype.update = function(e) {
      this.$(".btn").removeClass("active");
      this.$(e.currentTarget).addClass("active");
      return this.setData(this.id, this.options.get(e.currentTarget.value));
    };

    return ButtonOptionFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.DropdownFilter = (function(_super) {
    __extends(DropdownFilter, _super);

    function DropdownFilter() {
      this.update = __bind(this.update, this);
      _ref6 = DropdownFilter.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    DropdownFilter.prototype.template = _.template("<select class=\"form-control filter <%= filterClass %>\">\n    <% _.each(options, function (el, i) { %>\n        <option <%= init == el.value ? \"selected='selected'\" : \"\" %> value=\"<%= el.value %>\"><%= el.name %></option>\n    <% }) %>\n</select>");

    DropdownFilter.prototype.events = {
      "change .filter": "update"
    };

    DropdownFilter.prototype.update = function(e) {
      return this.setData(this.id, this.options.get(e.currentTarget.value));
    };

    return DropdownFilter;

  })(Backbone.TableView.Filter);

}).call(this);
