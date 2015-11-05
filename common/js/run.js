$(function(){
    
    $('body').removeClass('no-js');
    
    
// ---------------------------------------------------------
//
//    progress
//
//---------------------------------------------------------
    
    
//    プログレス実行
//----------------------------------------------------------
    imageProgress();
    
    
//    プログレス関数
//----------------------------------------------------------
    
    function imageProgress(){
        
        //変数の準備
        var $container = $('.progress'),
            $progressBar = $container.find('.progress-bar'),
            $progressText = $container.find('.progress-text'),
            
            //imagesLoadedライブラリで画像の読み込みを取得
            imgLoad = imagesLoaded('body'),
            imgTotal = imgLoad.images.length,
            
            //リアルタイムで取得した数値を入れる変数
            imgLoaded = 0,
            current = 0,
            
            //画像読み込み関数の実行間隔を1秒間に60回に
            progressTimer = setInterval(updateProgress, 1000 / 60);
        
        imgLoad.on('progress', function(){
            imgLoaded++;
        });
        
        function updateProgress(){
            
            var target = (imgLoaded / imgTotal) * 100;
            
            //イージングの公式
            current += (target - current) * 0.1;
            
            $progressBar.css({width: current + '%'});
            $progressText.text(Math.floor(current) + '%');
            
            if(current >= 100){
                clearInterval(progressTimer);
                $container.addClass('progress-complete');
                $progressBar.add($progressText).delay(500).animate({opacity: 0},250, function(){
                    $container.animate({top: '-100%', opacity: 0});
                });
            }
            
            if(current > 99.9){
                current = 100;
            }
            
        }
    }
    
    
// ---------------------------------------------------------
//
//    hoverEffect
//
//---------------------------------------------------------


//    hoverEffect実行
//----------------------------------------------------------
    $('.hover-effect').on('mouseenter mouseleave', 'a', hoverEffect);


//    hoverEffect関数
//----------------------------------------------------------
    
    function hoverEffect(e){
        var $overlay = $(this).find('.caption'),
            side = getMouseDirection(e),
            animateTo,
            positionIn = {
                top: '0%',
                left: '0%'
            },

            positionOut = (function(){
                switch(side){
                    case 0: return {top: '-100%', left: '0%'};
                            break;
                    case 1: return {top: '0%', left: '100%'};
                            break;
                    case 2: return {top: '100%', left: '0%'};
                            break;
                    default: return {top: '0%', left: '-100%'};
                            break;
                }
            })();

        if(e.type === 'mouseenter'){
           animateTo = positionIn;
           $overlay.css(positionOut);
           } else {
               animateTo = positionOut;
           }

        $overlay.stop(true).animate(animateTo, 250, 'easeOutExpo');
    }

    //マウスイン、マウスアウトの場所を判定。0が上、1が右、2が下、3が左
    function getMouseDirection(e){
        var $el = $(e.currentTarget),
            offset = $el.offset(),
            w = $el.outerWidth(),
            h = $el.outerHeight(),
            x = (e.pageX - offset.left - w / 2) * ((w > h)? h / w: 1),
            y = (e.pageY - offset.top - h / 2) * ((h > w)? w / h: 1),
            direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;

        return direction;
    }
    
    
// ---------------------------------------------------------
//
//    carousel
//
//---------------------------------------------------------
    
    $('.carousel').each(function(){
        
//    変数の準備
//----------------------------------------------------------
        
        var $container = $(this),
            $itemGroup = $container.find('.carousel-item'),
            $items = $itemGroup.find('li'),
            $nav = $container.find('.carousel-nav'),
            $indicator = $container.find('.carousel-indicator'),
                
            itemCount = $items.length,
            itemWidth = $itemGroup.width(),
            itemGroupWidth = itemWidth * itemCount,
            containerWidth = $container.width(),
            indicatorHTML = '',
            currentIndex = 0,
            duration = 500,
            easing = 'easeOutCirc',
            interval = 3000,
            timer;
        
        
//    tab操作
//----------------------------------------------------------
        
        //navにフォーカスが当たらないように
        $nav.children('a').attr('tabindex', -1);
        
        
//    html要素の配置、生成、挿入
//----------------------------------------------------------
        
        //アイテムの幅を各アイテムに付与
        for( var i = 0; i < itemCount; i++){
            $items.eq(i).css({'width': itemWidth});
            
            //対応するインジケーターのアンカーを生成
            indicatorHTML += '<li><a href=#><span>' + (i + 1)+ '</span></a></li>'
            //インジケーターにコンテンツを挿入
            $indicator.html(indicatorHTML);
        }
        
        //アイテムの総幅をitemGroupに付与
        $itemGroup.css({width: itemGroupWidth});
        
        
//    関数の定義
//----------------------------------------------------------
        
        //任意のアイテムを表示する関数
        function goToItem(index){
            //アイテムグループをターゲットの位置に合わせて移動
            $itemGroup.stop().animate({ 'margin-left': -100 * index + '%' },duration, easing);
            
            //現在のアイテムのインデックスを上書き
            currentIndex = index;
            
            //タブ操作制御
            $items.find('a').attr('tabindex', -1);
            $items.eq(currentIndex).find('a').attr('tabindex', 0);
            
            //ナビゲーションとインジケーターの状態を更新
            updateNav();
        }
        
        //アイテムの状態に応じてナビゲーションとインジケーターを更新する関数
        function updateNav(){
            var $navPrev = $nav.find('.prev'),
                $navNext = $nav.find('.next');
            
            //もし最初のアイテムなら Prevナビゲーションを無効に
            if(currentIndex === 0){
                $navPrev.addClass('disabled');
            } else {
                $navPrev.removeClass('disabled');
            }
            
            //もし最後のアイテムなら Nextナビゲーションを無効に
            if(currentIndex === itemCount -1){
                $navNext.addClass('disabled');
            } else {
                $navNext.removeClass('disabled');
            }
            
            //現在のインジケーターを無効に
            $indicator.find('li').removeClass('active').eq(currentIndex).addClass('active');
        }
        
        
        //タイマーを開始する関数
        function startTimer(){
            //変数 interval で設定した時間が経過するごとに処理を実行
            timer = setInterval(function(){
                
                //現在のアイテムのインデックスに応じて次に表示するアイテムの決定
                //もし最後のアイテムなら最初のアイテムへ
                var nextIndex = (currentIndex + 1) % itemCount;
                goToItem(nextIndex);
            }, interval);
        }
        
        //タイマーを停止する関数
        function stopTimer(){
            clearInterval(timer);
        }
        
        // ウィンドウリサイズ時のカルーセルの幅を制御する関数
        function Riseze(originalWidth){
            itemWidth = originalWidth.width();
            itemGroupWidth = itemWidth * itemCount;

            for( var i = 0; i < itemCount; i++){
                $items.eq(i).css({'width': itemWidth});
            }
            $itemGroup.css({width: itemGroupWidth});
        }
        
        
        
//    イベントの登録
//----------------------------------------------------------
        
        //ナビゲーションのリンクをクリックされた該当のアイテムを表示
        $nav.on('click', 'a', function(e){
            e.preventDefault();
            
            if($(this).hasClass('prev')){
                goToItem(currentIndex - 1);
            } else {
                goToItem(currentIndex + 1);
            }
        });
        
        //インジケーターのリンクがクリックされたら該当するアイテムを表示
        $indicator.on('click', 'li', function(e){
            e.preventDefault();
            
            if(!$(this).hasClass('active')){
                goToItem($(this).index());
            }
        });
        
        //イベントでマウスアウトとフォーカスインで被った時は処理を１つ解除
        $container.on('mouseenter mouseleave focusin focusout', function(e) {
            if (e.type === 'mouseenter' || e.type === 'focusin') {
                stopTimer();
            } else if (e.type === 'mouseleave' || e.type === 'focusout') {
                //マウスとフォーカスが同時に外れる時にstartTimerを二重起動させないようにstopTimerを挟む
                stopTimer();
                startTimer();
            }
        });
        
        //ウィンドウリサイズ時のイベント
        //リサイズの動作が終わった時のみ動作
        var resizeTime = null;
        
        $(window).resize(function(){
            //リサイズ中は動作停止、リサイズ後に開始
            if(resizeTime != null){
                clearTimeout(resizeTime);
            }
            resizeTime = setTimeout(function(){
                    Riseze($container);
            },100);
        });
        
        //FOUC防止（読み込み時にcssが一瞬無効になることでコンテンツがはみ出てスクロールバーが表示される。）
        $(window).trigger('resize');
        
        
        //touchEvent
        var startX,
            endX,
            diffX,
            absX,
            marginX,
            thisCount;

        $items.on({
            'touchstart': function(e){
                stopTimer();
                
                startX = e.originalEvent.changedTouches[0].pageX;
                marginX = parseInt($itemGroup.css('margin-left'));
                thisCount = $(this).index();

                
            },
            'touchmove': function(e){
                e.preventDefault();
                stopTimer();

                endX = e.originalEvent.changedTouches[0].pageX;
                diffX = Math.round(endX - startX);
                absX = Math.abs(diffX);

                //右にフリックした時、最初のアイテム以外の時は右にアイテム
                if(diffX > 0 && !(thisCount === 0)){
                    $itemGroup.css({'margin-left': marginX + absX + 'px'});
                    //左にフリックした時、最後のアイテム以外の時は右にアイテム
                } else if(diffX < 0 && !(thisCount +1 === itemCount)) {
                    $itemGroup.css({'margin-left': marginX - absX + 'px'});
                }


            },
            'touchend': function(e){
                startTimer();

                //アイテム幅の1/3以上フリックした時、アイテム
                if(absX > (itemWidth / 4)){
                    //右にフリックした時、最初のアイテム以外の時は右にアイテム
                    if(diffX > 0 && !(thisCount === 0)){
                        //左にアイテム
                        goToItem(thisCount - 1);

                        //左にフリックした時、最後のアイテム以外の時は右にアイテム
                    } else if(diffX < 0 && !(thisCount +1 === itemCount)) {
                        //右にアイテム
                        goToItem(thisCount + 1);
                    }
                    //アイテム幅の1/3以下フリックした時、元の位置にアイテム
                } else {
                    goToItem(thisCount);
                }
            }
        });
        
        
//    アイテムショーの開始
//----------------------------------------------------------
        
        //最初のアイテム表示
        goToItem(currentIndex);
                
        //タイマーをスタート
        startTimer();
        
    });
});