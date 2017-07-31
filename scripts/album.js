var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber+ '">' + (songNumber + 1) + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     $(".song-item-number")

    var clickHandler = function() {
         var $volumeFill = $('.volume .fill');
         var $volumeThumb = $('.volume .thumb');
         var volumeSeekBar = $("seek-bar:eq(1)");
         var songItem = $(this).attr('data-song-number');

         if(currentlyPlayingSongNumber !== null) {
             var currentlyPlaying = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
             currentlyPlaying.html(currentlyPlayingSongNumber + 1);

         }

          if (currentlyPlayingSongNumber !== songItem) {
             $(this).html(pauseButtonTemplate);
             setSong(songItem)
             currentSoundFile.play();

             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});

             updatePlayerBarSong();
             updateSeekBarWhileSongPlays();

             $('.main-controls .play-pause').html(playerBarPauseButton);

         } else if (currentlyPlayingSongNumber === songItem) {
             if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
             }
             else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
             }
         }
     };

     var onHover = function(event) {
         var songItem = $(this).find('.song-item-number');
         var songItemNumber = songItem.attr('data-song-number');

         if(parseInt(songItemNumber) !== currentlyPlayingSongNumber) {
             songItem.html(playButtonTemplate);
         }

         };


     var offHover = function(event) {
         var songItem = $(this).find('.song-item-number');
         var songItemNumber = songItem.attr('data-song-number');

         if(parseInt(songItemNumber) !== currentlyPlayingSongNumber) {
             songItem.html(parseInt(songItemNumber) + 1);
         }

     };


     $row.find('.song-item-number').click(clickHandler);

     $row.hover(onHover, offHover);

     return $row;

 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;

     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

var nextSong = function () {
    var albumLength = (currentAlbum.songs).length;
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    // Current song is becoming the previous song
    var prevSongIndex = currentSongIndex;
    var nextSongIndex = currentSongIndex + 1;

    if (nextSongIndex === albumLength) {
        nextSongIndex = 0;
    }

    var nextSong = currentAlbum.songs[nextSongIndex];
    setSong(nextSongIndex)

    $('.currently-playing .song-name').text(nextSong.title);
    $('.currently-playing .artist-name').text(nextSong.artist);
    $('.currently-playing .artist-song-mobile').text(nextSong.title + " - " + nextSong.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);


    var $prevSongItem = getSongNumberCell(prevSongIndex);
    var $nextSongItem = getSongNumberCell(currentlyPlayingSongNumber);

    $nextSongItem.html(pauseButtonTemplate);

    $prevSongItem.html(prevSongIndex + 1);

    currentSoundFile.play();
    updateSeekBarWhileSongPlays();


}

var previousSong = function () {
    var albumLength = (currentAlbum.songs).length;
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    var prevSongIndex = currentSongIndex -1;

    if (prevSongIndex == -1) {
        prevSongIndex = (albumLength - 1);
    }

    var prevSong = currentAlbum.songs[prevSongIndex];
    setSong(prevSongIndex);

    $('.currently-playing .song-name').text(prevSong.title);
    $('.currently-playing .artist-name').text(prevSong.artist);
    $('.currently-playing .artist-song-mobile').text(prevSong.title + " - " + prevSong.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);


    var $prevSongItem = getSongNumberCell(prevSongIndex);
    var $lastSongItem = getSongNumberCell(currentSongIndex);

    $prevSongItem.html(pauseButtonTemplate);

    $lastSongItem.html(currentSongIndex + 1);

    currentSoundFile.play();
    updateSeekBarWhileSongPlays();


};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
     setVolume(currentVolume);
 };

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {

    currentSoundFile.bind('timeupdate', function(event) {
        var seekBarFillRatio = this.getTime() / this.getDuration();

        var $seekBar = $('.seek-control .seek-bar');

        updateSeekPercentage($seekBar, seekBarFillRatio);

        setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
     });
 }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        }
        else {
            setVolume(seekBarFillRatio * 100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
 });
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            }
            else {
                setVolume(seekBarFillRatio);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });


        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
     });
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.current-time').text(currentTime);
}

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').text(totalTime);
}

var filterTimeCode = function(timeInSeconds) {
    var seconds = parseFloat(timeInSeconds);
    var wholeSeconds = Math.floor(seconds);
    var wholeMinutes = Math.floor(seconds / 60);
    var remainingSeconds = (wholeSeconds % 60);

    var time = wholeMinutes + ":" + remainingSeconds;

    if (remainingSeconds < 10) {
        time = wholeMinutes + ":" + 0 + remainingSeconds;
    }
    return time;

}



var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';

var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);

    $nextButton.click(nextSong);

    $playPauseButton.click(toggleFromPlayerBar);

});


var toggleFromPlayerBar = function() {
      var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
//    var $currentlyPlaying = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');


    if(currentSoundFile.isPaused()) {
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    }
    else if (currentSoundFile) {
        $currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
}
