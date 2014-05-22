(function ($) {

    var opts;

    $.fn.get = function (options) {

        opts = $.extend({}, $.fn.get.defaults, options);
        opts.css = $.extend($.fn.get.defaults.css, opts.css);
        opts.page = $.extend($.fn.get.defaults.page, opts.page);
        opts.Columns = $.extend($.fn.get.defaults.Columns, opts.Columns);

        //获取配置参数
        var _Container = $(this);
        var _Url = opts.url;    //获取News数据的URL
        var page = opts.page.page_size;      //获取单页新闻数量
        var page_display = opts.page.display;      //获取单页新闻数量

        var _Container_width = opts.width;
        var _Container_height = opts.height;
        var page_text_color = opts.page.page_text_color;
        var page_text_hover_color = opts.page.page_text_hover_color;

        _Container.width(_Container_width).height(_Container_height);

        _Container.addClass($.fn.get.defaults.class);

        _Container.addClass(opts.class);


        $.getJSON(getURL(_Url, 0, page), function callback(json) {
            var count = json[opts.data_count_name];
            //添加显示容器
            var _Container_List = $(document.createElement('div')).attr('id', '_Container');
            var _Container_List_Ul = $(document.createElement('ul'));//.css({ "margin": "0px", "padding": "0px" });
            _Container_List_Ul.addClass($.fn.get.defaults.ul_class);
            _Container_List_Ul.addClass(opts.ul_class);
            
            var _Page = $(document.createElement('div')).addClass(opts.page.class);
            var _jPaginate = $(document.createElement('div')).attr('id', 'jPaginate').addClass('jPaginate');//.css('margin', 'auto');
            _Page.append(_jPaginate);

            _Container_List.append(_Container_List_Ul);
            _Container.append(_Container_List);

            if (opts.page.visibility == 'visible') {
                _Container.append(_Page);

                var pageSize = 5; //默认单页新闻数量
                if (page > 0)
                    pageSize = page;
                var pages = Math.ceil(count / pageSize);
                if (pages > 1) {
                    $("#jPaginate").paginate({
                        count: pages, //页数
                        start: 1, //初始
                        display: page_display, //当前
                        border: false,
                        text_color: page_text_color,
                        background_color: 'none',
                        text_hover_color: page_text_hover_color,
                        background_hover_color: 'none',
                        images: false,
                        mouse: 'press',
                        onChange: function (page) {//本插件唯一可触发的事件,在点击页数的时候触发,只传过来当前被选中的页数
                            list(getURL(_Url, page - 1, pageSize));
                        }
                    });
                }
            }

            $("#_Container").find('ul').html(buildRows(json[opts.data_records_name]));
        });
    };

    $.fn.get.defaults = {
        url: null,
        url_pageNo: "pageNo",
        url_pageSize: "pageSize",
        width: 700,                 //default-value:700
        height: 270,                //default-value:270
        row_height: 25,             //default-value:25
        columns_num:2,
        data_count_name: null,
        data_records_name: null,
        class: 'jnList_container',
        ul_class: "jnList_container_ul",
        li_class: "jnList_container_li"
    };

    $.fn.get.defaults.page = {
        class:"paginate",
        visibility: 'visible',        //default-value:visible, hidden
        display: 5,                  //default-value:5
        page_size: 5,               //default-value:5
        page_text_color: '#79B5E3', //default-background_color:#79B5E3
        page_text_hover_color: '#2573AF'//default-background_color:#2573AF
    };

    $.fn.get.defaults.Columns =[{
                name: "news_title", //not null
                type: "string",
                width: 300,                 //default-value:500   
                span_class: "span_string",
                a_class: "myA",
                slice: true,               //default-value:true，false
                render: function (Row) {    //default-func:null
                    return "<b>" + Row["news_title"] + "</b>";
                    //return Row["news_title"];
                },
                img1_url: "../Images/icon_new.png", //"../Images/icon_new.png"
                img2_url: "../Images/icon_new.png", //"../Images/icon_hot.png"
                attchImg1: function (Row) { //default-func:null
                    if (Row["news_id"] % 1 == 0)
                        return true;
                    else
                        return false;
                },
                attchImg2: function (Row) { //default-func:null
                    if (Row["news_id"] % 1 == 0)
                        return true;
                    else
                        return false;
                },
                Click: function (Row) {
                    return "http://www.baidu.com";
                }
            },
            {
                name: "news_datetime",  //not null
                type: "timestamp",      //string,timestamp
                width: 150,              //default-value:200
                class: "span_date",
                pattern: "yyyy-MM-dd"   //yyyy-MM-dd hh:mm:ss
            }];

    function getURL(URL, pageNo, pageSize) {
        return URL + "?" + opts.url_pageNo + "=" + pageNo + "&" + opts.url_pageSize + "=" +  pageSize;
    }

    function list(url) {
        $.getJSON(url,  function callback(json) {
            $("#_Container").find('ul').html(buildRows(json[opts.data_records_name]));
        });
    }

    //解析JSON数组
    function buildRows(rows) {
        var allRows;
        if (rows) {
            //allRows = $.map(rows, buildRow);
            var i = 1;
            allRows = $.map(rows,function(row){
                var result = buildRow(row);
                if(i % opts.columns_num == 0)
                    result.append($(document.createElement('div')).css({ "clear": "both", "line-height": "1px" }));
                i++;
                return result.html();
            });
            
            return allRows.join('');
        }
        return '';
    }

    //解析一行row
    function buildRow(row) {
        var ul = $(document.createElement('ul'));

        //var listIcon = opts.css.list_icon;
        var li = $(document.createElement('li'));
        li.css({
            //"width": opts.width + "px",
            "height": opts.row_height+ "px",
            "line-height": opts.row_height + "px"
        });

        li.addClass($.fn.get.defaults.li_class);

        li.addClass(opts.li_class);

        $.each(opts.Columns, function (n, value) {

            if (value.type == 'string')
                li.append(getStringSpan(row, n));

            if (value.type == 'timestamp')
                li.append(getDateSpan(row, n));

        });

        ul.append(li);

        return ul;
    }
    
    //获取String类型的span
    function getStringSpan(row, i) {
        var a = $(document.createElement('a'));
        if(opts.Columns[i].Click)
            a.attr('href', opts.Columns[i].Click());
        var span = $(document.createElement('span'));

        a.css({
            "width": opts.Columns[i].width + "px",
            "height": opts.row_height + "px",
            "line-height": opts.row_height + "px",
            /*
            "padding": "0px",
            "margin": "0px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "display": "inline-block",
            "*display": "inline",
            "*zoom": "1"*/
        });
        
        a.addClass("jnList_container_a");

        a.addClass(opts.Columns[i].a_class);

        if (opts.Columns[i].render)
            span.html(opts.Columns[i].render(row));
        else
            span.html(row[opts.Columns[i].name]);

        a.append(span);

        var span_new;
        var span_hot;
        var count = 0;
        if (opts.Columns[i].attchImg1 && opts.Columns[i].attchImg1(row)) {
            span_new = $(document.createElement('span'));
            span_new.css('background', 'url(' + opts.Columns[i].img1_url + ') no-repeat scroll right center');
            span_new.css({ "width": "34px",
                "height": opts.row_height + "px",
                "line-height": opts.row_height + "px",
                "display": "inline-block",
                "*display": "inline",
                "*zoom": "1",
                "vertical-align": "middle"
            });
            a.append(span_new);
            count++;
        }
        if (opts.Columns[i].attchImg2 && opts.Columns[i].attchImg2(row)) {
            span_hot = $(document.createElement('span'));
            span_hot.css('background', 'url(' + opts.Columns[i].img2_url + ') no-repeat scroll right center');
            span_hot.css({ "width": "34px",
                "height": opts.row_height + "px",
                "line-height": opts.row_height + "px",
                "display": "inline-block",
                "*display": "inline",
                "*zoom": "1",
                "vertical-align": "middle"
            });
            a.append(span_hot);
            count++;
        }

        var width_max = opts.Columns[i].width - count * 34 - 15;

        var len = span.text().length; //标题总长
        var len_cn = getCn(span.text()); //中文
        var len_en = getEn(span.text()); //英文
        var len_other = span.text().length - len_cn - len_en; //其他字符
        var weight_cn = 0.9;
        var weight_en = 1;
        var weight_other = 1;

        var text_size = $('.' + $.fn.get.defaults.class).css('font-size');
        if (!$('.' + opts.class))
            text_size = $('.' + opts.class).css('font-size');
        var num = (len_cn / len * weight_cn + len_other / len * weight_en + len_en / len * weight_other) * text_size / 12.5;
        
        span.css({
            /*
            "margin": "0px",
            "padding": "0px",
            "text-align": "left",*/
            "height": opts.row_height + "px",
            "line-height": opts.row_height + "px"
        });

        span.addClass("jnList_container_span_string");

        span.addClass(opts.Columns[i].span_class);

        var ret = getRet(span, text_size);
        var _width = ret.width;
        //var width_real = _width * num + count * 34 + 15;
        var width_real = _width + count * 34 + 15;
       

        if (width_real > opts.Columns[i].width) {//标题过长处理
            if (opts.Columns[i].slice) {//进行切割
                span.css("width", (opts.Columns[i].width - count * 34 - 15) + "px");
                span.css({
                    "white-space": "nowrap",
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    "display": "inline-block",
                    "*display": "inline",
                    "*zoom": "1",
                    "vertical-align": "middle"
                });
            }
            else {//不切割,分行
                span.css({
                    "word-wrap": "break-word",
                    "word-break": "break-all"
                });
            }
        }
        else//不处理
            span.css("width", _width + 15 + "px");

        return a;
    }

    //获取Date类型的span
    function getDateSpan(row, i) {

        var span = $(document.createElement('span'));

        if (row[opts.Columns[i].name])
            span.text(formatTime(row[opts.Columns[i].name], opts.Columns[i].pattern));

        span.css({
            "width": opts.Columns[i].width + "px",
            "height": opts.row_height + "px",
            "line-height": opts.row_height + "px",
            /*
            "padding": "0px",
            "margin": "0px",
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "display": "inline-block",
            "*display": "inline",
            "*zoom": "1"*/
        });

        span.addClass("jnList_container_span_date");

        span.addClass(opts.Columns[i].class);

        return span;
    }

    function getRet(el, text_size) {

        var h = 0, w = 0;

        var div = document.createElement('div');
        document.body.appendChild(div);
        $(div).css({
            position: 'absolute',
            left: -1000,
            top: -1000,
            display: 'none'
        });

        $(div).html($(el).html());
        var styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        $(styles).each(function () {
            var s = this.toString();
            $(div).css(s, $(el).css(s));
        });
        $(div).css('font-size',text_size);
        h = $(div).outerHeight();
        w = $(div).outerWidth();

        $(div).remove();

        var ret = {
            height: h,
            width: w
        };

        return ret;
    }

    function getCn(s) {
        var num = 0;
        for (var i = 0; i < s.length; i++)
            if (s.charCodeAt(i) >= 10000)
                num++;   //\x4e00-\x9fa5
        return num;
    }

    function getEn(s) {
        var regExp = /[a-z]|[A-Z]$/;
        var num = 0;
        for (var i = 0; i < s.length; i++)
            if (regExp.test(s.charAt(i)))
                num++;
        return num;

    }

    //格式化时间
    function formatTime(val, pattern) {
        var re = /-?\d+/;
        var m = re.exec(val);
        var d = new Date(parseInt(m[0]));
        // 按【2012-02-13 09:09:09】的格式返回日期
        //return d.toTimeString("yyyy-MM-dd hh:mm:ss");
        return d.format(pattern);
    }

    Date.prototype.format = function (format) //author: meizz
    {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }

    //点击新闻触发的事件
    function toLink() { return false; }


	//分页
	$.fn.paginate = function (options) {
        var opts = $.extend({}, $.fn.paginate.defaults, options);
        return this.each(function () {
            $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            var selectedpage = o.start;
            $.fn.draw(o, $this, selectedpage);
        });
    };
    var outsidewidth_tmp = 0;
    var insidewidth = 0;
    var bName = navigator.appName;
    /*
    var bVer = navigator.appVersion;
    if(bVer.indexOf('MSIE 7.0') > 0)
    var ver = "ie7";*/
    var isIE = $.browser.msie;
    var bv = $.browser.version;
    if (isIE && bv == '7.0')
        var ver = "ie7";

    $.fn.paginate.defaults = {
        count: 5,
        start: 12,
        display: 5,
        border: true,
        border_color: '#fff',
        text_color: '#8cc59d',
        background_color: 'black',
        border_hover_color: '#fff',
        text_hover_color: '#fff',
        background_hover_color: '#fff',
        rotate: true,
        images: true,
        mouse: 'slide',
        onChange: function () { return false; }
    };
    $.fn.draw = function (o, obj, selectedpage) {
        if (o.display > o.count)
            o.display = o.count;
        $this.empty();
        if (o.images) {
            var spreviousclass = 'jPag-sprevious-img';
            var previousclass = 'jPag-previous-img';
            var snextclass = 'jPag-snext-img';
            var nextclass = 'jPag-next-img';
        }
        else {
            var spreviousclass = 'jPag-sprevious';
            var previousclass = 'jPag-previous';
            var snextclass = 'jPag-snext';
            var nextclass = 'jPag-next';
        }
        var _first = $(document.createElement('a')).addClass('jPag-first').html('首页');

        if (o.rotate) {
            if (o.images) var _rotleft = $(document.createElement('span')).addClass(spreviousclass);
            else var _rotleft = $(document.createElement('span')).addClass(spreviousclass).html('&laquo;');
        }

        var _divwrapleft = $(document.createElement('div')).addClass('jPag-control-back');
        _divwrapleft.append(_first).append(_rotleft);

        var _ulwrapdiv = $(document.createElement('div')).css('overflow', 'hidden');
        var _ul = $(document.createElement('ul')).addClass('jPag-pages')
        var c = (o.display - 1) / 2;
        var first = selectedpage - c;
        var selobj;
        for (var i = 0; i < o.count; i++) {
            var val = i + 1;
            if (val == selectedpage) {
                var _obj = $(document.createElement('li')).html('<span class="jPag-current">' + val + '</span>');
                selobj = _obj;
                _ul.append(_obj);
            }
            else {
                var _obj = $(document.createElement('li')).html('<a>' + val + '</a>');
                _ul.append(_obj);
            }
        }
        _ulwrapdiv.append(_ul);

        if (o.rotate) {
            if (o.images) var _rotright = $(document.createElement('span')).addClass(snextclass);
            else var _rotright = $(document.createElement('span')).addClass(snextclass).html('&raquo;');
        }

        var _last = $(document.createElement('a')).addClass('jPag-last').html('尾页');
        var _divwrapright = $(document.createElement('div')).addClass('jPag-control-front');
        _divwrapright.append(_rotright).append(_last);

        //append all:
        $this.addClass('jPaginate').append(_divwrapleft).append(_ulwrapdiv).append(_divwrapright);

        if (!o.border) {
            if (o.background_color == 'none') var a_css = { 'color': o.text_color };
            else var a_css = { 'color': o.text_color, 'background-color': o.background_color };
            if (o.background_hover_color == 'none') var hover_css = { 'color': o.text_hover_color };
            else var hover_css = { 'color': o.text_hover_color, 'background-color': o.background_hover_color };
        }
        else {
            if (o.background_color == 'none') var a_css = { 'color': o.text_color, 'border': '1px solid ' + o.border_color };
            else var a_css = { 'color': o.text_color, 'background-color': o.background_color, 'border': '1px solid ' + o.border_color };
            if (o.background_hover_color == 'none') var hover_css = { 'color': o.text_hover_color, 'border': '1px solid ' + o.border_hover_color };
            else var hover_css = { 'color': o.text_hover_color, 'background-color': o.background_hover_color, 'border': '1px solid ' + o.border_hover_color };
        }

        $.fn.applystyle(o, $this, a_css, hover_css, _first, _ul, _ulwrapdiv, _divwrapright);
        //calculate width of the ones displayed:
        var outsidewidth = outsidewidth_tmp - _first.parent().width() - 3;
        if (ver == 'ie7') {
            _ulwrapdiv.css('width', outsidewidth + 72 + 'px');
            _divwrapright.css('left', outsidewidth_tmp + 6 + 72 + 'px');
        }
        else {
            _ulwrapdiv.css('width', outsidewidth + 'px');
            _divwrapright.css('left', outsidewidth_tmp + 6 + 'px');
        }

        if (o.rotate) {
            _rotright.hover(
				function () {
				    thumbs_scroll_interval = setInterval(
					function () {
					    var left = _ulwrapdiv.scrollLeft() + 1;
					    _ulwrapdiv.scrollLeft(left);
					},
					20
				  );
				},
				function () {
				    clearInterval(thumbs_scroll_interval);
				}
			);
            _rotleft.hover(
				function () {
				    thumbs_scroll_interval = setInterval(
					function () {
					    var left = _ulwrapdiv.scrollLeft() - 1;
					    _ulwrapdiv.scrollLeft(left);
					},
					20
				  );
				},
				function () {
				    clearInterval(thumbs_scroll_interval);
				}
			);
            if (o.mouse == 'press') {
                _rotright.mousedown(
					function () {
					    thumbs_mouse_interval = setInterval(
						function () {
						    var left = _ulwrapdiv.scrollLeft() + 5;
						    _ulwrapdiv.scrollLeft(left);
						},
						20
					  );
					}
				).mouseup(
					function () {
					    clearInterval(thumbs_mouse_interval);
					}
				);
                _rotleft.mousedown(
					function () {
					    thumbs_mouse_interval = setInterval(
						function () {
						    var left = _ulwrapdiv.scrollLeft() - 5;
						    _ulwrapdiv.scrollLeft(left);
						},
						20
					  );
					}
				).mouseup(
					function () {
					    clearInterval(thumbs_mouse_interval);
					}
				);
            }
            else {
                _rotleft.click(function (e) {
                    var width = outsidewidth - 10;
                    var left = _ulwrapdiv.scrollLeft() - width;
                    _ulwrapdiv.animate({ scrollLeft: left + 'px' });
                });

                _rotright.click(function (e) {
                    var width = outsidewidth - 10;
                    var left = _ulwrapdiv.scrollLeft() + width;
                    _ulwrapdiv.animate({ scrollLeft: left + 'px' });
                });
            }
        }

        //first and last:
        _first.click(function (e) {
            _ulwrapdiv.animate({ scrollLeft: '0px' });
            _ulwrapdiv.find('li').eq(0).click();
        });
        _last.click(function (e) {
            _ulwrapdiv.animate({ scrollLeft: insidewidth + 'px' });
            _ulwrapdiv.find('li').eq(o.count - 1).click();
        });

        //click a page
        _ulwrapdiv.find('li').click(function (e) {
            selobj.html('<a>' + selobj.find('.jPag-current').html() + '</a>');
            var currval = $(this).find('a').html();
            $(this).html('<span class="jPag-current">' + currval + '</span>');
            selobj = $(this);
            $.fn.applystyle(o, $(this).parent().parent().parent(), a_css, hover_css, _first, _ul, _ulwrapdiv, _divwrapright);
            var left = (this.offsetLeft) / 2;
            var left2 = _ulwrapdiv.scrollLeft() + left;
            var tmp = left - (outsidewidth / 2);
            if (ver == 'ie7')
                _ulwrapdiv.animate({ scrollLeft: left + tmp - _first.parent().width() + 52 + 'px' });
            else
                _ulwrapdiv.animate({ scrollLeft: left + tmp - _first.parent().width() + 'px' });
            o.onChange(currval);
        });

        var last = _ulwrapdiv.find('li').eq(o.start - 1);
        last.attr('id', 'tmp');
        var left = document.getElementById('tmp').offsetLeft / 2;
        last.removeAttr('id');
        var tmp = left - (outsidewidth / 2);
        if (ver == 'ie7') _ulwrapdiv.animate({ scrollLeft: left + tmp - _first.parent().width() + 52 + 'px' });
        else _ulwrapdiv.animate({ scrollLeft: left + tmp - _first.parent().width() + 'px' });
    }

    $.fn.applystyle = function (o, obj, a_css, hover_css, _first, _ul, _ulwrapdiv, _divwrapright) {
        obj.find('a').css(a_css);
        obj.find('span.jPag-current').css(hover_css);
        obj.find('a').hover(
					function () {
					    $(this).css(hover_css);
					},
					function () {
					    $(this).css(a_css);
					}
					);
        obj.css('padding-left', _first.parent().width() + 5 + 'px');
        insidewidth = 0;

        obj.find('li').each(function (i, n) {
            if (i == (o.display - 1)) {
                outsidewidth_tmp = this.offsetLeft + this.offsetWidth;
            }
            insidewidth += this.offsetWidth;
        })
        insidewidth += 5;
        _ul.css('width', insidewidth + 'px');
    }

})(jQuery);



