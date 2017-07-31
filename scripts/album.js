var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };
 var albumJebediah = {
     title: 'Springfield, USA.',
     artist: 'Jebediah Springfield',
     label: 'EMF',
     year: '1863',
     albumArtUrl: 'assets/images/neon-flora.png',
     songs: [
         { title: 'Razamataz Nation', duration: '11:01' },
         { title: 'Heathen Hemp', duration: '55:01' },
         { title: 'Founder\'s Foundry', duration: '32:21'},
         { title: 'Hate Pants', duration: '37:14' },
         { title: 'WHY.', duration: '22:15'}
     ]
 };
 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);
     var clickHandler = function() {
       var songNumber = $(this).attr('data-song-number');

       	if (currentlyPlayingSong !== null) {
       		// Revert to song number for currently playing song because user started playing new song.
       		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
       		currentlyPlayingCell.html(currentlyPlayingSong);
       	}
       	if (currentlyPlayingSong !== songNumber) {
       		// Switch from Play -> Pause button to indicate new song is playing.
       		$(this).html(pauseButtonTemplate);
       		currentlyPlayingSong = songNumber;
       	} else if (currentlyPlayingSong === songNumber) {
       		// Switch from Pause -> Play button to pause currently playing song.
       		$(this).html(playButtonTemplate);
       		currentlyPlayingSong = null;
       	}
     };
     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

      if (songNumber !== currentlyPlayingSong) {
          songNumberCell.html(playButtonTemplate);
      }
};
     var offHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

      if (songNumber !== currentlyPlayingSong) {
          songNumberCell.html(songNumber);
      }
     };
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };


 var setCurrentAlbum = function(album) {
   var $albumTitle = $('.album-view-title');
   var $albumArtist = $('.album-view-artist');
   var $albumReleaseInfo = $('.album-view-release-info');
   var $albumImage = $('.album-cover-art');
   var $albumSongList = $('.album-view-song-list');
      // #2
      $albumTitle.text(album.title);
      $albumArtist.text(album.artist);
      $albumReleaseInfo.text(album.year + ' ' + album.label);
      $albumImage.attr('src', album.albumArtUrl);

     // #3
    $albumSongList.empty();

     // #4
     for (var i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
     }
 };


// Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
// Store state of playing songs
 var currentlyPlayingSong = null;
 $(document).ready(function() {
         setCurrentAlbum(albumPicasso);

});

      var albums = [albumPicasso, albumMarconi, albumJebediah];
      var index = 1;
      albumImage.addEventListener("click", function(event) {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
          index = 0;
        }
      });
    };
    var child = document.getElementsByClassName('album-view-title')[0];
     var noParent = document.querySelector('html');
