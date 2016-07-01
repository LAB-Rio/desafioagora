
( function($) { //Anon start

$(document).ready(function() {

    widgetGenerator.init(); //initialize widgetgenerator

    if (typeof Clipboard !=='undefined') {
        new Clipboard('.copyToClipboardBtn');

        $( ".copyToClipboardBtn" ).click(function() {

            $('.copy_to_clipboard_msg').show(0).delay(5000).hide(0);

        });
    }

    $.get("/widget/admin_widgetKey", function(data, status){

        generatedwKey = encodeURIComponent(data);

    });

    //Get Selected Idea Challenge
     $('select#selectChallenge').on('change', function() {
       widgetGenerator.startLoading();
       currentWidgetIdeaChallenge = $("#selectChallenge").val();
       widgetGenerator.generatePreview();
       widgetGenerator.endLoading();

     });

     //Dynamically change css classes

     $("<style type='text/css'>.active-step, button.pulseme { background-color:#"+buttonBackgroundColor+" !important; color:#"+buttonTextColor+" !important;} .active-step:after, .active:after { border-left: 15px solid #"+buttonBackgroundColor+" !important; color:#"+buttonTextColor+" !important;}</style>").appendTo("#widgetGenerator");

     $("<style type='text/css'> .active-step { background-color:#"+buttonBackgroundColor+" !important; color:#"+buttonTextColor+" !important;} </style>").appendTo("#widgetGenerator");


     $("<style type='text/css'> .selectWidgetTypeBox:hover{ background-color:#"+buttonBackgroundColor+" !important; color:#"+buttonTextColor+" !important;} </style>").appendTo("#widgetGenerator");

     $("<style type='text/css'> .active-step::before, active::before { border-bottom: 20px solid #"+buttonBackgroundColor+" !important; border-top: 20px solid #"+buttonBackgroundColor+" !important; color:#"+buttonTextColor+" !important;} </style>").appendTo("#widgetGenerator");

});

} ) ( jQuery ); //Anon end

var widgetGenerator = {

    settings: {
    	baseUrl: '/',
    	widgetCssUrl: communityUrl+'w/_iframewidget/css/widget-themes.css',
    	defaultThemeClass: 'green-theme',
    	widgetExternalUrl: communityUrl+'w/_iframewidget/widget.html',
    	widgetTypes : ['leaderboard', 'activity', 'idea'],
      widgetWrapperHtml: '<div id="cwd-widget-container"></div>',
      widgetListenerCode: '<script type="text/javascript">window.addEventListener("message",function(e){document.getElementById("cwd-widget-container").innerHTML=e.data},false);</script>',
      wUrl: communityUrl,
      systemBgColor: buttonBackgroundColor,
      systemTextColor: buttonTextColor,
      systemLinkColor: linkColor,
      loadingGifUrl: communityUrl+'w/_iframewidget/images/loading.gif'

    },

    init: function() {

        this.setActiveStep('1');
        this.clearInlineStyles();

        jQuery('#cwd-widget-iframe').show();
        jQuery('#ideaChallengeSelectList').hide(); //Hide this by default
        jQuery('#widgetPreview #cwd-widget-container').addClass(this.settings.defaultThemeClass);
        jQuery('i.default').css('color','#'+this.settings.systemBgColor);

        jQuery('.widget-poweredby').css('background-color','#'+this.settings.systemBgColor);

        this.addDefaultThemeInlineSystemCss();

        this.pulseEffect();

    },

    clearInlineStyles: function() {

      jQuery('#widgetPreview #cwd-widget-container').attr('style','');

    },

    pulseEffect: function() {

        jQuery(".pulseme").hover(function() {

          jQuery(this).removeClass('animated pulse');
          jQuery(this).addClass('animated pulse');

        });

        jQuery(".pulseme").mouseleave(function() {

          jQuery(this).removeClass('animated pulse');


        });

    },


    setActiveStep: function(step) {

        jQuery("[id^='progress-step-']").removeClass('active-step');
        jQuery('.section-1, .section-2, .section-3').show();

        if (step == '1') {

            jQuery('#progress-step-1').addClass('active-step');
            jQuery('.section-2, .section-3').hide();

        } else

        if (step == '2') {

            jQuery('#progress-step-2').addClass('active-step');
            jQuery('.section-1, .section-3').hide();

        } else

        if (step == '3') {

            jQuery('#progress-step-3').addClass('active-step');
            jQuery('.section-1, .section-2').hide();

        }

    },

    encodeEntities: function(string) {

      return jQuery("<div/>").text(string).html();

    },

    dencodeEntities: function(string) {

      return jQuery("<div/>").html(string).text();

    },

    selectWidgetType: function(widgetType) {

      this.startLoading();

      this._widgetType = widgetType;

      if (this._widgetType == 'leaderboard') {

          jQuery('#widgetPreview').prepend('<link rel="stylesheet" type="text/css" href="https://'+widgetDomain+'/_iframewidget/css/leaderboard-widget.css">');

      } else if (this._widgetType == 'activity') {

        jQuery('#widgetPreview').prepend('<link rel="stylesheet" type="text/css" href="https://'+widgetDomain+'/_iframewidget/css/activity-widget.css">');

      } else if (this._widgetType == 'idea') {

        jQuery('#widgetPreview').prepend('<link rel="stylesheet" type="text/css" href="https://'+widgetDomain+'/_iframewidget/css/idea-widget.css">');
        jQuery('#ideaChallengeSelectList').show();

      }

      jQuery('.widgetCodeHolder').html(this._widgetType);
      this.setActiveStep('2');
      this.generatePreview();

      this.endLoading();

    },

    selectThemeColor: function(themeColorClassName) {

      this._themeColorClassName = themeColorClassName;

        this.clearInlineStyles();

        jQuery('.widgetCodeHolder').html(this._themeColorClassName);
        jQuery('#widgetPreview #cwd-widget-container').removeClass();
        jQuery('#widgetPreview #cwd-widget-container').addClass(this._themeColorClassName);

    },

    generateWidgetCode: function() {


      this.setActiveStep('3');

      cssLink = '<link rel="stylesheet" type="text/css" href="'+this.settings.widgetCssUrl+'">';

      if (this._themeColorClassName === 'undefined') {
          this._themeColorClassName = this.settings.defaultThemeClass;
      }

      dataWrapper = '<div id="cwd-widget-container" class="'+this._widgetType+' '+this._themeColorClassName+'"></div>';

      previewIframeSrc = jQuery('#cwd-widget-iframe').attr('src');

      iframe = '<iframe id="cwd-widget-iframe" style="display:none;" src="'+previewIframeSrc+'"></iframe>';
      listener = "<script type='text/javascript'>window.addEventListener('message',function(e){document.getElementById('cwd-widget-container').innerHTML=e.data},false);</script>";

      cssLink = this.encodeEntities(cssLink);
      dataWrapper = this.encodeEntities(dataWrapper);
      iframe = this.encodeEntities(iframe);
      listener = this.encodeEntities(listener);

      widgetCode = cssLink + '<br>' + dataWrapper + '<br>' + iframe + '<br>' + listener;

      jQuery('.widgetCodeHolder').html(widgetCode);

    },

    generatePreview: function() {

      if (this._widgetType != 'idea') {
        currentWidgetIdeaChallenge = '0';
      }

      if ((this._themeColorClassName = 'undefined') || (this._themeColorClassName = '')) {
          this._themeColorClassName = this.settings.defaultThemeClass;
      }



        if(typeof currentWidgetIdeaChallenge !== 'undefined') {
            previewIframeSrc = this.settings.widgetExternalUrl+'?wKey='+generatedwKey+'&wType='+this._widgetType+'&wUrl='+this.settings.wUrl+'&wName='+communityName+'&wChallenge='+currentWidgetIdeaChallenge+'&phImg='+cdnUrl+'profile_counter43.png';
        }
        else {
            previewIframeSrc = '';
        }
        
        jQuery("#cwd-widget-iframe").attr("src", previewIframeSrc);

        this.addDefaultThemeInlineSystemCss();

        jQuery("#cwd-widget-container").css('border-color','#'+this.settings.systemBgColor);

         //document.getElementById('cwd-widget-iframe').contentWindow.location.reload();

    },

    generateNewWidget: function() {

        jQuery("#cwd-widget-iframe").attr("src", "");
        this.startLoading();
        this.setActiveStep('1');
        jQuery('#ideaChallengeSelectList').hide();
        this.endLoading();


    },

    startLoading: function() {

      jQuery('#loading').show();

    },

    endLoading: function() {
      jQuery('#loading').show(0).delay(2000).hide(0);
    },

    addDefaultThemeInlineSystemCss: function() {

        if (this._themeColorClassName = 'default-theme') {

          jQuery("#cwd-widget-container").css({
            'border-color': "#"+this.settings.systemBgColor,
            'color':'#'+this.settings.systemBgColor});

          jQuery(".widget-poweredby").css({
            'background-color': "#ff0000 !important",
            'color':'#'+buttonTextColor});


        }

    }

};
