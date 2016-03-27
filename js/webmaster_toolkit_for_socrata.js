/*
Add <script src="https://fixspd.org/js/webmaster_toolkit_for_socrata.js"></script> to your webpage
To add a count(*) add something similar to
<p>There are <span class="socrata_count" data-url="https://data.seattle.gov/resource/a4j2-uu8v.json?$select=count(*)&$where=completed_date IS NULL"></span> open Seattle Police records requests.</p>

*/
if (typeof console == "undefined") {
    this.console = {log: function() {}};
}

function updateItemWithSimpleCount(item, data) {
  var url = item.attr('data-url');    
  item.html(data[0][Object.keys(data[0])[0]]+'<i class="fa fa-info-circle info" data-toggle="popover" data-placement="bottom" title=\'<a href="'+url+'">'+url+'</a>\'></i>');
  $('[data-toggle="popover"]').popover({
  trigger: "manual",html:true
}).on("click", function(e) {
  e.preventDefault();
}).on("mouseenter", function() {
  var _this = this;
  $(this).popover("show");
  $(this).siblings(".popover").on("mouseleave", function() {
    $(_this).popover('hide');
  });
}).on("mouseleave", function() {
  var _this = this;
  setTimeout(function() {
    if (!$(".popover:hover").length) {
      $(_this).popover("hide")
    }
  }, 100);
});    
}

function handleSimpleCount() {
  $.each($('.socrata_count'), function(item) {
    console.log($(this).attr('data-url'))
    var socrataUrl = $(this).attr('data-url');
    var item = $(this)
    $.get(socrataUrl, function(data) {
      updateItemWithSimpleCount(item, data);
    });
  });
  
}

function handleSimpleCountsSum() {
  $.each($('.socrata_sum_of_counts'), function(item) {
    console.log($(this).attr('data-urls'))
    var socrataUrls = $(this).attr('data-urls');
    var item = $(this);
    var total = 0;
    $.each(socrataUrls.split(';'), function(i, url) {
        var data = JSON.parse($.ajax({
            type: "GET",
            url: url,
            async: false
        }).responseText);
        total += parseInt(data[0][Object.keys(data[0])[0]]);
    });
    item.html(total+'<i class="fa fa-info-circle info"></i>');
  });
}
function pieChart(item) {
    url = 'https://'+item.attr('data-domain')+'/resource/'+item.attr('data-datasetid')+'.json?$select=count(*) as count';
    var data = JSON.parse($.ajax({
        type: "GET",
        url: url,
        async: false
    }).responseText);
    var total = data[0]['count'];
    url = 'https://'+item.attr('data-domain')+'/resource/'+item.attr('data-datasetid')+'.json?$select=CASE('+item.attr('data-column')+' IS NULL,%27Unknown%27,'+item.attr('data-column')+' IS NOT NULL,'+item.attr('data-column')+') as column,count(*) as count,count(*)/'+total+'*100 as percentage&$group='+item.attr('data-column')+'&$order=percentage DESC';
    var data = JSON.parse($.ajax({
        type: "GET",
        url: url,
        async: false
    }).responseText);
    
    var infoHtml = '<i class="fa fa-info-circle info" data-toggle="popover" data-placement="bottom" title=\'<a href="'+url+'">'+url+'</a>\'></i>'
    item.append('<h3>'+item.attr('data-heading')+infoHtml+'</h3><canvas></canvas><div class="chart-legend small"></div>')
    var ctx = item.find('canvas').get(0).getContext("2d");
    chartData = [];
    $.each(data, function(i,v) {
        
        chartData.push( {
          value : parseInt(v['count']),
          percentage : Math.round(parseFloat(v['percentage'])),
          label : v['column'],
          color: window.colors[i],
          highlight: window.highlightColors[i]
        }) ;
    });
    var options = { legendTemplate : '<ul>'
                  +'<% for (var i=0; i<chartData.length; i++) { %>'
                    +'<li>'
                    +'<span style=\"background-color:<%=chartData[i].color%>\"></span>'
                    +'<% if (chartData[i].label) { %><%= chartData[i].label %><% } %>'
                    +'<% if (chartData[i].percentage) { %> <%= chartData[i].percentage %>%<% } %>'
                    +'<% if (chartData[i].value) { %> (<%= chartData[i].value %>/<%= total %>)<% } %>'
                    
                  +'</li>'
                +'<% } %>'
              +'</ul>'
  } ;
    console.log(JSON.stringify(chartData))
    var myChart = new Chart(ctx).Pie(chartData,options);
    item.find('.chart-legend').html(myChart.generateLegend());
}
function table_of_boolean_percentages(item) {
    url = 'https://'+item.attr('data-domain')+'/resource/'+item.attr('data-datasetid')+'.json?$select=count(*) as count';
    var data = JSON.parse($.ajax({
        type: "GET",
        url: url,
        async: false
    }).responseText);
    var total = parseInt(data[0]['count']);
    var html = '<table class="table small">';
    var labels = item.attr('data-labels').split(',');
    $.each(item.attr('data-columns').split(','), function(i, v){
        url = 'https://'+item.attr('data-domain')+'/resource/'+item.attr('data-datasetid')+'.json?$select=count(*) as count&'+v+'='+item.attr('data-trueis');
        var data = JSON.parse($.ajax({
            type: "GET",
            url: url,
            async: false
        }).responseText);    
        html += '<tr><th>'+labels[i]+'</th><td>'+Math.round(parseInt(data[0]['count'])/total*100)+'% ('+data[0]['count']+'/'+total+')</td></tr>';
    })
    html += '</table>';
    item.html(html);
}
function handleSODAPlayground() {
  $.each($('.sodaplayground'), function(item) {
    switch ($(this).attr('data-type')) {
        case "pie_chart":
            pieChart($(this));
            break;
        case "table_of_boolean_percentages":
            table_of_boolean_percentages($(this));
            break;
    }   
  }); 
}
function main() {
    window.colors = [];
    window.highlightColors = [];
    for (var i=0;i<100;i++) {
        r = Math.floor(Math.random() * 200);
        g = Math.floor(Math.random() * 200);
        b = Math.floor(Math.random() * 200);
        c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        h = 'rgb(' + (r+20) + ', ' + (g+20) + ', ' + (b+20) + ')';
        window.colors.push(c);
        window.highlightColors.push(h)
    }
    var plugins = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js'];
    setTimeout(function(){var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function(obj){
  var self = obj instanceof this.constructor ?
    obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
  var container, timeout;

  originalLeave.call(this, obj);

  if(obj.currentTarget) {
    container = $(obj.currentTarget).siblings('.popover')
    timeout = self.timeout;
    container.one('mouseenter', function(){
      //We entered the actual popover – call off the dogs
      clearTimeout(timeout);
      //Let's monitor popover content instead
      container.one('mouseleave', function(){
        $.fn.popover.Constructor.prototype.leave.call(self, self);
      });
    })
  }
};}, 1000);
    $.each(plugins, function(i,url){
        if (url.endsWith('.js')) {
            var script = document.createElement("SCRIPT");
            script.src = url;
            script.type = 'text/javascript';
            document.getElementsByTagName("head")[0].appendChild(script);
        } else  {
            $('head').append('<link rel="stylesheet" type="text/css" href="'+url+'">');
        }
    })
    setTimeout(function(){handleSimpleCount();
    handleSimpleCountsSum();handleSODAPlayground();},1000)
    
    
    


}

if (!window.jQuery) {
// Anonymous "self-invoking" function
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };

    // Start polling...
    checkReady(function($) {
        main();
    });
})();
} else {
    main();
}
