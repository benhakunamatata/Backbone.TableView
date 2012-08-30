// Generated by CoffeeScript 1.3.3
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
            description:
                header: "Description"
                nosort: true
                draw: (model) ->
                    some_weird_formatting_function(model.get('some_text'))
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
            my_btn:
                type: "button"
            status:
                type: "option"
                options: ["all", "valid", "invalid"]
*/

var ButtonFilter, ButtonOptionFilter, Filter, InputFilter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Backbone.TableView = (function(_super) {

  __extends(TableView, _super);

  function TableView() {
    this.firstOf = __bind(this.firstOf, this);

    this.render = __bind(this.render, this);

    this.toggleSort = __bind(this.toggleSort, this);

    this.nextPage = __bind(this.nextPage, this);

    this.prevPage = __bind(this.prevPage, this);

    this.toPage = __bind(this.toPage, this);

    this.renderData = __bind(this.renderData, this);

    this.refreshPagination = __bind(this.refreshPagination, this);

    this.update = __bind(this.update, this);

    this.updateUrl = __bind(this.updateUrl, this);

    this.updateSearch = __bind(this.updateSearch, this);

    this.createFilter = __bind(this.createFilter, this);

    this.setData = __bind(this.setData, this);
    return TableView.__super__.constructor.apply(this, arguments);
  }

  TableView.prototype.tagName = "div";

  TableView.prototype.titleTemplate = _.template("<div class=\"<%= classSize %>\">\n    <h4 class=\"<%= model.className || \"\" %>\"><%= model.name || model %></h4>\n</div>");

  TableView.prototype.filtersTemplate = _.template("<div class=\"filters controls pagination-centered <%= classSize %>\">\n</div>");

  TableView.prototype.searchTemplate = _.template("<div class=\"<%= classSize %>\">\n    <input type=\"text\" class=\"search-query input-block-level pull-right\" placeholder=\"<%= model.detail || model %>\" value=\"<%= data[model.query || \"q\"] || \"\" %>\"></input>\n</div>");

  TableView.prototype.paginationTemplate = _.template("<div class=\"row-fluid\">\n    <div class=\"span6\">\n        <div class=\"tableview-info\">Showing <%= from %> to <%= to %><%= total %></div>\n    </div>\n    <div class=\"span6\">\n        <div class=\"pagination\">\n            <ul>\n                <li class=\"pager-prev <%= prevDisabled %>\"><a href=\"javascript:void(0)\">← Previous</a></li>\n                <% _.each(pages, function (page) { %>\n                    <li class=\"pager-page <%= page.active %>\"><a href=\"javascript:void(0)\"><%= page.number %></a></li>\n                <% }) %>\n                <li class=\"pager-next <%= nextDisabled %>\"><a href=\"javascript:void(0)\">Next → </a></li>\n            </ul>\n        </div>\n    </div>\n</div>");

  TableView.prototype.dataTemplate = _.template("<% _.each(collection.models, function (row) { %>\n    <tr>\n        <% _.each(columns, function (col, name) { %>\n            <td class=\"<%= col.className || \"\" %> <%= col.tdClass || \"\" %>\">\n                <%= col.draw ? col.draw(row) : row.get(name) || \"\" %>\n            </td>\n        <% }) %>\n    </tr>\n<% }) %>\n<% if (collection.models.length == 0) { %>\n    <tr>\n        <td colspan=\"10\"><%= empty %></td>\n    </tr>\n<% } %>");

  TableView.prototype.columnsTemplate = _.template("<% _.each(model, function (col, key) { %>\n    <th abbr=\"<%= key || col %>\"\n     class=\"<%= !col.nosort && \"sorting\" %> <%= ((key || col) == data.sort_col) && \"sorting_\" + data.sort_dir %> <%= col.className || \"\" %>\">\n        <%= col.header || key %>\n    </th>\n<% }) %>");

  TableView.prototype.template = _.template("<div class=\"row-fluid\">\n    <%= title %>\n\n    <%= filters %>\n\n    <%= search %>\n</div>\n\n<table class=\"table table-striped\">\n    <thead>\n        <tr>\n            <%= columns %>\n        </tr>\n    </thead>\n    <tbody class=\"fade\">\n        <tr>\n            <td colspan=\"10\"><%= empty %></td>\n        </tr>\n    </tbody>\n</table>\n\n<div id=\"pagination-main\">\n</div>");

  TableView.prototype.events = {
    "change .search-query": "updateSearch",
    "click  th": "toggleSort",
    "click  .pager-page:not(.active)": "toPage",
    "click  .pager-prev:not(.disabled)": "prevPage",
    "click  .pager-next:not(.disabled)": "nextPage"
  };

  TableView.prototype.initialize = function() {
    var key, val, _ref;
    this.collection.on("reset", this.renderData);
    _ref = this.options;
    for (key in _ref) {
      val = _ref[key];
      if (!(this[key] != null)) {
        this[key] = val;
      }
    }
    this.data = $.extend({}, this.initialData, this.parseQueryString(Backbone.history.fragment));
    this.data.page = parseInt(this.data.page) || this.page || 1;
    this.data.size = parseInt(this.data.size) || this.size || 10;
    return this;
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

  TableView.prototype.setData = function() {
    var args, key, val, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.data.page = 1;
    while (args.length > 1) {
      _ref = args, key = _ref[0], val = _ref[1], args = 3 <= _ref.length ? __slice.call(_ref, 2) : [];
      if ((val != null) && (val === false || val === 0 || val)) {
        this.data[key] = val;
      } else {
        delete this.data[key];
      }
    }
    return this.update();
  };

  TableView.prototype.createFilter = function(name, filter) {
    switch (filter.type) {
      case "option":
        return new ButtonOptionFilter({
          id: name,
          name: filter.name || this.prettyName(name),
          filterClass: filter.className || "",
          options: filter.options,
          init: (filter.set || _.identity)(this.data[name] || filter.init || ""),
          setData: this.setData
        });
      case "button":
        return new ButtonFilter({
          id: name,
          name: filter.name || this.prettyName(name),
          off: this.firstOf(filter.off, "false"),
          on: this.firstOf(filter.on, "true"),
          filterClass: filter.className || "",
          init: (filter.set || _.identity)(this.firstOf(this.data[name], filter.init, filter.off, "false")),
          setData: this.setData
        });
      case "input":
        return new InputFilter({
          id: name,
          name: filter.name || this.prettyName(name),
          extraId: filter.extraId,
          filterClass: filter.className || "",
          get: filter.get || _.identity,
          getExtraId: filter.getExtraId || _.identity,
          init: (filter.set || _.identity)(this.data[name] || filter.init || "", this.data[filter.extraId] || filter.extraInit || ""),
          setData: this.setData
        });
    }
    filter.setData = this.setData;
    filter.init = (filter.set || _.identity)(this.data[name] || filter.init || "");
    return filter;
  };

  TableView.prototype.updateSearch = function(e) {
    return this.setData(this.search.query || "q", e.currentTarget.value);
  };

  TableView.prototype.updateUrl = function() {
    var first, i, key, separator, uri, val, _ref;
    if (this.router) {
      uri = Backbone.history.fragment;
      if ((i = uri.indexOf("?")) > 0) {
        uri = uri.substring(0, i);
      }
      first = true;
      _ref = this.data;
      for (key in _ref) {
        val = _ref[key];
        if (first) {
          first = false;
          separator = "?";
        } else {
          separator = "&";
        }
        uri = uri + separator + key + "=" + val;
      }
      this.router.navigate(uri);
    }
    return this;
  };

  TableView.prototype.update = function() {
    $("tbody", this.$el).removeClass("in");
    this.trigger("updating");
    this.collection.fetch({
      data: this.data
    });
    return this.updateUrl();
  };

  TableView.prototype.refreshPagination = function() {
    var from, i, max, maxPage, pageFrom, pageTo, pages, to, total;
    from = (this.data.page - 1) * this.data.size;
    to = from + this.collection.size();
    if (this.collection.size() > 0) {
      from++;
    }
    max = this.collection.count != null ? this.collection.count() : -1;
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
      var _i, _len, _ref, _results;
      _ref = _.range(pageFrom, pageTo + 1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push({
          number: i,
          active: (i === this.data.page && "active") || ""
        });
      }
      return _results;
    }).call(this);
    $("#pagination-main", this.$el).html(this.paginationTemplate({
      from: from,
      to: to,
      total: total,
      prevDisabled: this.data.page === 1 ? "disabled" : "",
      nextDisabled: to === max ? "disabled" : "",
      pages: pages
    }));
    return this;
  };

  TableView.prototype.renderData = function() {
    $("tbody", this.$el).html(this.dataTemplate({
      collection: this.collection,
      columns: this.columns,
      empty: this.empty || "No records to show"
    }));
    if (this.pagination) {
      this.refreshPagination();
    }
    this.trigger("updated");
    $("tbody", this.$el).addClass("in");
    return this;
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
    if (cl.indexOf("sorting_asc") >= 0) {
      sort_dir = "desc";
    } else if (cl.indexOf("sorting") >= 0) {
      sort_dir = "asc";
    } else {
      return this;
    }
    $("th", this.$el).removeClass("sorting_desc sorting_asc");
    $(el, this.$el).addClass("sorting_" + sort_dir);
    return this.setData("sort_col", el.abbr, "sort_dir", sort_dir);
  };

  TableView.prototype.applyTemplate = function(template, model, size) {
    if (!(size != null)) {
      size = 12;
    }
    return (model && size && template({
      data: this.data,
      model: model,
      classSize: "span" + size
    })) || "";
  };

  TableView.prototype.render = function() {
    var filters, filtersDiv, filtersSize, searchSize, titleSize,
      _this = this;
    titleSize = 3;
    filtersSize = 6;
    searchSize = 3;
    if (!(this.search != null)) {
      filtersSize += searchSize;
      searchSize = 0;
    }
    if (!(this.title != null)) {
      filtersSize += titleSize;
      titleSize = 0;
    } else if (!(this.filters != null)) {
      titleSize += filtersSize;
      filtersSize = 0;
    }
    this.$el.html(this.template({
      empty: this.empty || "",
      title: this.applyTemplate(this.titleTemplate, this.title, titleSize),
      search: this.applyTemplate(this.searchTemplate, this.search, searchSize),
      filters: this.applyTemplate(this.filtersTemplate, this.filters, filtersSize),
      columns: this.applyTemplate(this.columnsTemplate, this.columns)
    }));
    filters = _.map(this.filters, function(filter, name) {
      return _this.createFilter(name, filter);
    });
    filtersDiv = $(".filters", this.$el);
    _.each(filters, function(filter) {
      return filtersDiv.append(filter.render().el);
    });
    return this.update();
  };

  TableView.prototype.prettyName = function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(\w)/g, function(match, p1) {
      return " " + p1.toUpperCase();
    });
  };

  TableView.prototype.firstOf = function() {
    var arg, args, index;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (index in args) {
      arg = args[index];
      if (arg != null) {
        return arg;
      }
    }
    return null;
  };

  return TableView;

})(Backbone.View);

/*
Filters
-------
*/


Filter = (function(_super) {

  __extends(Filter, _super);

  function Filter() {
    this.render = __bind(this.render, this);
    return Filter.__super__.constructor.apply(this, arguments);
  }

  Filter.prototype.tagName = "div";

  Filter.prototype.className = "pull-left filterbox";

  Filter.prototype.initialize = function() {
    this.id = this.options.id;
    this.extraId = this.options.extraId;
    return this.setData = this.options.setData;
  };

  Filter.prototype.render = function() {
    this.$el.html(this.template(this.options));
    return this;
  };

  return Filter;

})(Backbone.View);

InputFilter = (function(_super) {

  __extends(InputFilter, _super);

  function InputFilter() {
    this.update = __bind(this.update, this);
    return InputFilter.__super__.constructor.apply(this, arguments);
  }

  InputFilter.prototype.template = _.template("<span class=\"add-on\"><%= name %></span><input type=\"text\" class=\"filter <%= filterClass %>\" value=\"<%= init %>\"></input>");

  InputFilter.prototype.className = "input-prepend pull-left filterbox";

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

})(Filter);

ButtonFilter = (function(_super) {

  __extends(ButtonFilter, _super);

  function ButtonFilter() {
    this.update = __bind(this.update, this);
    return ButtonFilter.__super__.constructor.apply(this, arguments);
  }

  ButtonFilter.prototype.template = _.template("<button type=\"button\" class=\"filter btn <%= init == on ? \"active\" : \"\" %> <%= filterClass %>\"><%= name %></button>");

  ButtonFilter.prototype.events = {
    "click .filter": "update"
  };

  ButtonFilter.prototype.initialize = function() {
    ButtonFilter.__super__.initialize.apply(this, arguments);
    this.values = [this.options.off, this.options.on];
    return this.current = this.options.init === this.options.off ? 0 : 1;
  };

  ButtonFilter.prototype.update = function(e) {
    $(e.currentTarget, this.$el).toggleClass("active");
    this.current = 1 - this.current;
    return this.setData(this.id, this.values[this.current]);
  };

  return ButtonFilter;

})(Filter);

ButtonOptionFilter = (function(_super) {

  __extends(ButtonOptionFilter, _super);

  function ButtonOptionFilter() {
    this.update = __bind(this.update, this);
    return ButtonOptionFilter.__super__.constructor.apply(this, arguments);
  }

  ButtonOptionFilter.prototype.template = _.template("<% _.each(options, function (el, i) { %>\n    <button class=\"btn <%= init == el.value ? \"active\" : \"\" %>\" value=\"<%= el.value %>\"><%= el.name %></button>\n<% }) %>");

  ButtonOptionFilter.prototype.className = "btn-group pull-left filterbox";

  ButtonOptionFilter.prototype.events = {
    "click .btn": "update"
  };

  ButtonOptionFilter.prototype.initialize = function() {
    var _this = this;
    ButtonOptionFilter.__super__.initialize.apply(this, arguments);
    return this.options.options = _.map(this.options.options, function(option) {
      var name, value;
      value = option;
      if (_.isArray(value)) {
        name = value[0];
        value = value[1];
      } else if (_.isObject(value)) {
        name = option.name;
        value = option.value;
      } else {
        name = option;
      }
      return {
        name: name,
        value: value
      };
    });
  };

  ButtonOptionFilter.prototype.update = function(e) {
    $(".btn", this.$el).removeClass("active");
    $(e.currentTarget, this.$el).addClass("active");
    return this.setData(this.id, e.currentTarget.value);
  };

  return ButtonOptionFilter;

})(Filter);
