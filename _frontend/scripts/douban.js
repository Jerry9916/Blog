'use strict';
function DoubanApi(options) {
  this.options = options;
}

DoubanApi.prototype.makeUrl = function (status) {
  return 'http://api.douban.com/people/' + this.options.user + '/collection?cat=book&start-index=1&max-results=50&status=' + status + '&alt=xd&callback=dbapi.' + status + 'Show&apikey=' + this.options.key;
};

DoubanApi.prototype.makeList = function (items) {
  var html = '';
  $.each(items, function (i, item) {
    html += '<a href="' + item.link + '" title="' + item.title + '" class="item" target="_blank">';
    html += '<img src="' + item.src + '" alt="' + item.title + '" title="' + item.title + '" />';
    html += '</a>';
  });
  return html;
};

DoubanApi.prototype.makeJson = function (json) {
  var items = [];
  $.each(json.entry, function (i, item) {
    var link = {};
    link.title = item['db:subject'].title.$t;
    link.link = item['db:subject'].link[1]['@href'];
    link.src = item['db:subject'].link[2]['@href'];
    items.push(link);
  });
  return items;
};

DoubanApi.prototype.run = function () {
  for (var i in this.options.sections) {
    this.makeSection(this.options.sections[i]);
  }
};

DoubanApi.prototype.makeSection = function (section) {
  var callback = section.status + 'Show';
  this[callback] = function (json) {
    var main = $('#' + this.options.id);
    var html = '<div class="books"><h2 class="title">'+section.title+'</h2>';
    html += '<ul>'+this.makeList(this.makeJson(json))+'</ul>';
    html += '</div>';
    main.append(html);
  };
  $('<script/>').attr('src', this.makeUrl(section.status)).attr('charset', 'utf-8').appendTo($('head')[0]);
};
