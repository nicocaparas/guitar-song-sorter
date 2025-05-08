
// ===== DATA MODULE =====
const DataModule = {
    // Load existing songs or start fresh
    songs: JSON.parse(localStorage.getItem('songs')) || [],
    
    saveSongs: function() {
      localStorage.setItem('songs', JSON.stringify(this.songs));
    },
    
    // Adds a song to the local storage
    addSong: function() {
      const newSong = {
        id: Date.now(),
        title: document.getElementById('songTitle').value.trim(),
        artist: document.getElementById('songArtist').value.trim(),
        link: document.getElementById('link').value.trim(),
        linkType: '',
        lastOpened: null
      };
      
      // Check if any required field is missing
      if (!newSong.title || !newSong.artist || !newSong.link) {
        alert("Please fill in all fields!");
        return;
      }
      
      // Automatically detect if link is YouTube or Tabs
      if (newSong.link.includes('youtube.com') || newSong.link.includes('youtu.be')) {
        newSong.linkType = 'youtube';
      } else {
        newSong.linkType = 'tabs';
      }
  
      this.songs.push(newSong);
      this.saveSongs();
      UIModule.displaySongs(this.songs);
      UIModule.clearInputs();
    },
    
    // Deletes the song from local storage
    deleteSong: function(id) {
      const index = this.songs.findIndex(s => s.id === id);
      if (index === -1) return; // safety check
      if (confirm("Delete this song?")) {
        this.songs.splice(index, 1);
        this.saveSongs();
        UIModule.displaySongs(this.songs);
      }
    },
    
    // Takes note of the most recently opened link for the filter
    openLink: function(id) {
      const song = this.songs.find(s => s.id === id);
      if (!song) return; // safety check
    
      song.lastOpened = new Date().toISOString();
      this.saveSongs();
    
      window.open(song.link, '_blank');
    },
    
    /**
    * Exports the current `songs` array as a downloadable JSON file.
    * Creates a hidden <a> element with a data URL containing the JSON string,
    * sets the filename to "songs_backup.json", triggers a download,
    * and then removes the temporary link element from the document.
    */
    exportSongs: function() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.songs));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "songs_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    },

    /**
    * Handles the import of a JSON file selected by the user.
    * Reads the file content using FileReader, parses it as JSON,
    * updates the global `songs` array, saves it, refreshes the displayed songs,
    * and shows a success or error alert.
    */
    importSongs: function(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.songs = JSON.parse(e.target.result);
          this.saveSongs();
          UIModule.displaySongs(this.songs);
          alert("Import successful!");
        } catch (err) {
          alert("Error importing file. Make sure it's a valid JSON.");
        }
      };
      reader.readAsText(file);
    }
  };
  
  // ===== UI MODULE =====
  const UIModule = {
    deleteMode: false,
    currentFilter: 'all',
    
    // Displays the songs from the list 
    displaySongs: function(list) {
      const songList = document.getElementById('songList');
      songList.innerHTML = '';
      list.forEach((song, index) => {
        const linkLabel = (song.linkType === 'youtube') ? 'YouTube' : 'Tabs';
        const item = document.createElement('li');
        item.innerHTML = `<strong>${song.title}</strong> by ${song.artist}
          [<a href="#" onclick="DataModule.openLink(${song.id})">${linkLabel}</a>]`;
  
        if (this.deleteMode) {
          item.innerHTML += ` <button onclick="DataModule.deleteSong(${song.id})">Delete</button>`;
        }
  
        songList.appendChild(item);
      });
    },
    
    // Clears the text boxes so user knows the song was saved successfully 
    clearInputs: function() {
      document.getElementById('songTitle').value = '';
      document.getElementById('songArtist').value = '';
      document.getElementById('link').value = '';
    },
    
    // Change filter button label to current filter 
    updateFilterButtonLabel: function() {
      const button = document.getElementById('filterToggleButton');
      button.innerText = `Filter: ${this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1)}`;
    },
    
    // Reveals the delete buttons for the songs
    toggleDeleteMode: function() {
      this.deleteMode = !this.deleteMode;
      this.displaySongs(DataModule.songs);
    }
  };
  
  
  
  // ===== SORT + FILTER MODULE =====
  const SortModule = {
    applyCurrentFilter: function() {
      let listToDisplay;
  
      if (UIModule.currentFilter === 'all') {
        listToDisplay = [...DataModule.songs];
      } else {
        listToDisplay = DataModule.songs.filter(song => song.linkType === UIModule.currentFilter);
      }
  
      listToDisplay.sort((a, b) => a.title.localeCompare(b.title));
      UIModule.displaySongs(listToDisplay);
      UIModule.updateFilterButtonLabel();
  
      return listToDisplay;
    },
    
    // Toggle filter through all link types
    toggleFilterByLinkType: function() {
      if (UIModule.currentFilter === 'all') {
        UIModule.currentFilter = 'youtube';
      } else if (UIModule.currentFilter === 'youtube') {
        UIModule.currentFilter = 'tabs';
      } else {
        UIModule.currentFilter = 'all';
      }
  
      this.applyCurrentFilter();
    },
    
    // Sort by alphabetical order 
    sortByName: function() {
      const filteredList = this.applyCurrentFilter();
      const sorted = [...filteredList].sort((a, b) => a.title.localeCompare(b.title));
      UIModule.displaySongs(sorted);
    },
    
    // Sort by most recently opened
    sortByLastOpened: function() {
        const filteredList = this.applyCurrentFilter();
        const sorted = [...filteredList].sort((a, b) => {
          const timeA = a.lastOpened ? new Date(a.lastOpened) : 0;
          const timeB = b.lastOpened ? new Date(b.lastOpened) : 0;
          return timeB - timeA; // Most recent first
        });
        UIModule.displaySongs(sorted);
      }
    
  };
  


  // ===== EVENT LISTENERS =====

  // Attaches a submit event listener to the addSongForm.
  // This allows the user to press the Enter key (or click the submit button) 
  // to trigger adding a new song, instead of requiring a manual button click.
  // It prevents the default form submission (page reload) and 
  // calls the addSong() function only if all fields are filled.
  document.getElementById('addSongForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const title = document.getElementById('songTitle').value.trim();
    const artist = document.getElementById('songArtist').value.trim();
    const link = document.getElementById('link').value.trim();
  
    if (title && artist && link) {
      DataModule.addSong();
    } else {
      alert('Please fill in all fields!');
    }
  });
  
  document.getElementById('importFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      DataModule.importSongs(file);
    }
  });
  


  // ===== INITIALIZATION =====
  const sortedSongs = [...DataModule.songs].sort((a, b) => a.title.localeCompare(b.title));
  UIModule.displaySongs(sortedSongs);