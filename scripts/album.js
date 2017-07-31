var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber+ '">' + (songNumber + 1) + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

    var clickHandler = function() {
         var songItem = $(this).attr('data-song-number');

         if(currentlyPlayingSongNumber !== null) {
             var currentlyPlaying = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
             currentlyPlaying.html(currentlyPlayingSongNumber + 1);

         }

          if (currentlyPlayingSongNumber !== songItem) {
             $(this).html(pauseButtonTemplate);
             setSong(songItem)
             currentSoundFile.play()
             updatePlayerBarSong();


         } else if (currentlyPlayingSongNumber === songItem) {
             if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
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

};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true,
        loop: false
    });
     setVolume(currentVolume);
 };

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};


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
